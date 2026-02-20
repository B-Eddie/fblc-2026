import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id?: string;
  name: string;
  email: string;
}

interface Business {
  name: string;
  type: string;
  address: string;
}

interface UserOnboarding {
  userId: string;
  email: string;
  business: Business | null;
  simulationGoal: string | null;
  completedAt: number;
}

interface OnboardingState {
  user: User | null;
  business: Business | null;
  simulationGoal: string | null;
  isOnboarded: boolean;
  userOnboardings: Record<string, UserOnboarding>;
  setUser: (user: User) => void;
  setBusiness: (business: Business) => void;
  setSimulationGoal: (goal: string) => void;
  completeOnboarding: () => void;
  getUserOnboarding: (email: string) => UserOnboarding | null;
  setUserOnboarding: (email: string, data: UserOnboarding) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      user: null,
      business: null,
      simulationGoal: null,
      isOnboarded: false,
      userOnboardings: {},
      setUser: (user) => set({ user }),
      setBusiness: (business) => set({ business }),
      setSimulationGoal: (goal) => set({ simulationGoal: goal }),
      completeOnboarding: () => set({ isOnboarded: true }),
      getUserOnboarding: (email: string) => {
        const onboardings = get().userOnboardings;
        return onboardings[email] || null;
      },
      setUserOnboarding: (email: string, data: UserOnboarding) => {
        set((state) => ({
          userOnboardings: {
            ...state.userOnboardings,
            [email]: data,
          },
        }));
      },
      reset: () =>
        set({
          user: null,
          business: null,
          simulationGoal: null,
          isOnboarded: false,
        }),
    }),
    {
      name: "marketify-onboarding-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
