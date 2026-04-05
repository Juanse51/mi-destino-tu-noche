'use client'

import { useState, useEffect } from 'react'
import { Loader2, TrendingUp, Users, Star, Eye, Building2, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { authFetch } from '@/lib/auth'

const API_URL = 'https://mi-destino-api.onrender.com/api/v1'

export default function EstadisticasPage() {
  const [data, setData] = useState<any>(null)
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estRes, dashRes] = await Promise.all([
          authFetch(`${API_URL}/admin/estadisticas`),
          authFetch(`${API_URL}/admin/dashboard`)
        ])
        const estData = await estRes.json()
        const dashData = await dashRes.json()
        setData(estData)
        setDashboard(dashData)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  const stats = dashboard?.estadisticas || {}
  const resumen = data?.resumen || {}
  const totalVisitas = parseInt(String(data?.total_visitas || '0'))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Estadísticas</h1>
        <p className="text-gray-400">Métricas completas de la plataforma</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total visitas', value: totalVisitas.toLocaleString(), icon: Eye, color: 'bg-blue-500', sub: 'en todos los establecimientos' },
          { label: 'Establecimientos', value: parseInt(String(stats.total_establecimientos || 0)).toLocaleString(), icon: Building2, color: 'bg-orange-500', sub: `${resumen.activos} activos` },
          { label: 'Usuarios', value: parseInt(String(stats.total_usuarios || 0)).toLocaleString(), icon: Users, color: 'bg-green-500', sub: `+${stats.usuarios_nuevos} este mes` },
          { label: 'Valoraciones', value: parseInt(String(stats.total_valoraciones || 0)).toLocaleString(), icon: Star, color: 'bg-yellow-500', sub: `Promedio ⭐ ${parseFloat(stats.valoracion_promedio || 0).toFixed(1)}` },
        ].map((kpi) => (
          <div key={kpi.label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-lg ${kpi.color} flex-shrink-0`}>
              <kpi.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{kpi.label}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de estado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Verificados', value: resumen.verificados || 0, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Destacados', value: resumen.destacados || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Sedes principales', value: resumen.sedes_principales || 0, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Sedes alternas', value: resumen.sedes_alternas || 0, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((item) => (
          <div key={item.label} className={`card ${item.bg} text-center`}>
            <p className={`text-3xl font-bold ${item.color}`}>{parseInt(item.value).toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 por visitas */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top 10 más visitados
            </h2>
            <Link href="/dashboard/visitas" className="text-primary text-sm flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.top_visitas || []).map((est: any, i: number) => (
              <div key={est.slug} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-500 text-black' :
                  i === 1 ? 'bg-gray-400 text-black' :
                  i === 2 ? 'bg-orange-600 text-white' :
                  'bg-dark text-gray-400'
                }`}>{i + 1}</span>
                {est.logo_url || est.imagen_principal ? (
                  <img src={est.logo_url || est.imagen_principal} alt={est.nombre} className="w-8 h-8 rounded-lg object-contain bg-dark flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {est.nombre?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{est.nombre}</p>
                  <p className="text-xs text-gray-400">{est.ciudad_nombre} · {est.tipo_icono} {est.tipo_nombre}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-primary">{parseInt(est.total_visitas).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">visitas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por tipo */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Visitas por tipo</h2>
          <div className="space-y-4">
            {(data?.visitas_tipo || []).map((tipo: any) => {
              const maxVisitas = Math.max(...(data?.visitas_tipo || []).map((t: any) => parseInt(t.total_visitas)))
              const pct = maxVisitas > 0 ? Math.round((parseInt(tipo.total_visitas) / maxVisitas) * 100) : 0
              return (
                <div key={tipo.nombre}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{tipo.icono} {tipo.nombre}</span>
                    <span className="text-sm text-gray-400">{parseInt(tipo.total_visitas).toLocaleString()} visitas · {tipo.establecimientos} lugares</span>
                  </div>
                  <div className="h-2 bg-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: tipo.color || '#FF6B35' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Visitas por ciudad */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Visitas y establecimientos por ciudad
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                <th className="pb-3 font-medium">Ciudad</th>
                <th className="pb-3 font-medium text-right">Establecimientos</th>
                <th className="pb-3 font-medium text-right">Total visitas</th>
                <th className="pb-3 font-medium">Distribución</th>
              </tr>
            </thead>
            <tbody>
              {(data?.visitas_ciudad || []).map((ciudad: any) => {
                const maxV = Math.max(...(data?.visitas_ciudad || []).map((c: any) => parseInt(c.total_visitas || 0)))
                const pct = maxV > 0 ? Math.round((parseInt(ciudad.total_visitas || 0) / maxV) * 100) : 0
                return (
                  <tr key={ciudad.nombre} className="border-b border-gray-800/50">
                    <td className="py-3 font-medium">{ciudad.nombre}</td>
                    <td className="py-3 text-right text-gray-300">{ciudad.establecimientos}</td>
                    <td className="py-3 text-right font-bold text-primary">{parseInt(ciudad.total_visitas || 0).toLocaleString()}</td>
                    <td className="py-3 w-40">
                      <div className="h-2 bg-dark rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribución por tipo */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Distribución por tipo</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(dashboard?.por_tipo || []).map((tipo: any) => (
            <div key={tipo.nombre} className="text-center p-4 bg-dark rounded-xl">
              <div className="text-3xl mb-2">{tipo.icono}</div>
              <p className="text-2xl font-bold" style={{ color: tipo.color }}>{tipo.total}</p>
              <p className="text-sm text-gray-400">{tipo.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
