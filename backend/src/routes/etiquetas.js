// =====================================================
// Rutas de Etiquetas
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Obtener todas las etiquetas
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let whereClause = 'WHERE activo = true';
    const params = [];
    
    if (categoria) {
      whereClause += ' AND categoria = $1';
      params.push(categoria);
    }
    
    const result = await query(`
      SELECT * FROM etiquetas ${whereClause} ORDER BY orden ASC, nombre ASC
    `, params);
    
    // Agrupar por categoría
    const agrupadas = {};
    result.rows.forEach(et => {
      if (!agrupadas[et.categoria]) {
        agrupadas[et.categoria] = [];
      }
      agrupadas[et.categoria].push(et);
    });
    
    res.json({
      etiquetas: result.rows,
      agrupadas
    });
  } catch (error) {
    console.error('Error obteniendo etiquetas:', error);
    res.status(500).json({ error: 'Error al obtener etiquetas' });
  }
});

module.exports = router;
