"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/client/utils";

// ─── DEV BYPASS ──────────────────────────────────────────────────────────────
// In development, skip auth so you can work on the UI without a real DB/login.
// Remove this flag (or set to false) before deploying.
const DEV_BYPASS_AUTH = process.env.NODE_ENV === "development";
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  const [hydrated, setHydrated] = useState(DEV_BYPASS_AUTH); // skip wait in dev

  useEffect(() => {
    if (DEV_BYPASS_AUTH) return; // no auth needed in dev
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (DEV_BYPASS_AUTH) return; // skip redirect in dev
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

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
