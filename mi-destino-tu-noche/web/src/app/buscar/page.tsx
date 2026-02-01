'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X, MapPin, Star } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'

// Datos de ejemplo
const todosEstablecimientos = [
  {
    id: '1', nombre: 'Andrés Carne de Res', slug: 'andres-carne-de-res',
    imagen_principal: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    tipo_nombre: 'Restaurante', tipo_icono: '🍽️', tipo_color: '#FF6B35',
    ciudad_nombre: 'Bogotá', valoracion_promedio: 4.8, total_valoraciones: 1250, rango_precios: 3,
    descripcion_corta: 'El restaurante más emblemático de Colombia',
    etiquetas: [{ nombre: 'Música en vivo', icono: '🎵' }]
  },
  {
    id: '2', nombre: 'Carmen', slug: 'carmen-medellin',
    imagen_principal: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    tipo_nombre: 'Restaurante', tipo_icono: '🍽️', tipo_color: '#FF6B35',
    ciudad_nombre: 'Medellín', valoracion_promedio: 4.9, total_valoraciones: 890, rango_precios: 4,
    descripcion_corta: 'Alta cocina colombiana',
    etiquetas: [{ nombre: 'Romántico', icono: '💕' }]
  },
  {
    id: '3', nombre: 'La Octava', slug: 'la-octava',
    imagen_principal: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    tipo_nombre: 'Bar', tipo_icono: '🍺', tipo_color: '#9B59B6',
    ciudad_nombre: 'Cali', valoracion_promedio: 4.6, total_valoraciones: 567, rango_precios: 2,
    descripcion_corta: 'El mejor ambiente salsero',
    etiquetas: [{ nombre: 'Música en vivo', icono: '🎵' }]
  },
  {
    id: '4', nombre: 'Café Velvet', slug: 'cafe-velvet',
    imagen_principal: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    tipo_nombre: 'Café', tipo_icono: '☕', tipo_color: '#8B4513',
    ciudad_nombre: 'Armenia', valoracion_promedio: 4.7, total_valoraciones: 342, rango_precios: 2,
    descripcion_corta: 'Café de origen con vista al Quindío',
    etiquetas: [{ nombre: 'WiFi', icono: '📶' }]
  },
  {
    id: '5', nombre: 'Theatron', slug: 'theatron',
    imagen_principal: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800',
    tipo_nombre: 'Discoteca', tipo_icono: '🎉', tipo_color: '#E91E63',
    ciudad_nombre: 'Bogotá', valoracion_promedio: 4.5, total_valoraciones: 2100, rango_precios: 3,
    descripcion_corta: 'La discoteca más grande de Latinoamérica',
    etiquetas: [{ nombre: 'LGBTIQ+', icono: '🏳️‍🌈' }]
  },
  {
    id: '6', nombre: 'El Cielo', slug: 'el-cielo',
    imagen_principal: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    tipo_nombre: 'Restaurante', tipo_icono: '🍽️', tipo_color: '#FF6B35',
    ciudad_nombre: 'Bogotá', valoracion_promedio: 4.9, total_valoraciones: 780, rango_precios: 4,
    descripcion_corta: 'Experiencia gastronómica única',
    etiquetas: [{ nombre: 'Premium', icono: '⭐' }]
  },
]

const tipos = [
  { nombre: 'Todos', slug: '' },
  { nombre: 'Restaurantes', slug: 'restaurante', icono: '🍽️' },
  { nombre: 'Bares', slug: 'bar', icono: '🍺' },
  { nombre: 'Cafés', slug: 'cafe', icono: '☕' },
  { nombre: 'Discotecas', slug: 'discoteca', icono: '🎉' },
]

const ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Armenia', 'Pereira']

export default function BuscarPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tipoSeleccionado, setTipoSeleccionado] = useState('')
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('Todas')
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar establecimientos
  const filtrados = todosEstablecimientos.filter(est => {
    const matchBusqueda = est.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTipo = !tipoSeleccionado || est.tipo_nombre.toLowerCase() === tipoSeleccionado
    const matchCiudad = ciudadSeleccionada === 'Todas' || est.ciudad_nombre === ciudadSeleccionada
    return matchBusqueda && matchTipo && matchCiudad
  })

  return (
    <div className="min-h-screen pt-20">
      {/* Search Header */}
      <div className="bg-dark-lighter border-b border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Search Input */}
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

            {/* Filter Toggle */}
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

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap gap-4">
                {/* Tipo */}
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

                {/* Ciudad */}
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

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-400">
            {filtrados.length} {filtrados.length === 1 ? 'resultado' : 'resultados'} encontrados
          </p>
        </div>

        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtrados.map((est) => (
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
