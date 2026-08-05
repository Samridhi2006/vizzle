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
import {
  BarChart2, LayoutDashboard, ShoppingBag, Store, CreditCard, Shield, Plus, Copy, Check, X, Key,
  Sparkles, Settings, Save, ChevronDown, ChevronUp, Pencil, Trash2, PauseCircle, PlayCircle,
  KeyRound, History, Layers,
} from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { formatDate } from "@/lib/client/utils";

type AdminStoreInfo = {
  id: string;
  storeName: string;
  domain: string;
  tier: string;
  reqsPerHr: number;
  reqsPerDay: number;
  balance: number;
  usage: number;
  products: number;
  suspended: boolean;
};

type TierDefinition = {
  name: string;
  requestsPerHour: number;
  requestsPerDay: number;
  priceLabel?: string;
};

type ApiKeyInfo = {
  id: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
};

type CreditTx = {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  createdAt: string;
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

const TX_COLORS: Record<string, string> = {
  PURCHASE:    "text-emerald-600",
  REFUND:      "text-emerald-500",
  USAGE_IMAGE: "text-red-500",
  USAGE_VIDEO: "text-red-500",
};

const TX_LABELS: Record<string, string> = {
  PURCHASE:    "💳 Purchase",
  REFUND:      "↩ Refund",
  USAGE_IMAGE: "🖼 Image Try-on",
  USAGE_VIDEO: "🎬 Video",
};

function AdminTransactionHistory({ transactions }: { transactions: CreditTx[] }) {
  if (transactions.length === 0) {
    return <p className="py-6 text-center text-xs text-gray-400">No transactions yet</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 text-left font-bold uppercase tracking-widest text-gray-400">
            <th className="pb-2">Type</th>
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Amount</th>
            <th className="pb-2 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-2 font-semibold text-gray-700">{TX_LABELS[tx.type] ?? tx.type}</td>
              <td className="py-2 text-gray-500 max-w-[200px] truncate">{tx.description ?? "—"}</td>
              <td className={`py-2 text-right font-bold tabular-nums ${TX_COLORS[tx.type] ?? "text-gray-700"}`}>
                {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount).toFixed(2)}
              </td>
              <td className="py-2 text-right text-gray-400 whitespace-nowrap">{formatDate(tx.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminApiKeysList({
  keys,
  onToggle,
  togglingId,
}: {
  keys: ApiKeyInfo[];
  onToggle: (keyId: string, isActive: boolean) => void;
  togglingId: string | null;
}) {
  if (keys.length === 0) {
    return <p className="py-6 text-center text-xs text-gray-400">No API keys issued yet</p>;
  }
  return (
    <div className="space-y-1.5">
      {keys.map((k) => (
        <div key={k.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <KeyRound size={13} className="text-gray-400" />
            <span className="font-mono font-semibold text-gray-700">{k.key_prefix}…</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${k.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
              {k.is_active ? "Active" : "Revoked"}
            </span>
            <span className="text-gray-400">{formatDate(k.created_at)}</span>
          </div>
          <button
            type="button"
            disabled={togglingId === k.id}
            onClick={() => onToggle(k.id, !k.is_active)}
            className={`rounded-md px-2 py-1 text-[11px] font-bold transition-colors disabled:opacity-50 ${
              k.is_active ? "bg-red-100 hover:bg-red-200 text-red-700" : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
            }`}
          >
            {k.is_active ? "Revoke" : "Reactivate"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const hydrated = useAuthStore((state) => state._hydrated);
  const addToast = useUIStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const [updatingStoreId, setUpdatingStoreId] = useState<string | null>(null);
  const [topupAmounts, setTopupAmounts] = useState<Record<string, string>>({});
  const [topupStoreId, setTopupStoreId] = useState<string | null>(null);

  // Custom rate-limit override drafts, keyed by store id
  const [limitDrafts, setLimitDrafts] = useState<Record<string, { hr: string; day: string }>>({});
  const [savingLimitsId, setSavingLimitsId] = useState<string | null>(null);

  // Expanded "Manage" panel per store (rename, delete, keys, tx history)
  const [expandedStoreId, setExpandedStoreId] = useState<string | null>(null);
  const [editDrafts, setEditDrafts] = useState<Record<string, { name: string; domain: string }>>({});
  const [savingEditId, setSavingEditId] = useState<string | null>(null);
  const [deletingStoreId, setDeletingStoreId] = useState<string | null>(null);
  const [accessStoreId, setAccessStoreId] = useState<string | null>(null);
  const [togglingKeyId, setTogglingKeyId] = useState<string | null>(null);

  // Tier management form state
  const [tierFormName, setTierFormName] = useState("");
  const [tierFormHr, setTierFormHr] = useState(100);
  const [tierFormDay, setTierFormDay] = useState(1000);
  const [tierFormPrice, setTierFormPrice] = useState("");

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

  const { data: tiersData } = useQuery({
    queryKey: ["admin-tiers"],
    queryFn: () => apiFetch<{ tiers: Record<string, TierDefinition> }>("/admin/tiers"),
    enabled: isAdmin,
  });
  const tierList = Object.values(tiersData?.tiers ?? {});

  const { data: keysData, isLoading: keysLoading } = useQuery({
    queryKey: ["admin-keys", expandedStoreId],
    queryFn: () => apiFetch<{ keys: ApiKeyInfo[] }>(`/admin/stores/${expandedStoreId}/keys`),
    enabled: isAdmin && !!expandedStoreId,
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["admin-transactions", expandedStoreId],
    queryFn: () => apiFetch<{ transactions: CreditTx[] }>(`/admin/credit-transactions?store_id=${expandedStoreId}`),
    enabled: isAdmin && !!expandedStoreId,
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
    mutationFn: (data: { store_id: string; tier: string; requests_per_hour?: number; requests_per_day?: number }) =>
      apiFetch("/admin/store-tier", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res: any) => {
      addToast({ tone: "success", title: res.message || "Store tier updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      setUpdatingStoreId(null);
      setSavingLimitsId(null);
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to update tier" });
      setUpdatingStoreId(null);
      setSavingLimitsId(null);
    },
  });

  const saveTierDefMutation = useMutation({
    mutationFn: (data: { name: string; requests_per_hour: number; requests_per_day: number; price_label?: string }) =>
      apiFetch("/admin/tiers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res: any) => {
      addToast({ tone: "success", title: res.message || "Tier saved" });
      queryClient.invalidateQueries({ queryKey: ["admin-tiers"] });
      setTierFormName("");
      setTierFormPrice("");
      setTierFormHr(100);
      setTierFormDay(1000);
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to save tier" });
    },
  });

  const deleteTierDefMutation = useMutation({
    mutationFn: (name: string) => apiFetch(`/admin/tiers?name=${encodeURIComponent(name)}`, { method: "DELETE" }),
    onSuccess: (res: any) => {
      addToast({ tone: "success", title: res.message || "Tier removed" });
      queryClient.invalidateQueries({ queryKey: ["admin-tiers"] });
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to remove tier" });
    },
  });

  const updateStoreInfoMutation = useMutation({
    mutationFn: (data: { storeId: string; store_name: string; domain: string }) =>
      apiFetch(`/admin/stores/${data.storeId}`, {
        method: "PATCH",
        body: JSON.stringify({ store_name: data.store_name, domain: data.domain }),
      }),
    onSuccess: () => {
      addToast({ tone: "success", title: "Store details updated" });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      setSavingEditId(null);
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to update store" });
      setSavingEditId(null);
    },
  });

  const deleteStoreMutation = useMutation({
    mutationFn: (storeId: string) => apiFetch(`/admin/stores/${storeId}`, { method: "DELETE" }),
    onSuccess: () => {
      addToast({ tone: "success", title: "Store deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      setDeletingStoreId(null);
      setExpandedStoreId(null);
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to delete store" });
      setDeletingStoreId(null);
    },
  });

  const accessMutation = useMutation({
    mutationFn: (data: { storeId: string; action: "SUSPEND" | "RESUME" }) =>
      apiFetch(`/admin/stores/${data.storeId}/access`, {
        method: "POST",
        body: JSON.stringify({ action: data.action }),
      }),
    onSuccess: (res: any) => {
      addToast({ tone: "success", title: res.message || "Access updated" });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      setAccessStoreId(null);
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to update store access" });
      setAccessStoreId(null);
    },
  });

  const keyToggleMutation = useMutation({
    mutationFn: (data: { storeId: string; key_id: string; is_active: boolean }) =>
      apiFetch(`/admin/stores/${data.storeId}/keys`, {
        method: "PATCH",
        body: JSON.stringify({ key_id: data.key_id, is_active: data.is_active }),
      }),
    onSuccess: (res: any) => {
      addToast({ tone: "success", title: res.message || "API key updated" });
      queryClient.invalidateQueries({ queryKey: ["admin-keys", expandedStoreId] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      setTogglingKeyId(null);
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to update API key" });
      setTogglingKeyId(null);
    },
  });

  const topupMutation = useMutation({
    mutationFn: (data: { store_id: string; amount: number; direction: "ADD" | "DEDUCT" }) =>
      apiFetch("/admin/credit-topup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res: any, variables) => {
      addToast({ tone: "success", title: res.message || "Store balance updated" });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      setTopupAmounts((prev) => ({ ...prev, [variables.store_id]: "" }));
      setTopupStoreId(null);
    },
    onError: (err: any) => {
      addToast({ tone: "error", title: err.message || "Failed to update balance" });
      setTopupStoreId(null);
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

  function handleTopup(storeId: string, direction: "ADD" | "DEDUCT") {
    const raw = topupAmounts[storeId];
    const amount = Number(raw);
    if (!raw || !Number.isFinite(amount) || amount <= 0) {
      addToast({ tone: "error", title: "Enter a valid amount greater than 0" });
      return;
    }
    setTopupStoreId(storeId);
    topupMutation.mutate({ store_id: storeId, amount, direction });
  }

  function handleSaveLimits(storeId: string, tier: string) {
    const draft = limitDrafts[storeId];
    const hr = Number(draft?.hr);
    const day = Number(draft?.day);
    if (!Number.isFinite(hr) || hr < 0 || !Number.isFinite(day) || day < 0) {
      addToast({ tone: "error", title: "Enter valid non-negative rate limits" });
      return;
    }
    setSavingLimitsId(storeId);
    updateTierMutation.mutate({ store_id: storeId, tier, requests_per_hour: hr, requests_per_day: day });
  }

  function handleSaveTierDef(e: React.FormEvent) {
    e.preventDefault();
    const name = tierFormName.trim().toUpperCase();
    if (!/^[A-Z0-9_]+$/.test(name)) {
      addToast({ tone: "error", title: "Tier name must be uppercase letters, numbers, or underscores" });
      return;
    }
    saveTierDefMutation.mutate({
      name,
      requests_per_hour: Number(tierFormHr),
      requests_per_day: Number(tierFormDay),
      price_label: tierFormPrice.trim() || undefined,
    });
  }

  function handleEditTierDef(t: TierDefinition) {
    setTierFormName(t.name);
    setTierFormHr(t.requestsPerHour);
    setTierFormDay(t.requestsPerDay);
    setTierFormPrice(t.priceLabel ?? "");
  }

  function handleDeleteTierDef(name: string) {
    if (!confirm(`Remove tier "${name}"? Stores already on this tier keep their current limits.`)) return;
    deleteTierDefMutation.mutate(name);
  }

  function toggleExpandStore(storeId: string, current: AdminStoreInfo) {
    if (expandedStoreId === storeId) {
      setExpandedStoreId(null);
      return;
    }
    setExpandedStoreId(storeId);
    setEditDrafts((prev) => ({
      ...prev,
      [storeId]: prev[storeId] ?? { name: current.storeName, domain: current.domain },
    }));
  }

  function handleSaveStoreEdit(storeId: string) {
    const draft = editDrafts[storeId];
    if (!draft || !draft.name.trim() || !draft.domain.trim()) {
      addToast({ tone: "error", title: "Store name and domain are required" });
      return;
    }
    setSavingEditId(storeId);
    updateStoreInfoMutation.mutate({ storeId, store_name: draft.name, domain: draft.domain });
  }

  function handleDeleteStore(storeId: string, storeName: string) {
    if (!confirm(`Permanently delete "${storeName}"? This removes its products, try-on logs, API keys, and wallet. This cannot be undone.`)) return;
    setDeletingStoreId(storeId);
    deleteStoreMutation.mutate(storeId);
  }

  function handleToggleAccess(storeId: string, suspended: boolean) {
    setAccessStoreId(storeId);
    accessMutation.mutate({ storeId, action: suspended ? "RESUME" : "SUSPEND" });
  }

  function handleToggleKey(storeId: string, keyId: string, isActive: boolean) {
    setTogglingKeyId(keyId);
    keyToggleMutation.mutate({ storeId, key_id: keyId, is_active: isActive });
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
    <div className="max-w-7xl space-y-6">
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

      {/* 🏷️ TIER MANAGEMENT CARD — add / edit / remove tiers */}
      <div className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-brand-900 font-bold text-base border-b border-gray-100 pb-3">
          <Layers size={18} className="text-brand-600" />
          <span>Setup Tier Management</span>
        </div>

        <form onSubmit={handleSaveTierDef} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Tier Name</label>
            <input
              type="text"
              required
              placeholder="e.g. STARTER"
              value={tierFormName}
              onChange={(e) => setTierFormName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold uppercase text-gray-800 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Req / Hour</label>
            <input
              type="number"
              required
              min={0}
              value={tierFormHr}
              onChange={(e) => setTierFormHr(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Req / Day</label>
            <input
              type="number"
              required
              min={0}
              value={tierFormDay}
              onChange={(e) => setTierFormDay(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Price Label</label>
            <input
              type="text"
              placeholder="e.g. ₹2000 setup"
              value={tierFormPrice}
              onChange={(e) => setTierFormPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={saveTierDefMutation.isPending}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50"
          >
            {saveTierDefMutation.isPending ? <Spinner size={13} /> : <Plus size={14} />}
            Save Tier
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          {tierList.length === 0 ? (
            <span className="text-xs text-gray-400 italic">No tiers configured</span>
          ) : (
            tierList.map((t) => (
              <div
                key={t.name}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${TIER_BADGES[t.name] ?? "bg-gray-50 border-gray-200 text-gray-700"}`}
              >
                <div>
                  <div className="font-extrabold">{t.name}</div>
                  <div className="font-normal opacity-80">
                    {t.requestsPerHour} req/hr · {t.requestsPerDay} req/day{t.priceLabel ? ` · ${t.priceLabel}` : ""}
                  </div>
                </div>
                <button
                  type="button"
                  title="Edit tier"
                  onClick={() => handleEditTierDef(t)}
                  className="rounded-md p-1 hover:bg-black/5 transition-colors"
                >
                  <Pencil size={12} />
                </button>
                <button
                  type="button"
                  title="Remove tier"
                  onClick={() => handleDeleteTierDef(t.name)}
                  className="rounded-md p-1 hover:bg-black/5 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
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
                      storeList.map((s) => {
                        const isExpanded = expandedStoreId === s.id;
                        const limitDraft = limitDrafts[s.id] ?? { hr: String(s.reqsPerHr), day: String(s.reqsPerDay) };
                        const editDraft = editDrafts[s.id] ?? { name: s.storeName, domain: s.domain };
                        return (
                        <div key={s.id} className="bg-white rounded-lg border border-gray-200/80 text-xs">
                          <div className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-gray-800 flex items-center gap-2">
                              <Store size={14} className="text-brand-600" /> {s.storeName}
                              <span className="text-gray-400 font-normal">({s.domain})</span>
                              {s.suspended && (
                                <span className="bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-[10px] font-bold">Suspended</span>
                              )}
                            </div>
                            <div className="text-gray-500 mt-0.5">
                              Usage: <strong>{s.usage} try-ons</strong> · Products: <strong>{s.products}</strong> · Limits: <strong>{s.reqsPerHr} req/hr</strong>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Balance</span>
                              <span className="font-extrabold text-emerald-600">{currency}{s.balance.toFixed(2)}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  placeholder="Amount"
                                  value={topupAmounts[s.id] ?? ""}
                                  onChange={(e) =>
                                    setTopupAmounts((prev) => ({ ...prev, [s.id]: e.target.value }))
                                  }
                                  disabled={topupStoreId === s.id}
                                  className="w-20 rounded-md border border-gray-200 px-1.5 py-1 text-[11px] font-semibold text-gray-800 focus:border-brand-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  title="Add credit"
                                  disabled={topupStoreId === s.id}
                                  onClick={() => handleTopup(s.id, "ADD")}
                                  className="rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-1.5 py-1 text-[11px] font-bold transition-colors disabled:opacity-50"
                                >
                                  +
                                </button>
                                <button
                                  type="button"
                                  title="Deduct credit"
                                  disabled={topupStoreId === s.id}
                                  onClick={() => handleTopup(s.id, "DEDUCT")}
                                  className="rounded-md bg-red-100 hover:bg-red-200 text-red-800 px-1.5 py-1 text-[11px] font-bold transition-colors disabled:opacity-50"
                                >
                                  −
                                </button>
                              </div>
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
                                {!tierList.some((t) => t.name === s.tier) && (
                                  <option value={s.tier}>{s.tier} (current)</option>
                                )}
                                {tierList.map((t) => (
                                  <option key={t.name} value={t.name}>
                                    {t.name} ({t.requestsPerHour} req/hr{t.priceLabel ? ` · ${t.priceLabel}` : ""})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Custom rate limit override */}
                            <div>
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Custom Limits</span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  title="Requests per hour"
                                  value={limitDraft.hr}
                                  onChange={(e) =>
                                    setLimitDrafts((prev) => ({ ...prev, [s.id]: { ...limitDraft, hr: e.target.value } }))
                                  }
                                  disabled={savingLimitsId === s.id}
                                  className="w-16 rounded-md border border-gray-200 px-1.5 py-1 text-[11px] font-semibold text-gray-800 focus:border-brand-500 focus:outline-none"
                                />
                                <span className="text-gray-300">/</span>
                                <input
                                  type="number"
                                  min={0}
                                  title="Requests per day"
                                  value={limitDraft.day}
                                  onChange={(e) =>
                                    setLimitDrafts((prev) => ({ ...prev, [s.id]: { ...limitDraft, day: e.target.value } }))
                                  }
                                  disabled={savingLimitsId === s.id}
                                  className="w-16 rounded-md border border-gray-200 px-1.5 py-1 text-[11px] font-semibold text-gray-800 focus:border-brand-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  title="Save custom limits"
                                  disabled={savingLimitsId === s.id}
                                  onClick={() => handleSaveLimits(s.id, s.tier)}
                                  className="rounded-md bg-brand-100 hover:bg-brand-200 text-brand-800 px-1.5 py-1 text-[11px] font-bold transition-colors disabled:opacity-50"
                                >
                                  <Save size={11} />
                                </button>
                              </div>
                            </div>

                            {/* Suspend / Resume */}
                            <button
                              type="button"
                              title={s.suspended ? "Resume store access" : "Suspend store access"}
                              disabled={accessStoreId === s.id}
                              onClick={() => handleToggleAccess(s.id, s.suspended)}
                              className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-50 ${
                                s.suspended ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800" : "bg-amber-100 hover:bg-amber-200 text-amber-800"
                              }`}
                            >
                              {s.suspended ? <PlayCircle size={13} /> : <PauseCircle size={13} />}
                              {s.suspended ? "Resume" : "Suspend"}
                            </button>

                            {/* Manage toggle */}
                            <button
                              type="button"
                              onClick={() => toggleExpandStore(s.id, s)}
                              className="flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 text-[11px] font-bold transition-colors"
                            >
                              Manage {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                          </div>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-gray-100 p-3 space-y-4 bg-gray-50/50">
                              {/* Rename store */}
                              <div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Rename / Change Domain</span>
                                <div className="flex flex-wrap items-center gap-2">
                                  <input
                                    type="text"
                                    value={editDraft.name}
                                    onChange={(e) => setEditDrafts((prev) => ({ ...prev, [s.id]: { ...editDraft, name: e.target.value } }))}
                                    className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:border-brand-500 focus:outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={editDraft.domain}
                                    onChange={(e) => setEditDrafts((prev) => ({ ...prev, [s.id]: { ...editDraft, domain: e.target.value } }))}
                                    className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:border-brand-500 focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    disabled={savingEditId === s.id}
                                    onClick={() => handleSaveStoreEdit(s.id)}
                                    className="flex items-center gap-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-2.5 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-50"
                                  >
                                    {savingEditId === s.id ? <Spinner size={11} /> : <Pencil size={11} />}
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    disabled={deletingStoreId === s.id}
                                    onClick={() => handleDeleteStore(s.id, s.storeName)}
                                    className="flex items-center gap-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 px-2.5 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-50"
                                  >
                                    {deletingStoreId === s.id ? <Spinner size={11} /> : <Trash2 size={11} />}
                                    Delete Store
                                  </button>
                                </div>
                              </div>

                              {/* API keys */}
                              <div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1 mb-1">
                                  <KeyRound size={11} /> API Keys
                                </span>
                                {keysLoading ? (
                                  <p className="py-4 text-center text-xs text-gray-400">Loading keys...</p>
                                ) : (
                                  <AdminApiKeysList
                                    keys={keysData?.keys ?? []}
                                    onToggle={(keyId, isActive) => handleToggleKey(s.id, keyId, isActive)}
                                    togglingId={togglingKeyId}
                                  />
                                )}
                              </div>

                              {/* Transaction history */}
                              <div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1 mb-1">
                                  <History size={11} /> Credit Transaction History
                                </span>
                                {txLoading ? (
                                  <p className="py-4 text-center text-xs text-gray-400">Loading transactions...</p>
                                ) : (
                                  <AdminTransactionHistory transactions={txData?.transactions ?? []} />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        );
                      })
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
