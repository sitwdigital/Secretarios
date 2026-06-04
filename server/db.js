// server/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis do .env no diretório raiz do projeto
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log(`[DB] Conectando ao banco ${process.env.DB_NAME} em ${process.env.DB_HOST}:${process.env.DB_PORT}...`);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verifica conexão inicial
pool.getConnection()
  .then((conn) => {
    console.log('[DB] Conexão com o banco de dados estabelecida com sucesso!');
    conn.release();
  })
  .catch((err) => {
    console.error('[DB] ERRO crítico ao conectar no banco de dados:', err.message);
  });

export default pool;
