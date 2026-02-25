'use client'

import { useState } from 'react'
import Link from 'next/link'

const parques = [
  { nombre: 'Parque del Café', direccion: 'Montenegro, Quindío', descripcion: 'Parque temático destacando la cultura cafetera colombiana, inaugurado en 1995.', instagram: 'parquedelcafeoficial', telefono: '6067417400' },
  { nombre: 'Salitre Mágico', direccion: 'Cl 63 #60-80, Bogotá', descripcion: 'Parque de atracciones con 30 atracciones mecánicas junto al Parque Simón Bolívar.', instagram: 'salitremagico', telefono: '6019156050' },
  { nombre: 'Fundación Parque Jaime Duque', direccion: 'Tocancipá, Cundinamarca', descripcion: 'Parque temático dedicado a la recreación familiar.', instagram: 'parquejaimeduque', whatsapp: '573146959022', telefono: '' },
  { nombre: 'Panaca Quindío', direccion: 'Km 7, Vía Panaca, Quimbaya, Quindío', descripcion: 'Parque temático agropecuario con experiencias de naturaleza y animales.', instagram: 'panacaparque', telefono: '' },
  { nombre: 'Piscilago | Parque Acuático', direccion: 'Vía Bogotá-Girardot, Km 105, Nilo', descripcion: 'Parque acuático y zoológico con toboganes y piscinas de olas.', instagram: 'piscilagocol', telefono: '' },
  { nombre: 'Mundo Aventura', direccion: 'Cra. 71d #1-14 Sur, Bogotá', descripcion: 'Parque de diversiones en el sur de Bogotá con atracciones para todas las edades.', instagram: 'mundo_aventura', telefono: '' },
  { nombre: 'Multiparque', direccion: 'Auto. Norte #224-60, Usaquén, Bogotá', descripcion: 'Parque de diversiones al norte de Bogotá con atracciones familiares.', instagram: 'multiparquecol', telefono: '' },
  { nombre: 'Parque Nacional del Chicamocha', direccion: 'Km 54 Vía Bucaramanga-San Gil, Santander', descripcion: 'Parque temático en el cañón del Chicamocha con teleférico y actividades extremas.', instagram: 'parquenacionaldelchicamocha', telefono: '' },
  { nombre: 'Hacienda Nápoles', direccion: 'Km 165 Autopista Medellín-Bogotá, Puerto Triunfo', descripcion: 'Parque temático con zoológico y parque acuático en Antioquia.', instagram: 'haciendanapoles', telefono: '' },
]

export default function ParquesPage() {
  const [search, setSearch] = useState('')
  const filtered = parques.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.direccion.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-[#0F0F1A]" />
        <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl" /><div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" /></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">← Volver al inicio</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎢 Parques de Diversiones</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">Los mejores parques temáticos y de diversiones de Colombia.</p>
          <div className="max-w-lg mx-auto mt-8"><div className="flex items-center bg-white/10 backdrop-blur rounded-xl p-2 border border-gray-700/50"><span className="ml-3 mr-2 text-gray-400">🔍</span><input type="text" placeholder="Buscar parque..." className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-2" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 mb-8">{filtered.length} parques</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <div key={i} className="bg-[#1A1A2E] rounded-2xl overflow-hidden border border-gray-800 hover:border-green-500/50 transition-all">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0"><span className="text-2xl">🎢</span></div>
                    <div className="flex-1 min-w-0"><h3 className="text-lg font-bold text-white">{p.nombre}</h3>{p.direccion && <p className="text-sm text-green-400 mt-1">📍 {p.direccion}</p>}</div>
                  </div>
                  {p.descripcion && <p className="text-sm text-gray-400 mt-4 line-clamp-3">{p.descripcion}</p>}
                  <div className="flex gap-3 mt-5">
                    {p.instagram && <button onClick={() => window.open('https://www.instagram.com/' + p.instagram, '_blank')} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-2.5 rounded-xl font-medium text-sm text-white transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> Instagram</button>}
                    {p.telefono && <a href={'tel:' + p.telefono} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-2.5 rounded-xl font-medium text-sm text-white transition-colors">📞 Llamar</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center py-20"><div className="text-5xl mb-4">🔍</div><p className="text-gray-400 text-lg">No se encontraron parques</p></div>}
        </div>
      </section>
      <div className="text-center py-6"><a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Desarrollado por Rayar!</a></div>
    </div>
  )
}
