import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "What is AI Catalogue Creation?",
    a: "AI Catalogue Creation is an intelligent technology that transforms flat-lay garment photos or ghost mannequin images into realistic fashion model photoshoots without studio setups or physical models.",
  },
  {
    q: "Do I need a professional photographer or model?",
    a: "No. You don't need a professional photographer or model. Simply upload a flat-lay clothing image or a photo of the garment hanging on a hanger, and Vizzle can create a catalogue image using AI.",
  },
  {
    q: "What type of product image can I upload?",
    a: "You can upload a flat-lay product image or a photo of the garment hanging on a hanger.",
  },
  {
    q: "Can I create catalogue photos with AI models?",
    a: "Yes, Vizzle can generate catalogue images using AI models.",
  },
  {
    q: "How much does AI Catalogue Creation cost?",
    a: "AI Catalogue Creation is available for just ₹60 per catalogue photo on a Pay-As-You-Go basis.",
  },
  {
    q: "Is there a monthly subscription?",
    a: "No. You don't need a monthly fixed subscription. Simply pay for the catalogue photos you use.",
  },
  {
    q: "Can I create catalogue photos in bulk?",
    a: "Yes, Vizzle supports bulk catalogue photo generation for businesses with larger product collections.",
  },
  {
    q: "Can I choose backgrounds for my catalogue photos?",
    a: "Yes, Vizzle supports AI-generated backgrounds for catalogue photography.",
  },
  {
    q: "Can I use the images on my website and social media?",
    a: "Yes. You can use your generated catalogue images for your website, social media and other marketing channels.",
  },
  {
    q: "Can I try AI Catalogue Creation before purchasing?",
    a: "Yes. You can sign up on vizzle.in and create a free sample catalogue photo.",
  },
];

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: isOpen ? "1.5px solid #e2e8f0" : "1.5px solid #f1f5f9",
        boxShadow: isOpen
          ? "0 4px 24px rgba(0,0,0,0.07)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Trigger */}
      <button
        onClick={() => onToggle(index)}
        style={{
          width: "100%",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "left",
          cursor: "pointer",
          background: "transparent",
          border: "none",
          gap: "16px",
        }}
        aria-expanded={isOpen}
      >
        <span
          style={{
            fontSize: "clamp(13.5px, 1.5vw, 15px)",
            fontWeight: 600,
            color: "#0f172a",
            letterSpacing: "-0.01em",
            lineHeight: 1.45,
            flex: 1,
          }}
        >
          {item.q}
        </span>

        {/* Badge icon */}
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: isOpen ? "#fff1f2" : "#f8fafc",
            color: isOpen ? "#f43f5e" : "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.2s ease, color 0.2s ease",
          }}
        >
          {isOpen ? <ChevronUp size={15} strokeWidth={2.5} /> : <ChevronDown size={15} strokeWidth={2.5} />}
        </div>
      </button>

      {/* Animated answer panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 24px 20px",
                fontSize: "clamp(13px, 1.4vw, 14px)",
                color: "#475569",
                lineHeight: 1.7,
                borderTop: "1px solid #f1f5f9",
                paddingTop: "16px",
              }}
            >
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PricingFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      style={{
        paddingTop: "72px",
        paddingBottom: "80px",
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        style={{
          textAlign: "center",
          fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)",
          fontWeight: 900,
          color: "#0f172a",
          letterSpacing: "-0.04em",
          lineHeight: 1.12,
          margin: "0 auto 48px",
          padding: "0 24px",
          maxWidth: "640px",
        }}
      >
        AI Catalogue Creation —{" "}
        <span style={{ color: "#f43f5e" }}>FAQs</span>
      </motion.h2>

      {/* Accordion list */}
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {FAQS.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            index={i}
            isOpen={openIndex === i}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  );
}
