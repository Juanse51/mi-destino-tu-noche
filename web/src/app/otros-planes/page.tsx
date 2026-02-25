'use client'

import { useState } from 'react'
import Link from 'next/link'

const planes = [
  { nombre: `Cine Colombia`, descripcion: `Recuerda que los reestrenos tienen fecha de caducidad , así que no esperes a que se vaya y corre por tus boletas en www.cinecolombia.com 🎟️`, instagram: `cinecolombia`, whatsapp: ``, telefono: `` },
  { nombre: `Cinemark Colombia`, descripcion: `todas las películas disponibles · Cumbres Borrascosas · Dia Fin Del Mundo · Goat · La Empleada · Avatar Fuego y Cenizas · Caminos del Crimen · Hamnet · Chase`, instagram: `cinemarkcol`, whatsapp: ``, telefono: `` },
  { nombre: `Cinepolis Colombia`, descripcion: `Cuenta oficial de Cinépolis Colombia El cine se ve mejor en Cinépolis · ¡Se viene la Fiesta del Cine en Cinépolis! · Película + Combo = Plan Perfecto ✨`, instagram: `cinepolis.co`, whatsapp: ``, telefono: `` },
  { nombre: `Procinal`, descripcion: `Cinemas Procinal. Cine siempre al mejor precio Estamos ubicados en Bogotá, B/meja, Cartagena, Villavo y Medellín (Terminal Del Sur). 󱙶. Follow.`, instagram: `procinal`, whatsapp: ``, telefono: `` },
  { nombre: `Royal Films`, descripcion: `Somos #royalfilms cuenta oficial ✨Entérate de los próximos estrenos en cine Compra tus entradas en nuestra app o página oficial  ..`, instagram: `cinemasroyalfilms`, whatsapp: ``, telefono: `` },
]

export default function OtrosPlanesPage() {
  const [search, setSearch] = useState('')

  const filtered = planes.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(search.toLowerCase())
  )

  const openIG = (ig: string) => {
    const clean = ig.replace('@','').replace('https://www.instagram.com/','').replace('/','')
    if (clean) window.open('https://www.instagram.com/' + clean, '_blank')
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-teal-900 to-[#0F0F1A]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">← Volver al inicio</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎬 Otros Planes</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">Cines y más opciones de entretenimiento en Colombia.</p>
          <div className="max-w-lg mx-auto mt-8">
            <div className="flex items-center bg-white/10 backdrop-blur rounded-xl p-2 border border-gray-700/50">
              <span className="ml-3 mr-2 text-gray-400">🔍</span>
              <input type="text" placeholder="Buscar..." className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-2" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
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
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white">{p.nombre}</h3>
                    </div>
                  </div>
                  {p.descripcion && <p className="text-sm text-gray-400 mt-4 line-clamp-3">{p.descripcion}</p>}
                  <div className="flex gap-3 mt-5">
                    {p.instagram && <button onClick={() => openIG(p.instagram)} className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 py-2.5 rounded-xl font-medium text-sm text-white transition-colors">📷 Instagram</button>}
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
