/**
 * ═══════════════════════════════════════════════════════════════════
 * DATABASE CONNECTION MODULE
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Gestiona les connexions a les bases de dades MySQL del projecte.
 * Utilitza connection pooling per optimitzar el rendiment.
 * 
 * BASES DE DADES:
 * - freshexpress_operacional: Dades principals de l'aplicació
 * - freshexpress_databroker: Dades anonimitzades per a data broker
 * 
 * @module lib/db
 */

import mysql from 'mysql2/promise';

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓ DE CONNEXIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Configuració del pool de connexions per a la base de dades operacional.
 * Aquesta BD conté totes les dades principals: usuaris, comandes, productes, etc.
 */
const operacionalConfig = {
  host: import.meta.env.DB_HOST || 'localhost',
  port: parseInt(import.meta.env.DB_PORT || '3306'),
  user: import.meta.env.DB_USER || 'root',
  password: import.meta.env.DB_PASSWORD || '',
  database: import.meta.env.DB_NAME_OPERACIONAL || 'freshexpress_operacional',
  waitForConnections: true,    // Esperar si no hi ha connexions disponibles
  connectionLimit: 10,          // Màxim 10 connexions simultànies
  queueLimit: 0                 // Sense límit de cua de peticions
};

/**
 * Configuració del pool de connexions per a la base de dades data broker.
 * Aquesta BD conté dades anonimitzades dels usuaris que han donat consentiment.
 */
const brokerConfig = {
  host: import.meta.env.DB_HOST || 'localhost',
  port: parseInt(import.meta.env.DB_PORT || '3306'),
  user: import.meta.env.DB_USER || 'root',
  password: import.meta.env.DB_PASSWORD || '',
  database: import.meta.env.DB_NAME_BROKER || 'freshexpress_databroker',
  waitForConnections: true,
  connectionLimit: 5,           // Menys connexions (menys ús)
  queueLimit: 0
};

// ═══════════════════════════════════════════════════════════════════
// GESTIÓ DE POOLS DE CONNEXIONS
// ═══════════════════════════════════════════════════════════════════

/** Pool de connexions per a la BD operacional (singleton) */
let operacionalPool: mysql.Pool | null = null;

/**
 * Obté el pool de connexions de la BD operacional.
 * Crea el pool si no existeix (lazy initialization).
 * 
 * @returns Pool de connexions MySQL
 */
export function getOperacionalPool(): mysql.Pool {
  if (!operacionalPool) {
    operacionalPool = mysql.createPool(operacionalConfig);
  }
  return operacionalPool;
}

/** Pool de connexions per a la BD data broker (singleton) */
let brokerPool: mysql.Pool | null = null;

/**
 * Obté el pool de connexions de la BD data broker.
 * Crea el pool si no existeix (lazy initialization).
 * 
 * @returns Pool de connexions MySQL
 */
export function getBrokerPool(): mysql.Pool {
  if (!brokerPool) {
    brokerPool = mysql.createPool(brokerConfig);
  }
  return brokerPool;
}

// ═══════════════════════════════════════════════════════════════════
// FUNCIONS D'UTILITAT PER A CONSULTES
// ═══════════════════════════════════════════════════════════════════

/**
 * Executa una consulta SQL a la base de dades operacional.
 * Utilitza consultes preparades per prevenir SQL injection.
 * 
 * @template T - Tipus de dades que retornarà la consulta
 * @param sql - Consulta SQL amb placeholders (?)
 * @param params - Paràmetres per substituir els placeholders
 * @returns Promesa amb les files retornades
 * 
 * @example
 * const users = await queryOperacional<User[]>('SELECT * FROM usuarios WHERE id = ?', [userId]);
 */
export async function queryOperacional<T>(sql: string, params?: any[]): Promise<T> {
  const pool = getOperacionalPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

/**
 * Executa una consulta SQL a la base de dades data broker.
 * Utilitzada per dades anonimitzades amb consentiment dels usuaris.
 * 
 * @template T - Tipus de dades que retornarà la consulta
 * @param sql - Consulta SQL amb placeholders (?)
 * @param params - Paràmetres per substituir els placeholders
 * @returns Promesa amb les files retornades
 */
export async function queryBroker<T>(sql: string, params?: any[]): Promise<T> {
  const pool = getBrokerPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

// ═══════════════════════════════════════════════════════════════════
// FUNCIONS DE CONSULTA ESPECÍFIQUES
// ═══════════════════════════════════════════════════════════════════

/**
 * Obté totes les empreses actives ordenades per categoria i nom.
 * Aquesta funció substitueix la consulta anterior a una API REST externa.
 * 
 * @returns Promesa amb array d'empreses actives
 */
export async function getEmpreses() {
  return await queryOperacional<any[]>(
    `SELECT id, nombre, descripcion, categoria, logo, direccion, telefono, email, valoracion_media 
     FROM empresas 
     WHERE activo = 1 
     ORDER BY categoria, nombre`
  );
}

// ═══════════════════════════════════════════════════════════════════
// CLEANUP DE CONNEXIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Tanca tots els pools de connexions a les bases de dades.
 * Utilitzat per fer cleanup al tancar l'aplicació.
 * 
 * IMPORTANT: Només cridar aquesta funció quan l'aplicació es tanqui completament.
 */
export async function closePools() {
  if (operacionalPool) {
    await operacionalPool.end();
    operacionalPool = null;
  }
  if (brokerPool) {
    await brokerPool.end();
    brokerPool = null;
  }
}
