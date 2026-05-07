"use client";

import { create } from "zustand";
import { Store } from "@/types";

interface StoresState {
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
}

export const useStoresStore = create<StoresState>((set) => ({
  selectedStore: null,
  setSelectedStore: (store) => set({ selectedStore: store }),
}));
