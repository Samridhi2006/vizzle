"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/client/utils";
import {
  ChevronLeft, ChevronRight, X,
  Shield, LayoutDashboard, Store, Package, BarChart2, Code2, LogOut, CreditCard, MessageCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";

const NAV = [
  { href: "/dashboard",           label: "Overview",          icon: LayoutDashboard },
  { href: "/dashboard/stores",    label: "Stores",            icon: Store },
  { href: "/dashboard/products",  label: "Products",          icon: Package },
  { href: "/dashboard/analytics", label: "Analytics",         icon: BarChart2 },
  { href: "/dashboard/billing",   label: "Credits & Billing", icon: CreditCard },
  { href: "/dashboard/docs",      label: "Integration",       icon: Code2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  const allNav = [...NAV, ...(isAdmin ? [{ href: "/dashboard/admin", label: "Admin", icon: Shield }] : [])];

  function handleLogout() { clearSession(); router.push("/login"); }

  function closeMobileSidebar() {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setSidebarOpen(false);
    }
  }

  return (
    <>
      {/* Mobile backdrop — tap outside to close */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* ── Sidebar panel ─────────────────────────────────────── */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-60 max-w-[85vw] flex-col bg-white border-r border-brand-200 shadow-xl transition-transform duration-200 ease-in-out md:shadow-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>

        {/* Logo row */}
        <div className="flex h-14 shrink-0 items-center border-b border-brand-100 px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vizzle" style={{ height: 32, width: "auto", maxWidth: 140 }} />
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-brand-50 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {allNav.map(({ href, label, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobileSidebar}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-100 text-brand-800 font-semibold"
                    : "text-gray-700 hover:bg-brand-50 hover:text-gray-900"
                )}
              >
                <Icon size={16} className={active ? "text-brand-600" : "text-gray-500"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="border-t border-brand-100 px-3 py-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-gray-900 transition-colors"
          >
            <LogOut size={16} className="text-gray-400" />
            Sign out
          </button>

          {/* WhatsApp support */}
          <a
            href="https://wa.me/918310247975?text=Hi%20Vizzle%20Team%2C%20I%20need%20support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors mt-2"
          >
            <MessageCircle size={16} className="text-green-600" />
            WhatsApp Support
          </a>
        </div>
      </aside>

      {/* ── Collapse tab (desktop only) */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Collapse sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed left-60 top-1/2 z-50 hidden -translate-y-1/2 md:flex h-8 w-5 items-center justify-center rounded-r-lg border border-l-0 border-brand-200 bg-white text-brand-600 shadow-sm hover:bg-brand-50 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
      )}

      {/* ── Expand tab (left edge when sidebar is closed) */}
      {!sidebarOpen && (
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 z-50 -translate-y-1/2 flex h-10 w-6 items-center justify-center rounded-r-lg border border-l-0 border-brand-200 bg-white text-brand-600 shadow-sm hover:bg-brand-50 transition-colors md:h-8 md:w-5"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </>
  );
}
