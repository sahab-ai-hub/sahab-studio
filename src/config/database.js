const { Pool } = require('pg');

let pool;

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not set — skipping database connection');
    return;
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

function getPool() {
  return pool;
}

module.exports = { initializeDatabase, getPool };
