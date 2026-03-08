import { persist } from 'zustand/middleware'
import type { SessionUser } from "../interfaces/SessionUser"
import { create } from 'zustand'
import { createUserRepository } from '../database/repositories'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  sessionUser: SessionUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  user: User | null;
  setSession: (sessionUser: SessionUser, user: User) => void
  clearSession: () => void
}


const userRepository = createUserRepository();



export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sessionUser: null,
      isAuthenticated: false,
      isAdmin: false,
      user: null, 

      setSession: async (sessionUser,user) => {
        let isAdmin = false;

        if (sessionUser.profile?.id) {
          const { data: role } = await userRepository.fetchRole(sessionUser.profile.id);
          isAdmin = role === 'admin';
        }

        set({
          user,
          sessionUser,
          isAuthenticated: true,
          isAdmin
        });
      },



      clearSession: () => set({
        sessionUser: null,
        user: null,
        isAuthenticated: false,
        isAdmin: false
      }),
    }),
    {
      name: 'auth-v1', // Nombre de la clave en el localStorage
      version: 1,
      partialize: (state) => ({
        sessionUser: state.sessionUser,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  ) // <--- Aquí cerramos el persist
);