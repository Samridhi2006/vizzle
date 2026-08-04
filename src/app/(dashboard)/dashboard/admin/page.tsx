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
import { BarChart2, LayoutDashboard, ShoppingBag, Store, CreditCard, Shield, Plus, Copy, Check, X, Key, Sparkles, Settings, Save } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

type AdminStoreInfo = {
  id: string;
  storeName: string;
  domain: string;
  tier: "UNPAID" | "BASIC" | "GOLD" | "PREMIUM" | "ENTERPRISE";
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
  storeList?: AdminStoreInfo[];
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

type PricingConfig = {
  creditCostImage: number;
  creditCostVideo: number;
  setupCostBasic: number;
  setupCostGold: number;
  setupCostPremium: number;
  currencySymbol: string;
};

const TIER_BADGES: Record<string, string> = {
  UNPAID:     "bg-red-100 text-red-800 border-red-200 font-bold",
  BASIC:      "bg-gray-100 text-gray-700 border-gray-200",
  GOLD:       "bg-amber-100 text-amber-900 border-amber-300 font-bold",
  PREMIUM:    "bg-purple-100 text-purple-900 border-purple-300 font-bold",
  ENTERPRISE: "bg-blue-100 text-blue-900 border-blue-300 font-bold",
};

const TIER_PRESETS: Record<string, { hr: number; day: number }> = {
  BASIC:      { hr: 100,  day: 1000 },
  GOLD:       { hr: 300,  day: 3000 },
  PREMIUM:    { hr: 1500, day: 15000 },
  ENTERPRISE: { hr: 10000, day: 100000 },
};

export default function AdminPage() {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const hydrated = useAuthStore((state) => state._hydrated);
  const addToast = useUIStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const [updatingStoreId, setUpdatingStoreId] = useState<string | null>(null);

  // Dynamic Pricing state
  const [imgCost, setImgCost] = useState<number>(2.5);
  const [vidCost, setVidCost] = useState<number>(5.0);
  const [basicCost, setBasicCost] = useState<number>(2000);
  const [goldCost, setGoldCost] = useState<number>(5000);
  const [premiumCost, setPremiumCost] = useState<number>(15000);
  const [currency, setCurrency] = useState<string>("₹");

  // Demo store creation state
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoStoreName, setDemoStoreName] = useState("Demo Fashion Store");
  const [demoDomain, setDemoDomain] = useState("demo.vizzle.in");
  const [demoTier, setDemoTier] = useState<"BASIC" | "GOLD" | "PREMIUM" | "ENTERPRISE">("BASIC");
  const [demoReqsHr, setDemoReqsHr] = useState(100);
  const [demoReqsDay, setDemoReqsDay] = useState(1000);
  const [demoCredits, setDemoCredits] = useState(500);

  // Generated key result state
  const [createdDemoResult, setCreatedDemoResult] = useState<{
    store_id: string;
    store_name: string;
    domain: string;
    api_key: string;
    tier: string;
    requests_per_hour: number;
    requests_per_day: number;
    credits: number;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAdmin, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => apiFetch<AdminOverviewData>("/admin/overview"),
    enabled: isAdmin,
  });

  const { data: pricingData, refetch: refetchPricing } = useQuery({
    queryKey: ["admin-pricing"],
    queryFn: () => apiFetch<{ pricing: PricingConfig }>("/admin/pricing"),
    enabled: isAdmin,
  });

  useEffect(() => {
    if (pricingData?.pricing) {
      setImgCost(pricingData.pricing.creditCostImage ?? 2.5);
      setVidCost(pricingData.pricing.creditCostVideo ?? 5.0);
      setBasicCost(pricingData.pricing.setupCostBasic ?? 2000);
      setGoldCost(pricingData.pricing.setupCostGold ?? 5000);
      setPremiumCost(pricingData.pricing.setupCostPremium ?? 15000);
      setCurrency(pricingData.pricing.currencySymbol ?? "₹");
    }
  }, [pricingData]);

  const updatePricingMutation = useMutation({
    mutationFn: (data: any) =>
      apiFetch("/admin/pricing", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      addToast({ tone: "success", title: "Dynamic Pricing Settings Saved!" });
      refetchPricing();
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to update pricing" });
    },
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

  const createDemoMutation = useMutation({
    mutationFn: (data: {
      store_name: string;
      domain: string;
      tier: string;
      requests_per_hour: number;
      requests_per_day: number;
      initial_credits: number;
    }) =>
      apiFetch<{ success: boolean; message: string; demo_store: any }>("/admin/demo-store", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res) => {
      addToast({ tone: "success", title: res.message || "Demo Store & API Key created!" });
      setCreatedDemoResult(res.demo_store);
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to create demo store" });
    },
  });

  function handleSavePricing(e: React.FormEvent) {
    e.preventDefault();
    updatePricingMutation.mutate({
      credit_cost_image: Number(imgCost),
      credit_cost_video: Number(vidCost),
      setup_cost_basic: Number(basicCost),
      setup_cost_gold: Number(goldCost),
      setup_cost_premium: Number(premiumCost),
      currency_symbol: currency,
    });
  }

  function handleTierChange(storeId: string, tier: string) {
    setUpdatingStoreId(storeId);
    updateTierMutation.mutate({ store_id: storeId, tier });
  }

  function handleTierPresetSelect(preset: "BASIC" | "GOLD" | "PREMIUM" | "ENTERPRISE") {
    setDemoTier(preset);
    const config = TIER_PRESETS[preset];
    if (config) {
      setDemoReqsHr(config.hr);
      setDemoReqsDay(config.day);
    }
  }

  function handleCreateDemoStore(e: React.FormEvent) {
    e.preventDefault();
    createDemoMutation.mutate({
      store_name: demoStoreName,
      domain: demoDomain,
      tier: demoTier,
      requests_per_hour: Number(demoReqsHr),
      requests_per_day: Number(demoReqsDay),
      initial_credits: Number(demoCredits),
    });
  }

  function copyApiKeyToClipboard(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    addToast({ tone: "success", title: "API Key copied to clipboard!" });
    setTimeout(() => setCopiedKey(false), 2500);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Admin Platform Dashboard</h2>
          <p className="text-sm text-gray-600">
            Customize platform pricing, manage store rate limits &amp; generate demo API keys.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDemoModal(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-700 shadow-sm transition-all"
          >
            <Plus size={16} /> Create Demo Store &amp; API Key
          </button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <LayoutDashboard size={14} /> Brand Dashboard
            </Button>
          </Link>
        </div>
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
          value={isLoading ? "—" : `${currency}${(data?.totals.totalCredits ?? 0).toFixed(2)}`}
          sub="Across all brand wallets"
          icon={CreditCard}
          color="emerald"
        />
      </div>

      {/* ⚙️ DYNAMIC PRICING CONFIGURATION CARD */}
      <form onSubmit={handleSavePricing} className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-brand-900 font-bold text-base">
            <Settings size={18} className="text-brand-600" />
            <span>Dynamic Platform Pricing Customization</span>
          </div>
          <button
            type="submit"
            disabled={updatePricingMutation.isPending}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all"
          >
            {updatePricingMutation.isPending ? <Spinner size={14} /> : <Save size={14} />}
            Save Pricing Settings
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 mb-1">Image Try-On API Cost ({currency})</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={imgCost}
              onChange={(e) => setImgCost(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-900 focus:border-brand-500 focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">Cost per image try-on API call</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 mb-1">AI Video Generation API Cost ({currency})</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={vidCost}
              onChange={(e) => setVidCost(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-900 focus:border-brand-500 focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">Cost per AI fashion video call</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 mb-1">Platform Currency Symbol</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-900 focus:border-brand-500 focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">E.g., ₹ (INR) or $ (USD)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 mb-1">Basic One-Time Setup Fee ({currency})</label>
            <input
              type="number"
              min="0"
              value={basicCost}
              onChange={(e) => setBasicCost(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-900 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 mb-1">Gold One-Time Setup Fee ({currency})</label>
            <input
              type="number"
              min="0"
              value={goldCost}
              onChange={(e) => setGoldCost(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-amber-800 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 mb-1">Premium One-Time Setup Fee ({currency})</label>
            <input
              type="number"
              min="0"
              value={premiumCost}
              onChange={(e) => setPremiumCost(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-purple-800 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </form>

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
            {(data?.users ?? []).map((user) => {
              const storeList = user.storeList ?? [];
              return (
                <div key={user.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-900">{user.name}</h4>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-full font-semibold text-gray-700">
                        {user.storesCount ?? storeList.length} {storeList.length === 1 ? "Store" : "Stores"}
                      </span>
                      <span className="bg-emerald-100 px-2.5 py-1 rounded-full font-bold text-emerald-800">
                        Total Wallet: {currency}{(user.totalBalance ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Store Subtable */}
                  <div className="bg-gray-50/70 rounded-xl border border-gray-100 p-3 space-y-2">
                    {storeList.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">No storefronts created yet</span>
                    ) : (
                      storeList.map((s) => (
                        <div key={s.id} className="bg-white p-3 rounded-lg border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-bold text-gray-800 flex items-center gap-2">
                              <Store size={14} className="text-brand-600" /> {s.storeName}
                              <span className="text-gray-400 font-normal">({s.domain})</span>
                            </div>
                            <div className="text-gray-500 mt-0.5">
                              Usage: <strong>{s.usage} try-ons</strong> · Products: <strong>{s.products}</strong> · Limits: <strong>{s.reqsPerHr} req/hr</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Balance</span>
                              <span className="font-extrabold text-emerald-600">{currency}{s.balance.toFixed(2)}</span>
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
                                <option value="UNPAID">UNPAID (0 req/hr)</option>
                                <option value="BASIC">BASIC ({currency}{basicCost} / 100 hr)</option>
                                <option value="GOLD">GOLD ({currency}{goldCost} / 300 hr)</option>
                                <option value="PREMIUM">PREMIUM ({currency}{premiumCost} / 1.5k hr)</option>
                                <option value="ENTERPRISE">ENTERPRISE (Custom)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── CREATE DEMO STORE MODAL ────────────────────────────────────────────── */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => { setShowDemoModal(false); setCreatedDemoResult(null); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {createdDemoResult ? (
              /* Success Step: Generated API Key Display */
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Check size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">Demo Store &amp; API Key Created!</h3>
                    <p className="text-xs text-gray-500">Store active with custom rate limits &amp; wallet credits.</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Store Name:</span>
                    <strong className="text-gray-900">{createdDemoResult.store_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Domain:</span>
                    <strong className="text-gray-900">{createdDemoResult.domain}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tier / Rate Limits:</span>
                    <strong className="text-brand-600">{createdDemoResult.tier} ({createdDemoResult.requests_per_hour} req/hr)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Granted Wallet Balance:</span>
                    <strong className="text-emerald-600">{currency}{createdDemoResult.credits.toFixed(2)}</strong>
                  </div>
                </div>

                {/* API Key Code Box */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    🔑 Generated Demo API Key (Copy Now — Shown Once)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                    <span className="flex-1 truncate">{createdDemoResult.api_key}</span>
                    <button
                      onClick={() => copyApiKeyToClipboard(createdDemoResult.api_key)}
                      className="bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                      {copiedKey ? "Copied!" : "Copy Key"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => { setShowDemoModal(false); setCreatedDemoResult(null); }}
                  className="w-full py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-colors mt-2"
                >
                  Done &amp; Close
                </button>
              </div>
            ) : (
              /* Input Form Step */
              <form onSubmit={handleCreateDemoStore} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                    <Key size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Create Demo Store &amp; API Key</h3>
                    <p className="text-xs text-gray-500">Set custom rate limits &amp; grant demo credits</p>
                  </div>
                </div>

                {/* Store Name & Domain */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      required
                      value={demoStoreName}
                      onChange={(e) => setDemoStoreName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Domain</label>
                    <input
                      type="text"
                      required
                      value={demoDomain}
                      onChange={(e) => setDemoDomain(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tier Presets */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Setup Tier Preset</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["BASIC", "GOLD", "PREMIUM", "ENTERPRISE"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleTierPresetSelect(t)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          demoTier === t
                            ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:border-brand-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Rate Limits */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Reqs / Hour (Rate Limit)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={demoReqsHr}
                      onChange={(e) => setDemoReqsHr(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Reqs / Day (Daily Limit)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={demoReqsDay}
                      onChange={(e) => setDemoReqsDay(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Initial Wallet Credits */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Granted Wallet Credits ({currency})</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={demoCredits}
                    onChange={(e) => setDemoCredits(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-emerald-700 focus:border-brand-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Initial balance for testing Virtual Try-on ({currency}{imgCost}) &amp; AI Video ({currency}{vidCost})</span>
                </div>

                <button
                  type="submit"
                  disabled={createDemoMutation.isPending}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {createDemoMutation.isPending ? <Spinner size={16} /> : <Key size={16} />}
                  Generate Demo API Key &amp; Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
