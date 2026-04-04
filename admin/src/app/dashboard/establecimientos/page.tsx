'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Filter, X, Loader2 } from 'lucide-react'
import { authFetch } from '@/lib/auth'

const API_URL = 'https://mi-destino-api.onrender.com/api/v1'

export default function EstablecimientosPage() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('Todos')
  const [ciudadFilter, setCiudadFilter] = useState('Todas')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(20)
  const [ciudades, setCiudades] = useState<string[]>(['Todas'])
  const [tipos, setTipos] = useState<string[]>(['Todos'])

  useEffect(() => {
    fetchEstablecimientos()
  }, [])

  const fetchEstablecimientos = async () => {
    setLoading(true)
    try {
      const res = await authFetch(`${API_URL}/admin/establecimientos?limite=500`)
      const data = await res.json()
      const items = data.establecimientos || data || []
      setEstablecimientos(items)

      // Extraer ciudades y tipos únicos
      const ciudadesUnicas = ['Todas', ...Array.from(new Set(items.map((e: any) => e.ciudad_nombre).filter(Boolean))) as string[]]
      const tiposUnicos = ['Todos', ...Array.from(new Set(items.map((e: any) => e.tipo_nombre).filter(Boolean))) as string[]]
      setCiudades(ciudadesUnicas)
      setTipos(tiposUnicos)
    } catch (err) {
      console.error('Error:', err)
    }
    setLoading(false)
  }

  const toggleEstado = async (id: string, activo: boolean) => {
    try {
      await authFetch(`${API_URL}/admin/establecimientos/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ activo: !activo })
      })
      fetchEstablecimientos()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este establecimiento?')) return
    try {
      await authFetch(`${API_URL}/admin/establecimientos/${id}`, { method: 'DELETE' })
      fetchEstablecimientos()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const filteredData = establecimientos.filter(est => {
    const matchSearch = est.nombre?.toLowerCase().includes(search.toLowerCase())
    const matchTipo = tipoFilter === 'Todos' || est.tipo_nombre === tipoFilter
    const matchCiudad = ciudadFilter === 'Todas' || est.ciudad_nombre === ciudadFilter
    const matchEstado = estadoFilter === 'Todos' ||
      (estadoFilter === 'activo' && est.activo) ||
      (estadoFilter === 'inactivo' && !est.activo)
    return matchSearch && matchTipo && matchCiudad && matchEstado
  })

  const visibleData = filteredData.slice(0, visibleCount)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Establecimientos</h1>
          <p className="text-gray-400">Gestiona los establecimientos de la plataforma</p>
        </div>
        <a href={`https://midestinotunoche.com`} target="_blank" className="btn-primary flex items-center gap-2">
          <Eye className="w-4 h-4" /> Ver en web
        </a>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar establecimientos..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(20) }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters ? 'border-primary text-primary' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}
          >
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-800">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tipo</label>
              <select className="input" value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                {tipos.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ciudad</label>
              <select className="input" value={ciudadFilter} onChange={(e) => setCiudadFilter(e.target.value)}>
                {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Estado</label>
              <select className="input" value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
                {['Todos', 'activo', 'inactivo'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Contador */}
      <p className="text-gray-400 text-sm">{filteredData.length} establecimientos encontrados</p>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                <th className="pb-3 font-medium">Establecimiento</th>
                <th className="pb-3 font-medium">Ciudad</th>
                <th className="pb-3 font-medium">Tipo</th>
                <th className="pb-3 font-medium">Valoración</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map((est) => (
                <tr key={est.id} className="border-b border-gray-800/50 hover:bg-dark/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      {est.imagen_principal || est.logo_url ? (
                        <img src={est.imagen_principal || est.logo_url} alt={est.nombre} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {est.nombre?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium flex items-center gap-2 flex-wrap">
                          {est.nombre}
                          {est.verificado && <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">✓ Verificado</span>}
                          {est.destacado && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">⭐ Destacado</span>}
                        </p>
                        <p className="text-sm text-gray-500">/{est.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-300">{est.ciudad_nombre}</td>
                  <td className="py-4 text-gray-300">{est.tipo_nombre || '—'}</td>
                  <td className="py-4">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      {est.valoracion_promedio ? Number(est.valoracion_promedio).toFixed(1) : '0.0'}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      est.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {est.activo ? 'activo' : 'inactivo'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <a href={`https://midestinotunoche.com/establecimiento/${est.slug}`} target="_blank" className="p-2 hover:bg-dark rounded-lg" title="Ver en web">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </a>
                      <button onClick={() => toggleEstado(est.id, est.activo)} className="p-2 hover:bg-dark rounded-lg" title={est.activo ? 'Desactivar' : 'Activar'}>
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={() => eliminar(est.id)} className="p-2 hover:bg-dark rounded-lg" title="Eliminar">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No se encontraron establecimientos</p>
            </div>
          )}

          {visibleCount < filteredData.length && (
            <div className="text-center pt-4">
              <button onClick={() => setVisibleCount(v => v + 20)} className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-dark text-sm">
                Ver más ({filteredData.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
