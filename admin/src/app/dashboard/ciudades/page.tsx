'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, MapPin, RefreshCw } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

interface Ciudad {
  id: string
  nombre: string
  slug: string
  departamento_nombre: string
  total_establecimientos: number
  activo: boolean
}

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

export default function CiudadesPage() {
  const [data, setData] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [fNombre, setFNombre] = useState('')
  const [fDepartamento, setFDepartamento] = useState('')
  const [fActivo, setFActivo] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await apiCall('/ciudades?todas=true')
      if (res.ok) setData(await res.json())
    } catch (err) { console.error('Error:', err) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openNew = () => {
    setEditingId(null); setFNombre(''); setFDepartamento(''); setFActivo(true)
    setSaveError(''); setShowModal(true)
  }

  const openEdit = (c: Ciudad) => {
    setEditingId(c.id); setFNombre(c.nombre); setFDepartamento(c.departamento_nombre || ''); setFActivo(c.activo)
    setSaveError(''); setShowModal(true)
  }

  const handleSave = async () => {
    if (!fNombre.trim()) { setSaveError('Nombre es requerido'); return }

    const body = { nombre: fNombre, departamento: fDepartamento, activo: fActivo }

    try {
      let res
      if (editingId) {
        res = await apiCall(`/ciudades/${editingId}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        res = await apiCall('/ciudades', { method: 'POST', body: JSON.stringify(body) })
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
      await apiCall(`/ciudades/${id}`, { method: 'DELETE' })
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
          <button onClick={fetchData} className="p-2 border border-gray-700 rounded-lg hover:bg-dark"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Nueva Ciudad</button>
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
            <div key={ciudad.id} className={`card ${!ciudad.activo && 'opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{ciudad.nombre}</h3>
                    <p className="text-sm text-gray-400">{ciudad.departamento_nombre || 'Sin departamento'}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${ciudad.activo ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {ciudad.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div>
                  <p className="text-2xl font-bold">{ciudad.total_establecimientos || 0}</p>
                  <p className="text-xs text-gray-400">establecimientos</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(ciudad)} className="p-2 hover:bg-dark rounded-lg"><Edit className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => setShowDeleteConfirm(ciudad.id)} className="p-2 hover:bg-dark rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nueva'} Ciudad</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
                <input type="text" className="input" placeholder="Nombre de la ciudad" value={fNombre} onChange={(e) => setFNombre(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Departamento</label>
                <input type="text" className="input" placeholder="Departamento" value={fDepartamento} onChange={(e) => setFDepartamento(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" checked={fActivo} onChange={(e) => setFActivo(e.target.checked)} />
                <span className="text-sm">Activa</span>
              </label>
              {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
              {saveSuccess && <p className="text-green-400 text-sm">✅ Guardado</p>}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
                <button type="button" onClick={handleSave} className="btn-primary">{editingId ? 'Guardar' : 'Crear'}</button>
              </div>
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
