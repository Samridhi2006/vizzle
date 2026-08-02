"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/client/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  // Wait for Zustand persist to hydrate from localStorage before checking auth.
  // Without this, `token` is null on the first render (SSR/hydration),
  // causing an immediate redirect to /login even when the user IS logged in.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Zustand's persist rehydrates synchronously on the client in a microtask.
    // Deferring by one tick ensures the store is populated before we check.
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // If already hydrated (e.g. navigating between pages), resolve immediately
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => unsub();
  }, []);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  // Render nothing until hydration is complete to avoid flash
  if (!hydrated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-brand-50">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-[margin] duration-200",
          sidebarOpen ? "md:ml-60" : "ml-0"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-7 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
