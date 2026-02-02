// =====================================================
// Rutas de Ciudades
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// Obtener todas las ciudades (incluye inactivas para admin)
router.get('/', async (req, res) => {
  try {
    const { todas } = req.query;
    const whereClause = todas === 'true' ? '' : 'WHERE c.activo = true';
    
    const result = await query(`
      SELECT 
        c.id, c.nombre, c.slug, c.imagen_url, c.descripcion, c.latitud, c.longitud, c.activo,
        d.nombre as departamento_nombre,
        (SELECT COUNT(*) FROM establecimientos WHERE ciudad_id = c.id AND activo = true) as total_establecimientos
      FROM ciudades c
      LEFT JOIN departamentos d ON d.id = c.departamento_id
      ${whereClause}
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

// Crear ciudad (admin)
router.post('/', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { nombre, slug, departamento, descripcion, latitud, longitud, activo } = req.body;

    if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });

    const finalSlug = slug || nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Buscar departamento_id si se envió
    let departamentoId = null;
    if (departamento) {
      const depResult = await query('SELECT id FROM departamentos WHERE nombre ILIKE $1 LIMIT 1', [departamento]);
      if (depResult.rows.length > 0) departamentoId = depResult.rows[0].id;
    }

    const result = await query(
      `INSERT INTO ciudades (nombre, slug, departamento_id, descripcion, latitud, longitud, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre, finalSlug, departamentoId, descripcion || null, latitud || null, longitud || null, activo !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando ciudad:', error);
    if (error.code === '23505') return res.status(400).json({ error: 'Ya existe una ciudad con ese nombre o slug' });
    res.status(500).json({ error: 'Error al crear ciudad' });
  }
});

// Actualizar ciudad (admin)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { id } = req.params;
    const { nombre, slug, departamento, descripcion, latitud, longitud, activo } = req.body;

    let departamentoId = undefined;
    if (departamento) {
      const depResult = await query('SELECT id FROM departamentos WHERE nombre ILIKE $1 LIMIT 1', [departamento]);
      if (depResult.rows.length > 0) departamentoId = depResult.rows[0].id;
    }

    const result = await query(
      `UPDATE ciudades SET
        nombre = COALESCE($1, nombre),
        slug = COALESCE($2, slug),
        departamento_id = COALESCE($3, departamento_id),
        descripcion = COALESCE($4, descripcion),
        latitud = COALESCE($5, latitud),
        longitud = COALESCE($6, longitud),
        activo = COALESCE($7, activo)
       WHERE id = $8 RETURNING *`,
      [nombre || null, slug || null, departamentoId || null, descripcion || null, latitud || null, longitud || null, activo, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando ciudad:', error);
    res.status(500).json({ error: 'Error al actualizar ciudad' });
  }
});

// Eliminar ciudad (admin)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { id } = req.params;
    const result = await query('DELETE FROM ciudades WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json({ mensaje: 'Ciudad eliminada' });
  } catch (error) {
    console.error('Error eliminando ciudad:', error);
    res.status(500).json({ error: 'Error al eliminar ciudad' });
  }
});

module.exports = router;
