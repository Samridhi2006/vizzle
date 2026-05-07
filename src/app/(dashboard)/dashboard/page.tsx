"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  ArrowRight, Check, Copy, Package, Plus,
  Store as StoreIcon, TrendingUp, Users, Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { formatDate, formatNumber } from "@/lib/client/utils";
import { useCreateStoreMutation, useStoresQuery } from "@/hooks/useStores";
import { useAnalyticsQuery } from "@/hooks/useAnalytics";
import { useStoresStore } from "@/store/stores.store";
import { useUIStore } from "@/store/ui.store";

interface CreateStoreForm { store_name: string; domain: string; }

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-brand-200 bg-white px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100">
        <Icon size={18} className="text-brand-600" />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: storesData, isLoading } = useStoresQuery();
  const storeList = storesData?.stores ?? [];
  const selectedStore = useStoresStore((s) => s.selectedStore);
  const setSelectedStore = useStoresStore((s) => s.setSelectedStore);
  const addToast = useUIStore((s) => s.addToast);

  const [createOpen, setCreateOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createMutation = useCreateStoreMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateStoreForm>();

  useEffect(() => {
    if (!selectedStore && storeList[0]) setSelectedStore(storeList[0]);
  }, [selectedStore, setSelectedStore, storeList]);

  const { data: analytics } = useAnalyticsQuery(selectedStore?.store_id ?? null);
  const totalProducts = storeList.reduce((s, x) => s + x.product_count, 0);
  const hasStores = storeList.length > 0;
  const hasProducts = totalProducts > 0;

  async function onCreateStore(v: CreateStoreForm) {
    try {
      const res = await createMutation.mutateAsync(v);
      setCreatedKey(res.api_key);
      setCreateOpen(false);
      reset();
      addToast({ tone: "success", title: "Store created!" });
    } catch (e) {
      addToast({ tone: "error", title: "Failed to create store", message: e instanceof Error ? e.message : undefined });
    }
  }

  function copyKey() {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const dash = isLoading ? "—" : undefined;

  return (
    <div className="max-w-5xl space-y-5">

      {/* ── Page title ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Virtual try-on platform — stores, products, analytics.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="lg">
          <Plus size={15} /> New Store
        </Button>
      </div>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Stores"           value={dash ?? storeList.length}                         icon={StoreIcon} />
        <Stat label="Products"         value={dash ?? formatNumber(totalProducts)}               icon={Package} />
        <Stat label="Try-ons (30d)"    value={dash ?? formatNumber(analytics?.tryons ?? 0)}      icon={Zap} />
        <Stat label="Unique users (30d)" value={dash ?? formatNumber(analytics?.users ?? 0)}    icon={Users} />
      </div>

      {/* ── API key reveal ──────────────────────────────────────── */}
      {createdKey && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="mb-2 text-sm font-semibold text-emerald-800">
            ✓ Store created — save this API key now (shown once)
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2.5">
            <code className="flex-1 break-all text-xs text-gray-800">{createdKey}</code>
            <button onClick={copyKey} className="shrink-0 text-emerald-600 hover:text-emerald-800">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="mt-3">
            <Link href="/dashboard/products">
              <Button size="sm" variant="outline">Next: Add Products <ArrowRight size={13} /></Button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Next step ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-700">
          {!hasStores ? "Step 1 — Create a store" : !hasProducts ? "Step 2 — Add products" : "Quick actions"}
        </p>

        {!hasStores ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-brand-400">
                <StoreIcon size={20} className="text-black" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Create your first store</p>
                <p className="text-sm text-gray-600">Get an API key instantly.</p>
              </div>
            </div>
            <Button onClick={() => setCreateOpen(true)}><Plus size={14} /> Create Store</Button>
          </div>
        ) : !hasProducts ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-brand-400">
                <Package size={20} className="text-black" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Add your first products</p>
                <p className="text-sm text-gray-600">Upload garments for shoppers to try on.</p>
              </div>
            </div>
            <Link href="/dashboard/products"><Button><Plus size={14} /> Add Products</Button></Link>
          </div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-3">
            {[
              { href: "/dashboard/stores",    icon: StoreIcon,  label: "Manage Stores" },
              { href: "/dashboard/products",  icon: Package,    label: "Add Products" },
              { href: "/dashboard/analytics", icon: TrendingUp, label: "View Analytics" },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className="group flex items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-3 hover:bg-brand-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
                    <Icon size={15} className="text-brand-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{label}</span>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Recent stores ───────────────────────────────────────── */}
      {hasStores && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Your Stores</p>
            <Link href="/dashboard/stores" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid gap-2">
            {storeList.slice(0, 5).map((store) => (
              <div key={store.store_id}
                className="flex items-center gap-3 rounded-xl border border-brand-100 bg-white px-4 py-3 hover:bg-brand-50 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100">
                  <StoreIcon size={14} className="text-brand-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{store.store_name}</p>
                  <p className="text-xs text-gray-500">{store.domain}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{store.product_count}</p>
                  <p className="text-xs text-gray-500">products</p>
                </div>
                <p className="hidden text-xs text-gray-400 sm:block">{formatDate(store.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Create store modal ──────────────────────────────────── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a new store">
        <form onSubmit={handleSubmit(onCreateStore)} className="space-y-4">
          <Input label="Store name" placeholder="My Fashion Store"
            error={errors.store_name?.message}
            {...register("store_name", { required: "Store name is required" })}
          />
          <Input label="Domain" placeholder="shop.example.com"
            helperText="Domain where you'll embed the widget (no https://)."
            error={errors.domain?.message}
            {...register("domain", { required: "Domain is required" })}
          />
          <Button className="w-full" type="submit" loading={createMutation.isPending}>
            Create store &amp; get API key
          </Button>
        </form>
      </Modal>
    </div>
  );
}
