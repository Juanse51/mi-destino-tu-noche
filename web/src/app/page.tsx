'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronRight, Users, Calendar } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'
import CategoriaCard from '@/components/CategoriaCard'
import CiudadCard from '@/components/CiudadCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

const CIUDAD_IMAGENES: Record<string, string> = {
  'armenia':       '/ciudades/armenia.jpg',
  'barranquilla':  '/ciudades/barranquilla.jpg',
  'bogota':        '/ciudades/bogota.jpg',
  'bucaramanga':   '/ciudades/bucaramanga.jpg',
  'cali':          '/ciudades/cali.jpg',
  'cartagena':     '/ciudades/cartagena.jpg',
  'cucuta':        '/ciudades/cucuta.jpg',
  'manizales':     '/ciudades/manizales.webp',
  'medellin':      '/ciudades/medellin.webp',
  'monteria':      '/ciudades/monteria.webp',
  'neiva':         '/ciudades/neiva.jpg',
  'pasto':         '/ciudades/pasto.jpg',
  'pereira':       '/ciudades/pereira.webp',
  'santa-marta':   '/ciudades/santa-marta.jpg',
  'sumapaz':       '/ciudades/sumapaz.avif',
  'valledupar':    '/ciudades/valledupar.jpg',
  'villavicencio': '/ciudades/villavicencio.jpg',
  'zipaquira':     '/ciudades/zipaquira.jpg',
}

const categoriasEspeciales = [
  { nombre: "Círculo Gastro", slug: "circulo-gastro", icono: "", color: "#FFD700", descripcion: "Los mejores restaurantes", total: 9, logo: "/circulo-gastro.png" },
  { nombre: "Tardeo", slug: "tardeo", icono: "🌅", color: "#FF8C00", descripcion: "Disfruta desde temprano", total: 120 },
  { nombre: "Transporte", slug: "transportes", href: "/transportes", icono: "🚌", color: "#3F51B5", descripcion: "Movilízate fácil", total: -1 },
  { nombre: "Cámara de la Diversidad", slug: "camara-diversidad", href: "/diversidad", icono: "🏳️‍🌈", color: "#FF69B4", descripcion: "Espacios inclusivos LGBTIQ+", total: 35, logo: "/camara_diversidad.png" },
  // { nombre: "Parques de Diversiones", slug: "parques-de-diversiones", href: "/parques", icono: "🎢", color: "#4CAF50", descripcion: "Diversión garantizada", total: 9 },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ciudades, setCiudades] = useState<any[]>([])
  const [destacados, setDestacados] = useState<any[]>([])
  const [todosEst, setTodosEst] = useState<any[]>([])
  const [cadenas, setCadenas] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const sortByDistance = (items: any[], lat: number, lng: number) => {
    return [...items].sort((a, b) => {
      const da = (a.latitud && a.longitud) ? haversine(lat, lng, a.latitud, a.longitud) : 99999
      const db = (b.latitud && b.longitud) ? haversine(lat, lng, b.latitud, b.longitud) : 99999
      return da - db
    })
  }

  // Coordenadas del centro de cada ciudad colombiana
  const CIUDAD_COORDS: Record<string, {lat: number, lng: number}> = {
    'bogotá': { lat: 4.7110, lng: -74.0721 },
    'bogota': { lat: 4.7110, lng: -74.0721 },
    'medellín': { lat: 6.2442, lng: -75.5812 },
    'medellin': { lat: 6.2442, lng: -75.5812 },
    'cali': { lat: 3.4516, lng: -76.5320 },
    'cartagena': { lat: 10.3910, lng: -75.4794 },
    'barranquilla': { lat: 10.9685, lng: -74.7813 },
    'santa marta': { lat: 11.2408, lng: -74.1990 },
    'pereira': { lat: 4.8087, lng: -75.6906 },
    'armenia': { lat: 4.5339, lng: -75.6811 },
    'bucaramanga': { lat: 7.1193, lng: -73.1227 },
    'villavicencio': { lat: 4.1420, lng: -73.6266 },
    'pasto': { lat: 1.2136, lng: -77.2811 },
    'zipaquirá': { lat: 5.0228, lng: -74.0061 },
    'zipaquira': { lat: 5.0228, lng: -74.0061 },
    'sumapaz': { lat: 4.1500, lng: -74.3500 },
    'cúcuta': { lat: 7.8939, lng: -72.5078 },
    'cucuta': { lat: 7.8939, lng: -72.5078 },
  }

  const getTop10 = (items: any[], loc: {lat: number, lng: number} | null) => {
    if (!loc) return items.slice(0, 10)
    return [...items].sort((a, b) => {
      // Usar coordenadas del establecimiento si existen, si no usar coordenadas de la ciudad
      const coordsA = (a.latitud && a.longitud)
        ? { lat: parseFloat(a.latitud), lng: parseFloat(a.longitud) }
        : CIUDAD_COORDS[a.ciudad_nombre?.toLowerCase()] || null
      const coordsB = (b.latitud && b.longitud)
        ? { lat: parseFloat(b.latitud), lng: parseFloat(b.longitud) }
        : CIUDAD_COORDS[b.ciudad_nombre?.toLowerCase()] || null
      const da = coordsA ? haversine(loc.lat, loc.lng, coordsA.lat, coordsA.lng) : 99999
      const db = coordsB ? haversine(loc.lat, loc.lng, coordsB.lat, coordsB.lng) : 99999
      return da - db
    }).slice(0, 8)
  }

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  // Cargar datos
  useEffect(() => {
    fetch(`${API_URL}/ciudades`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCiudades(data) })
      .catch(() => {})

    // Cargar cadenas dinámicamente: establecimientos con más sedes
    fetch(`${API_URL}/establecimientos/cadenas?limite=4`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCadenas(data)
        else if (data?.cadenas) setCadenas(data.cadenas)
      })
      .catch(() => {
        // Fallback a hardcodeados
        Promise.all([
          fetch(`${API_URL}/establecimientos/bogota-beer-company`).then(r=>r.json()),
          fetch(`${API_URL}/establecimientos/la-plaza-de-andres-el-retiro`).then(r=>r.json()),
          fetch(`${API_URL}/establecimientos/storia-d-amore-cali`).then(r=>r.json()),
          fetch(`${API_URL}/establecimientos/full-80s-cll-118`).then(r=>r.json()),
        ]).then(results => setCadenas(results.filter(r => r && r.id))).catch(() => {})
      })

    fetch(`${API_URL}/establecimientos?limite=300`)
      .then(r => r.json())
      .then(data => {
        if (data?.establecimientos) {
          setTodosEst(data.establecimientos)
        }
      })
      .catch(() => {})
  }, [])

  // Reordenar destacados cuando cambia ubicación o cuando llegan los datos
  useEffect(() => {
    if (todosEst.length > 0) {
      setDestacados(getTop10(todosEst, userLocation))
    }
  }, [userLocation, todosEst])

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/hero-2.jpeg"
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
          <p className="text-lg md:text-2xl text-orange-400 mt-20 mb-6 max-w-2xl mx-auto text-center">¿Sabes <strong>que vas a hacer</strong> cuando<br />termine <strong>tu día</strong>?</p>

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
                  onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}` }}
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

          {/* Botón grupo grande */}
          <div className="mt-6">
            <a
              href="https://wa.me/573212304589?text=Hola%2C%20te%20hablo%20desde%20Mi%20Destino%20Tu%20Noche%2C%20tengo%20un%20grupo%20grande%20y%20necesito%20ayuda."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors"
            >
              <Users className="w-5 h-5" />
              Grupo +15 pax aquí
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
                imagen: CIUDAD_IMAGENES[ciudad.slug] || ciudad.imagen_url || 'https://images.unsplash.com/photo-1536086845232-47c1b118f3f4?w=400',
                total: ciudad.total_establecimientos || 0
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* Cadenas */}
      <section className="py-20 px-4 bg-dark-lighter/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Las mejores cadenas de cafés, bares y restaurantes del país</h2>
            <p className="text-gray-400 mt-2">Conoce las marcas con presencia en todo el territorio</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cadenas.map((est) => (
              <Link key={est.id} href={`/establecimiento/${est.slug}`} className="group">
                <div className="bg-dark-lighter rounded-2xl p-6 text-center hover:bg-dark-card transition-colors border border-gray-800 hover:border-primary/50">
                  {est.imagen_principal && (
                    <img src={est.imagen_principal} alt={est.nombre} className="w-20 h-20 rounded-xl mx-auto mb-4 object-contain" />
                  )}
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{est.nombre}</h3>
                  <p className="text-sm text-gray-400 mt-1">{est.sedes?.length || 0} sedes</p>
                  <p className="text-xs text-primary mt-2">Ver sedes →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Especiales */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Experiencias</h2>
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

      {/* Banner Ruta Colombia Artesanal */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <a href="https://colombiaartesanal.com.co/rutas/" target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative bg-gradient-to-r from-amber-700 to-yellow-600 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 p-10 md:p-14 flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-2">Descubre Colombia</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">🧶 Ruta Colombia Artesanal</h3>
                  <p className="text-white/80 mt-3 text-lg">Conoce las rutas artesanales del país</p>
                </div>
                <div className="text-6xl hidden md:block">🇨🇴</div>
              </div>
            </div>
          </a>
        </div>
      </section>
      {/* Banner Calendario de Eventos */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/calendario" className="block">
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

      {/* DJs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 p-12 md:p-16 text-center">
              <img src="/logo_cluster_dj.png" alt="Cluster DJ" className="h-20 mx-auto mb-4 object-contain" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🎧 ¿Tienes una fiesta?
              </h2>
              <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                Nosotros tenemos el DJ. Conoce los mejores DJs de Colombia.
              </p>
              <a href="https://www.clusterdj.co/bolsa" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-semibold transition-colors mt-4">Conoce nuestros DJs →</a>
            </div>
          </div>
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
                  href="/mi-destino-tu-noche.apk" download
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

      {/* Stats - hidden temporarily */}
      <section className="py-20 px-4 bg-dark-lighter/30 hidden">
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
