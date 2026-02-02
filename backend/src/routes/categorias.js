// =====================================================
// Rutas de Categorías y Etiquetas
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// Obtener categorías especiales
router.get('/especiales', async (req, res) => {
  try {
    const { todas } = req.query;
    const whereClause = todas === 'true' ? '' : 'WHERE ce.activo = true';

    const result = await query(`
      SELECT 
        ce.*,
        (SELECT COUNT(DISTINCT ece.establecimiento_id) 
         FROM establecimientos_categorias_especiales ece
         JOIN establecimientos e ON e.id = ece.establecimiento_id
         WHERE ece.categoria_especial_id = ce.id AND e.activo = true) as total_establecimientos
      FROM categorias_especiales ce
      ${whereClause}
      ORDER BY ce.orden ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Crear categoría especial (admin)
router.post('/especiales', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { nombre, descripcion, icono, color, activo } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });

    const slug = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const result = await query(
      `INSERT INTO categorias_especiales (nombre, slug, descripcion, icono, color, activo)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, slug, descripcion || null, icono || '⭐', color || '#FF6B35', activo !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando categoría:', error);
    if (error.code === '23505') return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// Actualizar categoría especial (admin)
router.put('/especiales/:id', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { id } = req.params;
    const { nombre, descripcion, icono, color, activo } = req.body;

    const slug = nombre ? nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null;

    const result = await query(
      `UPDATE categorias_especiales SET
        nombre = COALESCE($1, nombre), slug = COALESCE($2, slug),
        descripcion = COALESCE($3, descripcion), icono = COALESCE($4, icono),
        color = COALESCE($5, color), activo = COALESCE($6, activo)
       WHERE id = $7 RETURNING *`,
      [nombre || null, slug, descripcion || null, icono || null, color || null, activo, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// Eliminar categoría especial (admin)
router.delete('/especiales/:id', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { id } = req.params;
    const result = await query('DELETE FROM categorias_especiales WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
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
