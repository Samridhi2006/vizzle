import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

// ─── Gallery Data ─────────────────────────────────────────────────────────────
const COLUMNS = [
  [
    { src: '/gallery/col1_male_portrait.jpg',  alt: 'Male editorial portrait — charcoal blazer',       aspect: '16/9'  },
    { src: '/gallery/col1_blouse.jpg',          alt: 'Navy boho silk blouse with floral embroidery',    aspect: '1/1'   },
    { src: '/gallery/col1_seated_saree.jpg',    alt: 'Bronze Kanjeevaram silk saree on lounge chair',   aspect: '4/5'   },
  ],
  [
    { src: '/gallery/col2_male_full.jpg',       alt: 'Olive bomber jacket full-length male lookbook',   aspect: '3/5'   },
    { src: '/gallery/col2_male_seated.jpg',     alt: 'Mustard linen overshirt seated male',             aspect: '1/1'   },
    { src: '/gallery/col2_teal_suit.jpg',       alt: 'Peacock teal tailored pantsuit power pose',       aspect: '4/5'   },
  ],
  [
    { src: '/gallery/col3_trench_coat.jpg',     alt: 'Olive-khaki wrap trench coat with burgundy tote', aspect: '4/5'   },
    { src: '/gallery/col3_jewellery_macro.jpg', alt: 'Rose-gold pearl earrings beauty macro portrait',  aspect: '1/1'   },
    { src: '/gallery/col3_indo_western.jpg',    alt: 'Midnight blue peplum jacket with crimson palazzo', aspect: '4/5'   },
  ],
  [
    { src: '/gallery/col4_male_sherwani.jpg',   alt: 'Cream gold raw silk sherwani wedding lookbook',   aspect: '4/7'   },
    { src: '/gallery/col4_blazer_back.jpg',     alt: 'Ivory blazer back profile artistic shot',         aspect: '1/1'   },
    { src: '/gallery/col4_red_saree.jpg',       alt: 'Ruby red Banarasi brocade bridal saree',          aspect: '4/7'   },
  ],
  [
    { src: '/gallery/col5_wine_suit.jpg',       alt: 'Wine-red asymmetric peplum blazer set',           aspect: '4/6'   },
    { src: '/gallery/col5_female_denim.jpg',    alt: 'Light wash denim trucker jacket female model',    aspect: '4/5'   },
    { src: '/gallery/col5_boy_denim.jpg',       alt: 'Boy in light blue denim jacket — kids catalogue', aspect: '4/5'   },
  ],
];

// ─── Single Gallery Card ──────────────────────────────────────────────────────
function GalleryCard({ item, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#E2E8F0',
        position: 'relative',
        aspectRatio: item.aspect,
        cursor: 'pointer',
      }}
      className="group"
    >
      {/* Main image */}
      <img
        src={item.src}
        alt={item.alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.5s ease-out',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.00)'}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />

      {/* Hover dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(15,23,42,0)',
        transition: 'background 0.35s ease',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '10px',
        pointerEvents: 'none',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,23,42,0.35)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(15,23,42,0)'}
      >
        {/* AI badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '20px',
          padding: '4px 9px',
          fontSize: '10px',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.03em',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
          className="ai-badge"
        >
          <Sparkles size={9} color="#fff" />
          AI Generated
        </div>
      </div>
    </motion.div>
  );
}

// ─── Column wrapper ───────────────────────────────────────────────────────────
function GalleryColumn({ cards, colIndex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {cards.map((item, i) => (
        <GalleryCard key={i} item={item} delay={colIndex * 0.07 + i * 0.05} />
      ))}
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ResultsShowcaseGallery() {
  return (
    <section
      id="results-gallery"
      style={{
        background: '#F8FAFF',
        padding: '80px 24px 88px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <style>{`
        .gallery-card:hover .ai-badge { opacity: 1 !important; }
        .gallery-card:hover .hover-overlay { background: rgba(15,23,42,0.35) !important; }
      `}</style>

      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.9rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            margin: '0 0 14px',
          }}>
            Results That Speak.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Powered by Vizzle
            </span>
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', margin: 0, lineHeight: 1.75 }}>
            Premium AI fashion catalogue visuals across every style and category.
          </p>
        </motion.div>

        {/* ── 5-Column Masonry Grid ────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          alignItems: 'start',
        }}>
          {COLUMNS.map((col, i) => (
            <GalleryColumn key={i} cards={col} colIndex={i} />
          ))}
        </div>

        {/* ── CTA Button ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '48px' }}
        >
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              background: '#fff',
              color: '#0F172A',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'all 0.25s ease',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#06B6D4';
              e.currentTarget.style.color = '#0891B2';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(8,145,178,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#0F172A';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
            }}
          >
            View Full Gallery
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
