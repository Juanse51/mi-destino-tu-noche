// =====================================================
// Rutas de Banners
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Obtener banners activos
router.get('/', async (req, res) => {
  try {
    const { ubicacion = 'home', ciudad } = req.query;
    
    let whereClause = `
      WHERE b.activo = true 
      AND b.ubicacion = $1
      AND (b.fecha_inicio IS NULL OR b.fecha_inicio <= NOW())
      AND (b.fecha_fin IS NULL OR b.fecha_fin >= NOW())
    `;
    const params = [ubicacion];
    
    if (ciudad) {
      whereClause += ` AND (b.ciudad_id IS NULL OR c.slug = $2)`;
      params.push(ciudad);
    } else {
      whereClause += ` AND b.ciudad_id IS NULL`;
    }
    
    const result = await query(`
      SELECT 
        b.id, b.titulo, b.subtitulo, b.imagen_url, b.imagen_mobile_url,
        b.enlace_url, b.enlace_tipo, b.enlace_id
      FROM banners b
      LEFT JOIN ciudades c ON c.id = b.ciudad_id
      ${whereClause}
      ORDER BY b.orden ASC
    `, params);
    
    // Registrar impresiones
    if (result.rows.length > 0) {
      const ids = result.rows.map(b => b.id);
      await query(`
        UPDATE banners SET impresiones = impresiones + 1 WHERE id = ANY($1)
      `, [ids]);
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo banners:', error);
    res.status(500).json({ error: 'Error al obtener banners' });
  }
});

// Registrar clic en banner
router.post('/:id/clic', async (req, res) => {
  try {
    const { id } = req.params;
    
    await query('UPDATE banners SET clics = clics + 1 WHERE id = $1', [id]);
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error registrando clic:', error);
    res.status(500).json({ error: 'Error' });
  }
});

module.exports = router;
