"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  ChevronDown,
  ExternalLink,
  FileJson,
  Image as ImageIcon,
  Link as LinkIcon,
  Package,
  Pencil,
  Plus,
  Search,
  Store as StoreIcon,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { cn, formatDate, formatNumber } from "@/lib/client/utils";
import { useStoresQuery } from "@/hooks/useStores";
import {
  useBulkProductsMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductsQuery,
  // useSyncProductsMutation,
  useUpdateProductMutation,
} from "@/hooks/useProducts";
import { useStoresStore } from "@/store/stores.store";
import { useUIStore } from "@/store/ui.store";
import { apiFetch } from "@/lib/client/fetcher";
import { productsQueryKey } from "@/hooks/useProducts";
import { storesQueryKey } from "@/hooks/useStores";
import { Product } from "@/types";

type UploadTab = "file" | "url" | "bulk";
interface UrlFormData {
  product_id: string;
  name: string;
  brand: string;
  cost: number;
  image_url: string;
}
interface FileFormData {
  product_id: string;
  name: string;
  brand: string;
  cost: number;
}
interface EditFormData {
  name: string;
  brand: string;
  cost: number;
  image_url: string;
  category: string;
}

export default function ProductsPage() {
  const [uploadTab, setUploadTab] = useState<UploadTab>("url");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  // const [syncMenuOpen, setSyncMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [bulkText, setBulkText] = useState(
    JSON.stringify(
      [{ id: "sku-001", name: "Blue Shirt", brand: "Acme", cost: 29.99, image_url: "https://..." }],
      null,
      2
    )
  );
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [filePreviewName, setFilePreviewName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  const selectedStore = useStoresStore((s) => s.selectedStore);
  const setSelectedStore = useStoresStore((s) => s.setSelectedStore);

  const { data: storesData, isLoading: storesLoading } = useStoresQuery();
  const stores = storesData?.stores ?? [];

  // Auto-select the first store if none is selected yet
  useEffect(() => {
    if (!selectedStore && stores[0]) setSelectedStore(stores[0]);
  }, [selectedStore, setSelectedStore, stores]);

  const { data: productsData, isLoading: productsLoading, error: productsError } =
    useProductsQuery(selectedStore?.store_id ?? null);
  const products = productsData?.products ?? [];

  const createProduct = useCreateProductMutation(selectedStore?.store_id ?? null);
  const bulkProducts = useBulkProductsMutation(selectedStore?.store_id ?? null);
  // const syncProducts = useSyncProductsMutation(selectedStore?.store_id ?? null);
  const updateProduct = useUpdateProductMutation(selectedStore?.store_id ?? null);
  const deleteProduct = useDeleteProductMutation(selectedStore?.store_id ?? null);
  const urlForm = useForm<UrlFormData>();
  const fileForm = useForm<FileFormData>();
  const editForm = useForm<EditFormData>();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.product_id.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [products, search]);

  async function onUrlSubmit(values: UrlFormData) {
    try {
      await createProduct.mutateAsync(values);
      setOpen(false);
      urlForm.reset();
      addToast({ tone: "success", title: "Product added" });
    } catch (err) {
      addToast({ tone: "error", title: "Failed to add product", message: err instanceof Error ? err.message : "Please try again." });
    }
  }

  async function onFileSubmit(values: FileFormData) {
    if (!selectedStore) return;
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      addToast({ tone: "error", title: "Please select an image file" });
      return;
    }
    try {
      const fd = new FormData();
      fd.append("store_id", selectedStore.store_id);
      fd.append("image", file);
      fd.append("product_id", values.product_id);
      fd.append("name", values.name);
      fd.append("brand", values.brand);
      fd.append("cost", String(values.cost));
      await apiFetch("/products", { method: "POST", body: fd });
      // apiFetch doesn't go through the mutation, so invalidate manually
      queryClient.invalidateQueries({ queryKey: productsQueryKey(selectedStore.store_id) });
      queryClient.invalidateQueries({ queryKey: storesQueryKey });
      setOpen(false);
      fileForm.reset();
      clearSelectedLocalImage();
      addToast({ tone: "success", title: "Product uploaded" });
    } catch (err) {
      addToast({ tone: "error", title: "Upload failed", message: err instanceof Error ? err.message : "Please try again." });
    }
  }

  async function onBulkSubmit() {
    try {
      const parsed = JSON.parse(bulkText) as Record<string, unknown>[];
      const result = await bulkProducts.mutateAsync(parsed);
      // also refresh stores so product_count badge stays current
      queryClient.invalidateQueries({ queryKey: storesQueryKey });
      addToast({ tone: "success", title: `Imported ${result.imported} products` });
      if (result.errors.length > 0) {
        addToast({ tone: "warning", title: `${result.errors.length} products failed to import` });
      }
      setOpen(false);
    } catch (err) {
      addToast({ tone: "error", title: "Bulk import failed", message: err instanceof Error ? err.message : "Check your JSON format." });
    }
  }

  // Sync UI hidden until Shopify/WordPress integration is ready.
  /*
  async function onSync(platform: "shopify" | "wordpress") {
    setSyncMenuOpen(false);
    try {
      const result = await syncProducts.mutateAsync(platform);
      if (result.status === "not_implemented") {
        addToast({
          tone: "warning",
          title: "Integration not configured yet",
          message: result.message,
        });
        return;
      }
      addToast({
        tone: "success",
        title: `Synced ${result.imported} products from ${platform}`,
      });
      if (result.errors.length > 0) {
        addToast({
          tone: "warning",
          title: `${result.errors.length} products failed to sync`,
        });
      }
      queryClient.invalidateQueries({ queryKey: storesQueryKey });
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 501) {
        addToast({
          tone: "warning",
          title: "Integration not configured yet",
        });
        return;
      }
      addToast({
        tone: "error",
        title: "Sync failed",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }
  */

  function openEditModal(product: Product) {
    setEditingProduct(product);
    editForm.reset({
      name: product.name,
      brand: product.brand,
      cost: product.cost,
      image_url: product.image_url,
      category: product.category ?? "",
    });
    setEditOpen(true);
  }

  async function onEditSubmit(values: EditFormData) {
    if (!editingProduct) return;
    try {
      await updateProduct.mutateAsync({
        vizzleProductId: editingProduct.vizzle_product_id,
        name: values.name,
        brand: values.brand,
        cost: values.cost,
        image_url: values.image_url,
        category: values.category || undefined,
      });
      setEditOpen(false);
      setEditingProduct(null);
      addToast({ tone: "success", title: "Product updated" });
    } catch (err) {
      addToast({
        tone: "error",
        title: "Failed to update product",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  async function onDeleteConfirm() {
    if (!deletingProduct) return;
    try {
      await deleteProduct.mutateAsync(deletingProduct.vizzle_product_id);
      setDeleteOpen(false);
      setDeletingProduct(null);
      addToast({ tone: "success", title: "Product deleted" });
    } catch (err) {
      addToast({
        tone: "error",
        title: "Failed to delete product",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  const noStoresYet = !storesLoading && stores.length === 0;
  const noProductsYet = !productsLoading && products.length === 0 && !!selectedStore;

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  function onSelectLocalImage(file: File | null) {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    if (!file) {
      setFilePreviewUrl(null);
      setFilePreviewName(null);
      return;
    }
    setFilePreviewUrl(URL.createObjectURL(file));
    setFilePreviewName(file.name);
  }

  function clearSelectedLocalImage() {
    onSelectLocalImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Products</h2>
            <p className="text-sm text-gray-600">Manage catalog products per store.</p>
          </div>
          {/* Live product count badge — only when a store is selected */}
          {selectedStore && !productsLoading && (
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-sm font-bold text-brand-700">
              {products.length}
            </span>
          )}
          {selectedStore && productsLoading && (
            <span className="inline-flex h-6 w-8 animate-pulse rounded-full bg-brand-100" />
          )}
        </div>
        <div className="flex w-full flex-row items-stretch gap-2 sm:w-auto">
          {/* Store selector, Sync, Add — equal width on mobile */}
          {stores.length > 0 && (
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <button
                type="button"
                onClick={() => setStoreMenuOpen((s) => !s)}
                className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-white px-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:w-auto sm:justify-start sm:px-3"
              >
                <StoreIcon size={14} className="shrink-0 text-brand-600" />
                <span className="min-w-0 truncate">
                  {selectedStore?.store_name ?? "Select store"}
                </span>
                <ChevronDown size={14} className="shrink-0" />
              </button>
              {storeMenuOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg sm:left-auto sm:right-0 sm:w-56">
                  {stores.map((store) => (
                    <button
                      key={store.store_id}
                      onClick={() => { setSelectedStore(store); setStoreMenuOpen(false); }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm hover:bg-brand-50",
                        selectedStore?.store_id === store.store_id
                          ? "font-semibold text-brand-700"
                          : "text-gray-700"
                      )}
                    >
                      {store.store_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Sync button — hidden until Shopify/WordPress integration is ready
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <Button
              variant="outline"
              disabled={!selectedStore || syncProducts.isPending}
              loading={syncProducts.isPending}
              onClick={() => setSyncMenuOpen((s) => !s)}
              className="h-10 w-full px-2 sm:w-auto sm:px-4"
            >
              <RefreshCw size={14} className="shrink-0" />
              <span className="truncate">Sync</span>
              <ChevronDown size={14} className="shrink-0" />
            </Button>
            {syncMenuOpen && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg sm:left-auto sm:right-0 sm:w-52">
                <button
                  onClick={() => onSync("shopify")}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-brand-50"
                >
                  Sync from Shopify
                </button>
                <button
                  onClick={() => onSync("wordpress")}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-brand-50"
                >
                  Sync from WordPress
                </button>
              </div>
            )}
          </div>
          */}
          <Button
            disabled={!selectedStore}
            onClick={() => setOpen(true)}
            className="h-10 w-full min-w-0 flex-1 px-2 sm:w-auto sm:flex-none sm:px-4"
          >
            <Plus size={14} className="shrink-0" />
            <span className="truncate sm:hidden">Add</span>
            <span className="hidden truncate sm:inline">Add Product</span>
          </Button>
        </div>
      </div>

      {/* API / query error */}
      {productsError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {productsError instanceof Error ? productsError.message : "Failed to load products"}
        </div>
      )}

      {/* Search */}
      {products.length > 0 && (
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Search products…"
          />
        </div>
      )}

      {/* Body */}
      {noStoresYet ? (
        /* No stores at all */
        <Card>
          <div className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
              <StoreIcon size={26} className="text-brand-600" />
            </div>
            <p className="text-base font-semibold text-gray-900">No store yet</p>
            <p className="mt-1 max-w-xs text-sm text-gray-600">
              Create a store first to get an API key, then add products to it.
            </p>
            <Link href="/dashboard/stores" className="mt-5">
              <Button><Plus size={14} /> Create a Store</Button>
            </Link>
          </div>
        </Card>
      ) : !selectedStore || storesLoading ? (
        <Card>
          <div className="py-10 text-center text-sm text-gray-600">
            Loading stores…
          </div>
        </Card>
      ) : productsLoading ? (
        <div className="grid gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-gray-200 bg-white" />
          ))}
        </div>
      ) : noProductsYet ? (
        /* Store exists but no products */
        <Card>
          <div className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
              <Package size={26} className="text-brand-600" />
            </div>
            <p className="text-base font-semibold text-gray-900">No products in this store</p>
            <p className="mt-1 max-w-xs text-sm text-gray-600">
              Add garment images so shoppers can virtually try them on.
            </p>
            <Button className="mt-5" onClick={() => setOpen(true)}>
              <Plus size={14} /> Add a product
            </Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        /* Search returned nothing */
        <Card>
          <div className="py-10 text-center text-sm text-gray-600">
            No products match &ldquo;{search}&rdquo;.
          </div>
        </Card>
      ) : (
        /* Product table */
        <div className="overflow-hidden rounded-xl border border-brand-100 bg-white">
          <div className="flex items-center border-b border-brand-100 bg-brand-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
            <span className="w-14" />
            <span className="flex-1">Product</span>
            <span className="hidden w-24 text-right sm:block">Cost</span>
            <span className="hidden w-28 text-right md:block">Category</span>
            <span className="hidden w-28 text-right lg:block">Added</span>
            <span className="w-24 text-right">Actions</span>
          </div>
          {filtered.map((product) => (
            <div
              key={product.vizzle_product_id}
              className="group flex items-center border-b border-brand-50 px-4 py-3 last:border-0 hover:bg-brand-50/60"
            >
              <div className="w-14">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-10 w-10 rounded-lg border border-gray-200 object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <ImageIcon size={14} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {product.brand} · <span className="font-mono">{product.product_id}</span>
                </p>
              </div>
              <span className="hidden w-24 text-right text-sm font-medium text-gray-800 sm:block">
                ₹{product.cost.toFixed(2)}
              </span>
              <div className="hidden w-28 justify-end md:flex">
                {product.category ? (
                  <Badge variant="info">{product.category}</Badge>
                ) : (
                  <span className="text-xs text-gray-500">—</span>
                )}
              </div>
              <span className="hidden w-28 text-right text-xs text-gray-500 lg:block">
                {formatDate(product.created_at)}
              </span>
              <div className="flex w-24 items-center justify-end gap-1">
                {product.image_url && (
                  <a
                    href={product.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 opacity-0 transition hover:bg-gray-100 group-hover:opacity-100"
                    aria-label="Open image"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => openEditModal(product)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-brand-50 hover:text-brand-700"
                  aria-label="Edit product"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingProduct(product);
                    setDeleteOpen(true);
                  }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete product"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-100 px-4 py-2.5 text-xs font-medium text-gray-600">
            {formatNumber(filtered.length)} products
          </div>
        </div>
      )}

      {/* Add product modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          clearSelectedLocalImage();
        }}
        title="Add Product"
        size="lg"
      >
        {/* Tab switcher */}
        <div className="mb-5 flex gap-1 rounded-lg bg-gray-100 p-1">
          {[
            { id: "url", label: "Direct URL", icon: LinkIcon },
            { id: "file", label: "File Upload", icon: Upload },
            { id: "bulk", label: "Bulk JSON", icon: FileJson },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setUploadTab(tab.id as UploadTab)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                uploadTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* URL tab */}
        {uploadTab === "url" && (
          <form className="space-y-4" onSubmit={urlForm.handleSubmit(onUrlSubmit)}>
            <Input label="Image URL" placeholder="https://cdn.example.com/shirt.jpg" {...urlForm.register("image_url", { required: "Image URL is required" })} error={urlForm.formState.errors.image_url?.message} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Product ID (SKU)" placeholder="sku-001" {...urlForm.register("product_id", { required: true })} />
              <Input label="Name" placeholder="Blue Shirt" {...urlForm.register("name", { required: true })} />
              <Input label="Brand" placeholder="Acme" {...urlForm.register("brand", { required: true })} />
              <Input label="Cost (₹)" type="number" step="0.01" placeholder="299.00" {...urlForm.register("cost", { required: true, valueAsNumber: true })} />
            </div>
            <Button className="w-full" type="submit" loading={createProduct.isPending}>
              Save Product
            </Button>
          </form>
        )}

        {/* File upload tab */}
        {uploadTab === "file" && (
          <form className="space-y-4" onSubmit={fileForm.handleSubmit(onFileSubmit)}>
            <div
              className={cn(
                "cursor-pointer rounded-xl border-2 border-dashed border-gray-300 text-center transition-colors hover:border-brand-400",
                filePreviewUrl ? "relative p-3" : "p-8"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {filePreviewUrl ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelectedLocalImage();
                    }}
                    className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    aria-label="Remove selected image"
                  >
                    <X size={14} />
                  </button>
                  <img
                    src={filePreviewUrl}
                    alt="Selected product preview"
                    className="h-48 w-full rounded-lg border border-gray-200 bg-white object-contain"
                  />
                  <p className="mt-2 truncate text-xs font-medium text-gray-700">
                    {filePreviewName}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">Click area to choose a different image</p>
                </>
              ) : (
                <>
                  <Upload size={22} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to select an image</p>
                  <p className="mt-0.5 text-xs text-gray-400">JPG, PNG or WebP</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => onSelectLocalImage(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Product ID (SKU)" placeholder="sku-001" {...fileForm.register("product_id", { required: true })} />
              <Input label="Name" placeholder="Blue Shirt" {...fileForm.register("name", { required: true })} />
              <Input label="Brand" placeholder="Acme" {...fileForm.register("brand", { required: true })} />
              <Input label="Cost (₹)" type="number" step="0.01" placeholder="299.00" {...fileForm.register("cost", { required: true, valueAsNumber: true })} />
            </div>
            <Button className="w-full" type="submit">
              Upload Product
            </Button>
          </form>
        )}

        {/* Bulk JSON tab */}
        {uploadTab === "bulk" && (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              Paste an array of products. Each item needs: <code className="font-mono">id</code>, <code className="font-mono">name</code>, <code className="font-mono">cost</code>, <code className="font-mono">image_url</code>.
            </p>
            <textarea
              rows={10}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <Button className="w-full" onClick={onBulkSubmit} loading={bulkProducts.isPending}>
              Import Products
            </Button>
          </div>
        )}
      </Modal>

      {/* Edit product modal */}
      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
        size="lg"
      >
        {editingProduct && (
          <form className="space-y-4" onSubmit={editForm.handleSubmit(onEditSubmit)}>
            <Input
              label="Product ID (SKU)"
              value={editingProduct.product_id}
              disabled
            />
            <Input
              label="Image URL"
              placeholder="https://cdn.example.com/shirt.jpg"
              {...editForm.register("image_url", { required: "Image URL is required" })}
              error={editForm.formState.errors.image_url?.message}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Name"
                placeholder="Blue Shirt"
                {...editForm.register("name", { required: true })}
              />
              <Input
                label="Brand"
                placeholder="Acme"
                {...editForm.register("brand", { required: true })}
              />
              <Input
                label="Cost (₹)"
                type="number"
                step="0.01"
                placeholder="29.99"
                {...editForm.register("cost", { required: true, valueAsNumber: true })}
              />
              <Input
                label="Category"
                placeholder="Shirts"
                {...editForm.register("category")}
              />
            </div>
            <Button className="w-full" type="submit" loading={updateProduct.isPending}>
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
          setDeletingProduct(null);
        }}
        title="Delete Product"
      >
        <p className="text-sm text-gray-600">
          Delete <span className="font-semibold text-gray-900">{deletingProduct?.name}</span>?
          This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setDeleteOpen(false);
              setDeletingProduct(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteProduct.isPending}
            onClick={onDeleteConfirm}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
