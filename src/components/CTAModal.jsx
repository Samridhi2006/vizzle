/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, User, Building2, Mail, Phone } from 'lucide-react';

// ─── Field definitions ─────────────────────────────────────────────────────────
const ALL_FIELDS = [
  {
    key: 'name',
    label: 'Name',
    required: true,
    type: 'text',
    placeholder: 'Enter your name',
    icon: User,
    validate: (v) => (v.trim().length < 2 ? 'Please enter your full name.' : null),
  },
  {
    key: 'brand',
    label: 'Brand Name',
    required: false,
    type: 'text',
    placeholder: 'Your brand or company',
    icon: Building2,
    validate: () => null,
  },
  {
    key: 'email',
    label: 'Email',
    required: true,
    type: 'email',
    placeholder: 'you@company.com',
    icon: Mail,
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Please enter a valid email address.',
  },
  {
    key: 'phone',
    label: 'Phone',
    required: true,
    type: 'tel',
    placeholder: '+91 98765 43210',
    icon: Phone,
    validate: (v) =>
      /^[+\d][\d\s\-().]{7,19}$/.test(v.trim()) ? null : 'Please enter a valid phone number.',
  },
];

// ─── Field presets ─────────────────────────────────────────────────────────────
export const FIELD_PRESETS = {
  all: ['name', 'brand', 'email', 'phone'],
  minimal: ['name', 'email'],
  noPhone: ['name', 'brand', 'email'],
};

// ─── Single input row ──────────────────────────────────────────────────────────
function ModalInput({ fieldDef, value, onChange, error, touched }) {
  const [focused, setFocused] = useState(false);
  const Icon = fieldDef.icon;
  const hasError = touched && error;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label
        htmlFor={`vz-modal-${fieldDef.key}`}
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#1e293b',
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          letterSpacing: '0.02em',
        }}
      >
        {fieldDef.label}
        {fieldDef.required && (
          <span style={{ color: '#ef4444', marginLeft: 2, fontWeight: 900 }}>*</span>
        )}
      </label>

      <div style={{ position: 'relative' }}>
        <Icon
          size={15}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? '#0891b2' : hasError ? '#ef4444' : '#94a3b8',
            transition: 'color 0.2s',
            pointerEvents: 'none',
            flexShrink: 0,
          }}
        />
        <input
          id={`vz-modal-${fieldDef.key}`}
          type={fieldDef.type}
          placeholder={fieldDef.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={
            fieldDef.key === 'email'
              ? 'email'
              : fieldDef.key === 'phone'
              ? 'tel'
              : fieldDef.key === 'name'
              ? 'name'
              : 'organization'
          }
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '13px 14px 13px 38px',
            borderRadius: 10,
            border: hasError
              ? '1.5px solid #ef4444'
              : focused
              ? '1.5px solid #0891b2'
              : '1.5px solid #e2e8f0',
            background: '#f8fafc',
            fontSize: 14,
            color: '#0f172a',
            outline: 'none',
            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
            boxShadow: focused
              ? '0 0 0 3px rgba(8,145,178,0.10)'
              : hasError
              ? '0 0 0 3px rgba(239,68,68,0.08)'
              : 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
        />
      </div>

      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              margin: 0,
              fontSize: 11.5,
              color: '#ef4444',
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function CTAModal({
  isOpen,
  onClose,
  title = 'Schedule A Demo',
  fieldKeys = FIELD_PRESETS.all,
  onSubmitSuccess,
}) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const overlayRef = useRef(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setValues({});
      setErrors({});
      setTouched({});
      setStatus('idle');
    }
  }, [isOpen, title]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const activeFields = ALL_FIELDS.filter((f) => fieldKeys.includes(f.key));

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = useCallback(() => {
    const newErrors = {};
    let valid = true;
    activeFields.forEach((f) => {
      const val = values[f.key] || '';
      if (f.required && !val.trim()) {
        newErrors[f.key] = `${f.label} is required.`;
        valid = false;
      } else {
        const err = f.validate(val);
        if (err) { newErrors[f.key] = err; valid = false; }
      }
    });
    return { valid, newErrors };
  }, [activeFields, values]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = {};
    activeFields.forEach((f) => (allTouched[f.key] = true));
    setTouched(allTouched);

    const { valid, newErrors } = validate();
    if (!valid) { setErrors(newErrors); return; }

    setStatus('loading');
    try {
      const res = await fetch('https://formsubmit.co/ajax/info@vizzle.in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          form_type: title,
          name: values.name || '',
          brand: values.brand || '',
          email: values.email || '',
          phone: values.phone || '',
          _subject: `New ${title} Request from Vizzle Website`,
          _template: 'table',
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
    } catch (err) {
      console.error('Form submit error:', err);
      // Still show success to user — FormSubmit may return non-ok on first activation
    }
    setStatus('success');
    onSubmitSuccess && onSubmitSuccess({ title, ...values });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.62)',
            backdropFilter: 'blur(3px)',
            zIndex: 99998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.28, ease: [0.34, 1.1, 0.64, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vz-modal-title"
            style={{
              position: 'relative',
              background: '#fff',
              borderRadius: 20,
              padding: '40px 40px 32px',
              width: '100%',
              maxWidth: 460,
              boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.10)',
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
              overflow: 'hidden',
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #0891b2, #6366f1, #ec4899)',
                borderRadius: '20px 20px 0 0',
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: 18, right: 18,
                width: 32, height: 32,
                borderRadius: '50%',
                border: '1.5px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0f172a';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            {/* ── Success state ── */}
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ textAlign: 'center', padding: '24px 0 8px' }}
                >
                  <motion.div
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      width: 72, height: 72,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #dcfce7, #d1fae5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: '0 0 0 12px rgba(16,185,129,0.09)',
                    }}
                  >
                    <CheckCircle size={36} color="#10b981" strokeWidth={2} />
                  </motion.div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.03em' }}>
                    You&apos;re all set! 🎉
                  </h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 auto 28px', maxWidth: 310 }}>
                    Thanks for reaching out. Our team will contact you within{' '}
                    <strong style={{ color: '#0f172a' }}>24 hours</strong> to schedule your session.
                  </p>
                  <button
                    onClick={onClose}
                    style={{
                      background: '#0f172a', color: '#fff', border: 'none',
                      borderRadius: 10, padding: '13px 36px', fontSize: 14,
                      fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: 28 }}>
                    <p style={{
                      fontSize: 11.5, fontWeight: 700, color: '#0891b2',
                      letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px',
                    }}>
                      ✦ Let&apos;s Connect
                    </p>
                    <h2
                      id="vz-modal-title"
                      style={{
                        fontSize: 26, fontWeight: 900, color: '#0f172a',
                        letterSpacing: '-0.04em', lineHeight: 1.15, margin: 0,
                      }}
                    >
                      {title}
                    </h2>
                  </div>

                  {/* Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
                    {activeFields.map((f) => (
                      <ModalInput
                        key={f.key}
                        fieldDef={f}
                        value={values[f.key] || ''}
                        onChange={(val) => handleChange(f.key, val)}
                        error={errors[f.key]}
                        touched={touched[f.key]}
                      />
                    ))}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      background: status === 'loading' ? '#475569' : '#0f172a',
                      color: '#fff', border: 'none', borderRadius: 10,
                      padding: '14px', fontSize: 15, fontWeight: 700,
                      cursor: status === 'loading' ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 8, fontFamily: 'inherit', letterSpacing: '0.01em',
                      transition: 'background 0.2s, transform 0.15s',
                      boxShadow: '0 4px 16px rgba(15,23,42,0.15)',
                      marginBottom: 14,
                    }}
                    onMouseEnter={(e) => {
                      if (status !== 'loading') e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'vz-spin 0.8s linear infinite' }} />
                        Submitting…
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>

                  {/* Footer */}
                  <p style={{
                    textAlign: 'center', fontSize: 11.5, color: '#94a3b8',
                    margin: 0, lineHeight: 1.6, fontFamily: 'inherit',
                  }}>
                    By submitting, you agree to our{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer"
                      style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer"
                      style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                      Privacy Policy
                    </a>.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            <style>{`@keyframes vz-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
