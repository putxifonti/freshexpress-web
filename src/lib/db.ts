// src/lib/db.ts - Connexió a MySQL
import mysql from 'mysql2/promise';

// Configuració per la base de dades operacional
const operacionalConfig = {
  host: import.meta.env.DB_HOST || 'localhost',
  port: parseInt(import.meta.env.DB_PORT || '3306'),
  user: import.meta.env.DB_USER || 'root',
  password: import.meta.env.DB_PASSWORD || '',
  database: import.meta.env.DB_NAME_OPERACIONAL || 'freshexpress_operacional',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Configuració per la base de dades data broker
const brokerConfig = {
  host: import.meta.env.DB_HOST || 'localhost',
  port: parseInt(import.meta.env.DB_PORT || '3306'),
  user: import.meta.env.DB_USER || 'root',
  password: import.meta.env.DB_PASSWORD || '',
  database: import.meta.env.DB_NAME_BROKER || 'freshexpress_databroker',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

// Pool de connexions per BD operacional
let operacionalPool: mysql.Pool | null = null;

export function getOperacionalPool(): mysql.Pool {
  if (!operacionalPool) {
    operacionalPool = mysql.createPool(operacionalConfig);
  }
  return operacionalPool;
}

// Pool de connexions per BD data broker
let brokerPool: mysql.Pool | null = null;

export function getBrokerPool(): mysql.Pool {
  if (!brokerPool) {
    brokerPool = mysql.createPool(brokerConfig);
  }
  return brokerPool;
}

// Funcions d'utilitat per queries
export async function queryOperacional<T>(sql: string, params?: any[]): Promise<T> {
  const pool = getOperacionalPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

export async function queryBroker<T>(sql: string, params?: any[]): Promise<T> {
  const pool = getBrokerPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

// Tancar connexions (per cleanup)
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
