import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

// ─── Input Field ──────────────────────────────────────────────────────────────
function FormField({ label, id, type = 'text', placeholder, value, onChange, required }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={id}
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#374151',
          letterSpacing: '0.03em',
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        }}
      >
        {label}
        {required && <span style={{ color: '#0891B2', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '11px 14px',
          borderRadius: '10px',
          border: focused ? '1.5px solid #0891B2' : '1.5px solid #E2E8F0',
          background: '#FAFBFC',
          fontSize: '13px',
          color: '#0F172A',
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 3px rgba(8,145,178,0.1)' : 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
        }}
      />
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function LeadCaptureSection() {
  const [form, setForm] = useState({ name: '', brand: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    await new Promise(res => setTimeout(res, 1500));
    setStatus('success');
  };

  return (
    <section
      id="contact"
      style={{
        padding: '0 24px 80px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* ── Outer card with BG image ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          maxWidth: '1380px',
          margin: '0 auto',
          minHeight: '640px',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 24px 72px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/contact/fashion_studio_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Gradient overlay — dark on left, fades to transparent right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        {/* ── Two-column grid ───────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            padding: '56px 48px',
            boxSizing: 'border-box',
          }}
        >
          {/* ── LEFT: Headline ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ maxWidth: '520px' }}
          >
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '-0.04em',
                lineHeight: 1.12,
                margin: '0 0 18px',
                textShadow: '0 2px 12px rgba(0,0,0,0.3)',
              }}
            >
              Experience the Future of{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22D3EE 0%, #5EEAD4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Fashion Visualization
              </span>
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(226,232,240,0.9)',
                lineHeight: 1.75,
                margin: 0,
                fontWeight: 400,
                textShadow: '0 1px 6px rgba(0,0,0,0.2)',
              }}
            >
              Create premium fashion catalogues and immersive virtual try-on
              experiences that help your business grow faster.
            </p>

            {/* Trust pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '28px' }}>
              {['No credit card required', 'Free trial', 'Setup in 5 mins'].map(tag => (
                <div
                  key={tag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  <CheckCircle size={11} color="#22D3EE" strokeWidth={3} />
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Floating form card ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px',
                padding: '36px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.6)',
                width: '100%',
                maxWidth: '420px',
                boxSizing: 'border-box',
              }}
            >
              {status === 'success' ? (
                // ── Success State ────────────────────────────
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '20px 0' }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0891B2, #06B6D4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: '0 8px 24px rgba(8,145,178,0.3)',
                    }}
                  >
                    <CheckCircle size={30} color="#fff" strokeWidth={2.5} />
                  </div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: '0 0 10px',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    We've got your details!
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                    Our team will reach out within 24 hours to set up your free demo.
                  </p>
                </motion.div>
              ) : (
                // ── Form State ───────────────────────────────
                <>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#0F172A',
                      letterSpacing: '-0.03em',
                      margin: '0 0 4px',
                    }}
                  >
                    Get In Touch
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 20px' }}>
                    Start your free trial today. No credit card needed.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <FormField
                        label="Name"
                        id="lead-name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange('name')}
                        required
                      />
                      <FormField
                        label="Brand Name"
                        id="lead-brand"
                        placeholder="Enter your brand name"
                        value={form.brand}
                        onChange={handleChange('brand')}
                      />
                      <FormField
                        label="Email"
                        id="lead-email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange('email')}
                        required
                      />
                      <FormField
                        label="Phone"
                        id="lead-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        required
                      />
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      style={{
                        width: '100%',
                        padding: '13px',
                        marginTop: '20px',
                        borderRadius: '12px',
                        border: 'none',
                        background: status === 'loading'
                          ? '#475569'
                          : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 700,
                        fontFamily: 'inherit',
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 14px rgba(15,23,42,0.25)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        letterSpacing: '-0.01em',
                      }}
                      onMouseEnter={e => {
                        if (status !== 'loading') e.currentTarget.style.background = 'linear-gradient(135deg, #1E293B 0%, #334155 100%)';
                      }}
                      onMouseLeave={e => {
                        if (status !== 'loading') e.currentTarget.style.background = 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)';
                      }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                          Submitting...
                        </>
                      ) : 'Submit'}
                    </button>

                    {/* Legal */}
                    <p
                      style={{
                        textAlign: 'center',
                        fontSize: '11px',
                        color: '#94A3B8',
                        marginTop: '14px',
                        lineHeight: 1.6,
                      }}
                    >
                      By submitting, you agree to our{' '}
                      <a href="/terms" style={{ color: '#64748B', textDecoration: 'underline' }}>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" style={{ color: '#64748B', textDecoration: 'underline' }}>
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
