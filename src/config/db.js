import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'adminpassword',
  database: process.env.DB_NAME || 'devcamp'
});

// Evita que um erro em uma conexão ociosa derrube o processo inteiro
pool.on('error', (err) => {
  console.error('Erro inesperado no pool do Postgres:', err);
});
