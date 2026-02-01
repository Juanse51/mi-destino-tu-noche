'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, Star, ChevronRight, Utensils, Wine, Coffee, Music } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'
import CategoriaCard from '@/components/CategoriaCard'
import CiudadCard from '@/components/CiudadCard'

// Datos de ejemplo (en producción vendrían del API)
const establecimientosDestacados = [
  {
    id: '1',
    nombre: 'Andrés Carne de Res',
    slug: 'andres-carne-de-res',
    imagen_principal: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    tipo_nombre: 'Restaurante',
    tipo_icono: '🍽️',
    tipo_color: '#FF6B35',
    ciudad_nombre: 'Bogotá',
    valoracion_promedio: 4.8,
    total_valoraciones: 1250,
    rango_precios: 3,
    descripcion_corta: 'El restaurante más emblemático de Colombia',
    etiquetas: [{ nombre: 'Música en vivo', icono: '🎵' }, { nombre: 'Terraza', icono: '🌿' }]
  },
  {
    id: '2',
    nombre: 'Carmen',
    slug: 'carmen-medellin',
    imagen_principal: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    tipo_nombre: 'Restaurante',
    tipo_icono: '🍽️',
    tipo_color: '#FF6B35',
    ciudad_nombre: 'Medellín',
    valoracion_promedio: 4.9,
    total_valoraciones: 890,
    rango_precios: 4,
    descripcion_corta: 'Alta cocina colombiana con toques internacionales',
    etiquetas: [{ nombre: 'Romántico', icono: '💕' }, { nombre: 'Vista panorámica', icono: '🌄' }]
  },
  {
    id: '3',
    nombre: 'La Octava',
    slug: 'la-octava',
    imagen_principal: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    tipo_nombre: 'Bar',
    tipo_icono: '🍺',
    tipo_color: '#9B59B6',
    ciudad_nombre: 'Cali',
    valoracion_promedio: 4.6,
    total_valoraciones: 567,
    rango_precios: 2,
    descripcion_corta: 'El mejor ambiente salsero de la ciudad',
    etiquetas: [{ nombre: 'Música en vivo', icono: '🎵' }, { nombre: 'Baile', icono: '💃' }]
  },
  {
    id: '4',
    nombre: 'Café Velvet',
    slug: 'cafe-velvet',
    imagen_principal: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    tipo_nombre: 'Café',
    tipo_icono: '☕',
    tipo_color: '#8B4513',
    ciudad_nombre: 'Armenia',
    valoracion_promedio: 4.7,
    total_valoraciones: 342,
    rango_precios: 2,
    descripcion_corta: 'Café de origen con vista al Quindío',
    etiquetas: [{ nombre: 'WiFi', icono: '📶' }, { nombre: 'Terraza', icono: '🌿' }]
  },
]

const categoriasEspeciales = [
  { nombre: 'Círculo Gastro', slug: 'circulo-gastro', icono: '⭐', color: '#FFD700', descripcion: 'Los mejores restaurantes', total: 150 },
  { nombre: 'Cámara de la Diversidad', slug: 'camara-diversidad', icono: '🏳️‍🌈', color: '#FF69B4', descripcion: 'Espacios inclusivos LGBTIQ+', total: 85 },
  { nombre: 'Pet Friendly', slug: 'pet-friendly', icono: '🐕', color: '#4CAF50', descripcion: 'Mascotas bienvenidas', total: 230 },
  { nombre: 'Tardeo', slug: 'tardeo', icono: '🌅', color: '#FF8C00', descripcion: 'Disfruta desde temprano', total: 120 },
]

const ciudades = [
  { nombre: 'Bogotá', slug: 'bogota', imagen: 'https://images.unsplash.com/photo-1536086845232-47c1b118f3f4?w=400', total: 850 },
  { nombre: 'Medellín', slug: 'medellin', imagen: 'https://images.unsplash.com/photo-1599413987323-b2b8c0d7d9c8?w=400', total: 620 },
  { nombre: 'Cali', slug: 'cali', imagen: 'https://images.unsplash.com/photo-1583531172005-523bb5ab6a6e?w=400', total: 480 },
  { nombre: 'Cartagena', slug: 'cartagena', imagen: 'https://images.unsplash.com/photo-1583531172131-d35a1e9e1a96?w=400', total: 390 },
  { nombre: 'Barranquilla', slug: 'barranquilla', imagen: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400', total: 280 },
  { nombre: 'Pereira', slug: 'pereira', imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', total: 190 },
]

const tipos = [
  { nombre: 'Restaurantes', icono: Utensils, color: '#FF6B35', slug: 'restaurante' },
  { nombre: 'Bares', icono: Wine, color: '#9B59B6', slug: 'bar' },
  { nombre: 'Cafés', icono: Coffee, color: '#8B4513', slug: 'cafe' },
  { nombre: 'Discotecas', icono: Music, color: '#E91E63', slug: 'discoteca' },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Mi Destino</span>
            <br />
            <span className="text-white">Tu Noche</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Descubre los mejores restaurantes, bares y cafés de Colombia
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-dark-lighter/90 backdrop-blur-lg rounded-2xl p-2 border border-gray-700/50">
              <div className="flex items-center flex-1 px-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Buscar restaurantes, bares, cafés..."
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link 
                href={`/buscar${searchQuery ? `?q=${searchQuery}` : ''}`}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Buscar
              </Link>
            </div>
          </div>

          {/* Quick Types */}
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            {tipos.map((tipo) => (
              <Link
                key={tipo.slug}
                href={`/buscar?tipo=${tipo.slug}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-dark-lighter/80 backdrop-blur rounded-full hover:bg-dark-card transition-colors border border-gray-700/50"
              >
                <tipo.icono className="w-4 h-4" style={{ color: tipo.color }} />
                <span className="text-sm font-medium">{tipo.nombre}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Categorías Especiales */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Explora por Categoría</h2>
              <p className="text-gray-400 mt-2">Encuentra exactamente lo que buscas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriasEspeciales.map((cat) => (
              <CategoriaCard key={cat.slug} categoria={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="py-20 px-4 bg-dark-lighter/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Destacados</h2>
              <p className="text-gray-400 mt-2">Los lugares más populares</p>
            </div>
            <Link 
              href="/buscar?destacados=true" 
              className="flex items-center text-primary hover:text-primary-light transition-colors font-medium"
            >
              Ver todos <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {establecimientosDestacados.map((est) => (
              <EstablecimientoCard key={est.id} establecimiento={est} />
            ))}
          </div>
        </div>
      </section>

      {/* Ciudades */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Ciudades</h2>
              <p className="text-gray-400 mt-2">Explora los mejores destinos de Colombia</p>
            </div>
            <Link 
              href="/ciudades" 
              className="flex items-center text-primary hover:text-primary-light transition-colors font-medium"
            >
              Ver todas <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ciudades.map((ciudad) => (
              <CiudadCard key={ciudad.slug} ciudad={ciudad} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Descargar App */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-primary to-primary-dark rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                📱 Descarga la App
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
                Lleva Mi Destino Tu Noche en tu bolsillo. Encuentra lugares cercanos, guarda favoritos y más.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link 
                  href="#"
                  className="flex items-center gap-3 bg-black/30 hover:bg-black/50 px-6 py-3 rounded-xl transition-colors"
                >
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <div className="text-xs text-white/70">Disponible en</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </Link>
                <Link 
                  href="#"
                  className="flex items-center gap-3 bg-black/30 hover:bg-black/50 px-6 py-3 rounded-xl transition-colors"
                >
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <div className="text-xs text-white/70">Disponible en</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-dark-lighter/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">2,000+</div>
              <div className="text-gray-400 mt-2">Establecimientos</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">16</div>
              <div className="text-gray-400 mt-2">Ciudades</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">50k+</div>
              <div className="text-gray-400 mt-2">Usuarios</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">10k+</div>
              <div className="text-gray-400 mt-2">Reseñas</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
