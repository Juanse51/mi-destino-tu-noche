'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Search } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

const categoriasInfo: Record<string, { nombre: string; icono: string; color: string; descripcion: string }> = {
  'circulo-gastro': { nombre: 'Círculo Gastro', icono: '⭐', color: '#FFD700', descripcion: 'Los mejores restaurantes seleccionados por su excelencia gastronómica' },
  'camara-diversidad': { nombre: 'Cámara de la Diversidad', icono: '🏳️‍🌈', color: '#FF69B4', descripcion: 'Espacios inclusivos y amigables con la comunidad LGBTIQ+' },
  'pet-friendly': { nombre: 'Pet Friendly', icono: '🐕', color: '#4CAF50', descripcion: 'Lugares donde tus mascotas son bienvenidas' },
  'tardeo': { nombre: 'Tardeo', icono: '🌅', color: '#FF8C00', descripcion: 'Los mejores planes para disfrutar desde temprano' },
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const categoriaInfo = categoriasInfo[params.slug] || {
    nombre: params.slug.replace(/-/g, ' '),
    icono: '📂',
    color: '#FF6B35',
    descripcion: ''
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/establecimientos/categoria/${params.slug}`)
        if (res.ok) {
          const data = await res.json()
          setEstablecimientos(data.establecimientos || data || [])
        }
      } catch (err) {
        console.error('Error cargando categoría:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [params.slug])

  const establecimientosFiltrados = establecimientos.filter(est =>
    est.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver al inicio
        </Link>

        <div 
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{ backgroundColor: `${categoriaInfo.color}15` }}
        >
          {/* Background decoration */}
          <div 
            className="absolute -right-8 -bottom-8 text-[12rem] opacity-10"
            style={{ color: categoriaInfo.color }}
          >
            {categoriaInfo.icono}
          </div>

          <div className="relative z-10">
            <span className="text-5xl mb-4 block">{categoriaInfo.icono}</span>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ color: categoriaInfo.color }}
            >
              {categoriaInfo.nombre}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              {categoriaInfo.descripcion}
            </p>
            <p className="text-gray-500 mt-3">
              {establecimientos.length} establecimientos
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center bg-dark-lighter rounded-xl px-4 py-3 border border-gray-700/50 max-w-md">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Buscar establecimiento..."
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-400">Cargando establecimientos...</p>
          </div>
        ) : establecimientosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {establecimientosFiltrados.map((est) => (
              <EstablecimientoCard key={est.id} establecimiento={est} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No se encontraron resultados</h2>
            <p className="text-gray-400">No hay establecimientos en esta categoría aún</p>
          </div>
        )}
      </div>
    </div>
  )
}
