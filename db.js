require('dotenv').config();
const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is missing from environment variables.');
}

const sql = postgres(connectionString);

module.exports = sql;