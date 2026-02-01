// =====================================================
// Rutas de Favoritos
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// Obtener favoritos
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        f.id, f.created_at,
        e.id as establecimiento_id, e.nombre, e.slug, e.descripcion_corta,
        e.imagen_principal, e.direccion, e.rango_precios,
        e.valoracion_promedio, e.total_valoraciones,
        te.nombre as tipo_nombre, te.icono as tipo_icono, te.color as tipo_color,
        c.nombre as ciudad_nombre
      FROM favoritos f
      JOIN establecimientos e ON e.id = f.establecimiento_id
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      WHERE f.usuario_id = $1 AND e.activo = true
      ORDER BY f.created_at DESC
    `, [req.usuario.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// Agregar favorito
router.post('/:establecimientoId', verificarToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    await query(`
      INSERT INTO favoritos (usuario_id, establecimiento_id)
      VALUES ($1, $2)
      ON CONFLICT (usuario_id, establecimiento_id) DO NOTHING
    `, [req.usuario.id, establecimientoId]);
    
    res.json({ mensaje: 'Agregado a favoritos', es_favorito: true });
  } catch (error) {
    console.error('Error agregando favorito:', error);
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
});

// Eliminar favorito
router.delete('/:establecimientoId', verificarToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    await query(`
      DELETE FROM favoritos WHERE usuario_id = $1 AND establecimiento_id = $2
    `, [req.usuario.id, establecimientoId]);
    
    res.json({ mensaje: 'Eliminado de favoritos', es_favorito: false });
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
});

// Toggle favorito
router.post('/:establecimientoId/toggle', verificarToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    const existe = await query(
      'SELECT id FROM favoritos WHERE usuario_id = $1 AND establecimiento_id = $2',
      [req.usuario.id, establecimientoId]
    );
    
    if (existe.rows.length > 0) {
      await query('DELETE FROM favoritos WHERE usuario_id = $1 AND establecimiento_id = $2', 
        [req.usuario.id, establecimientoId]);
      res.json({ es_favorito: false });
    } else {
      await query('INSERT INTO favoritos (usuario_id, establecimiento_id) VALUES ($1, $2)',
        [req.usuario.id, establecimientoId]);
      res.json({ es_favorito: true });
    }
  } catch (error) {
    console.error('Error en toggle favorito:', error);
    res.status(500).json({ error: 'Error al actualizar favorito' });
  }
});

module.exports = router;
