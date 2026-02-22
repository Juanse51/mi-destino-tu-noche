// fix-sedes-backend.js
// Run from repo root: node fix-sedes-backend.js
const fs = require('fs');
const file = 'backend/src/routes/establecimientos.js';
let code = fs.readFileSync(file, 'utf8');

// 1. In GET / (listado general) - hide sedes secundarias unless filtering by city
// After "let whereClause = 'WHERE e.activo = true';" add sede filter
code = code.replace(
  "let whereClause = 'WHERE e.activo = true';",
  `let whereClause = 'WHERE e.activo = true';
    
    // Por defecto ocultar sedes secundarias en listado general
    // Si se filtra por ciudad, mostrar las sedes de esa ciudad
    if (!ciudad && !busqueda) {
      whereClause += ' AND e.sede_principal_id IS NULL';
    }`
);

// 2. In GET /:slug (detalle) - add sedes query after categorias_especiales
code = code.replace(
  "establecimiento.categorias_especiales = categoriasResult.rows;",
  `establecimiento.categorias_especiales = categoriasResult.rows;
    
    // Obtener sedes (si es sede principal)
    const sedesResult = await query(\`
      SELECT 
        e.id, e.nombre, e.slug, e.direccion, e.barrio, e.telefono, e.whatsapp,
        e.instagram, e.horarios, e.latitud, e.longitud, e.imagen_principal, e.logo_url,
        c.nombre as ciudad_nombre, c.slug as ciudad_slug
      FROM establecimientos e
      LEFT JOIN ciudades c ON c.id = e.ciudad_id
      WHERE e.sede_principal_id = $1 AND e.activo = true
      ORDER BY c.nombre ASC, e.nombre ASC
    \`, [establecimiento.id]);
    establecimiento.sedes = sedesResult.rows;
    
    // Si es sede secundaria, obtener info de la sede principal y las hermanas
    if (establecimiento.sede_principal_id) {
      const principalResult = await query(\`
        SELECT e.id, e.nombre, e.slug, e.imagen_principal, e.logo_url
        FROM establecimientos e WHERE e.id = $1
      \`, [establecimiento.sede_principal_id]);
      establecimiento.sede_principal = principalResult.rows[0] || null;
      
      const hermanasResult = await query(\`
        SELECT 
          e.id, e.nombre, e.slug, e.direccion, e.telefono, e.whatsapp,
          e.imagen_principal, e.logo_url,
          c.nombre as ciudad_nombre, c.slug as ciudad_slug
        FROM establecimientos e
        LEFT JOIN ciudades c ON c.id = e.ciudad_id
        WHERE (e.sede_principal_id = $1 OR e.id = $1) AND e.id != $2 AND e.activo = true
        ORDER BY c.nombre ASC, e.nombre ASC
      \`, [establecimiento.sede_principal_id, establecimiento.id]);
      establecimiento.otras_sedes = hermanasResult.rows;
    }`
);

// 3. Add sede_principal_id and activo to the SELECT in listado
code = code.replace(
  "e.destacado,\n        e.verificado,",
  "e.destacado,\n        e.verificado,\n        e.activo,\n        e.sede_principal_id,"
);

// 4. Add genero_musical to listado SELECT (was missing)
if (!code.includes("e.genero_musical,\n        te.nombre as tipo_nombre")) {
  code = code.replace(
    "te.nombre as tipo_nombre,",
    "e.genero_musical,\n        te.nombre as tipo_nombre,"
  );
}

fs.writeFileSync(file, code);
console.log('✅ Backend updated with sedes support');
console.log('\nNext steps:');
console.log('1. Run the SQL migration in Supabase');
console.log('2. git add . && git commit -m "Add sedes support" && git push');
