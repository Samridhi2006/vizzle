import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Shirt, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { useModal, FIELD_PRESETS } from '../context/ModalContext';

// ─── Feature pillars ──────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <TrendingUp size={16} strokeWidth={2} />, label: 'Increase\nVisibility',           bg: '#EDE9FE', color: '#7C3AED' },
  { icon: <ShoppingBag size={16} strokeWidth={2} />, label: 'Drive More\nSales',             bg: '#FCE7F3', color: '#DB2777' },
  { icon: <Shirt size={16} strokeWidth={2} />,       label: 'Beautiful Product\nExperience', bg: '#ECFEFF', color: '#0891B2' },
  { icon: <Users size={16} strokeWidth={2} />,       label: 'Trusted by Fashion\nLeaders',  bg: '#F5F3FF', color: '#6D28D9' },
];

// ─── Brand pills on right column ──────────────────────────────────────────────
const BRANDS = ['ZARA', 'MANGO', 'H&M', 'VERO MODA', '& MORE'];

// ─── Float animation ──────────────────────────────────────────────────────────
const floatAnim = { y: [0, -8, 0] };
const floatTrans = { duration: 3.5, repeat: Infinity, ease: 'easeInOut' };

export default function TurnBrowsersSection() {
  const { openModal } = useModal();
  return (
    <section
      id="brand-partners"
      style={{
        background: 'linear-gradient(135deg, rgba(245,243,255,0.6) 0%, #fff 40%, rgba(250,245,255,0.45) 100%)',
        padding: '72px 0',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        overflow: 'hidden',
      }}
    >
      <div
        className="vz-partners-grid"
        style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: '4fr 4fr 4fr',
          gap: '24px',
          alignItems: 'center',
        }}
      >

        {/* ══ LEFT — Lavender Duo Models ═══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Radial violet glow */}
          <div style={{
            position: 'absolute',
            width: '380px', height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,181,253,0.45) 0%, rgba(233,213,255,0.15) 70%, transparent 100%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
            filter: 'blur(32px)',
          }} />

          <img
            src="/partners/models_lavender_duo.jpg"
            alt="Lavender fashion duo"
            style={{ position: 'relative', zIndex: 1, width: '100%', maxHeight: '520px', objectFit: 'cover', borderRadius: '20px' }}
          />

          {/* Top-right glass card */}
          <motion.div
            animate={floatAnim} transition={{ ...floatTrans, delay: 0 }}
            style={{
              position: 'absolute', top: '8%', right: '-10px', zIndex: 10,
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.95)',
              borderRadius: '14px', padding: '10px 13px',
              boxShadow: '0 8px 24px rgba(109,40,217,0.12)',
              fontSize: '11px', fontWeight: 700, color: '#1E293B',
              maxWidth: '150px', lineHeight: 1.45,
              display: 'flex', alignItems: 'flex-start', gap: '8px',
            }}
          >
            <Users size={14} color="#7C3AED" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>Join a growing network of top fashion brands.</span>
          </motion.div>

          {/* Middle-right rack inset card */}
          <motion.div
            animate={floatAnim} transition={{ ...floatTrans, delay: 0.8 }}
            style={{
              position: 'absolute', top: '40%', right: '-10px', zIndex: 10,
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.95)',
              borderRadius: '14px', overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(109,40,217,0.1)',
              width: '130px',
            }}
          >
            <img src="/partners/rack_pastels.jpg" alt="Wardrobe rack" style={{ width: '100%', height: '70px', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '7px 10px', fontSize: '10.5px', fontWeight: 700, color: '#1E293B' }}>
              Showcase Your Collections
            </div>
          </motion.div>

          {/* Bottom-left shopping card */}
          <motion.div
            animate={floatAnim} transition={{ ...floatTrans, delay: 1.6 }}
            style={{
              position: 'absolute', bottom: '6%', left: '-10px', zIndex: 10,
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.95)',
              borderRadius: '14px', padding: '10px 13px',
              boxShadow: '0 8px 24px rgba(109,40,217,0.12)',
              fontSize: '11px', fontWeight: 700, color: '#1E293B',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <ShoppingBag size={14} color="#7C3AED" />
            <div>Reach Millions<br />of Shoppers</div>
          </motion.div>
        </motion.div>

        {/* ══ CENTER — Conversion copy ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
        >
          {/* Script wordmark */}
          <div style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '26px',
            color: 'rgba(67,56,202,0.75)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: '4px',
          }}>
            Vizzle
          </div>
          {/* Hanger divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', opacity: 0.4 }}>
            <div style={{ width: '36px', height: '1px', background: '#6D28D9' }} />
            <Shirt size={14} color="#6D28D9" />
            <div style={{ width: '36px', height: '1px', background: '#6D28D9' }} />
          </div>

          {/* Main headline */}
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            margin: '0 0 16px',
          }}>
            Turn browsers<br />
            into{' '}
            <span style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              buyers
            </span>
            <br />
            <span style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '0.65em',
              color: '#475569',
            }}>
              with Vizzle
            </span>
          </h2>

          {/* Description */}
          <p style={{
            fontSize: '13px', color: '#64748B', lineHeight: 1.75,
            maxWidth: '340px', margin: '0 auto 20px',
          }}>
            Vizzle partners with leading fashion brands and retailers, integrating
            seamlessly into your online store so shoppers see your collections come to life,
            discover looks they'll love, and shop with confidence.
          </p>

          {/* Announcement pill */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(239,246,255,0.9)',
            color: '#1E293B',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '11.5px',
            marginBottom: '18px',
          }}>
            ✨ We're now inviting brands to join our launch.{' '}
            <strong>Register today!</strong>
          </div>

          {/* CTA button */}
          <motion.button
            onClick={() => openModal('Request Brand Access', FIELD_PRESETS.all)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(109,40,217,0.3)',
              marginBottom: '28px',
            }}
          >
            Request Brand Access
            <ArrowRight size={15} strokeWidth={2.5} />
          </motion.button>

          {/* Feature icon row */}
          <div
            className="vz-partners-features"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              width: '100%',
              paddingTop: '22px',
              borderTop: '1px solid rgba(226,232,240,0.7)',
            }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: '34px', height: '34px',
                  borderRadius: '50%',
                  background: f.bg,
                  color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 7px',
                }}>
                  {f.icon}
                </div>
                <div style={{
                  fontSize: '10px', fontWeight: 700, color: '#334155',
                  lineHeight: 1.35, whiteSpace: 'pre-line',
                }}>
                  {f.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══ RIGHT — Cream Trench Model + Brand Pills ══════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Brand pill strip — left edge */}
          <div style={{
            position: 'absolute', left: '-4px', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10,
          }}>
            {BRANDS.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '999px',
                  padding: '7px 16px',
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#0F172A',
                  letterSpacing: '0.06em',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.09)',
                  border: '1px solid rgba(255,255,255,0.9)',
                }}
              >
                {brand}
              </motion.div>
            ))}
          </div>

          {/* Main model */}
          <img
            src="/partners/model_cream_trench.jpg"
            alt="Cream trench coat model"
            style={{ width: '100%', maxHeight: '520px', objectFit: 'cover', borderRadius: '20px' }}
          />

          {/* Bottom-right inset: rack + handbag + badge */}
          <motion.div
            animate={floatAnim} transition={{ ...floatTrans, delay: 1 }}
            style={{
              position: 'absolute', bottom: '5%', right: '-10px', zIndex: 10,
              background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.95)',
              borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 10px 28px rgba(109,40,217,0.12)',
              width: '150px',
            }}
          >
            <div style={{ display: 'flex', height: '72px' }}>
              <img src="/partners/rack_pastels.jpg" alt="rack" style={{ width: '55%', objectFit: 'cover' }} />
              <img src="/partners/handbag_purple.jpg" alt="handbag" style={{ width: '45%', objectFit: 'cover' }} />
            </div>
            <div style={{
              padding: '8px 10px',
              display: 'flex', alignItems: 'flex-start', gap: '6px',
            }}>
              <CheckCircle size={11} color="#7C3AED" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>
                Seamless Integration<br />Effortless Growth
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
