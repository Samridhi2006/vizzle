"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Key, Package, Store as StoreIcon, Zap } from "lucide-react";
import Link from "next/link";
import { useStoresStore } from "@/store/stores.store";
import { useStoresQuery } from "@/hooks/useStores";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/client/utils";

function IC({ children }: { children: string }) {
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-800">{children}</code>;
}

// ── snippet builders (2-call flow: upload → tryon → output_url) ──────────────

function makeCurl(base: string, key: string, sku: string) {
  return `# 1. Upload shopper photo → get a URL
curl -X POST ${base}/api/v1/upload \\
  -H "x-api-key: ${key}" \\
  -F "photo=@shopper.jpg"
# → { "url": "https://res.cloudinary.com/..." }

# 2. Run try-on → get result image URL (waits 30–90 s)
curl -X POST ${base}/api/v1/tryon \\
  -H "x-api-key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{"product_id":"${sku}","user_photo_url":"<url from step 1>"}'
# → { "output_url": "https://res.cloudinary.com/..." }`;
}

function makeReact(base: string, key: string, sku: string) {
  return `async function tryon(file) {
  // 1. Upload shopper photo
  const form = new FormData();
  form.append("photo", file);
  const { url } = await fetch("${base}/api/v1/upload", {
    method: "POST", headers: { "x-api-key": "${key}" }, body: form,
  }).then(r => r.json());

  // 2. Run try-on (server waits for the model, ~30–90 s)
  const { output_url } = await fetch("${base}/api/v1/tryon", {
    method: "POST",
    headers: { "x-api-key": "${key}", "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: "${sku}", user_photo_url: url }),
  }).then(r => r.json());

  return output_url; // set as <img src={output_url} />
}`;
}

function makeHtml(base: string, key: string, sku: string) {
  return `<input type="file" id="photo" accept="image/*" />
<button onclick="runTryon()">Try it on!</button>
<img id="result" style="max-width:400px;margin-top:12px" />

<script>
async function runTryon() {
  const form = new FormData();
  form.append("photo", document.getElementById("photo").files[0]);

  const { url } = await fetch("${base}/api/v1/upload", {
    method: "POST", headers: { "x-api-key": "${key}" }, body: form,
  }).then(r => r.json());

  const { output_url } = await fetch("${base}/api/v1/tryon", {
    method: "POST",
    headers: { "x-api-key": "${key}", "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: "${sku}", user_photo_url: url }),
  }).then(r => r.json());

  document.getElementById("result").src = output_url;
}
</script>`;
}

function makeDirectCurl(base: string, key: string) {
  return `# One call — no catalog registration needed.
# Pass your garment's image URL directly; usage is still tracked by your API key.
curl -X POST ${base}/api/v1/tryon/direct \\
  -H "x-api-key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_photo_url": "https://your-cdn.com/shopper.jpg",
    "product_image_url": "https://your-cdn.com/shirt.jpg"
  }'
# → { "prediction_id": "abc123", "output_url": "https://res.cloudinary.com/..." }`;
}

function makeCatalogCurl(base: string, key: string, sku: string) {
  return `# 1. Upload garment image → get a permanent URL
curl -X POST ${base}/api/v1/products/upload-image \\
  -H "x-api-key: ${key}" \\
  -F "garment=@shirt.jpg"
# → { "image_url": "https://res.cloudinary.com/..." }

# 2. Register / update product with that URL (upsert by product_id)
curl -X POST ${base}/api/v1/products \\
  -H "x-api-key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_id": "${sku}",
    "name": "Blue Linen Shirt",
    "brand": "Zara",
    "cost": 1299,
    "image_url": "<url from step 1>",
    "category": "shirt",
    "size_chart_url": "https://..."
  }'
# → { "vizzle_product_id": "clx...", "product_id": "${sku}", "image_url": "..." }

# 2b. (Optional) Batch upsert up to 1 000 products at once
curl -X POST ${base}/api/v1/products/batch \\
  -H "x-api-key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "products": [
      { "product_id": "SKU-001", "name": "Blue Shirt", "brand": "Zara", "cost": 1299, "image_url": "https://..." },
      { "product_id": "SKU-002", "name": "Red Shirt",  "brand": "Zara", "cost": 999,  "image_url": "https://..." }
    ]
  }'
# → { "imported": 2, "errors": [] }`;
}

function buildJson(opts: { base: string; key: string; sku: string; store: { store_name: string; domain: string } | null }) {
  return {
    title: "Vizzle Integration",
    base_url: opts.base,
    store: opts.store,
    flow: [
      `POST ${opts.base}/api/v1/upload  (multipart photo)  →  { url }`,
      `POST ${opts.base}/api/v1/tryon   (product_id + url)  →  { output_url }`,
    ],
    auth_header: `x-api-key: ${opts.key}`,
    snippets: { curl: makeCurl(opts.base, opts.key, opts.sku), js: makeReact(opts.base, opts.key, opts.sku) },
    note: "Server waits for the ML model (30–90 s). Shopper photos and results are auto-deleted after 1 hour.",
  };
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const { data: storesData } = useStoresQuery();
  const stores = storesData?.stores ?? [];
  const { selectedStore, setSelectedStore } = useStoresStore();
  const addToast = useUIStore((s) => s.addToast);

  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [guideCopied, setGuideCopied]     = useState(false);
  const [baseUrl, setBaseUrl]             = useState("https://dashboard.vizzle.in");

  useEffect(() => { setBaseUrl(window.location.origin); }, []);

  const active = selectedStore ?? stores[0] ?? null;
  const liveKey = active ? `vzk_${active.active_key_prefix}•••` : "vzk_YOUR_KEY";
  const liveSku = "PRODUCT_SKU";

  const curlSnip    = useMemo(() => makeCurl(baseUrl, liveKey, liveSku),        [baseUrl, liveKey]);
  const jsSnip      = useMemo(() => makeReact(baseUrl, liveKey, liveSku),       [baseUrl, liveKey]);
  const htmlSnip    = useMemo(() => makeHtml(baseUrl, liveKey, liveSku),        [baseUrl, liveKey]);
  const directSnip  = useMemo(() => makeDirectCurl(baseUrl, liveKey),           [baseUrl, liveKey]);
  const catalogSnip = useMemo(() => makeCatalogCurl(baseUrl, liveKey, liveSku), [baseUrl, liveKey]);

  const copyGuide = useCallback(async () => {
    try {
      const json = buildJson({ base: baseUrl, key: liveKey, sku: liveSku, store: active ? { store_name: active.store_name, domain: active.domain } : null });
      await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
      setGuideCopied(true);
      addToast({ tone: "success", title: "Copied as JSON" });
      setTimeout(() => setGuideCopied(false), 1600);
    } catch { addToast({ tone: "error", title: "Clipboard access denied" }); }
  }, [baseUrl, liveKey, active, addToast]);

  return (
    <div className="max-w-2xl space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Integration Guide</h2>
          <p className="mt-1 text-sm text-gray-500">Drop the try-on widget into any site in minutes.</p>
        </div>
        <button
          onClick={copyGuide}
          className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-black bg-brand-400 px-3 py-2 text-xs font-bold text-black hover:bg-brand-500 transition-colors"
        >
          {guideCopied ? <Check size={13} /> : <Copy size={13} />}
          {guideCopied ? "Copied!" : "Copy as JSON"}
        </button>
      </div>

      {/* Store selector */}
      {stores.length > 0 ? (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-700">Snippets pre-filled for</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setStoreMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-brand-50 transition-colors"
              >
                <StoreIcon size={13} className="text-brand-600" />
                {active?.store_name ?? "Select store"}
                <ChevronDown size={13} />
              </button>
              {storeMenuOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-xl border border-brand-200 bg-white shadow-lg">
                  {stores.map((s) => (
                    <button key={s.store_id} onClick={() => { setSelectedStore(s); setStoreMenuOpen(false); }}
                      className={cn("w-full px-4 py-2.5 text-left text-sm hover:bg-brand-50", active?.store_id === s.store_id ? "font-bold text-brand-700" : "text-gray-700")}>
                      {s.store_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {active && (
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 font-mono text-gray-700">
                  {liveKey}
                </span>
                <Link href="/dashboard/stores" className="flex items-center gap-1 text-brand-600 hover:underline font-medium">
                  Get full key <ExternalLink size={10} />
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>No store yet.</strong>{" "}
          <Link href="/dashboard/stores" className="underline font-medium">Create a store</Link>{" "}
          to get your API key — snippets will auto-fill.
        </div>
      )}

      {/* 3-step overview */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">How to integrate</p>
        <ol className="space-y-4">
          {[
            { icon: Key,     n: 1, title: "Get your API key",   body: <><Link href="/dashboard/stores" className="font-medium text-brand-600 hover:underline">Create a store</Link> → copy the <IC>vzk_…</IC> key shown once.</> },
            { icon: Package, n: 2, title: "Upload your garments", body: <><Link href="/dashboard/products" className="font-medium text-brand-600 hover:underline">Add products</Link> and note each <IC>product_id</IC> (your SKU).</> },
            { icon: Zap,     n: 3, title: "2 API calls in your widget", body: <>Call <IC>POST /api/v1/upload</IC> with the shopper photo → then <IC>POST /api/v1/tryon</IC> with the URL + SKU → show the returned <IC>output_url</IC> in an <IC>{"<img>"}</IC>. The server waits for the ML model (30–90 s). Photos auto-deleted after 1 hour.</> },
          ].map(({ icon: Icon, n, title, body }) => (
            <li key={n} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{n}</span>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={13} className="text-brand-600" />
                  <span className="text-sm font-semibold text-gray-900">{title}</span>
                </div>
                <p className="text-sm text-gray-600">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Request / response at a glance — 2 calls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">API flow at a glance</p>
        <div className="space-y-3">
          {/* Call 1 */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
              <div className="mb-1 text-gray-400 not-mono text-[11px] font-semibold">① Upload shopper photo</div>
              <div><span className="text-brand-600 font-bold">POST</span> /api/v1/upload</div>
              <div className="text-gray-500">x-api-key: {liveKey}</div>
              <div className="text-gray-800">body: photo (multipart)</div>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-xs text-emerald-800 space-y-1">
              <div className="mb-1 text-emerald-600 not-mono text-[11px] font-semibold">Response</div>
              <div>{`{ "url": "https://res.cloudinary.com/…" }`}</div>
              <div className="mt-1 text-emerald-600 text-[11px]">Pass url into call ②</div>
            </div>
          </div>
          {/* Call 2 */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
              <div className="mb-1 text-gray-400 not-mono text-[11px] font-semibold">② Virtual try-on (waits for result)</div>
              <div><span className="text-brand-600 font-bold">POST</span> /api/v1/tryon</div>
              <div className="text-gray-500">x-api-key: {liveKey}</div>
              <div className="text-gray-800">{`{ "product_id": "${liveSku}",`}</div>
              <div className="text-gray-800">&nbsp;&nbsp;{`"user_photo_url": "<url from ①>" }`}</div>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-xs text-emerald-800 space-y-1">
              <div className="mb-1 text-emerald-600 not-mono text-[11px] font-semibold">Response (200 when done)</div>
              <div>{`{ "output_url": "https://res.cloudinary.com/…",`}</div>
              <div>&nbsp;&nbsp;{`"prediction_id": "abc123" }`}</div>
              <div className="mt-1 text-emerald-600 text-[11px]">Set output_url as &lt;img src&gt;</div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">Server waits for the ML model (30–90 s typical). Shopper photos and results auto-deleted after 1 hour.</p>
      </div>

      {/* Quick try-on — no catalog sync required */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">Quick try-on (no catalog sync)</p>
        <p className="mb-4 text-sm text-gray-500">
          Can&apos;t always sync your catalog? Skip product registration entirely — pass both image URLs
          directly in one call. Usage is still tracked against your API key.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
            <div className="mb-1 text-gray-400 not-mono text-[11px] font-semibold">One call · no product_id needed</div>
            <div><span className="text-brand-600 font-bold">POST</span> /api/v1/tryon/direct</div>
            <div className="text-gray-500">x-api-key: {liveKey}</div>
            <div className="text-gray-800">{`{ "user_photo_url": "…",`}</div>
            <div className="text-gray-800">&nbsp;&nbsp;{`"product_image_url": "…" }`}</div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-xs text-emerald-800 space-y-1">
            <div className="mb-1 text-emerald-600 not-mono text-[11px] font-semibold">Response</div>
            <div>{`{ "prediction_id": "abc123",`}</div>
            <div>&nbsp;&nbsp;{`"output_url": "https://…" }`}</div>
            <div className="mt-1 text-emerald-600 text-[11px]">Tracked by your API key automatically</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Tracking here is per-store (by API key) only — no per-product breakdown. For per-product analytics,
          register products via the Catalog API below and use <IC>POST /api/v1/tryon</IC> instead.
        </p>
      </div>

      {/* Catalog API — product upload & management */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">Catalog API</p>
        <p className="mb-4 text-sm text-gray-500">
          Register your garment catalog via API key. All endpoints are upserts — posting the same{" "}
          <IC>product_id</IC> again updates the existing product.
        </p>
        <div className="space-y-3">

          {/* Upload image */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
              <div className="mb-1 text-gray-400 not-mono text-[11px] font-semibold">① Upload garment image</div>
              <div><span className="text-brand-600 font-bold">POST</span> /api/v1/products/upload-image</div>
              <div className="text-gray-500">x-api-key: {liveKey}</div>
              <div className="text-gray-800">body: garment (multipart, ≤ 10 MB)</div>
              <div className="text-gray-500 text-[10px] mt-1">JPEG · PNG · WebP</div>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-xs text-emerald-800 space-y-1">
              <div className="mb-1 text-emerald-600 not-mono text-[11px] font-semibold">Response</div>
              <div>{`{ "image_url": "https://res.cloudinary.com/…" }`}</div>
              <div className="mt-1 text-emerald-600 text-[11px]">Permanent URL — pass into ②</div>
            </div>
          </div>

          {/* Upsert single */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
              <div className="mb-1 text-gray-400 not-mono text-[11px] font-semibold">② Register / update product</div>
              <div><span className="text-brand-600 font-bold">POST</span> /api/v1/products</div>
              <div className="text-gray-500">x-api-key: {liveKey}</div>
              <div className="text-gray-800">{`{ "product_id": "${liveSku}",`}</div>
              <div className="text-gray-800">&nbsp;&nbsp;{`"name": "…", "brand": "…", "cost": 0,`}</div>
              <div className="text-gray-800">&nbsp;&nbsp;{`"image_url": "<url from ①>" }`}</div>
              <div className="text-gray-400 text-[10px] mt-1">Optional: category · size_chart_url · custom_fields</div>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-xs text-emerald-800 space-y-1">
              <div className="mb-1 text-emerald-600 not-mono text-[11px] font-semibold">Response</div>
              <div>{`{ "vizzle_product_id": "clx…",`}</div>
              <div>&nbsp;&nbsp;{`"product_id": "${liveSku}",`}</div>
              <div>&nbsp;&nbsp;{`"image_url": "https://…" }`}</div>
              <div className="mt-1 text-emerald-600 text-[11px]">Use product_id in /api/v1/tryon</div>
            </div>
          </div>

          {/* Batch */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
              <div className="mb-1 text-gray-400 not-mono text-[11px] font-semibold">② (batch) Register up to 1 000 products</div>
              <div><span className="text-brand-600 font-bold">POST</span> /api/v1/products/batch</div>
              <div className="text-gray-500">x-api-key: {liveKey}</div>
              <div className="text-gray-800">{`{ "products": [`}</div>
              <div className="text-gray-800">&nbsp;&nbsp;{`{ "product_id": "…", "name": "…",`}</div>
              <div className="text-gray-800">&nbsp;&nbsp;&nbsp;&nbsp;{`"brand": "…", "cost": 0, "image_url": "…" }`}</div>
              <div className="text-gray-800">{`] }`}</div>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-xs text-emerald-800 space-y-1">
              <div className="mb-1 text-emerald-600 not-mono text-[11px] font-semibold">Response (HTTP 207)</div>
              <div>{`{ "imported": 2, "errors": [] }`}</div>
              <div className="mt-1 text-emerald-600 text-[11px]">Partial success — check errors array</div>
            </div>
          </div>

        </div>
        <p className="mt-3 text-xs text-gray-400">
          Rate limit: 100 requests / 60 s per store. All endpoints are upserts — safe to re-run for catalog sync.
        </p>
      </div>

      {/* Code snippets — tabbed */}
      <SnippetTabs
        active={active}
        tabs={[
          { id: "curl",    label: "Try-on cURL",  code: curlSnip    },
          { id: "js",      label: "JavaScript",   code: jsSnip      },
          { id: "html",    label: "HTML",          code: htmlSnip    },
          { id: "direct",  label: "Quick cURL",    code: directSnip  },
          { id: "catalog", label: "Catalog cURL",  code: catalogSnip },
        ]}
      />

    </div>
  );
}

// ── tabbed snippet panel ─────────────────────────────────────────────────────
function SnippetTabs({
  tabs,
  active,
}: {
  tabs: { id: string; label: string; code: string }[];
  active: { store_name: string } | null;
}) {
  const [tab, setTab] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === tab) ?? tabs[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 shadow-sm">
      {/* tab bar */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                tab === t.id
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {active && (
            <span className="hidden rounded-full bg-emerald-900 px-2 py-0.5 text-xs font-medium text-emerald-400 sm:block">
              {active.store_name}
            </span>
          )}
          <CopyButton code={current.code} />
        </div>
      </div>

      {/* code */}
      <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-gray-100">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
