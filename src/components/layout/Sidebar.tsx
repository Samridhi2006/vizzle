"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/client/utils";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Wand2,
  Shield,
  LayoutDashboard,
  Store,
  Package,
  BarChart2,
  Code2,
  LogOut,
  CreditCard,
  MessageCircle,
  Film,
  Images,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  accent?: "blue" | "indigo";
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "CREATE",
    items: [
      { href: "/dashboard/studio",        label: "Studio",        icon: Wand2 },
      { href: "/dashboard/motion-studio", label: "Motion Studio", icon: Film,   accent: "indigo" },
      { href: "/dashboard/creations",     label: "My Creations",  icon: Images, accent: "blue" },
    ],
  },
  {
    groupLabel: "MANAGE",
    items: [
      { href: "/dashboard",           label: "Overview",          icon: LayoutDashboard },
      { href: "/dashboard/stores",    label: "Stores",            icon: Store },
      { href: "/dashboard/products",  label: "Products",          icon: Package },
      { href: "/dashboard/analytics", label: "Analytics",         icon: BarChart2 },
      { href: "/dashboard/billing",   label: "Credits & Billing", icon: CreditCard },
      { href: "/dashboard/docs",      label: "Integration",       icon: Code2 },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  const groups: NavGroup[] = NAV_GROUPS.map((grp) => {
    if (grp.groupLabel === "MANAGE" && isAdmin) {
      return {
        ...grp,
        items: [...grp.items, { href: "/dashboard/admin", label: "Admin", icon: Shield }],
      };
    }
    return grp;
  });

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

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

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 max-w-[85vw] flex-col bg-white border-r border-brand-200 shadow-xl transition-transform duration-200 ease-in-out md:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo row */}
        <div className="flex h-16 shrink-0 items-center border-b border-brand-100 px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Vizzle"
            style={{ height: 32, width: "auto", maxWidth: 140 }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <span className="ml-2 text-lg font-bold text-gray-900 tracking-tight">Vizzle</span>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-brand-50 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {groups.map(({ groupLabel, items }) => (
            <div key={groupLabel}>
              <p className="px-3 mb-1.5 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                {groupLabel}
              </p>
              <div className="space-y-0.5">
                {items.map(({ href, label, icon: Icon, accent }) => {
                  const active =
                    href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMobileSidebar}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all min-h-[44px]",
                        active
                          ? accent === "indigo"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/20"
                            : accent === "blue"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                            : "bg-brand-100 text-brand-800 font-semibold"
                          : "text-gray-700 hover:bg-brand-50 hover:text-gray-900"
                      )}
                    >
                      <Icon
                        size={17}
                        className={
                          active
                            ? accent
                              ? "text-white"
                              : "text-brand-600"
                            : "text-gray-500"
                        }
                      />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sign out & WhatsApp */}
        <div className="border-t border-brand-100 px-3 py-3 space-y-1.5">
          <a
            href="https://wa.me/918310247975?text=Hi%20Vizzle%20Team%2C%20I%20need%20support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
          >
            <MessageCircle size={16} className="text-green-600" />
            WhatsApp Support
          </a>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-gray-900 transition-colors"
          >
            <LogOut size={16} className="text-gray-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Collapse tab (desktop only) */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Collapse sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed left-64 top-1/2 z-50 hidden -translate-y-1/2 md:flex h-8 w-5 items-center justify-center rounded-r-lg border border-l-0 border-brand-200 bg-white text-brand-600 shadow-sm hover:bg-brand-50 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
      )}

      {/* Expand tab (left edge when sidebar is closed) */}
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
