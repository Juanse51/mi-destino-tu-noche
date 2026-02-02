'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Star, MapPin, Phone, MessageCircle, Globe, Clock, 
  Heart, Share2, Instagram, Navigation, ChevronLeft
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function EstablecimientoPage({ params }: { params: { slug: string } }) {
  const [est, setEst] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'cupones' | 'resenas'>('info')
  const [copiedCupon, setCopiedCupon] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstablecimiento = async () => {
      try {
        const res = await fetch(`${API_URL}/establecimientos/${params.slug}`)
        if (res.ok) {
          const data = await res.json()
          setEst(data)
        }
      } catch (err) {
        console.error('Error cargando establecimiento:', err)
      }
      setLoading(false)
    }
    fetchEstablecimiento()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-400">Cargando establecimiento...</p>
        </div>
      </div>
    )
  }

  if (!est) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Establecimiento no encontrado</h2>
          <p className="text-gray-400 mb-6">No pudimos encontrar el lugar que buscas</p>
          <Link href="/" className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-xl font-medium transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'
  const rating = Number(est.valoracion_promedio) || 0
  const totalResenas = Number(est.total_valoraciones) || 0
  const rangoPrecio = Number(est.rango_precios) || 2
  const cupones = est.cupones || []
  const valoraciones = est.valoraciones_recientes || []

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] bg-dark-lighter">
        <img
          src={est.imagen_principal || defaultImage}
          alt={est.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/30" />

        {/* Back button */}
        <Link href="/" className="absolute top-4 left-4 p-3 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>

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
        <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-semibold flex items-center gap-2 bg-primary">
          <span>{est.tipo_nombre || 'Establecimiento'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-dark-lighter rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{est.nombre}</h1>
              <div className="flex items-center gap-2 text-gray-400 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{est.ciudad_nombre}{est.direccion ? ` • ${est.direccion}` : ''}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span>{rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-400">{totalResenas} reseñas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-green">
                  {'$'.repeat(rangoPrecio)}
                  <span className="text-gray-600">{'$'.repeat(4 - rangoPrecio)}</span>
                </div>
                <p className="text-sm text-gray-400">Precio</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {est.etiquetas && est.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {est.etiquetas.map((tag: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-dark rounded-full text-sm text-gray-300">
                  {tag.icono} {tag.nombre}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {est.telefono && (
              <a href={`tel:${est.telefono}`} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark py-3 rounded-xl font-medium transition-colors">
                <Phone className="w-5 h-5" /><span>Llamar</span>
              </a>
            )}
            {est.whatsapp && (
              <a href={`https://wa.me/${est.whatsapp}`} target="_blank" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-medium transition-colors">
                <MessageCircle className="w-5 h-5" /><span>WhatsApp</span>
              </a>
            )}
            {(est.latitud && est.longitud) && (
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${est.latitud},${est.longitud}`} target="_blank" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium transition-colors">
                <Navigation className="w-5 h-5" /><span>Cómo llegar</span>
              </a>
            )}
            {est.instagram && (
              <a href={`https://instagram.com/${est.instagram}`} target="_blank" className="flex items-center justify-center gap-2 bg-dark hover:bg-dark-card py-3 rounded-xl font-medium transition-colors border border-gray-700">
                <Instagram className="w-5 h-5" /><span>Instagram</span>
              </a>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
            {(['info', 'cupones', 'resenas'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab === 'info' ? 'Información' : tab === 'cupones' ? `🎟️ Cupones (${cupones.length})` : `Reseñas (${totalResenas})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="space-y-8">
              {est.descripcion && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                  <p className="text-gray-300 leading-relaxed">{est.descripcion}</p>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold mb-3">Contacto</h3>
                <div className="space-y-3">
                  {est.direccion && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>{est.direccion}</span>
                    </div>
                  )}
                  {est.telefono && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <span>{est.telefono}</span>
                    </div>
                  )}
                  {est.instagram && (
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-primary" />
                      <a href={`https://instagram.com/${est.instagram}`} target="_blank" className="hover:text-primary">
                        @{est.instagram}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cupones' && (
            <div className="space-y-4">
              {cupones.length > 0 ? (
                cupones.map((cupon: any) => (
                  <div key={cupon.id} className="rounded-xl overflow-hidden border border-gray-700/50 p-5 bg-dark">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="text-2xl font-black text-primary">
                          {cupon.tipo_descuento === 'porcentaje' && `${cupon.valor_descuento}% OFF`}
                          {cupon.tipo_descuento === 'monto_fijo' && `$${cupon.valor_descuento?.toLocaleString()} OFF`}
                          {cupon.tipo_descuento === '2x1' && '2×1'}
                        </div>
                        <h3 className="text-lg font-semibold mt-1">{cupon.titulo}</h3>
                        <p className="text-sm text-gray-400 mt-1">{cupon.descripcion}</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-dark-lighter px-4 py-2.5 rounded-xl border border-gray-700 text-center">
                          <p className="text-[10px] text-gray-500 uppercase">Código</p>
                          <p className="font-mono font-bold text-lg text-primary">{cupon.codigo}</p>
                        </div>
                        <button
                          onClick={() => { navigator.clipboard?.writeText(cupon.codigo); setCopiedCupon(cupon.id); setTimeout(() => setCopiedCupon(null), 2000) }}
                          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${copiedCupon === cupon.id ? 'bg-green-500' : 'bg-primary hover:bg-primary-dark'}`}
                        >
                          {copiedCupon === cupon.id ? '✓ Copiado' : 'Copiar código'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🎟️</div>
                  <p className="text-gray-400">No hay cupones disponibles en este momento</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resenas' && (
            <div className="space-y-4">
              {valoraciones.length > 0 ? (
                valoraciones.map((val: any, i: number) => (
                  <div key={i} className="bg-dark p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                          {(val.usuario_nombre || 'U').charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{val.usuario_nombre || 'Usuario'}</div>
                          <div className="text-sm text-gray-400">{val.created_at}</div>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-4 h-4 ${j < val.puntuacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">{val.comentario}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">⭐</div>
                  <p className="text-gray-400">Aún no hay reseñas para este establecimiento</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-20" />
    </div>
  )
}
