import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, LogOut, CheckCircle2, XCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_VIZZLE_API_BASE_URL || "http://localhost:8000";
const AUTH_STORAGE_KEY = "vizzle_admin_auth";

const IMAGE_MODEL_OPTIONS = [
  { value: "gemini-2.5-flash-image", label: "gemini-2.5-flash-image — Nano Banana (stable, cheapest)" },
  { value: "gemini-3.1-flash-image-preview", label: "gemini-3.1-flash-image-preview — Nano Banana 2 (recommended)" },
  { value: "gemini-3-pro-image-preview", label: "gemini-3-pro-image-preview — Nano Banana Pro (highest quality)" },
];

const DRAPE_MODE_OPTIONS = [
  { value: "full_replace", label: "Full outfit replacement (discard saree/lehenga drape when swapping a top/bottom)" },
  { value: "keep_drape", label: "Keep drape (only swap the blouse/choli, keep the rest of the saree/lehenga)" },
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

function LoginCard({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        setError(`Could not reach the backend at ${API_BASE} — ${err.message}. Check VITE_VIZZLE_API_BASE_URL and that the backend is running.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Vizzle Admin Panel</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to manage the Gemini try-on configuration.</p>

        <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
        <input
          className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
        <input
          type="password"
          className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Sign In
        </button>

        <Link to="/" className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-slate-600">
          <ArrowLeft size={12} /> Back to home
        </Link>
      </form>
    </div>
  );
}

function Field({ label, help, children }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
      {children}
      {help && <p className="mt-1 text-xs text-slate-400">{help}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500";

function SettingsDashboard({ auth, onLogout, onAuthExpired }) {
  const [loaded, setLoaded] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-3.1-flash-image-preview");
  const [textModel, setTextModel] = useState("gemini-2.5-flash");
  const [promptTemplate, setPromptTemplate] = useState("");
  const [defaultDrapeMode, setDefaultDrapeMode] = useState("full_replace");
  const [timeoutSeconds, setTimeoutSeconds] = useState(90);
  const [maxRetries, setMaxRetries] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null); // {ok, text}
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // {ok, message, image_data_url}
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const s = await apiFetch("/api/admin/settings", { auth });
        setApiKeySet(!!s.api_key_set);
        setModel(s.model || "gemini-3.1-flash-image-preview");
        setTextModel(s.text_model || "gemini-2.5-flash");
        setPromptTemplate(s.prompt_template || "");
        setDefaultDrapeMode(s.default_drape_mode || "full_replace");
        setTimeoutSeconds(s.timeout_seconds || 90);
        setMaxRetries(s.max_retries ?? 1);
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
  }, [auth, onAuthExpired]);

  const currentPayload = () => ({
    ...(apiKey ? { api_key: apiKey } : {}),
    model,
    text_model: textModel,
    prompt_template: promptTemplate,
    default_drape_mode: defaultDrapeMode,
    timeout_seconds: Number(timeoutSeconds),
    max_retries: Number(maxRetries),
  });

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const updated = await apiFetch("/api/admin/settings", { method: "PUT", auth, body: currentPayload() });
      setApiKeySet(!!updated.api_key_set);
      setApiKey("");
      setSaveMsg({ ok: true, text: "Settings saved." });
    } catch (err) {
      setSaveMsg({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await apiFetch("/api/admin/settings/test", { method: "POST", auth, body: currentPayload() });
      setTestResult(result);
    } catch (err) {
      setTestResult({ ok: false, message: err.message, image_data_url: null });
    } finally {
      setTesting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-slate-700">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Vizzle Admin Panel — Gemini Configuration</h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {loadError && <p className="mb-4 text-sm text-red-600">Failed to load settings: {loadError}</p>}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Gemini API</h2>

          <Field
            label="Gemini API Key"
            help={apiKeySet ? "A key is currently saved (hidden). Type a new value to replace it — leave blank to keep the saved one." : "No key saved yet. Get one from https://aistudio.google.com/apikey"}
          >
            <input
              type="password"
              className={inputClass}
              placeholder={apiKeySet ? "•••••••••••••••• (leave blank to keep)" : "AQ...."}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </Field>

          <Field label="Model (used for virtual try-on / layered try-on generation)">
            <input
              className={inputClass}
              list="gemini-image-models"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <datalist id="gemini-image-models">
              {IMAGE_MODEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </datalist>
          </Field>

          <Field label="Prompt template" help="The full instruction prompt sent with every try-on request. Contains {garment_category_block}, {gender_override_block}, and {extra_instructions} placeholders — leave them in place unless you know what you're changing.">
            <textarea
              className={inputClass + " h-64 resize-y"}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
            />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4"
          >
            {showAdvanced ? "▾" : "▸"} Advanced settings
          </button>

          {showAdvanced && (
            <>
              <Field label="Text/vision model" help="Used for garment-category detection captioning and NSFW moderation checks (text+image understanding, not image generation).">
                <input className={inputClass} value={textModel} onChange={(e) => setTextModel(e.target.value)} />
              </Field>

              <Field label="Default drape mode" help="Applies when the shopper's own photo shows a one-piece drape (saree/lehenga/jumpsuit) and only a top or bottom is being tried on.">
                <select className={inputClass} value={defaultDrapeMode} onChange={(e) => setDefaultDrapeMode(e.target.value)}>
                  {DRAPE_MODE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Request timeout (seconds)">
                  <input
                    type="number"
                    min={10}
                    max={300}
                    className={inputClass}
                    value={timeoutSeconds}
                    onChange={(e) => setTimeoutSeconds(e.target.value)}
                  />
                </Field>
                <Field label="Max retries (on 5xx/timeout only)">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    className={inputClass}
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(e.target.value)}
                  />
                </Field>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-slate-900 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save Settings
          </button>

          <button
            onClick={handleTest}
            disabled={testing}
            className="bg-white border border-slate-300 text-slate-800 rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
          >
            {testing && <Loader2 size={14} className="animate-spin" />}
            ✨ Test
          </button>

          {saveMsg && (
            <span className={`text-sm flex items-center gap-1 ${saveMsg.ok ? "text-emerald-600" : "text-red-600"}`}>
              {saveMsg.ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {saveMsg.text}
            </span>
          )}
        </div>

        {testing && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-500 flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Running a real generation against sample images — this can take up to a minute...
          </div>
        )}

        {!testing && testResult && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className={`flex items-center gap-2 text-sm font-semibold mb-4 ${testResult.ok ? "text-emerald-600" : "text-red-600"}`}>
              {testResult.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {testResult.message}
            </div>
            {testResult.image_data_url && (
              <img
                src={testResult.image_data_url}
                alt="Gemini test generation result"
                className="max-w-xs rounded-lg border border-slate-200"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPanelPage() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem(AUTH_STORAGE_KEY) || null);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
  };

  if (!auth) {
    return <LoginCard onLogin={setAuth} />;
  }

  return <SettingsDashboard auth={auth} onLogout={handleLogout} onAuthExpired={handleLogout} />;
}
