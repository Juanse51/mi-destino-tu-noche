'use client'

import { useState } from 'react'
import { Search, Plus, Edit, Trash2, Eye, MoreVertical, Filter, X } from 'lucide-react'

const establecimientos = [
  { id: 1, nombre: 'Andrés Carne de Res', slug: 'andres-carne-de-res', ciudad: 'Bogotá', tipo: 'Restaurante', valoracion: 4.8, estado: 'activo', verificado: true, destacado: true, imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100' },
  { id: 2, nombre: 'La Octava', slug: 'la-octava', ciudad: 'Cali', tipo: 'Bar', valoracion: 4.6, estado: 'activo', verificado: true, destacado: false, imagen: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100' },
  { id: 3, nombre: 'Café Velvet', slug: 'cafe-velvet', ciudad: 'Armenia', tipo: 'Café', valoracion: 4.7, estado: 'activo', verificado: false, destacado: false, imagen: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100' },
  { id: 4, nombre: 'Theatron', slug: 'theatron', ciudad: 'Bogotá', tipo: 'Discoteca', valoracion: 4.5, estado: 'pendiente', verificado: false, destacado: false, imagen: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=100' },
  { id: 5, nombre: 'Carmen', slug: 'carmen', ciudad: 'Medellín', tipo: 'Restaurante', valoracion: 4.9, estado: 'activo', verificado: true, destacado: true, imagen: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100' },
  { id: 6, nombre: 'El Cielo', slug: 'el-cielo', ciudad: 'Bogotá', tipo: 'Restaurante', valoracion: 4.9, estado: 'activo', verificado: true, destacado: true, imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100' },
]

const tipos = ['Todos', 'Restaurante', 'Bar', 'Café', 'Discoteca']
const ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Armenia']
const estados = ['Todos', 'activo', 'pendiente', 'inactivo']

export default function EstablecimientosPage() {
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('Todos')
  const [ciudadFilter, setCiudadFilter] = useState('Todas')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const filteredData = establecimientos.filter(est => {
    const matchSearch = est.nombre.toLowerCase().includes(search.toLowerCase())
    const matchTipo = tipoFilter === 'Todos' || est.tipo === tipoFilter
    const matchCiudad = ciudadFilter === 'Todas' || est.ciudad === ciudadFilter
    const matchEstado = estadoFilter === 'Todos' || est.estado === estadoFilter
    return matchSearch && matchTipo && matchCiudad && matchEstado
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Establecimientos</h1>
          <p className="text-gray-400">Gestiona los establecimientos de la plataforma</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
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
              onChange={(e) => setSearch(e.target.value)}
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
                {estados.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
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
            {filteredData.map((est) => (
              <tr key={est.id} className="border-b border-gray-800/50 hover:bg-dark/50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img src={est.imagen} alt={est.nombre} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {est.nombre}
                        {est.verificado && <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">✓ Verificado</span>}
                        {est.destacado && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">⭐ Destacado</span>}
                      </p>
                      <p className="text-sm text-gray-500">/{est.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-gray-300">{est.ciudad}</td>
                <td className="py-4 text-gray-300">{est.tipo}</td>
                <td className="py-4">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    {est.valoracion}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    est.estado === 'activo' ? 'bg-green-500/20 text-green-400' :
                    est.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {est.estado}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-dark rounded-lg" title="Ver">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => { setEditingId(est.id); setShowModal(true) }} className="p-2 hover:bg-dark rounded-lg" title="Editar">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-dark rounded-lg" title="Eliminar">
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Establecimiento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
                  <input type="text" className="input" placeholder="Nombre del establecimiento" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Slug</label>
                  <input type="text" className="input" placeholder="nombre-del-establecimiento" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tipo *</label>
                  <select className="input">
                    <option>Restaurante</option>
                    <option>Bar</option>
                    <option>Café</option>
                    <option>Discoteca</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ciudad *</label>
                  <select className="input">
                    <option>Bogotá</option>
                    <option>Medellín</option>
                    <option>Cali</option>
                    <option>Cartagena</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Dirección *</label>
                <input type="text" className="input" placeholder="Dirección completa" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                <textarea className="input min-h-[100px]" placeholder="Descripción del establecimiento" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Teléfono</label>
                  <input type="text" className="input" placeholder="+57 300 123 4567" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">WhatsApp</label>
                  <input type="text" className="input" placeholder="573001234567" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Instagram</label>
                  <input type="text" className="input" placeholder="@usuario" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <span className="text-sm">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <span className="text-sm">Verificado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <span className="text-sm">Destacado</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Guardar Cambios' : 'Crear Establecimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
