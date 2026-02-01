'use client'

import { useState } from 'react'
import { Search, Filter, MoreVertical, Shield, User, Ban, Mail } from 'lucide-react'

const usuarios = [
  { id: 1, nombre: 'María García', email: 'maria@email.com', rol: 'usuario', estado: 'activo', valoraciones: 15, favoritos: 23, created_at: '2024-01-15' },
  { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos@email.com', rol: 'usuario', estado: 'activo', valoraciones: 8, favoritos: 12, created_at: '2024-01-10' },
  { id: 3, nombre: 'Ana Martínez', email: 'ana@email.com', rol: 'propietario', estado: 'activo', valoraciones: 25, favoritos: 45, created_at: '2024-01-05' },
  { id: 4, nombre: 'Juan Pérez', email: 'juan@email.com', rol: 'usuario', estado: 'suspendido', valoraciones: 2, favoritos: 5, created_at: '2024-01-01' },
  { id: 5, nombre: 'Laura López', email: 'laura@email.com', rol: 'admin', estado: 'activo', valoraciones: 0, favoritos: 0, created_at: '2023-12-20' },
  { id: 6, nombre: 'Pedro Sánchez', email: 'pedro@email.com', rol: 'usuario', estado: 'activo', valoraciones: 12, favoritos: 18, created_at: '2023-12-15' },
]

const roles = ['Todos', 'usuario', 'propietario', 'admin']
const estados = ['Todos', 'activo', 'suspendido']

export default function UsuariosPage() {
  const [search, setSearch] = useState('')
  const [rolFilter, setRolFilter] = useState('Todos')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)

  const filteredData = usuarios.filter(u => {
    const matchSearch = u.nombre.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRol = rolFilter === 'Todos' || u.rol === rolFilter
    const matchEstado = estadoFilter === 'Todos' || u.estado === estadoFilter
    return matchSearch && matchRol && matchEstado
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-gray-400">Gestiona los usuarios de la plataforma</p>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar por nombre o email..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Rol</label>
              <select className="input" value={rolFilter} onChange={(e) => setRolFilter(e.target.value)}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
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
              <th className="pb-3 font-medium">Usuario</th>
              <th className="pb-3 font-medium">Rol</th>
              <th className="pb-3 font-medium">Valoraciones</th>
              <th className="pb-3 font-medium">Favoritos</th>
              <th className="pb-3 font-medium">Registro</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="pb-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user.id} className="border-b border-gray-800/50 hover:bg-dark/50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold">
                      {user.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.nombre}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${
                    user.rol === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                    user.rol === 'propietario' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {user.rol === 'admin' && <Shield className="w-3 h-3" />}
                    {user.rol === 'propietario' && <User className="w-3 h-3" />}
                    {user.rol}
                  </span>
                </td>
                <td className="py-4 text-gray-300">{user.valoraciones}</td>
                <td className="py-4 text-gray-300">{user.favoritos}</td>
                <td className="py-4 text-gray-400 text-sm">{user.created_at}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.estado === 'activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.estado}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-dark rounded-lg" title="Enviar email">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-dark rounded-lg" title={user.estado === 'activo' ? 'Suspender' : 'Activar'}>
                      <Ban className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
