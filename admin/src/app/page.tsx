'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Demo: admin@demo.com / admin123
    if (email === 'admin@demo.com' && password === 'admin123') {
      localStorage.setItem('admin_token', 'demo_token_123')
      localStorage.setItem('admin_user', JSON.stringify({ nombre: 'Administrador', email, rol: 'admin' }))
      router.push('/dashboard')
    } else {
      setError('Credenciales incorrectas. Usa: admin@demo.com / admin123')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌙</div>
          <h1 className="text-3xl font-bold">Mi Destino Tu Noche</h1>
          <p className="text-gray-400 mt-2">Panel de Administración</p>
        </div>

        <div className="card">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="admin@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-dark rounded-lg">
            <p className="text-sm text-gray-400 text-center">
              <strong>Demo:</strong> admin@demo.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
