// =====================================================
// Configuración de Base de Datos
// =====================================================

const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// Conexión directa a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Cliente de Supabase (para storage y auth)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper para queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Query ejecutada', { text: text.substring(0, 50), duration, rows: result.rowCount });
    }
    return result;
  } catch (error) {
    console.error('Error en query:', error);
    throw error;
  }
};

// Transacciones
const getClient = () => pool.connect();

module.exports = {
  pool,
  query,
  getClient,
  supabase
};
