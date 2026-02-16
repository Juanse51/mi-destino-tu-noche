// =====================================================
// Rutas de Banners
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// Obtener banners activos (público)
router.get('/', async (req, res) => {
  try {
    const { ubicacion = 'home', ciudad, todos } = req.query;
    
    // Admin puede ver todos
    if (todos === 'true') {
      const result = await query(`
        SELECT 
          b.*, c.nombre as ciudad_nombre
        FROM banners b
        LEFT JOIN ciudades c ON c.id = b.ciudad_id
        ORDER BY b.orden ASC, b.created_at DESC
      `);
      return res.json(result.rows);
    }

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
    
    if (result.rows.length > 0) {
      const ids = result.rows.map(b => b.id);
      await query(`UPDATE banners SET impresiones = impresiones + 1 WHERE id = ANY($1)`, [ids]);
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo banners:', error);
    res.status(500).json({ error: 'Error al obtener banners' });
  }
});

// Crear banner (admin)
router.post('/', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { titulo, subtitulo, imagen_url, imagen_mobile_url, enlace_url, enlace_tipo, enlace_id, ubicacion, ciudad, fecha_inicio, fecha_fin, activo, orden } = req.body;

    if (!titulo || !imagen_url) {
      return res.status(400).json({ error: 'Título e imagen son requeridos' });
    }

    // Buscar ciudad_id si se envió
    let ciudadId = null;
    if (ciudad) {
      const cRes = await query('SELECT id FROM ciudades WHERE nombre ILIKE $1 LIMIT 1', [ciudad]);
      if (cRes.rows.length > 0) ciudadId = cRes.rows[0].id;
    }

    const result = await query(
      `INSERT INTO banners (titulo, subtitulo, imagen_url, imagen_mobile_url, enlace_url, enlace_tipo, enlace_id, ubicacion, ciudad_id, fecha_inicio, fecha_fin, activo, orden)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [titulo, subtitulo || null, imagen_url, imagen_mobile_url || null, enlace_url || null, enlace_tipo || 'externo', enlace_id || null, ubicacion || 'home', ciudadId, fecha_inicio || null, fecha_fin || null, activo !== false, orden || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando banner:', error);
    res.status(500).json({ error: 'Error al crear banner' });
  }
});

// Actualizar banner (admin)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { id } = req.params;
    const { titulo, subtitulo, imagen_url, imagen_mobile_url, enlace_url, enlace_tipo, enlace_id, ubicacion, ciudad, fecha_inicio, fecha_fin, activo, orden } = req.body;

    let ciudadId = undefined;
    if (ciudad) {
      const cRes = await query('SELECT id FROM ciudades WHERE nombre ILIKE $1 LIMIT 1', [ciudad]);
      if (cRes.rows.length > 0) ciudadId = cRes.rows[0].id;
    } else if (ciudad === '') {
      ciudadId = null;
    }

    const result = await query(
      `UPDATE banners SET
        titulo = COALESCE($1, titulo),
        subtitulo = COALESCE($2, subtitulo),
        imagen_url = COALESCE($3, imagen_url),
        imagen_mobile_url = COALESCE($4, imagen_mobile_url),
        enlace_url = COALESCE($5, enlace_url),
        enlace_tipo = COALESCE($6, enlace_tipo),
        enlace_id = COALESCE($7, enlace_id),
        ubicacion = COALESCE($8, ubicacion),
        ciudad_id = COALESCE($9, ciudad_id),
        fecha_inicio = $10,
        fecha_fin = $11,
        activo = COALESCE($12, activo),
        orden = COALESCE($13, orden),
        updated_at = NOW()
       WHERE id = $14 RETURNING *`,
      [titulo || null, subtitulo || null, imagen_url || null, imagen_mobile_url || null, enlace_url || null, enlace_tipo || null, enlace_id || null, ubicacion || null, ciudadId !== undefined ? ciudadId : null, fecha_inicio || null, fecha_fin || null, activo, orden || null, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Banner no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando banner:', error);
    res.status(500).json({ error: 'Error al actualizar banner' });
  }
});

// Eliminar banner (admin)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { id } = req.params;
    const result = await query('DELETE FROM banners WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Banner no encontrado' });
    res.json({ mensaje: 'Banner eliminado' });
  } catch (error) {
    console.error('Error eliminando banner:', error);
    res.status(500).json({ error: 'Error al eliminar banner' });
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
