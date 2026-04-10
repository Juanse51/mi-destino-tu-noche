fetch('https://mi-destino-api.onrender.com/api/v1/establecimientos?limite=1000&busqueda=BBC')
  .then(r => r.json())
  .then(d => {
    d.establecimientos.forEach(e => {
      console.log(e.nombre, '|', e.ciudad_nombre, '|', e.id);
    });
  });
