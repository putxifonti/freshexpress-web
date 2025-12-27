import mysql from 'mysql2/promise';

const operacionalConfig = {
  host: "143.47.36.36",
  port: parseInt("3306"),
  user: "api",
  password: "PosarLaTevaContrasenyaAqui",
  database: "freshexpress_operacional",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
const brokerConfig = {
  host: "143.47.36.36",
  port: parseInt("3306"),
  user: "api",
  password: "PosarLaTevaContrasenyaAqui",
  database: "freshexpress_databroker",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};
let operacionalPool = null;
function getOperacionalPool() {
  if (!operacionalPool) {
    operacionalPool = mysql.createPool(operacionalConfig);
  }
  return operacionalPool;
}
let brokerPool = null;
function getBrokerPool() {
  if (!brokerPool) {
    brokerPool = mysql.createPool(brokerConfig);
  }
  return brokerPool;
}
async function queryOperacional(sql, params) {
  const pool = getOperacionalPool();
  const [rows] = await pool.execute(sql, params);
  return rows;
}
async function queryBroker(sql, params) {
  const pool = getBrokerPool();
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export { queryBroker as a, queryOperacional as q };
