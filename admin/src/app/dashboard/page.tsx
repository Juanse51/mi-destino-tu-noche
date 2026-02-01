'use client'

import { useState } from 'react'
import { Store, Users, Star, Eye, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Datos de ejemplo
const stats = [
  { label: 'Establecimientos', value: '1,234', change: '+12%', up: true, icon: Store, color: 'bg-blue-500' },
  { label: 'Usuarios', value: '8,567', change: '+23%', up: true, icon: Users, color: 'bg-green-500' },
  { label: 'Valoraciones', value: '4,891', change: '+8%', up: true, icon: Star, color: 'bg-yellow-500' },
  { label: 'Visitas Hoy', value: '12,456', change: '-3%', up: false, icon: Eye, color: 'bg-purple-500' },
]

const recentEstablecimientos = [
  { id: 1, nombre: 'Andrés Carne de Res', ciudad: 'Bogotá', tipo: 'Restaurante', estado: 'activo' },
  { id: 2, nombre: 'La Octava', ciudad: 'Cali', tipo: 'Bar', estado: 'pendiente' },
  { id: 3, nombre: 'Café Velvet', ciudad: 'Armenia', tipo: 'Café', estado: 'activo' },
  { id: 4, nombre: 'Theatron', ciudad: 'Bogotá', tipo: 'Discoteca', estado: 'activo' },
  { id: 5, nombre: 'Carmen', ciudad: 'Medellín', tipo: 'Restaurante', estado: 'pendiente' },
]

const recentValoraciones = [
  { id: 1, usuario: 'María G.', establecimiento: 'Andrés Carne de Res', puntuacion: 5, estado: 'publicada' },
  { id: 2, usuario: 'Carlos R.', establecimiento: 'La Octava', puntuacion: 4, estado: 'pendiente' },
  { id: 3, usuario: 'Ana M.', establecimiento: 'Café Velvet', puntuacion: 5, estado: 'publicada' },
  { id: 4, usuario: 'Juan P.', establecimiento: 'Theatron', puntuacion: 3, estado: 'reportada' },
]

const ciudadesTop = [
  { nombre: 'Bogotá', establecimientos: 450, porcentaje: 36 },
  { nombre: 'Medellín', establecimientos: 320, porcentaje: 26 },
  { nombre: 'Cali', establecimientos: 180, porcentaje: 15 },
  { nombre: 'Cartagena', establecimientos: 150, porcentaje: 12 },
  { nombre: 'Barranquilla', establecimientos: 134, porcentaje: 11 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`flex items-center gap-1 text-sm ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
              {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Establecimientos */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Establecimientos Recientes</h2>
            <Link href="/dashboard/establecimientos" className="text-primary text-sm flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentEstablecimientos.map((est) => (
              <div key={est.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                <div>
                  <p className="font-medium">{est.nombre}</p>
                  <p className="text-sm text-gray-400">{est.ciudad} • {est.tipo}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  est.estado === 'activo' ? 'bg-green-500/20 text-green-400' :
                  est.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {est.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Valoraciones */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Valoraciones Recientes</h2>
            <Link href="/dashboard/valoraciones" className="text-primary text-sm flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentValoraciones.map((val) => (
              <div key={val.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {val.usuario.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{val.usuario}</p>
                    <p className="text-sm text-gray-400">{val.establecimiento}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">{'⭐'.repeat(val.puntuacion)}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    val.estado === 'publicada' ? 'bg-green-500/20 text-green-400' :
                    val.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {val.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ciudades Top */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Establecimientos por Ciudad</h2>
        <div className="space-y-4">
          {ciudadesTop.map((ciudad) => (
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
