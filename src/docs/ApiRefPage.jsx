import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import './apiref.css';

// Optional try-on params — same values as the "Target Garment" and "Garment Fit"
// dropdowns in the try-on app (vizzle-api-platform/src/server/services/garment-options.ts).
const TARGET_GARMENTS = ['Two-piece outfit', 'T-Shirt', 'Shirt', 'Top', 'Kurti', 'Saree', 'Lehenga', 'Dress', 'Jumpsuit', 'Skirt', 'Jeans', 'Trousers', 'Jacket', 'Blazer', 'Coat', 'Other'];
const GARMENT_FITS = ['Natural realistic fit', 'Slim fit', 'Regular fit', 'Loose fit'];

const API_GROUPS = [
  {
    id: 'intro', label: 'Getting Started',
    items: [
      { id: 'authentication', label: 'Authentication',      tag: null },
      { id: 'errors',         label: 'Errors',            tag: null },
      { id: 'credits',        label: 'Credits & Billing',   tag: null },
    ],
  },
  {
    id: 'tryon', label: 'Virtual Try-On',
    items: [
      { id: 'tryon-start',  label: 'Start Try-On',       tag: 'POST' },
      { id: 'tryon-status', label: 'Poll Try-On Status', tag: 'GET'  },
    ],
  },
  {
    id: 'video', label: 'Video Generation',
    items: [
      { id: 'video-start',  label: 'Start Video',       tag: 'POST' },
      { id: 'video-status', label: 'Poll Video Status', tag: 'GET'  },
    ],
  },
  {
    id: 'upload', label: 'Asset Upload',
    items: [{ id: 'upload-photo', label: 'Upload Photo', tag: 'POST' }],
  },
];

const EP = {
  authentication: {
    title: 'Authentication',
    subtitle: 'Every API request must include your store API key in the x-api-key header.',
    type: 'guide',
    content: `<p>Vizzle uses <strong>per-store API keys</strong> prefixed with <code>vzk_</code>. Generate yours from the Vizzle Dashboard under <strong>Settings → API Keys</strong>.</p>
<h4>Header format</h4><pre><code>x-api-key: vzk_YOUR_KEY_HERE</code></pre>
<h4>Security rules</h4><ul>
<li>Never expose your key in client-side JavaScript or public repos</li>
<li>Rotate keys immediately if compromised (Dashboard → API Keys → Revoke)</li>
<li>Each key is scoped to a single store; create separate keys per store</li></ul>`,
    code: {
      curl: `curl -X POST https://dashboard.vizzle.in/api/v1/tryon \\
  -H "x-api-key: vzk_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"product_id":"prod_123","user_photo_url":"https://..."}'`,
      python: `import vizzle\n\nclient = vizzle.VizzleClient(api_key="vzk_YOUR_KEY")\n# All requests are automatically authenticated`,
      javascript: `const headers = {\n  "x-api-key": "vzk_YOUR_KEY",\n  "Content-Type": "application/json",\n};\n\nconst res = await fetch("https://dashboard.vizzle.in/api/v1/tryon", {\n  method: "POST",\n  headers,\n  body: JSON.stringify({ product_id: "prod_123", user_photo_url: "https://..." }),\n});`,
    },
  },

  errors: {
    title: 'Errors',
    subtitle: 'Vizzle uses standard HTTP status codes and consistent JSON error envelopes.',
    type: 'guide',
    content: `<h4>Error envelope</h4><pre><code>{ "error": "Human-readable message here" }</code></pre>
<h4>HTTP status codes</h4>
<table><thead><tr><th>Code</th><th>Meaning</th></tr></thead><tbody>
<tr><td>200 / 202</td><td>Success (202 = async job accepted)</td></tr>
<tr><td>400</td><td>Bad request — missing or invalid body fields</td></tr>
<tr><td>401</td><td>Missing or invalid x-api-key</td></tr>
<tr><td>402</td><td>Insufficient credits — top up in the Dashboard</td></tr>
<tr><td>404</td><td>Product not found for this store</td></tr>
<tr><td>413</td><td>Photo exceeds 10 MB limit</td></tr>
<tr><td>422</td><td>Image rejected by AI moderation</td></tr>
<tr><td>500</td><td>Internal server error — contact support</td></tr>
</tbody></table>`,
    code: {
      curl: `# 402 Insufficient Credits:\n{\n  "error": "Insufficient credits. Please top up your credit pack in the Dashboard."\n}\n\n# 422 AI Moderation rejection (free — no credits deducted):\n{\n  "error": "Image rejected: content policy violation"\n}`,
      python: `from vizzle import VizzleClient, VizzleError, InsufficientCreditsError\n\nclient = VizzleClient(api_key="vzk_YOUR_KEY")\ntry:\n    result = client.tryon("prod_123", "https://...")\nexcept InsufficientCreditsError:\n    print("Top up credits in the Dashboard")\nexcept VizzleError as e:\n    print(f"API error: {e}")`,
      javascript: `const res = await fetch("/api/v1/tryon", { method: "POST", headers, body });\nif (!res.ok) {\n  const { error } = await res.json();\n  if (res.status === 402) console.error("Insufficient credits:", error);\n  else if (res.status === 422) console.error("Moderation rejected:", error);\n  else throw new Error(error);\n}`,
    },
  },

  credits: {
    title: 'Credits & Billing',
    subtitle: 'Vizzle uses a prepaid credit system. Purchase a credit pack and credits are deducted per successful Try-On.',
    type: 'guide',
    content: `<h4>Prepaid Credit Packs — Virtual Try-On</h4>
<table><thead><tr><th>Pack</th><th>Price</th><th>Try-Ons Included</th><th>Rate per Try-On</th></tr></thead><tbody>
<tr><td><strong>Starter</strong></td><td>₹1,000</td><td>160 Try-Ons</td><td>₹6.25</td></tr>
<tr><td><strong>Growth</strong> ⭐ Best Value</td><td>₹2,500</td><td>450 Try-Ons</td><td>₹5.56</td></tr>
<tr><td><strong>Pro</strong></td><td>₹5,000</td><td>960 Try-Ons</td><td>₹5.21</td></tr>
<tr><td><strong>Enterprise</strong></td><td>₹10,000</td><td>2,000 Try-Ons</td><td>₹5.00</td></tr>
</tbody></table>
<h4>How it works</h4><ol>
<li>Credits are deducted <strong>only for successful</strong> Try-Ons — you pay only when the AI delivers a result</li>
<li>If the ML job fails to <em>start</em>, credits are automatically refunded</li>
<li>Completed jobs (succeeded or failed by ML) are not refunded</li>
<li>AI moderation rejections are <strong>free</strong> — no credits deducted</li></ol>
<h4>Top up</h4><p>Buy credit packs in the Dashboard under <strong>Billing</strong> using Razorpay (UPI, cards, net banking). Packs never expire.</p>`,
    code: {
      curl: `# Check current balance (Dashboard API)\ncurl "https://your-app.vercel.app/api/credits?store_id=STORE_ID" \\\n  -H "Authorization: Bearer JWT_TOKEN"\n\n# Response:\n{\n  "balance": 450,\n  "pack": "Growth",\n  "rate_per_tryon": 5.56,\n  "transactions": [...]\n}`,
      python: `from vizzle import VizzleClient\n\nclient = VizzleClient(api_key="vzk_YOUR_KEY", base_url="https://dashboard.vizzle.in")\n# Credits are tracked automatically per successful try-on`,
      javascript: `const res = await fetch(\`/api/credits?store_id=\${storeId}\`, {\n  headers: { Authorization: \`Bearer \${jwtToken}\` },\n});\nconst { balance, pack, rate_per_tryon } = await res.json();\nconsole.log(\`Balance: \${balance} Try-Ons (\${pack} pack @ ₹\${rate_per_tryon}/Try-On)\`);`,
    },
  },

  'tryon-start': {
    title: 'Start Try-On',
    subtitle: 'Initiate an asynchronous virtual garment try-on. Returns a prediction ID immediately — poll for results.',
    type: 'endpoint', method: 'POST', endpoint: '/api/v1/tryon', cost: 'Deducted from your credit pack (₹5.00–₹6.25 per successful Try-On depending on pack)',
    params: [
      { name: 'product_id',     type: 'string',  required: true,  desc: 'Your product identifier (must exist in this store), or a direct https:// garment image URL' },
      { name: 'user_photo_url', type: 'string',  required: true,  desc: 'Publicly accessible URL of the person photo (JPEG / PNG / WebP)' },
      { name: 'garment_type',   type: 'string',  required: false, desc: 'Target garment — what is being tried on. Case-insensitive ("two piece" works).', options: TARGET_GARMENTS, default: 'Two-piece outfit' },
      { name: 'fit_type',       type: 'string',  required: false, desc: 'How the garment should fit the shopper.', options: GARMENT_FITS, default: 'Natural realistic fit' },
    ],
    responseSchema: `{\n  "prediction_id": "gm4rbfxrf9rn...",\n  "status": "starting"\n}`,
    errorResponses: [
      { code: '400', desc: 'Invalid garment_type or fit_type — the error lists the allowed values' },
      { code: '401', desc: 'Invalid or missing API key' },
      { code: '402', desc: 'Insufficient credits' },
      { code: '404', desc: 'product_id not found for this store' },
      { code: '422', desc: 'Photo rejected by AI content moderation' },
    ],
    code: {
      curl: `curl -X POST https://dashboard.vizzle.in/api/v1/tryon \\\n  -H "x-api-key: vzk_9114d52b..." \\\n  -H "Content-Type: application/json" \\\n  -H "Origin: https://your-store.com" \\\n  -d '{\n    "product_id": "SHIRT-001",\n    "user_photo_url": "https://cdn.yourstore.com/user-photo.jpg",\n    "garment_type": "Shirt",\n    "fit_type": "Regular fit"\n  }'\n\n# garment_type and fit_type are optional — omit them to use\n# "Two-piece outfit" and "Natural realistic fit".`,
      python: `from vizzle import VizzleClient\n\nclient = VizzleClient(api_key="vzk_9114d52b...", base_url="https://dashboard.vizzle.in")\n\njob = client.tryon(\n    product_id="SHIRT-001",\n    user_photo_url="https://cdn.yourstore.com/user-photo.jpg",\n    garment_type="Shirt",       # optional, default "Two-piece outfit"\n    fit_type="Regular fit",     # optional, default "Natural realistic fit"\n)\nprint("Job started:", job.prediction_id)\n\n# Auto-poll until done:\nresult = job.wait()\nprint("Output URL:", result.output_url)`,
      javascript: `const response = await fetch("https://dashboard.vizzle.in/api/v1/tryon", {\n  method: "POST",\n  headers: {\n    "x-api-key": "vzk_9114d52b...",\n    "Content-Type": "application/json",\n    "Origin": "https://your-store.com",\n  },\n  body: JSON.stringify({\n    product_id: "SHIRT-001",\n    user_photo_url: "https://cdn.yourstore.com/user-photo.jpg",\n    garment_type: "Shirt",      // optional, default "Two-piece outfit"\n    fit_type: "Regular fit",    // optional, default "Natural realistic fit"\n  }),\n});\nconst { prediction_id, status } = await response.json();\nconsole.log("Started:", prediction_id, status);`,
    },
  },

  'tryon-status': {
    title: 'Poll Try-On Status',
    subtitle: 'Check status of a running try-on job. Poll every 3-5 seconds until status is "succeeded" or "failed".',
    type: 'endpoint', method: 'GET', endpoint: '/api/v1/tryon/status/{prediction_id}', cost: 'Free',
    params: [
      { name: 'prediction_id', type: 'string (path)', required: true, desc: 'The prediction_id returned by POST /api/v1/tryon' },
    ],
    responseSchema: `// Status: starting | processing | succeeded | failed\n{\n  "status": "succeeded",\n  "output_url": "https://cdn.vizzle.in/vizzle/output.jpg",\n  "error": null,\n  "model_used": "vizzle-vton-v1"\n}`,
    errorResponses: [
      { code: '401', desc: 'Invalid or missing API key' },
      { code: '404', desc: 'prediction_id not found' },
    ],
    code: {
      curl: `curl https://dashboard.vizzle.in/api/v1/tryon/status/gm4rbfxrf9rn... \\\n  -H "x-api-key: vzk_9114d52b..."\n\n# Succeeded:\n{\n  "status": "succeeded",\n  "output_url": "https://cdn.vizzle.in/vizzle/output.jpg"\n}`,
      python: `import time\nfrom vizzle import VizzleClient\n\nclient = VizzleClient(api_key="vzk_...", base_url="https://dashboard.vizzle.in")\n\nwhile True:\n    s = client.get_tryon_status("gm4rbfxrf9rn...")\n    if s.status in ("succeeded", "failed"):\n        break\n    time.sleep(4)\n\nprint("Output URL:", s.output_url)`,
      javascript: `async function pollTryOn(predictionId, apiKey) {\n  while (true) {\n    const res = await fetch(\`/api/v1/tryon/status/\${predictionId}\`,\n      { headers: { "x-api-key": apiKey } });\n    const data = await res.json();\n    if (data.status === "succeeded") return data.output_url;\n    if (data.status === "failed") throw new Error(data.error);\n    await new Promise(r => setTimeout(r, 4000));\n  }\n}\nconst url = await pollTryOn("gm4rbfxrf9rn...", "vzk_...");`,
    },
  },

  'video-start': {
    title: 'Start Video Generation',
    subtitle: 'Animate a try-on result image into a short fashion video. Returns a prediction ID — poll for the MP4 URL.',
    type: 'endpoint', method: 'POST', endpoint: '/api/v1/generate-video', cost: 'Rs 15.00 per call',
    params: [
      { name: 'image_url',   type: 'string',  required: true,  desc: 'URL of the try-on output image (or any fashion photo)' },
      { name: 'motion_type', type: 'string',  required: false, desc: '"subtle_walk" | "pose_showcase" | "gentle_turn" — default: "subtle_walk"' },
      { name: 'duration',    type: 'number',  required: false, desc: 'Video length in seconds (2-10). Default: 4' },
      { name: 'fps',         type: 'number',  required: false, desc: 'Frames per second. Must be 24 (only supported value)' },
    ],
    responseSchema: `{\n  "prediction_id": "1a1b0d7669rmr...",\n  "status": "starting"\n}`,
    errorResponses: [
      { code: '400', desc: 'Invalid fps value (must be 24) or duration out of range' },
      { code: '401', desc: 'Invalid or missing API key' },
      { code: '402', desc: 'Insufficient credits (costs Rs 15.00)' },
    ],
    code: {
      curl: `curl -X POST https://dashboard.vizzle.in/api/v1/generate-video \\\n  -H "x-api-key: vzk_9114d52b..." \\\n  -H "Content-Type: application/json" \\\n  -H "Origin: https://your-store.com" \\\n  -d '{\n    "image_url": "https://cdn.vizzle.in/vizzle/output.jpg",\n    "motion_type": "subtle_walk",\n    "duration": 4,\n    "fps": 24\n  }'`,
      python: `from vizzle import VizzleClient\n\nclient = VizzleClient(api_key="vzk_...", base_url="https://dashboard.vizzle.in")\n\nvideo_job = client.generate_video(\n    image_url="https://cdn.vizzle.in/vizzle/output.jpg",\n    motion_type="subtle_walk",\n    duration=4,\n)\nvideo = video_job.wait()\nprint("Video URL:", video.output_url)`,
      javascript: `const res = await fetch("https://dashboard.vizzle.in/api/v1/generate-video", {\n  method: "POST",\n  headers: {\n    "x-api-key": "vzk_...",\n    "Content-Type": "application/json",\n    "Origin": "https://your-store.com",\n  },\n  body: JSON.stringify({\n    image_url: "https://cdn.vizzle.in/vizzle/output.jpg",\n    motion_type: "pose_showcase",\n    duration: 5,\n    fps: 24,\n  }),\n});\nconst { prediction_id } = await res.json();`,
    },
  },

  'video-status': {
    title: 'Poll Video Status',
    subtitle: 'Check the status of a running video generation. Poll every 5-10 seconds — videos take 30-120 seconds.',
    type: 'endpoint', method: 'GET', endpoint: '/api/v1/generate-video/status/{prediction_id}', cost: 'Free',
    params: [
      { name: 'prediction_id', type: 'string (path)', required: true, desc: 'The prediction_id returned by POST /api/v1/generate-video' },
    ],
    responseSchema: `// Succeeded:\n{\n  "status": "succeeded",\n  "output_url": "https://cdn.vizzle.in/vizzle/output.mp4",\n  "error": null\n}\n// Still processing:\n{\n  "status": "processing",\n  "output_url": null,\n  "error": null\n}`,
    errorResponses: [
      { code: '401', desc: 'Invalid or missing API key' },
      { code: '404', desc: 'prediction_id not found' },
    ],
    code: {
      curl: `curl https://dashboard.vizzle.in/api/v1/generate-video/status/1a1b0d7669rmr... \\\n  -H "x-api-key: vzk_9114d52b..."`,
      python: `import time\nfrom vizzle import VizzleClient\n\nclient = VizzleClient(api_key="vzk_...", base_url="https://dashboard.vizzle.in")\n\nfor _ in range(30):\n    s = client.get_video_status("1a1b0d7669rmr...")\n    if s.status == "succeeded":\n        print("Video ready:", s.output_url)\n        break\n    elif s.status == "failed":\n        raise RuntimeError(s.error)\n    time.sleep(10)`,
      javascript: `async function pollVideo(predictionId, apiKey) {\n  while (true) {\n    const res = await fetch(\n      \`/api/v1/generate-video/status/\${predictionId}\`,\n      { headers: { "x-api-key": apiKey } }\n    );\n    const data = await res.json();\n    if (data.status === "succeeded") return data.output_url;\n    if (data.status === "failed") throw new Error(data.error);\n    await new Promise(r => setTimeout(r, 8000));\n  }\n}`,
    },
  },

  'upload-photo': {
    title: 'Upload Photo',
    subtitle: 'Upload a shopper photo to Vizzle CDN. Returns a temp URL (valid 1 hour) to pass into try-on calls.',
    type: 'endpoint', method: 'POST', endpoint: '/api/v1/upload', cost: 'Free',
    params: [
      { name: 'photo', type: 'File (multipart)', required: true, desc: 'Photo to upload. Accepted: JPEG, PNG, WebP. Max: 10 MB.' },
    ],
    responseSchema: `{\n  "url": "https://cdn.vizzle.in/vizzle/tryon-temp/..."\n}`,
    errorResponses: [
      { code: '400', desc: 'Missing photo field or unsupported file type' },
      { code: '401', desc: 'Invalid or missing API key' },
      { code: '413', desc: 'Photo exceeds 10 MB limit' },
    ],
    code: {
      curl: `curl -X POST https://dashboard.vizzle.in/api/v1/upload \\\n  -H "x-api-key: vzk_9114d52b..." \\\n  -H "Origin: https://your-store.com" \\\n  -F "photo=@/path/to/user-photo.jpg"`,
      python: `from vizzle import VizzleClient\n\nclient = VizzleClient(api_key="vzk_...", base_url="https://dashboard.vizzle.in")\n\nwith open("user-photo.jpg", "rb") as f:\n    url = client.upload_photo(f)\n\nprint("Uploaded to:", url)\njob = client.tryon("SHIRT-001", user_photo_url=url)`,
      javascript: `async function uploadAndTryOn(file, productId, apiKey) {\n  const form = new FormData();\n  form.append("photo", file);\n\n  const { url } = await fetch("/api/v1/upload", {\n    method: "POST",\n    headers: { "x-api-key": apiKey },\n    body: form,\n  }).then(r => r.json());\n\n  return fetch("/api/v1/tryon", {\n    method: "POST",\n    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },\n    body: JSON.stringify({ product_id: productId, user_photo_url: url }),\n  }).then(r => r.json()); // { prediction_id, status }\n}`,
    },
  },
};

// ─── Small components ───────────────────────────────────────────────────────

const METHOD_COLORS = {
  POST: { bg: '#3064E3', text: '#fff' },
  GET:  { bg: 'rgba(22,163,74,0.15)', text: '#15803d' },
};

function MethodBadge({ method, size = 'sm' }) {
  if (!method) return null;
  const c = METHOD_COLORS[method] || METHOD_COLORS.POST;
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: size === 'lg' ? '3px 10px' : '2px 6px',
      borderRadius: '5px', fontWeight: 700,
      fontSize: size === 'lg' ? '0.78rem' : '0.58rem',
      letterSpacing: '0.03em', fontFamily: 'monospace',
      display: 'inline-block', flexShrink: 0,
    }}>{method}</span>
  );
}

const LANGS = ['cURL', 'Python', 'JavaScript'];
const LKEY  = { cURL: 'curl', Python: 'python', JavaScript: 'javascript' };

function CodePanel({ code }) {
  const [lang, setLang] = useState('cURL');
  const [copied, setCopied] = useState(false);
  const snippet = code?.[LKEY[lang]] ?? '';
  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="ar-code-panel">
      <div className="ar-code-tabs">
        {LANGS.map(l => (
          <button key={l} className={`ar-code-tab${lang === l ? ' act' : ''}`} onClick={() => setLang(l)}>{l}</button>
        ))}
        <button className="ar-copy-btn" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <pre className="ar-code-block"><code>{snippet}</code></pre>
    </div>
  );
}

// ─── Try it out (live execution via same-origin proxy) ────────────────────────

const PROXY_BASE = '/api/proxy';
const API_KEY_STORAGE_KEY = 'vizzle_docs_api_key';

function buildRequestPath(ep, values) {
  let path = ep.endpoint;
  for (const p of ep.params ?? []) {
    if (p.type.includes('(path)')) {
      path = path.replace(`{${p.name}}`, encodeURIComponent(values[p.name] ?? ''));
    }
  }
  return path;
}

function TryItPanel({ ep }) {
  const [expanded, setExpanded] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem(API_KEY_STORAGE_KEY) || ''; } catch { return ''; }
  });
  const [values, setValues] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(API_KEY_STORAGE_KEY, apiKey); } catch { /* ignore */ }
  }, [apiKey]);

  const isFileUpload = ep.params?.some(p => p.type.includes('multipart'));
  const pathParams = (ep.params ?? []).filter(p => p.type.includes('(path)'));
  const bodyParams = (ep.params ?? []).filter(p => !p.type.includes('(path)') && !p.type.includes('multipart'));

  async function send() {
    if (!apiKey.trim()) {
      setResult({ error: 'Enter your x-api-key above first.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const path = buildRequestPath(ep, values);
      const url = `${PROXY_BASE}${path}`;
      const headers = { 'x-api-key': apiKey.trim() };
      let body;

      if (ep.method === 'GET') {
        // no body
      } else if (isFileUpload) {
        if (!file) throw new Error('Choose a photo file first.');
        const form = new FormData();
        form.append('photo', file);
        body = form; // browser sets multipart content-type + boundary
      } else {
        headers['Content-Type'] = 'application/json';
        const payload = {};
        for (const p of bodyParams) {
          const raw = values[p.name];
          if (raw === undefined || raw === '') continue;
          payload[p.name] = p.type === 'number' ? Number(raw) : raw;
        }
        body = JSON.stringify(payload);
      }

      const res = await fetch(url, { method: ep.method, headers, body });
      const text = await res.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = text; }
      setResult({ status: res.status, body: parsed });
    } catch (err) {
      setResult({ error: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ar-tryit">
      <button className="ar-tryit-toggle" onClick={() => setExpanded(v => !v)}>
        {expanded ? '▾' : '▸'} Try it out
      </button>
      {expanded && (
        <div className="ar-tryit-body">
          <label className="ar-tryit-label">x-api-key</label>
          <input
            className="ar-tryit-input"
            type="text"
            placeholder="vzk_..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />

          {pathParams.map(p => (
            <div key={p.name}>
              <label className="ar-tryit-label">{p.name}</label>
              <input
                className="ar-tryit-input"
                type="text"
                placeholder={p.desc}
                value={values[p.name] ?? ''}
                onChange={e => setValues(v => ({ ...v, [p.name]: e.target.value }))}
              />
            </div>
          ))}

          {isFileUpload && (
            <div>
              <label className="ar-tryit-label">photo</label>
              <input
                className="ar-tryit-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          {bodyParams.map(p => (
            <div key={p.name}>
              <label className="ar-tryit-label">
                {p.name}{p.required && <span className="ar-req">required</span>}
              </label>
              {p.options ? (
                <select
                  className="ar-tryit-input"
                  value={values[p.name] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [p.name]: e.target.value }))}
                >
                  <option value="">{p.default ? `Not sent (default: ${p.default})` : 'Not sent'}</option>
                  {p.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  className="ar-tryit-input"
                  type="text"
                  placeholder={p.desc}
                  value={values[p.name] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [p.name]: e.target.value }))}
                />
              )}
            </div>
          ))}

          <button className="ar-tryit-send" onClick={send} disabled={loading}>
            {loading ? 'Sending…' : `Send ${ep.method} request`}
          </button>

          {result && (
            <div className={`ar-tryit-result ${result.error ? 'err' : (result.status < 400 ? 'ok' : 'err')}`}>
              {result.error ? (
                <p>{result.error}</p>
              ) : (
                <>
                  <div className="ar-tryit-status">Status: {result.status}</div>
                  <pre>{typeof result.body === 'string' ? result.body : JSON.stringify(result.body, null, 2)}</pre>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ParamRow({ p }) {
  return (
    <tr>
      <td><code className="ar-pname">{p.name}</code>{p.required && <span className="ar-req">required</span>}</td>
      <td><span className="ar-ptype">{p.type}</span></td>
      <td className="ar-pdesc">
        {p.desc}
        {p.default && (
          <div className="ar-pmeta">Default: <code>{p.default}</code></div>
        )}
        {p.options && (
          <div className="ar-pmeta">
            One of: {p.options.map((o, i) => (
              <span key={o}>{i > 0 && ", "}<code>{o}</code></span>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

function Doc({ ep }) {
  return (
    <article className="ar-article">
      <div className="ar-ep-hdr">
        {ep.method && (
          <div className="ar-ep-pill">
            <MethodBadge method={ep.method} size="lg" />
            <code className="ar-ep-path">{ep.endpoint}</code>
          </div>
        )}
        <h1 className="ar-title">{ep.title}</h1>
        <p className="ar-sub">{ep.subtitle}</p>
      </div>

      {ep.type === 'endpoint' && (
        <div className="ar-meta-row">
          <div className="ar-chip"><span className="ar-chip-label">Auth</span><code>x-api-key</code></div>
          <div className="ar-chip"><span className="ar-chip-label">Cost</span><span>{ep.cost}</span></div>
        </div>
      )}

      <div className="ar-split">
        <div className="ar-split-l">
          {ep.content && <div className="ar-guide" dangerouslySetInnerHTML={{ __html: ep.content }} />}

          {ep.params?.length > 0 && (
            <section>
              <h3 className="ar-sh">Request Parameters</h3>
              <div className="ar-tbl-wrap">
                <table className="ar-tbl">
                  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
                  <tbody>{ep.params.map(p => <ParamRow key={p.name} p={p} />)}</tbody>
                </table>
              </div>
            </section>
          )}

          {ep.responseSchema && (
            <section>
              <h3 className="ar-sh">Response</h3>
              <div className="ar-resp">
                <div className="ar-resp-hdr"><span className="ar-resp-badge">200 Response</span></div>
                <pre><code>{ep.responseSchema}</code></pre>
              </div>
            </section>
          )}

          {ep.errorResponses && (
            <section>
              <h3 className="ar-sh">Error Responses</h3>
              <div className="ar-tbl-wrap">
                <table className="ar-tbl">
                  <thead><tr><th>Status</th><th>Description</th></tr></thead>
                  <tbody>{ep.errorResponses.map(e => (
                    <tr key={e.code}><td><code className="ar-status">{e.code}</code></td><td className="ar-pdesc">{e.desc}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <div className="ar-split-r">
          {ep.type === 'endpoint' && <TryItPanel ep={ep} />}
          <CodePanel code={ep.code} />
        </div>
      </div>
    </article>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ApiRefPage() {
  const [activeId, setActiveId] = useState('authentication');
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [activeId]);

  const ep = EP[activeId];

  return (
    <div className="ar-root">
      <Navbar />
      <button className="ar-mobile-toggle" onClick={() => setMobileOpen(v => !v)}>☰ API Navigation</button>

      <div className="ar-layout">
        <aside className={`ar-sidebar${mobileOpen ? ' open' : ''}`}>
          <div className="ar-sb-hdr">
            <span className="ar-sb-logo">⚡ Vizzle</span>
            <span className="ar-sb-ver">API v1</span>
          </div>
          <a className="ar-sb-spec-link" href="/docs/api-spec" target="_blank" rel="noopener noreferrer">
            Swagger / ReDoc / OpenAPI ↗
          </a>
          <nav className="ar-sb-nav">
            {API_GROUPS.map(g => (
              <div key={g.id} className="ar-nav-grp">
                <p className="ar-nav-grp-title">{g.label}</p>
                <ul>
                  {g.items.map(item => (
                    <li key={item.id}>
                      <button
                        className={`ar-nav-item${activeId === item.id ? ' active' : ''}`}
                        onClick={() => { setActiveId(item.id); setMobileOpen(false); }}
                      >
                        {item.tag && <span style={{ width: '3rem', flexShrink: 0 }}><MethodBadge method={item.tag} /></span>}
                        <span className="ar-nav-lbl">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="ar-main" ref={mainRef}>
          {ep ? <Doc ep={ep} /> : <div className="ar-empty">Select an endpoint from the sidebar</div>}
        </main>
      </div>
    </div>
  );
}
