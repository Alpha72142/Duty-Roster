// import pkg from "pg";
// import { env } from "./env.js";

// const { Pool } = pkg;

// export const pool = new Pool(env.db);

import pg from "pg";
const { Pool } = pg;

export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // ⭐ required for Render PostgreSQL
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
