'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function CiudadPage({ params }: { params: { slug: string } }) {
  const [ciudad, setCiudad] = useState<any>(null)
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch city details
        const ciudadRes = await fetch(`${API_URL}/ciudades/${params.slug}`)
        if (ciudadRes.ok) {
          const ciudadData = await ciudadRes.json()
          setCiudad(ciudadData)

          // Fetch establishments for this city
          const estRes = await fetch(`${API_URL}/establecimientos?ciudad_id=${ciudadData.id}&limite=50`)
          if (estRes.ok) {
            const estData = await estRes.json()
            setEstablecimientos(estData.establecimientos || [])
          }
        }
      } catch (err) {
        console.error('Error cargando ciudad:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [params.slug])

  const establecimientosFiltrados = establecimientos.filter(est => {
    const matchSearch = est.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTipo = !tipoFiltro || est.tipo_nombre?.toLowerCase() === tipoFiltro.toLowerCase()
    return matchSearch && matchTipo
  })

  const tipos = [...new Set(establecimientos.map(e => e.tipo_nombre).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
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

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center bg-dark-lighter rounded-xl px-4 py-3 border border-gray-700/50 flex-1">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder={`Buscar en ${ciudad.nombre}...`}
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {tipos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setTipoFiltro('')}
                className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  !tipoFiltro ? 'bg-primary text-white' : 'bg-dark-lighter text-gray-400 hover:text-white border border-gray-700/50'
                }`}
              >
                Todos
              </button>
              {tipos.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoFiltro(tipo === tipoFiltro ? '' : tipo)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    tipoFiltro === tipo ? 'bg-primary text-white' : 'bg-dark-lighter text-gray-400 hover:text-white border border-gray-700/50'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
            <p className="text-gray-400">Intenta con otros filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
