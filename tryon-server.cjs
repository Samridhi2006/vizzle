// tryon-server.cjs  —  Virtual Try-On proxy server (CommonJS)
// Calls Replicate's IDM-VTON model and streams back the result.
// Run with: node tryon-server.cjs

require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors    = require("cors");
const multer  = require("multer");

const app    = express();
const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } }); // 20 MB max
const PORT   = process.env.PORT || 3001;
const TOKEN  = process.env.REPLICATE_API_TOKEN;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "25mb" }));

/* ── Health check ────────────────────────────────────────────── */
app.get("/api/health", (_req, res) => res.json({ ok: true, message: "Vizzle try-on server running" }));

/* ── Helpers ─────────────────────────────────────────────────── */
async function fetchJSON(url, options) {
  const { default: fetch } = await import("node-fetch");
  const res = await fetch(url, options);
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

function bufferToDataURL(buffer, mimetype) {
  return `data:${mimetype};base64,${buffer.toString("base64")}`;
}

/* ── POST /api/tryon ─────────────────────────────────────────── */
// Accepts multipart form with `customerImage` and `garmentImage` files.
// Returns { resultUrl } on success.
app.post(
  "/api/tryon",
  upload.fields([{ name: "customerImage" }, { name: "garmentImage" }]),
  async (req, res) => {
    try {
      if (!TOKEN || TOKEN === "your_replicate_api_key_here") {
        return res.status(500).json({ error: "REPLICATE_API_TOKEN not set in .env.local" });
      }

      const customerFile = req.files?.["customerImage"]?.[0];
      const garmentFile  = req.files?.["garmentImage"]?.[0];

      if (!customerFile || !garmentFile) {
        return res.status(400).json({ error: "Both customerImage and garmentImage are required." });
      }

      const customerDataURL = bufferToDataURL(customerFile.buffer, customerFile.mimetype);
      const garmentDataURL  = bufferToDataURL(garmentFile.buffer,  garmentFile.mimetype);

      console.log(`[tryon] Starting prediction for ${customerFile.originalname} + ${garmentFile.originalname}`);

      // ── 1. Create prediction ──────────────────────────────────
      const createRes = await fetchJSON("https://api.replicate.com/v1/predictions", {
        method:  "POST",
        headers: {
          Authorization:  `Token ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4", // IDM-VTON
          input: {
            human_img:    customerDataURL,
            garm_img:     garmentDataURL,
            garment_des:  req.body?.garmentDesc || "a garment",
            is_checked:   true,
            is_checked_crop: false,
            denoise_steps: 30,
            seed:         42,
          },
        }),
      });

      if (!createRes.ok) {
        console.error("[tryon] Replicate create error:", createRes.data);
        return res.status(502).json({ error: "Replicate API error", detail: createRes.data });
      }

      const prediction = createRes.data;
      console.log(`[tryon] Prediction created: ${prediction.id}`);

      // ── 2. Poll until done ────────────────────────────────────
      const pollUrl = `https://api.replicate.com/v1/predictions/${prediction.id}`;
      const maxWait = 120_000; // 2 min
      const interval = 2000;
      const deadline = Date.now() + maxWait;

      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, interval));

        const pollRes = await fetchJSON(pollUrl, {
          headers: { Authorization: `Token ${TOKEN}` },
        });

        if (!pollRes.ok) {
          return res.status(502).json({ error: "Poll error", detail: pollRes.data });
        }

        const { status, output, error: repErr } = pollRes.data;
        console.log(`[tryon] Status: ${status}`);

        if (status === "succeeded") {
          const resultUrl = Array.isArray(output) ? output[0] : output;
          console.log(`[tryon] Done! Result: ${resultUrl}`);
          return res.json({ resultUrl });
        }

        if (status === "failed" || status === "canceled") {
          return res.status(500).json({ error: `Prediction ${status}`, detail: repErr });
        }
        // else: "starting" | "processing" — keep polling
      }

      return res.status(504).json({ error: "Timeout waiting for Replicate result." });
    } catch (err) {
      console.error("[tryon] Unexpected error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

app.listen(PORT, () => {
  console.log(`\n🚀 Vizzle Try-On Server running on http://localhost:${PORT}`);
  if (!TOKEN || TOKEN === "your_replicate_api_key_here") {
    console.warn("⚠️  REPLICATE_API_TOKEN not set — add your key to .env.local");
  } else {
    console.log("✅  Replicate token loaded.");
  }
  console.log("\nEndpoints:");
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  POST http://localhost:${PORT}/api/tryon  (multipart: customerImage, garmentImage)\n`);
});
