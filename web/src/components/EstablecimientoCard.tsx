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
  } = establecimiento

  const rating = Number(valoracion_promedio) || 0
  const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'

  const fotoHero = imagen_principal && !imagen_principal.includes('logo')
    ? imagen_principal
    : null
  const logo = logo_url || (imagen_principal?.includes('logo') ? imagen_principal : null)

  return (
    <Link href={`/establecimiento/${slug}`} className="group">
      <div
        className="overflow-hidden card-hover"
        style={{
          borderRadius: '20px',
          background: '#12122a',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Foto hero */}
        <div className="relative overflow-hidden" style={{ height: '220px', background: '#0d0d1a' }}>
          <img
            src={fotoHero || defaultImage}
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradiente inferior */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,10,30,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }}
          />

          {/* Badge tipo */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5"
            style={{
              backgroundColor: tipo_color || '#FF6B35',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: '13px' }}>{tipo_icono || '🍽️'}</span>
            <span>{tipo_nombre || 'Establecimiento'}</span>
          </div>

          {/* Rating */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5"
            style={{
              background: 'rgba(10,10,30,0.85)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Logo centrado */}
          {logo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '22px',
                  background: 'white',
                  padding: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={logo}
                  alt={`Logo ${nombre}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Info inferior */}
        <div
          style={{
            padding: '16px 18px 18px',
            background: '#12122a',
          }}
        >
          <h3
            className="line-clamp-1"
            style={{
              fontWeight: 800,
              fontSize: '18px',
              color: 'white',
              marginBottom: '8px',
              letterSpacing: '-0.01em',
            }}
          >
            {nombre}
          </h3>

          <div className="flex items-center gap-1.5" style={{ color: '#9ca3af', fontSize: '14px' }}>
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{ciudad_nombre}</span>
            <span style={{ margin: '0 2px' }}>•</span>
            <span style={{ color: '#4ade80', fontWeight: 600 }}>
              {'$'.repeat(rango_precios || 2)}
              <span style={{ color: '#374151' }}>{'$'.repeat(4 - (rango_precios || 2))}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
