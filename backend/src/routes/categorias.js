// =====================================================
// Rutas de Categorías y Etiquetas
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Obtener categorías especiales
router.get('/especiales', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        ce.*,
        (SELECT COUNT(DISTINCT ece.establecimiento_id) 
         FROM establecimientos_categorias_especiales ece
         JOIN establecimientos e ON e.id = ece.establecimiento_id
         WHERE ece.categoria_especial_id = ce.id AND e.activo = true) as total_establecimientos
      FROM categorias_especiales ce
      WHERE ce.activo = true
      ORDER BY ce.orden ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Obtener tipos de establecimiento
router.get('/tipos', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        te.*,
        (SELECT COUNT(*) FROM establecimientos e WHERE e.tipo_id = te.id AND e.activo = true) as total
      FROM tipos_establecimiento te
      WHERE te.activo = true
      ORDER BY te.orden ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo tipos:', error);
    res.status(500).json({ error: 'Error al obtener tipos' });
  }
});

// Obtener tipos de comida
router.get('/tipos-comida', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM tipos_comida WHERE activo = true ORDER BY nombre ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo tipos de comida:', error);
    res.status(500).json({ error: 'Error al obtener tipos de comida' });
  }
});

module.exports = router;
