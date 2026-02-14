'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ChevronLeft, LogIn } from 'lucide-react'
import EstablecimientoCard from '@/components/EstablecimientoCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoggedIn(false)
      setLoading(false)
      return
    }

    setIsLoggedIn(true)

    const fetchFavoritos = async () => {
      try {
        const res = await fetch(`${API_URL}/favoritos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setFavoritos(data.favoritos || data || [])
        } else if (res.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setIsLoggedIn(false)
        }
      } catch (err) {
        console.error('Error cargando favoritos:', err)
      }
      setLoading(false)
    }
    fetchFavoritos()
  }, [])

  // Not logged in
  if (!loading && !isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Mis Favoritos</h1>
          <p className="text-gray-400 mb-8">
            Inicia sesión para guardar tus restaurantes y bares favoritos
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark px-8 py-3.5 rounded-xl font-semibold transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Iniciar Sesión
          </Link>
          <div className="mt-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver al inicio
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gradient">Mis Favoritos</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {favoritos.length > 0 
              ? `${favoritos.length} lugares guardados` 
              : 'Tus lugares favoritos aparecerán aquí'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-400">Cargando favoritos...</p>
          </div>
        ) : favoritos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritos.map((fav) => {
              const est = fav.establecimiento || fav
              return <EstablecimientoCard key={est.id} establecimiento={est} />
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold mb-2">No tienes favoritos aún</h2>
            <p className="text-gray-400 mb-6">Explora y guarda los lugares que más te gusten</p>
            <Link href="/buscar" className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-xl font-medium transition-colors">
              Explorar lugares
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
