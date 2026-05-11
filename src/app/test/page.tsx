"use client";

/**
 * /test — Virtual Try-On smoke test.
 *
 * Uses real API routes:
 *   1. POST /api/v1/upload          → upload photo → { url }
 *   2. POST /api/v1/tryon           → start ML job → { prediction_id }
 *   3. GET /api/v1/tryon/status/{id} → poll every 3s → { status, output_url }
 */

import { useState, useCallback } from "react";

const POLL_INTERVAL = 3000;
const MAX_POLLS     = 80;

function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

export default function TestPage() {
  const [apiKey,    setApiKey]    = useState("");
  const [sku,       setSku]       = useState("");
  const [file,      setFile]      = useState<File | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [logs,      setLogs]      = useState<string[]>([]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [busy,      setBusy]      = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const log = (msg: string) => {
    console.log("[test]", msg);
    setLogs((p) => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const run = useCallback(async () => {
    if (!apiKey.trim() || !sku.trim() || !file) {
      setError("Fill in all fields."); return;
    }
    setBusy(true);
    setError(null);
    setOutputUrl(null);
    setLogs([]);

    const key = apiKey.trim();

    try {
      // ── Step 1: upload ──────────────────────────────────────────────────────
      log("STEP 1: Uploading photo…");
      const form = new FormData();
      form.append("photo", file);
      const upRes = await fetch("/api/v1/upload", {
        method: "POST",
        headers: { "x-api-key": key },
        body: form,
      });
      const upText = await upRes.text();
      log(`Upload response: ${upRes.status} ${upText.slice(0, 200)}`);
      if (!upRes.ok) throw new Error(`Upload ${upRes.status}: ${upText}`);
      const { url: photoUrl } = JSON.parse(upText) as { url: string };
      log(`✓ Photo URL: ${photoUrl}`);

      // ── Step 2: start ML ────────────────────────────────────────────────────
      log("STEP 2: Starting ML job…");
      const startRes = await fetch("/api/v1/tryon", {
        method: "POST",
        headers: { "x-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: sku.trim(), user_photo_url: photoUrl }),
      });
      const startText = await startRes.text();
      log(`Start response: ${startRes.status} ${startText.slice(0, 300)}`);
      if (!startRes.ok) throw new Error(`Start ${startRes.status}: ${startText}`);
      const startJson = JSON.parse(startText) as { prediction_id?: string; status?: string };
      if (!startJson.prediction_id) throw new Error(`No prediction_id: ${startText}`);
      log(`✓ prediction_id: ${startJson.prediction_id}  status: ${startJson.status}`);

      // ── Step 3: poll ────────────────────────────────────────────────────────
      log("STEP 3: Polling status every 3s…");
      const pid = startJson.prediction_id;

      for (let i = 1; i <= MAX_POLLS; i++) {
        await sleep(POLL_INTERVAL);

        let pollText: string;
        let pollStatus: number;
        try {
          const pollRes = await fetch(`/api/v1/tryon/status/${pid}`, {
            headers: { "x-api-key": key },
          });
          pollStatus = pollRes.status;
          pollText = await pollRes.text();
        } catch (fetchErr) {
          log(`Poll ${i}: FETCH ERROR: ${fetchErr}`);
          continue;
        }

        log(`Poll ${i}: HTTP ${pollStatus} → ${pollText.slice(0, 300)}`);

        if (pollStatus !== 200) continue;

        let poll: { status?: string; output_url?: string | null; error?: string | null; model_used?: string | null };
        try {
          poll = JSON.parse(pollText);
        } catch {
          log(`Poll ${i}: BAD JSON`);
          continue;
        }

        if (poll.status === "succeeded") {
          if (poll.output_url) {
            setOutputUrl(poll.output_url);
            log(`✓ DONE! output_url: ${poll.output_url}`);
            return;
          }
          throw new Error(`succeeded but output_url is null/empty: ${pollText}`);
        }
        if (poll.status === "failed" || poll.status === "canceled") {
          throw new Error(`ML ${poll.status}: ${poll.error ?? "no details"}`);
        }
        // starting / processing → keep polling
      }
      throw new Error(`Timed out after ${MAX_POLLS * 3}s.`);

    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`ERROR: ${msg}`);
      setError(msg);
    } finally {
      setBusy(false);
    }
  }, [apiKey, sku, file]);

  return (
    <div className="mx-auto max-w-lg px-4 py-10 font-sans">
      <h1 className="mb-1 text-xl font-bold">Virtual Try-On · Test</h1>
      <p className="mb-6 text-xs text-gray-500">Uses /api/v1/upload → /api/v1/tryon → poll /status/</p>

      <label className="mb-3 block text-sm font-medium">
        API key
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
          placeholder="vzk_…" autoComplete="off"
          className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 font-mono text-xs" />
      </label>

      <label className="mb-3 block text-sm font-medium">
        Product SKU
        <input type="text" value={sku} onChange={(e) => setSku(e.target.value)}
          placeholder="e.g. SHIRT-001"
          className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm" />
      </label>

      <label className="mb-5 block text-sm font-medium">
        Shopper photo
        <input type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0] ?? null; setFile(f); setPreview(f ? URL.createObjectURL(f) : null); }}
          className="mt-1 block w-full text-sm" />
        {preview && <img src={preview} alt="preview" className="mt-2 h-28 rounded-lg border object-cover" />}
      </label>

      <button onClick={run} disabled={busy}
        className="mb-5 w-full rounded-xl border-2 border-black bg-sky-200 px-4 py-2.5 text-sm font-semibold hover:bg-sky-300 disabled:opacity-50">
        {busy ? "Working… keep tab open" : "Run Try-On"}
      </button>

      {error && <pre className="mb-4 whitespace-pre-wrap rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900">{error}</pre>}

      {outputUrl && (
        <div className="mb-4 space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outputUrl} alt="result" className="w-full rounded-xl border bg-white object-contain shadow" />
          <p className="break-all font-mono text-[11px] text-gray-400">{outputUrl}</p>
        </div>
      )}

      <details open className="rounded-lg border border-gray-200">
        <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-gray-500 select-none">
          Live log ({logs.length} lines)
        </summary>
        <pre className="max-h-80 overflow-y-auto p-3 text-[10px] text-gray-600 whitespace-pre-wrap break-all">
          {logs.length ? logs.join("\n") : "Press Run Try-On to start."}
        </pre>
      </details>
    </div>
  );
}
