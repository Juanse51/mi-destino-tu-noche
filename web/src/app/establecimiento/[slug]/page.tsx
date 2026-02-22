'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Star, MapPin, Phone, MessageCircle, Globe, Clock, 
  Heart, Share2, Instagram, Navigation, ChevronLeft
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

const TIPO_CONFIG: Record<string, { icono: string; color: string; gradient: string }> = {
  'Restaurante': { icono: '🍽️', color: '#FF6B35', gradient: 'from-orange-900/80 to-dark' },
  'Bar': { icono: '🍺', color: '#3B82F6', gradient: 'from-blue-900/80 to-dark' },
  'Discoteca': { icono: '🪩', color: '#A855F7', gradient: 'from-purple-900/80 to-dark' },
  'Gastrobar': { icono: '🍸', color: '#EC4899', gradient: 'from-pink-900/80 to-dark' },
  'Café': { icono: '☕', color: '#F59E0B', gradient: 'from-amber-900/80 to-dark' },
}

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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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

  const rating = Number(est.valoracion_promedio) || 0
  const totalResenas = Number(est.total_valoraciones) || 0
  const rangoPrecio = Number(est.rango_precios) || 2
  const cupones = est.cupones || []
  const valoraciones = est.valoraciones_recientes || []

  // Detectar si la imagen es un logo (PNG de Supabase) vs foto real
  const isLogo = est.imagen_principal && (
    est.imagen_principal.includes('.png') || 
    est.imagen_principal.includes('supabase')
  )
  const hasRealPhoto = est.imagen_principal && !isLogo
  const tipoConfig = TIPO_CONFIG[est.tipo_nombre] || { icono: '📍', color: '#FF6B35', gradient: 'from-gray-900/80 to-dark' }
  
  // Fotos adicionales del establecimiento (galería)
  const fotos = est.fotos || est.galeria || []

  return (
    <div className="min-h-screen pt-16">
      {/* Hero - Adaptable */}
      {hasRealPhoto ? (
        /* Si tiene foto real, mostrarla grande en el hero */
        <div className="relative h-[50vh] md:h-[60vh] bg-dark-lighter">
          <img
            src={est.imagen_principal}
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
          <div 
            className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-semibold flex items-center gap-2"
            style={{ backgroundColor: tipoConfig.color }}
          >
            <span>{tipoConfig.icono}</span>
            <span>{est.tipo_nombre || 'Establecimiento'}</span>
          </div>
        </div>
      ) : (
        /* Si es logo o no tiene imagen, usar hero con gradiente */
        <div className={`relative h-[35vh] md:h-[40vh] bg-gradient-to-b ${tipoConfig.gradient}`}>
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Back button */}
          <Link href="/" className="absolute top-4 left-4 p-3 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors z-10">
            <ChevronLeft className="w-5 h-5" />
          </Link>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
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

          {/* Centered logo + tipo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {est.imagen_principal && (
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-[#1a1a2e] border-4 border-white/10 flex items-center justify-center mb-4 shadow-2xl overflow-hidden">
                <img
                  src={est.imagen_principal}
                  alt={est.nombre}
                  className="max-w-[85%] max-h-[85%] object-contain drop-shadow-lg"
                />
              </div>
            )}
            <div 
              className="px-4 py-2 rounded-full font-semibold flex items-center gap-2"
              style={{ backgroundColor: tipoConfig.color }}
            >
              <span>{tipoConfig.icono}</span>
              <span>{est.tipo_nombre || 'Establecimiento'}</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-dark-lighter rounded-2xl p-6 md:p-8">
          {/* Header con logo circular (cuando hay logo y se usó hero con foto o gradiente) */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              {/* Logo circular al lado del nombre (solo si es logo y se mostró en hero con gradiente) */}
              {isLogo && est.imagen_principal && (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1a1a2e] border-2 border-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={est.imagen_principal}
                    alt={est.nombre}
                    className="max-w-[80%] max-h-[80%] object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{est.nombre}</h1>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{est.ciudad_nombre}{est.direccion ? ` • ${est.direccion}` : ''}</span>
                </div>
                {est.genero_musical && (
                  <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <span className="text-sm">🎵 {est.genero_musical}</span>
                  </div>
                )}
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
              <a href={`https://wa.me/${est.whatsapp}?text=Hola%2C%20te%20hablo%20desde%20Mi%20Destino%20Tu%20Noche%2C%20quisiera%20hacer%20una%20reserva.`} target="_blank" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-medium transition-colors">
                <MessageCircle className="w-5 h-5" /><span>WhatsApp</span>
              </a>
            )}
            {(est.direccion || (est.latitud && est.longitud)) && (
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${est.direccion ? encodeURIComponent(est.direccion + ', ' + (est.ciudad_nombre || 'Colombia')) : est.latitud + ',' + est.longitud}`} target="_blank" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium transition-colors">
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
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{est.direccion}</span>
                    </div>
                  )}
                  {est.telefono && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{est.telefono}</span>
                    </div>
                  )}
                  {est.instagram && (
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-primary flex-shrink-0" />
                      <a href={`https://instagram.com/${est.instagram}`} target="_blank" className="hover:text-primary transition-colors">
                        @{est.instagram}
                      </a>
                    </div>
                  )}
                  {est.genero_musical && (
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🎵</span>
                      <span>Género musical: <span className="text-white font-medium">{est.genero_musical}</span></span>
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
