'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Edit, Trash2, Filter, X, RefreshCw, Upload, ImagePlus, Camera } from 'lucide-react'

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
  latitud?: string
  longitud?: string
}

const tipos = ['Todos', 'Restaurante', 'Bar', 'Café', 'Discoteca']
const ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Armenia', 'Pereira']
const estados = ['Todos', 'activo', 'inactivo']

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('admin_token')
  return null
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}

async function uploadImage(file: File, carpeta: string): Promise<{ url: string; url_thumbnail: string } | null> {
  const token = getToken()
  const formData = new FormData()
  formData.append('imagen', file)
  formData.append('carpeta', carpeta)

  try {
    const res = await fetch(`${API_URL}/upload/imagen`, {
      method: 'POST',
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      body: formData,
    })
    if (res.ok) return await res.json()
    const err = await res.json()
    console.error('Error upload:', err)
    return null
  } catch (err) {
    console.error('Error upload:', err)
    return null
  }
}

export default function EstablecimientosPage() {
  const [data, setData] = useState<Establecimiento[]>([])
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
  const [activeTab, setActiveTab] = useState<'info' | 'fotos'>('info')

  // Form fields
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
  const [formLatitud, setFormLatitud] = useState('')
  const [formLongitud, setFormLongitud] = useState('')

  // Photo state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [fotos, setFotos] = useState<{ url: string; url_thumbnail: string; preview?: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await apiCall('/establecimientos?limite=100')
      if (res.ok) {
        const json = await res.json()
        setData(json.establecimientos || [])
      }
    } catch (err) {
      console.error('Error cargando establecimientos:', err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const filteredData = data.filter(est => {
    const matchSearch = est.nombre.toLowerCase().includes(search.toLowerCase())
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
    setFormLatitud(''); setFormLongitud('')
    setFotos([]); setActiveTab('info'); setSaveError(''); setShowModal(true)
  }

  const openEdit = (est: Establecimiento) => {
    setEditingId(est.id); setFormNombre(est.nombre); setFormSlug(est.slug)
    setFormTipo(est.tipo_nombre || 'Restaurante'); setFormCiudad(est.ciudad_nombre || 'Armenia')
    setFormDireccion(est.direccion || ''); setFormDescripcion(est.descripcion || '')
    setFormTelefono(est.telefono || ''); setFormWhatsapp(est.whatsapp || ''); setFormInstagram(est.instagram || '')
    setFormActivo(est.activo); setFormVerificado(est.verificado); setFormDestacado(est.destacado)
    setFormLatitud(est.latitud || ''); setFormLongitud(est.longitud || '')
    setFotos(est.imagen_principal ? [{ url: est.imagen_principal, url_thumbnail: est.imagen_principal }] : [])
    setActiveTab('info'); setSaveError(''); setShowModal(true)
  }

  const handleUploadPhotos = async (files: FileList) => {
    setUploading(true)
    const slug = formSlug || generateSlug(formNombre) || 'general'
    const newFotos: { url: string; url_thumbnail: string }[] = []

    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`Subiendo ${i + 1} de ${files.length}...`)
      const result = await uploadImage(files[i], `establecimientos/${slug}`)
      if (result) newFotos.push(result)
    }

    setFotos(prev => [...prev, ...newFotos])
    setUploading(false)
    setUploadProgress('')
  }

  const removePhoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!formNombre.trim() || !formDireccion.trim()) {
      setSaveError('Nombre y dirección son requeridos')
      return
    }

    const body: any = {
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
      destacado: formDestacado,
      latitud: formLatitud ? parseFloat(formLatitud) : null,
      longitud: formLongitud ? parseFloat(formLongitud) : null,
    }

    if (fotos.length > 0) {
      body.imagen_principal = fotos[0].url
    }

    try {
      let res
      if (editingId) {
        res = await apiCall(`/establecimientos/${editingId}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        res = await apiCall('/establecimientos', { method: 'POST', body: JSON.stringify(body) })
      }

      if (res.ok) {
        setSaveSuccess(true)
        setSaveError('')
        setTimeout(() => { setSaveSuccess(false); setShowModal(false) }, 1000)
        fetchData()
      } else {
        const err = await res.json()
        setSaveError(err.error || 'Error al guardar')
      }
    } catch (err) {
      setSaveError('Error de conexión con el servidor')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await apiCall(`/establecimientos/${id}`, { method: 'DELETE' })
      if (res.ok) { fetchData() }
    } catch (err) {
      console.error('Error eliminando:', err)
    }
    setShowDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Establecimientos</h1>
          <p className="text-gray-400">Gestiona los establecimientos de la plataforma ({data.length} total)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2 border border-gray-700 rounded-lg hover:bg-dark" title="Recargar"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
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
            <div><label className="block text-sm text-gray-400 mb-2">Tipo</label><select className="input" value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>{tipos.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm text-gray-400 mb-2">Ciudad</label><select className="input" value={ciudadFilter} onChange={(e) => setCiudadFilter(e.target.value)}>{ciudades.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm text-gray-400 mb-2">Estado</label><select className="input" value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>{estados.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
          </div>
        )}
      </div>

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
                      <img src={est.imagen_principal || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'} alt={est.nombre} className="w-10 h-10 rounded-lg object-cover" />
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
                      <button onClick={() => { openEdit(est); setActiveTab('fotos') }} className="p-2 hover:bg-dark rounded-lg" title="Fotos"><ImagePlus className="w-4 h-4 text-blue-400" /></button>
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Establecimiento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 shrink-0">
              <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'info' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'}`}>📋 Información</button>
              <button onClick={() => setActiveTab('fotos')} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'fotos' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'}`}>📷 Fotos ({fotos.length})</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400 mb-2">Nombre *</label><input type="text" className="input" placeholder="Nombre del establecimiento" value={formNombre} onChange={(e) => { setFormNombre(e.target.value); if (!editingId) setFormSlug(generateSlug(e.target.value)) }} /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Slug</label><input type="text" className="input" placeholder="nombre-del-establecimiento" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400 mb-2">Tipo *</label><select className="input" value={formTipo} onChange={(e) => setFormTipo(e.target.value)}><option>Restaurante</option><option>Bar</option><option>Café</option><option>Discoteca</option></select></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Ciudad *</label><select className="input" value={formCiudad} onChange={(e) => setFormCiudad(e.target.value)}><option>Bogotá</option><option>Medellín</option><option>Cali</option><option>Cartagena</option><option>Armenia</option><option>Pereira</option></select></div>
                  </div>
                  <div><label className="block text-sm text-gray-400 mb-2">Dirección *</label><input type="text" className="input" placeholder="Dirección completa" value={formDireccion} onChange={(e) => setFormDireccion(e.target.value)} /></div>
                  <div><label className="block text-sm text-gray-400 mb-2">Descripción</label><textarea className="input min-h-[100px]" placeholder="Descripción del establecimiento" value={formDescripcion} onChange={(e) => setFormDescripcion(e.target.value)} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className="block text-sm text-gray-400 mb-2">Teléfono</label><input type="text" className="input" placeholder="+57 300 123 4567" value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">WhatsApp</label><input type="text" className="input" placeholder="573001234567" value={formWhatsapp} onChange={(e) => setFormWhatsapp(e.target.value)} /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Instagram</label><input type="text" className="input" placeholder="@usuario" value={formInstagram} onChange={(e) => setFormInstagram(e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400 mb-2">Latitud</label><input type="text" className="input" placeholder="4.5339" value={formLatitud} onChange={(e) => setFormLatitud(e.target.value)} /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Longitud</label><input type="text" className="input" placeholder="-75.6811" value={formLongitud} onChange={(e) => setFormLongitud(e.target.value)} /></div>
                  </div>
                  <p className="text-xs text-gray-500">💡 Para obtener las coordenadas: abre Google Maps, busca el lugar, clic derecho → copiar las coordenadas.</p>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formActivo} onChange={(e) => setFormActivo(e.target.checked)} /><span className="text-sm">Activo</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formVerificado} onChange={(e) => setFormVerificado(e.target.checked)} /><span className="text-sm">Verificado</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formDestacado} onChange={(e) => setFormDestacado(e.target.checked)} /><span className="text-sm">Destacado</span></label>
                  </div>
                </div>
              )}

              {activeTab === 'fotos' && (
                <div className="space-y-6">
                  <div className="bg-dark rounded-xl p-5">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-sm">🖼️</span>
                      Fotos del Establecimiento
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">La primera foto será la imagen principal visible en listados y búsquedas.</p>

                    {/* Uploaded photos grid */}
                    {fotos.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                        {fotos.map((foto, i) => (
                          <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-700">
                            <img src={foto.url_thumbnail || foto.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                            {i === 0 && <div className="absolute top-1.5 left-1.5 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PRINCIPAL</div>}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button type="button" onClick={() => removePhoto(i)} className="p-2 bg-red-500 rounded-lg hover:bg-red-600" title="Eliminar">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload area */}
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUploadPhotos(e.target.files)} />
                    <div
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-3 py-8 ${uploading ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-500'}`}
                    >
                      {uploading ? (
                        <div className="text-center">
                          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                          <span className="text-sm text-primary">{uploadProgress}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-500" />
                          <div className="text-center">
                            <span className="text-sm text-gray-400">Haz clic para seleccionar fotos</span>
                            <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP • Máx 10MB c/u</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
            <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer. Se eliminarán todos los datos asociados.</p>
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
