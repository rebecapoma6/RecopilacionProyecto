import { persist } from 'zustand/middleware'
import type { SessionUser } from "../interfaces/SessionUser"
import { create } from 'zustand'

interface AuthState {

sessionUser: SessionUser | null
  isAuthenticated: boolean
  setSession: (sessionUser: SessionUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sessionUser: null,
      isAuthenticated: false,
      setSession: (sessionUser) => set({ 
        sessionUser, 
        isAuthenticated: true 
      }),
      clearSession: () => set({ 
        sessionUser: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-v1', // Nombre de la clave en el localStorage
      version: 1,
      partialize: (state) => ({
        sessionUser: state.sessionUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  ) // <--- Aquí cerramos el persist
);