import { motion } from 'framer-motion';
import { Upload, UserCheck, DownloadCloud, ChevronRight } from 'lucide-react';

// ─── Step Data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    icon: Upload,
    label: 'Step 1',
    title: 'Upload Your Garment',
    image: '/step1_flatlay_emerald_suit.jpg',
    alt: 'Emerald green satin blazer & trousers flatlay on white background',
    objectPosition: 'center',
  },
  {
    id: 2,
    icon: UserCheck,
    label: 'Step 2',
    title: 'AI Dresses the Model',
    image: '/step2_base_model_emerald.jpg',
    alt: 'South Asian female model in white tee and dark jeans — base look',
    objectPosition: 'top',
  },
  {
    id: 3,
    icon: DownloadCloud,
    label: 'Step 3',
    title: 'Download and Go Live',
    image: '/step3_final_draped_emerald.jpg',
    alt: 'Model wearing AI-draped emerald green satin blazer and wide-leg trousers',
    objectPosition: 'top',
  },
];

// ─── Arrow connector between cards ───────────────────────────────────────────
function ArrowBadge() {
  return (
    <div style={{
      position: 'absolute',
      top: '42%',
      right: '-18px',
      transform: 'translateY(-50%)',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: '#fff',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      flexShrink: 0,
    }}>
      <ChevronRight size={15} color="#2563EB" strokeWidth={2.5} />
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ step, index, isLast }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      style={{ position: 'relative', flex: 1 }}
    >
      {/* Step header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
      }}>
        {/* Icon badge */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: '#1D4ED8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={16} color="#fff" strokeWidth={2} />
        </div>

        {/* Step label + title */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#94A3B8',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '2px',
          }}>
            {step.label}
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}>
            {step.title}
          </div>
        </div>
      </div>

      {/* Image card — padding-top trick for reliable 4:5 aspect ratio */}
      <div style={{
        position: 'relative',
        paddingTop: '125%', /* 4:5 = 5/4 = 125% */
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}>
        <img
          src={step.image}
          alt={step.alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: step.objectPosition,
            display: 'block',
            mixBlendMode: 'multiply',
            /* Soft bottom fade mask */
            WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
          }}
        />

        {/* Arrow connector (not on last card) */}
        {!isLast && <ArrowBadge />}
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CatalogueSteps() {
  return (
    <section
      id="catalogue-steps"
      style={{
        background: '#FAFBFF',
        padding: '64px 24px 80px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: '0 0 10px',
            }}
          >
            3 Easy Steps to Stunning Catalogue Photos.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{
              fontSize: '15px',
              color: '#94A3B8',
              margin: 0,
            }}
          >
            No shoots. No studios. Just upload and you're done.
          </motion.p>
        </div>

        {/* ── 3-Step Grid ───────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
        }}>
          {STEPS.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
