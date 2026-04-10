const API = 'https://mi-destino-api.onrender.com/api/v1';

async function main() {
  const res = await fetch(API + '/establecimientos?limite=1000');
  const data = await res.json();
  const ests = data.establecimientos;
  
  // Encontrar duplicados exactos (mismo nombre, misma ciudad)
  const seen = {};
  const duplicados = [];
  const sedes = {};
  
  ests.forEach(e => {
    const key = e.nombre.trim().toLowerCase() + '|' + (e.ciudad_nombre || '');
    if (seen[key]) {
      duplicados.push({ eliminar: e.id, nombre: e.nombre, ciudad: e.ciudad_nombre, mantener: seen[key] });
    } else {
      seen[key] = e.id;
    }
  });
  
  console.log('=== DUPLICADOS A ELIMINAR (desactivar) ===');
  const deleteIds = [];
  duplicados.forEach(d => {
    console.log('DELETE:', d.nombre, '|', d.ciudad, '| ID:', d.eliminar);
    deleteIds.push(d.eliminar);
  });
  
  console.log('\n=== SQL PARA DESACTIVAR DUPLICADOS ===');
  if (deleteIds.length > 0) {
    console.log("UPDATE establecimientos SET activo = false WHERE id IN ('" + deleteIds.join("','") + "');");
  }
  
  // Sedes reales
  console.log('\n=== SQL PARA VINCULAR SEDES ===');
  
  // LA PLAZA DE ANDRES - primera es principal
  console.log("-- LA PLAZA DE ANDRES");
  console.log("UPDATE establecimientos SET sede_principal_id = '9f12b1df-4a79-4d29-abba-2a846805760e' WHERE id = '633c0f83-3f9a-4e40-929f-e590e2f849cb';");
  
  // STORIA D'AMORE - primera es principal
  console.log("-- STORIA D'AMORE");
  const storiaIds = ['448a4376-e0a2-4bc9-8959-e7078c6cc02c','b6731829-fd3c-4eb4-9093-766b1552e168','75fdd31a-a5c6-4bc5-b009-aeb5146d8a06','d4b4f0c1-4018-418e-a68b-31e7346da22f'];
  storiaIds.forEach(id => {
    console.log("UPDATE establecimientos SET sede_principal_id = 'e4b52a88-b535-4c41-bbd2-1d22294f21cc' WHERE id = '" + id + "';");
  });
  
  // FULL 80S - primera es principal
  console.log("-- FULL 80S");
  console.log("UPDATE establecimientos SET sede_principal_id = '08f0ac84-09c2-4fa4-8efa-96a9b34a6689' WHERE id = '5c24853f-3a6f-473a-b520-2bdba359cf84';");
}

main();
