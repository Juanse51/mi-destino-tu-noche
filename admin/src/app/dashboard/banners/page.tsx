'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, X, Calendar, MapPin, RefreshCw, Upload } from 'lucide-react'
import { authFetch } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'
const SUPABASE_URL = 'https://xzvfwxlgrwzcpofdubmg.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dmZ3eGxncnd6Y3BvZmR1Ym1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg5MDg1NCwiZXhwIjoyMDg1NDY2ODU0fQ.PpCuYVXpPpKqRSvJVwlWJlyVZnf_Xk9zaXUzIPCNiag'

interface Banner {
  id: string
  titulo: string
  subtitulo?: string
  imagen_url: string
  imagen_mobile_url?: string
  enlace_url?: string
  enlace_tipo: string
  ubicacion: string
  ciudad_nombre?: string
  fecha_inicio?: string
  fecha_fin?: string
  activo: boolean
  orden: number
  impresiones: number
  clics: number
}

const ubicaciones = ['home', 'busqueda', 'detalle', 'ciudad']

export default function BannersPage() {
  const [data, setData] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [fTitulo, setFTitulo] = useState('')
  const [fSubtitulo, setFSubtitulo] = useState('')
  const [fEnlaceUrl, setFEnlaceUrl] = useState('')
  const [fUbicacion, setFUbicacion] = useState('home')
  const [fCiudad, setFCiudad] = useState('')
  const [fFechaInicio, setFFechaInicio] = useState('')
  const [fFechaFin, setFFechaFin] = useState('')
  const [fActivo, setFActivo] = useState(true)
  const [fOrden, setFOrden] = useState(0)
  const [fImagenPreview, setFImagenPreview] = useState('')
  const [fImagenFile, setFImagenFile] = useState<File | null>(null)
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await authFetch(`${API_URL}/banners?todos=true`)
      if (res.ok) setData(await res.json())

      // Cargar ciudades
      const cRes = await fetch(`${API_URL}/ciudades?todas=true`)
      if (cRes.ok) {
        const ciudades = await cRes.json()
        setCiudadesDisponibles(ciudades.map((c: any) => c.nombre).sort())
      }
    } catch (err) { console.error('Error:', err) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openNew = () => {
    setEditingId(null); setFTitulo(''); setFSubtitulo(''); setFEnlaceUrl('')
    setFUbicacion('home'); setFCiudad(''); setFFechaInicio(''); setFFechaFin('')
    setFActivo(true); setFOrden(0); setFImagenPreview(''); setFImagenFile(null)
    setSaveError(''); setShowModal(true)
  }

  const openEdit = (b: Banner) => {
    setEditingId(b.id); setFTitulo(b.titulo); setFSubtitulo(b.subtitulo || '')
    setFEnlaceUrl(b.enlace_url || ''); setFUbicacion(b.ubicacion)
    setFCiudad(b.ciudad_nombre || ''); setFActivo(b.activo); setFOrden(b.orden)
    setFFechaInicio(b.fecha_inicio ? b.fecha_inicio.split('T')[0] : '')
    setFFechaFin(b.fecha_fin ? b.fecha_fin.split('T')[0] : '')
    setFImagenPreview(b.imagen_url); setFImagenFile(null)
    setSaveError(''); setShowModal(true)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFImagenFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setFImagenPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (bannerId: string): Promise<string | null> => {
    if (!fImagenFile) return null
    setUploading(true)
    try {
      const ext = fImagenFile.name.split('.').pop() || 'jpg'
      const filePath = `banners/${bannerId}.${ext}`
      const arrayBuffer = await fImagenFile.arrayBuffer()

      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/imagenes/${filePath}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': fImagenFile.type,
          'x-upsert': 'true',
        },
        body: arrayBuffer
      })

      if (res.ok) {
        return `${SUPABASE_URL}/storage/v1/object/public/imagenes/${filePath}`
      }
      return null
    } catch { return null }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!fTitulo.trim()) { setSaveError('Título es requerido'); return }
    if (!fImagenPreview && !fImagenFile) { setSaveError('Imagen es requerida'); return }

    try {
      let imagenUrl = fImagenPreview

      if (editingId) {
        // Subir imagen si hay nueva
        if (fImagenFile) {
          const url = await uploadImage(editingId)
          if (url) imagenUrl = url
        }

        const body = {
          titulo: fTitulo, subtitulo: fSubtitulo, imagen_url: imagenUrl,
          enlace_url: fEnlaceUrl, ubicacion: fUbicacion, ciudad: fCiudad,
          fecha_inicio: fFechaInicio || null, fecha_fin: fFechaFin || null,
          activo: fActivo, orden: fOrden
        }

        const res = await authFetch(`${API_URL}/banners/${editingId}`, { method: 'PUT', body: JSON.stringify(body) })
        if (res.ok) {
          setSaveSuccess(true)
          setTimeout(() => { setSaveSuccess(false); setShowModal(false) }, 800)
          fetchData()
        } else {
          const err = await res.json()
          setSaveError(err.error || 'Error al guardar')
        }
      } else {
        // Crear primero con URL temporal
        const body = {
          titulo: fTitulo, subtitulo: fSubtitulo, imagen_url: 'https://placeholder.com/temp',
          enlace_url: fEnlaceUrl, ubicacion: fUbicacion, ciudad: fCiudad,
          fecha_inicio: fFechaInicio || null, fecha_fin: fFechaFin || null,
          activo: fActivo, orden: fOrden
        }

        const res = await authFetch(`${API_URL}/banners`, { method: 'POST', body: JSON.stringify(body) })
        if (res.ok) {
          const result = await res.json()
          // Subir imagen con el ID del banner
          if (fImagenFile) {
            const url = await uploadImage(result.id)
            if (url) {
              await authFetch(`${API_URL}/banners/${result.id}`, {
                method: 'PUT', body: JSON.stringify({ imagen_url: url })
              })
            }
          }
          setSaveSuccess(true)
          setTimeout(() => { setSaveSuccess(false); setShowModal(false) }, 800)
          fetchData()
        } else {
          const err = await res.json()
          setSaveError(err.error || 'Error al crear')
        }
      }
    } catch (err) { setSaveError('Error de conexión') }
  }

  const handleToggleActive = async (b: Banner) => {
    try {
      await authFetch(`${API_URL}/banners/${b.id}`, {
        method: 'PUT', body: JSON.stringify({ activo: !b.activo })
      })
      fetchData()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id: string) => {
    try {
      await authFetch(`${API_URL}/banners/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) { console.error(err) }
    setShowDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-gray-400">Gestiona los banners publicitarios ({data.length} total)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2 border border-gray-700 rounded-lg hover:bg-dark">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Banner
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400">Cargando banners...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 mb-4">No hay banners creados</p>
          <button onClick={openNew} className="btn-primary">Crear primer banner</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((banner) => (
            <div key={banner.id} className={`card overflow-hidden ${!banner.activo && 'opacity-60'}`}>
              <div className="relative h-40">
                <img src={banner.imagen_url} alt={banner.titulo} className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${banner.activo ? 'bg-green-500' : 'bg-gray-500'}`}>
                  {banner.activo ? 'Activo' : 'Inactivo'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-2">{banner.titulo}</h3>

                <div className="space-y-1 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {banner.ubicacion} • {banner.ciudad_nombre || 'Todas'}
                  </div>
                  {(banner.fecha_inicio || banner.fecha_fin) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {banner.fecha_inicio?.split('T')[0] || '∞'} - {banner.fecha_fin?.split('T')[0] || '∞'}
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm mb-4">
                  <div>
                    <p className="text-gray-400">Impresiones</p>
                    <p className="font-semibold">{(banner.impresiones || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Clics</p>
                    <p className="font-semibold">{(banner.clics || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">CTR</p>
                    <p className="font-semibold">{banner.impresiones > 0 ? ((banner.clics / banner.impresiones) * 100).toFixed(1) : '0'}%</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openEdit(banner)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-dark rounded-lg hover:bg-dark/80 transition-colors">
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                  <button onClick={() => handleToggleActive(banner)} className="p-2 bg-dark rounded-lg hover:bg-dark/80 transition-colors">
                    {banner.activo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setShowDeleteConfirm(banner.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Banner</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Imagen */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Imagen del banner *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 rounded-xl border-2 border-dashed border-gray-600 hover:border-primary flex items-center justify-center cursor-pointer overflow-hidden bg-dark transition-colors"
                >
                  {fImagenPreview ? (
                    <img src={fImagenPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Haz clic para subir imagen</p>
                      <p className="text-xs text-gray-500">Recomendado: 1200x400px</p>
                    </div>
                  )}
                </div>
                {fImagenFile && <p className="text-green-400 text-sm mt-1">✓ {fImagenFile.name}</p>}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Título *</label>
                <input type="text" className="input" placeholder="Título del banner" value={fTitulo} onChange={(e) => setFTitulo(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subtítulo</label>
                <input type="text" className="input" placeholder="Subtítulo opcional" value={fSubtitulo} onChange={(e) => setFSubtitulo(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">URL de enlace</label>
                <input type="url" className="input" placeholder="https://..." value={fEnlaceUrl} onChange={(e) => setFEnlaceUrl(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ubicación</label>
                  <select className="input" value={fUbicacion} onChange={(e) => setFUbicacion(e.target.value)}>
                    {ubicaciones.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ciudad</label>
                  <select className="input" value={fCiudad} onChange={(e) => setFCiudad(e.target.value)}>
                    <option value="">Todas</option>
                    {ciudadesDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fecha inicio</label>
                  <input type="date" className="input" value={fFechaInicio} onChange={(e) => setFFechaInicio(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fecha fin</label>
                  <input type="date" className="input" value={fFechaFin} onChange={(e) => setFFechaFin(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" checked={fActivo} onChange={(e) => setFActivo(e.target.checked)} />
                  <span className="text-sm">Activo</span>
                </label>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Orden</label>
                  <input type="number" className="input" value={fOrden} onChange={(e) => setFOrden(parseInt(e.target.value) || 0)} />
                </div>
              </div>

              {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
              {saveSuccess && <p className="text-green-400 text-sm">✅ Guardado</p>}
              {uploading && <p className="text-yellow-400 text-sm">Subiendo imagen...</p>}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-800 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
              <button type="button" onClick={handleSave} className="btn-primary" disabled={uploading}>{editingId ? 'Guardar' : 'Crear Banner'}</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">¿Eliminar banner?</h3>
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
