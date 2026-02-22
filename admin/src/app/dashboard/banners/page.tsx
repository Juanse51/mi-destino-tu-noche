'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, X, Calendar, MapPin, MousePointer } from 'lucide-react'

const banners = [
  { id: 1, titulo: 'Promoción Navidad', imagen: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400', ubicacion: 'home', ciudad: 'Todas', impresiones: 12500, clics: 890, activo: true, fecha_inicio: '2024-12-01', fecha_fin: '2024-12-31' },
  { id: 2, titulo: 'Descuento 20%', imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', ubicacion: 'busqueda', ciudad: 'Bogotá', impresiones: 8200, clics: 456, activo: true, fecha_inicio: '2024-01-01', fecha_fin: '2024-01-31' },
  { id: 3, titulo: 'Nuevo Bar en Medellín', imagen: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400', ubicacion: 'home', ciudad: 'Medellín', impresiones: 5400, clics: 234, activo: false, fecha_inicio: '2024-01-15', fecha_fin: '2024-02-15' },
]

export default function BannersPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-gray-400">Gestiona los banners publicitarios</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Banner
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="card overflow-hidden">
            <div className="relative h-40">
              <img src={banner.imagen} alt={banner.titulo} className="w-full h-full object-cover" />
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${banner.activo ? 'bg-green-500' : 'bg-gray-500'}`}>
                {banner.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2">{banner.titulo}</h3>
              
              <div className="space-y-1 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {banner.ubicacion} • {banner.ciudad}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {banner.fecha_inicio} - {banner.fecha_fin}
                </div>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <div>
                  <p className="text-gray-400">Impresiones</p>
                  <p className="font-semibold">{banner.impresiones.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Clics</p>
                  <p className="font-semibold">{banner.clics.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">CTR</p>
                  <p className="font-semibold">{((banner.clics / banner.impresiones) * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingId(banner.id); setShowModal(true) }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-dark rounded-lg hover:bg-dark-card transition-colors"
                >
                  <Edit className="w-4 h-4" /> Editar
                </button>
                <button className="p-2 bg-dark rounded-lg hover:bg-dark-card transition-colors">
                  {banner.activo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Banner</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Título *</label>
                <input type="text" className="input" placeholder="Título del banner" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">URL de imagen *</label>
                <input type="url" className="input" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">URL de destino</label>
                <input type="url" className="input" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ubicación</label>
                  <select className="input">
                    <option value="home">Home</option>
                    <option value="busqueda">Búsqueda</option>
                    <option value="detalle">Detalle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ciudad</label>
                  <select className="input">
                    <option value="">Todas</option>
                    <option value="bogota">Bogotá</option>
                    <option value="medellin">Medellín</option>
                    <option value="cali">Cali</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fecha inicio</label>
                  <input type="date" className="input" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fecha fin</label>
                  <input type="date" className="input" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked />
                <span className="text-sm">Activo</span>
              </label>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Guardar Cambios' : 'Crear Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
