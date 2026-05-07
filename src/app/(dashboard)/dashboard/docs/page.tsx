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

// ── snippet builders ─────────────────────────────────────────────────────────

function makeCurl(base: string, key: string, sku: string) {
  return `curl -X POST ${base}/api/v1/tryon \\
  -H "x-api-key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{"product_id":"${sku}","user_photo_url":"https://your-cdn.com/photo.jpg"}'`;
}

function makeReact(base: string, key: string, sku: string) {
  return `const res = await fetch("${base}/api/v1/tryon", {
  method: "POST",
  headers: { "x-api-key": "${key}", "Content-Type": "application/json" },
  body: JSON.stringify({ product_id: "${sku}", user_photo_url: photoUrl }),
});
const { output_url } = await res.json();  // show output_url in <img>`;
}

function makeHtml(base: string, key: string, sku: string) {
  return `<script>
async function vizzleTryon(photoUrl) {
  const r = await fetch("${base}/api/v1/tryon", {
    method:"POST", headers:{"x-api-key":"${key}","Content-Type":"application/json"},
    body: JSON.stringify({ product_id:"${sku}", user_photo_url: photoUrl })
  });
  const { output_url } = await r.json();
  document.getElementById("result").src = output_url;
}
</script>

<input type="file" onchange="vizzleTryon(URL.createObjectURL(this.files[0]))" />
<img id="result" />`;
}

function buildJson(opts: { base: string; key: string; sku: string; store: { store_name: string; domain: string } | null }) {
  return {
    title: "Vizzle Integration",
    base_url: opts.base,
    store: opts.store,
    endpoint: `POST ${opts.base}/api/v1/tryon`,
    headers: { "x-api-key": opts.key, "Content-Type": "application/json" },
    body: { product_id: opts.sku, user_photo_url: "<shopper photo URL you host>" },
    response: { output_url: "<try-on result image URL>" },
    snippets: { curl: makeCurl(opts.base, opts.key, opts.sku), js: makeReact(opts.base, opts.key, opts.sku) },
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

  const curlSnip  = useMemo(() => makeCurl(baseUrl, liveKey, liveSku),  [baseUrl, liveKey]);
  const jsSnip    = useMemo(() => makeReact(baseUrl, liveKey, liveSku), [baseUrl, liveKey]);
  const htmlSnip  = useMemo(() => makeHtml(baseUrl, liveKey, liveSku),  [baseUrl, liveKey]);

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
            { icon: Key,       n: 1, title: "Get your API key",        body: <><Link href="/dashboard/stores" className="font-medium text-brand-600 hover:underline">Create a store</Link> → copy the <IC>vzk_…</IC> key shown once. Put it in your backend env vars.</> },
            { icon: Package,   n: 2, title: "Add your products",       body: <><Link href="/dashboard/products" className="font-medium text-brand-600 hover:underline">Upload garments</Link> and note each <IC>product_id</IC> (your SKU). That's all Vizzle needs from you.</> },
            { icon: Zap,       n: 3, title: "Embed the widget",        body: <>When a shopper picks a photo, host it on your server, then call <IC>POST /api/v1/tryon</IC> with the photo URL + SKU. Show the returned <IC>output_url</IC> in an image tag.</> },
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

      {/* Request / response at a glance */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Request at a glance</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-gray-700">Send</p>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
              <div><span className="text-brand-600 font-bold">POST</span> /api/v1/tryon</div>
              <div className="text-gray-500">x-api-key: {liveKey}</div>
              <div className="text-gray-800">{`{ "product_id": "${liveSku}",`}</div>
              <div className="text-gray-800">&nbsp;&nbsp;{`"user_photo_url": "…" }`}</div>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-gray-700">Receive</p>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-xs text-emerald-800 space-y-1">
              <div className="font-bold">200 OK</div>
              <div>{`{ "output_url": "https://…/result.jpg",`}</div>
              <div>&nbsp;&nbsp;{`"prediction_id": "abc123" }`}</div>
              <div className="mt-2 text-emerald-600 not-italic text-xs">Use output_url as &lt;img src&gt;</div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">Typical response time: 20–45 seconds. Show a loading state.</p>
      </div>

      {/* Code snippets — tabbed */}
      <SnippetTabs
        active={active}
        tabs={[
          { id: "curl",  label: "cURL",      code: curlSnip  },
          { id: "js",    label: "JavaScript", code: jsSnip    },
          { id: "html",  label: "HTML",        code: htmlSnip  },
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
