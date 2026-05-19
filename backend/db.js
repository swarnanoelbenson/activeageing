// backend/db.js — Shared MySQL connection pool used by all route handlers.
// Using mysql2/promise (not the callback-based mysql2) so every query can be
// awaited directly without promisify wrappers.

const mysql = require("mysql2/promise");
require("dotenv").config();

// ── Connection pool ──
// A pool reuses existing connections instead of opening a new TCP handshake
// per query — critical for serverless environments where functions are
// invoked frequently. connectionLimit: 10 matches a typical PlanetScale /
// Railway free-tier max_connections budget.
// waitForConnections: true queues requests instead of throwing when the pool
// is exhausted, which is safer for bursty traffic.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
