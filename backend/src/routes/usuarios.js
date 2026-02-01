// =====================================================
// Rutas de Usuarios
// =====================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// =====================================================
// OBTENER PERFIL
// =====================================================
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, email, nombre, apellido, avatar_url, telefono, rol,
        notificaciones_habilitadas, created_at,
        (SELECT COUNT(*) FROM favoritos WHERE usuario_id = $1) as total_favoritos,
        (SELECT COUNT(*) FROM quiero_ir WHERE usuario_id = $1) as total_quiero_ir,
        (SELECT COUNT(*) FROM valoraciones WHERE usuario_id = $1) as total_valoraciones,
        (SELECT COUNT(*) FROM historial_visitas WHERE usuario_id = $1) as total_visitas
      FROM usuarios
      WHERE id = $1
    `, [req.usuario.id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// =====================================================
// ACTUALIZAR PERFIL
// =====================================================
router.put('/perfil', verificarToken, async (req, res) => {
  try {
    const { nombre, apellido, telefono, notificaciones_habilitadas } = req.body;
    
    const result = await query(`
      UPDATE usuarios
      SET 
        nombre = COALESCE($1, nombre),
        apellido = COALESCE($2, apellido),
        telefono = COALESCE($3, telefono),
        notificaciones_habilitadas = COALESCE($4, notificaciones_habilitadas),
        updated_at = NOW()
      WHERE id = $5
      RETURNING id, email, nombre, apellido, avatar_url, telefono, notificaciones_habilitadas
    `, [nombre, apellido, telefono, notificaciones_habilitadas, req.usuario.id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// =====================================================
// ACTUALIZAR AVATAR
// =====================================================
router.put('/avatar', verificarToken, async (req, res) => {
  try {
    const { avatar_url } = req.body;
    
    const result = await query(`
      UPDATE usuarios SET avatar_url = $1, updated_at = NOW() WHERE id = $2
      RETURNING avatar_url
    `, [avatar_url, req.usuario.id]);
    
    res.json({ avatar_url: result.rows[0].avatar_url });
  } catch (error) {
    console.error('Error actualizando avatar:', error);
    res.status(500).json({ error: 'Error al actualizar avatar' });
  }
});

// =====================================================
// CAMBIAR CONTRASEÑA
// =====================================================
router.put('/password', verificarToken, async (req, res) => {
  try {
    const { password_actual, password_nuevo } = req.body;
    
    if (!password_actual || !password_nuevo) {
      return res.status(400).json({ error: 'Se requieren ambas contraseñas' });
    }
    
    if (password_nuevo.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }
    
    // Obtener usuario con contraseña
    const userResult = await query(
      'SELECT password_hash FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );
    
    if (!userResult.rows[0].password_hash) {
      return res.status(400).json({ 
        error: 'Tu cuenta usa inicio de sesión con Google. No puedes cambiar la contraseña aquí.' 
      });
    }
    
    // Verificar contraseña actual
    const passwordValido = await bcrypt.compare(password_actual, userResult.rows[0].password_hash);
    if (!passwordValido) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }
    
    // Hash nueva contraseña
    const passwordHash = await bcrypt.hash(password_nuevo, 12);
    
    await query(
      'UPDATE usuarios SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, req.usuario.id]
    );
    
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
});

// =====================================================
// MIS VALORACIONES
// =====================================================
router.get('/valoraciones', verificarToken, async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    const result = await query(`
      SELECT 
        v.id, v.puntuacion, v.titulo, v.comentario, v.created_at,
        v.respuesta, v.respuesta_fecha, v.estado,
        e.id as establecimiento_id, e.nombre as establecimiento_nombre,
        e.slug as establecimiento_slug, e.imagen_principal as establecimiento_imagen
      FROM valoraciones v
      JOIN establecimientos e ON e.id = v.establecimiento_id
      WHERE v.usuario_id = $1
      ORDER BY v.created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.usuario.id, parseInt(limite), offset]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo valoraciones:', error);
    res.status(500).json({ error: 'Error al obtener valoraciones' });
  }
});

// =====================================================
// ELIMINAR CUENTA (soft delete)
// =====================================================
router.delete('/cuenta', verificarToken, async (req, res) => {
  try {
    await query(`
      UPDATE usuarios 
      SET activo = false, 
          email = email || '_deleted_' || id,
          updated_at = NOW()
      WHERE id = $1
    `, [req.usuario.id]);
    
    // Eliminar tokens
    await query('DELETE FROM refresh_tokens WHERE usuario_id = $1', [req.usuario.id]);
    
    res.json({ mensaje: 'Cuenta eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando cuenta:', error);
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
});

module.exports = router;
