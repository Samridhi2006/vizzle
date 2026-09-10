import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import LeadCaptureSection from "../components/LeadCaptureSection";
import Footer from "../components/Footer";
import { useModal, FIELD_PRESETS } from "../context/ModalContext";

const FAQS = [
  { id: 1, q: "How accurate is Vizzle's virtual try-on draping?", a: "Vizzle uses a proprietary diffusion-based AI model trained on millions of garment-body pairs. It preserves texture, pattern alignment, and realistic draping folds at up to 8K resolution — indistinguishable from professional studio photography." },
  { id: 2, q: "What garment types does Vizzle support?", a: "Vizzle supports the full spectrum of Indian and global fashion: sarees, salwar suits, lehengas, kurtas, sherwanis, western dresses, co-ord sets, blazers, menswear, and kids clothing — across all sizes and body types." },
  { id: 3, q: "Can customers use their own photo or live camera?", a: "Yes. Shoppers can upload a selfie or use live camera mode directly in your website or app. Vizzle normalizes lighting, pose, and scale automatically to deliver a seamless result in under 3 seconds." },
  { id: 4, q: "Does virtual try-on actually reduce returns?", a: "Brands using Vizzle report a 38-55% reduction in size-related returns within 90 days. Shoppers who try-on convert 3x more often and show 60% higher lifetime value versus non-try-on sessions." },
  { id: 5, q: "How do I integrate Vizzle into my existing store?", a: "Vizzle ships as a plug-and-play JavaScript widget, a REST API, and a native SDK for iOS and Android. Most integrations go live in under 48 hours with no changes to your existing product catalog." },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div style={{ borderRadius: 16, border: isOpen ? "1.5px solid #06B6D4" : "1.5px solid #E2E8F0", background: "#fff", overflow: "hidden", boxShadow: isOpen ? "0 4px 20px rgba(6,182,212,0.08)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s ease" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: isOpen ? "#0891B2" : "#0F172A", lineHeight: 1.5 }}>{faq.q}</span>
        <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: isOpen ? "#FFF1F2" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: isOpen ? "#F43F5E" : "#64748B" }}>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="ans" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p style={{ padding: "0 24px 20px", fontSize: 13, color: "#475569", lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VirtualTryOnPage() {
  const { openModal } = useModal();
  const [openId, setOpenId] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F1F5F9", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#0891B2")}
          onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back to Home
        </Link>
        <div style={{ width: 1, height: 20, background: "#E2E8F0" }} />
        <img src="/viz.png" alt="Vizzle" style={{ height: 28, width: "auto" }} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700 }}>Virtual Try-On</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 28 }}>
            {[["✨", "AI-Powered Draping"], ["⚡", "Results in < 3 Seconds"], ["🛡️", "55% Fewer Returns"], ["🌐", "Works Online & In-Store"]].map(([icon, label]) => (
              <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 999, padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "#334155", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                {icon} {label}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.04em", lineHeight: 1.13, margin: "0 0 16px" }}>
            Let Shoppers See It On Themselves —{" "}
            <span style={{ background: "linear-gradient(135deg,#F97316,#F59E0B,#EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Before They Buy.
            </span>
          </h1>
          <p style={{ fontSize: 14, color: "#64748B", maxWidth: 600, margin: "0 auto 28px", lineHeight: 1.75 }}>
            Customers who can see an outfit on their own body buy faster, return less, and trust your brand more. Vizzle AI virtual try-on works on your website, app, and in-store kiosks.
          </p>
          <button
            onClick={() => openModal('Book a Free Demo', FIELD_PRESETS.all)}
            style={{ background: "linear-gradient(135deg,#F97316,#F59E0B,#EF4444)", color: "#fff", border: "none", borderRadius: 999, padding: "12px 28px", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}
          >
            Book A Free Demo →
          </button>
        </motion.div>

        {/* Two-column showcase */}
        <div className="vz-vto-showcase" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 48, alignItems: "center", marginBottom: 80 }}>

          {/* Left: Before/After card */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <div style={{ background: "#EFF6FF", borderRadius: 28, padding: 28, border: "1px solid #DBEAFE", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)", position: "relative", maxWidth: 440 }}>
              
              {/* Processing badge */}
              <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", border: "1px solid #E2E8F0", borderRadius: 999, padding: "5px 14px", fontSize: 10, fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                Vizzle AI is transforming…
              </div>

              {/* After image (main) */}
              <div style={{ width: "80%", marginLeft: "auto", borderRadius: 18, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.15)", border: "2px solid rgba(255,255,255,0.9)", background: "#fff", aspectRatio: "3/4", position: "relative" }}>
                <img src="/tryon/model_luxury_blue_gown_after.jpg" alt="AI Virtual Try-On result - Royal Sapphire Blue Silk Gown" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                <div style={{ position: "absolute", top: 10, right: 10, background: "linear-gradient(135deg,#06B6D4,#4F46E5)", color: "#fff", borderRadius: 999, padding: "4px 10px", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                  <Sparkles size={9} /> AI Result
                </div>
              </div>

              {/* Before image (inset) */}
              <div style={{ width: "33%", position: "absolute", left: 12, bottom: 32, zIndex: 20, borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.22)", border: "2.5px solid #fff", background: "#fff", aspectRatio: "9/16" }}>
                <img src="/tryon/model_user_casual_before.jpg" alt="User casual photo - White crop top and blue jeans" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 8, fontWeight: 700, textAlign: "center", padding: "4px 4px" }}>Your Photo</div>
              </div>

              {/* Sparkle connector */}
              <div style={{ position: "absolute", left: "27%", bottom: "24%", zIndex: 15, fontSize: 22 }}>✨</div>
            </div>
          </motion.div>

          {/* Right: Copy */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#ECFEFF,#EEF2FF)", border: "1px solid #A5F3FC", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#06B6D4", display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#0891B2", letterSpacing: "0.06em", textTransform: "uppercase" }}>Powered by Vizzle AI</span>
            </div>

            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 20px" }}>
              What is{" "}
              <span style={{ background: "linear-gradient(135deg,#06B6D4,#4F46E5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Vizzle Virtual Try-On?
              </span>
            </h2>

            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
              Vizzle is an AI-enabled virtual try-on platform designed for fashion businesses across India and global markets. Any shopper can upload a photo of themselves or use a live camera feed to see exactly how an outfit fits and drapes on their own body shape.
            </p>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 32 }}>
              It works seamlessly online, in mobile apps, and offline on in-store retail kiosks. Vizzle handles sarees, ethnic suits, western dresses, kurtas, menswear, and kids clothing — delivering photorealistic draping, accurate texture preservation, and personalized fit visualization.
            </p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
              {[["3s","Try-On Time"],["55%","Return Drop"],["3x","Conversion Lift"]].map(([stat, label]) => (
                <div key={label} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "16px 12px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, background: "linear-gradient(135deg,#F97316,#EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{stat}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={{ background: "linear-gradient(135deg,#F97316,#F59E0B,#EF4444)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>
                Start Your Free Trial →
              </button>
              <button style={{ background: "#fff", color: "#334155", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "14px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                See Live Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Try-On Steps Section ── */}
        <div style={{ marginBottom: 80 }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 12px" }}>
              Simple for Shoppers.{" "}
              <span style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Powerful for Brands.
              </span>
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Four steps. Under 30 seconds. A completely new shopping experience.
            </p>
          </motion.div>

          {/* 3-Step Cards Grid */}
          <div className="vz-vto-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, alignItems: "start", position: "relative", maxWidth: 960, margin: "0 auto" }}>

            {/* Step 1 */}
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0 }} style={{ position: "relative" }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0F172A", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700 }}>
                  📸 Step 1: Upload or Snap
                </span>
              </div>
              <div style={{ aspectRatio: "3/4", background: "#F1F5F9", borderRadius: 24, overflow: "hidden", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "relative" }}>
                <img src="/tryon/step1_user_upload.jpg" alt="Step 1 - User uploads photo in white tee and jeans" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "5px 12px", fontSize: 10, fontWeight: 700, color: "#334155", border: "1px solid rgba(255,255,255,0.8)" }}>
                  📁 Your Photo
                </div>
              </div>
              {/* Arrow connector → Step 2 */}
              <div className="vz-vto-step-arrow" style={{ position: "absolute", right: -18, top: "55%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", color: "#fff", fontSize: 16, fontWeight: 900, flexShrink: 0 }}>
                ›
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.12 }} style={{ position: "relative" }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0F172A", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700 }}>
                  👕 Step 2: Pick an Outfit
                </span>
              </div>
              <div style={{ aspectRatio: "3/4", background: "#F1F5F9", borderRadius: 24, overflow: "hidden", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "relative" }}>
                <img src="/tryon/step2_garment_bomber.jpg" alt="Step 2 - Olive green bomber jacket garment flatlay" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "5px 12px", fontSize: 10, fontWeight: 700, color: "#334155", border: "1px solid rgba(255,255,255,0.8)" }}>
                  🧥 Olive Bomber Jacket
                </div>
              </div>
              {/* Arrow connector → Step 3 */}
              <div className="vz-vto-step-arrow" style={{ position: "absolute", right: -18, top: "55%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", color: "#fff", fontSize: 16, fontWeight: 900, flexShrink: 0 }}>
                ›
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.24 }} style={{ position: "relative" }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0F172A", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700 }}>
                  ✨ Step 3: See the AI Result
                </span>
              </div>
              <div style={{ aspectRatio: "3/4", background: "#F1F5F9", borderRadius: 24, overflow: "hidden", border: "2px solid #F97316", boxShadow: "0 8px 32px rgba(249,115,22,0.18)", position: "relative" }}>
                <img src="/tryon/step3_ai_result.jpg" alt="Step 3 - AI virtual try-on result wearing olive bomber jacket" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                {/* AI badge top */}
                <div style={{ position: "absolute", top: 12, right: 12, background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 999, padding: "5px 12px", fontSize: 10, fontWeight: 800, boxShadow: "0 2px 8px rgba(249,115,22,0.4)", display: "flex", alignItems: "center", gap: 4 }}>
                  ⚡ Vizzle AI
                </div>
                {/* Photorealistic fit tag bottom */}
                <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(15,23,42,0.85)", backdropFilter: "blur(8px)", color: "#fff", borderRadius: 999, padding: "5px 14px", fontSize: 10, fontWeight: 700, border: "1px solid rgba(255,255,255,0.15)" }}>
                  ✨ Photorealistic Fit
                </div>
              </div>
            </motion.div>

          </div>

          {/* Mobile note (stacked on small screens) */}
          <p style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 20 }}>
            Works on mobile, tablet, desktop, and in-store kiosks · Under 3 seconds
          </p>
        </div>

      </div>

      {/* ── Made for Every Fashion Business ── */}
      <section style={{ background: "#fff", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", padding: "80px 24px" }}>
        <div className="vz-vto-omnichannel" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 56, alignItems: "center" }}>

          {/* Left — Value Proposition */}
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
            {/* Section label */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#FFF7ED,#FEF2F2)", border: "1px solid #FED7AA", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316", display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#EA580C", letterSpacing: "0.06em", textTransform: "uppercase" }}>Omnichannel Platform</span>
            </div>

            <h2 style={{ fontSize: "clamp(1.7rem,3.5vw,2.7rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 16px" }}>
              Made for{" "}
              <span style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Every Fashion Business
              </span>
            </h2>

            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.8, marginBottom: 24, maxWidth: 440 }}>
              Whether you sell online, offline, or both, Vizzle fits your business model. If you sell clothes, this is built for you.
            </p>

            {/* Segment bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {[
                "Fashion E-Commerce Websites and D2C Brands",
                "Clothing Stores, Saree Shops & Boutiques",
                "Shopping Malls and Multi-Brand Retail Spaces",
                "Wedding Stores and Bridal Boutiques",
                "Retail Chains and Franchise Networks",
                "Fashion Designers Selling Online or at Exhibitions",
                "Kids' Wear and Teen Fashion Retailers",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, fontWeight: 500, color: "#334155" }}>
                  <span style={{ color: "#F43F5E", fontWeight: 900, fontSize: 16, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>•</span>
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => openModal('Talk To Our Team', FIELD_PRESETS.all)}
              style={{ background: "linear-gradient(135deg,#F97316,#F59E0B,#EF4444)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(249,115,22,0.3)", display: "inline-flex", alignItems: "center", gap: 8, transition: "transform 0.15s ease, opacity 0.15s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Talk To Our Team About Your Business →
            </button>
          </motion.div>

          {/* Right — Visual Card */}
          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }} style={{ position: "relative" }}>
            {/* Ambient glow */}
            <div style={{ position: "absolute", inset: -20, background: "radial-gradient(ellipse at center, rgba(249,115,22,0.12) 0%, transparent 70%)", borderRadius: 40, pointerEvents: "none" }} />

            <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.14)", border: "1px solid #E2E8F0", background: "#fff", aspectRatio: "16/9", position: "relative" }}>
              <img
                src="/tryon/omnichannel_kiosk_experience.jpg"
                alt="Luxury boutique omnichannel shopping with AI smart mirror kiosk virtual try-on"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />

              {/* Left badge — In-Store Selection */}
              <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 9 }}>🛍️</span>
                In-Store Selection
              </div>

              {/* Right badge — AI Smart Kiosk */}
              <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", color: "#0F172A", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 999, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 9 }}>🪞</span>
                AI Smart Kiosk Try-On
              </div>

              {/* Bottom caption bar */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)", padding: "28px 20px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 500 }}>Luxury Boutique · Terrazzo Floor · Mumbai</span>
                <span style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 999, letterSpacing: "0.03em" }}>VIZZLE KIOSK</span>
              </div>
            </div>

            {/* Floating stats pill */}
            <div className="vz-vto-stats-pill" style={{ position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 999, padding: "10px 24px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 24, whiteSpace: "nowrap" }}>
              {[["🌐", "Online"], ["🏪", "In-Store"], ["📱", "Mobile App"], ["🪞", "Kiosk"]].map(([icon, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#334155" }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Built for Every Shopper, Every Wardrobe ── */}
      <section style={{ background: "#1C1F26", width: "100%", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        {/* Ambient radial glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 600, background: "radial-gradient(ellipse at center, rgba(249,115,22,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 12px" }}>
              Built for{" "}
              <span style={{ background: "linear-gradient(135deg,#F97316,#F59E0B,#EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Every Shopper,
              </span>{" "}
              Every Wardrobe
            </h2>
            <p style={{ fontSize: 13, color: "#94A3B8", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
              Create realistic virtual try-on experiences for customers across all age groups and fashion segments.
            </p>
          </motion.div>

          {/* 4-Column Grid */}
          <div className="vz-vto-demographics" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 48 }}>
            {[
              { label: "Women's Wear",  src: "/showcase/western_emerald_dress.jpg",    emoji: "👗", color: "#EC4899" },
              { label: "Men's Wear",    src: "/showcase/men_denim_streetwear.jpg",      emoji: "👔", color: "#3B82F6" },
              { label: "Boys Wear",     src: "/showcase/kids_boy_polo_shorts.jpg",      emoji: "🧒", color: "#10B981" },
              { label: "Girls Wear",    src: "/showcase/kids_girl_tulle_frock.jpg",     emoji: "👧", color: "#F59E0B" },
            ].map(({ label, src, emoji, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                {/* Card */}
                <div
                  style={{ aspectRatio: "3/4", width: "100%", borderRadius: 24, overflow: "hidden", background: "#2D3140", border: "1.5px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", position: "relative", transition: "border-color 0.3s ease, box-shadow 0.3s ease", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color + "80"; e.currentTarget.style.boxShadow = `0 8px 40px ${color}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)"; }}
                >
                  <img
                    src={src}
                    alt={label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    onError={e => { e.currentTarget.parentElement.style.background = "#374151"; e.currentTarget.style.display = "none"; }}
                  />
                  {/* Category emoji badge top-left */}
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: 999, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: "1px solid rgba(255,255,255,0.1)" }}>
                    {emoji}
                  </div>
                  {/* Hover gradient overlay */}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${color}22 0%, transparent 50%)`, opacity: 0, transition: "opacity 0.3s ease", borderRadius: 24 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                  />
                </div>
                {/* Label below card */}
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1", letterSpacing: "0.04em" }}>{label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => openModal('Book a Free Demo', FIELD_PRESETS.all)}
              style={{ background: "linear-gradient(135deg,#F97316,#F59E0B,#EF4444)", color: "#fff", border: "none", borderRadius: 999, padding: "12px 28px", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 18px rgba(249,115,22,0.35)", display: "inline-flex", alignItems: "center", gap: 8, transition: "transform 0.15s ease, opacity 0.15s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Book A Free Demo →
            </button>
          </div>

        </div>
      </section>

      {/* ── Omnichannel Use Cases: Made for Every Fashion Business ── */}
      <section style={{ background: "#FAFAFC", padding: "80px 24px", borderTop: "1px solid #F1F5F9" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 12px" }}>
              Made for{" "}
              <span style={{ background: "linear-gradient(135deg,#06B6D4,#4F46E5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Every Fashion Business
              </span>
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
              Whether you sell online, offline, or both, Vizzle fits your business model. If you sell clothes, this is for you.
            </p>
          </motion.div>

          {/* Top Row — 3 Cards (4:3) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 20 }}>
            {[
              { src: "/tryon/business_fashion_brands.jpg",  title: "Fashion Brands",   caption: "Offer interactive shopping experiences.",  icon: "✨", color: "#8B5CF6" },
              { src: "/tryon/business_retail_stores.jpg",   title: "Retail Stores",    caption: "Enable in-store virtual fitting.",          icon: "🏪", color: "#06B6D4" },
              { src: "/tryon/business_shopping_malls.jpg",  title: "Shopping Malls",   caption: "Deploy smart fashion kiosks.",              icon: "🛍️", color: "#F97316" },
            ].map(({ src, title, caption, icon, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{ aspectRatio: "4/3", borderRadius: 20, overflow: "hidden", background: "#F1F5F9", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "relative", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.12)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                >
                  <img src={src} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {/* Icon badge */}
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#0F172A", border: "1px solid rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <span>{icon}</span> {title}
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingLeft: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>{caption}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row — 2 Wide Cards (16:9) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))", gap: 20 }}>
            {[
              { src: "/tryon/business_ecommerce_web.jpg",      title: "E-Commerce Websites",  caption: "Increase engagement and conversions.",         icon: "💻", color: "#10B981" },
              { src: "/tryon/business_fashion_boutiques.jpg",  title: "Fashion Boutiques",    caption: "Enhance customer confidence before purchase.",  icon: "🪞", color: "#F43F5E" },
            ].map(({ src, title, caption, icon, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{ aspectRatio: "16/9", borderRadius: 20, overflow: "hidden", background: "#F1F5F9", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "relative", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                >
                  <img src={src} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {/* Icon badge */}
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#0F172A", border: "1px solid rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <span>{icon}</span> {title}
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingLeft: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>{caption}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F8FAFF", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em", margin: "0 0 10px" }}>
              Any Questions?{" "}
              <span style={{ background: "linear-gradient(135deg,#06B6D4,#4F46E5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                We Have Answers.
              </span>
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>Everything you need to know before deploying Vizzle Virtual Try-On.</p>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((faq, i) => (
              <motion.div key={faq.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                <FAQItem faq={faq} isOpen={openId === faq.id} onToggle={() => setOpenId(prev => (prev === faq.id ? null : faq.id))} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LeadCaptureSection />
      <Footer />
    </div>
  );
}
