'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X, MapPin } from 'lucide-react'

const ciudades = [
  { id: 1, nombre: 'Bogotá', slug: 'bogota', departamento: 'Cundinamarca', establecimientos: 450, activa: true },
  { id: 2, nombre: 'Medellín', slug: 'medellin', departamento: 'Antioquia', establecimientos: 320, activa: true },
  { id: 3, nombre: 'Cali', slug: 'cali', departamento: 'Valle del Cauca', establecimientos: 180, activa: true },
  { id: 4, nombre: 'Cartagena', slug: 'cartagena', departamento: 'Bolívar', establecimientos: 150, activa: true },
  { id: 5, nombre: 'Barranquilla', slug: 'barranquilla', departamento: 'Atlántico', establecimientos: 134, activa: true },
  { id: 6, nombre: 'Pereira', slug: 'pereira', departamento: 'Risaralda', establecimientos: 90, activa: true },
  { id: 7, nombre: 'Armenia', slug: 'armenia', departamento: 'Quindío', establecimientos: 75, activa: true },
  { id: 8, nombre: 'Manizales', slug: 'manizales', departamento: 'Caldas', establecimientos: 60, activa: false },
]

export default function CiudadesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ciudades</h1>
          <p className="text-gray-400">Gestiona las ciudades disponibles</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva Ciudad
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ciudades.map((ciudad) => (
          <div key={ciudad.id} className={`card ${!ciudad.activa && 'opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{ciudad.nombre}</h3>
                  <p className="text-sm text-gray-400">{ciudad.departamento}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${ciudad.activa ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {ciudad.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <div>
                <p className="text-2xl font-bold">{ciudad.establecimientos}</p>
                <p className="text-xs text-gray-400">establecimientos</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingId(ciudad.id); setShowModal(true) }}
                  className="p-2 hover:bg-dark rounded-lg"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-dark rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nueva'} Ciudad</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
                <input type="text" className="input" placeholder="Nombre de la ciudad" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Slug</label>
                <input type="text" className="input" placeholder="nombre-ciudad" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Departamento</label>
                <input type="text" className="input" placeholder="Departamento" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked />
                <span className="text-sm">Activa</span>
              </label>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
