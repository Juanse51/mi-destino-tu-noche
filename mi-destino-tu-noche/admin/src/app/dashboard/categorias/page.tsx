'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X, Tags, Star } from 'lucide-react'

const categoriasEspeciales = [
  { id: 1, nombre: 'Círculo Gastro', slug: 'circulo-gastro', icono: '⭐', color: '#FFD700', descripcion: 'Los mejores restaurantes premium', establecimientos: 150 },
  { id: 2, nombre: 'Cámara de la Diversidad', slug: 'camara-diversidad', icono: '🏳️‍🌈', color: '#FF69B4', descripcion: 'Espacios inclusivos LGBTIQ+', establecimientos: 85 },
  { id: 3, nombre: 'Pet Friendly', slug: 'pet-friendly', icono: '🐕', color: '#4CAF50', descripcion: 'Mascotas bienvenidas', establecimientos: 230 },
  { id: 4, nombre: 'Tardeo', slug: 'tardeo', icono: '🌅', color: '#FF8C00', descripcion: 'Disfruta desde temprano', establecimientos: 120 },
]

const etiquetas = [
  { id: 1, nombre: 'WiFi gratis', icono: '📶', categoria: 'servicio', usos: 450 },
  { id: 2, nombre: 'Música en vivo', icono: '🎵', categoria: 'ambiente', usos: 180 },
  { id: 3, nombre: 'Terraza', icono: '🌿', categoria: 'facilidad', usos: 320 },
  { id: 4, nombre: 'Parqueadero', icono: '🅿️', categoria: 'facilidad', usos: 280 },
  { id: 5, nombre: 'Romántico', icono: '💕', categoria: 'ambiente', usos: 95 },
  { id: 6, nombre: 'Familiar', icono: '👨‍👩‍👧‍👦', categoria: 'ambiente', usos: 210 },
  { id: 7, nombre: 'Karaoke', icono: '🎤', categoria: 'ambiente', usos: 45 },
  { id: 8, nombre: 'Rooftop', icono: '🏙️', categoria: 'facilidad', usos: 65 },
]

export default function CategoriasPage() {
  const [activeTab, setActiveTab] = useState<'especiales' | 'etiquetas'>('especiales')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'especial' | 'etiqueta'>('especial')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorías y Etiquetas</h1>
          <p className="text-gray-400">Gestiona las categorías especiales y etiquetas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('especiales')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'especiales' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Star className="w-4 h-4 inline mr-2" />
          Categorías Especiales
        </button>
        <button
          onClick={() => setActiveTab('etiquetas')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'etiquetas' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Tags className="w-4 h-4 inline mr-2" />
          Etiquetas
        </button>
      </div>

      {/* Categorías Especiales */}
      {activeTab === 'especiales' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setModalType('especial'); setShowModal(true) }} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nueva Categoría
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoriasEspeciales.map((cat) => (
              <div key={cat.id} className="card" style={{ borderLeft: `4px solid ${cat.color}` }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icono}</span>
                    <div>
                      <h3 className="font-semibold">{cat.nombre}</h3>
                      <p className="text-sm text-gray-400">{cat.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-dark rounded-lg">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-dark rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-sm text-gray-400">/{cat.slug}</span>
                  <span className="text-sm"><strong>{cat.establecimientos}</strong> establecimientos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Etiquetas */}
      {activeTab === 'etiquetas' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setModalType('etiqueta'); setShowModal(true) }} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nueva Etiqueta
            </button>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                  <th className="pb-3 font-medium">Etiqueta</th>
                  <th className="pb-3 font-medium">Categoría</th>
                  <th className="pb-3 font-medium">Usos</th>
                  <th className="pb-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {etiquetas.map((tag) => (
                  <tr key={tag.id} className="border-b border-gray-800/50 hover:bg-dark/50">
                    <td className="py-3">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{tag.icono}</span>
                        {tag.nombre}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tag.categoria === 'servicio' ? 'bg-blue-500/20 text-blue-400' :
                        tag.categoria === 'ambiente' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {tag.categoria}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{tag.usos}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-dark rounded-lg">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-dark rounded-lg">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">
                Nueva {modalType === 'especial' ? 'Categoría Especial' : 'Etiqueta'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
                <input type="text" className="input" placeholder="Nombre" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Icono (emoji)</label>
                  <input type="text" className="input" placeholder="⭐" />
                </div>
                {modalType === 'especial' ? (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Color</label>
                    <input type="color" className="input h-10" defaultValue="#FF6B35" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Categoría</label>
                    <select className="input">
                      <option value="servicio">Servicio</option>
                      <option value="ambiente">Ambiente</option>
                      <option value="facilidad">Facilidad</option>
                    </select>
                  </div>
                )}
              </div>
              {modalType === 'especial' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                  <textarea className="input" placeholder="Descripción de la categoría" />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
