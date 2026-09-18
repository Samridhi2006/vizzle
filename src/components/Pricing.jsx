import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import PricingFAQSection from "./PricingFAQSection";
import LeadCaptureSection from "./LeadCaptureSection";
import { useModal } from "../context/ModalContext";
import { motion, AnimatePresence } from "framer-motion";
import { BookImage, Video, ArrowLeft } from "lucide-react";

const RocketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1-1.5 2.5-1 3.5 1 .5 2.5.5 3.5-1" />
    <path d="M12 2c0 0-5 3-5 10l7 7c7 0 10-5 10-5C24 7 12 2 12 2z" />
    <circle cx="17" cy="7" r="2" />
  </svg>
);
const ChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const StarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const CrownIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20" />
    <path d="M5 20L2 8l5 4 5-7 5 7 5-4-3 12H5z" />
  </svg>
);

const CATALOGUE_PLANS = [
  {
    icon: <RocketIcon />,
    name: "Starter Pack",
    subtitle: "Perfect for Small Businesses",
    price: "₹1,000",
    volume: "80 images | 8 videos",
    perPhoto: "₹12.50 per Catalogue photo",
    perVideo: "₹125 per video",
    features: ["Standard AI Models", "Standard Backgrounds", "Single Catalogue photo Generation", "Product Catalogue Templates", "Email Support"],
    featured: false,
    cta: "Buy Now",
  },
  {
    icon: <ChartIcon />,
    name: "Growth Pack",
    subtitle: "Most Popular Choice",
    price: "₹2,500",
    volume: "225 images | 30 videos",
    perPhoto: "₹11.50 per Catalogue photo",
    perVideo: "₹100 per video",
    features: ["Standard AI Models", "Standard Backgrounds", "Bulk Catalogue photo Generation", "Product Catalogue Templates", "Email Support"],
    featured: true,
    badge: "Best Value",
    cta: "Buy Now",
  },
  {
    icon: <StarIcon />,
    name: "Pro Pack",
    subtitle: "Best for Growing Businesses",
    price: "₹5,000",
    volume: "480 images | 50 videos",
    perPhoto: "₹10.50 per Catalogue photo",
    perVideo: "₹100 per video",
    features: ["Standard AI Models", "Standard Backgrounds", "Bulk Catalogue photo Generation", "Product Catalogue Templates", "Email Support"],
    featured: false,
    cta: "Buy Now",
  },
  {
    icon: <CrownIcon />,
    name: "Enterprise Pack",
    subtitle: "Enterprises & High Volume",
    price: "₹10,000",
    volume: "1,100 images | 100 videos",
    perPhoto: "₹9.09 per Catalogue photo",
    perVideo: "₹100 per video",
    features: ["Standard AI Models", "Standard Backgrounds", "Bulk Catalogue photo Generation", "Product Catalogue Templates", "Email Support"],
    featured: false,
    cta: "Buy Now",
  },
];

const TRYON_PLANS = [
  {
    icon: <RocketIcon />,
    name: "Starter Pack",
    subtitle: "Perfect for Startups",
    price: "₹1,000",
    volume: "160 Try-Ons",
    perPhoto: "₹6.25 per Try-On",
    perVideo: null,
    features: ["160 AI Try-Ons", "Instant Priority Processing", "Pay Only for Successful Try-Ons", "White Label Integration", "Website & Shopify Integration", "Standard AI Quality"],
    featured: false,
    cta: "Buy Now",
  },
  {
    icon: <ChartIcon />,
    name: "Growth Pack",
    subtitle: "Most Popular Choice",
    price: "₹2,500",
    volume: "450 Try-Ons",
    perPhoto: "₹5.56 per Try-On",
    perVideo: null,
    features: ["450 AI Try-Ons", "Instant Priority Processing", "Pay Only for Successful Try-Ons", "White Label Integration", "Website & Shopify Integration", "Standard AI Quality"],
    featured: true,
    badge: "Best Value",
    cta: "Buy Now",
  },
  {
    icon: <StarIcon />,
    name: "Pro Pack",
    subtitle: "Best for Growing Businesses",
    price: "₹5,000",
    volume: "960 Try-Ons",
    perPhoto: "₹5.21 per Try-On",
    perVideo: null,
    features: ["960 AI Try-Ons", "Instant Priority Processing", "Pay Only for Successful Try-Ons", "White Label Integration", "Website & Shopify Integration", "Standard AI Quality"],
    featured: false,
    cta: "Buy Now",
  },
  {
    icon: <CrownIcon />,
    name: "Enterprise Pack",
    subtitle: "Enterprises & High Volume",
    price: "₹10,000",
    volume: "2,000 Try-Ons",
    perPhoto: "₹5.00 per Try-On",
    perVideo: null,
    features: ["2,000 AI Try-Ons", "Instant Priority Processing", "Pay Only for Successful Try-Ons", "White Label Integration", "Website & Shopify Integration", "Standard AI Quality"],
    featured: false,
    cta: "Buy Now",
  },
];

const DOT_COLORS = ["#1D8DB2", "#22C55E", "#6366F1", "#A855F7", "#F43F5E"];

function PlanCard({ plan, index }) {
  const { openModal } = useModal();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -2, boxShadow: plan.featured ? "0 12px 48px rgba(37,99,235,0.18)" : "0 8px 32px rgba(0,0,0,0.1)" }}
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: "16px",
        border: plan.featured ? "2px solid #2563EB" : "1.5px solid #E8E8E8",
        boxShadow: plan.featured ? "0 8px 40px rgba(37,99,235,0.12)" : "0 2px 16px rgba(0,0,0,0.05)",
        padding: "28px 24px 24px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {plan.featured && plan.badge && (
        <div style={{
          position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)",
          background: "#2563EB", color: "#fff", fontSize: "10px", fontWeight: 800,
          letterSpacing: "0.07em", textTransform: "uppercase", padding: "4px 14px",
          borderRadius: "20px", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
        }}>
          {plan.badge}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          background: plan.featured ? "#EFF6FF" : "#F8F9FA",
          border: plan.featured ? "1.5px solid #BFDBFE" : "1.5px solid #E8E8E8",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: plan.featured ? "#2563EB" : "#555", flexShrink: 0,
        }}>
          {plan.icon}
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#111", lineHeight: 1.2 }}>{plan.name}</div>
          <div style={{ fontSize: "11.5px", color: "#888", marginTop: "2px" }}>{plan.subtitle}</div>
        </div>
      </div>
      <div style={{ marginBottom: "4px" }}>
        <span style={{ fontSize: "30px", fontWeight: 900, color: "#111", letterSpacing: "-0.03em" }}>{plan.price}</span>
        <span style={{ fontSize: "12px", color: "#888", marginLeft: "6px" }}>/ {plan.volume}</span>
      </div>
      <div style={{ fontSize: "12px", color: "#555", marginBottom: "2px" }}>{plan.perPhoto}</div>
      {plan.perVideo && <div style={{ fontSize: "12px", color: "#555", marginBottom: "20px" }}>{plan.perVideo}</div>}
      <div style={{ borderTop: "1px solid #F0F0F0", marginBottom: "18px" }} />
      <div>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#888", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "12px" }}>
          Included Features
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          {plan.features.map((f, i) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: DOT_COLORS[i % DOT_COLORS.length], flexShrink: 0 }} />
              <span style={{ fontSize: "12.5px", color: "#444" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <button
        onClick={() => openModal({ title: "Request Brand Access", fieldKeys: ["name", "brand", "email", "phone"] })}
        onMouseEnter={e => (e.currentTarget.style.background = "#333")}
        onMouseLeave={e => (e.currentTarget.style.background = "#111")}
        style={{
          marginTop: "22px", width: "100%", padding: "13px", borderRadius: "10px",
          border: "none", background: "#111", color: "#fff", fontSize: "13px",
          fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
          letterSpacing: "0.01em", transition: "background 0.2s ease",
        }}
      >
        {plan.cta}
      </button>
    </motion.div>
  );
}

function Pricing() {
  const [activeTab, setActiveTab] = useState("catalogue");
  const plans = activeTab === "catalogue" ? CATALOGUE_PLANS : TRYON_PLANS;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F9F5F0" }}>
      {/* ── Mini nav bar ── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(249,245,240,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "0 32px",
        height: "56px",
        display: "flex",
        alignItems: "center",
      }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#111",
            textDecoration: "none",
            padding: "7px 14px",
            borderRadius: "50px",
            background: "#fff",
            border: "1.5px solid #E8E8E8",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            transition: "all 0.18s ease",
            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#111"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; e.currentTarget.style.borderColor = "#E8E8E8"; }}
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>

      <main style={{ flex: 1, paddingTop: "40px", paddingBottom: "80px" }}>
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 48px", padding: "0 24px" }}>
          <h1 style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 900, color: "#111",
            letterSpacing: "-0.04em", lineHeight: 1.12, margin: "0 0 16px",
            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          }}>
            Fair Pricing. Real Results. No Surprises.
          </h1>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            Select the plan that matches the business; you can have an online store, a retail shop or a mall kiosk.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px", padding: "0 24px" }}>
          <div style={{
            display: "inline-flex", background: "#fff", borderRadius: "50px", padding: "5px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #E8E8E8",
            gap: "4px", fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          }}>
            <button
              onClick={() => setActiveTab("catalogue")}
              style={{
                padding: "10px 22px", borderRadius: "50px", border: "none",
                fontSize: "13px", fontWeight: 700, fontFamily: "inherit",
                cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: "7px",
                background: activeTab === "catalogue" ? "#111" : "transparent",
                color: activeTab === "catalogue" ? "#fff" : "#666",
              }}
            >
              <BookImage size={14} />
              AI Catalogue Generation
            </button>
            <button
              onClick={() => setActiveTab("tryon")}
              style={{
                padding: "10px 22px", borderRadius: "50px", border: "none",
                fontSize: "13px", fontWeight: 700, fontFamily: "inherit",
                cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: "7px",
                background: activeTab === "tryon" ? "#1D8DB2" : "transparent",
                color: activeTab === "tryon" ? "#fff" : "#666",
                boxShadow: activeTab === "tryon" ? "0 2px 12px rgba(29,141,178,0.25)" : "none",
              }}
            >
              <Video size={14} />
              AI Virtual Try-On
            </button>
          </div>
        </div>

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                alignItems: "stretch",
              }}
            >
              {plans.map((plan, i) => (
                <PlanCard key={plan.name} plan={plan} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{
          textAlign: "center", marginTop: "48px", padding: "0 24px",
          fontSize: "13px", color: "#888", fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        }}>
          💳 All payments processed securely via Razorpay · UPI, Cards, Net Banking accepted
        </div>
      </main>

      {/* Divider */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderTop: "1px solid #e8e8e8" }} />
      </div>

      {/* FAQ Section */}
      <PricingFAQSection />

      {/* Lead Capture / Contact Section */}
      <LeadCaptureSection />

      <Footer />
    </div>
  );
}

export default Pricing;
