// Fix: Hacer que las funciones del API devuelvan response.data directamente
// Ejecutar: node fix-api-responses.js

const fs = require('fs');
const path = require('path');

const clientFile = path.join(__dirname, 'src/api/client.ts');
let content = fs.readFileSync(clientFile, 'utf8');

// Agregar interceptor que devuelve response.data directamente
// Reemplazar el interceptor de response existente
content = content.replace(
  `// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,`,
  `// Interceptor para extraer data y manejar errores
api.interceptors.response.use(
  (response) => response.data,`
);

fs.writeFileSync(clientFile, content);
console.log('✅ client.ts - interceptor actualizado para devolver response.data');

// Ahora hay que actualizar HomeScreen para que acceda a los datos correctamente
// Antes: destacados?.data (axios response.data) -> ahora: destacados (ya es el data)
const homeFile = path.join(__dirname, 'src/screens/HomeScreen.tsx');
let home = fs.readFileSync(homeFile, 'utf8');

// destacados?.data || [] -> destacados?.establecimientos || []
home = home.replace(
  'data={destacados?.data || []}',
  'data={destacados?.establecimientos || destacados || []}'
);

// ciudades?.data || [] -> ciudades || []
home = home.replace(
  /\(ciudades\?\.data \|\| \[\]\)/g,
  '(ciudades || [])'
);

// banners?.data && banners.data.length -> banners && banners.length
home = home.replace(
  'banners?.data && banners.data.length > 0',
  'banners && Array.isArray(banners) && banners.length > 0'
);
home = home.replace(
  '{banners.data.map(',
  '{banners.map('
);

// categoriasEspeciales?.data && -> categoriasEspeciales && 
home = home.replace(
  'categoriasEspeciales?.data && (',
  'categoriasEspeciales && Array.isArray(categoriasEspeciales) && ('
);
home = home.replace(
  '{categoriasEspeciales.data.map(',
  '{categoriasEspeciales.map('
);

// cercanos?.data && cercanos.data.length -> cercanos && cercanos.length
home = home.replace(
  'cercanos?.data && cercanos.data.length > 0',
  'cercanos && Array.isArray(cercanos) && cercanos.length > 0'
);
home = home.replace(
  /cercanos\.data\.slice/g,
  'cercanos.slice'
);

fs.writeFileSync(homeFile, home);
console.log('✅ HomeScreen.tsx - acceso a datos actualizado');

// Fix otros screens que usen ?.data
const screensDir = path.join(__dirname, 'src/screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  if (file === 'HomeScreen.tsx') continue;
  const filePath = path.join(screensDir, file);
  let sc = fs.readFileSync(filePath, 'utf8');
  if (sc.includes('?.data')) {
    // Reemplazar patrones comunes de axios response access
    sc = sc.replace(/(\w+)\?\.data\.data/g, '$1?.data'); // response.data.data -> response.data
    sc = sc.replace(/(\w+)\.data\.establecimientos/g, '$1?.establecimientos'); 
    fs.writeFileSync(filePath, sc);
    console.log(`✅ ${file} - patrones ?.data ajustados`);
  }
}

console.log('\n✅ Todos los archivos actualizados. Rebuild la app.');
