"use client";

import { useState } from "react";
import { CreditCard, Zap, TrendingUp, RefreshCcw, CheckCircle2, Store, ChevronDown, Check, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import { useStoresStore } from "@/store/stores.store";
import { useUIStore } from "@/store/ui.store";
import { useStoresQuery } from "@/hooks/useStores";
import {
  useCreditsQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useCreateSetupOrderMutation,
  useVerifySetupMutation,
  openRazorpayCheckout,
  openRazorpaySetupCheckout,
  CREDIT_PACKAGES_CLIENT,
} from "@/hooks/useCredits";
import { formatDate, cn } from "@/lib/client/utils";
import Spinner from "@/components/ui/Spinner";

// ── Tier display info ─────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  UNPAID:     "bg-red-100 text-red-800 border-red-200 font-bold",
  BASIC:      "bg-gray-100 text-gray-700 border-gray-200",
  GOLD:       "bg-amber-100 text-amber-900 border-amber-300 font-bold",
  PREMIUM:    "bg-purple-100 text-purple-900 border-purple-300 font-bold",
  ENTERPRISE: "bg-blue-100 text-blue-900 border-blue-300 font-bold",
};

const SETUP_TIERS_PAYABLE = [
  { tier: "BASIC",   name: "Basic Plan",   cost: 2000,  costStr: "₹2,000/-",  hr: "100 req/hr",   day: "1,000 req/day",  badge: "Starter" },
  { tier: "GOLD",    name: "Gold Plan",    cost: 5000,  costStr: "₹5,000/-",  hr: "300 req/hr",   day: "3,000 req/day",  badge: "Recommended" },
  { tier: "PREMIUM", name: "Premium Plan", cost: 15000, costStr: "₹15,000/-", hr: "1,500 req/hr", day: "15,000 req/day", badge: "High Volume" },
];

// ── Subcomponents ─────────────────────────────────────────────────────────────

function BalanceCard({ balance }: { balance: number }) {
  const pct = Math.min((balance / 1000) * 100, 100);
  const color = balance > 200 ? "bg-emerald-500" : balance > 50 ? "bg-yellow-400" : "bg-red-400";

  return (
    <div className="rounded-2xl border-2 border-brand-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
          <CreditCard size={20} className="text-brand-600" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Current Wallet Balance</p>
          <p className="text-3xl font-extrabold text-gray-900">₹{balance.toFixed(2)}</p>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>₹0</span>
        <span>
          {balance < 50 && <span className="text-red-500 font-semibold">⚠ Low balance — top up soon</span>}
        </span>
        <span>₹1,000+</span>
      </div>
      <div className="mt-3 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-2">
        <span>🖼 Image try-on: <strong>₹2.50</strong>/req</span>
        <span>🎬 Video: <strong>₹5.00</strong>/req</span>
      </div>
    </div>
  );
}

function TierCard({ tier, reqsPerHr, reqsPerDay }: { tier: string; reqsPerHr: number; reqsPerDay: number }) {
  const badge = TIER_COLORS[tier] ?? TIER_COLORS.BASIC;
  const isUnpaid = tier === "UNPAID" || reqsPerHr === 0;

  return (
    <div className={cn("rounded-2xl border p-6 shadow-sm flex flex-col justify-between", isUnpaid ? "border-red-300 bg-red-50/40" : "border-brand-200 bg-white")}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isUnpaid ? "bg-red-100 text-red-600" : "bg-brand-100 text-brand-600")}>
            <Zap size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Active Rate Limit Tier</p>
            <span className={`mt-1 inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${badge}`}>{isUnpaid ? "UNPAID (Pending Setup)" : tier}</span>
          </div>
        </div>

        {isUnpaid ? (
          <div className="text-xs text-red-700 space-y-1">
            <p className="font-bold">⚠ Setup Required to Activate API</p>
            <p className="text-red-600">Select and pay for a One-Time Setup Plan below to set your rate limits.</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700 mb-1">
              Limit: <strong className="text-gray-900">{reqsPerHr} req/hr</strong> · <strong className="text-gray-900">{reqsPerDay} req/day</strong>
            </p>
            <p className="text-xs text-gray-500">Rate limits protect your store from traffic spikes.</p>
          </div>
        )}
      </div>

      <a
        href="https://wa.me/918310247975"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Contact Support / Enterprise Setup →
      </a>
    </div>
  );
}

// ── One-Time Setup Pay Section ────────────────────────────────────────────────

function SetupPaySection({
  storeId,
  currentTier,
  onSuccess,
}: {
  storeId: string;
  currentTier: string;
  onSuccess: (tier: string) => void;
}) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);
  const createSetupOrder = useCreateSetupOrderMutation();
  const verifySetup = useVerifySetupMutation(storeId);

  const isUnpaid = currentTier === "UNPAID";

  async function handlePaySetup(tierKey: string, tierName: string) {
    if (!storeId) {
      addToast({ tone: "error", title: "Please select a store first" });
      return;
    }
    setLoadingTier(tierKey);
    try {
      // 1. Create Razorpay order for setup plan
      const order = await createSetupOrder.mutateAsync({ tier: tierKey, store_id: storeId });

      // 2. Open Razorpay checkout modal
      const paymentData = await openRazorpaySetupCheckout({
        order,
        tierLabel: tierName,
        storeId,
      });

      // 3. Verify signature & activate tier
      const result = await verifySetup.mutateAsync({
        ...paymentData,
        store_id: storeId,
        tier: tierKey,
      });

      addToast({ tone: "success", title: `🎉 One-Time Setup Plan activated: ${result.tier} (${result.requests_per_hour} req/hr)` });
      onSuccess(result.tier);
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : "Payment failed";
      if (rawMsg === "Payment cancelled") return;

      // Parse Razorpay JSON error like:
      // "Razorpay order creation failed: {\"error\":{\"description\":\"...\",\"code\":\"...\"}}"
      let friendlyMsg = rawMsg;
      try {
        const jsonStart = rawMsg.indexOf("{");
        if (jsonStart !== -1) {
          const parsed = JSON.parse(rawMsg.slice(jsonStart)) as { error?: { description?: string; code?: string } };
          if (parsed?.error?.description) {
            friendlyMsg = parsed.error.description;
            if (parsed.error.code) friendlyMsg += ` (${parsed.error.code})`;
          }
        }
      } catch { /* keep rawMsg */ }

      addToast({ tone: "error", title: `Payment failed: ${friendlyMsg}` });
    } finally {
      setLoadingTier(null);
    }
  }

  return (
    <div className={cn("rounded-2xl border p-6 shadow-sm", isUnpaid ? "border-red-300 bg-gradient-to-b from-red-50/50 to-white" : "border-brand-200 bg-white")}>
      <div className="flex items-center gap-3 mb-5">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isUnpaid ? "bg-red-100 text-red-600" : "bg-brand-100 text-brand-600")}>
          <Sparkles size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">SET UP COST (One-Time Store Activation)</p>
            {isUnpaid && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">REQUIRED</span>}
          </div>
          <p className="text-sm text-gray-600">Select a one-time setup plan to activate your store and set API rate limits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SETUP_TIERS_PAYABLE.map((st) => {
          const isActive = currentTier === st.tier;
          const isLoading = loadingTier === st.tier;

          return (
            <div
              key={st.tier}
              className={cn(
                "rounded-xl border-2 p-5 flex flex-col justify-between transition-all",
                isActive
                  ? "border-emerald-500 bg-emerald-50/30"
                  : "border-gray-200 bg-white hover:border-brand-300 hover:shadow-md"
              )}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{st.badge}</span>
                  {isActive && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> ACTIVE PLAN
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-gray-900">{st.name}</h4>
                <div className="text-2xl font-extrabold text-brand-700 my-1">{st.costStr}</div>
                <div className="text-xs text-gray-500 mb-4">One-time setup fee</div>

                <div className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rate Limit:</span>
                    <strong className="text-gray-900">{st.hr}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Daily Cap:</span>
                    <strong className="text-gray-900">{st.day}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePaySetup(st.tier, st.name)}
                disabled={isActive || isLoading || loadingTier !== null}
                className={cn(
                  "w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2",
                  isActive
                    ? "bg-emerald-100 text-emerald-800 cursor-default"
                    : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                )}
              >
                {isLoading ? <Spinner size={14} /> : null}
                {isActive ? "Active Plan" : `Pay ${st.costStr} via Razorpay`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Top-up section ────────────────────────────────────────────────────────────

function TopUpSection({
  storeId,
  isUnpaid,
  onSuccess,
}: {
  storeId: string;
  isUnpaid: boolean;
  onSuccess: (credits: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const addToast = useUIStore((s) => s.addToast);
  const createOrder = useCreateOrderMutation();
  const verifyPayment = useVerifyPaymentMutation(storeId);

  async function handleTopUp() {
    if (selected === null) return;
    if (isUnpaid) {
      addToast({ tone: "error", title: "Please complete One-Time Store Setup first!" });
      return;
    }
    setLoading(true);
    try {
      const order = await createOrder.mutateAsync({ packageIndex: selected, store_id: storeId });

      const paymentData = await openRazorpayCheckout({
        order,
        packageIndex: selected,
        storeId,
      });

      const result = await verifyPayment.mutateAsync({
        ...paymentData,
        store_id: storeId,
        package_index: selected,
      });

      addToast({ tone: "success", title: `₹${result.credits_added} credits added to your wallet!` });
      onSuccess(result.credits_added);
      setSelected(null);
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : "Payment failed";
      if (rawMsg === "Payment cancelled") return;
      let friendlyMsg = rawMsg;
      try {
        const jsonStart = rawMsg.indexOf("{");
        if (jsonStart !== -1) {
          const parsed = JSON.parse(rawMsg.slice(jsonStart)) as { error?: { description?: string; code?: string } };
          if (parsed?.error?.description) {
            friendlyMsg = parsed.error.description;
            if (parsed.error.code) friendlyMsg += ` (${parsed.error.code})`;
          }
        }
      } catch { /* keep rawMsg */ }
      addToast({ tone: "error", title: `Payment failed: ${friendlyMsg}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("rounded-2xl border p-6 shadow-sm", isUnpaid ? "border-gray-200 bg-gray-50 opacity-70" : "border-brand-200 bg-white")}>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
          <TrendingUp size={20} className="text-brand-600" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">API COST (Recurring Pay-As-You-Go Wallet Top-Up)</p>
          <p className="text-sm text-gray-600">Recharge credits for API calls — higher top-ups grant bonus credits</p>
        </div>
      </div>

      {isUnpaid && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 font-semibold flex items-center gap-2">
          <ShieldAlert size={16} className="shrink-0 text-amber-600" /> Complete One-Time Setup above to enable wallet top-ups.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CREDIT_PACKAGES_CLIENT.map((pkg, i) => (
          <button
            key={i}
            id={`credit-package-${i}`}
            disabled={isUnpaid}
            onClick={() => setSelected(i)}
            className={`flex flex-col items-center rounded-xl border-2 p-3.5 text-center transition-all ${
              selected === i
                ? "border-brand-500 bg-brand-50 shadow-md"
                : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/50"
            }`}
          >
            <span className="text-lg font-extrabold text-gray-900">{pkg.label}</span>
            <span className="text-xs font-semibold text-brand-700 mt-0.5">
              Get ₹{pkg.creditsGiven}
            </span>
            {pkg.bonus > 0 ? (
              <span className="mt-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                +{pkg.bonus}% bonus
              </span>
            ) : (
              <span className="mt-1.5 text-[10px] text-gray-400">Standard</span>
            )}
          </button>
        ))}
      </div>

      <button
        id="topup-pay-btn"
        onClick={handleTopUp}
        disabled={selected === null || loading || isUnpaid}
        className="mt-5 w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {loading ? <Spinner size={16} /> : <CreditCard size={16} />}
        {selected !== null
          ? `Pay ₹${CREDIT_PACKAGES_CLIENT[selected].amountPaid} via Razorpay (Get ₹${CREDIT_PACKAGES_CLIENT[selected].creditsGiven} Credits)`
          : "Select a credit package to continue"}
      </button>
    </div>
  );
}

// ── Transaction history ───────────────────────────────────────────────────────

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

function TransactionHistory({ transactions }: { transactions: { id: string; type: string; amount: number; description: string | null; createdAt: string }[] }) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">No transactions yet</p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-bold uppercase tracking-widest text-gray-400">
            <th className="pb-2">Type</th>
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Amount</th>
            <th className="pb-2 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-2.5 font-semibold text-gray-700">
                {TX_LABELS[tx.type] ?? tx.type}
              </td>
              <td className="py-2.5 text-gray-500 text-xs max-w-[200px] truncate">
                {tx.description ?? "—"}
              </td>
              <td className={`py-2.5 text-right font-bold tabular-nums ${TX_COLORS[tx.type] ?? "text-gray-700"}`}>
                {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount).toFixed(2)}
              </td>
              <td className="py-2.5 text-right text-xs text-gray-400 whitespace-nowrap">
                {formatDate(tx.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const selectedStore    = useStoresStore((s) => s.selectedStore);
  const setSelectedStore = useStoresStore((s) => s.setSelectedStore);
  const addToast = useUIStore((s) => s.addToast);
  const storeId  = selectedStore?.store_id ?? null;

  const { data: storesData } = useStoresQuery();
  const stores = storesData?.stores ?? [];

  const [pickerOpen, setPickerOpen] = useState(false);

  const { data, isLoading, refetch } = useCreditsQuery(storeId);

  function handleTopUpSuccess(credits: number) {
    addToast({ tone: "success", title: `₹${credits} credits added!` });
    refetch();
  }

  function handleSetupSuccess(tier: string) {
    refetch();
  }

  if (!storeId) {
    return (
      <div className="max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <Store size={32} className="mx-auto mb-3 text-amber-400" />
        <p className="font-semibold text-amber-800 mb-1">No store selected</p>
        <p className="text-sm text-amber-600 mb-4">Pick a store below to view its credits &amp; billing.</p>
        <div className="flex flex-col gap-2 max-w-xs mx-auto">
          {stores.map((s) => (
            <button
              key={s.store_id}
              onClick={() => setSelectedStore(s)}
              className="rounded-xl border-2 border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 hover:border-brand-500 hover:bg-brand-50 transition-colors text-left"
            >
              {s.store_name}
              <span className="block text-xs text-gray-400 font-normal">{s.domain}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentTier = data?.tier.tier ?? "UNPAID";
  const isUnpaid = currentTier === "UNPAID" || (data?.tier.requestsPerHour ?? 0) === 0;

  return (
    <div className="max-w-5xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Credits &amp; Billing</h2>
          {/* Store picker dropdown */}
          <div className="relative mt-1">
            <button
              id="billing-store-picker"
              onClick={() => setPickerOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-brand-50 transition-colors shadow-sm"
            >
              <Store size={13} className="text-brand-600" />
              {selectedStore?.store_name ?? "Select store"}
              <ChevronDown size={13} className={cn("text-gray-400 transition-transform", pickerOpen && "rotate-180")} />
            </button>

            {pickerOpen && (
              <div className="absolute left-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-xl">
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Select store to recharge</p>
                {stores.length === 0 && (
                  <p className="px-4 pb-3 text-sm text-gray-400">No stores found</p>
                )}
                {stores.map((s) => (
                  <button
                    key={s.store_id}
                    onClick={() => { setSelectedStore(s); setPickerOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-brand-50 transition-colors",
                      s.store_id === selectedStore?.store_id ? "bg-brand-50 font-bold text-brand-700" : "text-gray-700"
                    )}
                  >
                    <Store size={14} className="shrink-0 text-brand-400" />
                    <span className="flex-1 min-w-0">
                      <span className="block truncate">{s.store_name}</span>
                      <span className="block truncate text-xs text-gray-400">{s.domain}</span>
                    </span>
                    {s.store_id === selectedStore?.store_id && (
                      <Check size={13} className="text-brand-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          id="billing-refresh-btn"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 rounded-xl border border-brand-200 px-3 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
        >
          <RefreshCcw size={13} /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          {/* Balance + Tier row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <BalanceCard balance={data?.balance ?? 0} />
            <TierCard
              tier={currentTier}
              reqsPerHr={data?.tier.requestsPerHour ?? 0}
              reqsPerDay={data?.tier.requestsPerDay ?? 0}
            />
          </div>

          {/* Setup Tiers Interactive Payment Section */}
          <SetupPaySection
            storeId={storeId}
            currentTier={currentTier}
            onSuccess={handleSetupSuccess}
          />

          {/* Top-up section */}
          <TopUpSection
            storeId={storeId}
            isUnpaid={isUnpaid}
            onSuccess={handleTopUpSuccess}
          />

          {/* Transaction history */}
          <div className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-brand-600" />
              <p className="font-bold text-gray-900">Transaction History</p>
              <span className="ml-auto text-xs text-gray-400">Last 50</span>
            </div>
            <TransactionHistory transactions={data?.transactions ?? []} />
          </div>
        </>
      )}
    </div>
  );
}
