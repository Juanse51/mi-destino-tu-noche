import Link from 'next/link'
import { Star, MapPin } from 'lucide-react'

interface Establecimiento {
  id: string
  nombre: string
  slug: string
  imagen_principal: string | null
  logo_url?: string | null
  tipo_nombre: string
  tipo_icono: string
  tipo_color: string
  ciudad_nombre: string
  valoracion_promedio: number | string
  total_valoraciones: number
  rango_precios: number
  descripcion_corta?: string
  etiquetas?: { nombre: string; icono: string }[]
}

export default function EstablecimientoCard({ establecimiento }: { establecimiento: Establecimiento }) {
  const { 
    nombre, slug, imagen_principal, logo_url, tipo_nombre, tipo_icono, tipo_color,
    ciudad_nombre, valoracion_promedio, rango_precios,
    descripcion_corta, etiquetas
  } = establecimiento

  const rating = Number(valoracion_promedio) || 0
  const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'

  // Detectar si imagen_principal es realmente un logo (png de supabase sin foto real)
  const fotoHero = imagen_principal && !imagen_principal.includes('logo') 
    ? imagen_principal 
    : null
  const logo = logo_url || (imagen_principal?.includes('logo') ? imagen_principal : null)

  return (
    <Link href={`/establecimiento/${slug}`} className="group">
      <div className="bg-dark-lighter rounded-2xl overflow-hidden card-hover">
        {/* Hero image con logo centrado */}
        <div className="relative h-48 overflow-hidden bg-[#1a1a2e]">
          {/* Foto de fondo */}
          <img
            src={fotoHero || defaultImage}
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />

          {/* Logo centrado encima de la foto */}
          {logo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 bg-dark/80 backdrop-blur-sm shadow-xl">
                <img
                  src={logo}
                  alt={`Logo ${nombre}`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>
          )}

          {/* Type badge */}
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            style={{ backgroundColor: tipo_color || '#FF6B35' }}
          >
            <span>{tipo_icono || '🍽️'}</span>
            <span>{tipo_nombre || 'Establecimiento'}</span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 bg-dark/80 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {nombre}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{ciudad_nombre}</span>
            <span>•</span>
            <span className="text-accent-green font-medium">
              {'$'.repeat(rango_precios || 2)}
              <span className="text-gray-600">{'$'.repeat(4 - (rango_precios || 2))}</span>
            </span>
          </div>

          {descripcion_corta && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
              {descripcion_corta}
            </p>
          )}

          {etiquetas && etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {etiquetas.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-dark rounded-md text-gray-400">
                  {tag.icono} {tag.nombre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
