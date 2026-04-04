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
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  const CIUDAD_COORDS: Record<string, {lat: number, lng: number}> = {
    'bogotá': { lat: 4.7110, lng: -74.0721 }, 'bogota': { lat: 4.7110, lng: -74.0721 },
    'medellín': { lat: 6.2442, lng: -75.5812 }, 'medellin': { lat: 6.2442, lng: -75.5812 },
    'cali': { lat: 3.4516, lng: -76.5320 },
    'cartagena': { lat: 10.3910, lng: -75.4794 },
    'barranquilla': { lat: 10.9685, lng: -74.7813 },
    'santa marta': { lat: 11.2408, lng: -74.1990 },
    'pereira': { lat: 4.8087, lng: -75.6906 },
    'armenia': { lat: 4.5339, lng: -75.6811 },
    'bucaramanga': { lat: 7.1193, lng: -73.1227 },
    'villavicencio': { lat: 4.1420, lng: -73.6266 },
    'pasto': { lat: 1.2136, lng: -77.2811 },
    'zipaquirá': { lat: 5.0228, lng: -74.0061 }, 'zipaquira': { lat: 5.0228, lng: -74.0061 },
    'sumapaz': { lat: 4.1500, lng: -74.3500 },
    'cúcuta': { lat: 7.8939, lng: -72.5078 }, 'cucuta': { lat: 7.8939, lng: -72.5078 },
    'montería': { lat: 8.7575, lng: -75.8871 }, 'monteria': { lat: 8.7575, lng: -75.8871 },
    'neiva': { lat: 2.9273, lng: -75.2819 },
  }

  const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const sortByDistance = (items: any[], loc: {lat: number, lng: number}) => {
    return [...items].sort((a, b) => {
      const coordsA = (a.latitud && a.longitud)
        ? { lat: parseFloat(a.latitud), lng: parseFloat(a.longitud) }
        : CIUDAD_COORDS[a.ciudad_nombre?.toLowerCase()] || null
      const coordsB = (b.latitud && b.longitud)
        ? { lat: parseFloat(b.latitud), lng: parseFloat(b.longitud) }
        : CIUDAD_COORDS[b.ciudad_nombre?.toLowerCase()] || null
      const da = coordsA ? haversine(loc.lat, loc.lng, coordsA.lat, coordsA.lng) : 99999
      const db = coordsB ? haversine(loc.lat, loc.lng, coordsB.lat, coordsB.lng) : 99999
      return da - db
    })
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append('buscar', searchQuery)
        if (tipoSeleccionado) params.append('tipo', tipoSeleccionado)
        if (ciudadSeleccionada && ciudadSeleccionada !== 'Todas') params.append('ciudad', ciudadSeleccionada.toLowerCase())
        params.append('limite', '300')
        
        const res = await fetch(`${API_URL}/establecimientos?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          const items = data.establecimientos || []
          setEstablecimientos(items)
        }
      } catch (err) {
        console.error('Error buscando:', err)
      }
      setLoading(false)
    }
    fetchEstablecimientos()
  }, [searchQuery, tipoSeleccionado, ciudadSeleccionada])

  // Reordenar cuando cambia la ubicación
  const establecimientosOrdenados = userLocation
    ? sortByDistance(establecimientos, userLocation)
    : establecimientos

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
            {establecimientosOrdenados.length} {establecimientosOrdenados.length === 1 ? 'resultado' : 'resultados'} encontrados
          </p>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-400">Buscando...</p>
          </div>
        ) : establecimientos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {establecimientosOrdenados.map((est) => (
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