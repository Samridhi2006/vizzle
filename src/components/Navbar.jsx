/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useModal } from "../context/ModalContext";

/* ─── Design tokens ─────────────────────────────────── */
const T = {
  brand:      "#1D8DB2",
  brandHover: "#166f8f",
  brandBg:    "rgba(29,141,178,0.08)",
  text:       "#1f2937",
  textMuted:  "#6b7280",
  border:     "#e5e7eb",
  white:      "#ffffff",
  navHeight:  "64px",
};

/* ─── Primary nav links ──────────────────────────────── */
const PRIMARY_LINKS = [
  { label: "Home",          to: "/" },
  { label: "Documentation", to: "/docs" },
  { label: "API Reference", to: "/docs/api" },
  { label: "Pricing",       to: "/pricing" },
];

/* ─── "More" dropdown links ──────────────────────────── */
const MORE_LINKS = [
  { label: "Blog",               to: "/blogs",              emoji: "✍️" },
  { label: "Catalogue Showcase", to: "/catalogue-showcase", emoji: "🎨" },
  { label: "Virtual Try-On",     to: "/ai-trial-room",      emoji: "👗" },
  { label: "Contact",            to: "/contact",            emoji: "📬" },

];

/* ─── NavLink helper ─────────────────────────────────── */
function NavLink({ to, children, onClick }) {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        fontSize: "15px",
        fontWeight: 500,
        padding: "8px 12px",
        borderRadius: "6px",
        color: isActive ? T.brand : T.text,
        borderBottom: isActive ? `2px solid ${T.brand}` : "2px solid transparent",
        textDecoration: "none",
        transition: "color .18s, border-color .18s, background .18s",
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = T.brand; e.currentTarget.style.background = T.brandBg; } }}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = T.text; e.currentTarget.style.background = "transparent"; } }}
    >
      {children}
    </Link>
  );
}

/* ─── More dropdown ──────────────────────────────────── */
function MoreDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  const hasActive = MORE_LINKS.some(l => l.to === pathname || (l.to !== "/" && pathname.startsWith(l.to)));

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          whiteSpace: "nowrap", fontSize: "15px", fontWeight: 500,
          padding: "8px 12px", borderRadius: "6px", border: "none",
          cursor: "pointer", background: "transparent",
          color: hasActive ? T.brand : T.text,
          borderBottom: hasActive ? `2px solid ${T.brand}` : "2px solid transparent",
          transition: "color .18s, background .18s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = T.brand; e.currentTarget.style.background = T.brandBg; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.color = hasActive ? T.brand : T.text; e.currentTarget.style.background = "transparent"; } }}
      >
        More
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          background: T.white, borderRadius: "12px",
          border: `1px solid ${T.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          minWidth: "200px", padding: "6px", zIndex: 100,
        }}>
          {MORE_LINKS.map(({ label, to, emoji }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 500,
                  color: isActive ? T.brand : T.text,
                  background: isActive ? T.brandBg : "transparent",
                  textDecoration: "none", whiteSpace: "nowrap",
                  transition: "background .15s, color .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = T.brandBg; e.currentTarget.style.color = T.brand; }}
                onMouseLeave={e => { e.currentTarget.style.background = isActive ? T.brandBg : "transparent"; e.currentTarget.style.color = isActive ? T.brand : T.text; }}
              >
                <span>{emoji}</span>
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main Navbar ────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSignInModal } = useModal();

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Close mobile menu on route change */
  const { pathname } = useLocation();
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      role="banner"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: T.navHeight, background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center",
      }}
    >
      <div style={{
        width: "100%", maxWidth: "1280px", margin: "0 auto",
        padding: "0 24px", display: "flex", alignItems: "center", gap: "32px",
      }}>

        {/* ── Logo ── */}
        <Link to="/" aria-label="Vizzle home" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="Vizzle" style={{ height: "40px", width: "auto" }} />
        </Link>

        {/* ── Primary Nav (desktop ≥1024px) ── */}
        <nav aria-label="Primary" style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}
          className="docs-nav-desktop">
          {PRIMARY_LINKS.map(({ label, to }) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
          <MoreDropdown />
        </nav>

        {/* ── Action Buttons (desktop) ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, marginLeft: "auto" }}
          className="docs-nav-desktop">
          {/* Sign In */}
          <button
            onClick={openSignInModal}
            style={{
              height: "40px", padding: "0 16px", borderRadius: "8px",
              background: "transparent", border: `1.5px solid ${T.border}`,
              fontSize: "14px", fontWeight: 600, color: T.text,
              cursor: "pointer", whiteSpace: "nowrap", transition: "border-color .18s, color .18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.brand; e.currentTarget.style.color = T.brand; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
          >
            Sign In
          </button>

          {/* Play Store Icon */}
          <a
            href="https://play.google.com/store/apps/details?id=app.vercel.vizzle_pwa.twa"
            target="_blank"
            rel="noopener noreferrer"
            title="Download on Google Play"
            aria-label="Download Vizzle on Google Play"
            style={{
              height: '40px', width: '40px', borderRadius: '10px',
              border: `1.5px solid ${T.border}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', textDecoration: 'none',
              transition: 'border-color .18s, background .18s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#01875f'; e.currentTarget.style.background = 'rgba(1,135,95,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'transparent'; }}
          >
            {/* Google Play triangle logo */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.18 23.76c.3.17.64.24.98.21l11.64-11.64L12.14 8.7 3.18 23.76z" fill="#EA4335"/>
              <path d="M20.46 10.28l-3.02-1.72-3.46 3.46 3.46 3.46 3.04-1.74c.87-.5.87-1.96-.02-2.46z" fill="#FBBC04"/>
              <path d="M3.18.24C2.84.21 2.5.28 2.2.45 1.45.9 1 1.72 1 2.6v18.8c0 .88.45 1.7 1.2 2.15.3.17.64.24.98.21l.12-.07L14.76 12 3.3.31 3.18.24z" fill="#4285F4"/>
              <path d="M3.3.31l11.46 11.7 3.68-3.68L5.1.27C4.47-.1 3.74-.06 3.18.24L3.3.31z" fill="#34A853"/>
            </svg>
          </a>

          {/* Integrate Us — primary CTA */}
          <a
            href="https://dashboard.vizzle.in"
            target="_blank" rel="noopener noreferrer"
            style={{
              height: "40px", padding: "0 16px", borderRadius: "8px",
              background: T.brand, color: T.white,
              fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center",
              textDecoration: "none", boxShadow: "0 2px 8px rgba(29,141,178,0.3)",
              transition: "background .18s, box-shadow .18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.brandHover; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.brand; }}
          >
            Integrate Us
          </a>
        </div>

        {/* ── Hamburger (mobile <1024px) ── */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
          className="docs-nav-mobile-toggle"
          style={{
            marginLeft: "auto", width: "40px", height: "40px",
            display: "none", alignItems: "center", justifyContent: "center",
            borderRadius: "8px", border: "none", background: "transparent",
            cursor: "pointer", flexShrink: 0, color: T.text,
          }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div
          className="docs-nav-mobile-drawer"
          style={{
            position: "fixed", top: T.navHeight, left: 0, right: 0,
            background: T.white, borderBottom: `1px solid ${T.border}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 49,
            padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: "4px",
          }}
        >
          {[...PRIMARY_LINKS, ...MORE_LINKS].map(({ label, to, emoji }) => (
            <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>
              {emoji && <span style={{ marginRight: "8px" }}>{emoji}</span>}
              {label}
            </NavLink>
          ))}
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={() => { setMenuOpen(false); openSignInModal(); }}
              style={{
                width: "100%", height: "44px", borderRadius: "8px",
                border: `1.5px solid ${T.border}`, background: "transparent",
                fontSize: "14px", fontWeight: 600, color: T.text, cursor: "pointer",
              }}
            >Sign In</button>
            <a
              href="https://play.google.com/store/apps/details?id=app.vercel.vizzle_pwa.twa"
              target="_blank" rel="noopener noreferrer"
              style={{
                width: "100%", height: "44px", borderRadius: "8px",
                border: `1.5px solid #e5e7eb`, background: "transparent",
                fontSize: "14px", fontWeight: 600, color: "#1f2937",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", textDecoration: "none", boxSizing: "border-box",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.18 23.76c.3.17.64.24.98.21l11.64-11.64L12.14 8.7 3.18 23.76z" fill="#EA4335"/>
                <path d="M20.46 10.28l-3.02-1.72-3.46 3.46 3.46 3.46 3.04-1.74c.87-.5.87-1.96-.02-2.46z" fill="#FBBC04"/>
                <path d="M3.18.24C2.84.21 2.5.28 2.2.45 1.45.9 1 1.72 1 2.6v18.8c0 .88.45 1.7 1.2 2.15.3.17.64.24.98.21l.12-.07L14.76 12 3.3.31 3.18.24z" fill="#4285F4"/>
                <path d="M3.3.31l11.46 11.7 3.68-3.68L5.1.27C4.47-.1 3.74-.06 3.18.24L3.3.31z" fill="#34A853"/>
              </svg>
              Download on Google Play
            </a>
            <a
              href="https://dashboard.vizzle.in"
              target="_blank" rel="noopener noreferrer"
              style={{
                width: "100%", height: "44px", borderRadius: "8px",
                background: T.brand, color: T.white,
                fontSize: "14px", fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", boxSizing: "border-box",
              }}
            >Integrate Us</a>
          </div>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 1023px) {
          .docs-nav-desktop { display: none !important; }
          .docs-nav-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 1280px) {
          header[role="banner"] { height: 72px !important; }
        }
        .docs-nav-mobile-drawer a:focus-visible,
        .docs-nav-mobile-drawer button:focus-visible,
        header a:focus-visible,
        header button:focus-visible {
          outline: 2px solid #1D8DB2;
          outline-offset: 2px;
        }
      `}</style>
    </header>
  );
}

export default Navbar;
