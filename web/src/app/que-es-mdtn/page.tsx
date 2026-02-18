'use client'

export default function QueEsMDTN() {
  return (
    <div className="animate-fadeIn pt-20">
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Qué es <span className="text-gradient">Mi Destino Tu Noche</span>?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            La plataforma de Asobares que conecta a los colombianos con los mejores restaurantes, bares, cafés y discotecas del país.
          </p>
        </div>
      </section>

      {/* Video */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/YxOfBiwGP54"
              title="Mi Destino Tu Noche"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Descripción */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-dark-lighter rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Mi Destino Tu Noche es una iniciativa de <strong>Asobares Colombia</strong> que busca impulsar y visibilizar la industria gastronómica y de entretenimiento nocturno en todo el país. Somos la guía definitiva para descubrir los mejores establecimientos, desde restaurantes de alta cocina hasta los bares más auténticos de cada ciudad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-lighter rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-bold mb-2">18 Ciudades</h3>
              <p className="text-gray-400">Cubrimos las principales ciudades de Colombia con establecimientos verificados por Asobares.</p>
            </div>
            <div className="bg-dark-lighter rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-bold mb-2">Verificados</h3>
              <p className="text-gray-400">Todos los establecimientos son miembros de Asobares, garantizando calidad y cumplimiento normativo.</p>
            </div>
            <div className="bg-dark-lighter rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-bold mb-2">App Móvil</h3>
              <p className="text-gray-400">Disponible en iOS y Android para que lleves la guía en tu bolsillo a donde vayas.</p>
            </div>
          </div>

          <div className="bg-dark-lighter rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4">¿Qué es Asobares?</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              La Asociación Colombiana de la Industria de la Vida Nocturna y Gastronómica (Asobares) es el gremio que agrupa y representa a los establecimientos nocturnos y gastronómicos de Colombia. Trabaja por la formalización, el bienestar y el desarrollo del sector, promoviendo prácticas responsables y la cultura del entretenimiento seguro.
            </p>
            <div className="flex justify-center">
              <img
                src="https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/Nuevo%20logo%20Asobares%20-%20Blanco.png"
                alt="Asobares"
                className="h-20 w-auto"
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">¿Quieres registrar tu establecimiento?</h2>
            <p className="text-white/90 text-lg mb-6">
              Si eres miembro de Asobares y quieres aparecer en Mi Destino Tu Noche, contáctanos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:soporte@asobares.org" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors">
                soporte@asobares.org
              </a>
              <a href="tel:+573212304589" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors">
                +57 321 230 4589
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
