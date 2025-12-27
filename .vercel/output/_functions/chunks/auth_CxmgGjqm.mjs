import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { q as queryOperacional, a as queryBroker } from './db_D0m2K8jx.mjs';

const JWT_SECRET = "freshexpress_jwt_secret_2024_eco_delivery_secure_key";
const JWT_EXPIRES_IN = "7d";
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    nombre: user.nombre
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
function generateAnonymousHash(userId) {
  const randomPart = v4();
  const timestamp = Date.now();
  const data = `${userId}_FRESHEXPRESS_ECO_2024_${randomPart}_${timestamp}`;
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(data).digest("hex");
}
async function registerUser(data) {
  try {
    const existingUsers = await queryOperacional(
      "SELECT id FROM usuarios WHERE email = ?",
      [data.email]
    );
    if (existingUsers.length > 0) {
      return { success: false, error: "Aquest email ja està registrat" };
    }
    const userCount = await queryOperacional(
      "SELECT COUNT(*) as count FROM usuarios"
    );
    const isFirstUser = userCount[0]?.count === 0;
    const passwordHash = await hashPassword(data.password);
    const preferencias = JSON.stringify({
      sin_plastico: false,
      envase_reciclable: true,
      productos_eco: true,
      vegano: false,
      km0: true,
      dieta: null,
      alergias: []
    });
    const result = await queryOperacional(
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
    if (isFirstUser) {
      try {
        await queryOperacional("UPDATE usuarios SET rol = ? WHERE id = ?", ["admin", userId]);
        console.log("Primer usuari registrat com a ADMIN");
      } catch {
        console.log("Primer usuari registrat (sense columna rol)");
      }
    }
    let hashAnonimizacion = null;
    if (data.compartir_datos) {
      try {
        hashAnonimizacion = generateAnonymousHash(userId);
        await queryOperacional(
          "UPDATE usuarios SET hash_anonimizacion = ? WHERE id = ?",
          [hashAnonimizacion, userId]
        );
        try {
          await queryBroker(
            `INSERT INTO datos_anonimos (
              hash_usuario, codigo_postal_prefijo, nivel_compromiso_eco
            ) VALUES (?, ?, 'medio')`,
            [hashAnonimizacion, data.codigo_postal ? data.codigo_postal.substring(0, 3) : null]
          );
        } catch (brokerError) {
          console.log("Data broker insert opcional fallit (taula pot no existir):", brokerError);
        }
      } catch (hashError) {
        console.log("Error generant hash anonimització:", hashError);
      }
    }
    try {
      await queryOperacional(
        `INSERT INTO consentimientos (
          usuario_id, acepta_terminos, acepta_privacidad, acepta_cookies,
          acepta_comunicaciones, compartir_datos, recibir_ofertas, analytics
        ) VALUES (?, 1, 1, 1, ?, ?, ?, ?)`,
        [
          userId,
          data.acepta_comunicaciones || false ? 1 : 0,
          data.compartir_datos || false ? 1 : 0,
          data.recibir_ofertas || false ? 1 : 0,
          data.analytics !== false ? 1 : 0
        ]
      );
    } catch (consentError) {
      console.log("Error inserint consentiments (pot continuar):", consentError);
    }
    const users = await queryOperacional(
      "SELECT id, email, nombre, telefono, ciudad, estado, fecha_registro, rol FROM usuarios WHERE id = ?",
      [userId]
    );
    const user = users[0];
    const token = generateToken(user);
    return { success: true, user, token };
  } catch (error) {
    console.error("Error registrant usuari:", error);
    return { success: false, error: "Error al registrar l'usuari" };
  }
}
async function loginUser(email, password) {
  try {
    const users = await queryOperacional(
      'SELECT * FROM usuarios WHERE email = ? AND estado = "activo"',
      [email]
    );
    if (users.length === 0) {
      return { success: false, error: "Credencials incorrectes" };
    }
    const user = users[0];
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: "Credencials incorrectes" };
    }
    await queryOperacional(
      "UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?",
      [user.id]
    );
    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser, token };
  } catch (error) {
    console.error("Error al login:", error);
    return { success: false, error: "Error al iniciar sessió" };
  }
}
async function getUserById(userId) {
  try {
    const users = await queryOperacional(
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
  } catch (err) {
    console.error("Error getUserById:", err);
    return null;
  }
}
async function getUserConsents(userId) {
  try {
    const consents = await queryOperacional(
      "SELECT * FROM consentimientos WHERE usuario_id = ?",
      [userId]
    );
    return consents.length > 0 ? consents[0] : null;
  } catch {
    return null;
  }
}
async function updateUserConsents(userId, consents) {
  try {
    await queryOperacional(
      `UPDATE consentimientos SET 
        compartir_datos = COALESCE(?, compartir_datos),
        recibir_ofertas = COALESCE(?, recibir_ofertas),
        acepta_comunicaciones = COALESCE(?, acepta_comunicaciones),
        analytics = COALESCE(?, analytics),
        fecha_actualizacion = NOW()
       WHERE usuario_id = ?`,
      [
        consents.compartir_datos,
        consents.recibir_ofertas,
        consents.acepta_comunicaciones,
        consents.analytics,
        userId
      ]
    );
    return true;
  } catch {
    return false;
  }
}

export { verifyPassword as a, getUserConsents as b, getUserById as g, hashPassword as h, loginUser as l, registerUser as r, updateUserConsents as u, verifyToken as v };
