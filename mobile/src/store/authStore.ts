// =====================================================
// Store de Autenticación (Zustand)
// =====================================================

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido?: string;
  avatar_url?: string;
  rol: string;
}

interface AuthState {
  usuario: Usuario | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (idToken: string) => Promise<boolean>;
  register: (data: { email: string; password: string; nombre: string; apellido?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  updateProfile: (data: Partial<Usuario>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { usuario, accessToken, refreshToken } = response.data;
      
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      
      set({
        usuario,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al iniciar sesión',
        isLoading: false,
      });
      return false;
    }
  },

  loginWithGoogle: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/google', { idToken });
      const { usuario, accessToken, refreshToken } = response.data;
      
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      
      set({
        usuario,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al iniciar sesión con Google',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/registro', data);
      const { usuario, accessToken, refreshToken } = response.data;
      
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      
      set({
        usuario,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Error al registrarse',
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      const { refreshToken } = get();
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Ignorar errores de logout
    }
    
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    
    set({
      usuario: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  loadStoredAuth: async () => {
    set({ isLoading: true });
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (accessToken) {
        // Verificar token
        const response = await api.get('/auth/verificar', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        set({
          usuario: response.data.usuario,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      // Token inválido o expirado, intentar refresh
      const success = await get().refreshAccessToken();
      if (!success) {
        await get().logout();
      }
      set({ isLoading: false });
    }
  },

  refreshAccessToken: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) return false;
      
      const response = await api.post('/auth/refresh', { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      
      await SecureStore.setItemAsync('accessToken', newAccessToken);
      await SecureStore.setItemAsync('refreshToken', newRefreshToken);
      
      set({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      
      return true;
    } catch (error) {
      return false;
    }
  },

  updateProfile: (data) => {
    set((state) => ({
      usuario: state.usuario ? { ...state.usuario, ...data } : null,
    }));
  },

  clearError: () => set({ error: null }),
}));
