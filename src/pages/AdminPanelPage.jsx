import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Camera,
  CheckCircle2,
  Coins,
  Cpu,
  Download,
  Eye,
  EyeOff,
  FlaskConical,
  ImagePlus,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  RotateCcw,
  ScanSearch,
  Scissors,
  Shield,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  User,
  Wand2,
  Workflow,
  X,
  XCircle,
} from "lucide-react";

// Hardcoded to the real production backend on purpose — VITE_VIZZLE_API_BASE_URL
// only exists in the local, gitignored .env file, which Vercel's build never
// sees (it builds from git, and .env isn't committed). Falling back to
// "localhost:8000" there silently pointed the deployed panel at the visitor's
// own machine. An env var override still works for local dev against a
// locally-run backend, but production no longer depends on Vercel having it set.
//
// NOTE: this is "vizzle-backend-vvc6", not "vizzle-backend" — Render assigned
// the "-vvc6" suffix because the exact name "vizzle-backend" was already
// taken by a separate, older service still running stale pre-Gemini code.
// Confirmed via that service's own deploy log: "Available at your primary
// URL https://vizzle-backend-vvc6.onrender.com". Using the un-suffixed URL
// anywhere silently hits the wrong (old) backend.
const API_BASE = import.meta.env.VITE_VIZZLE_API_BASE_URL || "https://vizzle-backend-vvc6.onrender.com";
const AUTH_STORAGE_KEY = "vizzle_admin_auth";

// Fallbacks only — the backend sends the authoritative lists with the settings.
const FALLBACK_OPTIONS = {
  image_models: ["gemini-3.1-flash-image", "gemini-3-pro-image-preview", "gemini-2.5-flash-image"],
  garment_types: ["Two-piece outfit", "T-Shirt", "Shirt", "Top", "Kurti", "Saree", "Lehenga", "Dress", "Jumpsuit", "Skirt", "Jeans", "Trousers", "Jacket", "Blazer", "Coat", "Other"],
  fit_types: ["Natural realistic fit", "Slim fit", "Regular fit", "Loose fit"],
  aspect_ratios: ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9"],
  image_sizes: ["1K", "2K", "4K"],
};

const MODEL_NOTES = {
  "gemini-3.1-flash-image": "Nano Banana 2 — the model the working prototype was tuned on (recommended).",
  "gemini-3-pro-image-preview": "Nano Banana Pro — highest quality, roughly 3× the cost per image.",
  "gemini-2.5-flash-image": "Original Nano Banana — cheapest; scheduled for shutdown Oct 16, 2026.",
};

// Settings fields the form edits (api_key is handled separately — it's never
// sent back from the server in clear text).
const FORM_FIELDS = [
  "model",
  "text_model",
  "pipeline_mode",
  "single_prompt",
  "thinking_level",
  "use_background_mode",
  "extraction_prompt",
  "tryon_prompt",
  "enable_garment_extraction",
  "aspect_ratio",
  "image_size",
  "extraction_image_size",
  "default_fit_type",
  "default_garment_type",
  "studio_extraction_prompt",
  "studio_shoot_prompt",
  "studio_qa_prompt",
  "studio_enable_qa",
  "studio_max_qa_retries",
  "moderation_prompt",
  "caption_prompt",
  "timeout_seconds",
  "max_retries",
];

const SECTIONS = [
  { id: "connection", label: "Connection", icon: KeyRound },
  { id: "pipeline", label: "Try-on pipeline", icon: Workflow },
  { id: "studio", label: "AI Studio pipeline", icon: Wand2 },
  { id: "output", label: "Output", icon: SlidersHorizontal },
  { id: "pricing", label: "Pricing & Gemini cost", icon: Coins },
  { id: "plans", label: "Plans & expiry", icon: CalendarClock },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "moderation", label: "Moderation", icon: Shield },
  { id: "playground", label: "Test playground", icon: FlaskConical },
];

function authHeader(username, password) {
  return "Basic " + btoa(`${username}:${password}`);
}

async function apiFetch(path, { method = "GET", auth, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (data && data.detail) || (typeof data === "string" ? data : "Request failed");
    const err = new Error(typeof message === "string" ? message : JSON.stringify(message));
    err.status = res.status;
    throw err;
  }
  return data;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function pickForm(settings) {
  return Object.fromEntries(FORM_FIELDS.map((k) => [k, settings[k]]));
}

/* ─────────────────────────────── Login ─────────────────────────────── */

function LoginCard({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const auth = authHeader(username, password);
    try {
      await apiFetch("/api/admin/login", { method: "POST", auth });
      sessionStorage.setItem(AUTH_STORAGE_KEY, auth);
      onLogin(auth);
    } catch (err) {
      if (err.status === 401) {
        setError("Invalid username or password.");
      } else if (err.status) {
        setError(`Login request failed (HTTP ${err.status}): ${err.message}`);
      } else {
        setError(`Could not reach the backend at ${API_BASE} — ${err.message}. It may be cold-starting on Render; try again in a few seconds.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#111a3a] to-[#1e1b4b] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-white text-xl font-semibold tracking-tight">Vizzle Admin</span>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-7">
          <h1 className="text-lg font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-500 mb-6">Manage the Gemini virtual try-on pipeline.</p>

          <label className="block text-xs font-medium text-slate-600 mb-1.5">Username</label>
          <input
            className="w-full mb-4 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />

          <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign in
          </button>
        </form>

        <Link to="/" className="mt-5 flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-slate-200">
          <ArrowLeft size={12} /> Back to home
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────── Building blocks ─────────────────────────── */

// This site's tailwind.config.js replaces the whole fontFamily theme (only
// sans/baloo), so the stock font-mono utility doesn't exist here.
const MONO = "font-[ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const inputClass =
  "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50";

function Card({ id, icon: Icon, title, description, actions, children }) {
  return (
    <section id={id} className="scroll-mt-24 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Icon size={16} />
            </div>
          )}
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
            {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>
        </div>
        {actions}
      </header>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Field({ label, help, htmlFor, children, className = "" }) {
  return (
    <div className={`mb-5 last:mb-0 ${className}`}>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-600 mb-1.5">
        {label}
      </label>
      {children}
      {help && <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{help}</p>}
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
            value === opt ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 relative inline-flex h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-[#2563EB]" : "bg-slate-300"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "left-[18px]" : "left-0.5"}`} />
      </button>
      <span>
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        {description && <span className="block text-xs text-slate-500 mt-0.5">{description}</span>}
      </span>
    </label>
  );
}

function PromptEditor({ label, value, defaultValue, onChange, placeholders = [], rows = 16 }) {
  const ref = useRef(null);
  const isDefault = value === defaultValue;
  const missing = placeholders.filter((p) => !value.includes(`{${p}}`));

  const insert = (token) => {
    const el = ref.current;
    const text = `{${token}}`;
    if (!el) {
      onChange(value + text);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">{label}</span>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${
              isDefault ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {isDefault ? "Default" : "Customised"}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {placeholders.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => insert(p)}
              title="Insert at cursor"
              className={`${MONO} text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#2563EB]`}
            >
              {`{${p}}`}
            </button>
          ))}
          <button
            type="button"
            disabled={isDefault}
            onClick={() => onChange(defaultValue)}
            className="ml-1 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:hover:text-slate-500"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>
      <textarea
        ref={ref}
        rows={rows}
        spellCheck={false}
        className={`${inputClass} ${MONO} text-[12.5px] leading-relaxed resize-y`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className={missing.length ? "text-amber-600" : "text-slate-400"}>
          {missing.length
            ? `Missing placeholder${missing.length > 1 ? "s" : ""}: ${missing.map((m) => `{${m}}`).join(", ")} — that value won't reach the model.`
            : "All placeholders present."}
        </span>
        <span className="text-slate-400 tabular-nums">{value.length.toLocaleString()} chars</span>
      </div>
    </div>
  );
}

function PipelineDiagram({ extractionEnabled }) {
  const Node = ({ icon: Icon, title, subtitle, tone = "slate", muted }) => {
    const tones = {
      slate: "bg-slate-50 border-slate-200 text-slate-700",
      blue: "bg-blue-50 border-blue-200 text-[#1d4ed8]",
      indigo: "bg-indigo-50 border-indigo-200 text-[#4338ca]",
      green: "bg-emerald-50 border-emerald-200 text-emerald-700",
    };
    return (
      <div className={`flex-1 min-w-[120px] rounded-xl border px-3 py-2.5 ${muted ? "bg-white border-dashed border-slate-300 text-slate-400" : tones[tone]}`}>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Icon size={13} /> {title}
          {muted && <span className="ml-auto text-[10px] font-bold uppercase tracking-wide">Off</span>}
        </div>
        <div className="text-[11px] opacity-80 mt-0.5">{subtitle}</div>
      </div>
    );
  };
  const Arrow = () => <ArrowRight size={14} className="shrink-0 self-center text-slate-300 hidden sm:block" />;

  return (
    <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
      <Node icon={Shirt} title="Garment photo" subtitle="Product shot or worn by a model" />
      <Arrow />
      <Node icon={Scissors} title="Stage 1 · Extract" subtitle="Remove model → clean product" tone="blue" muted={!extractionEnabled} />
      <Arrow />
      <Node icon={User} title="+ Customer photo" subtitle="Face, body, pose, background" />
      <Arrow />
      <Node icon={Sparkles} title="Stage 2 · Try on" subtitle="Replace current clothing" tone="indigo" />
      <Arrow />
      <Node icon={CheckCircle2} title="Result" subtitle="Uploaded to Cloudinary" tone="green" />
    </div>
  );
}

function ImageDrop({ label, icon: Icon, value, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (files) => {
    const file = files && files[0];
    if (!file || !file.type.startsWith("image/")) return;
    onChange(await readFileAsDataUrl(file));
  };

  return (
    <div>
      <div className="text-xs font-medium text-slate-600 mb-1.5">{label}</div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative aspect-[3/4] rounded-xl border-2 border-dashed cursor-pointer overflow-hidden flex items-center justify-center transition ${
          dragging ? "border-[#2563EB] bg-blue-50" : value ? "border-transparent bg-slate-100" : "border-slate-200 bg-slate-50 hover:border-slate-300"
        }`}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-600 hover:text-red-600"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="text-center px-4">
            <Icon size={22} className="mx-auto text-slate-300 mb-2" />
            <div className="text-xs font-medium text-slate-600 flex items-center justify-center gap-1">
              <ImagePlus size={13} /> Click or drop an image
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">JPG, PNG or WebP</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function ResultTile({ label, src, download }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        {src && download && (
          <a href={src} download={download} className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
            <Download size={12} /> Download
          </a>
        )}
      </div>
      <div className="aspect-[3/4] rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
        {src ? (
          <img src={src} alt={label} className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs text-slate-400 px-4 text-center">Skipped — garment extraction is off</span>
        )}
      </div>
    </div>
  );
}

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const usd = (n) => `$${Number(n).toFixed(3)}`;

function StudioDiagram({ extractionEnabled, qaEnabled, retries }) {
  const steps = [
    { icon: Shirt, title: "Garment photo(s)", sub: "Saree body + pallu, flat-lay, mannequin or worn", tone: "slate" },
    { icon: Scissors, title: "1 · Extract", sub: "Clean product reference", tone: "blue", off: !extractionEnabled },
    { icon: User, title: "+ Model · Pose · Background", sub: "Each used for one thing only", tone: "slate" },
    { icon: Camera, title: "2 · Catalogue shoot", sub: "Garment, audience & platform rules", tone: "indigo" },
    { icon: ScanSearch, title: "3 · QA review", sub: qaEnabled ? `Retry with fixes ×${retries}` : "Off", tone: "amber", off: !qaEnabled },
  ];
  const tones = {
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    blue: "bg-blue-50 border-blue-200 text-[#1d4ed8]",
    indigo: "bg-indigo-50 border-indigo-200 text-[#4338ca]",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
      {steps.map((st, i) => (
        <div key={st.title} className="contents">
          {i > 0 && <ArrowRight size={14} className="shrink-0 self-center text-slate-300 hidden sm:block" />}
          <div className={`flex-1 min-w-[110px] rounded-xl border px-3 py-2.5 ${st.off ? "bg-white border-dashed border-slate-300 text-slate-400" : tones[st.tone]}`}>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <st.icon size={13} /> {st.title}
              {st.off && <span className="ml-auto text-[10px] font-bold uppercase tracking-wide">Off</span>}
            </div>
            <div className="text-[11px] opacity-80 mt-0.5">{st.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NumberInput({ id, value, onChange, min, max, step, prefix, suffix, className = "" }) {
  return (
    <div className={`flex items-center rounded-lg border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-500 ${className}`}>
      {prefix && <span className="pl-3 text-sm text-slate-400">{prefix}</span>}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none tabular-nums"
      />
      {suffix && <span className="pr-3 text-xs text-slate-400 whitespace-nowrap">{suffix}</span>}
    </div>
  );
}

const EMAIL_EVENTS = [
  ["Welcome", "A new account is created (email or Google)", "Customer"],
  ["New signup alert", "A new account is created", "Admin"],
  ["Plan activated", "A setup plan is paid — includes the validity date", "Customer"],
  ["Payment alert", "Any plan or credit payment is received", "Admin"],
  ["Credits added", "A Razorpay top-up succeeds, or an admin adds credits", "Customer"],
  ["Low balance", "Wallet drops below the threshold below (once per top-up)", "Customer"],
  ["Credits exhausted", "Wallet can't pay for one more image (once per top-up)", "Customer"],
  ["Plan expiring", "At each reminder day before the plan's end date", "Customer"],
  ["Plan ended", "The day after a plan expires — access is paused", "Customer + admin"],
];

const STATUS_CHIP = {
  sent: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  skipped: "bg-slate-100 text-slate-600",
  pending: "bg-amber-50 text-amber-700",
};

/* ─────────────────────────────── Dashboard ─────────────────────────────── */

function SettingsDashboard({ auth, onLogout, onAuthExpired }) {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [saved, setSaved] = useState(null); // last-saved form values
  const [form, setForm] = useState(null);
  const [defaults, setDefaults] = useState({});
  const [options, setOptions] = useState(FALLBACK_OPTIONS);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [maskedKey, setMaskedKey] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // {ok, text}

  const [testPerson, setTestPerson] = useState(null);
  const [testGarment, setTestGarment] = useState(null);
  const [testGarmentType, setTestGarmentType] = useState("Two-piece outfit");
  const [testFitType, setTestFitType] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [activeSection, setActiveSection] = useState("connection");

  // Business settings shared with the dashboard (prices, plan validity, emails)
  const [platform, setPlatform] = useState(null);
  const [platformSaved, setPlatformSaved] = useState(null);
  const [platformInfo, setPlatformInfo] = useState(null); // {plans, costs, plan_tiers}
  const [platformError, setPlatformError] = useState("");
  const [emailLog, setEmailLog] = useState(null);
  const [emailLogLoading, setEmailLogLoading] = useState(false);

  const applyPlatform = useCallback((p) => {
    const editable = {
      ...p.settings,
      notify_expiry_days: (p.settings.notify_expiry_days || []).join(", "),
    };
    setPlatform(editable);
    setPlatformSaved(editable);
    setPlatformInfo({ plans: p.plans, costs: p.costs, plan_tiers: p.plan_tiers });
    setPlatformError("");
  }, []);

  const loadEmailLog = useCallback(async () => {
    setEmailLogLoading(true);
    try {
      setEmailLog((await apiFetch("/api/admin/email-log?limit=50", { auth })).emails);
    } catch (err) {
      setEmailLog([]);
      if (err.status !== 401) setPlatformError((e) => e || `Email log: ${err.message}`);
    } finally {
      setEmailLogLoading(false);
    }
  }, [auth]);

  const applyServerSettings = useCallback((s) => {
    const picked = pickForm(s);
    setSaved(picked);
    setForm(picked);
    setDefaults(s.defaults || {});
    setOptions({ ...FALLBACK_OPTIONS, ...(s.options || {}) });
    setApiKeySet(!!s.api_key_set);
    setMaskedKey(s.api_key || "");
    setUpdatedAt(s.updated_at || null);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        applyServerSettings(await apiFetch("/api/admin/settings", { auth }));
        apiFetch("/api/admin/platform", { auth })
          .then(applyPlatform)
          .catch((err) => setPlatformError(`Couldn't load pricing & plans: ${err.message}`));
        loadEmailLog();
      } catch (err) {
        if (err.status === 401) {
          onAuthExpired();
          return;
        }
        setLoadError(err.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, [auth, onAuthExpired, applyServerSettings, applyPlatform, loadEmailLog]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Highlight the nav item for whichever section is in view.
  useEffect(() => {
    if (!form) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [form]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setP = (key) => (value) => setPlatform((p) => ({ ...p, [key]: value }));
  const setValidity = (tier) => (value) =>
    setPlatform((p) => ({ ...p, tier_validity_days: { ...p.tier_validity_days, [tier]: value } }));

  const geminiDirty = useMemo(() => {
    if (!form || !saved) return false;
    return !!apiKey || FORM_FIELDS.some((k) => String(form[k]) !== String(saved[k]));
  }, [form, saved, apiKey]);
  const platformDirty = useMemo(
    () => !!platform && JSON.stringify(platform) !== JSON.stringify(platformSaved),
    [platform, platformSaved]
  );
  const dirty = geminiDirty || platformDirty;

  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const payload = () => ({
    ...(apiKey ? { api_key: apiKey } : {}),
    ...form,
    timeout_seconds: Number(form.timeout_seconds),
    max_retries: Number(form.max_retries),
    studio_max_qa_retries: Number(form.studio_max_qa_retries),
  });

  const platformPayload = () => ({
    credit_cost_image: Number(platform.credit_cost_image),
    credit_cost_video: Number(platform.credit_cost_video),
    usd_inr_rate: Number(platform.usd_inr_rate),
    tier_validity_days: Object.fromEntries(
      Object.entries(platform.tier_validity_days || {}).map(([k, v]) => [k, Math.max(0, Math.round(Number(v) || 0))])
    ),
    emails_enabled: !!platform.emails_enabled,
    admin_notify_email: String(platform.admin_notify_email || "").trim(),
    notify_low_balance_images: Math.max(0, Math.round(Number(platform.notify_low_balance_images) || 0)),
    notify_expiry_days: String(platform.notify_expiry_days)
      .split(",")
      .map((d) => parseInt(d, 10))
      .filter((d) => d > 0),
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (geminiDirty) {
        applyServerSettings(await apiFetch("/api/admin/settings", { method: "PUT", auth, body: payload() }));
        setApiKey("");
      }
      if (platformDirty) {
        applyPlatform(await apiFetch("/api/admin/platform", { method: "PUT", auth, body: platformPayload() }));
      } else if (geminiDirty && platform) {
        // Model / size / QA changes move the cost estimate — refresh it.
        apiFetch("/api/admin/platform", { auth }).then(applyPlatform).catch(() => {});
      }
      setToast({ ok: true, text: "Settings saved — live for all new requests." });
    } catch (err) {
      if (err.status === 401) return onAuthExpired();
      setToast({ ok: false, text: `Save failed: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setForm(saved);
    setApiKey("");
    setPlatform(platformSaved);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await apiFetch("/api/admin/settings/test", {
        method: "POST",
        auth,
        body: {
          ...payload(),
          person_image: testPerson || undefined,
          garment_image: testGarment || undefined,
          garment_type: testGarmentType,
          fit_type: testFitType || form.default_fit_type,
        },
      });
      setTestResult(result);
    } catch (err) {
      if (err.status === 401) return onAuthExpired();
      setTestResult({ ok: false, message: err.message });
    } finally {
      setTesting(false);
    }
  };

  if (!loaded || (!form && !loadError)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 text-sm text-slate-500">
        <Loader2 className="animate-spin text-[#2563EB]" size={28} />
        Loading settings… (the backend may take ~30s to wake up on Render)
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md bg-white border border-red-100 rounded-2xl p-6 text-center">
          <XCircle className="mx-auto text-red-500 mb-3" size={28} />
          <p className="text-sm text-slate-700 mb-4">Failed to load settings: {loadError}</p>
          <button onClick={() => window.location.reload()} className="text-sm font-semibold text-[#2563EB] hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const modelOptions = options.image_models.includes(form.model) ? options.image_models : [...options.image_models, form.model];
  const bothTestImages = testPerson && testGarment;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="text-slate-400 hover:text-slate-700" aria-label="Back to site">
              <ArrowLeft size={18} />
            </Link>
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 leading-tight">Vizzle Admin</div>
              <div className="text-[11px] text-slate-400 leading-tight truncate">Gemini virtual try-on</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                apiKeySet ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${apiKeySet ? "bg-emerald-500" : "bg-red-500"}`} />
              {apiKeySet ? "API key set" : "No API key"}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              <Cpu size={12} /> {saved.model}
            </span>
            <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 px-2 py-1">
              <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 flex gap-8">
        {/* Side nav */}
        <nav className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  activeSection === id ? "bg-white text-slate-900 font-medium shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon size={15} className={activeSection === id ? "text-[#2563EB]" : ""} /> {label}
              </a>
            ))}
            {updatedAt && (
              <p className="px-3 pt-4 text-[11px] text-slate-400">Last saved {new Date(updatedAt).toLocaleString()}</p>
            )}
          </div>
        </nav>

        <main className="flex-1 min-w-0 space-y-6 pb-28">
          {/* Mobile section chips */}
          <div className="lg:hidden -mx-4 px-4 flex gap-2 overflow-x-auto pb-1">
            {SECTIONS.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">
                {label}
              </a>
            ))}
          </div>

          {loadError && <p className="text-sm text-red-600">{loadError}</p>}

          {/* Connection */}
          <Card id="connection" icon={KeyRound} title="Connection" description="Gemini credentials and the models each part of the pipeline uses.">
            <Field
              label="Gemini API key"
              htmlFor="api-key"
              help={
                apiKeySet
                  ? `Saved key: ${maskedKey}. Type a new key to replace it; leave blank to keep it.`
                  : "No key saved yet — get one from aistudio.google.com/apikey."
              }
            >
              <div className="relative">
                <input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  className={`${inputClass} ${MONO} pr-10`}
                  placeholder={apiKeySet ? maskedKey : "AIza…"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-600"
                  aria-label={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-x-5">
              <Field label="Image model (both stages)" htmlFor="image-model" help={MODEL_NOTES[form.model] || "Custom model id."}>
                <select id="image-model" className={`${inputClass} ${MONO}`} value={form.model} onChange={(e) => set("model")(e.target.value)}>
                  {modelOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                      {m === defaults.model ? "  (default)" : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Text / vision model" htmlFor="text-model" help="Moderation checks and garment captioning when the garment type is unknown.">
                <input id="text-model" className={`${inputClass} ${MONO}`} value={form.text_model} onChange={(e) => set("text_model")(e.target.value)} />
              </Field>
              <Field label="Timeout per stage (seconds)" htmlFor="timeout">
                <input
                  id="timeout"
                  type="number"
                  min={10}
                  max={600}
                  className={inputClass}
                  value={form.timeout_seconds}
                  onChange={(e) => set("timeout_seconds")(e.target.value)}
                />
              </Field>
              <Field label="Max retries (5xx / timeouts only)" htmlFor="retries">
                <input id="retries" type="number" min={0} max={5} className={inputClass} value={form.max_retries} onChange={(e) => set("max_retries")(e.target.value)} />
              </Field>
            </div>
          </Card>

          {/* Pipeline */}
          <Card
            id="pipeline"
            icon={Workflow}
            title="Try-on pipeline & prompts"
            description="How the virtual try-on API turns a customer photo and a garment photo into the result."
          >
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  id: "single",
                  title: "Single call",
                  badge: "Recommended",
                  sub: "One Gemini generation with both photos (newgeminicode.py). About ₹6 per try-on at 1K.",
                },
                {
                  id: "two_stage",
                  title: "Two-stage",
                  sub: "Extract a clean garment first, then try it on (workingcode.py). Two generations, about 2× cost and time.",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => set("pipeline_mode")(m.id)}
                  className={`text-left rounded-xl border-2 px-4 py-3 transition ${
                    form.pipeline_mode === m.id ? "border-[#2563EB] bg-blue-50/50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    {m.title}
                    {m.badge && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">{m.badge}</span>}
                    {form.pipeline_mode === m.id && <CheckCircle2 size={15} className="ml-auto text-[#2563EB]" />}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 leading-relaxed">{m.sub}</div>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <Toggle
                checked={!!form.use_background_mode}
                onChange={set("use_background_mode")}
                label="Background mode (recommended)"
                description="Gemini runs the job as a stored background interaction and the backend polls for the result, so a dropped connection can't lose an image you've already paid for. Falls back to a normal call automatically if Google rejects it."
              />
            </div>

            {form.pipeline_mode === "single" ? (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 mb-5">
                  {[
                    { icon: User, title: "Customer photo", sub: "Image 1 — face, body, pose, background", tone: "bg-slate-50 border-slate-200 text-slate-700" },
                    { icon: Shirt, title: "+ Garment photo", sub: "Image 2 — product shot or worn by a model", tone: "bg-slate-50 border-slate-200 text-slate-700" },
                    { icon: Sparkles, title: "1 Gemini call", sub: "Dress the customer in the garment", tone: "bg-indigo-50 border-indigo-200 text-[#4338ca]" },
                    { icon: CheckCircle2, title: "Result", sub: "Uploaded to Cloudinary", tone: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                  ].map((st, i) => (
                    <div key={st.title} className="contents">
                      {i > 0 && <ArrowRight size={14} className="shrink-0 self-center text-slate-300 hidden sm:block" />}
                      <div className={`flex-1 min-w-[120px] rounded-xl border px-3 py-2.5 ${st.tone}`}>
                        <div className="flex items-center gap-1.5 text-xs font-semibold"><st.icon size={13} /> {st.title}</div>
                        <div className="text-[11px] opacity-80 mt-0.5">{st.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Field
                  label="Thinking level"
                  htmlFor="thinking"
                  help="How much the model reasons before drawing. 'minimal' is fastest and cheapest (as in newgeminicode.py)."
                >
                  <select
                    id="thinking"
                    className={`${inputClass} sm:max-w-[200px]`}
                    value={form.thinking_level}
                    onChange={(e) => set("thinking_level")(e.target.value)}
                  >
                    {(options.thinking_levels || ["minimal", "low", "medium", "high"]).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Sent after the two photos, each preceded by its fixed role label (IMAGE 1 = customer, IMAGE 2 = garment only).
                </p>
                <PromptEditor
                  label="Single-call try-on prompt"
                  value={form.single_prompt}
                  defaultValue={defaults.single_prompt}
                  onChange={set("single_prompt")}
                  placeholders={["garment_type", "fit_type"]}
                  rows={18}
                />
              </div>
            ) : (
            <div className="mt-6 pt-5 border-t border-slate-100">
            <PipelineDiagram extractionEnabled={form.enable_garment_extraction} />

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">Stage 1</span>
                <span className="text-sm font-semibold text-slate-800">Garment extraction</span>
              </div>
              <div className="mb-4">
                <Toggle
                  checked={!!form.enable_garment_extraction}
                  onChange={set("enable_garment_extraction")}
                  label="Extract the garment before try-on"
                  description="Recommended. Removes any model from the garment photo so their face and pose can't leak into the result. Turning it off saves one generation per try-on, but only suits clean product shots."
                />
              </div>
              <div className={form.enable_garment_extraction ? "" : "opacity-50 pointer-events-none"}>
                <PromptEditor
                  label="Extraction prompt"
                  value={form.extraction_prompt}
                  defaultValue={defaults.extraction_prompt}
                  onChange={set("extraction_prompt")}
                  placeholders={["garment_type"]}
                  rows={12}
                />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5]">Stage 2</span>
                <span className="text-sm font-semibold text-slate-800">Virtual try-on</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Sent after the two images, each preceded by a fixed role label (IMAGE 1 = customer, IMAGE 2 = target garment only).
              </p>
              <PromptEditor
                label="Try-on prompt"
                value={form.tryon_prompt}
                defaultValue={defaults.tryon_prompt}
                onChange={set("tryon_prompt")}
                placeholders={["garment_type", "fit_type"]}
                rows={16}
              />
            </div>
            </div>
            )}
          </Card>

          {/* AI Studio pipeline */}
          <Card
            id="studio"
            icon={Wand2}
            title="AI Studio pipeline"
            description="dashboard.vizzle.in/dashboard/studio — turns a garment photo into a catalogue image on an AI model."
          >
            <StudioDiagram
              extractionEnabled={form.enable_garment_extraction}
              qaEnabled={form.studio_enable_qa}
              retries={form.studio_max_qa_retries}
            />
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Garment-specific construction rules (saree drape, lehenga, ethnic sets, dresses, tops, bottoms, outerwear, co-ords),
              audience rules (incl. age-appropriate rules for kids) and marketplace rules (Amazon, Flipkart, Myntra, …) are
              chosen per request and injected through the placeholders below. Stage 1 follows the extraction switch in the try-on
              pipeline, and always runs when a saree body and pallu are uploaded separately.
            </p>

            <div className="mt-5 grid sm:grid-cols-2 gap-x-5">
              <div className="mb-5">
                <Toggle
                  checked={!!form.studio_enable_qa}
                  onChange={set("studio_enable_qa")}
                  label="Automated quality review"
                  description="The text/vision model compares the result to the clean garment; on clear defects the shoot is redone once with the reviewer's corrections."
                />
              </div>
              <Field label="QA retries" htmlFor="qa-retries" help="Each retry is another image generation (only when QA fails).">
                <select
                  id="qa-retries"
                  className={`${inputClass} sm:max-w-[140px]`}
                  value={form.studio_max_qa_retries}
                  disabled={!form.studio_enable_qa}
                  onChange={(e) => set("studio_max_qa_retries")(Number(e.target.value))}
                >
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="space-y-6 pt-5 border-t border-slate-100">
              <PromptEditor
                label="Stage 1 · Studio garment extraction prompt"
                value={form.studio_extraction_prompt}
                defaultValue={defaults.studio_extraction_prompt}
                onChange={set("studio_extraction_prompt")}
                placeholders={["garment_type", "garment_description", "display_style", "extraction_rules", "image_count"]}
                rows={10}
              />
              <PromptEditor
                label="Stage 2 · Catalogue shoot prompt"
                value={form.studio_shoot_prompt}
                defaultValue={defaults.studio_shoot_prompt}
                onChange={set("studio_shoot_prompt")}
                placeholders={[
                  "audience_rules", "model_description", "garment_type", "garment_description", "garment_rules",
                  "pose_name", "pose_description", "background_name", "background_description",
                  "platform_rules", "aspect_ratio", "framing_rules", "extra_instructions",
                ]}
                rows={16}
              />
              <div className={form.studio_enable_qa ? "" : "opacity-50 pointer-events-none"}>
                <PromptEditor
                  label="Stage 3 · QA review prompt (must reply with JSON)"
                  value={form.studio_qa_prompt}
                  defaultValue={defaults.studio_qa_prompt}
                  onChange={set("studio_qa_prompt")}
                  placeholders={["audience", "garment_type", "pose_name", "background_name"]}
                  rows={10}
                />
              </div>
            </div>
          </Card>

          {/* Output */}
          <Card id="output" icon={SlidersHorizontal} title="Output" description="Applies to both stages' generated images.">
            <Field label="Aspect ratio" help={`Default ${defaults.aspect_ratio || "3:4"} — portrait, matching typical full-body shopper photos.`}>
              <Segmented options={options.aspect_ratios} value={form.aspect_ratio} onChange={set("aspect_ratio")} />
            </Field>
            <Field label="Try-on output size" help="Size of the final try-on image. Larger sizes are slower and cost more per image.">
              <Segmented options={options.image_sizes} value={form.image_size} onChange={set("image_size")} />
            </Field>
            <Field
              label="Garment-extraction size (stage 1, try-on and Studio)"
              help="Stage 1 only makes an internal reference image. 1K is usually enough and saves about 34% of that step's cost versus 2K; the working prototype used 2K."
            >
              <Segmented options={options.image_sizes} value={form.extraction_image_size} onChange={set("extraction_image_size")} />
            </Field>
            <Field label="Default target garment" htmlFor="default-garment" help="Used when a try-on API request doesn't send garment_type.">
              <select id="default-garment" className={`${inputClass} sm:max-w-xs`} value={form.default_garment_type} onChange={(e) => set("default_garment_type")(e.target.value)}>
                {options.garment_types.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Default garment fit" htmlFor="fit" help="Used when a try-on API request doesn't send fit_type.">
              <select id="fit" className={`${inputClass} sm:max-w-xs`} value={form.default_fit_type} onChange={(e) => set("default_fit_type")(e.target.value)}>
                {options.fit_types.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Field>
          </Card>

          {platformError && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {platformError}
            </div>
          )}

          {/* Pricing & Gemini cost */}
          <Card
            id="pricing"
            icon={Coins}
            title="Pricing & Gemini cost"
            description="What customers pay per generation, and what each generation costs you on Gemini."
          >
            {!platform ? (
              <p className="text-sm text-slate-400">{platformError ? "Unavailable." : "Loading…"}</p>
            ) : (
              <>
                <div className="grid sm:grid-cols-3 gap-x-5">
                  <Field label="Price per image (try-on & Studio)" htmlFor="price-image" help="Deducted from the store wallet per generation.">
                    <NumberInput id="price-image" prefix="₹" min={0.5} step={0.5} value={platform.credit_cost_image} onChange={setP("credit_cost_image")} />
                  </Field>
                  <Field label="Price per video" htmlFor="price-video" help="Deducted per video generation.">
                    <NumberInput id="price-video" prefix="₹" min={0.5} step={0.5} value={platform.credit_cost_video} onChange={setP("credit_cost_video")} />
                  </Field>
                  <Field label="USD → INR rate" htmlFor="fx" help="Used only for the cost estimates below.">
                    <NumberInput id="fx" prefix="₹" suffix="per $1" min={1} step={0.1} value={platform.usd_inr_rate} onChange={setP("usd_inr_rate")} />
                  </Field>
                </div>

                {platformInfo?.costs && (
                  <>
                    <div className="mt-2 text-xs font-medium text-slate-600 mb-2">Cost per generation vs. your price (current settings)</div>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">Generation</th>
                            <th className="px-3 py-2 text-right font-medium">Gemini calls</th>
                            <th className="px-3 py-2 text-right font-medium">Gemini cost</th>
                            <th className="px-3 py-2 text-right font-medium">Price</th>
                            <th className="px-3 py-2 text-right font-medium">Margin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {platformInfo.costs.pipelines.map((row) => (
                            <tr key={row.name} className="border-t border-slate-100">
                              <td className="px-3 py-2 text-slate-800">{row.name}</td>
                              <td className="px-3 py-2 text-right tabular-nums text-slate-600">{row.generations}</td>
                              <td className="px-3 py-2 text-right tabular-nums text-slate-800">
                                {inr(row.inr)} <span className="text-xs text-slate-400">({usd(row.usd)})</span>
                              </td>
                              <td className="px-3 py-2 text-right tabular-nums text-slate-800">{inr(row.price_inr)}</td>
                              <td className={`px-3 py-2 text-right tabular-nums font-semibold ${row.margin_inr < 0 ? "text-red-600" : "text-emerald-700"}`}>
                                {row.margin_inr < 0 ? "−" : "+"}{inr(Math.abs(row.margin_inr))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {platformInfo.costs.pipelines.some((r) => r.margin_inr < 0) && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                        At this price some generations cost more on Gemini than you charge. Raise the price, lower the
                        garment-extraction size (Output), or switch the image model.
                      </p>
                    )}

                    <div className="mt-6 text-xs font-medium text-slate-600 mb-2">Gemini cost per generated image</div>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">Model</th>
                            {["0.5K", "1K", "2K", "4K"].map((sz) => (
                              <th key={sz} className="px-3 py-2 text-right font-medium">{sz}</th>
                            ))}
                            <th className="px-3 py-2 text-right font-medium">Input / 1M tokens</th>
                          </tr>
                        </thead>
                        <tbody>
                          {platformInfo.costs.per_image.map((m) => (
                            <tr key={m.model} className={`border-t border-slate-100 ${m.active ? "bg-blue-50/40" : ""}`}>
                              <td className="px-3 py-2">
                                <div className={`${MONO} text-[12px] text-slate-800`}>{m.model}</div>
                                <div className="text-[11px] text-slate-400">
                                  {m.label}
                                  {m.active && <span className="ml-1.5 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-[#1d4ed8]">In use</span>}
                                </div>
                              </td>
                              {["0.5K", "1K", "2K", "4K"].map((sz) => (
                                <td key={sz} className="px-3 py-2 text-right tabular-nums">
                                  {m.sizes[sz] ? (
                                    <>
                                      <div className="text-slate-800">{inr(m.sizes[sz].inr)}</div>
                                      <div className="text-[11px] text-slate-400">{usd(m.sizes[sz].usd)}</div>
                                    </>
                                  ) : (
                                    <span className="text-slate-300">—</span>
                                  )}
                                </td>
                              ))}
                              <td className="px-3 py-2 text-right tabular-nums text-slate-600">${m.input_per_m_usd.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <ul className="mt-2 space-y-0.5 text-[11px] text-slate-400">
                      {platformInfo.costs.notes.map((n) => <li key={n}>• {n}</li>)}
                      <li>
                        • Source:{" "}
                        <a href={platformInfo.costs.source} target="_blank" rel="noreferrer" className="text-[#2563EB] hover:underline">
                          Gemini API pricing
                        </a>{" "}
                        (checked {platformInfo.costs.verified}). Estimates update after you save.
                      </li>
                    </ul>
                  </>
                )}
              </>
            )}
          </Card>

          {/* Plans */}
          <Card
            id="plans"
            icon={CalendarClock}
            title="Plans & expiry"
            description="How long each setup plan stays active after payment. When it ends, API and Studio access pause until the store renews."
          >
            {!platform ? (
              <p className="text-sm text-slate-400">{platformError ? "Unavailable." : "Loading…"}</p>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {(platformInfo?.plan_tiers || Object.keys(platform.tier_validity_days || {})).map((tier) => (
                    <Field key={tier} label={tier} htmlFor={`validity-${tier}`} className="!mb-0">
                      <NumberInput
                        id={`validity-${tier}`}
                        min={0}
                        max={3650}
                        suffix="days"
                        value={platform.tier_validity_days?.[tier] ?? 365}
                        onChange={setValidity(tier)}
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        {platformInfo?.plans?.counts?.[tier] ?? 0} store{(platformInfo?.plans?.counts?.[tier] ?? 0) === 1 ? "" : "s"}
                        {Number(platform.tier_validity_days?.[tier]) === 0 ? " · never expires" : ""}
                      </p>
                    </Field>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  Applies to plans activated or renewed from now on (and to tier changes you make in the dashboard admin).
                  {platformInfo?.plans?.lifetime_paid_stores
                    ? ` ${platformInfo.plans.lifetime_paid_stores} existing paid store(s) have no end date and stay active until they are renewed or changed.`
                    : ""}{" "}
                  Renewing early extends from the current end date.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="text-xs font-medium text-slate-600 mb-2">Ending in the next 30 days / recently ended</div>
                  {platformInfo?.plans?.expiring?.length ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <tbody>
                          {platformInfo.plans.expiring.map((p) => {
                            const ended = new Date(p.expires_at) < new Date();
                            return (
                              <tr key={`${p.store_name}-${p.expires_at}`} className="border-t first:border-t-0 border-slate-100">
                                <td className="px-3 py-2 text-slate-800">{p.store_name}</td>
                                <td className="px-3 py-2 text-slate-500">{p.email}</td>
                                <td className="px-3 py-2 text-slate-600">{p.tier}</td>
                                <td className={`px-3 py-2 text-right whitespace-nowrap ${ended ? "text-red-600 font-medium" : "text-amber-700"}`}>
                                  {ended ? "Ended " : "Ends "}{new Date(p.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No plans ending soon.</p>
                  )}
                </div>
              </>
            )}
          </Card>

          {/* Emails */}
          <Card
            id="emails"
            icon={Mail}
            title="Emails"
            description="Transactional emails sent by the dashboard over SMTP."
            actions={
              <button
                type="button"
                onClick={loadEmailLog}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
              >
                <RefreshCw size={12} className={emailLogLoading ? "animate-spin" : ""} /> Refresh log
              </button>
            }
          >
            {!platform ? (
              <p className="text-sm text-slate-400">{platformError ? "Unavailable." : "Loading…"}</p>
            ) : (
              <>
                <div className="mb-5">
                  <Toggle
                    checked={!!platform.emails_enabled}
                    onChange={setP("emails_enabled")}
                    label="Send transactional emails"
                    description="Turn off to pause every email below (they're logged as skipped)."
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-x-5">
                  <Field label="Admin alerts go to" htmlFor="admin-email">
                    <input
                      id="admin-email"
                      type="email"
                      className={inputClass}
                      value={platform.admin_notify_email}
                      onChange={(e) => setP("admin_notify_email")(e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Low-balance warning below"
                    htmlFor="low-bal"
                    help={`= ${inr(Number(platform.notify_low_balance_images || 0) * Number(platform.credit_cost_image || 0))} at the current image price. 0 turns it off.`}
                  >
                    <NumberInput id="low-bal" min={0} max={1000} suffix="images" value={platform.notify_low_balance_images} onChange={setP("notify_low_balance_images")} />
                  </Field>
                  <Field label="Plan-expiry reminders" htmlFor="reminders" help="Days before the end date, comma-separated.">
                    <input
                      id="reminders"
                      className={inputClass}
                      value={platform.notify_expiry_days}
                      onChange={(e) => setP("notify_expiry_days")(e.target.value)}
                      placeholder="7, 1"
                    />
                  </Field>
                </div>

                <details className="mb-5 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                  <summary className="cursor-pointer text-xs font-medium text-slate-700">When each email is sent ({EMAIL_EVENTS.length})</summary>
                  <table className="mt-3 w-full text-xs">
                    <tbody>
                      {EMAIL_EVENTS.map(([name, when, to]) => (
                        <tr key={name} className="border-t border-slate-200/70">
                          <td className="py-1.5 pr-3 font-medium text-slate-800 whitespace-nowrap">{name}</td>
                          <td className="py-1.5 pr-3 text-slate-600">{when}</td>
                          <td className="py-1.5 text-right text-slate-500 whitespace-nowrap">{to}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                    SMTP credentials are set as Vercel environment variables on the dashboard project:{" "}
                    <code className={MONO}>SMTP_HOST</code>, <code className={MONO}>SMTP_PORT</code>,{" "}
                    <code className={MONO}>SMTP_USER</code>, <code className={MONO}>SMTP_PASS</code>, optional{" "}
                    <code className={MONO}>EMAIL_FROM</code>. Expiry emails run daily at 10:00 IST.
                  </p>
                </details>

                <div className="text-xs font-medium text-slate-600 mb-2">Recent emails</div>
                {emailLog === null || (emailLogLoading && !emailLog.length) ? (
                  <p className="text-sm text-slate-400">Loading…</p>
                ) : emailLog.length === 0 ? (
                  <p className="text-sm text-slate-400">No emails sent yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-80 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-slate-50 text-xs text-slate-500">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">When</th>
                          <th className="px-3 py-2 text-left font-medium">Type</th>
                          <th className="px-3 py-2 text-left font-medium">To</th>
                          <th className="px-3 py-2 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailLog.map((e) => (
                          <tr key={e.id} className="border-t border-slate-100 align-top">
                            <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">
                              {new Date(e.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="px-3 py-2 text-slate-800">
                              {e.type.replace(/_/g, " ")}
                              <div className="text-[11px] text-slate-400 truncate max-w-[260px]">{e.subject}</div>
                            </td>
                            <td className="px-3 py-2 text-xs text-slate-600">{e.to_email}</td>
                            <td className="px-3 py-2">
                              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CHIP[e.status] || STATUS_CHIP.skipped}`}>{e.status}</span>
                              {e.error && <div className="mt-1 text-[11px] text-red-600 max-w-[240px] break-words">{e.error}</div>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Moderation */}
          <Card id="moderation" icon={Shield} title="Moderation & captioning" description="Runs on the text/vision model before every try-on.">
            <div className="space-y-6">
              <PromptEditor
                label="Garment moderation prompt"
                value={form.moderation_prompt}
                defaultValue={defaults.moderation_prompt}
                onChange={set("moderation_prompt")}
                rows={8}
              />
              <PromptEditor
                label="Garment caption prompt (used when the garment type is unknown)"
                value={form.caption_prompt}
                defaultValue={defaults.caption_prompt}
                onChange={set("caption_prompt")}
                rows={6}
              />
            </div>
          </Card>

          {/* Playground */}
          <Card
            id="playground"
            icon={FlaskConical}
            title="Test playground"
            description="Runs the real pipeline with the settings above, including unsaved changes. Each run is billed like a normal try-on."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ImageDrop label="Image 1 · Customer" icon={User} value={testPerson} onChange={setTestPerson} />
              <ImageDrop label="Image 2 · Target garment" icon={Shirt} value={testGarment} onChange={setTestGarment} />
              <div className="sm:col-span-2 flex flex-col">
                <Field label="Garment type" htmlFor="test-garment">
                  <select id="test-garment" className={inputClass} value={testGarmentType} onChange={(e) => setTestGarmentType(e.target.value)}>
                    {options.garment_types.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Fit" htmlFor="test-fit">
                  <select id="test-fit" className={inputClass} value={testFitType || form.default_fit_type} onChange={(e) => setTestFitType(e.target.value)}>
                    {options.fit_types.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="mt-auto">
                  {!bothTestImages && (
                    <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-3">
                      Upload both images for a realistic test. Without them, two simple placeholder drawings are used, which only checks the key, model and prompts.
                    </p>
                  )}
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="w-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {testing ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {testing ? "Running pipeline…" : "Run try-on test"}
                  </button>
                </div>
              </div>
            </div>

            {testing && (
              <div className="mt-6 rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
                <Loader2 size={15} className="animate-spin text-[#2563EB]" />
                {form.enable_garment_extraction
                  ? "Stage 1 extracts the garment, then stage 2 applies it. This usually takes 30–90 seconds."
                  : "Generating the try-on. This usually takes 15–45 seconds."}
              </div>
            )}

            {!testing && testResult && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className={`flex items-start gap-2 text-sm mb-4 ${testResult.ok ? "text-emerald-700" : "text-red-600"}`}>
                  {testResult.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <XCircle size={16} className="mt-0.5 shrink-0" />}
                  <span className="break-words min-w-0">{testResult.message}</span>
                </div>
                {testResult.ok && (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <ResultTile label="Customer" src={testPerson || null} />
                      <ResultTile label="Stage 1 · Clean garment" src={testResult.extracted_garment_data_url} download="vizzle_extracted_garment.jpg" />
                      <div className="col-span-2">
                        <ResultTile label="Stage 2 · Result" src={testResult.image_data_url} download="vizzle_virtual_tryon.jpg" />
                      </div>
                    </div>
                    {testResult.timings && (
                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        {testResult.timings.extraction != null && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1d4ed8]">Extraction {testResult.timings.extraction}s</span>
                        )}
                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#4338ca]">Try-on {testResult.timings.tryon}s</span>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Total {testResult.timings.total}s</span>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          {testResult.garment_type} · {testResult.fit_type}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </Card>
        </main>
      </div>

      {/* Sticky save bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-200 ${dirty ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!dirty}
      >
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900 text-white px-4 sm:px-5 py-3 shadow-2xl">
            <span className="text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Unsaved changes
            </span>
            <div className="flex items-center gap-2">
              <button onClick={handleDiscard} disabled={saving} className="text-sm text-slate-300 hover:text-white px-3 py-1.5 disabled:opacity-50">
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-slate-900 rounded-lg px-4 py-1.5 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed right-4 z-50 transition-all ${dirty ? "bottom-24" : "bottom-4"}`}>
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg border ${
              toast.ok ? "bg-white border-emerald-200 text-emerald-700" : "bg-white border-red-200 text-red-600"
            }`}
          >
            {toast.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPanelPage() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem(AUTH_STORAGE_KEY) || null);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
  }, []);

  if (!auth) {
    return <LoginCard onLogin={setAuth} />;
  }

  return <SettingsDashboard auth={auth} onLogout={handleLogout} onAuthExpired={handleLogout} />;
}
