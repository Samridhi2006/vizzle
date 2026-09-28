import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ArrowUpRight, Calendar, ArrowLeft } from "lucide-react";
import BlogNewsletterBanner from "../components/BlogNewsletterBanner";
import BlogFAQSection from "../components/BlogFAQSection";
import LeadCaptureSection from "../components/LeadCaptureSection";

// ─── Blog data ────────────────────────────────────────────────────────────────
const BLOGS = [
  {
    id: 1,
    cover: "/images/blogs/blog_cover_bad_fits.jpg",
    category: "Fit Science",
    date: "Aug 2024",
    title: "The Science of \"Bad Fits\": Why Models Look Different (And It's Not You)",
    excerpt:
      "Ever ordered an outfit online because it looked stunning on the model, only to feel completely different in reality? You're not alone — and there's real science behind it.",
    url: "https://medium.com/@info_58939/the-science-of-bad-fits-why-models-look-different-and-its-not-you-8a76edaed8da?source=user_profile_page---------0-------------f600f7dd6dfe------------------------",
  },
  {
    id: 2,
    cover: "/images/blogs/blog_cover_try_before_buy.jpg",
    category: "Fashion Tech",
    date: "Aug 2024",
    title: "Try Before You Buy: How Vizzle Solves India's Online Fashion Return Problem",
    excerpt:
      "India's fashion return rates are alarmingly high. Vizzle's AI virtual try-on technology is quietly reshaping how shoppers make buying decisions before they checkout.",
    url: "https://medium.com/@info_58939/try-before-you-buy-how-vizzle-solves-indias-online-fashion-return-problem-2d456c1d97d4?source=user_profile_page---------1-------------f600f7dd6dfe------------------------",
  },
  {
    id: 3,
    cover: "/images/blogs/blog_cover_will_it_fit.jpg",
    category: "AI & Fashion",
    date: "Aug 2024",
    title: "The End of the \"Will it Fit?\" Era: How Vizzle is Solving India's Online Fashion Return Problem",
    excerpt:
      "The anxiety of clicking 'Buy Now' without knowing if something will truly fit is one of India's biggest e-commerce challenges. AI is finally providing an answer.",
    url: "https://medium.com/@info_58939/the-end-of-the-will-it-fit-era-how-vizzle-is-solving-indias-online-fashion-return-problem-c2f620c4922e?source=user_profile_page---------2-------------f600f7dd6dfe------------------------",
  },
  {
    id: 4,
    cover: "/images/blogs/blog_cover_sustainable_fashion.jpg",
    category: "Sustainability",
    date: "Sep 2024",
    title: "Sustainable Fashion: Why Buying Less (But Better) is the Ultimate Flex 🌿✨",
    excerpt:
      "Fast fashion is out. Slow, intentional, sustainable fashion is having its moment. Here's why quality over quantity is the most stylish choice you can make.",
    url: "https://medium.com/@info_58939/sustainable-fashion-why-buying-less-but-better-is-the-ultimate-flex-2db38b8528a7?source=user_profile_page---------3-------------f600f7dd6dfe------------------------",
  },
];

// ─── Category badge color map ─────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "Fit Science":   { bg: "#EFF6FF", text: "#1D4ED8", dot: "#2563EB" },
  "Fashion Tech":  { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  "AI & Fashion":  { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
  "Sustainability":{ bg: "#F0FDF4", text: "#166534", dot: "#22C55E" },
};

// ─── Individual Blog Card ─────────────────────────────────────────────────────
function BlogCard({ blog }) {
  const [hovered, setHovered] = useState(false);
  const colors = CATEGORY_COLORS[blog.category] || { bg: "#F8F9FA", text: "#374151", dot: "#6B7280" };

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: "20px",
        border: hovered ? "1.5px solid #CBD5E1" : "1.5px solid #E2E8F0",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.11)"
          : "0 2px 16px rgba(0,0,0,0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.28s ease, border-color 0.28s ease, transform 0.28s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Cover image */}
      <div style={{ overflow: "hidden", height: "220px", flexShrink: 0 }}>
        <img
          src={blog.cover}
          alt={blog.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            display: "block",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      {/* Card body */}
      <div style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          {/* Category badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: colors.bg, color: colors.text,
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em",
            padding: "3px 10px", borderRadius: "20px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: colors.dot, flexShrink: 0 }} />
            {blog.category}
          </span>

          {/* Date */}
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", color: "#94A3B8" }}>
            <Calendar size={12} />
            {blog.date}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: "clamp(15px, 1.6vw, 17px)",
          fontWeight: 800,
          color: "#0F172A",
          lineHeight: 1.38,
          margin: "0 0 10px",
          letterSpacing: "-0.02em",
        }}>
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p style={{
          fontSize: "13.5px",
          color: "#64748B",
          lineHeight: 1.68,
          margin: "0 0 22px",
          flex: 1,
        }}>
          {blog.excerpt}
        </p>

        {/* Read link */}
        <a
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#111",
            textDecoration: "none",
            borderTop: "1px solid #F1F5F9",
            paddingTop: "16px",
            transition: "color 0.18s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#2563EB")}
          onMouseLeave={e => (e.currentTarget.style.color = "#111")}
        >
          Read full story on Medium
          <ArrowUpRight size={14} strokeWidth={2.5} />
        </a>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F9F5F0", fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      {/* ── Mini Top Bar ── */}
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
        gap: "16px",
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
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#2563EB";
            e.currentTarget.style.color = "#2563EB";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#E8E8E8";
            e.currentTarget.style.color = "#111";
          }}
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>
        <div style={{ width: "1px", height: "20px", background: "#E2E8F0" }} />
        <img src="/logo.png" alt="Vizzle" style={{ height: "44px", width: "auto", objectFit: "contain", display: "block" }} />
      </div>

      <main style={{ flex: 1, paddingTop: "48px", paddingBottom: "80px" }}>
        {/* ── Hero Header ── */}
        <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 56px", padding: "0 24px" }}>
          <h1 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 900,
            color: "#0F172A",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: "0 0 18px",
            whiteSpace: "nowrap",
          }}>
            Fashion Tech, Fit Science{" "}
            <span style={{ color: "#2563EB" }}>&amp; Trends</span>
          </h1>

          <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.7, margin: 0 }}>
            Deep-dives into AI fashion technology, the science of style, sustainability, and how Vizzle is changing how India shops online.
          </p>
        </div>

        {/* ── 2×2 Blog Grid ── */}
        <div id="blog-grid" style={{
          maxWidth: "1100px",
          margin: "0 auto 72px",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
          gap: "28px",
        }}>
          {BLOGS.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* ── AI Fashion Tips Newsletter Banner ── */}
        <BlogNewsletterBanner />

        {/* ── Quick Answers FAQ Section ── */}
        <BlogFAQSection />

        {/* ── Lead Capture Section ── */}
        <LeadCaptureSection />
      </main>

      <Footer />
    </div>
  );
}
