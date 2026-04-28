import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth';
import { getToken } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login({ email, password });
      set({ user: response?.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao fazer login', isLoading: false });
      throw error;
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.signup({ name, email, password });
      set({ user: response?.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Erro ao criar conta', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, error: null });
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  },

  loadUser: async () => {
    try {
      const token = await getToken();
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      
      const response = await authService.getMe();
      set({ user: response?.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      console.error('Load user error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (user: User) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}));
