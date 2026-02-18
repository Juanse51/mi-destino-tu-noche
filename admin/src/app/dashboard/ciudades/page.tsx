'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, X, MapPin, RefreshCw, Upload } from 'lucide-react'
import { authFetch } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'
const SUPABASE_URL = 'https://xzvfwxlgrwzcpofdubmg.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dmZ3eGxncnd6Y3BvZmR1Ym1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg5MDg1NCwiZXhwIjoyMDg1NDY2ODU0fQ.PpCuYVXpPpKqRSvJVwlWJlyVZnf_Xk9zaXUzIPCNiag'

interface Ciudad {
  id: string
  nombre: string
  slug: string
  departamento_nombre: string
  imagen_url?: string
  descripcion?: string
  total_establecimientos: number
  activo: boolean
}

export default function CiudadesPage() {
  const [data, setData] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [fNombre, setFNombre] = useState('')
  const [fDepartamento, setFDepartamento] = useState('')
  const [fDescripcion, setFDescripcion] = useState('')
  const [fActivo, setFActivo] = useState(true)
  const [fImagenPreview, setFImagenPreview] = useState('')
  const [fImagenFile, setFImagenFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await authFetch(`${API_URL}/ciudades?todas=true`)
      if (res.ok) setData(await res.json())
    } catch (err) { console.error('Error:', err) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openNew = () => {
    setEditingId(null); setFNombre(''); setFDepartamento(''); setFDescripcion('')
    setFActivo(true); setFImagenPreview(''); setFImagenFile(null)
    setSaveError(''); setShowModal(true)
  }

  const openEdit = (c: Ciudad) => {
    setEditingId(c.id); setFNombre(c.nombre); setFDepartamento(c.departamento_nombre || '')
    setFDescripcion(c.descripcion || ''); setFActivo(c.activo)
    setFImagenPreview(c.imagen_url || ''); setFImagenFile(null)
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

  const uploadImage = async (ciudadSlug: string): Promise<string | null> => {
    if (!fImagenFile) return null
    setUploading(true)
    try {
      const ext = fImagenFile.name.split('.').pop() || 'jpg'
      const filePath = `ciudades/${ciudadSlug}.${ext}`
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
      console.error('Upload error:', await res.text())
      return null
    } catch (err) {
      console.error('Upload error:', err)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!fNombre.trim()) { setSaveError('Nombre es requerido'); return }

    const slug = fNombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const body: any = {
      nombre: fNombre,
      departamento: fDepartamento,
      descripcion: fDescripcion,
      activo: fActivo
    }

    try {
      if (editingId) {
        // Subir imagen si hay nueva
        if (fImagenFile) {
          const imageUrl = await uploadImage(slug)
          if (imageUrl) body.imagen_url = imageUrl
        }
        const res = await authFetch(`${API_URL}/ciudades/${editingId}`, { method: 'PUT', body: JSON.stringify(body) })
        if (res.ok) {
          setSaveSuccess(true); setSaveError('')
          setTimeout(() => { setSaveSuccess(false); setShowModal(false) }, 800)
          fetchData()
        } else {
          const err = await res.json()
          setSaveError(err.error || 'Error al guardar')
        }
      } else {
        const res = await authFetch(`${API_URL}/ciudades`, { method: 'POST', body: JSON.stringify(body) })
        if (res.ok) {
          const result = await res.json()
          if (fImagenFile) {
            const imageUrl = await uploadImage(slug)
            if (imageUrl) {
              await authFetch(`${API_URL}/ciudades/${result.id}`, {
                method: 'PUT', body: JSON.stringify({ imagen_url: imageUrl })
              })
            }
          }
          setSaveSuccess(true); setSaveError('')
          setTimeout(() => { setSaveSuccess(false); setShowModal(false) }, 800)
          fetchData()
        } else {
          const err = await res.json()
          setSaveError(err.error || 'Error al crear')
        }
      }
    } catch (err) { setSaveError('Error de conexión') }
  }

  const handleDelete = async (id: string) => {
    try {
      await authFetch(`${API_URL}/ciudades/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) { console.error(err) }
    setShowDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ciudades</h1>
          <p className="text-gray-400">Gestiona las ciudades disponibles ({data.length} total)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2 border border-gray-700 rounded-lg hover:bg-dark">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Ciudad
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400">Cargando ciudades...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((ciudad) => (
            <div key={ciudad.id} className={`card overflow-hidden ${!ciudad.activo && 'opacity-60'}`}>
              {/* Imagen de ciudad */}
              <div className="relative h-32 -mx-4 -mt-4 mb-4 bg-dark">
                {ciudad.imagen_url ? (
                  <img src={ciudad.imagen_url} alt={ciudad.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-card">
                    <MapPin className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs ${ciudad.activo ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {ciudad.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{ciudad.nombre}</h3>
                  <p className="text-sm text-gray-400">{ciudad.departamento_nombre || 'Sin departamento'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div>
                  <p className="text-2xl font-bold">{ciudad.total_establecimientos || 0}</p>
                  <p className="text-xs text-gray-400">establecimientos</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(ciudad)} className="p-2 hover:bg-dark rounded-lg">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(ciudad.id)} className="p-2 hover:bg-dark rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="card text-center py-12">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay ciudades creadas</p>
          <button onClick={openNew} className="btn-primary mt-4">Crear primera ciudad</button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nueva'} Ciudad</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Imagen */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Foto de la ciudad</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-36 rounded-xl border-2 border-dashed border-gray-600 hover:border-primary flex items-center justify-center cursor-pointer overflow-hidden bg-dark transition-colors"
                >
                  {fImagenPreview ? (
                    <img src={fImagenPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Subir foto de la ciudad</p>
                      <p className="text-xs text-gray-500">Recomendado: 800x400px</p>
                    </div>
                  )}
                </div>
                {fImagenFile && <p className="text-green-400 text-sm mt-1">✓ {fImagenFile.name}</p>}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
                <input type="text" className="input" placeholder="Nombre de la ciudad" value={fNombre} onChange={(e) => setFNombre(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Departamento</label>
                <input type="text" className="input" placeholder="Departamento" value={fDepartamento} onChange={(e) => setFDepartamento(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                <textarea className="input min-h-[80px]" placeholder="Descripción de la ciudad" value={fDescripcion} onChange={(e) => setFDescripcion(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" checked={fActivo} onChange={(e) => setFActivo(e.target.checked)} />
                <span className="text-sm">Activa</span>
              </label>

              {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
              {saveSuccess && <p className="text-green-400 text-sm">✅ Guardado</p>}
              {uploading && <p className="text-yellow-400 text-sm">Subiendo imagen...</p>}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-800 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
              <button type="button" onClick={handleSave} className="btn-primary" disabled={uploading}>{editingId ? 'Guardar' : 'Crear'}</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">¿Eliminar ciudad?</h3>
            <p className="text-gray-400 text-sm mb-6">Se eliminarán los datos de esta ciudad.</p>
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
