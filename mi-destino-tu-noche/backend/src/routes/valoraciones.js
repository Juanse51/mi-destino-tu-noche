// =====================================================
// Rutas de Valoraciones
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken, tokenOpcional } = require('../middleware/auth');
const { sendPushNotification } = require('../config/firebase');

// Obtener valoraciones de un establecimiento
router.get('/establecimiento/:establecimientoId', async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    const { pagina = 1, limite = 10, ordenar = 'recientes' } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    let orderBy = 'v.created_at DESC';
    if (ordenar === 'utiles') orderBy = 'v.votos_utiles DESC, v.created_at DESC';
    if (ordenar === 'mejor') orderBy = 'v.puntuacion DESC, v.created_at DESC';
    if (ordenar === 'peor') orderBy = 'v.puntuacion ASC, v.created_at DESC';
    
    const result = await query(`
      SELECT 
        v.id, v.puntuacion, v.puntuacion_comida, v.puntuacion_servicio,
        v.puntuacion_ambiente, v.puntuacion_precio,
        v.titulo, v.comentario, v.votos_utiles, v.created_at,
        v.respuesta, v.respuesta_fecha,
        u.id as usuario_id, u.nombre as usuario_nombre, u.avatar_url as usuario_avatar,
        (SELECT json_agg(json_build_object('url', url, 'url_thumbnail', url_thumbnail))
         FROM valoraciones_fotos WHERE valoracion_id = v.id) as fotos
      FROM valoraciones v
      JOIN usuarios u ON u.id = v.usuario_id
      WHERE v.establecimiento_id = $1 AND v.estado = 'publicada'
      ORDER BY ${orderBy}
      LIMIT $2 OFFSET $3
    `, [establecimientoId, parseInt(limite), offset]);
    
    // Obtener resumen de valoraciones
    const resumenResult = await query(`
      SELECT 
        COUNT(*) as total,
        ROUND(AVG(puntuacion)::numeric, 1) as promedio,
        ROUND(AVG(puntuacion_comida)::numeric, 1) as promedio_comida,
        ROUND(AVG(puntuacion_servicio)::numeric, 1) as promedio_servicio,
        ROUND(AVG(puntuacion_ambiente)::numeric, 1) as promedio_ambiente,
        ROUND(AVG(puntuacion_precio)::numeric, 1) as promedio_precio,
        COUNT(*) FILTER (WHERE puntuacion = 5) as cinco_estrellas,
        COUNT(*) FILTER (WHERE puntuacion = 4) as cuatro_estrellas,
        COUNT(*) FILTER (WHERE puntuacion = 3) as tres_estrellas,
        COUNT(*) FILTER (WHERE puntuacion = 2) as dos_estrellas,
        COUNT(*) FILTER (WHERE puntuacion = 1) as una_estrella
      FROM valoraciones
      WHERE establecimiento_id = $1 AND estado = 'publicada'
    `, [establecimientoId]);
    
    res.json({
      valoraciones: result.rows,
      resumen: resumenResult.rows[0],
      paginacion: {
        pagina: parseInt(pagina),
        limite: parseInt(limite)
      }
    });
  } catch (error) {
    console.error('Error obteniendo valoraciones:', error);
    res.status(500).json({ error: 'Error al obtener valoraciones' });
  }
});

// Crear valoración
router.post('/', verificarToken, async (req, res) => {
  try {
    const {
      establecimiento_id,
      puntuacion,
      puntuacion_comida,
      puntuacion_servicio,
      puntuacion_ambiente,
      puntuacion_precio,
      titulo,
      comentario,
      fotos
    } = req.body;
    
    if (!establecimiento_id || !puntuacion) {
      return res.status(400).json({ error: 'Establecimiento y puntuación son requeridos' });
    }
    
    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 5' });
    }
    
    // Verificar si ya valoró
    const existe = await query(
      'SELECT id FROM valoraciones WHERE usuario_id = $1 AND establecimiento_id = $2',
      [req.usuario.id, establecimiento_id]
    );
    
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya has valorado este establecimiento' });
    }
    
    // Crear valoración
    const result = await query(`
      INSERT INTO valoraciones (
        establecimiento_id, usuario_id, puntuacion,
        puntuacion_comida, puntuacion_servicio, puntuacion_ambiente, puntuacion_precio,
        titulo, comentario
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      establecimiento_id, req.usuario.id, puntuacion,
      puntuacion_comida, puntuacion_servicio, puntuacion_ambiente, puntuacion_precio,
      titulo, comentario
    ]);
    
    const valoracionId = result.rows[0].id;
    
    // Agregar fotos si las hay
    if (fotos && fotos.length > 0) {
      for (const foto of fotos) {
        await query(`
          INSERT INTO valoraciones_fotos (valoracion_id, url, url_thumbnail)
          VALUES ($1, $2, $3)
        `, [valoracionId, foto.url, foto.url_thumbnail || foto.url]);
      }
    }
    
    // Notificar al propietario del establecimiento
    const propietarioResult = await query(`
      SELECT u.push_token, u.notificaciones_habilitadas, e.nombre
      FROM establecimientos e
      JOIN usuarios u ON u.id = e.propietario_id
      WHERE e.id = $1 AND u.push_token IS NOT NULL
    `, [establecimiento_id]);
    
    if (propietarioResult.rows.length > 0 && propietarioResult.rows[0].notificaciones_habilitadas) {
      const { push_token, nombre } = propietarioResult.rows[0];
      sendPushNotification(
        push_token,
        'Nueva reseña',
        `${req.usuario.nombre} dejó una reseña de ${puntuacion} estrellas en ${nombre}`,
        { tipo: 'valoracion', establecimiento_id, valoracion_id: valoracionId }
      );
    }
    
    res.status(201).json({ 
      mensaje: 'Valoración creada exitosamente',
      id: valoracionId
    });
  } catch (error) {
    console.error('Error creando valoración:', error);
    res.status(500).json({ error: 'Error al crear valoración' });
  }
});

// Actualizar valoración
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { puntuacion, titulo, comentario } = req.body;
    
    // Verificar que sea el autor
    const valoracion = await query(
      'SELECT usuario_id FROM valoraciones WHERE id = $1',
      [id]
    );
    
    if (valoracion.rows.length === 0) {
      return res.status(404).json({ error: 'Valoración no encontrada' });
    }
    
    if (valoracion.rows[0].usuario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No puedes editar esta valoración' });
    }
    
    await query(`
      UPDATE valoraciones
      SET puntuacion = COALESCE($1, puntuacion),
          titulo = COALESCE($2, titulo),
          comentario = COALESCE($3, comentario),
          updated_at = NOW()
      WHERE id = $4
    `, [puntuacion, titulo, comentario, id]);
    
    res.json({ mensaje: 'Valoración actualizada' });
  } catch (error) {
    console.error('Error actualizando valoración:', error);
    res.status(500).json({ error: 'Error al actualizar valoración' });
  }
});

// Eliminar valoración
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const valoracion = await query(
      'SELECT usuario_id FROM valoraciones WHERE id = $1',
      [id]
    );
    
    if (valoracion.rows.length === 0) {
      return res.status(404).json({ error: 'Valoración no encontrada' });
    }
    
    if (valoracion.rows[0].usuario_id !== req.usuario.id && !['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No puedes eliminar esta valoración' });
    }
    
    await query('DELETE FROM valoraciones_fotos WHERE valoracion_id = $1', [id]);
    await query('DELETE FROM valoraciones WHERE id = $1', [id]);
    
    res.json({ mensaje: 'Valoración eliminada' });
  } catch (error) {
    console.error('Error eliminando valoración:', error);
    res.status(500).json({ error: 'Error al eliminar valoración' });
  }
});

// Marcar como útil
router.post('/:id/util', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await query('UPDATE valoraciones SET votos_utiles = votos_utiles + 1 WHERE id = $1', [id]);
    
    res.json({ mensaje: 'Marcado como útil' });
  } catch (error) {
    console.error('Error marcando útil:', error);
    res.status(500).json({ error: 'Error al marcar como útil' });
  }
});

// Reportar valoración
router.post('/:id/reportar', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, descripcion } = req.body;
    
    await query(`
      INSERT INTO reportes (tipo, referencia_id, reportado_por, motivo, descripcion)
      VALUES ('valoracion', $1, $2, $3, $4)
    `, [id, req.usuario.id, motivo, descripcion]);
    
    await query('UPDATE valoraciones SET estado = $1 WHERE id = $2', ['reportada', id]);
    
    res.json({ mensaje: 'Valoración reportada' });
  } catch (error) {
    console.error('Error reportando valoración:', error);
    res.status(500).json({ error: 'Error al reportar valoración' });
  }
});

module.exports = router;
