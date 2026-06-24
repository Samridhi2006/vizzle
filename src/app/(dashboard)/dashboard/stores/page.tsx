"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Check,
  Copy,
  Globe,
  Key,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Store as StoreIcon,
  Trash2,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  useCreateStoreMutation,
  useDeleteStoreMutation,
  useRotateApiKeyMutation,
  useStoresQuery,
  useUpdateStoreMutation,
} from "@/hooks/useStores";
import { formatDate, maskApiKey } from "@/lib/client/utils";
import { useStoresStore } from "@/store/stores.store";
import { useUIStore } from "@/store/ui.store";
import { Store } from "@/types";

interface CreateForm {
  store_name: string;
  domain: string;
}
interface EditForm {
  store_name: string;
  domain: string;
}

const LS_KEY = (storeId: string) => `vizzle_apikey_${storeId}`;

function saveKeyToStorage(storeId: string, fullKey: string) {
  try { localStorage.setItem(LS_KEY(storeId), fullKey); } catch { /* ignore */ }
}
function loadKeyFromStorage(storeId: string): string | null {
  try { return localStorage.getItem(LS_KEY(storeId)); } catch { return null; }
}
function clearKeyFromStorage(storeId: string) {
  try { localStorage.removeItem(LS_KEY(storeId)); } catch { /* ignore */ }
}

export default function StoresPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [rotatedApiKeysByStore, setRotatedApiKeysByStore] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const { data, isLoading, error } = useStoresQuery();
  const stores = data?.stores ?? [];
  const addToast = useUIStore((state) => state.addToast);
  const selectedStore = useStoresStore((s) => s.selectedStore);
  const setSelectedStore = useStoresStore((s) => s.setSelectedStore);
  const hasStores = !isLoading && stores.length > 0;

  const createMutation = useCreateStoreMutation();
  const rotateMutation = useRotateApiKeyMutation();
  const updateMutation = useUpdateStoreMutation();
  const deleteMutation = useDeleteStoreMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>();

  const editForm = useForm<EditForm>();

  async function onCreate(values: CreateForm) {
    try {
      const res = await createMutation.mutateAsync(values);
      setCreatedApiKey(res.api_key);
      // Persist so copy button works after page refresh
      if (res.store_id) saveKeyToStorage(res.store_id, res.api_key);
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
      setRotatedApiKeysByStore((prev) => ({ ...prev, [storeId]: res.new_api_key }));
      // Overwrite old stored key — old one is now invalid
      saveKeyToStorage(storeId, res.new_api_key);
      addToast({ tone: "success", title: "API key rotated — copy it from the banner below" });
    } catch (err) {
      addToast({
        tone: "error",
        title: "Failed to rotate key",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  function copyFullKey(storeId: string) {
    const full = rotatedApiKeysByStore[storeId] ?? loadKeyFromStorage(storeId);
    if (full) {
      copy(full);
    } else {
      addToast({ tone: "error", title: "Full key not available — click Rotate key to generate a new one" });
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  function openEditModal(store: Store) {
    setEditingStore(store);
    editForm.reset({
      store_name: store.store_name,
      domain: store.domain,
    });
    setEditOpen(true);
  }

  async function onEditSubmit(values: EditForm) {
    if (!editingStore) return;
    try {
      const updated = await updateMutation.mutateAsync({
        storeId: editingStore.store_id,
        store_name: values.store_name,
        domain: values.domain,
      });
      if (selectedStore?.store_id === editingStore.store_id) {
        setSelectedStore(updated);
      }
      setEditOpen(false);
      setEditingStore(null);
      addToast({ tone: "success", title: "Store updated" });
    } catch (err) {
      addToast({
        tone: "error",
        title: "Failed to update store",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  async function onDeleteConfirm() {
    if (!deletingStore) return;
    try {
      await deleteMutation.mutateAsync(deletingStore.store_id);
      clearKeyFromStorage(deletingStore.store_id);
      setRotatedApiKeysByStore((prev) => {
        const next = { ...prev };
        delete next[deletingStore.store_id];
        return next;
      });
      if (selectedStore?.store_id === deletingStore.store_id) {
        setSelectedStore(null);
      }
      setDeleteOpen(false);
      setDeletingStore(null);
      addToast({ tone: "success", title: "Store deleted" });
    } catch (err) {
      addToast({
        tone: "error",
        title: "Failed to delete store",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <div className="max-w-5xl space-y-6">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Stores</h2>
          <p className="text-sm text-gray-600">
            Each store gets its own API key. Brands embed that key to enable virtual try-on.
          </p>
        </div>
        {hasStores && (
          <Button onClick={() => setCreateOpen(true)} className="h-10 w-full sm:w-auto">
            <Plus size={18} />
            New Store
          </Button>
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
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <StoreIcon size={18} className="text-brand-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{store.store_name}</p>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
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
                        <button
                          type="button"
                          onClick={() => copyFullKey(store.store_id)}
                          title="Copy full API key"
                          className="ml-1 inline-flex items-center justify-center rounded-md p-1 text-gray-400 hover:bg-brand-50 hover:text-gray-700 transition-colors"
                        >
                          {copied === (rotatedApiKeysByStore[store.store_id] ?? loadKeyFromStorage(store.store_id)) ? (
                            <Check size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <p className="hidden text-right text-xs text-gray-500 md:block md:mr-2">
                    <span className="block">Created</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(store.created_at)}
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(store)}
                    className="h-9 flex-1 sm:flex-none"
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRotate(store.store_id)}
                    loading={rotateMutation.isPending}
                    className="h-9 flex-1 sm:flex-none"
                  >
                    <RefreshCw size={14} /> Rotate key
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingStore(store);
                      setDeleteOpen(true);
                    }}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-black bg-white px-3 text-sm font-semibold text-red-600 hover:bg-red-50 sm:flex-none"
                    aria-label="Delete store"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              {/* Per-store rotated key banner (shown after rotate/copy) */}
              {rotatedApiKeysByStore[store.store_id] && (
                <div className="border-t border-amber-200 bg-amber-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-amber-800">
                    New API key for <span className="font-bold">{store.store_name}</span> — old key is now invalid
                  </p>
                  <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2">
                    <code className="flex-1 break-all text-xs text-gray-800">
                      {rotatedApiKeysByStore[store.store_id]}
                    </code>
                    <button
                      onClick={() => copy(rotatedApiKeysByStore[store.store_id])}
                      className="shrink-0 text-amber-700 hover:text-amber-900"
                      title="Copy"
                    >
                      {copied === rotatedApiKeysByStore[store.store_id] ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              )}
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

      {/* Edit store modal */}
      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingStore(null);
        }}
        title="Edit Store"
      >
        {editingStore && (
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <Input
              label="Store name"
              placeholder="My Fashion Store"
              error={editForm.formState.errors.store_name?.message}
              {...editForm.register("store_name", { required: "Store name is required" })}
            />
            <Input
              label="Domain"
              placeholder="shop.example.com"
              helperText="The domain where you'll embed the try-on widget (no https://)."
              error={editForm.formState.errors.domain?.message}
              {...editForm.register("domain", { required: "Domain is required" })}
            />
            <Button className="w-full" type="submit" loading={updateMutation.isPending}>
              Save Changes
            </Button>
          </form>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingStore(null);
        }}
        title="Delete Store"
      >
        <p className="text-sm text-gray-600">
          Delete <span className="font-semibold text-gray-900">{deletingStore?.store_name}</span>?
          This removes all products and API keys for this store. This cannot be undone.
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              setDeleteOpen(false);
              setDeletingStore(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="w-full sm:w-auto"
            loading={deleteMutation.isPending}
            onClick={onDeleteConfirm}
          >
            Delete Store
          </Button>
        </div>
      </Modal>
    </div>
  );
}
