fetch('https://mi-destino-api.onrender.com/api/v1/establecimientos?limite=1000')
  .then(r => r.json())
  .then(d => {
    const nombres = {};
    d.establecimientos.forEach(e => {
      const base = e.nombre.split('-')[0].split('(')[0].trim().toLowerCase();
      if (!nombres[base]) nombres[base] = [];
      nombres[base].push({ id: e.id, nombre: e.nombre, ciudad: e.ciudad_nombre });
    });
    Object.entries(nombres)
      .filter(([k, v]) => v.length > 1)
      .forEach(([k, v]) => {
        console.log('\n' + k.toUpperCase() + ':');
        v.forEach(e => console.log('  ', e.nombre, '|', e.ciudad, '|', e.id));
      });
  });
