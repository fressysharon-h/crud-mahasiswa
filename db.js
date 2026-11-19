const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',   
};
const DB_NAME = process.env.DB_NAME || 'db_mahasiswa';

let pool;

async function init() {

  const conn = await mysql.createConnection(config);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await conn.end();

  pool = mysql.createPool({ ...config, database: DB_NAME, connectionLimit: 10 });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mahasiswa (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      nim        VARCHAR(20)  NOT NULL UNIQUE,
      nama       VARCHAR(100) NOT NULL,
      jurusan    VARCHAR(100) NOT NULL,
      email      VARCHAR(100) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return pool;
}

module.exports = { init, getPool: () => pool };
