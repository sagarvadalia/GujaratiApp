import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage,persist } from 'zustand/middleware';

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
  setUser: (user: User | null) => void;
  setGuestMode: (isGuest: boolean) => void;
  setOnboardingComplete: (completed: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      hasCompletedOnboarding: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isGuest: false,
        }),
      setGuestMode: (isGuest) =>
        set({
          isGuest,
          isAuthenticated: false,
          user: null,
        }),
      setOnboardingComplete: (completed) =>
        set({ hasCompletedOnboarding: completed }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

