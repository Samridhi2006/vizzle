import { motion } from 'framer-motion';
import { Scan, Shirt, Sparkles, Zap } from 'lucide-react';

// ─── Feature pillars ──────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <Scan  size={20} strokeWidth={1.75} />, label: 'Augmented\nReality'       },
  { icon: <Shirt size={20} strokeWidth={1.75} />, label: 'Virtual\nTry-On'          },
  { icon: <Sparkles size={20} strokeWidth={1.75} />, label: 'Personalized\nStyle'   },
  { icon: <Zap   size={20} strokeWidth={1.75} />, label: 'Real-time\nExperience'    },
];

// ─── Floating glass micro-card ────────────────────────────────────────────────
function FloatCard({ text, style }) {
  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.85)',
        borderRadius: '12px',
        padding: '8px 14px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#0F172A',
        boxShadow: '0 6px 24px rgba(8,145,178,0.12)',
        whiteSpace: 'nowrap',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        zIndex: 10,
        ...style,
      }}
    >
      {text}
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function AboutVizzleSection() {
  return (
    <section
      id="about-vizzle"
      style={{
        background: 'linear-gradient(135deg, rgba(236,254,255,0.4) 0%, #fff 50%, rgba(240,249,255,0.3) 100%)',
        padding: '0',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '60px 32px',
          display: 'grid',
          gridTemplateColumns: '5fr 5fr 2fr',
          gap: '40px',
          alignItems: 'center',
        }}
      >

        {/* ══ LEFT — 3D Holographic Showcase ═══════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative' }}
        >
          {/* Main 3D image */}
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 24px 56px rgba(8,145,178,0.12)',
            position: 'relative',
          }}>
            <img
              src="/about/vizzle_3d_virtual_studio.jpg"
              alt="Vizzle 3D Virtual Fashion Studio"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Subtle cyan tint overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(8,145,178,0.06) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Floating glass micro-cards */}
          <FloatCard
            text="🥽 Try On Virtual Fit"
            style={{ top: '14%', left: '-12px' }}
          />
          <FloatCard
            text="✨ Style Match 98%"
            style={{ top: '44%', left: '-12px', animationDelay: '1.2s' }}
          />
        </motion.div>

        {/* ══ CENTER — Narrative & Feature Grid ════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* ABOUT US badge */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(236,254,255,0.8)',
            color: '#0891B2',
            border: '1px solid rgba(8,145,178,0.2)',
            borderRadius: '999px',
            padding: '4px 16px',
            fontSize: '10.5px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            ABOUT US
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            About{' '}
            <span style={{
              color: '#0891B2',
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              fontSize: '1.2em',
            }}>
              Vizzle
            </span>
          </h2>

          {/* Cyan accent bar */}
          <div style={{
            width: '56px',
            height: '4px',
            background: 'linear-gradient(90deg, #0891B2, #06B6D4)',
            borderRadius: '999px',
            marginBottom: '18px',
          }} />

          {/* Body */}
          <p style={{
            fontSize: '14px',
            color: '#475569',
            lineHeight: 1.8,
            margin: '0 0 0',
            textAlign: 'justify',
          }}>
            Vizzle is a cutting edge fashion technology startup that revolutionizes the
            way you experience style. By harnessing the power of augmented reality, Vizzle
            transforms your clothing choices into immersive, interactive visual experiences.
            Whether you're exploring new outfits or curating your personal wardrobe, Vizzle
            brings a futuristic twist to fashion by letting you see, try on, and mix and
            match styles in real time. With a keen focus on blending aesthetics and innovation.
          </p>

          {/* Feature icon grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid #F1F5F9',
          }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(236,254,255,0.8)',
                  color: '#0891B2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  border: '1px solid rgba(8,145,178,0.12)',
                }}>
                  {f.icon}
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#334155',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-line',
                }}>
                  {f.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══ RIGHT — Triangle Model Portal ════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {/* Clipped triangle portal with model */}
          <div style={{
            width: '160px',
            height: '200px',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            overflow: 'hidden',
            borderRadius: '4px',
            boxShadow: '0 12px 32px rgba(8,145,178,0.18)',
            flexShrink: 0,
          }}>
            <img
              src="/about/model_triangle_profile.jpg"
              alt="Vizzle model profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                transform: 'scale(1.4) translateY(20%)',
              }}
            />
          </div>

          {/* Brand accent pill */}
          <div style={{
            background: '#0F172A',
            color: '#fff',
            borderRadius: '999px',
            padding: '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 24px rgba(15,23,42,0.3)',
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.2em',
              lineHeight: 1,
            }}>
              VIZZLE
            </span>
            <span style={{
              fontSize: '8px',
              color: '#94A3B8',
              letterSpacing: '0.12em',
              marginTop: '3px',
              textTransform: 'uppercase',
            }}>
              SEE IT. STYLE IT. OWN IT.
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
