"use client";

import { create } from "zustand";

export type ToastTone = "success" | "info" | "warning" | "error";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
}

interface UIState {
  sidebarOpen: boolean;
  toasts: ToastItem[];
  setSidebarOpen: (isOpen: boolean) => void;
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toasts: [],
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: `${Date.now()}-${Math.random()}`, ...toast },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
