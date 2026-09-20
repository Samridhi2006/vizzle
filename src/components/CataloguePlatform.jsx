import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useModal, FIELD_PRESETS } from '../context/ModalContext';

// ─── Category Cards Data ──────────────────────────────────────────────────────
// Swap src paths to any image in /public as needed
const CATEGORIES = [
  {
    id: 1,
    label: 'Menswear',
    sub: 'Tailored & Formal',
    src: '/vz_menswear_blazer.jpg',
    accent: '#78350F',
  },
  {
    id: 2,
    label: 'Womenswear',
    sub: 'Chic & Contemporary',
    src: '/vz_female_beige_suit.jpg',
    accent: '#7C3AED',
  },
  {
    id: 3,
    label: 'Casuals',
    sub: 'Everyday Streetwear',
    src: '/vz_model_hoodie.jpg',
    accent: '#059669',
  },
  {
    id: 4,
    label: 'Womenswear',
    sub: 'Power Dressing',
    src: '/hero_model_3.jpg',
    accent: '#DC2626',
  },
  {
    id: 5,
    label: 'Ethnic & Couture',
    sub: 'Draped & Traditional',
    src: '/vz_thumb_lilac_saree.jpg',
    accent: '#2563EB',
  },
  {
    id: 6,
    label: 'Jewellery',
    sub: 'High Fashion Accessories',
    src: '/vz_jewellery_pearl.jpg',
    accent: '#1D4ED8',
  },
  {
    id: 7,
    label: 'Formals',
    sub: 'Classic Professional',
    src: '/hero_model_2.jpg',
    accent: '#0F172A',
  },
  {
    id: 8,
    label: 'Flatlay',
    sub: 'Product Photography',
    src: '/vz_flatlay_hoodie.jpg',
    accent: '#059669',
  },
];

// Duplicate for seamless infinite loop
const TRACK = [...CATEGORIES, ...CATEGORIES];

// ─── Single Card ─────────────────────────────────────────────────────────────
function GalleryCard({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        minWidth: '300px',
        width: '300px',
        height: '480px',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 24px 48px rgba(0,0,0,0.22)'
          : '0 8px 24px rgba(0,0,0,0.10)',
        transition: 'box-shadow 0.4s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={item.src}
        alt={item.label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          display: 'block',
        }}
      />

      {/* Gradient overlay — always present, darkens on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.24) 40%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.10) 45%, transparent 100%)',
        transition: 'background 0.4s ease',
      }} />

      {/* Category Label */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px 20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {/* Glassmorphism chip — visible on hover */}
        {hovered && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.25)',
            fontSize: '10px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            width: 'fit-content',
            marginBottom: '4px',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: item.accent,
            }} />
            {item.sub}
          </div>
        )}

        {/* Bold category name */}
        <span style={{
          fontSize: hovered ? '22px' : '18px',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          transition: 'font-size 0.3s ease',
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {item.label}
        </span>
      </div>

      {/* Accent top-left dot */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: item.accent,
        boxShadow: `0 0 12px ${item.accent}`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
    </div>
  );
}

// ─── Infinite Marquee Track ───────────────────────────────────────────────────
function MarqueeTrack() {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const SPEED = 0.6; // px per frame
  const CARD_W = 316; // 300px + 16px gap
  const HALF = CATEGORIES.length * CARD_W;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const animate = () => {
      if (!paused) {
        posRef.current -= SPEED;
        if (posRef.current <= -HALF) {
          posRef.current += HALF;
        }
        el.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', width: '100%' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left fade */}
      <div style={{
        position: 'absolute',
        inset: '0',
        left: 0,
        width: '120px',
        background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)',
        zIndex: 10,
        pointerEvents: 'none',
      }} />
      {/* Right fade */}
      <div style={{
        position: 'absolute',
        inset: '0',
        right: 0,
        left: 'auto',
        width: '120px',
        background: 'linear-gradient(to left, #ffffff 0%, transparent 100%)',
        zIndex: 10,
        pointerEvents: 'none',
      }} />

      {/* Scrolling track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '16px',
          padding: '16px 0 24px',
          willChange: 'transform',
        }}
      >
        {TRACK.map((item, i) => (
          <GalleryCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CataloguePhotoshootSection() {
  const { openModal } = useModal();
  return (
    <section
      id="catalogue-platform"
      style={{
        background: '#ffffff',
        padding: '96px 0 80px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        textAlign: 'center',
        marginBottom: '56px',
      }}>
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 18px',
            borderRadius: '999px',
            background: 'rgba(8,145,178,0.08)',
            border: '1px solid rgba(8,145,178,0.22)',
            fontSize: '11px',
            fontWeight: 800,
            color: '#0891B2',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          <span>⚡</span>
          All-In-One AI Fashion Studio
        </motion.div>

        {/* H2 */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            fontWeight: 900,
            color: '#0F172A',
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            margin: '0 0 18px',
          }}
        >
          Your AI Catalogue{' '}
          <span style={{
            background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Photoshoot Platform
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          style={{
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            color: '#64748B',
            lineHeight: 1.75,
            maxWidth: '560px',
            margin: '0 auto 32px',
          }}
        >
          Artificial Intelligence-generated professional-quality photos, done in minutes.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <button
            id="catalogue-watch-demo"
            onClick={() => openModal('Watch A Demo', FIELD_PRESETS.all)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '-0.01em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(8,145,178,0.30)',
              transition: 'all 0.28s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(8,145,178,0.40)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(8,145,178,0.30)';
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.20)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Play size={13} fill="#fff" stroke="none" />
            </div>
            Watch a Demo
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>

      {/* ── Infinite Marquee Gallery ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <MarqueeTrack />
      </motion.div>

      {/* ── Bottom Stat Bar ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '64px auto 0', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="vz-cat-stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(8,145,178,0.14)',
            boxShadow: '0 8px 32px rgba(8,145,178,0.08)',
          }}
        >
          {[
            { value: '10x', label: 'Faster Catalogue Turnaround' },
            { value: '85%', label: 'Reduction in Photoshoot Costs' },
            { value: '99.4%', label: 'Photorealistic Fabric Drape Accuracy' },
          ].map((s, i) => (
            <div
              key={i}
              className="vz-cat-stat-card"
              style={{
                padding: '32px 24px',
                textAlign: 'center',
                background: i === 1
                  ? 'linear-gradient(135deg, #0891B2 0%, #0d9488 100%)'
                  : '#fff',
                borderRight: i < 2 ? '1px solid rgba(8,145,178,0.10)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {i === 1 && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }} />
              )}
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 900,
                color: i === 1 ? '#fff' : '#0891B2',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                marginBottom: '8px',
              }}>{s.value}</div>
              <div style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: i === 1 ? 'rgba(255,255,255,0.85)' : '#64748B',
                lineHeight: 1.5,
              }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
