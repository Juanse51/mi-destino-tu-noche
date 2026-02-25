'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = 'https://mi-destino-api.onrender.com/api/v1'

export default function TransportesPage() {
  const [transportes, setTransportes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/establecimientos?limite=100`)
      .then(r => r.json())
      .then(data => {
        const ests = data.establecimientos || data || []
        const trans = Array.isArray(ests) ? ests.filter((e: any) => e.genero_musical === 'TRANSPORTE') : []
        setTransportes(trans)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = transportes.filter(t =>
    t.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    t.descripcion?.toLowerCase().includes(search.toLowerCase()) ||
    t.direccion?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">← Volver al inicio</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🚌 Transportes</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">Movilízate por Colombia. Encuentra las mejores opciones de transporte para llegar a tu destino.</p>
          <div className="max-w-lg mx-auto mt-8">
            <div className="flex items-center bg-dark-lighter/80 backdrop-blur rounded-xl p-2 border border-gray-700/50">
              <span className="ml-3 mr-2 text-gray-400">🔍</span>
              <input type="text" placeholder="Buscar por nombre o región..." className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-2" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20"><div className="text-5xl mb-4 animate-pulse">🚌</div><p className="text-gray-400">Cargando transportes...</p></div>
          ) : (
            <>
              <p className="text-gray-400 mb-8">{filtered.length} servicios de transporte</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((t: any) => (
                  <div key={t.id} className="bg-dark-lighter rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all">
                    <div className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500" />
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0"><span className="text-2xl">🚌</span></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white">{t.nombre}</h3>
                          {t.direccion && <p className="text-sm text-primary mt-1">📍 {t.direccion}</p>}
                        </div>
                      </div>
                      {t.descripcion && <p className="text-sm text-gray-400 mt-4 line-clamp-3">{t.descripcion}</p>}
                      <div className="flex gap-3 mt-5">
                        {t.whatsapp && (
                          <button onClick={() => window.open(`https://wa.me/${t.whatsapp.startsWith('57') ? t.whatsapp : '57'+t.whatsapp}?text=Hola%2C%20te%20contacto%20desde%20Mi%20Destino%20Tu%20Noche.`, '_blank')} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-2.5 rounded-xl font-medium transition-colors text-sm text-white">💬 WhatsApp</button>
                        )}
                        {t.telefono && (
                          <a href={`tel:${t.telefono}`} className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark py-2.5 rounded-xl font-medium transition-colors text-sm text-white">📞 Llamar</a>
                        )}
                        {t.instagram && (
                          <button onClick={() => window.open(`https://www.instagram.com/${t.instagram.replace('@','').replace('https://www.instagram.com/','').replace('/','')}`,'_blank')} className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 py-2.5 px-4 rounded-xl font-medium transition-colors text-sm text-white">📷</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && <div className="text-center py-20"><div className="text-5xl mb-4">🔍</div><p className="text-gray-400 text-lg">No se encontraron servicios de transporte</p></div>}
            </>
          )}
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center bg-dark-lighter rounded-2xl p-10 border border-gray-800">
          <h2 className="text-2xl font-bold mb-3">¿Ofreces servicio de transporte?</h2>
          <p className="text-gray-400 mb-6">Registra tu empresa en Mi Destino Tu Noche y llega a miles de viajeros.</p>
          <a href="https://wa.me/573212304589?text=Hola%2C%20ofrezco%20servicio%20de%20transporte%20y%20quiero%20registrarme." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold transition-colors text-white">💬 Contáctanos</a>
        </div>
      </section>
      <div className="text-center py-6"><a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Desarrollado por Rayar!</a></div>
    </div>
  )
}
