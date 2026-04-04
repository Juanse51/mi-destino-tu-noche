'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

const tipos = [
  { nombre: 'Todos', slug: '', icono: '' },
  { nombre: 'Restaurantes', slug: 'restaurante', icono: '🍽️' },
  { nombre: 'Bares', slug: 'bar', icono: '🍺' },
  { nombre: 'Cafés', slug: 'cafe', icono: '☕' },
  { nombre: 'Discotecas', slug: 'discoteca', icono: '🎉' },
]

const ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Armenia', 'Pereira', 'Santa Marta', 'Barranquilla', 'Bucaramanga', 'Pasto', 'Villavicencio']

function BuscarContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [tipoSeleccionado, setTipoSeleccionado] = useState(searchParams.get('tipo') || '')
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(searchParams.get('q') ? 'Todas' : 'Bogotá')
  const [showFilters, setShowFilters] = useState(false)
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ciudadDetectada, setCiudadDetectada] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)

  // Detectar ciudad por IP al cargar
  useEffect(() => {
    const detectarCiudad = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        if (data.city) {
          setCiudadDetectada(data.city)
          setCiudadSeleccionada(data.city)
        }
      } catch {}
    }
    detectarCiudad()
  }, [])

  // Cargar establecimientos cuando cambian filtros
  useEffect(() => {
    const fetchEstablecimientos = async () => {
      setLoading(true)
      setVisibleCount(20)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append('buscar', searchQuery)
        if (tipoSeleccionado) params.append('tipo', tipoSeleccionado)
        if (ciudadSeleccionada && ciudadSeleccionada !== 'Todas') {
          params.append('ciudad', ciudadSeleccionada.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        }
        params.append('limite', '300')

        const res = await fetch(`${API_URL}/establecimientos?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setEstablecimientos(data.establecimientos || [])
        }
      } catch (err) {
        console.error('Error buscando:', err)
      }
      setLoading(false)
    }
    fetchEstablecimientos()
  }, [searchQuery, tipoSeleccionado, ciudadSeleccionada])

  const norm = (s: string) => s?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') || ''

  const establecimientosFiltrados = (() => {
    if (!searchQuery) return establecimientos

    const q = norm(searchQuery)

    // Detectar ciudad en la query: "restaurantes en bogotá"
    const ciudadesKeys = ['bogota','medellin','cali','cartagena','armenia','pereira',
      'barranquilla','santa marta','bucaramanga','villavicencio','pasto','cucuta','neiva','monteria']
    const ciudadEnQuery = ciudadesKeys.find(c => q.includes(c))

    // Detectar tipo en la query
    const tiposKeys: Record<string,string> = {
      'restaurante': 'restaurante', 'restaurantes': 'restaurante',
      'bar': 'bar', 'bares': 'bar',
      'cafe': 'café', 'cafes': 'café', 'café': 'café',
      'discoteca': 'discoteca', 'discotecas': 'discoteca',
    }
    const tipoEnQuery = Object.keys(tiposKeys).find(t => q.includes(t))

    // Quitar ciudad y tipo de la query para buscar solo el nombre
    let nombreQuery = q
    if (ciudadEnQuery) nombreQuery = nombreQuery.replace(ciudadEnQuery, '').replace(/\s+en\s+/, ' ').trim()
    if (tipoEnQuery) nombreQuery = nombreQuery.replace(tipoEnQuery, '').trim()

    return establecimientos.filter(e => {
      const nombre = norm(e.nombre)
      const ciudad = norm(e.ciudad_nombre)
      const tipo = norm(e.tipo_nombre)
      const dir = norm(e.direccion)

      // Si detectó ciudad en query, filtrar por ella
      if (ciudadEnQuery && !ciudad.includes(ciudadEnQuery)) return false
      // Si detectó tipo en query, filtrar por él
      if (tipoEnQuery && !tipo.includes(norm(tiposKeys[tipoEnQuery]))) return false
      // Si quedó nombre, buscar por nombre o dirección
      if (nombreQuery.length > 0) {
        return nombre.includes(nombreQuery) || dir.includes(nombreQuery)
      }
      return true
    })
  })()
  const establecimientosVisibles = establecimientosFiltrados.slice(0, visibleCount)

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-dark-lighter border-b border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Selector de ciudad */}
            <select
              value={ciudadSeleccionada}
              onChange={(e) => setCiudadSeleccionada(e.target.value)}
              className="bg-dark border border-gray-700 rounded-xl px-3 py-3 text-white outline-none text-sm shrink-0 hover:border-gray-500 transition-colors"
            >
              <option value="Todas">🌎 Todas</option>
              {ciudades.filter(c => c !== 'Todas').map((ciudad) => (
                <option key={ciudad} value={ciudad}>📍 {ciudad}</option>
              ))}
            </select>
            {/* Buscador */}
            <div className="flex-1 flex items-center bg-dark rounded-xl px-4 py-3 border border-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value
                  setSearchQuery(val)
                  // Si el usuario escribe una ciudad, poner dropdown en Todas
                  const ciudadesKeys = ['bogota','bogotá','medellin','medellín','cali','cartagena',
                    'armenia','pereira','barranquilla','santa marta','bucaramanga',
                    'villavicencio','pasto','cucuta','cúcuta','neiva','monteria','montería']
                  const valNorm = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                  const tieneCiudad = ciudadesKeys.some(c => valNorm.includes(c))
                  if (tieneCiudad) setCiudadSeleccionada('Todas')
                }}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            {/* Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                showFilters ? 'bg-primary border-primary' : 'bg-dark border-gray-700 hover:border-gray-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tipo</label>
                  <div className="flex flex-wrap gap-2">
                    {tipos.map((tipo) => (
                      <button
                        key={tipo.slug}
                        onClick={() => setTipoSeleccionado(tipo.slug)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          tipoSeleccionado === tipo.slug
                            ? 'bg-primary text-white'
                            : 'bg-dark hover:bg-dark-card'
                        }`}
                      >
                        {tipo.icono && <span className="mr-1">{tipo.icono}</span>}
                        {tipo.nombre}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">
            {establecimientosFiltrados.length} {establecimientosFiltrados.length === 1 ? 'resultado' : 'resultados'} encontrados
            {ciudadDetectada && ciudadSeleccionada !== 'Todas' && (
              <span className="ml-2 text-primary text-sm">📍 {ciudadSeleccionada}</span>
            )}
          </p>

        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Buscando...</p>
          </div>
        ) : establecimientosVisibles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {establecimientosVisibles.map((est) => (
                <EstablecimientoCard key={est.id} establecimiento={est} />
              ))}
            </div>
            {visibleCount < establecimientosFiltrados.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount(v => v + 20)}
                  className="bg-dark-lighter hover:bg-dark-card border border-gray-700 px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Ver más ({establecimientosFiltrados.length - visibleCount} restantes)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-400">Intenta con otros términos o filtros</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 text-center py-20">Cargando...</div>}>
      <BuscarContent />
    </Suspense>
  )
}
