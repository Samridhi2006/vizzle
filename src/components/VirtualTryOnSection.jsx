import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function VirtualTryOnSection() {
  return (
    <section
      id="virtual-try-on"
      style={{
        padding: '16px 24px 64px',
        background: '#FAFBFF',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#FAF9F6',
        borderRadius: '28px',
        overflow: 'hidden',
        padding: '56px 64px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'center',
        position: 'relative',
      }}>

        {/* Subtle ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── LEFT: Copy & CTA ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Pill tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ECFEFF',
            border: '1px solid rgba(165,243,252,0.8)',
            borderRadius: '999px',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#0E7490',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            <Sparkles size={11} strokeWidth={2.5} />
            Next-Gen Virtual Try-On
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}>
            Let Your Customers Try It On Before They Buy
          </h2>

          {/* Body copy */}
          <p style={{
            fontSize: '14.5px',
            color: '#64748B',
            lineHeight: 1.8,
            margin: '0 0 36px',
          }}>
            Shopping online shouldn't feel like a guessing game. AI Virtual
            Try-On lets your shoppers see exactly how any outfit looks on them,
            before they ever hit checkout. Fashion brands use it to create
            personal, engaging shopping experiences that build trust, reduce
            hesitation, and turn browsers into buyers across websites, mobile
            apps, and in-store kiosks.
          </p>

          {/* CTA */}
          <motion.a
            href="#"
            id="virtual-tryon-cta"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
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
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(8,145,178,0.28)',
              letterSpacing: '-0.01em',
              transition: 'box-shadow 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(8,145,178,0.42)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(8,145,178,0.28)'; }}
          >
            Book A Free Demo
            <ArrowRight size={15} strokeWidth={2.5} />
          </motion.a>
        </motion.div>

        {/* ── RIGHT: Smart Mirror Visual ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
          style={{
            position: 'relative',
            width: '100%',
            height: '480px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src="/virtual_tryon_smart_mirror.jpg"
            alt="Smart AR mirror virtual try-on — woman in cocktail dress sees bridal lehenga reflection"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              borderRadius: '16px',
            }}
          />

          {/* Floating glassmorphism chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '16px',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(226,232,240,0.7)',
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0F172A',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '14px' }}>✨</span>
            94% Return Reduction
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
