// =====================================================
// Rutas de Ciudades
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Obtener todas las ciudades
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.id, c.nombre, c.slug, c.imagen_url, c.descripcion, c.latitud, c.longitud,
        d.nombre as departamento_nombre,
        (SELECT COUNT(*) FROM establecimientos WHERE ciudad_id = c.id AND activo = true) as total_establecimientos
      FROM ciudades c
      LEFT JOIN departamentos d ON d.id = c.departamento_id
      WHERE c.activo = true
      ORDER BY c.orden ASC, c.nombre ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo ciudades:', error);
    res.status(500).json({ error: 'Error al obtener ciudades' });
  }
});

// Obtener ciudad por slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await query(`
      SELECT 
        c.*, d.nombre as departamento_nombre,
        (SELECT COUNT(*) FROM establecimientos WHERE ciudad_id = c.id AND activo = true) as total_establecimientos
      FROM ciudades c
      LEFT JOIN departamentos d ON d.id = c.departamento_id
      WHERE c.slug = $1 AND c.activo = true
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo ciudad:', error);
    res.status(500).json({ error: 'Error al obtener ciudad' });
  }
});

module.exports = router;
