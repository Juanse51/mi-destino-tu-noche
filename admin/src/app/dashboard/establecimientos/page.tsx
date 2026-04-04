'use client'

import { useState, useEffect } from 'react'
import { Search, Edit, Trash2, Eye, Filter, X, Loader2, Plus, Save } from 'lucide-react'
import { authFetch } from '@/lib/auth'

const API_URL = 'https://mi-destino-api.onrender.com/api/v1'

const CIUDADES = [
  { id: 'a458a476-df7d-4ecf-bf13-08dafa939854', nombre: 'Bogotá' },
  { id: 'acf6ea0a-28f8-4cc5-9e4c-2bf37e79ef45', nombre: 'Medellín' },
  { id: 'f2fadd15-f506-4f46-a764-3eca2718fbab', nombre: 'Cali' },
  { id: '3ee54d16-fe2b-40d2-a397-446183f31199', nombre: 'Cartagena' },
  { id: '02d8b468-f34e-4c3b-8fef-8df109c042a6', nombre: 'Barranquilla' },
  { id: '81170adc-4d0f-4d7b-b829-e9640ca0e607', nombre: 'Santa Marta' },
  { id: '0aa8aa46-5ad1-4c2c-880a-d4558c9a955e', nombre: 'Pereira' },
  { id: '4935fdd2-814c-4e99-9355-762f89af69ce', nombre: 'Armenia' },
  { id: '02d83033-bbaf-4c82-93bd-2e8d060ee57e', nombre: 'Manizales' },
  { id: 'b702404d-af03-47fe-9b45-ea20c56c77c8', nombre: 'Bucaramanga' },
  { id: 'd9971a3f-ecd4-442e-96c0-4b416ef0998d', nombre: 'Villavicencio' },
  { id: '759af901-7e0b-4eb0-b9bf-b7dbd42c5e20', nombre: 'Pasto' },
  { id: '89dd6ef9-2dc3-4c1d-b358-3e32d6745157', nombre: 'Cúcuta' },
  { id: 'dd9c6dc2-43ca-4507-a52f-3e14831c7568', nombre: 'Neiva' },
  { id: '4a678847-13f6-46aa-a7b8-e187d92e7963', nombre: 'Montería' },
  { id: '08568c1c-5553-466b-9b41-aa76be72b6fd', nombre: 'Zipaquirá' },
  { id: '6a95ec89-1e10-4e9c-a11c-1b6ed2cdd716', nombre: 'Sumapaz' },
  { id: 'eb42733d-e723-4812-9c67-5db643fb26a9', nombre: 'Valledupar' },
]

const TIPOS = [
  { id: '19d8c59b-aa85-40d7-aeb7-7e87cc6e7f33', nombre: 'Restaurante' },
  { id: 'f39a02f4-0bbb-4dc4-bc8c-03fb257f7257', nombre: 'Bar' },
  { id: '372dab86-2540-407e-8549-effaff29a77a', nombre: 'Café' },
  { id: 'a9776e83-dcc2-464c-a579-45edcafe07e0', nombre: 'Discoteca' },
  { id: '4ca2f99b-f5f9-43ea-85db-23325c3840c6', nombre: 'Gastrobar' },
]

const emptyForm = {
  nombre: '', descripcion: '', tipo_id: '', ciudad_id: '', direccion: '',
  telefono: '', whatsapp: '', instagram: '', email: '', sitio_web: '',
  imagen_principal: '', logo_url: '', rango_precios: 2,
  activo: true, verificado: false, destacado: false,
}

export default function EstablecimientosPage() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')  // nombre del tipo
  const [ciudadFilter, setCiudadFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(20)
  const [showModal, setShowModal] = useState(false)
  const [editingEst, setEditingEst] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => { fetchEstablecimientos() }, [])

  const fetchEstablecimientos = async () => {
    setLoading(true)
    try {
      const res = await authFetch(`${API_URL}/admin/establecimientos?limite=500`)
      const data = await res.json()
      setEstablecimientos(data.establecimientos || data || [])
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const openNew = () => {
    setEditingEst(null)
    setForm(emptyForm)
    setSaveMsg('')
    setShowModal(true)
  }

  const openEdit = (est: any) => {
    setEditingEst(est)
    // Buscar IDs a partir de nombres
    const ciudadObj = CIUDADES.find(c => c.nombre === est.ciudad_nombre)
    const tipoObj = TIPOS.find(t => t.nombre === est.tipo_nombre)
    setForm({
      nombre: est.nombre || '',
      descripcion: est.descripcion || '',
      tipo_id: tipoObj?.id || '',
      ciudad_id: ciudadObj?.id || '',
      direccion: est.direccion || '',
      telefono: est.telefono || '',
      whatsapp: est.whatsapp || '',
      instagram: est.instagram || '',
      email: est.email || '',
      sitio_web: est.sitio_web || '',
      imagen_principal: est.imagen_principal || '',
      logo_url: est.logo_url || '',
      rango_precios: est.rango_precios || 2,
      activo: est.activo !== false,
      verificado: est.verificado || false,
      destacado: est.destacado || false,
    })
    setSaveMsg('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.nombre || !form.ciudad_id || !form.tipo_id) {
      setSaveMsg('❌ Nombre, ciudad y tipo son obligatorios')
      return
    }
    setSaving(true)
    setSaveMsg('')
    try {
      const url = editingEst
        ? `${API_URL}/admin/establecimientos/${editingEst.id}`
        : `${API_URL}/admin/establecimientos`
      const method = editingEst ? 'PUT' : 'POST'
      const res = await authFetch(url, { method, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) {
        setSaveMsg('✅ Guardado exitosamente')
        fetchEstablecimientos()
        setTimeout(() => setShowModal(false), 1000)
      } else {
        setSaveMsg(`❌ ${data.error || 'Error al guardar'}`)
      }
    } catch { setSaveMsg('❌ Error de conexión') }
    setSaving(false)
  }

  const eliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    try {
      await authFetch(`${API_URL}/admin/establecimientos/${id}`, { method: 'DELETE' })
      fetchEstablecimientos()
    } catch (err) { console.error(err) }
  }

  const filteredData = establecimientos.filter(est => {
    const matchSearch = !search || est.nombre?.toLowerCase().includes(search.toLowerCase())
    const matchTipo = !tipoFilter || est.tipo_nombre === tipoFilter
    const matchCiudad = !ciudadFilter || est.ciudad_nombre === ciudadFilter
    const matchEstado = !estadoFilter ||
      (estadoFilter === 'activo' && est.activo) ||
      (estadoFilter === 'inactivo' && !est.activo)
    return matchSearch && matchTipo && matchCiudad && matchEstado
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Establecimientos</h1>
          <p className="text-gray-400">{establecimientos.length} en total</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="card space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" className="input pl-10" placeholder="Buscar por nombre..."
              value={search} onChange={(e) => { setSearch(e.target.value); setVisibleCount(20) }} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters ? 'border-primary text-primary' : 'border-gray-700 text-gray-400'}`}>
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ciudad</label>
              <select className="input" value={ciudadFilter} onChange={(e) => setCiudadFilter(e.target.value)}>
                <option value="">Todas las ciudades</option>
                {CIUDADES.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tipo</label>
              <select className="input" value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                <option value="">Todos los tipos</option>
                {TIPOS.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Estado</label>
              <select className="input" value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm">{filteredData.length} resultados</p>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
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
              {filteredData.slice(0, visibleCount).map((est) => (
                <tr key={est.id} className="border-b border-gray-800/50 hover:bg-dark/50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {est.logo_url || est.imagen_principal ? (
                        <img src={est.logo_url || est.imagen_principal} alt={est.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                          {est.nombre?.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[200px]">{est.nombre}</p>
                        <p className="text-xs text-gray-500 truncate">/{est.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-300 text-sm">{est.ciudad_nombre}</td>
                  <td className="py-3 text-gray-300 text-sm">{est.tipo_nombre || '—'}</td>
                  <td className="py-3 text-sm">⭐ {est.valoracion_promedio ? Number(est.valoracion_promedio).toFixed(1) : '0.0'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${est.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {est.activo ? 'activo' : 'inactivo'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <a href={`https://midestinotunoche.com/establecimiento/${est.slug}`} target="_blank"
                        className="p-2 hover:bg-dark rounded-lg" title="Ver en web">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </a>
                      <button onClick={() => openEdit(est)} className="p-2 hover:bg-dark rounded-lg" title="Editar">
                        <Edit className="w-4 h-4 text-blue-400" />
                      </button>
                      <button onClick={() => eliminar(est.id, est.nombre)} className="p-2 hover:bg-dark rounded-lg" title="Eliminar">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && <p className="text-center py-8 text-gray-400">Sin resultados</p>}
          {visibleCount < filteredData.length && (
            <div className="text-center pt-4">
              <button onClick={() => setVisibleCount(v => v + 20)} className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-dark text-sm">
                Ver más ({filteredData.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">{editingEst ? 'Editar' : 'Nuevo'} Establecimiento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
                  <input type="text" className="input" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ciudad *</label>
                  <select className="input" value={form.ciudad_id} onChange={e => setForm({...form, ciudad_id: e.target.value})}>
                    <option value="">Seleccionar ciudad</option>
                    {CIUDADES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tipo *</label>
                  <select className="input" value={form.tipo_id} onChange={e => setForm({...form, tipo_id: e.target.value})}>
                    <option value="">Seleccionar tipo</option>
                    {TIPOS.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                  <textarea className="input min-h-[80px]" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Dirección</label>
                  <input type="text" className="input" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Teléfono</label>
                  <input type="text" className="input" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">WhatsApp</label>
                  <input type="text" className="input" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Instagram</label>
                  <input type="text" className="input" placeholder="@usuario" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">URL Logo</label>
                  <input type="text" className="input" placeholder="https://..." value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">URL Imagen Principal</label>
                  <input type="text" className="input" placeholder="https://..." value={form.imagen_principal} onChange={e => setForm({...form, imagen_principal: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Rango de Precios (1-4)</label>
                  <select className="input" value={form.rango_precios} onChange={e => setForm({...form, rango_precios: parseInt(e.target.value)})}>
                    <option value={1}>$ Económico</option>
                    <option value={2}>$$ Moderado</option>
                    <option value={3}>$$$ Costoso</option>
                    <option value={4}>$$$$ Muy costoso</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" checked={form.activo} onChange={e => setForm({...form, activo: e.target.checked})} />
                  <span className="text-sm">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" checked={form.verificado} onChange={e => setForm({...form, verificado: e.target.checked})} />
                  <span className="text-sm">Verificado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" checked={form.destacado} onChange={e => setForm({...form, destacado: e.target.checked})} />
                  <span className="text-sm">Destacado</span>
                </label>
              </div>
              {saveMsg && <p className="text-sm">{saveMsg}</p>}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingEst ? 'Guardar Cambios' : 'Crear Establecimiento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
