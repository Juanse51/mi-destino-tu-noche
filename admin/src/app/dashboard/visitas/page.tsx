'use client'

import { useState, useEffect } from 'react'
import { Loader2, Eye, MessageCircle, Phone, Instagram, Navigation, Globe } from 'lucide-react'
import { authFetch } from '@/lib/auth'

const API_URL = 'https://mi-destino-api.onrender.com/api/v1'

export default function VisitasPage() {
  const [establecimientos, setEstablecimientos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch(`${API_URL}/admin/visitas?limite=500`)
        const data = await res.json()
        setEstablecimientos(data.establecimientos || [])
        setTotal(data.total || 0)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtrados = establecimientos.filter(e =>
    !search || e.nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Visitas y Clicks</h1>
        <p className="text-gray-400">{total} establecimientos · ordenados por visitas</p>
      </div>

      <input
        type="text"
        className="input w-full max-w-md"
        placeholder="Buscar establecimiento..."
        value={search}
        onChange={e => { setSearch(e.target.value); setVisibleCount(20) }}
      />

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-gray-800">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Establecimiento</th>
                <th className="pb-3 font-medium text-center">
                  <Eye className="w-4 h-4 inline" /> Visitas
                </th>
                <th className="pb-3 font-medium text-center">
                  <MessageCircle className="w-4 h-4 inline text-green-400" /> WA
                </th>
                <th className="pb-3 font-medium text-center">
                  <Phone className="w-4 h-4 inline text-blue-400" /> Tel
                </th>
                <th className="pb-3 font-medium text-center">
                  <Instagram className="w-4 h-4 inline text-pink-400" /> IG
                </th>
                <th className="pb-3 font-medium text-center">
                  <Navigation className="w-4 h-4 inline text-yellow-400" /> Mapa
                </th>
                <th className="pb-3 font-medium text-center">
                  <Globe className="w-4 h-4 inline text-purple-400" /> Web
                </th>
                <th className="pb-3 font-medium text-center">Total clicks</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.slice(0, visibleCount).map((est, i) => (
                <tr key={est.id} className="border-b border-gray-800/50 hover:bg-dark/50">
                  <td className="py-3 text-gray-500 text-sm">{i + 1}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {est.logo_url || est.imagen_principal ? (
                        <img src={est.logo_url || est.imagen_principal} className="w-8 h-8 rounded-lg object-contain bg-dark" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {est.nombre?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm truncate max-w-[180px]">{est.nombre}</p>
                        <p className="text-xs text-gray-400">{est.ciudad_nombre} · {est.tipo_icono} {est.tipo_nombre}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center font-bold text-primary">{parseInt(est.total_visitas || 0).toLocaleString()}</td>
                  <td className="py-3 text-center text-green-400">{est.clicks_whatsapp || 0}</td>
                  <td className="py-3 text-center text-blue-400">{est.clicks_llamar || 0}</td>
                  <td className="py-3 text-center text-pink-400">{est.clicks_instagram || 0}</td>
                  <td className="py-3 text-center text-yellow-400">{est.clicks_como_llegar || 0}</td>
                  <td className="py-3 text-center text-purple-400">{est.clicks_sitio_web || 0}</td>
                  <td className="py-3 text-center font-bold">{parseInt(est.total_clicks || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleCount < filtrados.length && (
            <div className="text-center pt-4">
              <button onClick={() => setVisibleCount(v => v + 20)} className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-dark text-sm">
                Ver más ({filtrados.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
