// add-cadenas-djs.js
// Run from project root: node add-cadenas-djs.js
const fs = require('fs');
const file = 'web/src/app/page.tsx';
let p = fs.readFileSync(file, 'utf8');

// 1. Add cadenas state
p = p.replace(
  'const [destacados, setDestacados] = useState<any[]>([])',
  `const [destacados, setDestacados] = useState<any[]>([])
  const [cadenas, setCadenas] = useState<any[]>([])`
);

// 2. Add cadenas fetch
p = p.replace(
  '// Cargar destacados del API',
  `// Cargar cadenas (sedes principales)
    Promise.all([
      fetch(\`\${API_URL}/establecimientos/bogota-beer-company\`).then(r=>r.json()),
      fetch(\`\${API_URL}/establecimientos/la-plaza-de-andres-el-retiro\`).then(r=>r.json()),
      fetch(\`\${API_URL}/establecimientos/storia-d-amore-cali\`).then(r=>r.json()),
      fetch(\`\${API_URL}/establecimientos/full-80s-cll-118\`).then(r=>r.json()),
    ]).then(results => {
      setCadenas(results.filter(r => r && r.id));
    }).catch(() => {})

    // Cargar destacados del API`
);

// 3. Add sections before Destacados
const cadenasSection = `
      {/* Cadenas */}
      <section className="py-20 px-4 bg-dark-lighter/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Las mejores cadenas de cafés, bares y restaurantes del país</h2>
            <p className="text-gray-400 mt-2">Conoce las marcas con presencia en todo el territorio</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cadenas.map((est) => (
              <Link key={est.id} href={\`/establecimiento/\${est.slug}\`} className="group">
                <div className="bg-dark-lighter rounded-2xl p-6 text-center hover:bg-dark-card transition-colors border border-gray-800 hover:border-primary/50">
                  {est.imagen_principal && (
                    <img src={est.imagen_principal} alt={est.nombre} className="w-20 h-20 rounded-xl mx-auto mb-4 object-contain" />
                  )}
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{est.nombre}</h3>
                  <p className="text-sm text-gray-400 mt-1">{est.sedes?.length || 0} sedes</p>
                  <p className="text-xs text-primary mt-2">Ver sedes →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DJs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🎧 ¿Tienes una fiesta?
              </h2>
              <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                Nosotros tenemos el DJ. Conoce los mejores DJs de Colombia.
              </p>
              <p className="text-white/60">Próximamente...</p>
            </div>
          </div>
        </div>
      </section>

`;

p = p.replace(
  '      {/* Destacados */}',
  cadenasSection + '      {/* Destacados */'
);

fs.writeFileSync(file, p);
console.log('✅ Cadenas and DJs sections added');
