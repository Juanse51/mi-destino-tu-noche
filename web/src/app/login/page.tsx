'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ChevronLeft, User } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/registro'
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, nombre: formData.nombre, apellido: formData.apellido }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        if (isLogin) {
          // Store token and redirect
          localStorage.setItem('token', data.accessToken || data.token)
          localStorage.setItem('user', JSON.stringify(data.usuario || data.user))
          window.location.href = '/'
        } else {
          setSuccess('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.')
          setIsLogin(true)
          setFormData({ ...formData, password: '' })
        }
      } else {
        setError(data.error || data.message || 'Error al procesar la solicitud')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver al inicio
        </Link>

        <div className="bg-dark-lighter rounded-2xl p-8 border border-gray-800/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{isLogin ? '👋' : '🎉'}</div>
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? 'Ingresa a tu cuenta para guardar favoritos y más'
                : 'Únete a Mi Destino Tu Noche'}
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Nombre</label>
                  <div className="flex items-center bg-dark rounded-xl px-4 py-3 border border-gray-700/50 focus-within:border-primary/50">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Tu nombre"
                      className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                      value={formData.nombre}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Apellido</label>
                  <div className="flex items-center bg-dark rounded-xl px-4 py-3 border border-gray-700/50 focus-within:border-primary/50">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Tu apellido"
                      className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                      value={formData.apellido}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Correo electrónico</label>
              <div className="flex items-center bg-dark rounded-xl px-4 py-3 border border-gray-700/50 focus-within:border-primary/50">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Contraseña</label>
              <div className="flex items-center bg-dark rounded-xl px-4 py-3 border border-gray-700/50 focus-within:border-primary/50">
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6 text-sm text-gray-400">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }}
              className="text-primary hover:text-primary-light font-medium transition-colors"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
