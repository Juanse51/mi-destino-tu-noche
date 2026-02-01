import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin } from 'lucide-react'

interface Establecimiento {
  id: string
  nombre: string
  slug: string
  imagen_principal: string
  tipo_nombre: string
  tipo_icono: string
  tipo_color: string
  ciudad_nombre: string
  valoracion_promedio: number
  total_valoraciones: number
  rango_precios: number
  descripcion_corta?: string
  etiquetas?: { nombre: string; icono: string }[]
}

export default function EstablecimientoCard({ establecimiento }: { establecimiento: Establecimiento }) {
  const { 
    nombre, slug, imagen_principal, tipo_nombre, tipo_icono, tipo_color,
    ciudad_nombre, valoracion_promedio, total_valoraciones, rango_precios,
    descripcion_corta, etiquetas
  } = establecimiento

  return (
    <Link href={`/establecimiento/${slug}`} className="group">
      <div className="bg-dark-lighter rounded-2xl overflow-hidden card-hover">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imagen_principal}
            alt={nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
          
          {/* Type badge */}
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            style={{ backgroundColor: tipo_color }}
          >
            <span>{tipo_icono}</span>
            <span>{tipo_nombre}</span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 bg-dark/80 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">{valoracion_promedio.toFixed(1)}</span>
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
              {'$'.repeat(rango_precios)}
              <span className="text-gray-600">{'$'.repeat(4 - rango_precios)}</span>
            </span>
          </div>

          {descripcion_corta && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
              {descripcion_corta}
            </p>
          )}

          {/* Tags */}
          {etiquetas && etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {etiquetas.slice(0, 3).map((tag, i) => (
                <span 
                  key={i} 
                  className="text-xs px-2 py-1 bg-dark rounded-md text-gray-400"
                >
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
