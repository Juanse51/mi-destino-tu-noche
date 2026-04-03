'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Mail, Lock, Eye, EyeOff, ChevronLeft, User } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    await signIn('google', { callbackUrl: '/' })
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

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {googleLoading ? (
              <span className="text-gray-600">Conectando...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continuar con Google
              </>
            )}
          </button>

          {/* Separador */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-sm">o continúa con email</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

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
