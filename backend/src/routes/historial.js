// =====================================================
// Rutas de Historial de Visitas
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken } = require('../middleware/auth');

// Obtener historial
router.get('/', verificarToken, async (req, res) => {
  try {
    const { pagina = 1, limite = 20 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    const result = await query(`
      SELECT 
        hv.id, hv.tipo_visita, hv.fecha_visita, hv.notas,
        e.id as establecimiento_id, e.nombre, e.slug, e.descripcion_corta,
        e.imagen_principal, e.direccion,
        te.nombre as tipo_nombre, te.icono as tipo_icono,
        c.nombre as ciudad_nombre
      FROM historial_visitas hv
      JOIN establecimientos e ON e.id = hv.establecimiento_id
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      WHERE hv.usuario_id = $1 AND e.activo = true
      ORDER BY hv.fecha_visita DESC
      LIMIT $2 OFFSET $3
    `, [req.usuario.id, parseInt(limite), offset]);
    
    // Agrupar por fecha
    const historialAgrupado = {};
    result.rows.forEach(item => {
      const fecha = new Date(item.fecha_visita).toISOString().split('T')[0];
      if (!historialAgrupado[fecha]) {
        historialAgrupado[fecha] = [];
      }
      // Evitar duplicados del mismo establecimiento en el mismo día
      if (!historialAgrupado[fecha].find(h => h.establecimiento_id === item.establecimiento_id)) {
        historialAgrupado[fecha].push(item);
      }
    });
    
    res.json({
      historial: result.rows,
      agrupado: historialAgrupado
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// Registrar check-in
router.post('/check-in/:establecimientoId', verificarToken, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    const { notas } = req.body;
    
    await query(`
      INSERT INTO historial_visitas (usuario_id, establecimiento_id, tipo_visita, notas)
      VALUES ($1, $2, 'check_in', $3)
    `, [req.usuario.id, establecimientoId, notas || null]);
    
    res.json({ mensaje: 'Check-in registrado' });
  } catch (error) {
    console.error('Error registrando check-in:', error);
    res.status(500).json({ error: 'Error al registrar check-in' });
  }
});

// Limpiar historial
router.delete('/', verificarToken, async (req, res) => {
  try {
    await query('DELETE FROM historial_visitas WHERE usuario_id = $1', [req.usuario.id]);
    res.json({ mensaje: 'Historial eliminado' });
  } catch (error) {
    console.error('Error eliminando historial:', error);
    res.status(500).json({ error: 'Error al eliminar historial' });
  }
});

module.exports = router;
