"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client/fetcher";
import { useAuthStore } from "@/store/auth.store";
import { AdminOverviewResponse } from "@/types";
import { BarChart2, Package, Store, Users, LogOut, LayoutDashboard } from "lucide-react";

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <Icon size={13} />
        {label}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const router  = useRouter();
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout  = useAuthStore((s) => s.clearSession);

  // Redirect non-admins immediately
  useEffect(() => {
    if (isAdmin === false) router.replace("/login");
  }, [isAdmin, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-overview"],
    queryFn:  () => apiFetch<AdminOverviewResponse>("/admin/overview"),
    enabled:  !!isAdmin,
  });

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vizzle" className="h-7 w-auto" />
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <LayoutDashboard size={12} /> Brand Dashboard
          </button>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Platform Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Read-only view of all registered brands and their usage.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Brands"   value={isLoading ? "—" : (data?.totals.users    ?? 0)} icon={Users}    />
          <StatCard label="Total Stores"   value={isLoading ? "—" : (data?.totals.stores   ?? 0)} icon={Store}    />
          <StatCard label="Total Products" value={isLoading ? "—" : (data?.totals.products ?? 0)} icon={Package}  />
          <StatCard label="Total Try-ons"  value={isLoading ? "—" : (data?.totals.usage    ?? 0)} icon={BarChart2} />
        </div>

        {/* Brands table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Brands</h2>
            <p className="mt-0.5 text-xs text-gray-500">All registered brand accounts — stores, products, and try-on usage.</p>
          </div>

          {isError && (
            <p className="px-6 py-8 text-sm text-red-600">Failed to load data. Make sure you are signed in as an admin.</p>
          )}

          {isLoading && (
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 px-6 py-3">
                  {[...Array(7)].map((__, j) => (
                    <div key={j} className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                  ))}
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3">Stores</th>
                    <th className="px-6 py-3">Store Names</th>
                    <th className="px-6 py-3 text-right">Products</th>
                    <th className="px-6 py-3 text-right">Try-ons</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(data?.users ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                        No brands registered yet.
                      </td>
                    </tr>
                  ) : (
                    (data?.users ?? []).map((u, idx) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-3 text-gray-600">{u.email}</td>
                        <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(u.joinedAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-3 text-gray-700">{u.stores}</td>
                        <td className="px-6 py-3 text-gray-600 max-w-[200px]">
                          {u.storeNames.length === 0 ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {u.storeNames.map((name) => (
                                <span key={name} className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700">
                                  {name}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right font-semibold text-gray-900">{u.products}</td>
                        <td className="px-6 py-3 text-right font-semibold text-gray-900">{u.usage}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
