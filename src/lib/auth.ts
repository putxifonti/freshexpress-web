/**
 * ═══════════════════════════════════════════════════════════════════
 * AUTHENTICATION & AUTHORIZATION MODULE
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Gestiona tota l'autenticació i autorització de l'aplicació:
 * - Hash de contrasenyes amb bcrypt
 * - Generació i verificació de tokens JWT
 * - Registre i login d'usuaris
 * - Gestió de consentiments (RGPD)
 * - Anonimització de dades per al data broker
 * 
 * SEGURETAT:
 * - Bcrypt amb cost factor 12 per hash de passwords
 * - JWT amb expiració de 7 dies
 * - SHA-256 per anonimització irreversible
 * 
 * @module lib/auth
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { queryOperacional, queryBroker } from './db';

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS DE CONFIGURACIÓ
// ═══════════════════════════════════════════════════════════════════

/** Secret per signar tokens JWT (carregat des de .env) */
const JWT_SECRET = import.meta.env.JWT_SECRET || 'development_only_change_me';

/** Temps d'expiració dels tokens JWT (7 dies) */
const JWT_EXPIRES_IN = '7d';

// ═══════════════════════════════════════════════════════════════════
// INTERFÍCIES TYPESCRIPT
// ═══════════════════════════════════════════════════════════════════

/**
 * Interfície que representa un usuari del sistema
 */
export interface User {
  id: number;
  email: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  fecha_registro?: Date;
  ultimo_login?: Date;
  estado: string;
  activo?: boolean;
  rol?: 'admin' | 'cliente' | 'repartidor';
  hash_anonimizacion?: string;
  consentimiento_databroker?: boolean;
  consentimiento_analytics?: boolean;
  consentimiento_marketing?: boolean;
}

/**
 * Payload del token JWT
 * Conté la informació mínima necessària per identificar l'usuari
 */
export interface JWTPayload {
  userId: number;
  email: string;
  nombre: string;
}

/**
 * Dades necessàries per registrar un nou usuari
 */
export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  direccion_envio?: string;
  ciudad?: string;
  codigo_postal?: string;
  acepta_terminos?: boolean;
  acepta_privacitat?: boolean;
  compartir_datos?: boolean;
  analytics?: boolean;
  acepta_comunicaciones?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// FUNCIONS DE HASH I VERIFICACIÓ DE CONTRASENYES
// ═══════════════════════════════════════════════════════════════════

/**
 * Genera un hash segur de la contrasenya utilitzant bcrypt.
 * Utilitza un cost factor de 12 per equilibrar seguretat i rendiment.
 * 
 * @param password - Contrasenya en text pla
 * @returns Promesa amb el hash de la contrasenya
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12); // Cost factor 12
  return bcrypt.hash(password, salt);
}

/**
 * Verifica si una contrasenya coincideix amb el seu hash.
 * 
 * @param password - Contrasenya en text pla a verificar
 * @param hash - Hash emmagatzemat a la base de dades
 * @returns True si la contrasenya és correcta, false altrament
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ═══════════════════════════════════════════════════════════════════
// FUNCIONS DE GESTIÓ DE TOKENS JWT
// ═══════════════════════════════════════════════════════════════════

/**
 * Genera un token JWT per a un usuari autenticat.
 * El token expira en 7 dies per defecte.
 * 
 * @param user - Objecte usuari amb les dades bàsiques
 * @returns Token JWT signat
 */
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    nombre: user.nombre
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifica i descodifica un token JWT.
 * 
 * @param token - Token JWT a verificar
 * @returns Payload del token si és vàlid, null si és invàlid o ha expirat
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null; // Token invàlid o expirat
  }
}

// ═══════════════════════════════════════════════════════════════════
// DATA BROKER - ANONIMITZACIÓ DE DADES
// ═══════════════════════════════════════════════════════════════════

/**
 * Genera un hash d'anonimització irreversible per al data broker.
 * Utilitza SHA-256 amb components aleatoris per garantir la unicitat
 * i impossibilitar la reversió a les dades originals.
 * 
 * IMPORTANT: Aquest hash compleix amb el RGPD ja que no permet
 * identificar l'usuari original.
 * 
 * @param userId - ID de l'usuari a anonimitzar
 * @returns Hash SHA-256 únic i irreversible
 */
export function generateAnonymousHash(userId: number): string {
  const randomPart = uuidv4();           // Component aleatori UUID
  const timestamp = Date.now();          // Timestamp actual
  const data = `${userId}_FRESHEXPRESS_ECO_2024_${randomPart}_${timestamp}`;
  
  // SHA-256 irreversible
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(data).digest('hex');
}

// ═══════════════════════════════════════════════════════════════════
// FUNCIONS DE REGISTRE I LOGIN
// ═══════════════════════════════════════════════════════════════════

/**
 * Registra un nou usuari al sistema.
 * 
 * PROCÉS:
 * 1. Verifica que l'email no existeixi
 * 2. Hash de la contrasenya amb bcrypt
 * 3. Insereix l'usuari a la BD
 * 4. Si és el primer usuari, el fa admin
 * 5. Si ha donat consentiment, genera hash d'anonimització
 * 6. Registra els consentiments RGPD
 * 7. Genera token JWT i retorna l'usuari
 * 
 * @param data - Dades del nou usuari
 * @returns Objecte amb success, user i token, o error
 */
export async function registerUser(data: RegisterData): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    // 1. Verificar si l'email ja existeix
    const existingUsers = await queryOperacional<any[]>(
      'SELECT id FROM usuarios WHERE email = ?',
      [data.email]
    );
    
    if (existingUsers.length > 0) {
      return { success: false, error: 'Aquest email ja està registrat' };
    }

    // 2. Verificar si és el primer usuari (serà admin automàticament)
    const userCount = await queryOperacional<any[]>(
      'SELECT COUNT(*) as count FROM usuarios'
    );
    const isFirstUser = userCount[0]?.count === 0;

    // 3. Hash de la contrasenya amb bcrypt (cost 12)
    const passwordHash = await hashPassword(data.password);

    // 4. Insertar nou usuari a la base de dades
    const result = await queryOperacional<any>(
      `INSERT INTO usuarios (
        email, password, nombre, telefono,
        direccion, ciudad, codigo_postal, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'activo')`,
      [
        data.email,
        passwordHash,
        data.nombre,
        data.telefono || null,
        data.direccion || data.direccion_envio || null,
        data.ciudad || null,
        data.codigo_postal || null
      ]
    );

    const userId = result.insertId;
    
    // 5. Si és el primer usuari, fer-lo administrador
    if (isFirstUser) {
      try {
        await queryOperacional('UPDATE usuarios SET rol = ? WHERE id = ?', ['admin', userId]);
      } catch {
        // La columna rol pot no existir en totes les versions de la BD
      }
    }

    // 6. Generar hash d'anonimització si ha donat consentiment per al data broker
    let hashAnonimizacion = null;
    if (data.compartir_datos) {
      try {
        hashAnonimizacion = generateAnonymousHash(userId);
        
        // Actualitzar usuari amb el hash
        await queryOperacional(
          'UPDATE usuarios SET hash_anonimizacion = ? WHERE id = ?',
          [hashAnonimizacion, userId]
        );

        // Crear registre a la BD del data broker (si existeix)
        try {
          await queryBroker(
            `INSERT INTO datos_anonimos (
              hash_usuario, codigo_postal_prefijo, nivel_compromiso_eco
            ) VALUES (?, ?, 'medio')`,
            [hashAnonimizacion, data.codigo_postal ? data.codigo_postal.substring(0, 3) : null]
          );
        } catch {
          // Data broker opcional - no aturar el registre si falla
        }
      } catch (hashError) {
        // Error generant hash - continuar igualment
      }
    }

    // 7. Registrar consentiments RGPD
    try {
      await queryOperacional(
        `INSERT INTO consentimientos (
          usuario_id, acepta_terminos, acepta_privacidad, acepta_cookies,
          acepta_comunicaciones, compartir_datos, analytics
        ) VALUES (?, 1, 1, 1, ?, ?, ?)`,
        [
          userId,
          data.acepta_comunicaciones || false ? 1 : 0,
          data.compartir_datos || false ? 1 : 0,
          data.analytics !== false ? 1 : 0
        ]
      );
    } catch {
      // Consentiments opcionals - continuar si falla
    }

    // 8. Obtenir usuari complet registrat
    const users = await queryOperacional<User[]>(
      'SELECT id, email, nombre, telefono, ciudad, estado, fecha_registro, rol FROM usuarios WHERE id = ?',
      [userId]
    );

    const user = users[0];
    
    // 9. Generar token JWT per autenticació automàtica
    const token = generateToken(user);

    return { success: true, user, token };
  } catch (error: any) {
    return { success: false, error: 'Error al registrar l\'usuari' };
  }
}

/**
 * Autentica un usuari amb email i contrasenya.
 * 
 * PROCÉS:
 * 1. Busca l'usuari per email
 * 2. Verifica que estigui actiu
 * 3. Compara la contrasenya amb bcrypt
 * 4. Actualitza última data de login
 * 5. Genera i retorna token JWT
 * 
 * @param email - Email de l'usuari
 * @param password - Contrasenya en text pla
 * @returns Objecte amb success, user i token, o error
 */
export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    // 1. Buscar usuari actiu per email
    const users = await queryOperacional<any[]>(
      'SELECT * FROM usuarios WHERE email = ? AND estado = "activo"',
      [email]
    );

    if (users.length === 0) {
      return { success: false, error: 'Credencials incorrectes' };
    }

    const user = users[0];
    
    // 2. Verificar contrasenya amb bcrypt
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return { success: false, error: 'Credencials incorrectes' };
    }

    // 3. Actualitzar última data de login
    await queryOperacional(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?',
      [user.id]
    );

    // 4. Generar token JWT
    const token = generateToken(user);

    // 5. Retornar usuari sense la contrasenya (seguretat)
    const { password: _, ...safeUser } = user;
    
    return { success: true, user: safeUser, token };
  } catch (error: any) {
    return { success: false, error: 'Error al iniciar sessió' };
  }
}

// ═══════════════════════════════════════════════════════════════════
// FUNCIONS D'OBTENCIÓ DE DADES D'USUARI
// ═══════════════════════════════════════════════════════════════════

/**
 * Obté les dades completes d'un usuari per ID, incloent consentiments.
 * Fa un LEFT JOIN amb la taula de consentiments per obtenir preferències RGPD.
 * 
 * @param userId - ID de l'usuari
 * @returns Objecte User complet o null si no existeix
 */
export async function getUserById(userId: number): Promise<User | null> {
  try {
    const users = await queryOperacional<any[]>(
      `SELECT u.id, u.email, u.nombre, u.telefono, u.direccion, u.ciudad, 
              u.codigo_postal, u.estado, u.rol, u.activo,
              u.hash_anonimizacion, u.fecha_registro, u.ultimo_login,
              c.compartir_datos as consentimiento_databroker,
              c.analytics as consentimiento_analytics,
              c.acepta_comunicaciones as consentimiento_marketing
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

/**
 * Obté els consentiments RGPD d'un usuari.
 * 
 * @param userId - ID de l'usuari
 * @returns Objecte amb els consentiments o null
 */
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

// ═══════════════════════════════════════════════════════════════════
// GESTIÓ DE CONSENTIMENTS RGPD
// ═══════════════════════════════════════════════════════════════════

/**
 * Actualitza els consentiments RGPD d'un usuari.
 * Crea el registre si no existeix, o actualitza l'existent.
 * 
 * COMPLEIX AMB RGPD: Permet als usuaris modificar els seus consentiments
 * en qualsevol moment, tal com requereix la legislació europea.
 * 
 * @param userId - ID de l'usuari
 * @param consents - Objecte amb els nous consentiments
 * @returns True si s'ha actualitzat correctament
 */
export async function updateUserConsents(userId: number, consents: {
  compartir_datos?: boolean;
  acepta_comunicaciones?: boolean;
  analytics?: boolean;
}) {
  try {
    // Verificar si ja existeix un registre de consentiments
    const existing = await queryOperacional<any[]>(
      'SELECT id FROM consentimientos WHERE usuario_id = ?',
      [userId]
    );
    
    // Si no existeix, crear-lo
    if (existing.length === 0) {
      await queryOperacional(
        `INSERT INTO consentimientos (
          usuario_id, acepta_terminos, acepta_privacidad, acepta_cookies,
          acepta_comunicaciones, compartir_datos, analytics
        ) VALUES (?, 1, 1, 1, ?, ?, ?)`,
        [
          userId,
          consents.acepta_comunicaciones ? 1 : 0,
          consents.compartir_datos ? 1 : 0,
          consents.analytics ? 1 : 0
        ]
      );
    } else {
      // Construir query UPDATE dinàmicament
      const updates: string[] = [];
      const values: any[] = [];
      
      if (consents.compartir_datos !== undefined) {
        updates.push('compartir_datos = ?');
        values.push(consents.compartir_datos ? 1 : 0);
      }
      if (consents.acepta_comunicaciones !== undefined) {
        updates.push('acepta_comunicaciones = ?');
        values.push(consents.acepta_comunicaciones ? 1 : 0);
      }
      if (consents.analytics !== undefined) {
        updates.push('analytics = ?');
        values.push(consents.analytics ? 1 : 0);
      }
      
      if (updates.length === 0) {
        return true; // No hi ha canvis
      }
      
      // Afegir timestamp d'actualització
      updates.push('fecha_actualizacion = NOW()');
      values.push(userId);
      
      await queryOperacional(
        `UPDATE consentimientos SET ${updates.join(', ')} WHERE usuario_id = ?`,
        values
      );
    }
    
    return true;
  } catch {
    return false;
  }
}
