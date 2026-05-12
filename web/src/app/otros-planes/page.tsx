'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function OtrosPlanesPage() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/establecimientos?tipos=otros-planes,cafe&limite=500`)
        if (res.ok) {
          const data = await res.json()
          setEstablecimientos(data.establecimientos || [])
        }
      } catch {}
      setLoading(false)
    }
    fetchData()
  }, [])

  const norm = (s: string) => s?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') || ''

  const filtrados = search
    ? establecimientos.filter(e =>
        norm(e.nombre).includes(norm(search)) ||
        norm(e.ciudad_nombre).includes(norm(search))
      )
    : establecimientos

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-teal-900 to-[#0F0F1A]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Otros Planes</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Cafés, cines y más opciones de entretenimiento en Colombia.
          </p>
          <div className="max-w-lg mx-auto mt-8">
            <div className="flex items-center bg-white/10 backdrop-blur rounded-xl p-2 border border-gray-700/50">
              <Search className="w-5 h-5 text-gray-400 mx-3" />
              <input
                type="text"
                placeholder="Buscar por nombre o ciudad..."
                className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <p className="text-gray-400 text-center py-20">Cargando...</p>
          ) : filtrados.length > 0 ? (
            <>
              <p className="text-gray-400 mb-8">{filtrados.length} lugares encontrados</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtrados.map((est) => (
                  <EstablecimientoCard key={est.id} establecimiento={est} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No se encontraron resultados</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center bg-[#1A1A2E] rounded-2xl p-10 border border-gray-800">
          <h2 className="text-2xl font-bold mb-3">¿Tienes un plan para ofrecer?</h2>
          <p className="text-gray-400 mb-6">Registra tu negocio en Mi Destino Tu Noche.</p>
          <a
            href="https://wa.me/573212304589?text=Hola%2C%20quiero%20registrar%20mi%20negocio%20en%20Mi%20Destino%20Tu%20Noche."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-semibold text-white transition-colors"
          >
            💬 Contáctanos
          </a>
        </div>
      </section>
    </div>
  )
}
