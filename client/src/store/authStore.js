import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      // Actions
      login: (userData, token) => set({ user: userData, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'ecommerce-auth', // This name saves it to localStorage
    }
  )
);