'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, MapPin, Search, Utensils, Wine, Coffee, Music, Store } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

const TIPO_CONFIG: Record<string, { icono: string; color: string }> = {
  'Restaurante': { icono: '🍽️', color: '#FF6B35' },
  'Bar': { icono: '🍺', color: '#3B82F6' },
  'Discoteca': { icono: '🪩', color: '#A855F7' },
  'Gastrobar': { icono: '🍸', color: '#EC4899' },
  'Café': { icono: '☕', color: '#F59E0B' },
}

export default function CiudadPage({ params }: { params: { slug: string } }) {
  const [ciudad, setCiudad] = useState<any>(null)
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [totalCount, setTotalCount] = useState(0)

  // Fetch all establishments with pagination
  const fetchAllEstablecimientos = useCallback(async (slug: string) => {
    const pageSize = 100
    let allEstablecimientos: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      try {
        const res = await fetch(`${API_URL}/establecimientos?ciudad=${slug}&limite=${pageSize}&pagina=${page}`)
        if (res.ok) {
          const data = await res.json()
          const items = data.establecimientos || []
          allEstablecimientos = [...allEstablecimientos, ...items]
          
          const total = data.total || data.paginacion?.total || 0
          setTotalCount(total)
          
          if (items.length < pageSize || allEstablecimientos.length >= total) {
            hasMore = false
          } else {
            page++
            setEstablecimientos([...allEstablecimientos])
            setLoadingMore(true)
          }
        } else {
          hasMore = false
        }
      } catch (err) {
        console.error('Error fetching page:', page, err)
        hasMore = false
      }
    }

    return allEstablecimientos
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch city details
        const ciudadRes = await fetch(`${API_URL}/ciudades/${params.slug}`)
        if (ciudadRes.ok) {
          const ciudadData = await ciudadRes.json()
          setCiudad(ciudadData)
        }

        // Fetch ALL establishments with auto-pagination
        const allEst = await fetchAllEstablecimientos(params.slug)
        setEstablecimientos(allEst)
      } catch (err) {
        console.error('Error cargando ciudad:', err)
      }
      setLoading(false)
      setLoadingMore(false)
    }
    fetchData()
  }, [params.slug, fetchAllEstablecimientos])

  const establecimientosFiltrados = establecimientos.filter(est => {
    const matchSearch = est.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      est.direccion?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTipo = !tipoFiltro || est.tipo_nombre?.toLowerCase() === tipoFiltro.toLowerCase()
    return matchSearch && matchTipo
  })

  // Get types with counts
  const tiposConConteo = Array.from(
    establecimientos.reduce((map: Map<string, number>, e: any) => {
      const tipo = e.tipo_nombre
      if (tipo) map.set(tipo, (map.get(tipo) || 0) + 1)
      return map
    }, new Map<string, number>())
  ).map(([nombre, count]) => ({ nombre, count }))
    .sort((a, b) => b.count - a.count)

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando ciudad...</p>
        </div>
      </div>
    )
  }

  if (!ciudad) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏙️</div>
          <h2 className="text-2xl font-bold mb-2">Ciudad no encontrada</h2>
          <p className="text-gray-400 mb-6">No pudimos encontrar la ciudad que buscas</p>
          <Link href="/ciudades" className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-xl font-medium transition-colors">
            Ver todas las ciudades
          </Link>
        </div>
      </div>
    )
  }

  const ciudadImagen = ciudad.imagen_url || 'https://images.unsplash.com/photo-1536086845232-47c1b118f3f4?w=1920'

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[45vh]">
        <img
          src={ciudadImagen}
          alt={ciudad.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-dark/30" />

        <Link href="/ciudades" className="absolute top-4 left-4 p-3 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{ciudad.departamento_nombre || 'Colombia'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{ciudad.nombre}</h1>
            <p className="text-gray-300 text-lg">
              {establecimientos.length} establecimientos disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      {tiposConConteo.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Categorías</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* "Todos" card */}
            <button
              onClick={() => setTipoFiltro('')}
              className={`relative rounded-xl p-4 text-left transition-all duration-200 border ${
                !tipoFiltro
                  ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10'
                  : 'bg-dark-lighter border-gray-700/50 hover:border-gray-600'
              }`}
            >
              <span className="text-2xl block mb-2">🌟</span>
              <span className={`text-sm font-semibold block ${!tipoFiltro ? 'text-primary' : 'text-white'}`}>
                Todos
              </span>
              <span className="text-xs text-gray-400">{establecimientos.length} lugares</span>
            </button>

            {tiposConConteo.map(({ nombre, count }) => {
              const config = TIPO_CONFIG[nombre] || { icono: '📍', color: '#6B7280' }
              const isActive = tipoFiltro === nombre
              return (
                <button
                  key={nombre}
                  onClick={() => setTipoFiltro(nombre === tipoFiltro ? '' : nombre)}
                  className={`relative rounded-xl p-4 text-left transition-all duration-200 border ${
                    isActive
                      ? 'shadow-lg'
                      : 'bg-dark-lighter border-gray-700/50 hover:border-gray-600'
                  }`}
                  style={isActive ? {
                    backgroundColor: `${config.color}20`,
                    borderColor: config.color,
                    boxShadow: `0 4px 15px ${config.color}15`
                  } : {}}
                >
                  <span className="text-2xl block mb-2">{config.icono}</span>
                  <span
                    className={`text-sm font-semibold block ${isActive ? '' : 'text-white'}`}
                    style={isActive ? { color: config.color } : {}}
                  >
                    {nombre === 'Restaurante' ? 'Restaurantes' :
                     nombre === 'Bar' ? 'Bares' :
                     nombre === 'Discoteca' ? 'Discotecas' :
                     nombre === 'Gastrobar' ? 'Gastrobares' :
                     nombre === 'Café' ? 'Cafés' : nombre}
                  </span>
                  <span className="text-xs text-gray-400">{count} lugares</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex items-center bg-dark-lighter rounded-xl px-4 py-3 border border-gray-700/50">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder={`Buscar en ${ciudad.nombre}...`}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-white ml-2 text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(tipoFiltro || searchQuery) && (
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">
              {establecimientosFiltrados.length} resultado{establecimientosFiltrados.length !== 1 ? 's' : ''}
            </span>
            {tipoFiltro && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                style={{
                  backgroundColor: `${(TIPO_CONFIG[tipoFiltro]?.color || '#6B7280')}20`,
                  color: TIPO_CONFIG[tipoFiltro]?.color || '#6B7280'
                }}
              >
                {TIPO_CONFIG[tipoFiltro]?.icono} {tipoFiltro}
                <button onClick={() => setTipoFiltro('')} className="ml-1 hover:opacity-70">✕</button>
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 flex items-center gap-1">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:opacity-70">✕</button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="max-w-7xl mx-auto px-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Cargando más establecimientos...
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {establecimientosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {establecimientosFiltrados.map((est) => (
              <EstablecimientoCard key={est.id} establecimiento={est} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No se encontraron resultados</h2>
            <p className="text-gray-400 mb-4">Intenta con otros filtros de búsqueda</p>
            {(tipoFiltro || searchQuery) && (
              <button
                onClick={() => { setTipoFiltro(''); setSearchQuery('') }}
                className="text-primary hover:text-primary-dark transition-colors font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
