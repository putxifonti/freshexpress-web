// src/lib/auth.ts - Utilitats d'autenticació
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { queryOperacional, queryBroker } from './db';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'freshexpress_secret_key_2024_eco';
const JWT_EXPIRES_IN = '7d';

// Interfícies
export interface User {
  id: number;
  email: string;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
  fecha_nacimiento?: Date;
  fecha_registro?: Date;
  ultimo_login?: Date;
  estado: string;
  rol?: 'admin' | 'cliente' | 'repartidor';
  hash_anonimizacion?: string;
  preferencias?: object;
  consentimiento_databroker?: boolean;
  consentimiento_analytics?: boolean;
  consentimiento_marketing?: boolean;
}

export interface JWTPayload {
  userId: number;
  email: string;
  nombre: string;
}

export interface RegisterData {
  nombre: string;
  apellidos?: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  direccion_envio?: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
  fecha_nacimiento?: string;
  consentimiento_databroker?: boolean;
  consentimiento_analytics?: boolean;
  consentimiento_marketing?: boolean;
  consentimiento_newsletter?: boolean;
}

// Hash de contrasenya
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Verificar contrasenya
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generar JWT
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    nombre: user.nombre
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verificar JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Generar hash d'anonimització
export function generateAnonymousHash(userId: number): string {
  const randomPart = uuidv4();
  const timestamp = Date.now();
  const data = `${userId}_FRESHEXPRESS_ECO_2024_${randomPart}_${timestamp}`;
  
  // Usem SHA-256 via crypto
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Registrar usuari
export async function registerUser(data: RegisterData): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    // Verificar si l'email ja existeix
    const existingUsers = await queryOperacional<any[]>(
      'SELECT id FROM usuarios WHERE email = ?',
      [data.email]
    );
    
    if (existingUsers.length > 0) {
      return { success: false, error: 'Aquest email ja està registrat' };
    }

    // Verificar si és el primer usuari (serà admin)
    const userCount = await queryOperacional<any[]>(
      'SELECT COUNT(*) as count FROM usuarios'
    );
    const isFirstUser = userCount[0]?.count === 0;

    // Hash de la contrasenya
    const passwordHash = await hashPassword(data.password);
    
    // Preparar preferències per defecte
    const preferencias = JSON.stringify({
      sin_plastico: false,
      envase_reciclable: true,
      productos_eco: true,
      vegano: false,
      km0: true,
      dieta: null,
      alergias: []
    });

    // Insertar usuari
    const result = await queryOperacional<any>(
      `INSERT INTO usuarios (
        email, password_hash, nombre, apellidos, telefono,
        direccion, ciudad, provincia, codigo_postal, fecha_nacimiento,
        estado, preferencias
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo', ?)`,
      [
        data.email,
        passwordHash,
        data.nombre,
        data.apellidos || null,
        data.telefono || null,
        data.direccion || data.direccion_envio || null,
        data.ciudad || null,
        data.provincia || null,
        data.codigo_postal || null,
        data.fecha_nacimiento || null,
        preferencias
      ]
    );

    const userId = result.insertId;
    
    // Si és el primer usuari, fer-lo admin (si la columna existeix)
    if (isFirstUser) {
      try {
        await queryOperacional('UPDATE usuarios SET rol = ? WHERE id = ?', ['admin', userId]);
        console.log('Primer usuari registrat com a ADMIN');
      } catch {
        // La columna rol no existeix, ignorem
        console.log('Primer usuari registrat (sense columna rol)');
      }
    }

    // Generar hash d'anonimització si té consentiment
    let hashAnonimizacion = null;
    if (data.consentimiento_databroker) {
      hashAnonimizacion = generateAnonymousHash(userId);
      
      // Actualitzar usuari amb el hash
      await queryOperacional(
        'UPDATE usuarios SET hash_anonimizacion = ? WHERE id = ?',
        [hashAnonimizacion, userId]
      );

      // Crear registre a la BD del data broker
      await queryBroker(
        `INSERT INTO datos_anonimos (
          hash_usuario, zona_ciudad, nivel_compromiso_eco, fecha_anonimizacion
        ) VALUES (?, ?, 'medio', NOW())`,
        [hashAnonimizacion, data.ciudad ? `${data.ciudad}-${(data.codigo_postal || 'XX').substring(0, 2)}` : 'Desconocida-XX']
      );
    }

    // Registrar consentiments
    await queryOperacional(
      `INSERT INTO consentimientos (
        usuario_id, consentimiento_data_broker, consentimiento_newsletter,
        consentimiento_marketing, consentimiento_analitica
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        data.consentimiento_databroker || false,
        data.consentimiento_newsletter || false,
        data.consentimiento_marketing || false,
        data.consentimiento_analytics || true
      ]
    );

    // Obtenir usuari complet
    const users = await queryOperacional<User[]>(
      'SELECT id, email, nombre, apellidos, telefono, ciudad, estado, fecha_registro FROM usuarios WHERE id = ?',
      [userId]
    );

    const user = users[0];
    const token = generateToken(user);

    return { success: true, user, token };
  } catch (error: any) {
    console.error('Error registrant usuari:', error);
    return { success: false, error: 'Error al registrar l\'usuari' };
  }
}

// Login usuari
export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const users = await queryOperacional<any[]>(
      'SELECT * FROM usuarios WHERE email = ? AND estado = "activo"',
      [email]
    );

    if (users.length === 0) {
      return { success: false, error: 'Credencials incorrectes' };
    }

    const user = users[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return { success: false, error: 'Credencials incorrectes' };
    }

    // Actualitzar últim login
    await queryOperacional(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generar token
    const token = generateToken(user);

    // Retornar usuari sense password_hash
    const { password_hash, ...safeUser } = user;
    
    return { success: true, user: safeUser, token };
  } catch (error: any) {
    console.error('Error al login:', error);
    return { success: false, error: 'Error al iniciar sessió' };
  }
}

// Obtenir usuari per ID
export async function getUserById(userId: number): Promise<User | null> {
  try {
    const users = await queryOperacional<any[]>(
      `SELECT u.id, u.email, u.nombre, u.apellidos, u.telefono, u.direccion, u.ciudad, 
              u.provincia, u.codigo_postal, u.fecha_nacimiento, u.estado, u.rol,
              u.hash_anonimizacion, u.preferencias, u.fecha_registro, u.ultimo_login,
              c.consentimiento_data_broker as consentimiento_databroker,
              c.consentimiento_analitica as consentimiento_analytics,
              c.consentimiento_marketing
       FROM usuarios u
       LEFT JOIN consentimientos c ON u.id = c.usuario_id
       WHERE u.id = ?`,
      [userId]
    );
    return users.length > 0 ? users[0] : null;
  } catch {
    return null;
  }
}

// Obtenir consentiments d'un usuari
export async function getUserConsents(userId: number) {
  try {
    const consents = await queryOperacional<any[]>(
      'SELECT * FROM consentimientos WHERE usuario_id = ?',
      [userId]
    );
    return consents.length > 0 ? consents[0] : null;
  } catch {
    return null;
  }
}

// Actualitzar consentiments
export async function updateUserConsents(userId: number, consents: {
  data_broker?: boolean;
  newsletter?: boolean;
  marketing?: boolean;
  analitica?: boolean;
}) {
  try {
    await queryOperacional(
      `UPDATE consentimientos SET 
        consentimiento_data_broker = COALESCE(?, consentimiento_data_broker),
        consentimiento_newsletter = COALESCE(?, consentimiento_newsletter),
        consentimiento_marketing = COALESCE(?, consentimiento_marketing),
        consentimiento_analitica = COALESCE(?, consentimiento_analitica),
        fecha_actualizacion = NOW()
       WHERE usuario_id = ?`,
      [
        consents.data_broker,
        consents.newsletter,
        consents.marketing,
        consents.analitica,
        userId
      ]
    );
    return true;
  } catch {
    return false;
  }
}
