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
  const { nombre, slug, imagen_principal, logo_url, tipo_nombre, tipo_icono, tipo_color, ciudad_nombre, valoracion_promedio, rango_precios } = establecimiento
  const rating = Number(valoracion_promedio) || 0
  const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
  const logo = logo_url || null

  return (
    <Link href={`/establecimiento/${slug}`} className="group block">
      <div style={{ borderRadius: 20, overflow: 'hidden', background: '#12122a', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', position: 'relative' }} className="card-hover">

        {/* FOTO */}
        <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
          <img
            src={imagen_principal || defaultImage}
            alt={nombre}
            className="group-hover:scale-105 transition-transform duration-500"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gradiente en la parte inferior para que se lea el contenido */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,30,0.95) 0%, rgba(10,10,30,0.3) 45%, transparent 70%)' }} />

          {/* Badge tipo — arriba izquierda */}
          <div style={{ position: 'absolute', top: 12, left: 12, background: tipo_color || '#FF6B35', borderRadius: 999, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13 }}>{tipo_icono || '🍽️'}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{tipo_nombre}</span>
          </div>

          {/* Rating — arriba derecha */}
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.75)', borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(8px)' }}>
            <Star style={{ width: 14, height: 14, fill: '#FBBF24', color: '#FBBF24' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{rating.toFixed(1)}</span>
          </div>

          {/* BARRA INFERIOR: logo izquierda + info derecha */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Logo */}
            {logo && (
              <div style={{ width: 72, height: 72, borderRadius: 16, background: 'white', padding: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.5)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={logo} alt={nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}

            {/* Nombre + ciudad */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: 'white', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nombre}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9ca3af', fontSize: 13 }}>
                <MapPin style={{ width: 13, height: 13, flexShrink: 0 }} />
                <span>{ciudad_nombre}</span>
                <span>•</span>
                <span style={{ color: '#4ade80', fontWeight: 600 }}>
                  {'$'.repeat(rango_precios || 2)}
                  <span style={{ color: '#4b5563' }}>{'$'.repeat(4 - (rango_precios || 2))}</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}
