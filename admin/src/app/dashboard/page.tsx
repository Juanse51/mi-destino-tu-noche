'use client'

import { useState, useEffect } from 'react'
import { Store, Users, Star, Eye, TrendingUp, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { authFetch } from '@/lib/auth'

const API_URL = 'https://mi-destino-api.onrender.com/api/v1'

export default function DashboardPage() {
  const [stats, setStats] = useState({ establecimientos: 0, usuarios: 0, valoraciones: 0, ciudades: 0 })
  const [recentEst, setRecentEst] = useState<any[]>([])
  const [recentVal, setRecentVal] = useState<any[]>([])
  const [ciudades, setCiudades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Establecimientos
        const estRes = await authFetch(`${API_URL}/establecimientos?limite=300`)
        const estData = await estRes.json()
        const todosEst = estData.establecimientos || []

        // Usuarios
        const usrRes = await authFetch(`${API_URL}/admin/usuarios?limite=1`)
        const usrData = await usrRes.json()

        // Valoraciones recientes
        const valRes = await authFetch(`${API_URL}/admin/valoraciones?limite=5`)
        const valData = await valRes.json()

        // Ciudades
        const ciudRes = await fetch(`${API_URL}/ciudades`)
        const ciudData = await ciudRes.json()

        // Stats
        setStats({
          establecimientos: estData.total || todosEst.length,
          usuarios: usrData.total || 0,
          valoraciones: valData.total || 0,
          ciudades: Array.isArray(ciudData) ? ciudData.length : 0,
        })

        // Recientes
        setRecentEst(todosEst.slice(0, 5))
        setRecentVal(valData.valoraciones || [])

        // Ciudades con conteo
        if (Array.isArray(ciudData)) {
          const ciudadesConConteo = ciudData.map((c: any) => {
            const count = todosEst.filter((e: any) => e.ciudad_nombre === c.nombre).length
            return { nombre: c.nombre, count }
          }).filter((c: any) => c.count > 0)
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 5)
          const total = ciudadesConConteo.reduce((s: number, c: any) => s + c.count, 0)
          setCiudades(ciudadesConConteo.map((c: any) => ({
            ...c,
            porcentaje: Math.round((c.count / total) * 100)
          })))
        }
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
          <div><p className="text-gray-400 text-sm">Establecimientos</p><p className="text-2xl font-bold">{stats.establecimientos.toLocaleString()}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-500"><Users className="w-6 h-6 text-white" /></div>
          <div><p className="text-gray-400 text-sm">Usuarios</p><p className="text-2xl font-bold">{stats.usuarios.toLocaleString()}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-yellow-500"><Star className="w-6 h-6 text-white" /></div>
          <div><p className="text-gray-400 text-sm">Valoraciones</p><p className="text-2xl font-bold">{stats.valoraciones.toLocaleString()}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-500"><Eye className="w-6 h-6 text-white" /></div>
          <div><p className="text-gray-400 text-sm">Ciudades</p><p className="text-2xl font-bold">{stats.ciudades}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Establecimientos Recientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Establecimientos Recientes</h2>
            <Link href="/dashboard/establecimientos" className="text-primary text-sm flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentEst.length > 0 ? recentEst.map((est: any) => (
              <div key={est.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                <div>
                  <p className="font-medium">{est.nombre}</p>
                  <p className="text-sm text-gray-400">{est.ciudad_nombre} • {est.tipo_nombre || 'Sin tipo'}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  est.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {est.activo ? 'activo' : 'inactivo'}
                </span>
              </div>
            )) : (
              <p className="text-gray-400 text-sm text-center py-4">No hay establecimientos</p>
            )}
          </div>
        </div>

        {/* Valoraciones Recientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Valoraciones Recientes</h2>
            <Link href="/dashboard/valoraciones" className="text-primary text-sm flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentVal.length > 0 ? recentVal.map((val: any) => (
              <div key={val.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {(val.usuario_nombre || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{val.usuario_nombre || 'Usuario'}</p>
                    <p className="text-sm text-gray-400">{val.establecimiento_nombre || ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-sm">{'⭐'.repeat(val.puntuacion || 0)}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    val.estado === 'publicada' ? 'bg-green-500/20 text-green-400' :
                    val.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {val.estado}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-sm text-center py-4">No hay valoraciones aún</p>
            )}
          </div>
        </div>
      </div>

      {/* Ciudades Top */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Establecimientos por Ciudad</h2>
        <div className="space-y-4">
          {ciudades.map((ciudad: any) => (
            <div key={ciudad.nombre}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{ciudad.nombre}</span>
                <span className="text-sm text-gray-400">{ciudad.count} ({ciudad.porcentaje}%)</span>
              </div>
              <div className="h-2 bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${ciudad.porcentaje}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
