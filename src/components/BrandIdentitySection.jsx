import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useModal, FIELD_PRESETS } from '../context/ModalContext';

// ─── Photo grid data ──────────────────────────────────────────────────────────
const PHOTOS = [
  { src: '/brand_vest_trousers.jpg',      alt: 'Ivory vest & wide-leg beige trousers — editorial lookbook' },
  { src: '/brand_evening_gown.jpg',       alt: 'Champagne blush pleated evening gown — Mediterranean villa' },
  { src: '/brand_floral_saree.jpg',       alt: 'Beige floral chiffon saree — limestone studio' },
  { src: '/brand_portrait_jewellery.jpg', alt: 'Maroon blouse & gold polki necklace — beauty portrait' },
  { src: '/brand_seated_wrap.jpg',        alt: 'Beige linen wrap & floral skirt — seated editorial' },
  { src: '/brand_chocolate_dress.jpg',    alt: 'Chocolate brown pleated maxi dress — limestone wall' },
];

// ─── Photo card ───────────────────────────────────────────────────────────────
function PhotoCard({ photo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(231,229,228,0.7)',
        boxShadow: '0 2px 12px rgba(120,100,80,0.07)',
        aspectRatio: '3/4',
        background: '#F5F0EB',
        cursor: 'pointer',
      }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(120,100,80,0.14)', transition: { duration: 0.28 } }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.5s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      />
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function BrandIdentitySection() {
  const { openModal } = useModal();
  return (
    <section
      id="brand-identity"
      style={{
        background: 'linear-gradient(160deg, #FDFBF7 0%, #FAF7F2 50%, #FDFBF7 100%)',
        padding: '88px 24px 96px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Ambient warm radial glow */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-120px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: '-80px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        className="vz-brand-main-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '5fr 7fr',
          gap: '64px',
          alignItems: 'center',
          position: 'relative',
        }}
      >

        {/* ── LEFT: Text & CTA ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 900,
            color: '#1C1917',
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            margin: '0 0 16px',
          }}>
            Build a Powerful Brand Identity{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #0D9488 50%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Without Photoshoots
            </span>
          </h2>

          {/* Italic lead */}
          <p style={{
            fontSize: '15px',
            color: '#78716C',
            fontStyle: 'italic',
            fontWeight: 500,
            margin: '0 0 16px',
            lineHeight: 1.6,
          }}>
            Skip expensive shoots. Go live with premium visuals today.
          </p>

          {/* Body copy */}
          <p style={{
            fontSize: '14.5px',
            color: '#57534E',
            lineHeight: 1.8,
            margin: '0 0 36px',
          }}>
            Photoshoots are expensive, slow, and difficult to replicate. With
            Vizzle you get high-quality model pictures of all products without
            stepping into a studio. Keep the same model, style, and look across
            your full catalogue. Your brand looks consistent, professional, and
            ready to sell.
          </p>

          {/* CTA */}
          <motion.button
            onClick={() => openModal('Create Your AI Catalogue', FIELD_PRESETS.all)}
            id="brand-identity-cta"
            whileHover={{ y: -2, transition: { duration: 0.22 } }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0891B2 0%, #0D9488 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14.5px',
              padding: '14px 28px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(8,145,178,0.25)',
              letterSpacing: '-0.01em',
              transition: 'box-shadow 0.25s ease',
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(8,145,178,0.38)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(8,145,178,0.25)'; }}
          >
            Create Your AI Catalogue
            <ArrowRight size={15} strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {/* ── RIGHT: 6-photo editorial grid ────────────────────────────────── */}
        <div
          className="vz-brand-photo-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
          }}
        >
          {PHOTOS.map((photo, i) => (
            <PhotoCard key={i} photo={photo} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
