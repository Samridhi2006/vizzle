"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Card, { StatCard } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/client/fetcher";
import { AdminOverviewResponse } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { BarChart2, LayoutDashboard, ShoppingBag, Store } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => apiFetch<AdminOverviewResponse>("/admin/overview"),
    enabled: isAdmin,
  });

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Platform Overview</h2>
          <p className="text-sm text-gray-600">
            Live counts of brands using the Vizzle virtual try-on pipeline.
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <LayoutDashboard size={14} /> Brand Dashboard
          </Button>
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Brands"
          value={isLoading ? "—" : data?.totals.users ?? 0}
          sub="Registered brand accounts"
          icon={ShoppingBag}
          color="violet"
        />
        <StatCard
          label="Total Stores"
          value={isLoading ? "—" : data?.totals.stores ?? 0}
          sub="Storefronts across all brands"
          icon={Store}
          color="blue"
        />
        <StatCard
          label="Total Try-ons"
          value={isLoading ? "—" : data?.totals.usage ?? 0}
          sub="ML pipeline calls"
          icon={BarChart2}
          color="emerald"
        />
      </div>

      {/* Brand breakdown table */}
      <Card padding={false}>
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-semibold text-gray-900">Brands</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Each row is a registered brand — their stores and ML usage.
          </p>
        </div>
        {isLoading ? (
          <div className="space-y-px">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-36 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (data?.users ?? []).length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No brands yet. Share your sign-up link to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(data?.users ?? []).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-6 text-right text-sm text-gray-600">
                  <div>
                    <p className="font-semibold text-gray-900">{user.stores}</p>
                    <p className="text-xs text-gray-400">stores</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.usage}</p>
                    <p className="text-xs text-gray-400">try-ons</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
