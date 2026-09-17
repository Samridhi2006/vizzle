import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useModal, FIELD_PRESETS } from '../context/ModalContext';

export default function AIModelLineup() {
  const { openModal } = useModal();
  return (
    <section
      id="ai-model-lineup"
      style={{
        padding: '40px 24px 0',
        background: '#FAFBFF',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Warm studio card */}
      <div
        className="vz-lineup-card"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'linear-gradient(to right, #F7F3EC, #F4EFE6, #ECE5D8)',
          borderRadius: '28px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '460px',
          display: 'grid',
          gridTemplateColumns: '7fr 5fr',
          alignItems: 'center',
        }}
      >

        {/* ── LEFT: Family lineup image (bottom-anchored) ─────────────────── */}
        <div
          className="vz-lineup-img-wrap"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            height: '100%',
            paddingBottom: '0',
            overflow: 'hidden',
          }}
        >
          <motion.img
            src="/ai_models_family_lineup.jpg"
            alt="AI model lineup — Indian family in white tees and black trousers"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '500px',
              objectFit: 'contain',
              objectPosition: 'bottom',
              display: 'block',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {/* ── RIGHT: Copy & CTA ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="vz-lineup-copy"
          style={{
            padding: '48px 48px 48px 16px',
          }}
        >
          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.03em',
            lineHeight: 1.18,
            margin: '0 0 20px',
          }}>
            Choose the Perfect AI Model for Every Catalogue
          </h2>

          {/* Body copy */}
          <p style={{
            fontSize: '14.5px',
            color: '#64748B',
            lineHeight: 1.8,
            margin: '0 0 32px',
          }}>
            Every single time find the best model for your brand, your audience
            and your product. With Vizzle you can access a wide variety of
            AI-generated models: men, women, kids, and families. Pick models by
            age, skin tone, style, and look. Build a consistent catalogue that
            speaks to your customers. No casting, no bookings, and no delays.
          </p>

          {/* CTA */}
          <motion.button
            onClick={() => openModal('Try Your Model Now', FIELD_PRESETS.all)}
            id="ai-lineup-cta"
            whileHover={{ y: -2, transition: { duration: 0.22 } }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0891B2 0%, #0D9488 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              padding: '13px 26px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(8,145,178,0.28)',
              letterSpacing: '-0.01em',
              transition: 'box-shadow 0.25s ease',
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(8,145,178,0.42)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(8,145,178,0.28)'; }}
          >
            Try Your Model Now
            <ArrowRight size={14} strokeWidth={2.5} />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
