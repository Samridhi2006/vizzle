"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-brand-50">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-[margin] duration-200",
          sidebarOpen ? "ml-60" : "ml-0"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-7 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
