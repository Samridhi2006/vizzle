import { motion } from 'framer-motion';
import { UploadCloud, Wand2, Download, Play } from 'lucide-react';

// ─── Step timeline data ───────────────────────────────────────────────────────
const STEPS = [
  {
    id: '01',
    icon: UploadCloud,
    title: 'Upload Your Looks',
    desc: 'Upload images of your outfit or choose from your gallery.',
  },
  {
    id: '02',
    icon: Wand2,
    title: 'Customize & Animate',
    desc: 'Add motion, choose style and set the perfect vibe.',
  },
  {
    id: '03',
    icon: Download,
    title: 'Download & Share',
    desc: 'Preview your video and export to share anywhere.',
  },
];

// ─── Play button overlay ──────────────────────────────────────────────────────
function PlayOverlay() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
      }}>
        <Play size={20} color="#1D4ED8" fill="#1D4ED8" style={{ marginLeft: '2px' }} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VizzlePage2() {
  return (
    <div
      id="motion-video"
      style={{
        background: '#FAFBFF',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >

      {/* ════════════════════════════════════════════════════════════
          TOP: "See your looks in motion" feature card
      ════════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 64px' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{
            background: '#EBF2FC',
            borderRadius: '28px',
            padding: '40px 48px',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left: Video player */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 4px 24px rgba(37,99,235,0.10)',
            border: '1px solid rgba(255,255,255,0.7)',
            aspectRatio: '16/10',
          }}>
            <video
              src="/GV.mp4"
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

          {/* Right: Text */}
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
              02
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
              See your looks<br />in motion
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
              fontSize: '15px',
              color: '#475569',
              lineHeight: 1.75,
              margin: 0,
            }}>
              Add video animation to bring your look to life.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          BOTTOM: "Create Stunning Videos in 3 Easy Steps"
      ════════════════════════════════════════════════════════════ */}
      <div style={{
        background: '#fff',
        padding: '72px 24px 80px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
              lineHeight: 1.2,
            }}>
              Create Stunning Videos in 3 Easy Steps
            </h2>
            <p style={{ fontSize: '15px', color: '#94A3B8', margin: 0 }}>
              Turn your outfits into engaging videos in just a few clicks.
            </p>
          </motion.div>

          {/* ── Timeline indicator ─────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
            marginBottom: '32px',
            position: 'relative',
          }}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0 16px 0 0',
                    position: 'relative',
                  }}
                >
                  {/* Icon + label row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={17} color="#2563EB" strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', lineHeight: 1 }}>
                        {step.id}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1.2, marginTop: '2px' }}>
                        {step.title}
                      </div>
                    </div>
                  </div>

                  {/* Connector line + dot (not after last) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '8px',
                    paddingRight: i < 2 ? '0' : '0',
                  }}>
                    {/* Active line segment */}
                    <div style={{
                      height: '2px',
                      flex: 1,
                      background: i === 0
                        ? 'linear-gradient(to right, #2563EB, #93C5FD)'
                        : i === 1
                        ? 'linear-gradient(to right, #93C5FD, #BFDBFE)'
                        : '#E2E8F0',
                      borderRadius: '999px',
                    }} />
                    {/* Dot node */}
                    {i < 2 && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: i === 0 ? '#2563EB' : '#93C5FD',
                        flexShrink: 0,
                        margin: '0 -4px',
                        boxShadow: i === 0 ? '0 0 6px rgba(37,99,235,0.5)' : 'none',
                      }} />
                    )}
                  </div>

                  {/* Step description */}
                  <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* ── 3-Column asset grid ────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>

            {/* Card 1 — Static upload image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                background: '#F1F5F9',
                position: 'relative',
                paddingTop: '75%',
              }}
            >
              <img
                src="/video_step1_upload.jpg"
                alt="Upload your looks — model back view with flatlay garments"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>

            {/* Card 2 — Preview image with play icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                background: '#F1F5F9',
                position: 'relative',
                paddingTop: '75%',
              }}
            >
              <img
                src="/video_step2_preview.jpg"
                alt="Customize and animate — model walking mid-stride"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <PlayOverlay />
            </motion.div>

            {/* Card 3 — Live video with play icon + timestamp */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                background: '#0F172A',
                position: 'relative',
                paddingTop: '75%', /* 4:3 ratio = 3/4 = 75% */
              }}
            >
              {/* Inner wrapper fills the padding-top box */}
              <div style={{
                position: 'absolute',
                inset: 0,
              }}>
                <video
                  src="/GV.mp4"
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
                <PlayOverlay />
                {/* Timestamp pill */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(15,23,42,0.75)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.04em',
                }}>
                  00:08
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

    </div>
  );
}
