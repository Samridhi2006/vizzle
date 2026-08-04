"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AuthUser } from "@/types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAdmin: boolean;
  _hydrated: boolean;
  setSession: (session: {
    token: string;
    user?: AuthUser | null;
    isAdmin?: boolean;
  }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAdmin: false,
      _hydrated: false,
      setSession: ({ token, user, isAdmin }) => {
        localStorage.setItem("vizzle_token", token);
        set({ token, user: user ?? null, isAdmin: Boolean(isAdmin) });
      },
      clearSession: () => {
        localStorage.removeItem("vizzle_token");
        set({ token: null, user: null, isAdmin: false });
      },
    }),
    {
      name: "vizzle-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    }
  )
);
