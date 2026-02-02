// =====================================================
// Rutas de Establecimientos
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { verificarToken, tokenOpcional } = require('../middleware/auth');

// =====================================================
// OBTENER TODOS (con filtros y paginación)
// =====================================================
router.get('/', tokenOpcional, async (req, res) => {
  try {
    const {
      ciudad,
      tipo,
      tipo_comida,
      categoria_especial,
      etiquetas,
      busqueda,
      rango_precios,
      valoracion_min,
      latitud,
      longitud,
      radio = 5000, // metros
      destacados,
      verificados,
      ordenar = 'relevancia',
      pagina = 1,
      limite = 20
    } = req.query;
    
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    const params = [];
    let paramIndex = 1;
    
    let whereClause = 'WHERE e.activo = true';
    
    // Filtros
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
    
    if (tipo_comida) {
      whereClause += ` AND tc.slug = $${paramIndex}`;
      params.push(tipo_comida);
      paramIndex++;
    }
    
    if (categoria_especial) {
      whereClause += ` AND EXISTS (
        SELECT 1 FROM establecimientos_categorias_especiales ece
        JOIN categorias_especiales ce ON ce.id = ece.categoria_especial_id
        WHERE ece.establecimiento_id = e.id AND ce.slug = $${paramIndex}
      )`;
      params.push(categoria_especial);
      paramIndex++;
    }
    
    if (etiquetas) {
      const etiquetasArray = etiquetas.split(',');
      whereClause += ` AND EXISTS (
        SELECT 1 FROM establecimientos_etiquetas ee
        JOIN etiquetas et ON et.id = ee.etiqueta_id
        WHERE ee.establecimiento_id = e.id AND et.slug = ANY($${paramIndex})
      )`;
      params.push(etiquetasArray);
      paramIndex++;
    }
    
    if (busqueda) {
      whereClause += ` AND (
        e.nombre ILIKE $${paramIndex}
        OR e.descripcion ILIKE $${paramIndex}
        OR tc.nombre ILIKE $${paramIndex}
      )`;
      params.push(`%${busqueda}%`);
      paramIndex++;
    }
    
    if (rango_precios) {
      whereClause += ` AND e.rango_precios = $${paramIndex}`;
      params.push(parseInt(rango_precios));
      paramIndex++;
    }
    
    if (valoracion_min) {
      whereClause += ` AND e.valoracion_promedio >= $${paramIndex}`;
      params.push(parseFloat(valoracion_min));
      paramIndex++;
    }
    
    if (destacados === 'true') {
      whereClause += ' AND e.destacado = true';
    }
    
    if (verificados === 'true') {
      whereClause += ' AND e.verificado = true';
    }
    
    // Geolocalización
    let distanciaSelect = '';
    let distanciaOrder = '';
    if (latitud && longitud) {
      distanciaSelect = `, ST_Distance(
        e.ubicacion::geography,
        ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326)::geography
      ) as distancia`;
      params.push(parseFloat(longitud), parseFloat(latitud));
      
      whereClause += ` AND ST_DWithin(
        e.ubicacion::geography,
        ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326)::geography,
        $${paramIndex + 2}
      )`;
      params.push(parseFloat(radio));
      paramIndex += 3;
      
      distanciaOrder = 'distancia ASC,';
    }
    
    // Ordenamiento
    let orderClause = 'ORDER BY ';
    switch (ordenar) {
      case 'valoracion':
        orderClause += 'e.valoracion_promedio DESC NULLS LAST';
        break;
      case 'precio_asc':
        orderClause += 'e.rango_precios ASC';
        break;
      case 'precio_desc':
        orderClause += 'e.rango_precios DESC';
        break;
      case 'nombre':
        orderClause += 'e.nombre ASC';
        break;
      case 'recientes':
        orderClause += 'e.created_at DESC';
        break;
      case 'cercanos':
        if (distanciaOrder) {
          orderClause += distanciaOrder;
        }
        orderClause += 'e.valoracion_promedio DESC NULLS LAST';
        break;
      default: // relevancia
        orderClause += `e.destacado DESC, e.verificado DESC, ${distanciaOrder} e.valoracion_promedio DESC NULLS LAST`;
    }
    
    // Query principal
    const queryText = `
      SELECT 
        e.id,
        e.nombre,
        e.slug,
        e.descripcion_corta,
        e.imagen_principal,
        e.direccion,
        e.barrio,
        e.rango_precios,
        e.valoracion_promedio,
        e.total_valoraciones,
        e.latitud,
        e.longitud,
        e.destacado,
        e.verificado,
        te.nombre as tipo_nombre,
        te.slug as tipo_slug,
        te.icono as tipo_icono,
        te.color as tipo_color,
        tc.nombre as tipo_comida_nombre,
        c.nombre as ciudad_nombre,
        c.slug as ciudad_slug
        ${distanciaSelect}
      FROM establecimientos e
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN tipos_comida tc ON tc.id = e.tipo_comida_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    params.push(parseInt(limite), offset);
    
    const result = await query(queryText, params);
    
    // Obtener total para paginación
    const countQuery = `
      SELECT COUNT(*) as total
      FROM establecimientos e
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN tipos_comida tc ON tc.id = e.tipo_comida_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      ${whereClause}
    `;
    const countResult = await query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);
    
    // Obtener etiquetas para cada establecimiento
    if (result.rows.length > 0) {
      const ids = result.rows.map(e => e.id);
      const etiquetasResult = await query(`
        SELECT ee.establecimiento_id, et.nombre, et.slug, et.icono
        FROM establecimientos_etiquetas ee
        JOIN etiquetas et ON et.id = ee.etiqueta_id
        WHERE ee.establecimiento_id = ANY($1)
      `, [ids]);
      
      const etiquetasMap = {};
      etiquetasResult.rows.forEach(e => {
        if (!etiquetasMap[e.establecimiento_id]) {
          etiquetasMap[e.establecimiento_id] = [];
        }
        etiquetasMap[e.establecimiento_id].push({
          nombre: e.nombre,
          slug: e.slug,
          icono: e.icono
        });
      });
      
      result.rows.forEach(e => {
        e.etiquetas = etiquetasMap[e.id] || [];
      });
    }
    
    // Si el usuario está autenticado, agregar info de favoritos
    if (req.usuario && result.rows.length > 0) {
      const ids = result.rows.map(e => e.id);
      const favoritosResult = await query(`
        SELECT establecimiento_id FROM favoritos
        WHERE usuario_id = $1 AND establecimiento_id = ANY($2)
      `, [req.usuario.id, ids]);
      
      const favoritosSet = new Set(favoritosResult.rows.map(f => f.establecimiento_id));
      result.rows.forEach(e => {
        e.es_favorito = favoritosSet.has(e.id);
      });
    }
    
    res.json({
      establecimientos: result.rows,
      paginacion: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        paginas: Math.ceil(total / parseInt(limite))
      }
    });
  } catch (error) {
    console.error('Error obteniendo establecimientos:', error);
    res.status(500).json({ error: 'Error al obtener establecimientos' });
  }
});

// =====================================================
// OBTENER DESTACADOS
// =====================================================
router.get('/destacados', tokenOpcional, async (req, res) => {
  try {
    const { ciudad, limite = 10 } = req.query;
    
    let whereClause = 'WHERE e.activo = true AND e.destacado = true';
    const params = [parseInt(limite)];
    
    if (ciudad) {
      whereClause += ' AND c.slug = $2';
      params.push(ciudad);
    }
    
    const result = await query(`
      SELECT 
        e.id, e.nombre, e.slug, e.descripcion_corta, e.imagen_principal,
        e.rango_precios, e.valoracion_promedio, e.total_valoraciones,
        te.nombre as tipo_nombre, te.icono as tipo_icono, te.color as tipo_color,
        c.nombre as ciudad_nombre
      FROM establecimientos e
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      ${whereClause}
      ORDER BY e.valoracion_promedio DESC NULLS LAST
      LIMIT $1
    `, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo destacados:', error);
    res.status(500).json({ error: 'Error al obtener destacados' });
  }
});

// =====================================================
// OBTENER CERCANOS
// =====================================================
router.get('/cercanos', tokenOpcional, async (req, res) => {
  try {
    const { latitud, longitud, radio = 3000, limite = 10 } = req.query;
    
    if (!latitud || !longitud) {
      return res.status(400).json({ error: 'Se requieren latitud y longitud' });
    }
    
    const result = await query(`
      SELECT 
        e.id, e.nombre, e.slug, e.descripcion_corta, e.imagen_principal,
        e.direccion, e.rango_precios, e.valoracion_promedio, e.total_valoraciones,
        e.latitud, e.longitud,
        te.nombre as tipo_nombre, te.icono as tipo_icono, te.color as tipo_color,
        c.nombre as ciudad_nombre,
        ST_Distance(
          e.ubicacion::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) as distancia
      FROM establecimientos e
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      WHERE e.activo = true
        AND ST_DWithin(
          e.ubicacion::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
      ORDER BY distancia ASC
      LIMIT $4
    `, [parseFloat(longitud), parseFloat(latitud), parseFloat(radio), parseInt(limite)]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo cercanos:', error);
    res.status(500).json({ error: 'Error al obtener lugares cercanos' });
  }
});

// =====================================================
// OBTENER POR CATEGORÍA ESPECIAL
// =====================================================
router.get('/categoria/:slug', tokenOpcional, async (req, res) => {
  try {
    const { slug } = req.params;
    const { ciudad, pagina = 1, limite = 20 } = req.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    
    let whereClause = 'WHERE e.activo = true AND ce.slug = $1';
    const params = [slug, parseInt(limite), offset];
    
    if (ciudad) {
      whereClause += ' AND c.slug = $4';
      params.push(ciudad);
    }
    
    const result = await query(`
      SELECT 
        e.id, e.nombre, e.slug, e.descripcion_corta, e.imagen_principal,
        e.direccion, e.rango_precios, e.valoracion_promedio, e.total_valoraciones,
        te.nombre as tipo_nombre, te.icono as tipo_icono, te.color as tipo_color,
        tc.nombre as tipo_comida_nombre,
        c.nombre as ciudad_nombre,
        ce.nombre as categoria_nombre, ce.icono as categoria_icono, ce.color as categoria_color
      FROM establecimientos e
      JOIN establecimientos_categorias_especiales ece ON ece.establecimiento_id = e.id
      JOIN categorias_especiales ce ON ce.id = ece.categoria_especial_id
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN tipos_comida tc ON tc.id = e.tipo_comida_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      ${whereClause}
      ORDER BY e.valoracion_promedio DESC NULLS LAST
      LIMIT $2 OFFSET $3
    `, params);
    
    // Obtener info de la categoría
    const categoriaResult = await query(`
      SELECT * FROM categorias_especiales WHERE slug = $1
    `, [slug]);
    
    res.json({
      categoria: categoriaResult.rows[0] || null,
      establecimientos: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo por categoría:', error);
    res.status(500).json({ error: 'Error al obtener establecimientos' });
  }
});

// =====================================================
// OBTENER DETALLE POR SLUG
// =====================================================
router.get('/:slug', tokenOpcional, async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await query(`
      SELECT 
        e.*,
        te.nombre as tipo_nombre,
        te.slug as tipo_slug,
        te.icono as tipo_icono,
        te.color as tipo_color,
        tc.nombre as tipo_comida_nombre,
        tc.slug as tipo_comida_slug,
        c.nombre as ciudad_nombre,
        c.slug as ciudad_slug,
        d.nombre as departamento_nombre
      FROM establecimientos e
      LEFT JOIN tipos_establecimiento te ON te.id = e.tipo_id
      LEFT JOIN tipos_comida tc ON tc.id = e.tipo_comida_id
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      LEFT JOIN departamentos d ON d.id = c.departamento_id
      WHERE e.slug = $1 AND e.activo = true
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Establecimiento no encontrado' });
    }
    
    const establecimiento = result.rows[0];
    
    // Obtener galería de fotos
    const fotosResult = await query(`
      SELECT id, url, url_thumbnail, titulo, descripcion, orden
      FROM galeria_fotos
      WHERE establecimiento_id = $1 AND activo = true
      ORDER BY orden ASC, created_at ASC
    `, [establecimiento.id]);
    establecimiento.galeria = fotosResult.rows;
    
    // Obtener etiquetas
    const etiquetasResult = await query(`
      SELECT et.nombre, et.slug, et.icono, et.categoria
      FROM establecimientos_etiquetas ee
      JOIN etiquetas et ON et.id = ee.etiqueta_id
      WHERE ee.establecimiento_id = $1
      ORDER BY et.orden ASC
    `, [establecimiento.id]);
    establecimiento.etiquetas = etiquetasResult.rows;
    
    // Obtener categorías especiales
    const categoriasResult = await query(`
      SELECT ce.nombre, ce.slug, ce.icono, ce.color
      FROM establecimientos_categorias_especiales ece
      JOIN categorias_especiales ce ON ce.id = ece.categoria_especial_id
      WHERE ece.establecimiento_id = $1
    `, [establecimiento.id]);
    establecimiento.categorias_especiales = categoriasResult.rows;
    
    // Obtener menú
    const menuResult = await query(`
      SELECT 
        mc.id as categoria_id, mc.nombre as categoria_nombre, mc.descripcion as categoria_descripcion,
        mi.id, mi.nombre, mi.descripcion, mi.precio, mi.precio_promocion, mi.imagen_url,
        mi.disponible, mi.destacado, mi.vegetariano, mi.vegano, mi.sin_gluten, mi.picante
      FROM menu_categorias mc
      LEFT JOIN menu_items mi ON mi.categoria_id = mc.id AND mi.disponible = true
      WHERE mc.establecimiento_id = $1 AND mc.activo = true
      ORDER BY mc.orden ASC, mi.orden ASC
    `, [establecimiento.id]);
    
    // Agrupar menú por categorías
    const menuMap = {};
    menuResult.rows.forEach(item => {
      if (!menuMap[item.categoria_id]) {
        menuMap[item.categoria_id] = {
          id: item.categoria_id,
          nombre: item.categoria_nombre,
          descripcion: item.categoria_descripcion,
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
          destacado: item.destacado,
          vegetariano: item.vegetariano,
          vegano: item.vegano,
          sin_gluten: item.sin_gluten,
          picante: item.picante
        });
      }
    });
    establecimiento.menu = Object.values(menuMap);
    
    // Obtener últimas valoraciones
    const valoracionesResult = await query(`
      SELECT 
        v.id, v.puntuacion, v.titulo, v.comentario, v.created_at,
        v.respuesta, v.respuesta_fecha,
        u.nombre as usuario_nombre, u.avatar_url as usuario_avatar
      FROM valoraciones v
      JOIN usuarios u ON u.id = v.usuario_id
      WHERE v.establecimiento_id = $1 AND v.estado = 'publicada'
      ORDER BY v.created_at DESC
      LIMIT 5
    `, [establecimiento.id]);
    establecimiento.valoraciones_recientes = valoracionesResult.rows;
    
    // Si el usuario está autenticado
    if (req.usuario) {
      // Verificar si es favorito
      const favResult = await query(
        'SELECT id FROM favoritos WHERE usuario_id = $1 AND establecimiento_id = $2',
        [req.usuario.id, establecimiento.id]
      );
      establecimiento.es_favorito = favResult.rows.length > 0;
      
      // Verificar si está en "quiero ir"
      const quieroIrResult = await query(
        'SELECT id FROM quiero_ir WHERE usuario_id = $1 AND establecimiento_id = $2',
        [req.usuario.id, establecimiento.id]
      );
      establecimiento.en_quiero_ir = quieroIrResult.rows.length > 0;
      
      // Verificar si ya valoró
      const miValoracionResult = await query(
        'SELECT id, puntuacion FROM valoraciones WHERE usuario_id = $1 AND establecimiento_id = $2',
        [req.usuario.id, establecimiento.id]
      );
      establecimiento.mi_valoracion = miValoracionResult.rows[0] || null;
      
      // Registrar visita en historial
      await query(`
        INSERT INTO historial_visitas (usuario_id, establecimiento_id, tipo_visita)
        VALUES ($1, $2, 'vista')
      `, [req.usuario.id, establecimiento.id]);
    }
    
    // Incrementar contador de visitas
    await query('UPDATE establecimientos SET total_visitas = total_visitas + 1 WHERE id = $1', [establecimiento.id]);
    
    // Limpiar campos sensibles
    delete establecimiento.propietario_id;
    
    res.json(establecimiento);
  } catch (error) {
    console.error('Error obteniendo establecimiento:', error);
    res.status(500).json({ error: 'Error al obtener establecimiento' });
  }
});

// =====================================================
// CREAR ESTABLECIMIENTO (Admin)
// =====================================================
router.post('/', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { nombre, slug, tipo, ciudad, direccion, descripcion, telefono, whatsapp, instagram, activo, verificado, destacado } = req.body;

    if (!nombre || !tipo || !ciudad || !direccion) {
      return res.status(400).json({ error: 'Nombre, tipo, ciudad y dirección son requeridos' });
    }

    const finalSlug = slug || nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Obtener tipo_id
    const tipoResult = await query('SELECT id FROM tipos_establecimiento WHERE nombre ILIKE $1 LIMIT 1', [tipo]);
    if (tipoResult.rows.length === 0) {
      return res.status(400).json({ error: 'Tipo no válido' });
    }

    // Obtener ciudad_id
    const ciudadResult = await query('SELECT id FROM ciudades WHERE nombre ILIKE $1 LIMIT 1', [ciudad]);
    if (ciudadResult.rows.length === 0) {
      return res.status(400).json({ error: 'Ciudad no válida' });
    }

    const result = await query(
      `INSERT INTO establecimientos (nombre, slug, tipo_id, ciudad_id, direccion, descripcion, telefono, whatsapp, instagram, activo, verificado, destacado, latitud, longitud)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 4.533, -75.681)
       RETURNING id, nombre, slug, activo, verificado, destacado`,
      [nombre, finalSlug, tipoResult.rows[0].id, ciudadResult.rows[0].id, direccion, descripcion || '', telefono || '', whatsapp || '', instagram || '', activo !== false, verificado || false, destacado || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando establecimiento:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ya existe un establecimiento con ese slug' });
    }
    res.status(500).json({ error: 'Error al crear establecimiento' });
  }
});

// =====================================================
// ACTUALIZAR ESTABLECIMIENTO (Admin)
// =====================================================
router.put('/:id', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { id } = req.params;
    const { nombre, slug, tipo, ciudad, direccion, descripcion, telefono, whatsapp, instagram, activo, verificado, destacado, imagen_principal } = req.body;

    // Obtener tipo_id si se envió tipo
    let tipoId = null;
    if (tipo) {
      const tipoResult = await query('SELECT id FROM tipos_establecimiento WHERE nombre ILIKE $1 LIMIT 1', [tipo]);
      if (tipoResult.rows.length > 0) tipoId = tipoResult.rows[0].id;
    }

    // Obtener ciudad_id si se envió ciudad
    let ciudadId = null;
    if (ciudad) {
      const ciudadResult = await query('SELECT id FROM ciudades WHERE nombre ILIKE $1 LIMIT 1', [ciudad]);
      if (ciudadResult.rows.length > 0) ciudadId = ciudadResult.rows[0].id;
    }

    const result = await query(
      `UPDATE establecimientos SET
        nombre = COALESCE($1, nombre),
        slug = COALESCE($2, slug),
        tipo_id = COALESCE($3, tipo_id),
        ciudad_id = COALESCE($4, ciudad_id),
        direccion = COALESCE($5, direccion),
        descripcion = COALESCE($6, descripcion),
        telefono = COALESCE($7, telefono),
        whatsapp = COALESCE($8, whatsapp),
        instagram = COALESCE($9, instagram),
        activo = COALESCE($10, activo),
        verificado = COALESCE($11, verificado),
        destacado = COALESCE($12, destacado),
        imagen_principal = COALESCE($13, imagen_principal),
        updated_at = NOW()
       WHERE id = $14
       RETURNING id, nombre, slug, activo, verificado, destacado`,
      [nombre || null, slug || null, tipoId, ciudadId, direccion || null, descripcion || null, telefono || null, whatsapp || null, instagram || null, activo, verificado, destacado, imagen_principal || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Establecimiento no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando establecimiento:', error);
    res.status(500).json({ error: 'Error al actualizar establecimiento' });
  }
});

// =====================================================
// ELIMINAR ESTABLECIMIENTO (Admin)
// =====================================================
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const { id } = req.params;
    const result = await query('DELETE FROM establecimientos WHERE id = $1 RETURNING id, nombre', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Establecimiento no encontrado' });
    }

    res.json({ message: 'Establecimiento eliminado', ...result.rows[0] });
  } catch (error) {
    console.error('Error eliminando establecimiento:', error);
    res.status(500).json({ error: 'Error al eliminar establecimiento' });
  }
});

module.exports = router;
