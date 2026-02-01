// =====================================================
// Rutas de Cupones
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken, tokenOpcional, esAdmin } = require('../middleware/auth');
const crypto = require('crypto');

// =====================================================
// PÚBLICO: Obtener cupones activos de un establecimiento
// =====================================================
router.get('/establecimiento/:establecimientoId', tokenOpcional, async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    const result = await query(`
      SELECT 
        c.id, c.codigo, c.titulo, c.descripcion,
        c.tipo_descuento, c.valor_descuento,
        c.consumo_minimo, c.aplica_a, c.descripcion_condiciones,
        c.max_usos_total, c.max_usos_por_usuario, c.usos_actuales,
        c.fecha_inicio, c.fecha_fin,
        c.dias_validos, c.hora_inicio, c.hora_fin,
        c.imagen_url, c.color_fondo, c.destacado,
        e.nombre as establecimiento_nombre,
        e.slug as establecimiento_slug,
        e.logo_url as establecimiento_logo
      FROM cupones c
      JOIN establecimientos e ON e.id = c.establecimiento_id
      WHERE c.establecimiento_id = $1
        AND c.activo = true
        AND c.fecha_inicio <= NOW()
        AND c.fecha_fin >= NOW()
        AND (c.max_usos_total IS NULL OR c.usos_actuales < c.max_usos_total)
      ORDER BY c.destacado DESC, c.fecha_fin ASC
    `, [establecimientoId]);
    
    // Si usuario autenticado, agregar info de si ya usó el cupón
    if (req.usuario && result.rows.length > 0) {
      const ids = result.rows.map(c => c.id);
      const canjesResult = await query(`
        SELECT cupon_id, COUNT(*) as usos
        FROM cupones_canjes
        WHERE cupon_id = ANY($1) AND usuario_id = $2 AND estado IN ('canjeado', 'usado')
        GROUP BY cupon_id
      `, [ids, req.usuario.id]);
      
      const canjesMap = {};
      canjesResult.rows.forEach(c => { canjesMap[c.cupon_id] = parseInt(c.usos); });
      
      result.rows.forEach(cupon => {
        cupon.usos_usuario = canjesMap[cupon.id] || 0;
        cupon.puede_canjear = cupon.usos_usuario < cupon.max_usos_por_usuario;
      });
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo cupones:', error);
    res.status(500).json({ error: 'Error al obtener cupones' });
  }
});

// =====================================================
// PÚBLICO: Obtener cupones destacados (para home)
// =====================================================
router.get('/destacados', tokenOpcional, async (req, res) => {
  try {
    const { ciudad, limite = 10 } = req.query;
    
    let whereClause = `
      WHERE c.activo = true 
      AND c.destacado = true
      AND c.fecha_inicio <= NOW()
      AND c.fecha_fin >= NOW()
      AND (c.max_usos_total IS NULL OR c.usos_actuales < c.max_usos_total)
    `;
    const params = [parseInt(limite)];
    
    if (ciudad) {
      whereClause += ` AND ci.slug = $2`;
      params.push(ciudad);
    }
    
    const result = await query(`
      SELECT 
        c.id, c.codigo, c.titulo, c.descripcion,
        c.tipo_descuento, c.valor_descuento,
        c.consumo_minimo, c.fecha_fin,
        c.imagen_url, c.color_fondo,
        e.id as establecimiento_id,
        e.nombre as establecimiento_nombre,
        e.slug as establecimiento_slug,
        e.imagen_principal as establecimiento_imagen,
        e.logo_url as establecimiento_logo,
        ci.nombre as ciudad_nombre
      FROM cupones c
      JOIN establecimientos e ON e.id = c.establecimiento_id
      LEFT JOIN ciudades ci ON ci.id = e.ciudad_id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $1
    `, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo cupones destacados:', error);
    res.status(500).json({ error: 'Error al obtener cupones' });
  }
});

// =====================================================
// USUARIO: Canjear cupón
// =====================================================
router.post('/canjear', verificarToken, async (req, res) => {
  try {
    const { codigo } = req.body;
    
    if (!codigo) {
      return res.status(400).json({ error: 'Código de cupón requerido' });
    }
    
    // Verificar cupón usando la función SQL
    const verificacion = await query(
      'SELECT * FROM verificar_cupon($1, $2)',
      [codigo.toUpperCase(), req.usuario.id]
    );
    
    const resultado = verificacion.rows[0];
    
    if (!resultado || !resultado.valido) {
      return res.status(400).json({ 
        error: resultado?.mensaje || 'Cupón no válido',
        valido: false
      });
    }
    
    // Generar código de verificación corto
    const codigoVerificacion = crypto.randomBytes(4).toString('hex').toUpperCase().substring(0, 6);
    
    // Registrar el canje
    const canje = await query(`
      INSERT INTO cupones_canjes (cupon_id, usuario_id, establecimiento_id, codigo_verificacion)
      SELECT $1, $2, establecimiento_id, $3
      FROM cupones WHERE id = $1
      RETURNING *
    `, [resultado.cupon_id, req.usuario.id, codigoVerificacion]);
    
    // Incrementar contador de usos
    await query(
      'UPDATE cupones SET usos_actuales = usos_actuales + 1 WHERE id = $1',
      [resultado.cupon_id]
    );
    
    res.json({
      valido: true,
      mensaje: 'Cupón canjeado exitosamente',
      canje: canje.rows[0],
      codigo_verificacion: codigoVerificacion,
      cupon: {
        titulo: resultado.titulo,
        tipo_descuento: resultado.tipo_descuento,
        valor_descuento: resultado.valor_descuento,
        establecimiento_nombre: resultado.establecimiento_nombre
      }
    });
  } catch (error) {
    if (error.constraint) {
      return res.status(400).json({ error: 'Ya canjeaste este cupón' });
    }
    console.error('Error canjeando cupón:', error);
    res.status(500).json({ error: 'Error al canjear cupón' });
  }
});

// =====================================================
// USUARIO: Mis cupones canjeados
// =====================================================
router.get('/mis-cupones', verificarToken, async (req, res) => {
  try {
    const { estado = 'todos' } = req.query;
    
    let whereClause = 'WHERE cc.usuario_id = $1';
    const params = [req.usuario.id];
    
    if (estado !== 'todos') {
      whereClause += ` AND cc.estado = $2`;
      params.push(estado);
    }
    
    const result = await query(`
      SELECT 
        cc.id, cc.estado, cc.codigo_verificacion, cc.fecha_canje, cc.fecha_uso,
        c.codigo, c.titulo, c.descripcion, c.tipo_descuento, c.valor_descuento,
        c.fecha_fin, c.color_fondo, c.imagen_url,
        e.nombre as establecimiento_nombre,
        e.slug as establecimiento_slug,
        e.imagen_principal as establecimiento_imagen,
        e.logo_url as establecimiento_logo
      FROM cupones_canjes cc
      JOIN cupones c ON c.id = cc.cupon_id
      JOIN establecimientos e ON e.id = cc.establecimiento_id
      ${whereClause}
      ORDER BY cc.fecha_canje DESC
    `, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo mis cupones:', error);
    res.status(500).json({ error: 'Error al obtener cupones' });
  }
});

// =====================================================
// ADMIN: CRUD Completo de Cupones
// =====================================================

// Listar todos (admin)
router.get('/admin/todos', verificarToken, esAdmin, async (req, res) => {
  try {
    const { establecimiento_id, activo, pagina = 1, limite = 50 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    if (establecimiento_id) {
      whereClause += ` AND c.establecimiento_id = $${paramIndex}`;
      params.push(establecimiento_id);
      paramIndex++;
    }
    
    if (activo !== undefined) {
      whereClause += ` AND c.activo = $${paramIndex}`;
      params.push(activo === 'true');
      paramIndex++;
    }
    
    params.push(parseInt(limite), offset);
    
    const result = await query(`
      SELECT 
        c.*,
        e.nombre as establecimiento_nombre,
        e.slug as establecimiento_slug,
        (SELECT COUNT(*) FROM cupones_canjes WHERE cupon_id = c.id) as total_canjes,
        (SELECT COUNT(*) FROM cupones_canjes WHERE cupon_id = c.id AND estado = 'usado') as total_usados
      FROM cupones c
      JOIN establecimientos e ON e.id = c.establecimiento_id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando cupones admin:', error);
    res.status(500).json({ error: 'Error al listar cupones' });
  }
});

// Crear cupón (admin)
router.post('/admin', verificarToken, esAdmin, async (req, res) => {
  try {
    const {
      establecimiento_id, codigo, titulo, descripcion,
      tipo_descuento, valor_descuento, consumo_minimo,
      aplica_a, descripcion_condiciones,
      max_usos_total, max_usos_por_usuario,
      fecha_inicio, fecha_fin,
      dias_validos, hora_inicio, hora_fin,
      imagen_url, color_fondo, activo, destacado
    } = req.body;
    
    if (!establecimiento_id || !codigo || !titulo || !fecha_fin) {
      return res.status(400).json({ error: 'Campos requeridos: establecimiento_id, codigo, titulo, fecha_fin' });
    }
    
    const result = await query(`
      INSERT INTO cupones (
        establecimiento_id, codigo, titulo, descripcion,
        tipo_descuento, valor_descuento, consumo_minimo,
        aplica_a, descripcion_condiciones,
        max_usos_total, max_usos_por_usuario,
        fecha_inicio, fecha_fin,
        dias_validos, hora_inicio, hora_fin,
        imagen_url, color_fondo, activo, destacado, creado_por
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `, [
      establecimiento_id, codigo.toUpperCase(), titulo, descripcion || null,
      tipo_descuento || 'porcentaje', valor_descuento || null, consumo_minimo || 0,
      aplica_a || 'todo', descripcion_condiciones || null,
      max_usos_total || null, max_usos_por_usuario || 1,
      fecha_inicio || new Date(), fecha_fin,
      JSON.stringify(dias_validos || ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']),
      hora_inicio || null, hora_fin || null,
      imagen_url || null, color_fondo || '#FF6B35', activo !== false, destacado || false,
      req.usuario.id
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.constraint === 'cupones_codigo_key') {
      return res.status(400).json({ error: 'Ya existe un cupón con ese código' });
    }
    console.error('Error creando cupón:', error);
    res.status(500).json({ error: 'Error al crear cupón' });
  }
});

// Actualizar cupón (admin)
router.put('/admin/:id', verificarToken, esAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    if (fields.codigo) fields.codigo = fields.codigo.toUpperCase();
    if (fields.dias_validos) fields.dias_validos = JSON.stringify(fields.dias_validos);
    
    const allowedFields = [
      'codigo', 'titulo', 'descripcion', 'tipo_descuento', 'valor_descuento',
      'consumo_minimo', 'aplica_a', 'descripcion_condiciones',
      'max_usos_total', 'max_usos_por_usuario',
      'fecha_inicio', 'fecha_fin', 'dias_validos', 'hora_inicio', 'hora_fin',
      'imagen_url', 'color_fondo', 'activo', 'destacado'
    ];
    
    const updates = [];
    const params = [id];
    let paramIndex = 2;
    
    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    
    updates.push('updated_at = NOW()');
    
    const result = await query(
      `UPDATE cupones SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando cupón:', error);
    res.status(500).json({ error: 'Error al actualizar cupón' });
  }
});

// Eliminar cupón (admin)
router.delete('/admin/:id', verificarToken, esAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM cupones WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }
    
    res.json({ mensaje: 'Cupón eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando cupón:', error);
    res.status(500).json({ error: 'Error al eliminar cupón' });
  }
});

// Estadísticas de un cupón (admin)
router.get('/admin/:id/stats', verificarToken, esAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const stats = await query(`
      SELECT 
        c.*,
        e.nombre as establecimiento_nombre,
        (SELECT COUNT(*) FROM cupones_canjes WHERE cupon_id = c.id) as total_canjes,
        (SELECT COUNT(*) FROM cupones_canjes WHERE cupon_id = c.id AND estado = 'usado') as total_usados,
        (SELECT COUNT(*) FROM cupones_canjes WHERE cupon_id = c.id AND estado = 'canjeado') as pendientes_uso,
        (SELECT COUNT(DISTINCT usuario_id) FROM cupones_canjes WHERE cupon_id = c.id) as usuarios_unicos
      FROM cupones c
      JOIN establecimientos e ON e.id = c.establecimiento_id
      WHERE c.id = $1
    `, [id]);
    
    if (stats.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }
    
    // Últimos canjes
    const canjes = await query(`
      SELECT 
        cc.*, u.nombre as usuario_nombre, u.email as usuario_email
      FROM cupones_canjes cc
      JOIN usuarios u ON u.id = cc.usuario_id
      WHERE cc.cupon_id = $1
      ORDER BY cc.fecha_canje DESC
      LIMIT 20
    `, [id]);
    
    res.json({
      cupon: stats.rows[0],
      ultimos_canjes: canjes.rows
    });
  } catch (error) {
    console.error('Error obteniendo stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;
