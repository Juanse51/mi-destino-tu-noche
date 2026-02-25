'use client'

import { useState } from 'react'
import Link from 'next/link'

const planes = [
  { nombre: 'Cine Colombia', descripcion: 'La cadena de cines más grande de Colombia con presencia en todo el país.', instagram: 'cinecolombia' },
  { nombre: 'Cinemark Colombia', descripcion: 'Cadena internacional de cines con salas en las principales ciudades de Colombia.', instagram: 'cinemarkcol' },
  { nombre: 'Cinépolis Colombia', descripcion: 'Cadena mexicana de cines con presencia en Colombia.', instagram: 'cinepolis.co' },
  { nombre: 'Procinal', descripcion: 'Cine siempre al mejor precio. Ubicados en Bogotá, Bucaramanga, Cartagena, Villavicencio y Medellín.', instagram: 'procinal' },
  { nombre: 'Royal Films', descripcion: 'Cadena de cines colombiana con salas en múltiples ciudades del país.', instagram: 'cinemasroyalfilms' },
]

export default function OtrosPlanesPage() {
  const [search, setSearch] = useState('')
  const filtered = planes.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-teal-900 to-[#0F0F1A]" />
        <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" /><div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl" /></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">← Volver al inicio</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎬 Otros Planes</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">Cines y más opciones de entretenimiento en Colombia.</p>
          <div className="max-w-lg mx-auto mt-8"><div className="flex items-center bg-white/10 backdrop-blur rounded-xl p-2 border border-gray-700/50"><span className="ml-3 mr-2 text-gray-400">🔍</span><input type="text" placeholder="Buscar..." className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-2" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">🎬 Cines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <div key={i} className="bg-[#1A1A2E] rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-teal-500" />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0"><span className="text-2xl">🎬</span></div>
                    <div className="flex-1 min-w-0"><h3 className="text-lg font-bold text-white">{p.nombre}</h3></div>
                  </div>
                  {p.descripcion && <p className="text-sm text-gray-400 mt-4 line-clamp-3">{p.descripcion}</p>}
                  <div className="flex gap-3 mt-5">
                    {p.instagram && <button onClick={() => window.open('https://www.instagram.com/' + p.instagram, '_blank')} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-2.5 rounded-xl font-medium text-sm text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> Instagram</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center py-20"><div className="text-5xl mb-4">🔍</div><p className="text-gray-400 text-lg">No se encontraron resultados</p></div>}
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center bg-[#1A1A2E] rounded-2xl p-10 border border-gray-800">
          <h2 className="text-2xl font-bold mb-3">¿Tienes un plan para ofrecer?</h2>
          <p className="text-gray-400 mb-6">Registra tu negocio en Mi Destino Tu Noche.</p>
          <a href="https://wa.me/573212304589?text=Hola%2C%20quiero%20registrar%20mi%20negocio%20en%20Mi%20Destino%20Tu%20Noche." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-semibold text-white transition-colors">💬 Contáctanos</a>
        </div>
      </section>
      <div className="text-center py-6"><a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Desarrollado por Rayar!</a></div>
    </div>
  )
}
