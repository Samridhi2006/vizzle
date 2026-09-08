import { motion } from 'framer-motion';

export default function VizzlePage() {
  return (
    <section
      id="camera-roll"
      style={{
        background: '#FAFBFF',
        padding: '64px 24px 0',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="vz-camera-card"
          style={{
            background: '#E8F2FE',
            borderRadius: '28px',
            padding: '48px 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* ── LEFT: Text ─────────────────────────────────────────────────── */}
          <div>
            {/* Step pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(147,197,253,0.5)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#2563EB',
              letterSpacing: '0.02em',
              marginBottom: '16px',
            }}>
              01
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: '0 0 16px',
            }}>
              Try on outfits from<br />your camera roll
            </h2>

            {/* Accent bar */}
            <div style={{
              width: '32px',
              height: '3px',
              borderRadius: '999px',
              background: '#2563EB',
              marginBottom: '16px',
            }} />

            {/* Body */}
            <p style={{
              fontSize: '14.5px',
              color: '#475569',
              lineHeight: 1.75,
              margin: 0,
              maxWidth: '360px',
            }}>
              See an outfit you love on social media, a blog, or even a friend?
              Upload an image or screenshot from your camera roll and turn that
              inspiration into your next look.
            </p>
          </div>

          {/* ── RIGHT: Visual ──────────────────────────────────────────────── */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(186,230,253,0.6)',
            boxShadow: '0 8px 32px rgba(37,99,235,0.08)',
            aspectRatio: '16/10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <video
              src="/cloths.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
