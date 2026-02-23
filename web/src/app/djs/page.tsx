'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Music, MapPin, MessageCircle, Mail, ChevronLeft } from 'lucide-react'

const djs = [
  {
    nombre: 'DJ JOKER',
    genero: 'Crossover',
    whatsapp: '573103220781',
    email: 'jokerdjiba@gmail.com',
    disponibilidad: 'A nivel nacional',
  },
  {
    nombre: 'DJ SANTIAGO CRUZ',
    genero: 'Crossover',
    whatsapp: '573028270452',
    email: 'antiagofelipe17@hotmail.com',
    disponibilidad: 'Cundinamarca',
  },
  {
    nombre: 'DJ ANDRÉS MACIÁ',
    genero: 'Crossover, ritmos latinos, electrónica global y clásicos atemporales',
    whatsapp: '573008369131',
    email: 'cotizaciondjam@gmail.com',
    disponibilidad: 'Regional, nacional e internacional',
  },
  {
    nombre: 'DJ ZMOXX',
    genero: 'Crossover',
    whatsapp: '573215758189',
    email: 'DJZMOXX77@GMAIL.COM',
    disponibilidad: 'Regional y nacional',
  },
  {
    nombre: 'DJ JARO PITRO',
    genero: 'House, Nu Disco, Afro House, Tech House, Deep House, Caribbean, Crossover, Clásicos 70s-80s-2000s',
    whatsapp: '573106570454',
    email: 'jaropitro@hotmail.com',
    disponibilidad: 'Cartagena y nacional',
  },
  {
    nombre: 'TRVX',
    genero: 'Groove, Trance, Techno',
    whatsapp: '573026666975',
    email: 'sebastianpena3124@gmail.com',
    disponibilidad: 'Nacional',
  },
  {
    nombre: 'DJ ALEXIS CASTAÑO',
    genero: 'Crossover',
    whatsapp: '573217042557',
    email: 'djalexiscastano@gmail.com',
    disponibilidad: 'Nacional y regional',
  },
  {
    nombre: 'KIKE SERRANO',
    genero: 'House, Fusión, Latino',
    whatsapp: '573008054648',
    email: 'djkikeserrano@gmail.com',
    disponibilidad: 'Cartagena y nacional',
  },
  {
    nombre: 'DJ DANIEL MIELES',
    genero: 'Crossover, electrónica y urbano',
    whatsapp: '573008105366',
    email: 'danielmielesproducciones@gmail.com',
    disponibilidad: 'Local, nacional e internacional',
  },
  {
    nombre: 'JOHNNY HOUSE-IN',
    genero: 'House, Nu Disco',
    whatsapp: '',
    email: '',
    disponibilidad: 'Nacional',
  },
  {
    nombre: 'DUBCODE',
    genero: 'Electrónica',
    whatsapp: '',
    email: '',
    disponibilidad: 'Nacional',
  },
  {
    nombre: 'MACHU75',
    genero: 'House, Progressive House, Dance',
    whatsapp: '',
    email: '',
    disponibilidad: 'Zipaquirá, Cundinamarca - Nacional',
  },
  {
    nombre: 'LIUCH DJ',
    genero: 'Afro House, Tech House, Progressive, Techno',
    whatsapp: '',
    email: '',
    disponibilidad: 'Zipaquirá, Cundinamarca - Nacional',
  },
]

const colores = ['#FF6B35', '#9B59B6', '#E91E63', '#00BCD4', '#4CAF50', '#FF9800', '#3F51B5', '#F44336', '#009688', '#FF5722', '#673AB7', '#2196F3', '#8BC34A']

export default function DJsPage() {
  const [search, setSearch] = useState('')

  const filtered = djs.filter(dj =>
    dj.nombre.toLowerCase().includes(search.toLowerCase()) ||
    dj.genero.toLowerCase().includes(search.toLowerCase()) ||
    dj.disponibilidad.toLowerCase().includes(search.toLowerCase())
  )

  const whatsappMsg = encodeURIComponent('Hola, te contacto desde Mi Destino Tu Noche, estoy interesado en contratar tus servicios de DJ.')

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎧 ¿Tienes una fiesta?
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Nosotros tenemos el DJ. Conoce los mejores DJs de Colombia y contrátalos directamente.
          </p>
          <div className="max-w-lg mx-auto">
            <div className="flex items-center bg-dark-lighter/80 backdrop-blur rounded-xl p-2 border border-gray-700/50">
              <Search className="w-5 h-5 text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Buscar por nombre, género o ciudad..."
                className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DJs Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 mb-8">{filtered.length} DJs disponibles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dj, i) => (
              <div key={i} className="bg-dark-lighter rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-colors">
                {/* Header con color */}
                <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${colores[i % colores.length]}90, ${colores[(i + 3) % colores.length]}60)` }}>
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-dark-lighter" style={{ backgroundColor: colores[i % colores.length] }}>
                      {dj.nombre.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-14">
                  <h3 className="text-xl font-bold mb-1">{dj.nombre}</h3>
                  
                  <div className="flex items-start gap-2 mt-3">
                    <Music className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{dj.genero}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm text-gray-400">{dj.disponibilidad}</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-5">
                    {dj.whatsapp && (
                      <a
                        href={`https://wa.me/${dj.whatsapp}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-2.5 rounded-xl font-medium transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    )}
                    {dj.email && (
                      <a
                        href={`mailto:${dj.email}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark py-2.5 rounded-xl font-medium transition-colors text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg">No se encontraron DJs con esa búsqueda</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center bg-dark-lighter rounded-2xl p-10 border border-gray-800">
          <h2 className="text-2xl font-bold mb-3">¿Eres DJ y quieres estar aquí?</h2>
          <p className="text-gray-400 mb-6">Únete al directorio de DJs de Mi Destino Tu Noche y llega a miles de clientes potenciales.</p>
          <a
            href="https://wa.me/573212304589?text=Hola%2C%20soy%20DJ%20y%20quiero%20registrarme%20en%20Mi%20Destino%20Tu%20Noche."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contáctanos
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-6">
        <a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
          Desarrollado por Rayar!
        </a>
      </div>
    </div>
  )
}
