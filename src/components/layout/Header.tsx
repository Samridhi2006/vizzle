"use client";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

const titles: Record<string, { title: string; sub: string }> = {
  "/dashboard":               { title: "Overview",            sub: "Welcome back" },
  "/dashboard/studio":        { title: "AI Studio",           sub: "Create catalogue images with virtual try-on" },
  "/dashboard/motion-studio": { title: "Motion Studio",       sub: "Generate cinematic AI fashion videos" },
  "/dashboard/creations":     { title: "My Creations",        sub: "View and manage generated catalogues and videos" },
  "/dashboard/stores":        { title: "Stores",              sub: "Manage your storefronts and API keys" },
  "/dashboard/products":      { title: "Products",            sub: "Manage your garment catalog" },
  "/dashboard/analytics":     { title: "Analytics",           sub: "Try-on metrics and performance" },
  "/dashboard/billing":       { title: "Credits & Billing",   sub: "Manage your credit balance and plans" },
  "/dashboard/docs":          { title: "Integration Guide",   sub: "Embed the try-on widget in your storefront" },
  "/dashboard/admin":         { title: "Admin Overview",      sub: "Platform-wide statistics" },
};

export default function Header() {
  const pathname = usePathname();
  const page = titles[pathname] ?? { title: "Dashboard", sub: "" };
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-brand-100 bg-white/90 px-6 backdrop-blur-sm sticky top-0 z-30 lg:px-8">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{page.title}</h1>
        {page.sub && (
          <p className="text-xs text-gray-700 leading-tight">{page.sub}</p>
        )}
      </div>
      {user && (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            {user.name || user.email}
          </span>
        </div>
      )}
    </header>
  );
}
