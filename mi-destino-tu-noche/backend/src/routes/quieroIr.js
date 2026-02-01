// =====================================================
// Rutas de "Quiero Ir"
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// Obtener lista "Quiero ir"
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        qi.id, qi.nota, qi.prioridad, qi.created_at,
        e.id as establecimiento_id, e.nombre, e.slug, e.descripcion_corta,
        e.imagen_principal, e.direccion, e.rango_precios,
        e.valoracion_promedio, e.total_valoraciones,
        te.nombre as tipo_nombre, te.icono as tipo_icono, te.color as tipo_color,
        c.nombre as ciudad_nombre
      FROM quiero_ir qi
      JOIN establecimientos e ON e.id = qi.establecimiento_id
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      WHERE qi.usuario_id = $1 AND e.activo = true
      ORDER BY qi.prioridad DESC, qi.created_at DESC
    `, [req.usuario.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo quiero ir:', error);
    res.status(500).json({ error: 'Error al obtener lista' });
  }
});

// Agregar a "Quiero ir"
router.post('/:establecimientoId', verificarToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    const { nota, prioridad } = req.body;
    
    await query(`
      INSERT INTO quiero_ir (usuario_id, establecimiento_id, nota, prioridad)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (usuario_id, establecimiento_id) 
      DO UPDATE SET nota = COALESCE($3, quiero_ir.nota), prioridad = COALESCE($4, quiero_ir.prioridad)
    `, [req.usuario.id, establecimientoId, nota || null, prioridad || 0]);
    
    res.json({ mensaje: 'Agregado a Quiero ir', en_quiero_ir: true });
  } catch (error) {
    console.error('Error agregando quiero ir:', error);
    res.status(500).json({ error: 'Error al agregar a lista' });
  }
});

// Actualizar nota o prioridad
router.put('/:establecimientoId', verificarToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    const { nota, prioridad } = req.body;
    
    await query(`
      UPDATE quiero_ir 
      SET nota = COALESCE($1, nota), prioridad = COALESCE($2, prioridad)
      WHERE usuario_id = $3 AND establecimiento_id = $4
    `, [nota, prioridad, req.usuario.id, establecimientoId]);
    
    res.json({ mensaje: 'Actualizado' });
  } catch (error) {
    console.error('Error actualizando quiero ir:', error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// Eliminar de "Quiero ir"
router.delete('/:establecimientoId', verificarToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    await query(`
      DELETE FROM quiero_ir WHERE usuario_id = $1 AND establecimiento_id = $2
    `, [req.usuario.id, establecimientoId]);
    
    res.json({ mensaje: 'Eliminado de Quiero ir', en_quiero_ir: false });
  } catch (error) {
    console.error('Error eliminando quiero ir:', error);
    res.status(500).json({ error: 'Error al eliminar de lista' });
  }
});

// Toggle "Quiero ir"
router.post('/:establecimientoId/toggle', verificarToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    const existe = await query(
      'SELECT id FROM quiero_ir WHERE usuario_id = $1 AND establecimiento_id = $2',
      [req.usuario.id, establecimientoId]
    );
    
    if (existe.rows.length > 0) {
      await query('DELETE FROM quiero_ir WHERE usuario_id = $1 AND establecimiento_id = $2', 
        [req.usuario.id, establecimientoId]);
      res.json({ en_quiero_ir: false });
    } else {
      await query('INSERT INTO quiero_ir (usuario_id, establecimiento_id) VALUES ($1, $2)',
        [req.usuario.id, establecimientoId]);
      res.json({ en_quiero_ir: true });
    }
  } catch (error) {
    console.error('Error en toggle quiero ir:', error);
    res.status(500).json({ error: 'Error al actualizar lista' });
  }
});

module.exports = router;
