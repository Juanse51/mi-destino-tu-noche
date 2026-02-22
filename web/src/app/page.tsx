'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, Star, ChevronRight, Utensils, Wine, Coffee, Music, Tent, PartyPopper, Sparkles, Users, Calendar } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'
import CategoriaCard from '@/components/CategoriaCard'
import CiudadCard from '@/components/CiudadCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

const categoriasEspeciales = [
  { nombre: 'Círculo Gastro', slug: 'circulo-gastro', icono: '⭐', color: '#FFD700', descripcion: 'Los mejores restaurantes', total: 150 },
  { nombre: 'Cámara de la Diversidad', slug: 'camara-diversidad', icono: '🏳️‍🌈', color: '#FF69B4', descripcion: 'Espacios inclusivos LGBTIQ+', total: 85 },
  { nombre: 'Pet Friendly', slug: 'pet-friendly', icono: '🐕', color: '#4CAF50', descripcion: 'Mascotas bienvenidas', total: 230 },
  { nombre: 'Tardeo', slug: 'tardeo', icono: '🌅', color: '#FF8C00', descripcion: 'Disfruta desde temprano', total: 120 },
]

const tipos = [
  { nombre: 'Restaurantes', icono: Utensils, color: '#FF6B35', slug: 'restaurante' },
  { nombre: 'Bares', icono: Wine, color: '#9B59B6', slug: 'bar' },
  { nombre: 'Cafés', icono: Coffee, color: '#8B4513', slug: 'cafe' },
  { nombre: 'Discotecas', icono: Music, color: '#E91E63', slug: 'discoteca' },
  { nombre: 'Parques de diversiones', icono: Tent, color: '#4CAF50', slug: 'parque-diversiones' },
  { nombre: 'Conciertos y festivales', icono: PartyPopper, color: '#FF9800', slug: 'conciertos-festivales' },
  { nombre: 'Otros planes', icono: Sparkles, color: '#00BCD4', slug: 'otros-planes' },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ciudades, setCiudades] = useState<any[]>([])
  const [destacados, setDestacados] = useState<any[]>([])

  useEffect(() => {
    // Cargar ciudades del API
    fetch(`${API_URL}/ciudades`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCiudades(data)
      })
      .catch(() => {})

    // Cargar destacados del API
    fetch(`${API_URL}/establecimientos?limite=8&orden=recientes`)
      .then(r => r.json())
      .then(data => {
        if (data?.establecimientos) setDestacados(data.establecimientos)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Frase encima del logo */}
          <p className="text-xl md:text-2xl text-orange-400 mb-6 max-w-2xl mx-auto text-center">
            ¿Sabes que vas a hacer cuando caiga la tarde
            y comience la noche?
          </p>

          {/* Logo grande */}
          <div className="flex justify-center mb-4">
            <Image
              src="https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png"
              alt="Mi Destino Tu Noche"
              width={400}
              height={150}
              className="w-[280px] md:w-[400px] h-auto"
              priority
            />
          </div>

          {/* By Asobares */}
          <a 
            href="https://asobares.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-gray-400 hover:text-primary transition-colors mb-8 text-sm md:text-base"
          >
            By Asobares Colombia
          </a>

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
          <div className="flex justify-center gap-3 mt-8 flex-wrap">
            {tipos.map((tipo) => (
              <Link
                key={tipo.slug}
                href={`/buscar?tipo=${tipo.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-dark-lighter/80 backdrop-blur rounded-full hover:bg-dark-card transition-colors border border-gray-700/50"
              >
                <tipo.icono className="w-4 h-4" style={{ color: tipo.color }} />
                <span className="text-sm font-medium">{tipo.nombre}</span>
              </Link>
            ))}
          </div>

          {/* Botón grupo grande */}
          <div className="mt-6">
            <a
              href="https://wa.me/573212304589?text=Hola%2C%20te%20hablo%20desde%20Mi%20Destino%20Tu%20Noche%2C%20tengo%20un%20grupo%20grande%20y%20necesito%20ayuda."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors"
            >
              <Users className="w-5 h-5" />
              ¿Tienes un grupo grande? ¡Contáctanos!
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Ciudades - ANTES de categorías */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ciudades.map((ciudad: any) => (
              <CiudadCard key={ciudad.slug || ciudad.id} ciudad={{
                nombre: ciudad.nombre,
                slug: ciudad.slug,
                imagen: ciudad.imagen_url || 'https://images.unsplash.com/photo-1536086845232-47c1b118f3f4?w=400',
                total: ciudad.total_establecimientos || 0
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Especiales */}
      <section className="py-20 px-4 bg-dark-lighter/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Explora por categoría</h2>
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

      {/* Banner Calendario de Eventos */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/eventos" className="block">
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 p-10 md:p-14 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Calendario de eventos y festivales
                  </h2>
                  <p className="text-white/80 text-lg">Descubre lo mejor que viene para ti</p>
                </div>
                <Calendar className="w-16 h-16 text-white/30 hidden md:block" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Destacados */}
      <section className="py-20 px-4">
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
            {destacados.length > 0 ? destacados.map((est: any) => (
              <EstablecimientoCard key={est.id} establecimiento={est} />
            )) : (
              <p className="text-gray-400 col-span-4">Cargando...</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Descargar App - Solo Android */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-primary to-primary-dark rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                📱 Descarga la app
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
                Lleva Mi Destino Tu Noche en tu bolsillo. Encuentra lugares cercanos, guarda favoritos y más.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="#"
                  className="flex items-center gap-3 bg-black/30 hover:bg-black/50 px-8 py-4 rounded-xl transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-green-400">
                    <path d="M17.523 2.237a.625.625 0 0 0-.803.27l-1.39 2.545A10.08 10.08 0 0 0 12 4.38c-1.2 0-2.349.232-3.33.672L7.28 2.507a.625.625 0 1 0-1.073.534l1.39 2.545A7.482 7.482 0 0 0 4.5 11.25h15a7.482 7.482 0 0 0-3.097-5.664l1.39-2.545a.625.625 0 0 0-.27-.804zM8.25 9a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm7.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM4.5 12h15v6.75a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3V12z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-white/70">Descarga para</div>
                    <div className="font-bold text-lg">Android</div>
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
              <div className="text-4xl md:text-5xl font-bold text-primary">650+</div>
              <div className="text-gray-400 mt-2">Establecimientos</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">18</div>
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
