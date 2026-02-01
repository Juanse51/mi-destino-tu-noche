// =====================================================
// Rutas de Administración (Dashboard)
// =====================================================

const express = require('express');
const router = express.Router();
const { query, getClient } = require('../config/database');
const { verificarToken, esAdmin } = require('../middleware/auth');
const { sendPushToMultiple } = require('../config/firebase');

// Middleware: solo admin
router.use(verificarToken);
router.use(esAdmin);

// =====================================================
// DASHBOARD - ESTADÍSTICAS
// =====================================================
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await query(`
      SELECT
        (SELECT COUNT(*) FROM establecimientos WHERE activo = true) as total_establecimientos,
        (SELECT COUNT(*) FROM establecimientos WHERE activo = true AND destacado = true) as destacados,
        (SELECT COUNT(*) FROM establecimientos WHERE activo = true AND verificado = true) as verificados,
        (SELECT COUNT(*) FROM usuarios WHERE activo = true) as total_usuarios,
        (SELECT COUNT(*) FROM usuarios WHERE created_at > NOW() - INTERVAL '30 days') as usuarios_nuevos,
        (SELECT COUNT(*) FROM valoraciones WHERE estado = 'publicada') as total_valoraciones,
        (SELECT COUNT(*) FROM valoraciones WHERE estado = 'pendiente') as valoraciones_pendientes,
        (SELECT ROUND(AVG(puntuacion)::numeric, 2) FROM valoraciones WHERE estado = 'publicada') as valoracion_promedio,
        (SELECT COUNT(*) FROM ciudades WHERE activo = true) as total_ciudades
    `);
    
    // Estadísticas por ciudad
    const porCiudad = await query(`
      SELECT c.nombre, c.slug, COUNT(e.id) as total
      FROM ciudades c
      LEFT JOIN establecimientos e ON e.ciudad_id = c.id AND e.activo = true
      WHERE c.activo = true
      GROUP BY c.id, c.nombre, c.slug
      ORDER BY total DESC
      LIMIT 10
    `);
    
    // Estadísticas por tipo
    const porTipo = await query(`
      SELECT te.nombre, te.icono, te.color, COUNT(e.id) as total
      FROM tipos_establecimiento te
      LEFT JOIN establecimientos e ON e.tipo_id = te.id AND e.activo = true
      WHERE te.activo = true
      GROUP BY te.id, te.nombre, te.icono, te.color
      ORDER BY total DESC
    `);
    
    // Actividad reciente
    const actividad = await query(`
      (SELECT 'establecimiento' as tipo, e.nombre as titulo, e.created_at as fecha
       FROM establecimientos e ORDER BY e.created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'valoracion' as tipo, CONCAT(u.nombre, ' valoró ', est.nombre) as titulo, v.created_at as fecha
       FROM valoraciones v
       JOIN usuarios u ON u.id = v.usuario_id
       JOIN establecimientos est ON est.id = v.establecimiento_id
       ORDER BY v.created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'usuario' as tipo, CONCAT('Nuevo usuario: ', nombre) as titulo, created_at as fecha
       FROM usuarios ORDER BY created_at DESC LIMIT 5)
      ORDER BY fecha DESC
      LIMIT 15
    `);
    
    res.json({
      estadisticas: stats.rows[0],
      por_ciudad: porCiudad.rows,
      por_tipo: porTipo.rows,
      actividad_reciente: actividad.rows
    });
  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// =====================================================
// ESTABLECIMIENTOS - CRUD COMPLETO
// =====================================================

// Listar establecimientos (con filtros)
router.get('/establecimientos', async (req, res) => {
  try {
    const { busqueda, ciudad, tipo, estado, pagina = 1, limite = 20 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    if (busqueda) {
      whereClause += ` AND (e.nombre ILIKE $${paramIndex} OR e.direccion ILIKE $${paramIndex})`;
      params.push(`%${busqueda}%`);
      paramIndex++;
    }
    
    if (ciudad) {
      whereClause += ` AND c.slug = $${paramIndex}`;
      params.push(ciudad);
      paramIndex++;
    }
    
    if (tipo) {
      whereClause += ` AND te.slug = $${paramIndex}`;
      params.push(tipo);
      paramIndex++;
    }
    
    if (estado === 'activo') whereClause += ' AND e.activo = true';
    if (estado === 'inactivo') whereClause += ' AND e.activo = false';
    if (estado === 'destacado') whereClause += ' AND e.destacado = true';
    if (estado === 'verificado') whereClause += ' AND e.verificado = true';
    
    const result = await query(`
      SELECT 
        e.id, e.nombre, e.slug, e.imagen_principal, e.direccion,
        e.telefono, e.whatsapp, e.activo, e.verificado, e.destacado,
        e.valoracion_promedio, e.total_valoraciones, e.total_visitas,
        e.created_at, e.updated_at,
        te.nombre as tipo_nombre, te.icono as tipo_icono,
        c.nombre as ciudad_nombre
      FROM establecimientos e
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, parseInt(limite), offset]);
    
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM establecimientos e
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      ${whereClause}
    `, params);
    
    res.json({
      establecimientos: result.rows,
      paginacion: {
        total: parseInt(countResult.rows[0].total),
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        paginas: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limite))
      }
    });
  } catch (error) {
    console.error('Error listando establecimientos:', error);
    res.status(500).json({ error: 'Error al listar establecimientos' });
  }
});

// Obtener establecimiento para edición
router.get('/establecimientos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('SELECT * FROM establecimientos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Establecimiento no encontrado' });
    }
    
    const establecimiento = result.rows[0];
    
    // Obtener etiquetas
    const etiquetasResult = await query(`
      SELECT etiqueta_id FROM establecimientos_etiquetas WHERE establecimiento_id = $1
    `, [id]);
    establecimiento.etiquetas_ids = etiquetasResult.rows.map(e => e.etiqueta_id);
    
    // Obtener categorías especiales
    const categoriasResult = await query(`
      SELECT categoria_especial_id FROM establecimientos_categorias_especiales WHERE establecimiento_id = $1
    `, [id]);
    establecimiento.categorias_especiales_ids = categoriasResult.rows.map(c => c.categoria_especial_id);
    
    // Obtener galería
    const galeriaResult = await query(`
      SELECT * FROM galeria_fotos WHERE establecimiento_id = $1 ORDER BY orden ASC
    `, [id]);
    establecimiento.galeria = galeriaResult.rows;
    
    res.json(establecimiento);
  } catch (error) {
    console.error('Error obteniendo establecimiento:', error);
    res.status(500).json({ error: 'Error al obtener establecimiento' });
  }
});

// Crear establecimiento
router.post('/establecimientos', async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const {
      nombre, descripcion, descripcion_corta, tipo_id, tipo_comida_id,
      ciudad_id, direccion, direccion_adicional, barrio, latitud, longitud,
      telefono, telefono_2, whatsapp, email, sitio_web,
      instagram, facebook, tiktok,
      imagen_principal, imagen_portada, logo_url,
      horarios, rango_precios,
      activo, verificado, destacado,
      etiquetas_ids, categorias_especiales_ids, galeria
    } = req.body;
    
    // Crear establecimiento
    const result = await client.query(`
      INSERT INTO establecimientos (
        nombre, descripcion, descripcion_corta, tipo_id, tipo_comida_id,
        ciudad_id, direccion, direccion_adicional, barrio, latitud, longitud,
        telefono, telefono_2, whatsapp, email, sitio_web,
        instagram, facebook, tiktok,
        imagen_principal, imagen_portada, logo_url,
        horarios, rango_precios,
        activo, verificado, destacado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
      RETURNING id
    `, [
      nombre, descripcion, descripcion_corta, tipo_id, tipo_comida_id,
      ciudad_id, direccion, direccion_adicional, barrio, latitud, longitud,
      telefono, telefono_2, whatsapp, email, sitio_web,
      instagram, facebook, tiktok,
      imagen_principal, imagen_portada, logo_url,
      JSON.stringify(horarios || {}), rango_precios || 2,
      activo !== false, verificado || false, destacado || false
    ]);
    
    const establecimientoId = result.rows[0].id;
    
    // Agregar etiquetas
    if (etiquetas_ids && etiquetas_ids.length > 0) {
      for (const etiquetaId of etiquetas_ids) {
        await client.query(`
          INSERT INTO establecimientos_etiquetas (establecimiento_id, etiqueta_id)
          VALUES ($1, $2)
        `, [establecimientoId, etiquetaId]);
      }
    }
    
    // Agregar categorías especiales
    if (categorias_especiales_ids && categorias_especiales_ids.length > 0) {
      for (const categoriaId of categorias_especiales_ids) {
        await client.query(`
          INSERT INTO establecimientos_categorias_especiales (establecimiento_id, categoria_especial_id)
          VALUES ($1, $2)
        `, [establecimientoId, categoriaId]);
      }
    }
    
    // Agregar galería
    if (galeria && galeria.length > 0) {
      for (let i = 0; i < galeria.length; i++) {
        const foto = galeria[i];
        await client.query(`
          INSERT INTO galeria_fotos (establecimiento_id, url, url_thumbnail, titulo, orden)
          VALUES ($1, $2, $3, $4, $5)
        `, [establecimientoId, foto.url, foto.url_thumbnail, foto.titulo, i]);
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({ 
      mensaje: 'Establecimiento creado exitosamente',
      id: establecimientoId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando establecimiento:', error);
    res.status(500).json({ error: 'Error al crear establecimiento' });
  } finally {
    client.release();
  }
});

// Actualizar establecimiento
router.put('/establecimientos/:id', async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const {
      nombre, descripcion, descripcion_corta, tipo_id, tipo_comida_id,
      ciudad_id, direccion, direccion_adicional, barrio, latitud, longitud,
      telefono, telefono_2, whatsapp, email, sitio_web,
      instagram, facebook, tiktok,
      imagen_principal, imagen_portada, logo_url,
      horarios, rango_precios,
      activo, verificado, destacado,
      etiquetas_ids, categorias_especiales_ids, galeria
    } = req.body;
    
    await client.query(`
      UPDATE establecimientos SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        descripcion_corta = COALESCE($3, descripcion_corta),
        tipo_id = COALESCE($4, tipo_id),
        tipo_comida_id = COALESCE($5, tipo_comida_id),
        ciudad_id = COALESCE($6, ciudad_id),
        direccion = COALESCE($7, direccion),
        direccion_adicional = $8,
        barrio = COALESCE($9, barrio),
        latitud = COALESCE($10, latitud),
        longitud = COALESCE($11, longitud),
        telefono = COALESCE($12, telefono),
        telefono_2 = $13,
        whatsapp = COALESCE($14, whatsapp),
        email = $15,
        sitio_web = $16,
        instagram = $17,
        facebook = $18,
        tiktok = $19,
        imagen_principal = COALESCE($20, imagen_principal),
        imagen_portada = $21,
        logo_url = $22,
        horarios = COALESCE($23, horarios),
        rango_precios = COALESCE($24, rango_precios),
        activo = COALESCE($25, activo),
        verificado = COALESCE($26, verificado),
        destacado = COALESCE($27, destacado),
        updated_at = NOW()
      WHERE id = $28
    `, [
      nombre, descripcion, descripcion_corta, tipo_id, tipo_comida_id,
      ciudad_id, direccion, direccion_adicional, barrio, latitud, longitud,
      telefono, telefono_2, whatsapp, email, sitio_web,
      instagram, facebook, tiktok,
      imagen_principal, imagen_portada, logo_url,
      horarios ? JSON.stringify(horarios) : null, rango_precios,
      activo, verificado, destacado,
      id
    ]);
    
    // Actualizar etiquetas
    if (etiquetas_ids !== undefined) {
      await client.query('DELETE FROM establecimientos_etiquetas WHERE establecimiento_id = $1', [id]);
      for (const etiquetaId of (etiquetas_ids || [])) {
        await client.query(`
          INSERT INTO establecimientos_etiquetas (establecimiento_id, etiqueta_id)
          VALUES ($1, $2)
        `, [id, etiquetaId]);
      }
    }
    
    // Actualizar categorías especiales
    if (categorias_especiales_ids !== undefined) {
      await client.query('DELETE FROM establecimientos_categorias_especiales WHERE establecimiento_id = $1', [id]);
      for (const categoriaId of (categorias_especiales_ids || [])) {
        await client.query(`
          INSERT INTO establecimientos_categorias_especiales (establecimiento_id, categoria_especial_id)
          VALUES ($1, $2)
        `, [id, categoriaId]);
      }
    }
    
    // Actualizar galería
    if (galeria !== undefined) {
      await client.query('DELETE FROM galeria_fotos WHERE establecimiento_id = $1', [id]);
      for (let i = 0; i < (galeria || []).length; i++) {
        const foto = galeria[i];
        await client.query(`
          INSERT INTO galeria_fotos (establecimiento_id, url, url_thumbnail, titulo, orden)
          VALUES ($1, $2, $3, $4, $5)
        `, [id, foto.url, foto.url_thumbnail, foto.titulo, i]);
      }
    }
    
    await client.query('COMMIT');
    
    res.json({ mensaje: 'Establecimiento actualizado exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando establecimiento:', error);
    res.status(500).json({ error: 'Error al actualizar establecimiento' });
  } finally {
    client.release();
  }
});

// Eliminar establecimiento
router.delete('/establecimientos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete
    await query('UPDATE establecimientos SET activo = false WHERE id = $1', [id]);
    
    res.json({ mensaje: 'Establecimiento eliminado' });
  } catch (error) {
    console.error('Error eliminando establecimiento:', error);
    res.status(500).json({ error: 'Error al eliminar establecimiento' });
  }
});

// Cambiar estado (activar/desactivar/verificar/destacar)
router.patch('/establecimientos/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { activo, verificado, destacado } = req.body;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (activo !== undefined) {
      updates.push(`activo = $${paramIndex}`);
      params.push(activo);
      paramIndex++;
    }
    if (verificado !== undefined) {
      updates.push(`verificado = $${paramIndex}`);
      params.push(verificado);
      paramIndex++;
    }
    if (destacado !== undefined) {
      updates.push(`destacado = $${paramIndex}`);
      params.push(destacado);
      paramIndex++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    
    params.push(id);
    
    await query(`
      UPDATE establecimientos SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
    `, params);
    
    res.json({ mensaje: 'Estado actualizado' });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// =====================================================
// USUARIOS
// =====================================================

router.get('/usuarios', async (req, res) => {
  try {
    const { busqueda, rol, pagina = 1, limite = 20 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    if (busqueda) {
      whereClause += ` AND (nombre ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${busqueda}%`);
      paramIndex++;
    }
    
    if (rol) {
      whereClause += ` AND rol = $${paramIndex}`;
      params.push(rol);
      paramIndex++;
    }
    
    const result = await query(`
      SELECT 
        id, email, nombre, apellido, avatar_url, rol, activo,
        created_at, ultimo_login,
        (SELECT COUNT(*) FROM valoraciones WHERE usuario_id = usuarios.id) as total_valoraciones
      FROM usuarios
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, parseInt(limite), offset]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
});

router.patch('/usuarios/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { activo, rol } = req.body;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (activo !== undefined) {
      updates.push(`activo = $${paramIndex}`);
      params.push(activo);
      paramIndex++;
    }
    if (rol !== undefined && req.usuario.rol === 'superadmin') {
      updates.push(`rol = $${paramIndex}`);
      params.push(rol);
      paramIndex++;
    }
    
    params.push(id);
    
    await query(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${paramIndex}`, params);
    
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// =====================================================
// VALORACIONES - MODERACIÓN
// =====================================================

router.get('/valoraciones', async (req, res) => {
  try {
    const { estado, pagina = 1, limite = 20 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (estado) {
      whereClause += ' AND v.estado = $1';
      params.push(estado);
    }
    
    const result = await query(`
      SELECT 
        v.*, 
        u.nombre as usuario_nombre, u.email as usuario_email,
        e.nombre as establecimiento_nombre, e.slug as establecimiento_slug
      FROM valoraciones v
      JOIN usuarios u ON u.id = v.usuario_id
      JOIN establecimientos e ON e.id = v.establecimiento_id
      ${whereClause}
      ORDER BY v.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, [...params, parseInt(limite), offset]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando valoraciones:', error);
    res.status(500).json({ error: 'Error al listar valoraciones' });
  }
});

router.patch('/valoraciones/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    await query('UPDATE valoraciones SET estado = $1 WHERE id = $2', [estado, id]);
    
    res.json({ mensaje: 'Valoración actualizada' });
  } catch (error) {
    console.error('Error actualizando valoración:', error);
    res.status(500).json({ error: 'Error al actualizar valoración' });
  }
});

// =====================================================
// CIUDADES
// =====================================================

router.get('/ciudades', async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, d.nombre as departamento_nombre,
        (SELECT COUNT(*) FROM establecimientos WHERE ciudad_id = c.id) as total_establecimientos
      FROM ciudades c
      LEFT JOIN departamentos d ON d.id = c.departamento_id
      ORDER BY c.orden ASC, c.nombre ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando ciudades:', error);
    res.status(500).json({ error: 'Error al listar ciudades' });
  }
});

router.post('/ciudades', async (req, res) => {
  try {
    const { nombre, departamento_id, slug, imagen_url, descripcion, latitud, longitud, orden } = req.body;
    
    const result = await query(`
      INSERT INTO ciudades (nombre, departamento_id, slug, imagen_url, descripcion, latitud, longitud, orden)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [nombre, departamento_id, slug, imagen_url, descripcion, latitud, longitud, orden || 0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando ciudad:', error);
    res.status(500).json({ error: 'Error al crear ciudad' });
  }
});

router.put('/ciudades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, imagen_url, descripcion, orden, activo } = req.body;
    
    await query(`
      UPDATE ciudades SET
        nombre = COALESCE($1, nombre),
        imagen_url = COALESCE($2, imagen_url),
        descripcion = COALESCE($3, descripcion),
        orden = COALESCE($4, orden),
        activo = COALESCE($5, activo)
      WHERE id = $6
    `, [nombre, imagen_url, descripcion, orden, activo, id]);
    
    res.json({ mensaje: 'Ciudad actualizada' });
  } catch (error) {
    console.error('Error actualizando ciudad:', error);
    res.status(500).json({ error: 'Error al actualizar ciudad' });
  }
});

// =====================================================
// BANNERS
// =====================================================

router.get('/banners', async (req, res) => {
  try {
    const result = await query(`
      SELECT b.*, c.nombre as ciudad_nombre
      FROM banners b
      LEFT JOIN ciudades c ON c.id = b.ciudad_id
      ORDER BY b.ubicacion, b.orden ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listando banners:', error);
    res.status(500).json({ error: 'Error al listar banners' });
  }
});

router.post('/banners', async (req, res) => {
  try {
    const {
      titulo, subtitulo, imagen_url, imagen_mobile_url,
      enlace_url, enlace_tipo, enlace_id, ubicacion,
      ciudad_id, fecha_inicio, fecha_fin, orden
    } = req.body;
    
    const result = await query(`
      INSERT INTO banners (
        titulo, subtitulo, imagen_url, imagen_mobile_url,
        enlace_url, enlace_tipo, enlace_id, ubicacion,
        ciudad_id, fecha_inicio, fecha_fin, orden
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      titulo, subtitulo, imagen_url, imagen_mobile_url,
      enlace_url, enlace_tipo, enlace_id, ubicacion || 'home',
      ciudad_id, fecha_inicio, fecha_fin, orden || 0
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando banner:', error);
    res.status(500).json({ error: 'Error al crear banner' });
  }
});

router.put('/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, subtitulo, imagen_url, enlace_url, activo, orden } = req.body;
    
    await query(`
      UPDATE banners SET
        titulo = COALESCE($1, titulo),
        subtitulo = $2,
        imagen_url = COALESCE($3, imagen_url),
        enlace_url = $4,
        activo = COALESCE($5, activo),
        orden = COALESCE($6, orden),
        updated_at = NOW()
      WHERE id = $7
    `, [titulo, subtitulo, imagen_url, enlace_url, activo, orden, id]);
    
    res.json({ mensaje: 'Banner actualizado' });
  } catch (error) {
    console.error('Error actualizando banner:', error);
    res.status(500).json({ error: 'Error al actualizar banner' });
  }
});

router.delete('/banners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM banners WHERE id = $1', [id]);
    res.json({ mensaje: 'Banner eliminado' });
  } catch (error) {
    console.error('Error eliminando banner:', error);
    res.status(500).json({ error: 'Error al eliminar banner' });
  }
});

// =====================================================
// ETIQUETAS
// =====================================================

router.post('/etiquetas', async (req, res) => {
  try {
    const { nombre, slug, icono, categoria, orden } = req.body;
    
    const result = await query(`
      INSERT INTO etiquetas (nombre, slug, icono, categoria, orden)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nombre, slug, icono, categoria, orden || 0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando etiqueta:', error);
    res.status(500).json({ error: 'Error al crear etiqueta' });
  }
});

// =====================================================
// CATEGORÍAS ESPECIALES
// =====================================================

router.post('/categorias-especiales', async (req, res) => {
  try {
    const { nombre, slug, descripcion, icono, color, imagen_url, orden } = req.body;
    
    const result = await query(`
      INSERT INTO categorias_especiales (nombre, slug, descripcion, icono, color, imagen_url, orden)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [nombre, slug, descripcion, icono, color, imagen_url, orden || 0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// =====================================================
// NOTIFICACIONES MASIVAS
// =====================================================

router.post('/notificaciones/enviar', async (req, res) => {
  try {
    const { titulo, mensaje, ciudad_id } = req.body;
    
    let whereClause = 'WHERE push_token IS NOT NULL AND notificaciones_habilitadas = true AND activo = true';
    const params = [];
    
    if (ciudad_id) {
      // Filtrar por usuarios que han visitado establecimientos en esa ciudad
      // (Simplificado: enviar a todos por ahora)
    }
    
    const usuariosResult = await query(`
      SELECT id, push_token FROM usuarios ${whereClause}
    `, params);
    
    const tokens = usuariosResult.rows.map(u => u.push_token).filter(Boolean);
    
    if (tokens.length > 0) {
      await sendPushToMultiple(tokens, titulo, mensaje, { tipo: 'promocion' });
      
      // Guardar en base de datos
      for (const usuario of usuariosResult.rows) {
        await query(`
          INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, enviada_push)
          VALUES ($1, 'promocion', $2, $3, true)
        `, [usuario.id, titulo, mensaje]);
      }
    }
    
    res.json({ 
      mensaje: 'Notificación enviada',
      enviadas: tokens.length
    });
  } catch (error) {
    console.error('Error enviando notificación:', error);
    res.status(500).json({ error: 'Error al enviar notificación' });
  }
});

module.exports = router;
