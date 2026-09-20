import { motion } from 'framer-motion';
import { ArrowRight, Timer, TrendingDown, Ruler } from 'lucide-react';

// ─── Card Data ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'brand',
    title: 'Brand Photography',
    subtitle: 'Premium on-brand product images without costly photoshoots.',
    main: '/catalogue/brand_main.jpg',
    inset: '/catalogue/brand_flatlay.jpg',
    insetLabel: 'Flatlay',
    insetPos: { bottom: '12px', left: '12px' },
    arrowInset: false,
  },
  {
    id: 'ecom',
    title: 'E-commerce Product Page',
    subtitle: 'Consistent, clean product photos for websites and marketplaces.',
    main: '/catalogue/ecom_main.jpg',
    inset: '/catalogue/ecom_flatlay.jpg',
    insetLabel: 'Flatlay',
    insetPos: { bottom: '12px', left: '12px' },
    arrowInset: false,
  },
  {
    id: 'lookbook',
    title: 'Lookbooks & Collections',
    subtitle: 'Showcase collections with cohesive styling and backgrounds.',
    main: '/catalogue/lookbook_main.jpg',
    inset: '/catalogue/lookbook_flatlay.jpg',
    insetLabel: 'Flatlay',
    insetPos: { bottom: '12px', left: '12px' },
    arrowInset: false,
  },
  {
    id: 'market',
    title: 'Marketplace Listings',
    subtitle: 'Optimized listing images designed to attract more buyers.',
    main: '/catalogue/market_main.jpg',
    inset: '/catalogue/market_base.jpg',
    insetLabel: 'Base',
    insetPos: { bottom: '12px', left: '12px' },
    arrowInset: true,
  },
  {
    id: 'social',
    title: 'Social Media Content',
    subtitle: 'Create engaging visuals for social media and ad campaigns.',
    main: '/catalogue/social_main.jpg',
    inset: '/catalogue/social_base.jpg',
    insetLabel: 'Base',
    insetPos: { bottom: '12px', left: '12px' },
    arrowInset: true,
  },
  {
    id: 'ads',
    title: 'Ad Creatives',
    subtitle: 'High-converting marketing visuals that drive clicks and sales.',
    main: '/catalogue/ads_main.jpg',
    inset: '/catalogue/ads_base.jpg',
    insetLabel: 'Base',
    insetPos: { bottom: '12px', left: '12px' },
    arrowInset: true,
  },
];

const STATS = [
  { icon: Timer,        value: '10X',  label: 'Faster Production', desc: 'Create high-quality visuals in minutes' },
  { icon: TrendingDown, value: '80%',  label: 'Cost Reduction',    desc: 'Cut production costs by up to 80%' },
  { icon: Ruler,        value: '100%', label: 'Design Accuracy',   desc: 'Consistent colours, fit, and styling every time' },
];

// ─── Single Card ──────────────────────────────────────────────────────────────
function ShowcaseCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.10)', transition: { duration: 0.25 } }}
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(226,232,240,0.8)',
        padding: '12px 12px 20px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Visual area */}
      <div style={{
        position: 'relative',
        borderRadius: '10px',
        overflow: 'visible',
        aspectRatio: '16/11',
        background: '#F8FAFC',
        marginBottom: '14px',
      }}>
        {/* Main image */}
        <img
          src={card.main}
          alt={card.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '10px',
            display: 'block',
          }}
        />

        {/* Floating inset card */}
        <div style={{
          position: 'absolute',
          bottom: card.insetPos.bottom,
          left: card.insetPos.left,
          background: '#fff',
          borderRadius: '10px',
          border: '1.5px solid #F1F5F9',
          boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
          padding: '4px',
          width: '72px',
          zIndex: 10,
          overflow: 'hidden',
        }}>
          <img
            src={card.inset}
            alt={`${card.title} ${card.insetLabel}`}
            style={{
              width: '100%',
              aspectRatio: '1/1',
              objectFit: 'cover',
              borderRadius: '7px',
              display: 'block',
            }}
          />
          {/* Arrow connector for base→final cards */}
          {card.arrowInset && (
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-22px',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(37,99,235,0.4)',
            }}>
              <ArrowRight size={10} color="#fff" strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: '0 4px' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.02em',
          margin: '0 0 5px',
        }}>
          {card.title}
        </h3>
        <p style={{
          fontSize: '12.5px',
          color: '#64748B',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {card.subtitle}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
function StatsBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="vz-showcase-stats-banner"
      style={{
        marginTop: '56px',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '20px',
        padding: '40px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '48px',
        alignItems: 'center',
      }}
    >
      {/* Left: Title */}
      <div>
        <h3 style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.03em',
          margin: '0 0 8px',
        }}>
          Trusted by Indian Fashion Sellers
        </h3>
        <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
          Smarter, faster, more scalable catalogue creation for modern fashion brands.
        </p>
      </div>

      {/* Right: 3 stats */}
      <div
        className="vz-showcase-stats-row"
        style={{
          display: 'flex',
          gap: '32px',
          flexShrink: 0,
          alignItems: 'flex-start',
        }}
      >
        {STATS.map((stat, i) => (
          <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0' }}>
            {/* Icon container */}
            <div
              aria-hidden="true"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(56,189,248,0.12)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                flexShrink: 0,
              }}
            >
              <stat.icon size={24} strokeWidth={1.75} color="#38BDF8" />
            </div>
            {/* Value */}
            <div style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 900,
              color: '#38BDF8',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>
              {stat.value}
            </div>
            {/* Label */}
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginTop: '4px', whiteSpace: 'nowrap' }}>
              {stat.label}
            </div>
            {/* Description */}
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', maxWidth: '120px', lineHeight: 1.5 }}>
              {stat.desc}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CatalogueShowcaseGrid() {
  return (
    <section
      id="catalogue-showcase"
      style={{
        background: '#F8FAFF',
        padding: '80px 24px 88px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.9rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            margin: '0 0 16px',
          }}>
            Create Better Catalogues,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Faster with AI
            </span>
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#64748B',
            lineHeight: 1.75,
            margin: 0,
          }}>
            From product pages to social ads — create every visual your brand needs, all in one place.
            Vizzle helps you produce every type of fashion visual your business needs. No matter your goal,
            we have you covered.
          </p>
        </motion.div>

        {/* ── 6-Card Grid ──────────────────────────────────────────── */}
        <div
          className="vz-showcase-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {CARDS.map((card, i) => (
            <ShowcaseCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* ── Stats Banner ─────────────────────────────────────────── */}
        <StatsBanner />

      </div>
    </section>
  );
}
