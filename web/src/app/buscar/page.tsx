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

const ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Armenia', 'Pereira', 'Santa Marta', 'Barranquilla', 'Bucaramanga', 'Pasto', 'Villavicencio']

function BuscarContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [tipoSeleccionado, setTipoSeleccionado] = useState(searchParams.get('tipo') || '')
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(searchParams.get('q') ? 'Todas' : 'Bogotá')
  const [showFilters, setShowFilters] = useState(false)
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ciudadDetectada, setCiudadDetectada] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)

  // Detectar ciudad por IP al cargar
  useEffect(() => {
    const detectarCiudad = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        if (data.city) {
          setCiudadDetectada(data.city)
          setCiudadSeleccionada(data.city)
        }
      } catch {}
    }
    detectarCiudad()
  }, [])

  // Cargar establecimientos cuando cambian filtros
  useEffect(() => {
    const fetchEstablecimientos = async () => {
      setLoading(true)
      setVisibleCount(20)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append('buscar', searchQuery)
        if (tipoSeleccionado) params.append('tipo', tipoSeleccionado)
        if (ciudadSeleccionada && ciudadSeleccionada !== 'Todas') {
          params.append('ciudad', ciudadSeleccionada.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        }
        params.append('limite', '300')

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

  const establecimientosVisibles = establecimientos.slice(0, visibleCount)

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
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value) setCiudadSeleccionada('Todas')
                }}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setCiudadSeleccionada('Bogotá') }}>
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
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">
            {establecimientos.length} {establecimientos.length === 1 ? 'resultado' : 'resultados'} encontrados
            {ciudadDetectada && ciudadSeleccionada !== 'Todas' && (
              <span className="ml-2 text-primary text-sm">📍 {ciudadSeleccionada}</span>
            )}
          </p>
          {ciudadDetectada && (
            <button
              onClick={() => setCiudadSeleccionada('Todas')}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Ver todas las ciudades
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Buscando...</p>
          </div>
        ) : establecimientosVisibles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {establecimientosVisibles.map((est) => (
                <EstablecimientoCard key={est.id} establecimiento={est} />
              ))}
            </div>
            {visibleCount < establecimientos.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount(v => v + 20)}
                  className="bg-dark-lighter hover:bg-dark-card border border-gray-700 px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Ver más ({establecimientos.length - visibleCount} restantes)
                </button>
              </div>
            )}
          </>
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
