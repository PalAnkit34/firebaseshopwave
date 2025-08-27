'use client'
import create from 'zustand'
import Cookies from 'js-cookie'
import api from './api'

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data.user, token: data.token, isLoading: false });
      Cookies.set('token', data.token, { expires: 7 }); // expires in 7 days
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed.";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register', { fullName, email, password });
      // Automatically log in after successful registration
      return await get().login(email, password);
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed.";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: () => {
    set({ user: null, token: null });
    Cookies.remove('token');
  },

  checkAuth: async () => {
    const token = Cookies.get('token');
    if (token && !get().user) {
      try {
        const { data } = await api.get('/auth/me');
        set({ user: data.user, token });
      } catch (error) {
        get().logout();
      }
    }
  }
}));

// Initialize auth state on app load
if (typeof window !== 'undefined') {
  useAuth.getState().checkAuth();
}
