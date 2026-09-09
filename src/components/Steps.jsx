import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Store, User, Settings2, KeyRound,
  ShoppingCart, FileText, Glasses, Shirt,
  ArrowRight,
} from 'lucide-react';

// ─── Step Data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    icons: [Store, User],
    title: 'Setup Account & Store',
    description:
      'Sign up and set up your Store to get started with the platform and its services.',
    docLink: '/docs',
  },
  {
    id: 2,
    icons: [Settings2, KeyRound],
    title: 'Setup Plugin & API Key',
    description:
      'Use our plugin for wordpress and shopify or follow docs to set up the custom store with API key.',
    docLink: '/docs',
  },
  {
    id: 3,
    icons: [ShoppingCart, FileText],
    title: 'Add or import products',
    description:
      'Manually add your best products or import them in bulk directly from the site.',
    docLink: '/docs',
  },
  {
    id: 4,
    icons: [Glasses, Shirt],
    title: 'Start Virtual Try On',
    description:
      'Create an API key to securely connect your store with external services.',
    docLink: '/docs',
  },
];

// ─── Curved Arrow Connector ───────────────────────────────────────────────────
function CurvedArrow() {
  return (
    <div style={{
      position: 'absolute',
      top: '92px',
      width: '56px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      <svg
        viewBox="0 0 56 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '56px', height: '32px' }}
      >
        {/* Curved path */}
        <path
          d="M4 28 Q28 4 52 16"
          stroke="#67E8F9"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="4 3"
        />
        {/* Arrowhead */}
        <path
          d="M46 12 L52 16 L47 21"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ step, index }) {
  const [Icon1, Icon2] = step.icons;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '28px',
        border: '1px solid rgba(226,232,240,0.8)',
        boxShadow: '0 4px 24px rgba(8,145,178,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px',
        cursor: 'default',
        transition: 'box-shadow 0.3s ease',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(8,145,178,0.12), 0 2px 8px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(8,145,178,0.06), 0 1px 4px rgba(0,0,0,0.04)';
      }}
    >
      {/* Top row: step number + icons */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          {/* Step number */}
          <span style={{
            fontSize: '64px',
            fontWeight: 900,
            color: '#0F172A',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          }}>
            {step.id}
          </span>

          {/* Icon pair */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            paddingTop: '6px',
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
              border: '1px solid #a5f3fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon1 size={20} strokeWidth={1.5} color="#0891B2" />
            </div>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon2 size={20} strokeWidth={1.5} color="#0369A1" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 800,
          color: '#0C2D3C',
          marginBottom: '10px',
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
        }}>
          {step.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '13.5px',
          color: '#64748B',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {step.description}
        </p>
      </div>

      {/* Bottom: Doc button */}
      <Link
        to={step.docLink}
        id={`how-it-works-step-${step.id}-docs`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '24px',
          width: '100%',
          padding: '11px 16px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          background: '#fff',
          color: '#334155',
          fontSize: '13px',
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'all 0.22s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          letterSpacing: '-0.01em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#06B6D4';
          e.currentTarget.style.color = '#0891B2';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(8,145,178,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.color = '#334155';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        }}
      >
        View Documentation
      </Link>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Steps() {
  return (
    <section
      id="how-it-works"
      style={{
        background: 'linear-gradient(180deg, #f0feff 0%, #e8f9fc 30%, #f8fcff 65%, #ffffff 100%)',
        padding: '88px 0 96px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Ambient radial glow */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse at top, rgba(6,182,212,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 900,
              color: '#0C2D3C',
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              margin: '0 0 16px',
            }}
          >
            How It Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: '16px',
              color: '#64748B',
              lineHeight: 1.7,
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            Get started with Vizzle in four simple steps that take minutes to implement
          </motion.p>
        </div>

        {/* ── 4-Card Grid with Connectors ───────────────────────────────────── */}
        <div style={{ position: 'relative' }}>
          {/* Connector arrows (desktop only) */}
          <div
            className="vz-steps-arrows"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              pointerEvents: 'none',
            }}
          >
            {/* We position connectors between each card pair */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `calc(${(i + 1) * 25}% - 28px)`,
                  top: 0,
                }}
              >
                <CurvedArrow />
              </div>
            ))}
          </div>

          <div
            className="vz-steps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}
          >
            {STEPS.map((step, i) => (
              <StepCard key={step.id} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* ── Bottom glow dot row ───────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '40px',
        }}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              style={{
                width: i === 0 ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background: i === 0 ? '#06B6D4' : '#CBD5E1',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
