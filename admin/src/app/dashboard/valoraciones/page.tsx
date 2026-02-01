'use client'

import { useState } from 'react'
import { Search, Filter, Check, X, Flag, Eye } from 'lucide-react'

const valoraciones = [
  { id: 1, usuario: 'María García', establecimiento: 'Andrés Carne de Res', puntuacion: 5, comentario: '¡Increíble experiencia! La comida deliciosa y el ambiente es único.', estado: 'publicada', created_at: '2024-01-15' },
  { id: 2, usuario: 'Carlos Rodríguez', establecimiento: 'La Octava', puntuacion: 4, comentario: 'Muy buen lugar, aunque un poco costoso. La música en vivo es excelente.', estado: 'pendiente', created_at: '2024-01-14' },
  { id: 3, usuario: 'Ana Martínez', establecimiento: 'Café Velvet', puntuacion: 5, comentario: 'El mejor café de la región. Vista espectacular.', estado: 'publicada', created_at: '2024-01-13' },
  { id: 4, usuario: 'Juan Pérez', establecimiento: 'Theatron', puntuacion: 2, comentario: 'Mala experiencia, muy lleno y el servicio pésimo. No recomiendo.', estado: 'reportada', created_at: '2024-01-12' },
  { id: 5, usuario: 'Laura López', establecimiento: 'Carmen', puntuacion: 5, comentario: 'Exquisito. Una experiencia gastronómica de otro nivel.', estado: 'publicada', created_at: '2024-01-11' },
  { id: 6, usuario: 'Pedro Sánchez', establecimiento: 'El Cielo', puntuacion: 1, comentario: 'SPAM CONTENIDO INAPROPIADO', estado: 'reportada', created_at: '2024-01-10' },
]

const estados = ['Todos', 'publicada', 'pendiente', 'reportada', 'rechazada']

export default function ValoracionesPage() {
  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)

  const filteredData = valoraciones.filter(v => {
    const matchSearch = v.usuario.toLowerCase().includes(search.toLowerCase()) || 
                       v.establecimiento.toLowerCase().includes(search.toLowerCase()) ||
                       v.comentario.toLowerCase().includes(search.toLowerCase())
    const matchEstado = estadoFilter === 'Todos' || v.estado === estadoFilter
    return matchSearch && matchEstado
  })

  const handleAprobar = (id: number) => {
    console.log('Aprobar:', id)
  }

  const handleRechazar = (id: number) => {
    console.log('Rechazar:', id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Valoraciones</h1>
        <p className="text-gray-400">Modera las valoraciones de los usuarios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-400">{valoraciones.filter(v => v.estado === 'publicada').length}</p>
          <p className="text-sm text-gray-400">Publicadas</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-yellow-400">{valoraciones.filter(v => v.estado === 'pendiente').length}</p>
          <p className="text-sm text-gray-400">Pendientes</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-400">{valoraciones.filter(v => v.estado === 'reportada').length}</p>
          <p className="text-sm text-gray-400">Reportadas</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-gray-400">{valoraciones.filter(v => v.estado === 'rechazada').length}</p>
          <p className="text-sm text-gray-400">Rechazadas</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar valoraciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="input w-auto"
            value={estadoFilter} 
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            {estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {filteredData.map((val) => (
          <div key={val.id} className={`card border-l-4 ${
            val.estado === 'publicada' ? 'border-green-500' :
            val.estado === 'pendiente' ? 'border-yellow-500' :
            val.estado === 'reportada' ? 'border-red-500' :
            'border-gray-500'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold">
                    {val.usuario.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{val.usuario}</p>
                    <p className="text-sm text-gray-400">{val.establecimiento} • {val.created_at}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">{'⭐'.repeat(val.puntuacion)}{'☆'.repeat(5-val.puntuacion)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    val.estado === 'publicada' ? 'bg-green-500/20 text-green-400' :
                    val.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                    val.estado === 'reportada' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {val.estado}
                  </span>
                </div>

                <p className="text-gray-300">{val.comentario}</p>
              </div>

              <div className="flex sm:flex-col gap-2">
                {(val.estado === 'pendiente' || val.estado === 'reportada') && (
                  <>
                    <button 
                      onClick={() => handleAprobar(val.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Aprobar
                    </button>
                    <button 
                      onClick={() => handleRechazar(val.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-4 h-4" /> Rechazar
                    </button>
                  </>
                )}
                {val.estado === 'publicada' && (
                  <button className="flex items-center gap-1 px-3 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors">
                    <Flag className="w-4 h-4" /> Reportar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
