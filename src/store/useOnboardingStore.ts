import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
}

interface Business {
  name: string;
  type: string;
  address: string;
}

interface OnboardingState {
  user: User | null;
  business: Business | null;
  simulationGoal: string | null;
  isOnboarded: boolean;
  setUser: (user: User) => void;
  setBusiness: (business: Business) => void;
  setSimulationGoal: (goal: string) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      user: null,
      business: null,
      simulationGoal: null,
      isOnboarded: false,
      setUser: (user) => set({ user }),
      setBusiness: (business) => set({ business }),
      setSimulationGoal: (goal) => set({ simulationGoal: goal }),
      completeOnboarding: () => set({ isOnboarded: true }),
      reset: () => set({ user: null, business: null, simulationGoal: null, isOnboarded: false }),
    }),
    {
      name: 'marketify-onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
