'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ChevronLeft, Search } from 'lucide-react'
import CiudadCard from '@/components/CiudadCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function CiudadesPage() {
  const [ciudades, setCiudades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const res = await fetch(`${API_URL}/ciudades`)
        if (res.ok) {
          const data = await res.json()
          const ciudadesData = (data || []).map((c: any) => ({
            ...c,
            imagen: c.imagen_url || 'https://images.unsplash.com/photo-1536086845232-47c1b118f3f4?w=400',
            total: c.total_establecimientos || 0
          }))
          setCiudades(ciudadesData)
        }
      } catch (err) {
        console.error('Error cargando ciudades:', err)
      }
      setLoading(false)
    }
    fetchCiudades()
  }, [])

  const ciudadesFiltradas = ciudades.filter(c =>
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver al inicio
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gradient">Ciudades</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Explora los mejores destinos gastronómicos de Colombia
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center bg-dark-lighter rounded-xl px-4 py-3 border border-gray-700/50 w-full md:w-80">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Buscar ciudad..."
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-400">Cargando ciudades...</p>
          </div>
        ) : ciudadesFiltradas.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {ciudadesFiltradas.map((ciudad) => (
              <CiudadCard key={ciudad.slug} ciudad={ciudad} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏙️</div>
            <h2 className="text-2xl font-bold mb-2">No se encontraron ciudades</h2>
            <p className="text-gray-400">Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
