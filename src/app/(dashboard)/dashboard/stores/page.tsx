"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Check,
  Copy,
  Globe,
  Key,
  Package,
  Plus,
  RefreshCw,
  Store as StoreIcon,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  useCreateStoreMutation,
  useRotateApiKeyMutation,
  useStoresQuery,
} from "@/hooks/useStores";
import { formatDate, maskApiKey } from "@/lib/client/utils";
import { useUIStore } from "@/store/ui.store";

interface CreateForm {
  store_name: string;
  domain: string;
}

export default function StoresPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [rotatedApiKey, setRotatedApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const { data, isLoading, error } = useStoresQuery();
  const stores = data?.stores ?? [];
  const addToast = useUIStore((state) => state.addToast);
  const hasStores = !isLoading && stores.length > 0;

  const createMutation = useCreateStoreMutation();
  const rotateMutation = useRotateApiKeyMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>();

  async function onCreate(values: CreateForm) {
    try {
      const res = await createMutation.mutateAsync(values);
      setCreatedApiKey(res.api_key);
      setCreateOpen(false);
      reset();
      addToast({ tone: "success", title: "Store created — copy your API key below!" });
    } catch (err) {
      addToast({
        tone: "error",
        title: "Failed to create store",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  async function onRotate(storeId: string) {
    try {
      const res = await rotateMutation.mutateAsync(storeId);
      setRotatedApiKey(res.new_api_key);
      addToast({ tone: "success", title: "API key rotated" });
    } catch (err) {
      addToast({
        tone: "error",
        title: "Failed to rotate key",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="max-w-5xl space-y-6">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Stores</h2>
          <p className="text-sm text-gray-600">
            Each store gets its own API key. Brands embed that key to enable virtual try-on.
          </p>
        </div>
        {hasStores && (
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-brand-600 px-5 py-2.5 text-base font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
          >
            <Plus size={18} />
            New Store
          </button>
        )}
      </div>

      {/* ── API load error ───────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load stores: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {/* ── New key banners ──────────────────────────────────── */}
      {createdApiKey && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="mb-2 text-sm font-semibold text-emerald-800">
            ✓ Store created — copy your API key now (shown only once)
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-3 py-2">
            <code className="flex-1 break-all text-xs text-gray-800">{createdApiKey}</code>
            <button
              onClick={() => copy(createdApiKey)}
              className="shrink-0 text-emerald-700 hover:text-emerald-900"
            >
              {copied === createdApiKey ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}

      {rotatedApiKey && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-sm font-semibold text-amber-800">
            New API key — old key is now invalid, save this immediately
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2">
            <code className="flex-1 break-all text-xs text-gray-800">{rotatedApiKey}</code>
            <button
              onClick={() => copy(rotatedApiKey)}
              className="shrink-0 text-amber-700 hover:text-amber-900"
            >
              {copied === rotatedApiKey ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────── */}
      {isLoading && (
        <div className="grid gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-gray-200 bg-white" />
          ))}
        </div>
      )}

      {/* ── EMPTY STATE: inline create form (no modal needed) ── */}
      {!isLoading && stores.length === 0 && (
        <div className="rounded-xl border-2 border-brand-200 bg-brand-50">
          {/* Top part */}
          <div className="flex items-center gap-4 border-b border-brand-200 px-6 py-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 shadow">
              <StoreIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">Create your first store</p>
              <p className="text-sm text-gray-600">
                Fill in the form below — you&apos;ll get an API key instantly.
              </p>
            </div>
          </div>

          {/* Inline form */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit(onCreate)} className="space-y-4 max-w-lg">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Store name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="e.g. Acme Fashion Store"
                  {...register("store_name", { required: "Store name is required" })}
                />
                {errors.store_name && (
                  <p className="mt-1 text-xs text-red-600">{errors.store_name.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">
                  Domain <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="shop.yourbrand.com"
                  {...register("domain", { required: "Domain is required" })}
                />
                {errors.domain && (
                  <p className="mt-1 text-xs text-red-600">{errors.domain.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  The domain where you&apos;ll embed the widget (no https://).
                </p>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black bg-brand-600 px-4 py-3 text-base font-semibold text-white hover:bg-brand-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
              >
                {createMutation.isPending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating store…
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create store &amp; get API key
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Store list (when stores exist) ───────────────────── */}
      {hasStores && (
        <div className="grid gap-4">
          {stores.map((store) => (
            <Card key={store.store_id} className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <StoreIcon size={18} className="text-brand-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{store.store_name}</p>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Globe size={12} />
                      {store.domain}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Package size={12} />
                      {store.product_count} products
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Key size={12} />
                      {maskApiKey(store.active_key_prefix)}
                    </span>
                  </div>
                </div>
                <div className="hidden text-right md:block">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(store.created_at)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRotate(store.store_id)}
                  loading={rotateMutation.isPending}
                >
                  <RefreshCw size={14} /> Rotate key
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Modal (only used after first store exists) ────────── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a new store">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input
            label="Store name"
            placeholder="My Fashion Store"
            error={errors.store_name?.message}
            {...register("store_name", { required: "Store name is required" })}
          />
          <Input
            label="Domain"
            placeholder="shop.example.com"
            helperText="The domain where you'll embed the try-on widget (no https://)."
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
