'use client'

import { useState } from 'react'
import Link from 'next/link'

const transportes = [
  { nombre: `BERLINAS`, region: `Andina`, descripcion: `Pasaje Bogotá Bquilla en bus — Compra tus tiquetes de bus con Berlinas del Fonce y viaja por Colombia con seguridad, puntualidad y confort. Consulta rutas, horarios y descubre nuestra`, instagram: `berlinasdelfonce`, whatsapp: `6017435050`, telefono: `6017435050` },
  { nombre: `Cabify`, region: `Andina`, descripcion: `Pide un viaje a través de la app o regístrate para conducir con nosotros. En tu ciudad, a tu ritmo y en cualquier lugar. Estamos listos para llevarte.`, instagram: `cabify_colombia`, whatsapp: ``, telefono: `` },
  { nombre: `colombia travel tours`, region: `Andina`, descripcion: `Colombia Travel Tours, es una empresa dedicada a la prestación de servicios de transporte especial de pasajeros, con el objetivo de brindar un servicio`, instagram: `colombia.traveltours`, whatsapp: ``, telefono: `` },
  { nombre: `COOMOFU LTDA`, region: `Andina`, descripcion: `Viaja tranquilo y seguro en nuestra flota de vehículos a cualquier lugar del país. nacionales. Llegamos a todo el territorio Colombiano. intermunicipales.`, instagram: `coomofu_oficial`, whatsapp: ``, telefono: `` },
  { nombre: `Coomotor`, region: `Andina`, descripcion: `La Cooperativa de motoristas del Huila y Caquetá Limitada, más conocida como Coomotor, es una empresa colombiana de transporte terrestre con sede en Neiva, fundada el 24 de marzo de 1961.​Se encuentra enclavada en el centro-sur de Colombia.`, instagram: `grupocoomotor`, whatsapp: ``, telefono: `` },
  { nombre: `coopservices ltda`, region: `Orinoquía`, descripcion: `Bienvenido a COOPSERVICES LTDA · Turismo · Servicios de transporte terrestre especial de pasajeros. · Alquiler de vehículos automotores. · Transporte de material …`, instagram: ``, whatsapp: ``, telefono: `` },
  { nombre: `ESCOTUR`, region: `Orinoquía`, descripcion: `Nuestra intención es satisfacer las necesidades de nuestros clientes, atendiendo los servicios de transporte especial con seguridad, puntualidad, contando con personal competente y mejorando continuamente nuestros procesos.`, instagram: `escoturssas`, whatsapp: ``, telefono: `` },
  { nombre: `expreso brasilia`, region: `Caribe`, descripcion: `Inicio; Ofertas y Servicios. Promociones · Pasajes · Servicio Especial · Brasilia Carga · Publicidad Clientes · Brasilia Play · Servicio Institucional.`, instagram: `expresobrasilia`, whatsapp: ``, telefono: `` },
  { nombre: `Grupo Santorini`, region: `Caribe`, descripcion: `Parque Automotor Grupo Santorini. Transporte Especial.`, instagram: `gruposantorinico`, whatsapp: ``, telefono: `` },
  { nombre: `M&c Transportes S A S`, region: `Orinoquía`, descripcion: `La empresa M&c Transportes S A S se encuentra situada en el departamento de CASANARE, en la localidad MONTERREY`, instagram: `p`, whatsapp: ``, telefono: `` },
  { nombre: `onika transporte`, region: `Andina`, descripcion: `Empresa de Transporte Especial, Turístico, Escolar, Empresarial y de la Salud.`, instagram: `transportesonika`, whatsapp: ``, telefono: `` },
  { nombre: `royal express`, region: `Andina`, descripcion: `Grupo Royal. tu mejor opción en transporte. Escolar Padres · Asociados · Colaboradores · Coordinador. Misión.`, instagram: `p`, whatsapp: ``, telefono: `` },
  { nombre: `Seturcol`, region: `Andina`, descripcion: `Requieres transportar a los empleados de tu empresa o necesitas suplir las necesidades de transporte de los estudiantes de tu colegio y no cuentas con un servicio de Transporte especial, encuéntralo aquí. En SETURCOL cuentas con el mejor equipo que t`, instagram: `transporteseturcol`, whatsapp: `573244357584`, telefono: `573244357584` },
  { nombre: `SITEC S.A.S`, region: `Orinoquía`, descripcion: `Contamos con alianzas logísticas que tienen cobertura en todas las ciudades y municipios del país para entrega en su puerta con el fin de ofrecer tranquilidad, comodidad.`, instagram: ``, whatsapp: ``, telefono: `` },
  { nombre: `SODIS SERVICIO ESPECIAL`, region: `Caribe`, descripcion: `Líderes en el transporte especial. Servicio en todo el territorio nacional, cumplimos con los protocolos de bioseguridad, servicio 24/7, vehículos modernos, .`, instagram: `sodis_vip`, whatsapp: ``, telefono: `` },
  { nombre: `transguia transportes`, region: `Caribe`, descripcion: `Somos una empresa prestadora de servicio público de Transporte Terrestre Automotor especial de pasajeros, en las líneas Corporativo y Turístico. · City Tours …`, instagram: `transguias_sa`, whatsapp: ``, telefono: `` },
  { nombre: `Tu bus colombia`, region: `Andina`, descripcion: `Servicios de transporte corporativo, turístico y eventos para empresas en toda Colombia. Más de 15 años conectando destinos con excelencia.`, instagram: `tubus.co`, whatsapp: ``, telefono: `` },
  { nombre: `Vigía Servicio Especia`, region: `Andina`, descripcion: `Trabajamos permanentemente por la excelencia en cada una de nuestras operaciones.`, instagram: ``, whatsapp: ``, telefono: `` },
]

export default function TransportesPage() {
  const [search, setSearch] = useState('')

  const filtered = transportes.filter(t =>
    t.nombre.toLowerCase().includes(search.toLowerCase()) ||
    t.region.toLowerCase().includes(search.toLowerCase()) ||
    t.descripcion.toLowerCase().includes(search.toLowerCase())
  )

  const openIG = (ig: string) => {
    const clean = ig.replace('@','').replace('https://www.instagram.com/','').replace('/','')
    if (clean && clean !== 'p') window.open('https://www.instagram.com/' + clean, '_blank')
  }

  const openWA = (wa: string, nombre: string) => {
    const num = wa.startsWith('57') ? wa : '57' + wa
    window.open('https://wa.me/' + num + '?text=Hola%2C%20te%20contacto%20desde%20Mi%20Destino%20Tu%20Noche.', '_blank')
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-[#0F0F1A]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">← Volver al inicio</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🚌 Transportes</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">Movilízate por Colombia. Encuentra las mejores opciones de transporte.</p>
          <div className="max-w-lg mx-auto mt-8">
            <div className="flex items-center bg-white/10 backdrop-blur rounded-xl p-2 border border-gray-700/50">
              <span className="ml-3 mr-2 text-gray-400">🔍</span>
              <input type="text" placeholder="Buscar por nombre o región..." className="w-full bg-transparent outline-none text-white placeholder-gray-400 py-2" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400 mb-8">{filtered.length} servicios de transporte</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t, i) => (
              <div key={i} className="bg-[#1A1A2E] rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0"><span className="text-2xl">🚌</span></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white">{t.nombre}</h3>
                      {t.region && <p className="text-sm text-blue-400 mt-1">📍 {t.region}</p>}
                    </div>
                  </div>
                  {t.descripcion && <p className="text-sm text-gray-400 mt-4 line-clamp-3">{t.descripcion}</p>}
                  <div className="flex gap-3 mt-5">
                    {t.whatsapp && <button onClick={() => openWA(t.whatsapp, t.nombre)} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-2.5 rounded-xl font-medium text-sm text-white transition-colors">💬 WhatsApp</button>}
                    {t.telefono && <a href={'tel:' + t.telefono} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl font-medium text-sm text-white transition-colors">📞 Llamar</a>}
                    {t.instagram && t.instagram !== 'p' && <button onClick={() => openIG(t.instagram)} className="flex items-center justify-center bg-pink-600 hover:bg-pink-700 py-2.5 px-4 rounded-xl text-sm text-white transition-colors">📷</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center py-20"><div className="text-5xl mb-4">🔍</div><p className="text-gray-400 text-lg">No se encontraron servicios de transporte</p></div>}
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center bg-[#1A1A2E] rounded-2xl p-10 border border-gray-800">
          <h2 className="text-2xl font-bold mb-3">¿Ofreces servicio de transporte?</h2>
          <p className="text-gray-400 mb-6">Registra tu empresa en Mi Destino Tu Noche y llega a miles de viajeros.</p>
          <a href="https://wa.me/573212304589?text=Hola%2C%20ofrezco%20servicio%20de%20transporte%20y%20quiero%20registrarme." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-colors">💬 Contáctanos</a>
        </div>
      </section>
      <div className="text-center py-6"><a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Desarrollado por Rayar!</a></div>
    </div>
  )
}
