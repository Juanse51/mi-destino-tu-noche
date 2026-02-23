'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, MapPin, Phone, MessageCircle, Globe, Clock, 
  Heart, Share2, ChevronLeft, ChevronRight, Instagram,
  Navigation, Building2, Loader2
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function EstablecimientoPage({ params }: { params: { slug: string } }) {
  const [est, setEst] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'cupones' | 'resenas'>('info')

  useEffect(() => {
    fetch(`${API_URL}/establecimientos/${params.slug}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setEst(data)
          setIsFavorite(data.es_favorito || false)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!est) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2">Establecimiento no encontrado</h2>
          <Link href="/" className="text-primary hover:text-primary-light">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const logoImg = est.logo_url || est.imagen_principal
  const galeria = est.galeria && est.galeria.length > 0 
    ? est.galeria.map((f: any) => f.url || f) 
    : (est.imagen_principal ? [est.imagen_principal] : [])
  
  const horarios = est.horarios && typeof est.horarios === 'object' && Object.keys(est.horarios).length > 0
    ? est.horarios : null

  const whatsappMsg = encodeURIComponent('Hola, te hablo desde Mi Destino Tu Noche, quisiera hacer una reserva.')

  return (
    <div className="min-h-screen pt-16">
      {/* Header con logo centrado */}
      <div className="relative h-[50vh] md:h-[60vh] bg-dark-lighter">
        {galeria.length > 0 ? (
          <>
            <Image
              src={galeria[activeImageIndex] || logoImg}
              alt={est.nombre}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-dark/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-dark-lighter flex items-center justify-center">
            {logoImg && (
              <Image src={logoImg} alt={est.nombre} width={200} height={200} className="rounded-2xl object-contain" />
            )}
          </div>
        )}

        {/* Navigation arrows */}
        {galeria.length > 1 && (
          <>
            <button 
              onClick={() => setActiveImageIndex(i => i === 0 ? galeria.length - 1 : i - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setActiveImageIndex(i => i === galeria.length - 1 ? 0 : i + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {galeria.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galeria.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeImageIndex ? 'w-8 bg-primary' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="absolute top-4 left-4">
          <Link href="/" className="p-3 bg-dark/50 backdrop-blur rounded-full hover:bg-dark/70 transition-colors inline-flex">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
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
          style={{ backgroundColor: est.tipo_color || '#0073FF' }}
        >
          <span>{est.tipo_icono}</span>
          <span>{est.tipo_nombre}</span>
        </div>

        {/* Logo overlay */}
        {logoImg && galeria.length > 0 && (
          <div className="absolute bottom-4 right-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 bg-dark">
              <Image src={logoImg} alt={est.nombre} width={80} height={80} className="object-contain w-full h-full" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-dark-lighter rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{est.nombre}</h1>
              {est.tipo_comida_nombre && <p className="text-primary font-medium">{est.tipo_comida_nombre}</p>}
              <div className="flex items-center gap-2 text-gray-400 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{est.ciudad_nombre}{est.departamento_nombre ? ', ' + est.departamento_nombre : ''}</span>
              </div>
              {est.direccion && (
                <p className="text-gray-400 text-sm mt-1">{est.direccion}</p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span>{est.valoracion_promedio ? Number(est.valoracion_promedio).toFixed(1) : '0.0'}</span>
                </div>
                <p className="text-sm text-gray-400">{est.total_valoraciones || 0} reseñas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-green">
                  {'$'.repeat(est.rango_precios || 2)}
                  <span className="text-gray-600">{'$'.repeat(4 - (est.rango_precios || 2))}</span>
                </div>
                <p className="text-sm text-gray-400">Precio</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {est.categorias_especiales && est.categorias_especiales.map((cat: any, i: number) => (
              <span 
                key={i}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${cat.color}30`, color: cat.color }}
              >
                {cat.icono} {cat.nombre}
              </span>
            ))}
            {est.etiquetas && est.etiquetas.map((tag: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-dark rounded-full text-sm text-gray-300">
                {tag.icono} {tag.nombre}
              </span>
            ))}
            {est.genero_musical && (
              <span className="px-3 py-1 bg-dark rounded-full text-sm text-gray-300">
                🎵 {est.genero_musical}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {est.telefono && (
              <a 
                href={`tel:${est.telefono}`}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark py-3 rounded-xl font-medium transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Llamar</span>
              </a>
            )}
            {est.whatsapp && (
              <a 
                href={`https://wa.me/${est.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            )}
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(est.direccion + ', ' + (est.ciudad_nombre || 'Colombia'))}`}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium transition-colors"
            >
              <Navigation className="w-5 h-5" />
              <span>Cómo llegar</span>
            </a>
            {est.instagram && (
              <a 
                href={`https://instagram.com/${est.instagram.replace('@','')}`}
                target="_blank"
                className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 py-3 rounded-xl font-medium transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            )}
          </div>

          {est.sitio_web && (
            <a 
              href={est.sitio_web}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-dark hover:bg-dark-card py-3 rounded-xl font-medium transition-colors border border-gray-700 mb-8 w-full"
            >
              <Globe className="w-5 h-5" />
              <span>Sitio web</span>
            </a>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            {(['info', 'cupones', 'resenas'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab 
                    ? 'text-primary border-primary' 
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab === 'info' ? 'Información' : tab === 'cupones' ? 'Cupones (0)' : `Reseñas (${est.total_valoraciones || 0})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="space-y-8">
              {/* Description */}
              {est.descripcion && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                  <p className="text-gray-300 leading-relaxed">{est.descripcion}</p>
                </div>
              )}

              {/* Hours */}
              {horarios && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Horarios
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(horarios).map(([dia, horario]) => (
                      <div key={dia} className="bg-dark p-3 rounded-lg">
                        <div className="text-sm text-gray-400 capitalize">{dia}</div>
                        <div className={horario === 'Cerrado' ? 'text-red-400' : 'text-white'}>
                          {String(horario)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
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
                      <a href={`tel:${est.telefono}`} className="hover:text-primary">{est.telefono}</a>
                    </div>
                  )}
                  {est.instagram && (
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-primary flex-shrink-0" />
                      <a href={`https://instagram.com/${est.instagram.replace('@','')}`} target="_blank" className="hover:text-primary">
                        @{est.instagram.replace('@','')}
                      </a>
                    </div>
                  )}
                  {est.email && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                      <a href={`mailto:${est.email}`} className="hover:text-primary">{est.email}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* SEDES */}
              {est.sedes && est.sedes.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Sedes ({est.sedes.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {est.sedes.map((sede: any) => (
                      <Link 
                        key={sede.id} 
                        href={`/establecimiento/${sede.slug}`}
                        className="bg-dark p-4 rounded-xl hover:bg-dark-card transition-colors border border-gray-800 hover:border-primary/50"
                      >
                        <div className="flex items-start gap-3">
                          {sede.logo_url || sede.imagen_principal ? (
                            <Image 
                              src={sede.logo_url || sede.imagen_principal} 
                              alt={sede.nombre} 
                              width={50} 
                              height={50} 
                              className="rounded-lg object-cover w-12 h-12 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white truncate">{sede.nombre}</h4>
                            <p className="text-sm text-primary">{sede.ciudad_nombre}</p>
                            {sede.direccion && (
                              <p className="text-sm text-gray-400 mt-1 truncate">{sede.direccion}</p>
                            )}
                            {sede.telefono && (
                              <p className="text-sm text-gray-500 mt-1">{sede.telefono}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Otras sedes (si es sede secundaria) */}
              {est.sede_principal && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Más sedes
                  </h3>
                  <div className="mb-4">
                    <Link 
                      href={`/establecimiento/${est.sede_principal.slug}`}
                      className="text-primary hover:text-primary-light font-medium"
                    >
                      ← Ver sede principal: {est.sede_principal.nombre}
                    </Link>
                  </div>
                  {est.otras_sedes && est.otras_sedes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {est.otras_sedes.map((sede: any) => (
                        <Link 
                          key={sede.id} 
                          href={`/establecimiento/${sede.slug}`}
                          className="bg-dark p-4 rounded-xl hover:bg-dark-card transition-colors border border-gray-800 hover:border-primary/50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white truncate">{sede.nombre}</h4>
                              <p className="text-sm text-primary">{sede.ciudad_nombre}</p>
                              {sede.direccion && (
                                <p className="text-sm text-gray-400 mt-1 truncate">{sede.direccion}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Gallery */}
              {galeria.length > 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Fotos</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {galeria.map((foto: string, i: number) => (
                      <button key={i} onClick={() => setActiveImageIndex(i)} className="flex-shrink-0">
                        <Image src={foto} alt={`Foto ${i+1}`} width={180} height={130} className="rounded-xl object-cover w-44 h-32 hover:opacity-80 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cupones' && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎟️</div>
              <p className="text-gray-400">No hay cupones disponibles</p>
            </div>
          )}

          {activeTab === 'resenas' && (
            <div className="space-y-4">
              {est.valoraciones_recientes && est.valoraciones_recientes.length > 0 ? (
                est.valoraciones_recientes.map((val: any, i: number) => (
                  <div key={i} className="bg-dark p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                          {val.usuario_nombre?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium">{val.usuario_nombre}</div>
                          <div className="text-sm text-gray-400">{val.created_at?.slice(0,10)}</div>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star 
                            key={j} 
                            className={`w-4 h-4 ${j < val.puntuacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    {val.comentario && <p className="text-gray-300">{val.comentario}</p>}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="text-gray-400">Sin reseñas aún</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer dev */}
      <div className="text-center py-6">
        <a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
          Desarrollado por Rayar!
        </a>
      </div>
    </div>
  )
}
