'use client'

import { useState, useEffect } from 'react'
import { Store, Users, Star, MapPin, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { authFetch } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [totalEst, setTotalEst] = useState(0)
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [totalValoraciones, setTotalValoraciones] = useState(0)
  const [ciudadesData, setCiudadesData] = useState<{ nombre: string; establecimientos: number; porcentaje: number }[]>([])
  const [recentEst, setRecentEst] = useState<any[]>([])
  const [tiposCounts, setTiposCounts] = useState<{ tipo: string; count: number }[]>([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Obtener ciudades con conteo
        const ciudadesRes = await fetch(`${API_URL}/ciudades?todas=true`)
        if (ciudadesRes.ok) {
          const ciudades = await ciudadesRes.json()
          const total = ciudades.reduce((sum: number, c: any) => sum + (Number(c.total_establecimientos) || 0), 0)
          setTotalEst(total)

          const sorted = ciudades
            .filter((c: any) => (Number(c.total_establecimientos) || 0) > 0)
            .sort((a: any, b: any) => (Number(b.total_establecimientos) || 0) - (Number(a.total_establecimientos) || 0))
            .map((c: any) => ({
              nombre: c.nombre,
              establecimientos: Number(c.total_establecimientos) || 0,
              porcentaje: total > 0 ? Math.round(((Number(c.total_establecimientos) || 0) / total) * 100) : 0
            }))

          setCiudadesData(sorted)
        }

        // Obtener establecimientos recientes (últimos 10)
        const estRes = await authFetch(`${API_URL}/establecimientos?limite=10&pagina=1`)
        if (estRes.ok) {
          const estData = await estRes.json()
          const items = estData.establecimientos || []
          setRecentEst(items)

          // Contar por tipo
          const allEstRes = await authFetch(`${API_URL}/establecimientos?limite=100&pagina=1`)
          if (allEstRes.ok) {
            const allData = await allEstRes.json()
            const allItems = allData.establecimientos || []
            const tipos: Record<string, number> = {}
            allItems.forEach((e: any) => {
              const t = e.tipo_nombre || 'Otro'
              tipos[t] = (tipos[t] || 0) + 1
            })
            setTiposCounts(Object.entries(tipos).map(([tipo, count]) => ({ tipo, count })).sort((a, b) => b.count - a.count))
          }
        }

        // Intentar obtener usuarios
        try {
          const usersRes = await authFetch(`${API_URL}/usuarios?limite=1`)
          if (usersRes.ok) {
            const usersData = await usersRes.json()
            setTotalUsuarios(usersData.total || usersData.usuarios?.length || 0)
          }
        } catch { }

      } catch (err) {
        console.error('Error cargando dashboard:', err)
      }
      setLoading(false)
    }

    fetchAll()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const stats = [
    { label: 'Establecimientos', value: totalEst.toLocaleString(), icon: Store, color: 'bg-blue-500' },
    { label: 'Ciudades', value: ciudadesData.length.toString(), icon: MapPin, color: 'bg-green-500' },
    { label: 'Tipos', value: tiposCounts.length.toString(), icon: Star, color: 'bg-yellow-500' },
    { label: 'Usuarios', value: totalUsuarios.toLocaleString(), icon: Users, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Panel de administración — Mi Destino Tu Noche</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
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
            {recentEst.length > 0 ? recentEst.slice(0, 8).map((est: any) => (
              <div key={est.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                <div className="flex items-center gap-3">
                  {est.imagen_principal && (
                    <img src={est.imagen_principal} alt="" className="w-8 h-8 rounded object-cover bg-dark-lighter" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{est.nombre}</p>
                    <p className="text-xs text-gray-400">{est.ciudad_nombre} • {est.tipo_nombre}</p>
                  </div>
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

        {/* Por Tipo */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Establecimientos por Tipo</h2>
          <div className="space-y-4">
            {tiposCounts.map((t) => (
              <div key={t.tipo}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{t.tipo}</span>
                  <span className="text-sm text-gray-400">{t.count}</span>
                </div>
                <div className="h-2 bg-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${totalEst > 0 ? Math.round((t.count / totalEst) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ciudades */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Establecimientos por Ciudad</h2>
        <div className="space-y-4">
          {ciudadesData.map((ciudad) => (
            <div key={ciudad.nombre}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{ciudad.nombre}</span>
                <span className="text-sm text-gray-400">{ciudad.establecimientos} ({ciudad.porcentaje}%)</span>
              </div>
              <div className="h-2 bg-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${ciudad.porcentaje}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
