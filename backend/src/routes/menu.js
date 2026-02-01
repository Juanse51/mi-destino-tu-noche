// =====================================================
// Rutas de Menú
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken, esPropietarioOAdmin } = require('../middleware/auth');

// Obtener menú de un establecimiento
router.get('/establecimiento/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT 
        mc.id as categoria_id, mc.nombre as categoria_nombre, 
        mc.descripcion as categoria_descripcion, mc.orden as categoria_orden,
        mi.id, mi.nombre, mi.descripcion, mi.precio, mi.precio_promocion,
        mi.imagen_url, mi.disponible, mi.destacado,
        mi.vegetariano, mi.vegano, mi.sin_gluten, mi.picante, mi.orden
      FROM menu_categorias mc
      LEFT JOIN menu_items mi ON mi.categoria_id = mc.id
      WHERE mc.establecimiento_id = $1 AND mc.activo = true
      ORDER BY mc.orden ASC, mi.orden ASC
    `, [id]);
    
    // Agrupar por categorías
    const menuMap = {};
    result.rows.forEach(item => {
      if (!menuMap[item.categoria_id]) {
        menuMap[item.categoria_id] = {
          id: item.categoria_id,
          nombre: item.categoria_nombre,
          descripcion: item.categoria_descripcion,
          orden: item.categoria_orden,
          items: []
        };
      }
      if (item.id) {
        menuMap[item.categoria_id].items.push({
          id: item.id,
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          precio_promocion: item.precio_promocion,
          imagen_url: item.imagen_url,
          disponible: item.disponible,
          destacado: item.destacado,
          vegetariano: item.vegetariano,
          vegano: item.vegano,
          sin_gluten: item.sin_gluten,
          picante: item.picante,
          orden: item.orden
        });
      }
    });
    
    res.json(Object.values(menuMap).sort((a, b) => a.orden - b.orden));
  } catch (error) {
    console.error('Error obteniendo menú:', error);
    res.status(500).json({ error: 'Error al obtener menú' });
  }
});

// Crear categoría de menú (requiere auth)
router.post('/categoria', verificarToken, async (req, res) => {
  try {
    const { establecimiento_id, nombre, descripcion, orden } = req.body;
    
    const result = await query(`
      INSERT INTO menu_categorias (establecimiento_id, nombre, descripcion, orden)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [establecimiento_id, nombre, descripcion, orden || 0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// Crear item de menú
router.post('/item', verificarToken, async (req, res) => {
  try {
    const {
      categoria_id, nombre, descripcion, precio, precio_promocion,
      imagen_url, vegetariano, vegano, sin_gluten, picante, orden
    } = req.body;
    
    const result = await query(`
      INSERT INTO menu_items (
        categoria_id, nombre, descripcion, precio, precio_promocion,
        imagen_url, vegetariano, vegano, sin_gluten, picante, orden
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      categoria_id, nombre, descripcion, precio, precio_promocion,
      imagen_url, vegetariano || false, vegano || false, sin_gluten || false, picante || 0, orden || 0
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando item:', error);
    res.status(500).json({ error: 'Error al crear item' });
  }
});

// Actualizar item
router.put('/item/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, precio_promocion, imagen_url, disponible, destacado, orden } = req.body;
    
    const result = await query(`
      UPDATE menu_items
      SET nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion),
          precio = COALESCE($3, precio),
          precio_promocion = $4,
          imagen_url = COALESCE($5, imagen_url),
          disponible = COALESCE($6, disponible),
          destacado = COALESCE($7, destacado),
          orden = COALESCE($8, orden)
      WHERE id = $9
      RETURNING *
    `, [nombre, descripcion, precio, precio_promocion, imagen_url, disponible, destacado, orden, id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando item:', error);
    res.status(500).json({ error: 'Error al actualizar item' });
  }
});

// Eliminar item
router.delete('/item/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM menu_items WHERE id = $1', [id]);
    res.json({ mensaje: 'Item eliminado' });
  } catch (error) {
    console.error('Error eliminando item:', error);
    res.status(500).json({ error: 'Error al eliminar item' });
  }
});

module.exports = router;
