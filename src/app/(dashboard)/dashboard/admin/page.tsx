"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Card, { StatCard } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/client/fetcher";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { BarChart2, LayoutDashboard, ShoppingBag, Store, CreditCard, Shield, ChevronDown, Check } from "lucide-react";

type AdminStoreInfo = {
  id: string;
  storeName: string;
  domain: string;
  tier: "BASIC" | "GOLD" | "PREMIUM" | "ENTERPRISE";
  reqsPerHr: number;
  reqsPerDay: number;
  balance: number;
  usage: number;
  products: number;
};

type AdminUserInfo = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  storesCount: number;
  stores: AdminStoreInfo[];
  products: number;
  usage: number;
  totalBalance: number;
};

type AdminOverviewData = {
  totals: {
    users: number;
    stores: number;
    usage: number;
    products: number;
    totalCredits: number;
  };
  users: AdminUserInfo[];
};

const TIER_BADGES: Record<string, string> = {
  BASIC:      "bg-gray-100 text-gray-700 border-gray-200",
  GOLD:       "bg-amber-100 text-amber-900 border-amber-300 font-bold",
  PREMIUM:    "bg-purple-100 text-purple-900 border-purple-300 font-bold",
  ENTERPRISE: "bg-blue-100 text-blue-900 border-blue-300 font-bold",
};

export default function AdminPage() {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const addToast = useUIStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const [updatingStoreId, setUpdatingStoreId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => apiFetch<AdminOverviewData>("/admin/overview"),
    enabled: isAdmin,
  });

  const updateTierMutation = useMutation({
    mutationFn: (data: { store_id: string; tier: string }) =>
      apiFetch("/admin/store-tier", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res: any) => {
      addToast({ tone: "success", title: res.message || "Store tier updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      setUpdatingStoreId(null);
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to update tier" });
      setUpdatingStoreId(null);
    },
  });

  function handleTierChange(storeId: string, tier: string) {
    setUpdatingStoreId(storeId);
    updateTierMutation.mutate({ store_id: storeId, tier });
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Admin Platform Dashboard</h2>
          <p className="text-sm text-gray-600">
            Manage stores, activate One-Time Setup Tiers &amp; monitor wallet balances.
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <LayoutDashboard size={14} /> Brand Dashboard
          </Button>
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Brands"
          value={isLoading ? "—" : data?.totals.users ?? 0}
          sub="Registered accounts"
          icon={ShoppingBag}
          color="violet"
        />
        <StatCard
          label="Total Stores"
          value={isLoading ? "—" : data?.totals.stores ?? 0}
          sub="Active storefronts"
          icon={Store}
          color="blue"
        />
        <StatCard
          label="Total Try-ons"
          value={isLoading ? "—" : data?.totals.usage ?? 0}
          sub="ML API calls executed"
          icon={BarChart2}
          color="emerald"
        />
        <StatCard
          label="Total Wallet Credits"
          value={isLoading ? "—" : `₹${(data?.totals.totalCredits ?? 0).toFixed(2)}`}
          sub="Across all brand wallets"
          icon={CreditCard}
          color="emerald"
        />
      </div>

      {/* One-Time Setup Tier Info Box */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
        <div className="flex items-center gap-2 mb-2 text-brand-900 font-bold text-sm">
          <Shield size={16} className="text-brand-600" />
          <span>One-Time Setup Tiers Reference</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-brand-100">
            <span className="font-bold text-gray-800">Basic (₹2,000/-)</span>
            <span className="block text-gray-500">100 req/hr · 1k/day</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-brand-100">
            <span className="font-bold text-amber-800">Gold (₹5,000/-)</span>
            <span className="block text-gray-500">300 req/hr · 3k/day</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-brand-100">
            <span className="font-bold text-purple-800">Premium (₹15,000/-)</span>
            <span className="block text-gray-500">1,500 req/hr · 15k/day</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-brand-100">
            <span className="font-bold text-blue-800">Enterprise (TBD)</span>
            <span className="block text-gray-500">Custom rate limits</span>
          </div>
        </div>
      </div>

      {/* Brand & Store breakdown table */}
      <Card padding={false}>
        <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Registered Brands &amp; Store Setup Tiers</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Manage store tiers, rate limits, and monitor current wallet balances.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading admin overview...</div>
        ) : (data?.users ?? []).length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No registered brands yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(data?.users ?? []).map((user) => (
              <div key={user.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-gray-900">{user.name}</h4>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-full font-semibold text-gray-700">
                      {user.storesCount} {user.storesCount === 1 ? "Store" : "Stores"}
                    </span>
                    <span className="bg-emerald-100 px-2.5 py-1 rounded-full font-bold text-emerald-800">
                      Total Wallet: ₹{user.totalBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Store Subtable */}
                <div className="bg-gray-50/70 rounded-xl border border-gray-100 p-3 space-y-2">
                  {user.stores.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">No storefronts created yet</span>
                  ) : (
                    user.stores.map((s) => (
                      <div key={s.id} className="bg-white p-3 rounded-lg border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-gray-800 flex items-center gap-2">
                            <Store size={14} className="text-brand-600" /> {s.storeName}
                            <span className="text-gray-400 font-normal">({s.domain})</span>
                          </div>
                          <div className="text-gray-500 mt-0.5">
                            Usage: <strong>{s.usage} try-ons</strong> · Products: <strong>{s.products}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Balance</span>
                            <span className="font-extrabold text-emerald-600">₹{s.balance.toFixed(2)}</span>
                          </div>

                          {/* Tier Selector */}
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Setup Tier</span>
                            <select
                              value={s.tier}
                              disabled={updatingStoreId === s.id}
                              onChange={(e) => handleTierChange(s.id, e.target.value)}
                              className={`rounded-lg border px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${TIER_BADGES[s.tier] ?? ""}`}
                            >
                              <option value="BASIC">BASIC (₹2k / 100 hr)</option>
                              <option value="GOLD">GOLD (₹5k / 300 hr)</option>
                              <option value="PREMIUM">PREMIUM (₹15k / 1.5k hr)</option>
                              <option value="ENTERPRISE">ENTERPRISE (Custom)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
