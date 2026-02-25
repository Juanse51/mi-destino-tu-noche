'use client'

import { useState } from 'react'
import Link from 'next/link'

const establecimientos = {
  alojamiento: [
    'Hilton Bogotá', 'Four Seasons', 'Alojamientos Turísticos ERSAGUER', 'La Gloria Reserva Forestal',
    'Viajero Hostels', 'Hotel Zen-sual', 'Hyatt Place', 'Four Points by Sheraton',
    'Sofitel Bogotá Victoria Regia', 'Grand Hyatt Bogotá', 'Bogotá Plaza Hotel', 'Habitel Hotels',
    'Salvio 93', 'GHL Hotels', 'Germán Morales', 'W Bogotá Hotel',
    'Novotel Parque de la 93', 'Aloft Bogotá Airport', 'Blue Doors', 'Hotel Rosales Plaza',
  ],
  agencias: [
    'Bogotay Travel', 'Consentidos por Naturaleza', 'Territorio Colombia', '360 Colombia',
    'Global Trip', 'Innova Travel', 'Wakaroo Travel', 'Banana Travel',
    'Viaja Ya', 'Aquamarine Agencia de viajes', 'Samor Experiencias',
  ],
  bares: [
    'Bar Chiquita', 'Caffa Colombia', 'Tejo La Embajada', 'Cat Coffee',
  ],
}

type Filtro = 'todos' | 'alojamiento' | 'agencias' | 'bares'

const filtros: { key: Filtro; label: string; emoji: string; color: string }[] = [
  { key: 'todos', label: 'Todos', emoji: '🏳️‍🌈', color: '#FF69B4' },
  { key: 'alojamiento', label: 'Alojamiento', emoji: '🏨', color: '#8B5CF6' },
  { key: 'agencias', label: 'Agencias de viajes', emoji: '✈️', color: '#3B82F6' },
  { key: 'bares', label: 'Bares y restaurantes', emoji: '🍸', color: '#EC4899' },
]

const categoryMeta: Record<string, { emoji: string; color: string }> = {
  alojamiento: { emoji: '🏨', color: '#8B5CF6' },
  agencias: { emoji: '✈️', color: '#3B82F6' },
  bares: { emoji: '🍸', color: '#EC4899' },
}

export default function CamaraDiversidadPage() {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [search, setSearch] = useState('')

  const allItems = Object.entries(establecimientos).flatMap(([cat, items]) =>
    items.map(nombre => ({ nombre, categoria: cat }))
  )

  const filtered = allItems.filter(item => {
    if (filtro !== 'todos' && item.categoria !== filtro) return false
    if (search && !item.nombre.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // Group by category
  const grouped: Record<string, typeof filtered> = {}
  filtered.forEach(item => {
    if (!grouped[item.categoria]) grouped[item.categoria] = []
    grouped[item.categoria].push(item)
  })

  const catLabels: Record<string, string> = {
    alojamiento: 'Establecimientos de alojamiento',
    agencias: 'Agencias de viajes y turismo',
    bares: 'Bares y restaurantes',
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-purple-900 to-[#0F0F1A]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">← Volver al inicio</Link>
          <img src="/camara_diversidad.png" alt="Cámara de la Diversidad" className="h-24 mx-auto mb-4 object-contain" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🏳️‍🌈 Cámara de la Diversidad</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">Empresas afiliadas a la Cámara de la Diversidad en Bogotá. Espacios inclusivos y amigables con la comunidad LGBTIQ+.</p>
          <div className="max-w-lg mx-auto mt-8">
            <div className="flex items-center bg-white/10 backdrop-blur rounded-xl p-2 border border-gray-700/50">
              <span className="ml-3 mr-2 text-gray-400">🔍</span>
              <input type="text" placeholder="Buscar establecimiento..." className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-2" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="sticky top-16 z-40 bg-[#0F0F1A]/95 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filtros.map(f => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filtro === f.key ? 'text-white shadow-lg scale-105' : 'bg-[#1A1A2E]/50 text-gray-400 hover:text-white hover:bg-[#1A1A2E]'
                }`}
                style={filtro === f.key ? { backgroundColor: f.color } : {}}
              >
                <span>{f.emoji}</span> {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 mb-8">{filtered.length} establecimientos afiliados</p>

          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="mb-12">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-2xl">{categoryMeta[cat]?.emoji}</span>
                <span>{catLabels[cat]}</span>
                <span className="text-gray-600 text-sm font-normal">({items.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, i) => (
                  <div key={i} className="bg-[#1A1A2E] rounded-xl p-5 border border-gray-800 hover:border-pink-500/30 transition-all flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold text-white"
                      style={{ backgroundColor: categoryMeta[item.categoria]?.color + '25' }}
                    >
                      {item.nombre.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.nombre}</h3>
                      <p className="text-xs mt-1" style={{ color: categoryMeta[item.categoria]?.color }}>
                        {categoryMeta[item.categoria]?.emoji} {catLabels[item.categoria]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg">No se encontraron establecimientos</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center bg-[#1A1A2E] rounded-2xl p-10 border border-gray-800">
          <h2 className="text-2xl font-bold mb-3">¿Quieres afiliarte a la Cámara de la Diversidad?</h2>
          <p className="text-gray-400 mb-6">Haz parte del directorio de espacios inclusivos en Colombia.</p>
          <a
            href="https://wa.me/573212304589?text=Hola%2C%20quiero%20afiliarme%20a%20la%20C%C3%A1mara%20de%20la%20Diversidad."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-semibold text-white transition-colors"
          >
            💬 Contáctanos
          </a>
        </div>
      </section>

      <div className="text-center py-6">
        <a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
          Desarrollado por Rayar!
        </a>
      </div>
    </div>
  )
}
