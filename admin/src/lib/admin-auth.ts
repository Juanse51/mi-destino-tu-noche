const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

// Fetch con auto-refresh de token
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('admin_token')
  
  if (!token) {
    window.location.href = '/'
    throw new Error('No token')
  }

  // Agregar token al header
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
    'Authorization': `Bearer ${token}`,
  }

  // Si no es FormData, agregar Content-Type
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  let res = await fetch(url, { ...options, headers })

  // Si el token expiró, intentar refrescar
  if (res.status === 401) {
    const refreshed = await refreshToken()
    if (refreshed) {
      // Reintentar con el nuevo token
      const newToken = localStorage.getItem('admin_token')
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(url, { ...options, headers })
    } else {
      // No se pudo refrescar, enviar al login
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_refresh_token')
      window.location.href = '/'
      throw new Error('Session expired')
    }
  }

  return res
}

// Refrescar el access token usando el refresh token
async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('admin_refresh_token')
  
  if (!refreshToken) {
    return false
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    if (!res.ok) return false

    const data = await res.json()
    const newToken = data.accessToken || data.token
    
    if (newToken) {
      localStorage.setItem('admin_token', newToken)
      // Si devuelve un nuevo refresh token, actualizarlo
      if (data.refreshToken) {
        localStorage.setItem('admin_refresh_token', data.refreshToken)
      }
      return true
    }

    return false
  } catch {
    return false
  }
}

// Logout
export function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  localStorage.removeItem('admin_refresh_token')
  window.location.href = '/'
}
