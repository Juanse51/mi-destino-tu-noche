'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, MapPin, Phone, MessageCircle, Globe, Clock, 
  Heart, Share2, ChevronLeft, ChevronRight, Instagram,
  Navigation, Wifi, Music, Car, Dog
} from 'lucide-react'

// Datos de ejemplo
const establecimiento = {
  id: '1',
  nombre: 'Andrés Carne de Res',
  slug: 'andres-carne-de-res',
  descripcion: 'Andrés Carne de Res es mucho más que un restaurante, es una experiencia única que combina la mejor gastronomía colombiana con un ambiente festivo incomparable. Fundado en 1982, se ha convertido en uno de los destinos gastronómicos más emblemáticos de Colombia, donde la comida, la música y la alegría se fusionan para crear momentos inolvidables.',
  imagen_principal: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
  tipo_nombre: 'Restaurante',
  tipo_icono: '🍽️',
  tipo_color: '#FF6B35',
  tipo_comida_nombre: 'Colombiana',
  ciudad_nombre: 'Chía',
  departamento_nombre: 'Cundinamarca',
  direccion: 'Calle 3 No. 11A-56, Chía',
  telefono: '+57 1 8631632',
  whatsapp: '573112345678',
  instagram: 'andrescarnederes',
  sitio_web: 'https://andrescarnederes.com',
  valoracion_promedio: 4.8,
  total_valoraciones: 1250,
  rango_precios: 3,
  latitud: 4.8666,
  longitud: -74.0333,
  horarios: {
    lunes: 'Cerrado',
    martes: '12:00 - 00:00',
    miercoles: '12:00 - 00:00',
    jueves: '12:00 - 01:00',
    viernes: '12:00 - 03:00',
    sabado: '12:00 - 03:00',
    domingo: '12:00 - 22:00',
  },
  etiquetas: [
    { nombre: 'Música en vivo', icono: '🎵' },
    { nombre: 'Terraza', icono: '🌿' },
    { nombre: 'Parqueadero', icono: '🅿️' },
    { nombre: 'WiFi', icono: '📶' },
    { nombre: 'Familiar', icono: '👨‍👩‍👧‍👦' },
  ],
  categorias_especiales: [
    { nombre: 'Círculo Gastro', icono: '⭐', color: '#FFD700' },
  ],
  galeria: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
  ],
  valoraciones_recientes: [
    { usuario_nombre: 'María García', puntuacion: 5, comentario: '¡Increíble experiencia! La comida deliciosa y el ambiente es único. Definitivamente volveré.', created_at: '2024-01-15' },
    { usuario_nombre: 'Carlos Rodríguez', puntuacion: 4, comentario: 'Muy buen lugar, aunque un poco costoso. La música en vivo es excelente.', created_at: '2024-01-10' },
    { usuario_nombre: 'Ana Martínez', puntuacion: 5, comentario: 'El mejor restaurante de Colombia sin duda. Una experiencia que todos deben vivir.', created_at: '2024-01-05' },
  ]
}

export default function EstablecimientoPage({ params }: { params: { slug: string } }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'resenas'>('info')

  const est = establecimiento

  return (
    <div className="min-h-screen pt-16">
      {/* Gallery */}
      <div className="relative h-[50vh] md:h-[60vh] bg-dark-lighter">
        <Image
          src={est.galeria[activeImageIndex]}
          alt={est.nombre}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/30" />

        {/* Navigation arrows */}
        {est.galeria.length > 1 && (
          <>
            <button 
              onClick={() => setActiveImageIndex(i => i === 0 ? est.galeria.length - 1 : i - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setActiveImageIndex(i => i === est.galeria.length - 1 ? 0 : i + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {est.galeria.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImageIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeImageIndex ? 'w-8 bg-primary' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-full backdrop-blur transition-colors ${
              isFavorite ? 'bg-red-500' : 'bg-dark/50 hover:bg-dark/70'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
          <button className="p-3 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Type badge */}
        <div 
          className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-semibold flex items-center gap-2"
          style={{ backgroundColor: est.tipo_color }}
        >
          <span>{est.tipo_icono}</span>
          <span>{est.tipo_nombre}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-dark-lighter rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{est.nombre}</h1>
              <p className="text-primary font-medium">{est.tipo_comida_nombre}</p>
              <div className="flex items-center gap-2 text-gray-400 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{est.ciudad_nombre}, {est.departamento_nombre}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Rating */}
              <div className="text-center">
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span>{est.valoracion_promedio}</span>
                </div>
                <p className="text-sm text-gray-400">{est.total_valoraciones} reseñas</p>
              </div>

              {/* Price */}
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-green">
                  {'$'.repeat(est.rango_precios)}
                  <span className="text-gray-600">{'$'.repeat(4 - est.rango_precios)}</span>
                </div>
                <p className="text-sm text-gray-400">Precio</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {est.categorias_especiales.map((cat, i) => (
              <span 
                key={i}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${cat.color}30`, color: cat.color }}
              >
                {cat.icono} {cat.nombre}
              </span>
            ))}
            {est.etiquetas.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-dark rounded-full text-sm text-gray-300">
                {tag.icono} {tag.nombre}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <a 
              href={`tel:${est.telefono}`}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark py-3 rounded-xl font-medium transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Llamar</span>
            </a>
            <a 
              href={`https://wa.me/${est.whatsapp}?text=Hola%2C%20te%20hablo%20desde%20Mi%20Destino%20Tu%20Noche%2C%20quisiera%20hacer%20una%20reserva.`}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${est.latitud},${est.longitud}`}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium transition-colors"
            >
              <Navigation className="w-5 h-5" />
              <span>Cómo llegar</span>
            </a>
            <a 
              href={est.sitio_web}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-dark hover:bg-dark-card py-3 rounded-xl font-medium transition-colors border border-gray-700"
            >
              <Globe className="w-5 h-5" />
              <span>Sitio web</span>
            </a>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            {['info', 'menu', 'resenas'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab 
                    ? 'text-primary border-primary' 
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab === 'info' ? 'Información' : tab === 'menu' ? 'Menú' : `Reseñas (${est.total_valoraciones})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                <p className="text-gray-300 leading-relaxed">{est.descripcion}</p>
              </div>

              {/* Hours */}
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horarios
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(est.horarios).map(([dia, horario]) => (
                    <div key={dia} className="bg-dark p-3 rounded-lg">
                      <div className="text-sm text-gray-400 capitalize">{dia}</div>
                      <div className={horario === 'Cerrado' ? 'text-red-400' : 'text-white'}>
                        {horario}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{est.direccion}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{est.telefono}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-primary" />
                    <a href={`https://instagram.com/${est.instagram}`} target="_blank" className="hover:text-primary">
                      @{est.instagram}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🍽️</div>
              <p className="text-gray-400">Menú disponible en el establecimiento</p>
            </div>
          )}

          {activeTab === 'resenas' && (
            <div className="space-y-4">
              {est.valoraciones_recientes.map((val, i) => (
                <div key={i} className="bg-dark p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                        {val.usuario_nombre.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{val.usuario_nombre}</div>
                        <div className="text-sm text-gray-400">{val.created_at}</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < val.puntuacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{val.comentario}</p>
                </div>
              ))}

              <button className="w-full py-3 bg-primary hover:bg-primary-dark rounded-xl font-medium transition-colors">
                Escribir una reseña
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-20" />
    </div>
  )
}
