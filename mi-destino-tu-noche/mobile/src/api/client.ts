// =====================================================
// Cliente API (Axios)
// =====================================================
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { accessToken: newToken, refreshToken: newRefresh } = response.data;
          
          await SecureStore.setItemAsync('accessToken', newToken);
          await SecureStore.setItemAsync('refreshToken', newRefresh);
          
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

// =====================================================
// API Endpoints
// =====================================================
export const establecimientosApi = {
  getAll: (params?: any) => api.get('/establecimientos', { params }),
  getDestacados: (params?: any) => api.get('/establecimientos/destacados', { params }),
  getCercanos: (params: { latitud: number; longitud: number; radio?: number }) => 
    api.get('/establecimientos/cercanos', { params }),
  getBySlug: (slug: string) => api.get(`/establecimientos/${slug}`),
  getByCategoria: (slug: string, params?: any) => 
    api.get(`/establecimientos/categoria/${slug}`, { params }),
};

export const ciudadesApi = {
  getAll: () => api.get('/ciudades'),
  getBySlug: (slug: string) => api.get(`/ciudades/${slug}`),
};

export const categoriasApi = {
  getEspeciales: () => api.get('/categorias/especiales'),
  getTipos: () => api.get('/categorias/tipos'),
  getTiposComida: () => api.get('/categorias/tipos-comida'),
};

export const etiquetasApi = {
  getAll: () => api.get('/etiquetas'),
};

export const valoracionesApi = {
  getByEstablecimiento: (establecimientoId: string, params?: any) => 
    api.get(`/valoraciones/establecimiento/${establecimientoId}`, { params }),
  crear: (data: any) => api.post('/valoraciones', data),
  actualizar: (id: string, data: any) => api.put(`/valoraciones/${id}`, data),
  eliminar: (id: string) => api.delete(`/valoraciones/${id}`),
  marcarUtil: (id: string) => api.post(`/valoraciones/${id}/util`),
};

export const favoritosApi = {
  getAll: () => api.get('/favoritos'),
  toggle: (establecimientoId: string) => 
    api.post(`/favoritos/${establecimientoId}/toggle`),
};

export const quieroIrApi = {
  getAll: () => api.get('/quiero-ir'),
  toggle: (establecimientoId: string) => 
    api.post(`/quiero-ir/${establecimientoId}/toggle`),
  agregar: (establecimientoId: string, data?: { nota?: string; prioridad?: number }) =>
    api.post(`/quiero-ir/${establecimientoId}`, data),
};

export const historialApi = {
  getAll: (params?: any) => api.get('/historial', { params }),
  checkIn: (establecimientoId: string, notas?: string) => 
    api.post(`/historial/check-in/${establecimientoId}`, { notas }),
  limpiar: () => api.delete('/historial'),
};

export const usuariosApi = {
  getPerfil: () => api.get('/usuarios/perfil'),
  actualizarPerfil: (data: any) => api.put('/usuarios/perfil', data),
  actualizarAvatar: (avatar_url: string) => api.put('/usuarios/avatar', { avatar_url }),
  cambiarPassword: (data: { password_actual: string; password_nuevo: string }) =>
    api.put('/usuarios/password', data),
  getValoraciones: (params?: any) => api.get('/usuarios/valoraciones', { params }),
};

export const bannersApi = {
  getAll: (params?: { ubicacion?: string; ciudad?: string }) => 
    api.get('/banners', { params }),
  registrarClic: (id: string) => api.post(`/banners/${id}/clic`),
};

export const notificacionesApi = {
  getAll: (params?: any) => api.get('/notificaciones', { params }),
  marcarLeida: (id: string) => api.put(`/notificaciones/${id}/leer`),
  marcarTodasLeidas: () => api.put('/notificaciones/leer-todas'),
};

export const uploadApi = {
  subirImagen: (formData: FormData) => api.post('/upload/imagen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
