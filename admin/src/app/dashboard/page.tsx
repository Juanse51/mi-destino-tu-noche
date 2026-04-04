'use client'

import { useState, useEffect } from 'react'
import { Store, Users, Star, MapPin, ArrowRight, Loader2, CheckCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { authFetch } from '@/lib/auth'

const API_URL = 'https://mi-destino-api.onrender.com/api/v1'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch(`${API_URL}/admin/dashboard`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Error cargando dashboard:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = data?.estadisticas || {}
  const porCiudad = data?.por_ciudad || []
  const porTipo = data?.por_tipo || []
  const actividad = data?.actividad_reciente || []
  const totalCiudad = porCiudad.reduce((s: number, c: any) => s + parseInt(c.total), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Panel de administración en tiempo real</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500"><Store className="w-6 h-6 text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">Establecimientos</p>
            <p className="text-2xl font-bold">{parseInt(stats.total_establecimientos || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500">{stats.verificados} verificados</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-500"><Users className="w-6 h-6 text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">Usuarios</p>
            <p className="text-2xl font-bold">{parseInt(stats.total_usuarios || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500">+{stats.usuarios_nuevos} este mes</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-yellow-500"><Star className="w-6 h-6 text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">Valoraciones</p>
            <p className="text-2xl font-bold">{parseInt(stats.total_valoraciones || 0).toLocaleString()}</p>
            <p className="text-xs text-yellow-400">{stats.valoraciones_pendientes} pendientes</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-500"><MapPin className="w-6 h-6 text-white" /></div>
          <div>
            <p className="text-gray-400 text-sm">Ciudades</p>
            <p className="text-2xl font-bold">{parseInt(stats.total_ciudades || 0)}</p>
            <p className="text-xs text-gray-500">Promedio ⭐ {parseFloat(stats.valoracion_promedio || 0).toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Actividad Reciente</h2>
            <Link href="/dashboard/establecimientos" className="text-primary text-sm flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {actividad.length > 0 ? actividad.slice(0, 6).map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-dark rounded-lg">
                <div className={`p-2 rounded-lg ${
                  item.tipo === 'establecimiento' ? 'bg-blue-500/20' :
                  item.tipo === 'valoracion' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                }`}>
                  {item.tipo === 'establecimiento' ? <Store className="w-4 h-4 text-blue-400" /> :
                   item.tipo === 'valoracion' ? <Star className="w-4 h-4 text-yellow-400" /> :
                   <Users className="w-4 h-4 text-green-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.titulo}</p>
                  <p className="text-xs text-gray-400">{item.tipo} • {new Date(item.fecha).toLocaleDateString('es-CO')}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-sm text-center py-4">Sin actividad reciente</p>
            )}
          </div>
        </div>

        {/* Por Tipo */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Por Tipo de Establecimiento</h2>
          <div className="space-y-3">
            {porTipo.length > 0 ? porTipo.map((tipo: any) => (
              <div key={tipo.nombre} className="flex items-center gap-3 p-3 bg-dark rounded-lg">
                <span className="text-2xl">{tipo.icono}</span>
                <div className="flex-1">
                  <p className="font-medium">{tipo.nombre}</p>
                </div>
                <span className="text-lg font-bold text-primary">{tipo.total}</span>
              </div>
            )) : (
              <p className="text-gray-400 text-sm text-center py-4">Sin datos</p>
            )}
          </div>
        </div>
      </div>

      {/* Ciudades Top */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Establecimientos por Ciudad</h2>
          <Link href="/dashboard/ciudades" className="text-primary text-sm flex items-center gap-1 hover:underline">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {porCiudad.slice(0, 8).map((ciudad: any) => {
            const pct = totalCiudad > 0 ? Math.round((parseInt(ciudad.total) / totalCiudad) * 100) : 0
            return (
              <div key={ciudad.nombre}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{ciudad.nombre}</span>
                  <span className="text-sm text-gray-400">{ciudad.total} ({pct}%)</span>
                </div>
                <div className="h-2 bg-dark rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
