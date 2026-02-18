// Fix: Quitar el doble .data en todos los screens
// El interceptor de axios ahora devuelve response.data directamente
// Entonces useQuery ya recibe los datos sin el wrapper de axios
// Ejecutar: node fix-double-data.js

const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src/screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx'));

let totalChanges = 0;

for (const file of files) {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Pattern: data?.data?.establecimientos -> data?.establecimientos
  content = content.replace(/data\?\.data\?\.establecimientos/g, 'data?.establecimientos');
  
  // Pattern: data?.data?.something -> data?.something (generic)
  content = content.replace(/data\?\.data\?\./g, 'data?.');
  
  // Pattern: data?.data || -> data || 
  content = content.replace(/data\?\.data \|\|/g, 'data ||');
  
  // Pattern: data.data.map -> data.map (for cases where it's not optional chained)
  content = content.replace(/data\.data\.map/g, 'data.map');
  content = content.replace(/data\.data\.length/g, 'data.length');
  content = content.replace(/data\.data\.slice/g, 'data.slice');
  content = content.replace(/data\.data\.filter/g, 'data.filter');
  
  // Pattern: variable?.data?.establecimientos -> variable?.establecimientos
  // For named variables like destacados, cercanos, etc
  content = content.replace(/(\w+)\?\.data\?\.establecimientos/g, '$1?.establecimientos');
  content = content.replace(/(\w+)\?\.data\?\.(\w+)/g, '$1?.$2');
  
  // Pattern: variable?.data || -> variable || 
  content = content.replace(/(\w+)\?\.data \|\|/g, '$1 ||');
  
  // Pattern: variable.data.map -> variable.map
  content = content.replace(/(\w+)\.data\.map/g, '$1.map');
  content = content.replace(/(\w+)\.data\.length/g, '$1.length');
  content = content.replace(/(\w+)\.data\.slice/g, '$1.slice');
  content = content.replace(/(\w+)\.data\.filter/g, '$1.filter');
  content = content.replace(/(\w+)\.data\.forEach/g, '$1.forEach');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    const changes = original.split('.data').length - content.split('.data').length;
    console.log(`✅ ${file} - ${changes} cambios de .data`);
    totalChanges += changes;
  }
}

// Also fix HomeScreen specifically for patterns the regex might miss
const homeFile = path.join(screensDir, 'HomeScreen.tsx');
let home = fs.readFileSync(homeFile, 'utf8');

// Make sure destacados works: it returns { establecimientos: [...] } or just []
// data={destacados?.establecimientos || destacados || []}  should work
// But let's make sure the cercanos and banners patterns are right too

// If there are still any .data references that shouldn't be there
const remaining = home.match(/\w+\?\.data/g);
if (remaining) {
  console.log('\n⚠️ HomeScreen still has .data references:', [...new Set(remaining)]);
} else {
  console.log('\n✅ HomeScreen has no more .data references');
}

console.log(`\n✅ Total: ${totalChanges} cambios en ${files.length} archivos`);
