'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

const tipos = [
  { nombre: 'Todos', slug: '', icono: '' },
  { nombre: 'Restaurantes', slug: 'restaurante', icono: '🍽️' },
  { nombre: 'Bares', slug: 'bar', icono: '🍺' },
  { nombre: 'Cafés', slug: 'cafe', icono: '☕' },
  { nombre: 'Discotecas', slug: 'discoteca', icono: '🎉' },
]

const ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Armenia', 'Pereira']

function BuscarContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [tipoSeleccionado, setTipoSeleccionado] = useState(searchParams.get('tipo') || '')
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('Todas')
  const [showFilters, setShowFilters] = useState(false)
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append('buscar', searchQuery)
        if (tipoSeleccionado) params.append('tipo', tipoSeleccionado)
        if (ciudadSeleccionada && ciudadSeleccionada !== 'Todas') params.append('ciudad', ciudadSeleccionada.toLowerCase())
        params.append('limite', '20')
        
        const res = await fetch(`${API_URL}/establecimientos?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setEstablecimientos(data.establecimientos || [])
        }
      } catch (err) {
        console.error('Error buscando:', err)
      }
      setLoading(false)
    }
    fetchEstablecimientos()
  }, [searchQuery, tipoSeleccionado, ciudadSeleccionada])

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-dark-lighter border-b border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center bg-dark rounded-xl px-4 py-3 border border-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                showFilters ? 'bg-primary border-primary' : 'bg-dark border-gray-700 hover:border-gray-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tipo</label>
                  <div className="flex flex-wrap gap-2">
                    {tipos.map((tipo) => (
                      <button
                        key={tipo.slug}
                        onClick={() => setTipoSeleccionado(tipo.slug)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          tipoSeleccionado === tipo.slug
                            ? 'bg-primary text-white'
                            : 'bg-dark hover:bg-dark-card'
                        }`}
                      >
                        {tipo.icono && <span className="mr-1">{tipo.icono}</span>}
                        {tipo.nombre}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Ciudad</label>
                  <select
                    value={ciudadSeleccionada}
                    onChange={(e) => setCiudadSeleccionada(e.target.value)}
                    className="bg-dark border border-gray-700 rounded-xl px-4 py-2 text-white outline-none"
                  >
                    {ciudades.map((ciudad) => (
                      <option key={ciudad} value={ciudad}>{ciudad}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-400">
            {establecimientos.length} {establecimientos.length === 1 ? 'resultado' : 'resultados'} encontrados
          </p>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-400">Buscando...</p>
          </div>
        ) : establecimientos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {establecimientos.map((est) => (
              <EstablecimientoCard key={est.id} establecimiento={est} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-400">Intenta con otros términos o filtros</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 text-center py-20">Cargando...</div>}>
      <BuscarContent />
    </Suspense>
  )
}