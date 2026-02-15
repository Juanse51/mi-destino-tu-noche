'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Filter, X, RefreshCw } from 'lucide-react'
import { authFetch } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

interface Establecimiento {
  id: string
  nombre: string
  slug: string
  ciudad_nombre: string
  tipo_nombre: string
  valoracion_promedio: string | number
  activo: boolean
  verificado: boolean
  destacado: boolean
  imagen_principal?: string
  descripcion?: string
  direccion?: string
  telefono?: string
  whatsapp?: string
  instagram?: string
}

const tipos = ['Todos', 'Restaurante', 'Bar', 'Café', 'Discoteca', 'Gastrobar']
const estados = ['Todos', 'activo', 'inactivo']

export default function EstablecimientosPage() {
  const [data, setData] = useState<Establecimiento[]>([])
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>(['Todas'])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('Todos')
  const [ciudadFilter, setCiudadFilter] = useState('Todas')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [formNombre, setFormNombre] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formTipo, setFormTipo] = useState('Restaurante')
  const [formCiudad, setFormCiudad] = useState('Armenia')
  const [formDireccion, setFormDireccion] = useState('')
  const [formDescripcion, setFormDescripcion] = useState('')
  const [formTelefono, setFormTelefono] = useState('')
  const [formWhatsapp, setFormWhatsapp] = useState('')
  const [formInstagram, setFormInstagram] = useState('')
  const [formActivo, setFormActivo] = useState(true)
  const [formVerificado, setFormVerificado] = useState(false)
  const [formDestacado, setFormDestacado] = useState(false)

  // Cargar TODOS los establecimientos con paginación
  const fetchData = async () => {
    setLoading(true)
    try {
      let allData: Establecimiento[] = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        const res = await authFetch(`${API_URL}/establecimientos?limite=100&pagina=${page}`)
        if (res.ok) {
          const json = await res.json()
          const items = json.establecimientos || []
          allData = [...allData, ...items]
          hasMore = items.length >= 100
          page++
        } else {
          hasMore = false
        }
      }

      setData(allData)

      // Extraer ciudades dinámicamente
      const ciudades = Array.from(new Set(allData.map((e: Establecimiento) => e.ciudad_nombre).filter(Boolean))).sort() as string[]
      setCiudadesDisponibles(['Todas', ...ciudades])
    } catch (err) {
      console.error('Error cargando establecimientos:', err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const filteredData = data.filter(est => {
    const matchSearch = est.nombre.toLowerCase().includes(search.toLowerCase()) ||
      est.direccion?.toLowerCase().includes(search.toLowerCase()) ||
      est.slug?.toLowerCase().includes(search.toLowerCase())
    const matchTipo = tipoFilter === 'Todos' || est.tipo_nombre === tipoFilter
    const matchCiudad = ciudadFilter === 'Todas' || est.ciudad_nombre === ciudadFilter
    const matchEstado = estadoFilter === 'Todos' || 
      (estadoFilter === 'activo' && est.activo) || 
      (estadoFilter === 'inactivo' && !est.activo)
    return matchSearch && matchTipo && matchCiudad && matchEstado
  })

  const generateSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const openNew = () => {
    setEditingId(null); setFormNombre(''); setFormSlug(''); setFormTipo('Restaurante'); setFormCiudad('Armenia')
    setFormDireccion(''); setFormDescripcion(''); setFormTelefono(''); setFormWhatsapp(''); setFormInstagram('')
    setFormActivo(true); setFormVerificado(false); setFormDestacado(false)
    setSaveError(''); setShowModal(true)
  }

  const openEdit = (est: Establecimiento) => {
    setEditingId(est.id); setFormNombre(est.nombre); setFormSlug(est.slug)
    setFormTipo(est.tipo_nombre || 'Restaurante'); setFormCiudad(est.ciudad_nombre || 'Armenia')
    setFormDireccion(est.direccion || ''); setFormDescripcion(est.descripcion || '')
    setFormTelefono(est.telefono || ''); setFormWhatsapp(est.whatsapp || ''); setFormInstagram(est.instagram || '')
    setFormActivo(est.activo); setFormVerificado(est.verificado); setFormDestacado(est.destacado)
    setSaveError(''); setShowModal(true)
  }

  const handleSave = async () => {
    if (!formNombre.trim() || !formDireccion.trim()) {
      setSaveError('Nombre y dirección son requeridos')
      return
    }

    const body = {
      nombre: formNombre,
      slug: formSlug || generateSlug(formNombre),
      tipo: formTipo,
      ciudad: formCiudad,
      direccion: formDireccion,
      descripcion: formDescripcion,
      telefono: formTelefono,
      whatsapp: formWhatsapp,
      instagram: formInstagram,
      activo: formActivo,
      verificado: formVerificado,
      destacado: formDestacado
    }

    try {
      let res
      if (editingId) {
        res = await authFetch(`${API_URL}/establecimientos/${editingId}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        res = await authFetch(`${API_URL}/establecimientos`, { method: 'POST', body: JSON.stringify(body) })
      }

      if (res.ok) {
        setSaveSuccess(true); setSaveError('')
        setTimeout(() => { setSaveSuccess(false); setShowModal(false) }, 800)
        fetchData()
      } else {
        const err = await res.json()
        setSaveError(err.error || 'Error al guardar')
      }
    } catch (err) { setSaveError('Error de conexión') }
  }

  const handleDelete = async (id: string) => {
    try {
      await authFetch(`${API_URL}/establecimientos/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) { console.error(err) }
    setShowDeleteConfirm(null)
  }

  // Agrupar por ciudad para el resumen
  const ciudadCounts = data.reduce((acc: Record<string, number>, e) => {
    const c = e.ciudad_nombre || 'Sin ciudad'
    acc[c] = (acc[c] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Establecimientos</h1>
          <p className="text-gray-400">{data.length} total • {filteredData.length} mostrando</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2 border border-gray-700 rounded-lg hover:bg-dark">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo
          </button>
        </div>
      </div>

      {/* Resumen por ciudad */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(ciudadCounts).sort((a, b) => b[1] - a[1]).map(([ciudad, count]) => (
          <button
            key={ciudad}
            onClick={() => setCiudadFilter(ciudadFilter === ciudad ? 'Todas' : ciudad)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              ciudadFilter === ciudad
                ? 'bg-primary text-white'
                : 'bg-dark-lighter text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {ciudad} ({count})
          </button>
        ))}
        {ciudadFilter !== 'Todas' && (
          <button onClick={() => setCiudadFilter('Todas')} className="px-3 py-1.5 rounded-full text-sm bg-gray-700 text-white flex items-center gap-1">
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" className="input pl-10" placeholder="Buscar establecimientos..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters ? 'border-primary text-primary' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}>
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
                {ciudadesDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Estado</label>
              <select className="input" value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
                {estados.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400">Cargando establecimientos...</p>
          </div>
        ) : (
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
              {filteredData.map((est) => (
                <tr key={est.id} className="border-b border-gray-800/50 hover:bg-dark/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={est.imagen_principal || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'} alt={est.nombre} className="w-10 h-10 rounded-lg object-cover bg-dark" />
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {est.nombre}
                          {est.verificado && <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">✓</span>}
                          {est.destacado && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">⭐</span>}
                        </p>
                        <p className="text-sm text-gray-500">/{est.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-300">{est.ciudad_nombre}</td>
                  <td className="py-4 text-gray-300">{est.tipo_nombre}</td>
                  <td className="py-4"><span className="flex items-center gap-1"><span className="text-yellow-400">⭐</span>{Number(est.valoracion_promedio || 0).toFixed(1)}</span></td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${est.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {est.activo ? 'activo' : 'inactivo'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(est)} className="p-2 hover:bg-dark rounded-lg" title="Editar"><Edit className="w-4 h-4 text-gray-400" /></button>
                      <button onClick={() => setShowDeleteConfirm(est.id)} className="p-2 hover:bg-dark rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filteredData.length === 0 && <div className="text-center py-12"><p className="text-gray-400">No se encontraron establecimientos</p></div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Establecimiento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-2">Nombre *</label><input type="text" className="input" placeholder="Nombre del establecimiento" value={formNombre} onChange={(e) => { setFormNombre(e.target.value); if (!editingId) setFormSlug(generateSlug(e.target.value)) }} /></div>
                  <div><label className="block text-sm text-gray-400 mb-2">Slug</label><input type="text" className="input" placeholder="nombre-del-establecimiento" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Tipo *</label>
                    <select className="input" value={formTipo} onChange={(e) => setFormTipo(e.target.value)}>
                      <option>Restaurante</option><option>Bar</option><option>Café</option><option>Discoteca</option><option>Gastrobar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Ciudad *</label>
                    <select className="input" value={formCiudad} onChange={(e) => setFormCiudad(e.target.value)}>
                      {ciudadesDisponibles.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className="block text-sm text-gray-400 mb-2">Dirección *</label><input type="text" className="input" placeholder="Dirección completa" value={formDireccion} onChange={(e) => setFormDireccion(e.target.value)} /></div>
                <div><label className="block text-sm text-gray-400 mb-2">Descripción</label><textarea className="input min-h-[100px]" placeholder="Descripción del establecimiento" value={formDescripcion} onChange={(e) => setFormDescripcion(e.target.value)} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-2">Teléfono</label><input type="text" className="input" placeholder="+57 300 123 4567" value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} /></div>
                  <div><label className="block text-sm text-gray-400 mb-2">WhatsApp</label><input type="text" className="input" placeholder="573001234567" value={formWhatsapp} onChange={(e) => setFormWhatsapp(e.target.value)} /></div>
                  <div><label className="block text-sm text-gray-400 mb-2">Instagram</label><input type="text" className="input" placeholder="@usuario" value={formInstagram} onChange={(e) => setFormInstagram(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formActivo} onChange={(e) => setFormActivo(e.target.checked)} /><span className="text-sm">Activo</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formVerificado} onChange={(e) => setFormVerificado(e.target.checked)} /><span className="text-sm">Verificado</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formDestacado} onChange={(e) => setFormDestacado(e.target.checked)} /><span className="text-sm">Destacado</span></label>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-800 shrink-0">
              <div>
                {saveSuccess && <span className="text-green-400 text-sm flex items-center gap-1">✅ Guardado correctamente</span>}
                {saveError && <span className="text-red-400 text-sm">{saveError}</span>}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
                <button type="button" onClick={handleSave} className="btn-primary">{editingId ? 'Guardar Cambios' : 'Crear Establecimiento'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">¿Eliminar establecimiento?</h3>
            <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
              <button onClick={() => handleDelete(showDeleteConfirm!)} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
