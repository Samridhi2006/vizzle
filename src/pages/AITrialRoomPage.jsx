import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Upload, Camera, X, Sparkles, Loader2, Download,
  RefreshCw, Menu, ChevronRight, Smartphone, FileText, Shield,
  LogIn, LogOut, User, Play, CheckCircle, AlertTriangle, Info,
  Shirt, Scissors, Layers, Star, GalleryHorizontal, Gem,
  Square, TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import SignInModal from "../components/SignInModal";
import Footer from "../components/Footer";

/* ─── Brand tokens ────────────────────────────────────────────────── */
const BLUE  = "#2563EB";
const INDIGO = "#4F46E5";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_MID   = "#BFDBFE";

/* ─── Garment categories ─────────────────────────────────────────── */
const MALE_GARMENTS = [
  { id: "shirt",       label: "Shirt",        sub: "Formal / Casual",         emoji: "👔" },
  { id: "trousers",    label: "Trousers",      sub: "Pants / Bottoms",         emoji: "👖" },
  { id: "blazer",      label: "Blazer",        sub: "Formal jacket",           emoji: "🧥" },
  { id: "3piece",      label: "3-Piece Suit",  sub: "Coat + vest + trouser",   emoji: "🤵" },
  { id: "nehru",       label: "Nehru Jacket",  sub: "Sleeveless coat",         emoji: "🧣" },
  { id: "indo",        label: "Indo-Western",  sub: "Ethnic upper wear",       emoji: "🎽" },
  { id: "sherwani",    label: "Sherwani",      sub: "Traditional formal",      emoji: "🧦" },
  { id: "kurta",       label: "Kurta",         sub: "Ethnic / Casual",         emoji: "👘" },
];

const FEMALE_GARMENTS = [
  { id: "saree",       label: "Saree",         sub: "Traditional drape",       emoji: "🥻" },
  { id: "kurti",       label: "Kurti",         sub: "Ethnic / Casual",         emoji: "👗" },
  { id: "lehenga",     label: "Lehenga",       sub: "Bridal / Festive",        emoji: "💃" },
  { id: "gown",        label: "Gown",          sub: "Evening / Party",         emoji: "✨" },
  { id: "dress",       label: "Dress",         sub: "Western / Casual",        emoji: "👒" },
  { id: "top",         label: "Top",           sub: "Blouse / Shirt",          emoji: "👚" },
  { id: "skirt",       label: "Skirt",         sub: "Midi / Maxi",             emoji: "🩱" },
  { id: "salwar",      label: "Salwar Suit",   sub: "Ethnic set",              emoji: "🧵" },
];

/* ─── Sample models ──────────────────────────────────────────────── */
const FEMALE_SAMPLES = [
  { id: "anaya",  name: "Anaya",  src: "/images/models/headshots/anaya.jpg" },
  { id: "diya",   name: "Diya",   src: "/images/models/headshots/diya.jpg" },
  { id: "ishita", name: "Ishita", src: "/images/models/headshots/ishita.jpg" },
  { id: "kavya",  name: "Kavya",  src: "/images/models/headshots/kavya.jpg" },
  { id: "meera",  name: "Meera",  src: "/images/models/headshots/meera.jpg" },
  { id: "naina",  name: "Naina",  src: "/images/models/headshots/naina.jpg" },
  { id: "priya",  name: "Priya",  src: "/images/models/headshots/priya.jpg" },
  { id: "riya",   name: "Riya",   src: "/images/models/headshots/riya.jpg" },
];

const MALE_SAMPLES = [
  { id: "aarav",     name: "Aarav",     src: "/images/models/headshots/men/aarav.jpg" },
  { id: "aditya",    name: "Aditya",    src: "/images/models/headshots/men/aditya.jpg" },
  { id: "arjun",     name: "Arjun",     src: "/images/models/headshots/men/arjun.jpg" },
  { id: "ishaan",    name: "Ishaan",    src: "/images/models/headshots/men/ishaan.jpg" },
  { id: "kabir",     name: "Kabir",     src: "/images/models/headshots/men/kabir.jpg" },
  { id: "reyansh",   name: "Reyansh",   src: "/images/models/headshots/men/reyansh.jpg" },
  { id: "rohan",     name: "Rohan",     src: "/images/models/headshots/men/rohan.jpg" },
  { id: "siddharth", name: "Siddharth", src: "/images/models/headshots/men/siddharth.jpg" },
];

const MOCK_RESULTS = [
  "/tryon/step3_ai_result.jpg",
  "/tryon/model_luxury_blue_gown_after.jpg",
  "/vz_tryon_result.jpg",
  "/step3_final_draped_emerald.jpg",
  "/step3_model_final.jpg",
];

const MAX_FREE_TRIALS = 3;
const STORAGE_KEY     = "vizzle_trial_count_v2";

/* ─── Garment Type Card ──────────────────────────────────────────── */
function GarmentCard({ item, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      style={{
        border: selected ? `2px solid ${BLUE}` : "1.5px solid #E2E8F0",
        borderRadius: 16,
        padding: "14px 8px 10px",
        background: selected ? BLUE_LIGHT : "#fff",
        boxShadow: selected ? `0 4px 18px rgba(37,99,235,0.18)` : "0 1px 4px rgba(0,0,0,0.04)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        transition: "all 0.18s ease",
        position: "relative",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = BLUE_MID; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = "#E2E8F0"; }}
    >
      {selected && (
        <div style={{ position: "absolute", top: 7, right: 7 }}>
          <CheckCircle size={13} color="#fff" fill={BLUE} />
        </div>
      )}
      <span style={{ fontSize: 24, lineHeight: 1 }}>{item.emoji}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: selected ? BLUE : "#1E293B", textAlign: "center", lineHeight: 1.3 }}>
        {item.label}
      </span>
      <span style={{ fontSize: 10, color: selected ? "#1D4ED8" : "#94A3B8", textAlign: "center", lineHeight: 1.3 }}>
        {item.sub}
      </span>
    </button>
  );
}

/* ─── Upload Box ─────────────────────────────────────────────────── */
function UploadBox({ label, hint, preview, onFile, onClear, onCamera, accent, exampleSrc }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  }, [onFile]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </p>

      {preview ? (
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", aspectRatio: "3/4", border: `2px solid ${accent}`, boxShadow: `0 4px 20px ${accent}22` }}>
          <img src={preview} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          <button onClick={onClear} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
            <X size={13} />
          </button>
          <button onClick={() => inputRef.current?.click()} style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 14px", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            Change Photo
          </button>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{ aspectRatio: "3/4", borderRadius: 18, border: `2px dashed ${dragging ? accent : "#CBD5E1"}`, background: dragging ? `${accent}0A` : "#F8FAFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}
        >
          {/* Faded example photo watermark */}
          {exampleSrc && (
            <img
              src={exampleSrc}
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", opacity: 0.18, pointerEvents: "none", userSelect: "none" }}
            />
          )}
          {/* Light gradient so text is always readable */}
          {exampleSrc && (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(248,250,255,0.55) 0%, rgba(248,250,255,0.72) 100%)", pointerEvents: "none" }} />
          )}
          {/* Controls (always on top) */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Upload size={22} color={accent} strokeWidth={1.75} />
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#334155", margin: 0, textAlign: "center", padding: "0 12px" }}>{hint}</p>
          <p style={{ fontSize: 10, color: "#94A3B8", margin: 0 }}>or drag & drop</p>
          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
            <button onClick={e => { e.stopPropagation(); inputRef.current?.click(); }} style={{ display: "flex", alignItems: "center", gap: 5, background: "#fff", border: `1.5px solid ${accent}`, borderRadius: 9, padding: "7px 14px", fontSize: 11, fontWeight: 700, color: accent, cursor: "pointer" }}>
              <Upload size={12} /> Upload
            </button>
            <button onClick={e => { e.stopPropagation(); onCamera?.(); }} style={{ display: "flex", alignItems: "center", gap: 5, background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 9, padding: "7px 14px", fontSize: 11, fontWeight: 700, color: "#475569", cursor: "pointer" }}>
              <Camera size={12} /> Camera
            </button>
          </div>
          </div>{/* close controls wrapper */}
        </div>

      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
    </div>
  );
}

/* ─── Camera Modal ───────────────────────────────────────────────── */
function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let stream;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then(s => { stream = s; if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); setStreaming(true); } })
      .catch(() => setError("Camera access denied. Please allow camera permission."));
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    c.toBlob(blob => { if (blob) { onCapture(new File([blob], "capture.jpg", { type: "image/jpeg" })); onClose(); } }, "image/jpeg", 0.95);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0F172A", borderRadius: 24, overflow: "hidden", width: "100%", maxWidth: 460, boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>📸 Take a Photo</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={16} /></button>
        </div>
        <div style={{ position: "relative", aspectRatio: "3/4", background: "#1E293B" }}>
          {error
            ? <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "#F87171", fontSize: 12, textAlign: "center", padding: 24 }}><AlertTriangle size={28} />{error}</div>
            : <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} playsInline muted />}
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div style={{ padding: 14, display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 11, padding: "11px", fontSize: 12, fontWeight: 600, color: "#CBD5E1", cursor: "pointer" }}>Cancel</button>
          <button onClick={capture} disabled={!streaming} style={{ flex: 2, background: streaming ? `linear-gradient(135deg,${BLUE},${INDIGO})` : "#374151", border: "none", borderRadius: 11, padding: "11px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: streaming ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Camera size={15} /> Capture
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Hamburger Slide-over ───────────────────────────────────────── */
function HamburgerDrawer({ isOpen, onClose, user, onSignIn, onSignOut }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 300, zIndex: 100, background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.14)", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 14px", borderBottom: "1px solid #F1F5F9" }}>
              <img src="/viz.png" alt="Vizzle" style={{ height: 32, width: "auto" }} />
              <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}>
                <X size={15} />
              </button>
            </div>
            {/* User */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFF" }}>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${BLUE},${INDIGO})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
                    {user.initial}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{user.displayName}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "#64748B" }}>{user.email}</p>
                  </div>
                </div>
              ) : (
                <button onClick={() => { onSignIn(); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, background: `linear-gradient(135deg,${BLUE},${INDIGO})`, border: "none", borderRadius: 12, padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
                  <LogIn size={15} /> Sign In to Vizzle
                </button>
              )}
            </div>
            {/* Nav */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
              {[{ icon: FileText, label: "Terms & Conditions", to: "/terms" }, { icon: Shield, label: "Privacy Policy", to: "/privacy" }].map(({ icon: Icon, label, to }) => (
                <Link key={to} to={to} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", borderRadius: 11, fontSize: 12, fontWeight: 600, color: "#334155", textDecoration: "none", marginBottom: 2 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F8FAFF"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: BLUE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={15} color={BLUE} strokeWidth={1.75} />
                  </div>
                  {label}
                  <ChevronRight size={13} color="#CBD5E1" style={{ marginLeft: "auto" }} />
                </Link>
              ))}
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", borderRadius: 11, fontSize: 12, fontWeight: 600, color: "#334155", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8FAFF"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Smartphone size={15} color="#10B981" strokeWidth={1.75} />
                </div>
                GET MOBILE APP
                <ChevronRight size={13} color="#CBD5E1" style={{ marginLeft: "auto" }} />
              </a>
              {user && (
                <button onClick={() => { onSignOut(); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", borderRadius: 11, fontSize: 12, fontWeight: 600, color: "#EF4444", background: "none", border: "none", cursor: "pointer", textAlign: "left", marginTop: 4 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LogOut size={15} color="#EF4444" strokeWidth={1.75} />
                  </div>
                  Sign Out
                </button>
              )}
            </nav>
            <div style={{ padding: "14px 16px", borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 10, color: "#94A3B8" }}>© {new Date().getFullYear()} All rights reserved to Vizzle</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Quota Badge ────────────────────────────────────────────────── */
function QuotaBadge({ remaining }) {
  if (remaining > 0) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#FEFCE8,#FEF9C3)", border: "1.5px solid #FDE68A", borderRadius: 999, padding: "6px 16px", fontSize: 11, fontWeight: 700, color: "#92400E" }}>
        <Sparkles size={12} color="#D97706" />
        {remaining} Free Trial{remaining !== 1 ? "s" : ""} Remaining
      </div>
    );
  }
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 999, padding: "6px 16px", fontSize: 11, fontWeight: 700, color: "#991B1B" }}>
      <AlertTriangle size={12} color="#EF4444" />
      Free trials used —{" "}
      <Link to="/pricing" style={{ color: BLUE, textDecoration: "none", fontWeight: 800 }}>Upgrade to continue</Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function AITrialRoomPage() {
  const { user, logout } = useAuth();

  const [gender,          setGender]          = useState("female");
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [customerPreview, setCustomerPreview] = useState(null);
  const [customerFile,    setCustomerFile]    = useState(null);
  const [garmentPreview,  setGarmentPreview]  = useState(null);
  const [garmentFile,     setGarmentFile]     = useState(null);
  const [drawerOpen,      setDrawerOpen]      = useState(false);
  const [signInOpen,      setSignInOpen]      = useState(false);
  const [cameraTarget,    setCameraTarget]    = useState(null);
  const [isProcessing,    setIsProcessing]    = useState(false);
  const [resultImg,       setResultImg]       = useState(null);
  const [selectedSampleId,setSelectedSampleId] = useState(null);
  const [trialsLeft,      setTrialsLeft]      = useState(() => {
    try { return parseInt(localStorage.getItem(STORAGE_KEY) ?? MAX_FREE_TRIALS, 10); } catch { return MAX_FREE_TRIALS; }
  });
  const [tryOnError,      setTryOnError]      = useState(null);

  const samples       = gender === "female" ? FEMALE_SAMPLES : MALE_SAMPLES;
  const garmentList   = gender === "female" ? FEMALE_GARMENTS : MALE_GARMENTS;
  const mockResultIdx = useRef(0);

  // Reset garment selection when gender changes
  const handleGenderChange = (g) => {
    setGender(g);
    setSelectedGarment(null);
    setSelectedSampleId(null);
    setCustomerPreview(null);
    setCustomerFile(null);
    setResultImg(null);
  };

  const saveTrials = (n) => {
    setTrialsLeft(n);
    try { localStorage.setItem(STORAGE_KEY, String(n)); } catch { /* noop */ }
  };

  const fileToDataURL = (file) => new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });

  const handleCustomerFile = async (file) => {
    setCustomerFile(file);
    setCustomerPreview(await fileToDataURL(file));
    setSelectedSampleId(null);
    setResultImg(null);
  };

  const handleGarmentFile = async (file) => {
    setGarmentFile(file);
    setGarmentPreview(await fileToDataURL(file));
    setResultImg(null);
  };

  const handleSampleClick = (sample) => {
    setSelectedSampleId(sample.id);
    setCustomerPreview(sample.src);
    setCustomerFile(null);
    setResultImg(null);
  };

  const handleCameraCapture = async (file) => {
    if (cameraTarget === "customer") await handleCustomerFile(file);
    else await handleGarmentFile(file);
    setCameraTarget(null);
  };

  const handleTryOn = async () => {
    if (!user)            { setSignInOpen(true); return; }
    if (trialsLeft <= 0)  { alert("You've used all 3 free trials. Upgrade to continue!"); return; }
    if (!customerPreview) { alert("Please upload or select a customer photo first."); return; }
    if (!garmentPreview)  { alert("Please upload a garment photo first."); return; }

    setIsProcessing(true);
    setResultImg(null);
    setTryOnError(null);

    try {
      /* Convert previews (dataURL or public path) → File blobs */
      const toBlob = async (src, filename) => {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`Failed to fetch image: ${src}`);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type || "image/jpeg" });
      };

      const [customerBlob, garmentBlob] = await Promise.all([
        toBlob(customerPreview, "customer.jpg"),
        toBlob(garmentPreview,  "garment.jpg"),
      ]);

      const form = new FormData();
      form.append("customerImage", customerBlob, "customer.jpg");
      form.append("garmentImage",  garmentBlob,  "garment.jpg");
      form.append("garmentDesc", selectedGarment
        ? (garmentList.find(g => g.id === selectedGarment)?.label ?? "a garment")
        : "a garment");

      const res = await fetch("http://localhost:3001/api/tryon", {
        method: "POST",
        body:   form,
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Try-on server returned an error.");
      }

      setResultImg(json.resultUrl);
      saveTrials(trialsLeft - 1);
    } catch (err) {
      console.error("[handleTryOn]", err);
      setTryOnError(err.message || "Something went wrong. Is the try-on server running?");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCustomerPreview(null); setCustomerFile(null);
    setGarmentPreview(null);  setGarmentFile(null);
    setResultImg(null);       setSelectedSampleId(null);
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>

      {/* ── Sticky Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F1F5F9", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", height: 64 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: "100%", padding: "0 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "#64748B", textDecoration: "none", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
            <ArrowLeft size={13} strokeWidth={2.5} /> Back
          </Link>
          <div style={{ width: 1, height: 18, background: "#E2E8F0", flexShrink: 0 }} />
          <img src="/viz.png" alt="Vizzle" style={{ height: 35, width: "auto", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Try On</span>
            <button onClick={() => alert("Tutorial coming soon!")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: BLUE, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Play size={8} fill={BLUE} /> Watch Tutorial
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: BLUE_LIGHT, borderRadius: 999, padding: "5px 12px 5px 5px" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg,${BLUE},${INDIGO})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 800 }}>
                  {user.initial}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#1D4ED8" }}>{user.displayName?.split(" ")[0]}</span>
              </div>
            )}
            <button onClick={() => setDrawerOpen(true)} style={{ width: 36, height: 36, borderRadius: 9, background: "#F1F5F9", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#334155" }} aria-label="Menu">
              <Menu size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* Quota */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <QuotaBadge remaining={trialsLeft} />
        </div>



        {/* ─────────────────────────────────────────────────── */}
        {/* SECTION 1 : Upload Workspace                       */}
        {/* ─────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ background: "#fff", borderRadius: 22, border: "1px solid #E8EFFD", boxShadow: "0 2px 16px rgba(37,99,235,0.06)", padding: "22px 20px", marginBottom: 16 }}>

          <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>
            Upload Photos
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <UploadBox
              label="Customer Photo"
              hint="Upload a full-body photo"
              preview={customerPreview}
              onFile={handleCustomerFile}
              onClear={() => { setCustomerPreview(null); setCustomerFile(null); setSelectedSampleId(null); setResultImg(null); }}
              onCamera={() => setCameraTarget("customer")}
              accent={BLUE}
            />
            <UploadBox
              label="Garment Photo"
              hint="Upload a clear garment photo"
              preview={garmentPreview}
              onFile={handleGarmentFile}
              onClear={() => { setGarmentPreview(null); setGarmentFile(null); setResultImg(null); }}
              onCamera={() => setCameraTarget("garment")}
              accent={INDIGO}
            />

            {/* Result panel */}
            <AnimatePresence>
              {(isProcessing || resultImg) && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>AI Result</p>
                  <div style={{ aspectRatio: "3/4", borderRadius: 18, overflow: "hidden", background: "#0F172A", border: `2px solid ${BLUE}`, boxShadow: `0 8px 28px rgba(37,99,235,0.2)`, position: "relative" }}>
                    {isProcessing ? (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Loader2 size={32} color="#60A5FA" strokeWidth={2} />
                        </motion.div>
                        <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, margin: 0 }}>Vizzle AI is generating…</p>
                        <div style={{ width: "55%", height: 3, background: "#1E293B", borderRadius: 999, overflow: "hidden" }}>
                          <motion.div style={{ height: "100%", background: `linear-gradient(90deg,${BLUE},${INDIGO})`, borderRadius: 999 }}
                            animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <img src={resultImg} alt="AI Try-On Result" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                        <div style={{ position: "absolute", top: 8, right: 8, background: `linear-gradient(135deg,${BLUE},${INDIGO})`, color: "#fff", borderRadius: 999, padding: "3px 9px", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", gap: 3 }}>
                          <Sparkles size={8} /> Vizzle AI
                        </div>
                        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, whiteSpace: "nowrap" }}>
                          <a href={resultImg} download="vizzle-tryon.jpg" style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 10px", fontSize: 9, fontWeight: 700, textDecoration: "none" }}>
                            <Download size={9} /> Download
                          </a>
                          <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 10px", fontSize: 9, fontWeight: 700, cursor: "pointer" }}>
                            <RefreshCw size={9} /> Try Again
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sample carousel – single unified row */}
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 5 }}>
              <Info size={12} color="#CBD5E1" /> No photos handy? Try our samples
            </p>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
              {/* Model samples */}
              {samples.map(s => {
                const active = selectedSampleId === s.id;
                return (
                  <button key={s.id} onClick={() => handleSampleClick(s)} title={s.name}
                    style={{ flexShrink: 0, width: 68, borderRadius: 12, overflow: "hidden", border: active ? `2.5px solid ${BLUE}` : "2px solid #E2E8F0", cursor: "pointer", background: "none", padding: 0, boxShadow: active ? `0 3px 14px rgba(37,99,235,0.2)` : "none", transition: "all 0.18s ease" }}>
                    <div style={{ aspectRatio: "3/4", position: "relative" }}>
                      <img src={s.src} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                        onError={e => { e.currentTarget.parentElement.style.background = "#E2E8F0"; e.currentTarget.style.display = "none"; }} />
                      {active && <div style={{ position: "absolute", top: 4, right: 4 }}><CheckCircle size={12} color="#fff" fill={BLUE} /></div>}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", padding: "3px", textAlign: "center" }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: "#fff" }}>{s.name}</span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Divider + extra images — female only */}
              {gender === "female" && (
                <>
                  <div style={{ flexShrink: 0, width: 1, background: "#E2E8F0", margin: "0 4px", alignSelf: "stretch" }} />

              {/* Extra garment images */}
                  {[
                    { id: "jacket",    name: "Sam",       src: "/showcase/western_leather_jacket.jpg" },
                    { id: "casual",    name: "Shashi",    src: "/tryon/model_user_casual_before.jpg" },
                    { id: "jewellery", name: "Priyanshi", src: "/brand_portrait_jewellery.jpg" },
                  ].map(g => {
                    const active = selectedSampleId === g.id;
                    return (
                      <button key={g.id} title={g.name}
                        onClick={() => handleSampleClick({ id: g.id, name: g.name, src: g.src })}
                        style={{ flexShrink: 0, width: 68, borderRadius: 12, overflow: "hidden", border: active ? `2.5px solid ${BLUE}` : "2px solid #E2E8F0", cursor: "pointer", background: "none", padding: 0, boxShadow: active ? `0 3px 14px rgba(37,99,235,0.2)` : "none", transition: "all 0.18s ease" }}>
                        <div style={{ aspectRatio: "3/4", position: "relative" }}>
                          <img src={g.src} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                            onError={e => { e.currentTarget.parentElement.style.background = "#E2E8F0"; e.currentTarget.style.display = "none"; }} />
                          {active && <div style={{ position: "absolute", top: 4, right: 4 }}><CheckCircle size={12} color="#fff" fill={BLUE} /></div>}
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", padding: "3px", textAlign: "center" }}>
                            <span style={{ fontSize: 8, fontWeight: 700, color: "#fff" }}>{g.name}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}

              {/* Divider + extra images — male only */}
              {gender === "male" && (
                <>
                  <div style={{ flexShrink: 0, width: 1, background: "#E2E8F0", margin: "0 4px", alignSelf: "stretch" }} />
                  {[
                    { id: "kundan", name: "Kundan", src: "/showcase/men_sherwani_ivory.jpg" },
                    { id: "srijan", name: "Srijan",  src: "/showcase/men_wine_suit.jpg" },
                    { id: "ram",    name: "Ram",     src: "/showcase/men_indo_blue.jpg" },
                  ].map(g => {
                    const active = selectedSampleId === g.id;
                    return (
                      <button key={g.id} title={g.name}
                        onClick={() => handleSampleClick({ id: g.id, name: g.name, src: g.src })}
                        style={{ flexShrink: 0, width: 68, borderRadius: 12, overflow: "hidden", border: active ? `2.5px solid ${BLUE}` : "2px solid #E2E8F0", cursor: "pointer", background: "none", padding: 0, boxShadow: active ? `0 3px 14px rgba(37,99,235,0.2)` : "none", transition: "all 0.18s ease" }}>
                        <div style={{ aspectRatio: "3/4", position: "relative" }}>
                          <img src={g.src} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                            onError={e => { e.currentTarget.parentElement.style.background = "#E2E8F0"; e.currentTarget.style.display = "none"; }} />
                          {active && <div style={{ position: "absolute", top: 4, right: 4 }}><CheckCircle size={12} color="#fff" fill={BLUE} /></div>}
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", padding: "3px", textAlign: "center" }}>
                            <span style={{ fontSize: 8, fontWeight: 700, color: "#fff" }}>{g.name}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>


        </motion.section>

        {/* ─────────────────────────────────────────────────── */}
        {/* SECTION 2 : Customer Type ── large toggle cards    */}
        {/* ─────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          style={{ background: "#fff", borderRadius: 22, border: "1px solid #E8EFFD", boxShadow: "0 2px 16px rgba(37,99,235,0.06)", padding: "22px 20px", marginBottom: 16 }}>

          <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 14px" }}>
            Customer Type
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ id: "male", label: "Male", emoji: "👨" }, { id: "female", label: "Female", emoji: "👩" }].map(({ id, label, emoji }) => {
              const active = gender === id;
              return (
                <button
                  key={id}
                  onClick={() => handleGenderChange(id)}
                  style={{
                    padding: "18px 12px",
                    borderRadius: 16,
                    border: active ? `2px solid ${BLUE}` : "2px solid #E2E8F0",
                    background: active ? BLUE_LIGHT : "#FAFAFA",
                    boxShadow: active ? `0 4px 18px rgba(37,99,235,0.14)` : "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  {active && <div style={{ position: "absolute", top: 10, right: 10 }}><CheckCircle size={14} color="#fff" fill={BLUE} /></div>}
                  <span style={{ fontSize: 32 }}>{emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: active ? BLUE : "#475569" }}>{label}</span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ─────────────────────────────────────────────────── */}
        {/* SECTION 3 : Select Garment Type                    */}
        {/* ─────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          style={{ background: "#fff", borderRadius: 22, border: "1px solid #E8EFFD", boxShadow: "0 2px 16px rgba(37,99,235,0.06)", padding: "22px 20px", marginBottom: 16 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Shirt size={16} color={BLUE} strokeWidth={2} />
            <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: 0 }}>Select Garment Type</p>
            {selectedGarment && (
              <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: BLUE, background: BLUE_LIGHT, borderRadius: 999, padding: "3px 10px" }}>
                ✓ {garmentList.find(g => g.id === selectedGarment)?.label}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={gender}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}
            >
              {garmentList.map(item => (
                <GarmentCard
                  key={item.id}
                  item={item}
                  selected={selectedGarment === item.id}
                  onSelect={setSelectedGarment}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* ─────────────────────────────────────────────────── */}
        {/* SECTION 4 : Try On CTA                             */}
        {/* ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <button
            onClick={handleTryOn}
            disabled={isProcessing}
            style={{
              width: "100%",
              padding: "18px 24px",
              borderRadius: 18,
              border: "none",
              background: isProcessing ? "#94A3B8" : `linear-gradient(135deg,${BLUE},${INDIGO})`,
              color: "#fff",
              fontSize: 16,
              fontWeight: 800,
              cursor: isProcessing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: isProcessing ? "none" : "0 8px 28px rgba(37,99,235,0.32)",
              transition: "all 0.2s ease",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={e => { if (!isProcessing) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {isProcessing
              ? <><Loader2 size={20} strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} /> Generating with AI…</>
              : <><Sparkles size={20} strokeWidth={2} /> Try On</>}
          </button>
        </motion.div>

        {/* Error message */}
        {tryOnError && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, color: "#DC2626" }}>Try-On failed</p>
              <p style={{ margin: 0, fontSize: 11, color: "#B91C1C" }}>{tryOnError}</p>
              {tryOnError.includes("server") && (
                <p style={{ margin: "6px 0 0", fontSize: 10, color: "#9CA3AF" }}>
                  Make sure the proxy server is running: <code style={{ background: "#F3F4F6", padding: "1px 5px", borderRadius: 4 }}>node tryon-server.cjs</code>
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────── */}
        {/* SECTION 5 : Helper notes                           */}
        {/* ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          {/* Tip */}
          <p style={{ fontSize: 12, color: "#64748B", margin: 0, textAlign: "center" }}>
            💡 Re-upload customer photo after every 2–3 try-ons for better results.
          </p>

          {/* GET MOBILE APP button */}
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${BLUE_MID}`, borderRadius: 999, padding: "9px 22px", fontSize: 12, fontWeight: 700, color: BLUE, background: "#fff", textDecoration: "none", boxShadow: "0 2px 10px rgba(37,99,235,0.08)", transition: "all 0.18s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = BLUE_LIGHT; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(37,99,235,0.08)"; }}
          >
            <Smartphone size={14} strokeWidth={2} /> 📱 GET MOBILE APP
          </a>

          {/* Support */}
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0, textAlign: "center" }}>
            Need help?{" "}
            <a href="mailto:info@vizzle.in" style={{ color: BLUE, fontWeight: 700, textDecoration: "none" }}>
              info@vizzle.in
            </a>
          </p>

          {/* Auth hint */}
          {!user && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              style={{ marginTop: 4, background: BLUE_LIGHT, border: `1.5px solid ${BLUE_MID}`, borderRadius: 14, padding: "12px 18px", display: "flex", alignItems: "center", gap: 9 }}>
              <LogIn size={15} color={BLUE} />
              <p style={{ margin: 0, fontSize: 12, color: "#1E40AF" }}>
                <strong>Sign in</strong> to unlock your 3 free try-ons.{" "}
                <button onClick={() => setSignInOpen(true)} style={{ background: "none", border: "none", color: BLUE, fontWeight: 700, cursor: "pointer", fontSize: 12, padding: 0, textDecoration: "underline" }}>
                  Sign In Now
                </button>
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />

      {/* ── Overlays ── */}
      <HamburgerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} onSignIn={() => setSignInOpen(true)} onSignOut={logout} />
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
      {cameraTarget && <CameraModal onCapture={handleCameraCapture} onClose={() => setCameraTarget(null)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
