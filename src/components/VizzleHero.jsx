/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useModal, FIELD_PRESETS } from '../context/ModalContext';

// ─── Constants ────────────────────────────────────────────────────────────────
const SLIDE_DURATION = 6000;

const SLIDE3_THUMBS = [
  { src: '/vz_thumb_burgundy_top.jpg', label: 'Burgundy Top'  },
  { src: '/vz_thumb_beige_suit.jpg',   label: 'Beige Suit'    },
  { src: '/vz_thumb_lilac_saree.jpg',  label: 'Lilac Saree'   },
  { src: '/vz_thumb_black_shirt.jpg',  label: 'Black Shirt'   },
  { src: '/vz_thumb_dress.jpg',        label: 'Evening Dress'  },
];

// ─── Slide data ───────────────────────────────────────────────────────────────
// ⚠️  heroBg MUST be tuned to each model's studio background colour so that
//     mix-blend-multiply makes the photo rectangle invisible.
// Shared gradient span style — backgroundImage (NOT background shorthand),
// display:inline, and color:transparent are ALL required for clip-to-text
const gradientSpan = (colors) => ({
  backgroundImage: `linear-gradient(90deg, ${colors})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
  display: 'inline',
});

const SLIDES = [
  {
    id: 0,
    badge: 'MODERN CATALOGUE CREATION, POWERED BY AI',
    badgeColor: '#0e7490',
    badgeBg: 'rgba(236,254,255,0.85)',
    badgeBorder: 'rgba(8,145,178,0.30)',
    ctaBg: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
    ctaShadow: 'rgba(8,145,178,0.28)',
    headingJSX: (
      <>
        AI Catalogue Creation for{' '}
        <span style={gradientSpan('#0891b2, #4f46e5')}>Fashion Brands</span>
      </>
    ),
    subtext: 'Revolutionize your fashion business with AI-powered virtual try-on, advanced draping software and automated product catalogue creation.',
    heroBg: '#e4e8ed',
  },
  {
    id: 1,
    badge: 'AI VIRTUAL TRY-ON',
    badgeColor: '#1d4ed8',
    badgeBg: 'rgba(239, 246, 255, 0.95)',
    badgeBorder: 'rgba(59, 130, 246, 0.35)',
    ctaBg: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)',
    ctaShadow: 'rgba(37, 99, 235, 0.35)',
    headingJSX: (
      <>
        Try Before You Buy with{' '}
        <span style={gradientSpan('#0891b2, #4f46e5')}>Vizzle</span>
      </>
    ),
    subtext: 'Visualize outfits on your own appearance, compare different styles, and make smarter purchase decisions with a seamless AI-powered virtual try-on experience.',
    heroBg: 'linear-gradient(135deg, #faece6 0%, #fbf3ee 45%, #fdf8f5 100%)',
  },
  {
    id: 2,
    badge: 'MODERN CATALOGUE CREATION, POWERED BY AI',
    badgeColor: '#854d0e',
    badgeBg: 'rgba(254, 252, 232, 0.9)',
    badgeBorder: 'rgba(202, 138, 4, 0.30)',
    ctaBg: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
    ctaShadow: 'rgba(8,145,178,0.28)',
    headingJSX: (
      <>
        AI Catalogue Creation for{' '}
        <span style={gradientSpan('#0891b2, #4f46e5')}>Fashion Brands</span>
      </>
    ),
    subtext: 'Revolutionize your fashion business with AI-powered virtual try-on, advanced draping software and automated product catalogue creation.',
    heroBg: '#ede5d8',
  },
];

// ─── Framer variants (right column only) ─────────────────────────────────────
const showcaseVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ?  24 : -24 }),
  center: {         opacity: 1, x: 0, transition: { duration: 0.48, ease: [0.4, 0, 0.2, 1] } },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -24 :  24, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } }),
};

// ─── Floating tilted "Create Catalogue" card ─────────────────────────────────
function FloatingCard({ src, alt, rotation, delay, extraStyle = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.93 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      transition={{ delay, duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'absolute',
        width: '130px',
        borderRadius: '14px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 14px 44px rgba(0,0,0,0.20)',
        transform: `rotate(${rotation}deg)`,
        zIndex: 20,
        ...extraStyle,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '86px', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        background: '#111',
        color: '#fff',
        fontSize: '10px',
        fontWeight: 700,
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        letterSpacing: '0.03em',
      }}>
        Create Catalogue 🪄
      </div>
    </motion.div>
  );
}

// ─── SLIDE 1 ─── Male model + 2 floating cards ───────────────────────────────
//
//  KEY FIX: Hero bg is set to #eef1f5 which exactly matches the cool
//  grey studio background of vz_model_hoodie.jpg.
//  mix-blend-multiply makes the photo background = hero bg → zero border.
//  model is absolutely positioned to fill the full height from bottom.
//
function Slide1() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

      {/* Model — pinned bottom-center, mix-blend-multiply erases rectangular edges */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <img
          src="/vz_model_hoodie.jpg"
          alt="Male model in dark green hoodie"
          style={{
            height: '100%',
            width: 'auto',
            maxWidth: '420px',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
            // mix-blend-multiply: where the photo bg (#eef1f5) meets the hero bg (#eef1f5) → identical → invisible
            mixBlendMode: 'multiply',
            // soft bottom fade so feet blend smoothly into hero
            maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
          }}
        />
      </div>

      {/* Card bottom-left — coral border ring */}
      <FloatingCard
        src="/vz_flatlay_hoodie.jpg"
        alt="Green hoodie flatlay"
        rotation={-5}
        delay={0.25}
        extraStyle={{ bottom: '52px', left: '8px', border: '2.5px solid #fb7185' }}
      />

      {/* Card top-right — neutral ring */}
      <FloatingCard
        src="/vz_thumb_sunglasses.jpg"
        alt="Sunglasses"
        rotation={4}
        delay={0.42}
        extraStyle={{ top: '20px', right: '4px', border: '2px solid rgba(255,255,255,0.7)' }}
      />
    </div>
  );
}

// ─── SLIDE 2 ─── Virtual Try-On 3-column flow ─────────────────────────────────
function Slide2() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* 1. Base Model — left 42%, full height */}
      <img
        src="/vz_tryon_base.png"
        alt="Base Model"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '42%',
          objectFit: 'contain',
          objectPosition: 'bottom left',
        }}
      />

      {/* 3. Result Model — right 42%, full height */}
      <img
        src="/vz_tryon_result.png"
        alt="Dressed Model Result"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: '42%',
          objectFit: 'contain',
          objectPosition: 'bottom right',
        }}
      />

      {/* 2. Garment — centered overlay */}
      <img
        src="/vz_tryon_garment.png"
        alt="Garment Flatlay"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -40%)',
          height: '72%',
          width: 'auto',
          objectFit: 'contain',
          zIndex: 5,
        }}
      />

      {/* '+' badge */}
      <div style={{
        position: 'absolute',
        left: '29%',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(0,0,0,0.10)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '18px',
        color: '#1e293b',
      }}>+</div>

      {/* '→' badge */}
      <div style={{
        position: 'absolute',
        right: '26%',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(59,130,246,0.35)',
        boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 18C5 13.2 8.2 9.2 13.8 9V4.5L22 11.5L13.8 18.5V14C9.5 14 6.8 16 5 18Z"
            fill="#2563eb"
          />
        </svg>
      </div>
    </div>
  );
}


// ─── SLIDE 3 ─── Female model + 5-thumb product selector ─────────────────────
//
//  KEY FIX:  Hero bg = #ede5d8.  Female model jpg has a warm terracotta bg.
//  mix-blend-multiply on the model photo makes the rectangle vanish completely.
//  The image fills from the very top down to the thumbnail strip.
//
function Slide3({ activeThumb, setActiveThumb }) {
  const STRIP_H = 112; // px — thumbnail strip height

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

      {/* Model — fills all space above the strip, left-center biased */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: `${STRIP_H}px`,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}>
        <img
          src="/vz_female_beige_suit.jpg"
          alt="Female model in beige cropped blazer set"
          style={{
            height: '100%',
            width: 'auto',
            maxWidth: '380px',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
            // Hero bg = #ede5d8 ≈ model studio bg → border vanishes
            mixBlendMode: 'multiply',
            maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
          }}
        />
      </div>

      {/* Thumbnail strip — pinned to bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: `${STRIP_H}px`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 10px 10px',
        overflowX: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        {SLIDE3_THUMBS.map((t, i) => {
          const isActive = activeThumb === i;
          return (
            <button
              key={t.label}
              onClick={() => setActiveThumb(i)}
              aria-label={t.label}
              style={{
                flexShrink: 0,
                position: 'relative',
                width:  isActive ? '100px' : '84px',
                height: isActive ? '100px' : '84px',
                borderRadius: '10px',
                overflow: 'hidden',
                background: '#fff',
                border:      isActive ? '2.5px solid #ca8a04' : '2px solid rgba(255,255,255,0.55)',
                boxShadow:   isActive
                  ? '0 4px 20px rgba(202,138,4,0.25)'
                  : '0 2px 8px rgba(0,0,0,0.10)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: isActive ? 1 : 0.80,
              }}
            >
              <img
                src={t.src}
                alt={t.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: '#111',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '5px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  letterSpacing: '0.02em',
                }}>
                  Create Catalogue 🪄
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Progress indicator lines ─────────────────────────────────────────────────
function ProgressLines({ current, total, progress, onSelect }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          id={`vizzle-indicator-${i}`}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          style={{
            position: 'relative',
            height: '3px',
            width: i === current ? '52px' : '28px',
            borderRadius: '99px',
            background: 'rgba(0,0,0,0.14)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
          }}
        >
          {i === current && (
            <motion.div
              style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                background: '#1e293b',
                borderRadius: '99px',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.08, ease: 'linear' }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function VizzleNavbar() {
  const { openModal, openSignInModal } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: 'Catalogue Showcase', to: '/catalogue-showcase' },
    { label: 'Virtual Try-On',     to: '/virtual-try-on'     },
    { label: 'Pricing',            to: '/pricing'            },
    { label: 'Blogs',              to: '/blogs'              },
    { label: 'Contact',            to: '/contact'            },
  ];

  return (
    <nav className="vz-nav">
      {/* Logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <img
          src="/logo.png"
          alt="Vizzle"
          style={{ height: '40px', width: 'auto', objectFit: 'contain', display: 'block' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.15 }}>Vizzle</div>
          <div style={{ fontSize: '9px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.09em', textTransform: 'uppercase' }}>Visualize Your Style</div>
        </div>
      </div>

      {/* Desktop nav links */}
      <div className="vz-nav-links">
        {NAV_LINKS.map((l) => (
          <Link key={l.label} to={l.to} style={{ fontSize: '13.5px', fontWeight: 500, color: '#475569', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Desktop CTA + Sign In */}
      <div className="vz-nav-cta">
        <button
          onClick={() => openModal('Try Free Catalogue Creation', FIELD_PRESETS.all)}
          style={{ fontSize: '13px', fontWeight: 600, color: '#334155', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', padding: 0, fontFamily: 'inherit' }}
        >
          Try Free Catalogue Creation Now
        </button>
        <button
          onClick={openSignInModal}
          style={{
            padding: '9px 20px',
            borderRadius: '999px',
            background: '#0f172a',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#0f172a'; }}
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
            width: '38px', height: '38px', borderRadius: '10px',
            border: '1.5px solid #e2e8f0',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff', textDecoration: 'none', flexShrink: 0,
            transition: 'border-color 0.18s, box-shadow 0.18s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#01875f'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(1,135,95,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.18 23.76c.3.17.64.24.98.21l11.64-11.64L12.14 8.7 3.18 23.76z" fill="#EA4335"/>
            <path d="M20.46 10.28l-3.02-1.72-3.46 3.46 3.46 3.46 3.04-1.74c.87-.5.87-1.96-.02-2.46z" fill="#FBBC04"/>
            <path d="M3.18.24C2.84.21 2.5.28 2.2.45 1.45.9 1 1.72 1 2.6v18.8c0 .88.45 1.7 1.2 2.15.3.17.64.24.98.21l.12-.07L14.76 12 3.3.31 3.18.24z" fill="#4285F4"/>
            <path d="M3.3.31l11.46 11.7 3.68-3.68L5.1.27C4.47-.1 3.74-.06 3.18.24L3.3.31z" fill="#34A853"/>
          </svg>
        </a>
      </div>

      {/* Hamburger — mobile only */}
      <button
        className="vz-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '10px',
          width: '44px',
          height: '44px',
          minWidth: '44px',
          minHeight: '44px',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: 22, height: 2, background: '#0f172a', marginBottom: 5, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
        <div style={{ width: 22, height: 2, background: '#0f172a', marginBottom: 5, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
        <div style={{ width: 22, height: 2, background: '#0f172a', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="vz-mobile-menu">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '12px 24px', fontSize: '15px', fontWeight: 600, color: '#0f172a', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => { setMenuOpen(false); openModal('Try Free Catalogue Creation', FIELD_PRESETS.all); }}
              style={{ fontSize: '14px', fontWeight: 600, color: '#334155', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit' }}
            >
              Try Free Catalogue Creation Now
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                openSignInModal();
              }}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '999px',
                background: '#0f172a',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Sign In
            </button>
            <a
              href="https://play.google.com/store/apps/details?id=app.vercel.vizzle_pwa.twa"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '999px',
                border: '1.5px solid #e2e8f0', background: '#fff',
                fontSize: '14px', fontWeight: 600, color: '#374151',
                textDecoration: 'none', textAlign: 'center',
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
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
function VizzleHeroSection({ setIsFormOpen }) {
  const { openModal } = useModal();
  const [current,     setCurrent]     = useState(0);
  const [direction,   setDirection]   = useState(1);
  const [progress,    setProgress]    = useState(0);
  const [activeThumb, setActiveThumb] = useState(1);
  const timerRef = useRef(null);
  const rafRef   = useRef(null);
  const t0       = useRef(null);

  const goToSlide = useCallback((next) => {
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
    setProgress(0);
    t0.current = performance.now();
  }, [current]);

  const advance = useCallback(() => {
    goToSlide((current + 1) % SLIDES.length);
  }, [current, goToSlide]);

  useEffect(() => {
    setProgress(0);
    t0.current = performance.now();
    const tick = (now) => {
      const pct = Math.min(((now - t0.current) / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current]);

  useEffect(() => {
    timerRef.current = setInterval(advance, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [advance]);

  const handleIndicator = (i) => {
    clearInterval(timerRef.current);
    goToSlide(i);
    timerRef.current = setInterval(advance, SLIDE_DURATION);
  };

  const slide = SLIDES[current];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        #vz-hero * { box-sizing: border-box; }
        #vz-hero button { background: none; border: none; padding: 0; cursor: pointer; }
        #vz-hero a:hover { opacity: 0.78; }

        /* ── Navbar responsive ── */
        .vz-nav {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 64px;
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          flex-wrap: wrap;
          z-index: 1000;
        }
        .vz-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .vz-nav-cta {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .vz-mobile-menu {
          display: none;
        }

        /* ── Hero responsive ── */
        .vz-hero-grid {
          margin: 10px 12px 0;
          border-radius: 24px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 5fr 7fr;
          grid-template-rows: 620px;
          height: 620px;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
        }
        .vz-hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 40px 44px 52px;
          position: relative;
          z-index: 10;
          height: 620px;
          overflow: hidden;
        }
        .vz-hero-right {
          position: relative;
          overflow: hidden;
          height: 620px;
        }

        @media (max-width: 768px) {
          /* Nav */
          .vz-nav {
            padding: 0 20px;
            height: auto;
            min-height: 60px;
            align-items: center;
          }
          .vz-nav-links { display: none; }
          .vz-nav-cta   { display: none; }
          .vz-hamburger { display: flex !important; flex-direction: column; justify-content: center; align-items: center; width: 44px; height: 44px; min-width: 44px; min-height: 44px; }
          .vz-mobile-menu {
            display: block;
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background: #fff;
            border-bottom: 1px solid #f1f5f9;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            z-index: 999;
          }

          /* Hero stacks vertically */
          .vz-hero-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto auto !important;
            height: auto !important;
            margin: 8px 8px 0;
            border-radius: 16px;
          }
          .vz-hero-left {
            height: auto !important;
            padding: 32px 24px 28px;
            overflow: visible;
          }
          .vz-hero-right {
            height: 300px !important;
          }

          /* Text wrapping */
          .vz-hero-left h1 {
            font-size: clamp(1.5rem, 6vw, 2rem) !important;
            word-break: break-word;
            overflow-wrap: break-word;
          }
          .vz-hero-left p {
            max-width: 100% !important;
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 480px) {
          .vz-hero-right { height: 240px !important; }
          .vz-hero-left h1 { font-size: clamp(1.35rem, 7vw, 1.7rem) !important; }
        }
      `}</style>

      <VizzleNavbar />

      {/*
        ═══════════════════════════════════════════════════════════════════
        HERO LAYOUT — static 12-col grid.
        Left (5 cols): text only, never animates.
        Right (7 cols): AnimatePresence, x-slide only.

        Background is a single flat colour per slide, tuned to the model's
        studio backdrop so mix-blend-multiply eliminates photo rectangles.
        ═══════════════════════════════════════════════════════════════════
      */}
      <div
        id="vz-hero"
        className="vz-hero-grid"
        style={{
          background: slide.heroBg,
          transition: 'background 0.75s ease',
        }}
      >
        {/* ══════════════════════════════════════════════════════
            LEFT — static, never moves
        ══════════════════════════════════════════════════════ */}
        <div className="vz-hero-left">
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '6px 14px',
            borderRadius: '999px',
            border: `1px solid ${slide.badgeBorder || 'rgba(8,145,178,0.30)'}`,
            background: slide.badgeBg || 'rgba(236,254,255,0.85)',
            backdropFilter: 'blur(10px)',
            fontSize: '10.5px',
            fontWeight: 700,
            color: slide.badgeColor || '#0e7490',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
            marginBottom: '20px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
            transition: 'all 0.5s ease',
          }}>
            <Sparkles size={11} style={{ color: slide.badgeColor || '#0891b2', flexShrink: 0 }} />
            {slide.badge}
          </div>

          {/* H1 — instant text swap, gradient accent on key words */}
          <h1 style={{
            fontSize: 'clamp(1.65rem, 3.1vw, 2.6rem)',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: '0 0 16px',
          }}>
            {slide.headingJSX}
          </h1>

          {/* Body */}
          <p style={{
            fontSize: 'clamp(0.83rem, 1.1vw, 0.96rem)',
            color: '#64748b',
            lineHeight: 1.7,
            margin: '0 0 28px',
            maxWidth: '380px',
          }}>
            {slide.subtext}
          </p>

          {/* CTA Button */}
          <button
            id="vizzle-hero-cta"
            onClick={() => {
              openModal('Book a Free Demo', FIELD_PRESETS.all);
              setIsFormOpen && setIsFormOpen(true);
            }}
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              borderRadius: '999px',
              background: slide.ctaBg || 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
              color: '#fff',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 6px 24px ${slide.ctaShadow || 'rgba(8,145,178,0.28)'}`,
              transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.5s ease',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 10px 30px ${slide.ctaShadow || 'rgba(8,145,178,0.42)'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 6px 24px ${slide.ctaShadow || 'rgba(8,145,178,0.28)'}`;
            }}
          >
            Book A Free Demo
            <ArrowRight size={15} style={{ flexShrink: 0 }} />
          </button>

          {/* Slide indicators */}
          <ProgressLines
            current={current}
            total={SLIDES.length}
            progress={progress}
            onSelect={handleIndicator}
          />
        </div>

        {/* ══════════════════════════════════════════════════════
            RIGHT — AnimatePresence, x-slide
        ══════════════════════════════════════════════════════ */}
        <div className="vz-hero-right">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`showcase-${current}`}
              custom={direction}
              variants={showcaseVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ position: 'absolute', inset: 0 }}
            >
              {current === 0 && <Slide1 />}
              {current === 1 && <Slide2 />}
              {current === 2 && (
                <Slide3
                  activeThumb={activeThumb}
                  setActiveThumb={setActiveThumb}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default VizzleHeroSection;
