import { motion } from 'framer-motion';
import { FaShopify, FaWordpress } from 'react-icons/fa';
import { Zap, ShieldCheck, Puzzle, Headphones, ArrowRight } from 'lucide-react';

// ─── Platform Card Data ───────────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: 'shopify',
    name: 'Shopify',
    description:
      "Seamlessly integrate Vizzle with your Shopify store in just a few clicks. Offer your customers a magical try-on experience directly on your product pages.",
    docHref: '/docs?tab=shopify',
    accentColor: '#16A34A',
    iconBg: '#F0FDF4',
    iconBorder: '#BBF7D0',
    barColor: '#22C55E',
    linkColor: '#16A34A',
    icon: <FaShopify style={{ width: 32, height: 32, color: '#16A34A' }} />,
  },
  {
    id: 'wordpress',
    name: 'WordPress / WooCommerce',
    description:
      "Add our lightweight plugin to your WooCommerce site. Enhance your catalog with AR capabilities without writing a single line of code.",
    docHref: '/docs?tab=wordpress',
    accentColor: '#2563EB',
    iconBg: '#EFF6FF',
    iconBorder: '#BFDBFE',
    barColor: '#3B82F6',
    linkColor: '#2563EB',
    icon: <FaWordpress style={{ width: 32, height: 32, color: '#2563EB' }} />,
  },
  {
    id: 'custom',
    name: 'Custom APIs',
    description:
      "Building something unique? Our robust APIs and SDKs allow you to integrate Vizzle's try-on technology directly into your bespoke platform or app.",
    docHref: '/docs?tab=api',
    accentColor: '#7C3AED',
    iconBg: '#F5F3FF',
    iconBorder: '#DDD6FE',
    barColor: '#8B5CF6',
    linkColor: '#7C3AED',
    icon: (
      <span style={{
        fontFamily: 'monospace',
        fontSize: '18px',
        fontWeight: 800,
        color: '#7C3AED',
        letterSpacing: '-0.03em',
      }}>&lt;/&gt;</span>
    ),
  },
];

// ─── Trust Bar Items ──────────────────────────────────────────────────────────
const TRUST = [
  { icon: Zap,         label: 'Quick Setup',        color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { icon: ShieldCheck, label: 'Secure & Reliable',   color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  { icon: Puzzle,      label: 'Developer Friendly',  color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { icon: Headphones,  label: '24/7 Support',        color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
];

// ─── Platform Card ────────────────────────────────────────────────────────────
function PlatformCard({ p, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid #F1F5F9',
        boxShadow: '0 4px 24px rgba(15,23,42,0.05), 0 1px 4px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '320px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(15,23,42,0.10), 0 4px 12px rgba(0,0,0,0.04)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(15,23,42,0.05), 0 1px 4px rgba(0,0,0,0.03)';
      }}
    >
      <div>
        {/* Icon badge */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: p.iconBg,
          border: `1px solid ${p.iconBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          {p.icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.02em',
          margin: '0 0 10px',
          lineHeight: 1.25,
        }}>
          {p.name}
        </h3>

        {/* Accent bar */}
        <div style={{
          width: '32px',
          height: '3px',
          borderRadius: '999px',
          background: p.barColor,
          marginBottom: '16px',
        }} />

        {/* Description */}
        <p style={{
          fontSize: '14px',
          color: '#64748B',
          lineHeight: 1.75,
          margin: 0,
        }}>
          {p.description}
        </p>
      </div>

      {/* Doc link */}
      <a
        href={p.docHref}
        id={`integration-${p.id}-docs`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '24px',
          fontSize: '13.5px',
          fontWeight: 700,
          color: p.linkColor,
          textDecoration: 'none',
          transition: 'gap 0.22s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.gap = '10px'; }}
        onMouseLeave={e => { e.currentTarget.style.gap = '6px'; }}
      >
        View Documentation
        <ArrowRight size={14} />
      </a>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Platforms() {
  return (
    <section
      id="integrations"
      style={{
        background: 'linear-gradient(180deg, #f8fcff 0%, #f0f9ff 30%, #fafcff 65%, #ffffff 100%)',
        padding: '88px 0 80px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '350px',
        background: 'radial-gradient(ellipse at top, rgba(56,189,248,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 16px',
              borderRadius: '999px',
              background: 'rgba(239,246,255,0.85)',
              border: '1px solid #BFDBFE',
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#2563EB',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Integrations
          </motion.div>

          {/* H2 */}
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              margin: '0 0 16px',
            }}
          >
            Works Everywhere You Do
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.14 }}
            style={{
              fontSize: '15.5px',
              color: '#64748B',
              lineHeight: 1.75,
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            No matter what platform powers your store, we've got you covered. Easy setup, seamless experience.
          </motion.p>
        </div>

        {/* ── 3-Card Grid ────────────────────────────────────────────────────── */}
        <div
          className="vz-platforms-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {PLATFORMS.map((p, i) => (
            <PlatformCard key={p.id} p={p} index={i} />
          ))}
        </div>

        {/* ── Trust Bar ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="vz-trust-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0',
            marginTop: '56px',
            paddingTop: '32px',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          {TRUST.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="vz-trust-item" style={{ display: 'flex', alignItems: 'center' }}>
                {/* Item */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0 32px',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: t.bg,
                    border: `1px solid ${t.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={17} color={t.color} strokeWidth={2} />
                  </div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#334155',
                    whiteSpace: 'nowrap',
                  }}>
                    {t.label}
                  </span>
                </div>

                {/* Divider (not after last) */}
                {i < TRUST.length - 1 && (
                  <div className="vz-trust-divider" style={{
                    width: '1px',
                    height: '28px',
                    background: '#E2E8F0',
                    flexShrink: 0,
                  }} />
                )}
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
