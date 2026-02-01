// =====================================================
// Rutas de Notificaciones
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// Obtener notificaciones del usuario
router.get('/', verificarToken, async (req, res) => {
  try {
    const { pagina = 1, limite = 20, no_leidas } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    let whereClause = 'WHERE usuario_id = $1';
    if (no_leidas === 'true') {
      whereClause += ' AND leida = false';
    }
    
    const result = await query(`
      SELECT * FROM notificaciones
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.usuario.id, parseInt(limite), offset]);
    
    // Contar no leídas
    const countResult = await query(`
      SELECT COUNT(*) as total FROM notificaciones
      WHERE usuario_id = $1 AND leida = false
    `, [req.usuario.id]);
    
    res.json({
      notificaciones: result.rows,
      no_leidas: parseInt(countResult.rows[0].total)
    });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// Marcar como leída
router.put('/:id/leer', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(`
      UPDATE notificaciones SET leida = true
      WHERE id = $1 AND usuario_id = $2
    `, [id, req.usuario.id]);
    
    res.json({ mensaje: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error marcando notificación:', error);
    res.status(500).json({ error: 'Error al marcar notificación' });
  }
});

// Marcar todas como leídas
router.put('/leer-todas', verificarToken, async (req, res) => {
  try {
    await query(`
      UPDATE notificaciones SET leida = true WHERE usuario_id = $1
    `, [req.usuario.id]);
    
    res.json({ mensaje: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error marcando notificaciones:', error);
    res.status(500).json({ error: 'Error al marcar notificaciones' });
  }
});

// Eliminar notificación
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(`
      DELETE FROM notificaciones WHERE id = $1 AND usuario_id = $2
    `, [id, req.usuario.id]);
    
    res.json({ mensaje: 'Notificación eliminada' });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({ error: 'Error al eliminar notificación' });
  }
});

module.exports = router;
