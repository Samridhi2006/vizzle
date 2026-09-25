import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Upload, Loader2, CheckCircle2, ImagePlus } from 'lucide-react';
import { useModal, FIELD_PRESETS } from '../context/ModalContext';

/* ─── Brand tokens ──────────────────────────────────────────────────── */
const BLUE       = '#2563EB';
const BLUE_DARK  = '#1D4ED8';
const BLUE_LIGHT = '#EFF6FF';
const BLUE_MID   = '#BFDBFE';
const BLUE_BORDER= 'rgba(37,99,235,0.28)';

/* ─── API config ────────────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dashboard.vizzle.in';
const WIDGET_API_KEY = import.meta.env.VITE_WIDGET_API_KEY;

const GARMENT_TYPES = [
  'Saree', 'Kurti', 'Lehenga', 'Anarkali', 'Salwar Kameez',
  'Western Dress', 'Shirt', 'T-shirt', 'Coat', 'Jacket',
  'Jumpsuit', 'Jeans', 'Trousers', 'Skirt',
];

const GARMENT_TYPE_TO_API_VALUE = {
  'Saree': 'saree', 'Kurti': 'kurti', 'Lehenga': 'lehenga',
  'Anarkali': 'anarkali', 'Salwar Kameez': 'salwar_kameez',
  'Western Dress': 'dress', 'Shirt': 'shirt', 'T-shirt': 't-shirt',
  'Coat': 'coat', 'Jacket': 'jacket', 'Jumpsuit': 'jumpsuit',
  'Jeans': 'jeans', 'Trousers': 'trousers', 'Skirt': 'skirt',
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function uploadPhoto(file) {
  const form = new FormData();
  form.append('photo', file);
  const res = await fetch(`${API_BASE}/api/v1/upload`, {
    method: 'POST',
    headers: { 'x-api-key': WIDGET_API_KEY },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Upload failed');
  return data.url;
}

async function generateTryOn({ personUrl, garmentUrl, garmentType }) {
  const startRes = await fetch(`${API_BASE}/api/v1/tryon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': WIDGET_API_KEY },
    body: JSON.stringify({
      product_id: garmentUrl,
      user_photo_url: personUrl,
      garment_type: GARMENT_TYPE_TO_API_VALUE[garmentType] ?? 'auto_detect',
      use_vision: true,
    }),
  });
  const startData = await startRes.json();
  if (!startRes.ok) throw new Error(startData?.error || 'Try-on generation failed');

  const predictionId = startData.prediction_id;
  const deadline = Date.now() + 180_000;

  while (Date.now() < deadline) {
    const statusRes = await fetch(`${API_BASE}/api/v1/tryon/status/${predictionId}`, {
      headers: { 'x-api-key': WIDGET_API_KEY },
    });
    const statusData = await statusRes.json();
    if (!statusRes.ok) throw new Error(statusData?.error || 'Try-on generation failed');
    if (statusData.status === 'succeeded' && statusData.output_url) return statusData.output_url;
    if (statusData.status === 'failed' || statusData.status === 'canceled') {
      throw new Error(statusData.error || 'Try-on generation failed');
    }
    await sleep(2500);
  }
  throw new Error('Try-on is taking longer than expected. Please try again.');
}

/* ─── Slot Uploader ─────────────────────────────────────────────────── */
function SlotUploader({ label, step, previewUrl, busy, onPick }) {
  const inputRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: '11.5px', fontWeight: 700, color: '#334155',
        marginBottom: '8px', letterSpacing: '0.01em',
      }}>
        <span style={{
          width: 18, height: 18, borderRadius: '50%',
          background: BLUE, color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 800, flexShrink: 0,
        }}>{step}</span>
        {label}
        {previewUrl && <CheckCircle2 size={12} color="#16A34A" style={{ marginLeft: 'auto' }} />}
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: '164px',
          borderRadius: '16px',
          border: previewUrl
            ? `1.5px solid ${BLUE_MID}`
            : hovered
              ? `2px dashed ${BLUE}`
              : `2px dashed ${BLUE_BORDER}`,
          background: previewUrl ? '#0F172A' : hovered ? BLUE_LIGHT : '#F8FAFF',
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: BLUE }}>
            {busy
              ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
              : <ImagePlus size={22} />
            }
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: busy ? '#64748B' : BLUE }}>
              {busy ? 'Uploading…' : 'Click to upload'}
            </span>
            {!busy && (
              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>JPG, PNG, WEBP</span>
            )}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

/* ─── Try-On Demo Widget ────────────────────────────────────────────── */
function TryOnDemo() {
  const [personUrl,    setPersonUrl]    = useState(null);
  const [garmentUrl,   setGarmentUrl]   = useState(null);
  const [garmentType,  setGarmentType]  = useState(GARMENT_TYPES[0]);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [generating,   setGenerating]   = useState(false);
  const [slowHint,     setSlowHint]     = useState(false);
  const [resultUrl,    setResultUrl]    = useState(null);
  const [error,        setError]        = useState(null);

  async function handlePick(slot, file) {
    setError(null);
    setUploadingSlot(slot);
    try {
      const url = await uploadPhoto(file);
      if (slot === 'person') setPersonUrl(url);
      else setGarmentUrl(url);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try a different photo.');
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleGenerate() {
    if (!personUrl || !garmentUrl) return;
    setError(null);
    setGenerating(true);
    setSlowHint(false);
    setResultUrl(null);
    const hintTimer = setTimeout(() => setSlowHint(true), 12_000);
    try {
      const outputUrl = await generateTryOn({ personUrl, garmentUrl, garmentType });
      setResultUrl(outputUrl);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      clearTimeout(hintTimer);
      setGenerating(false);
      setSlowHint(false);
    }
  }

  const canGenerate = personUrl && garmentUrl && !uploadingSlot && !generating;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '28px',
      padding: '28px',
      border: '1px solid rgba(226,232,240,0.8)',
      boxShadow: '0 20px 60px rgba(37,99,235,0.10), 0 4px 20px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>

      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Upload size={15} color={BLUE} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Upload Photos</div>
          <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 500 }}>2 photos · instant AI result</div>
        </div>
      </div>

      {/* Two slots side by side */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <SlotUploader
          label="Your Photo"
          step="1"
          previewUrl={personUrl}
          busy={uploadingSlot === 'person'}
          onPick={(file) => handlePick('person', file)}
        />
        <SlotUploader
          label="Garment Photo"
          step="2"
          previewUrl={garmentUrl}
          busy={uploadingSlot === 'garment'}
          onPick={(file) => handlePick('garment', file)}
        />
      </div>

      {/* Garment type selector */}
      <div>
        <label style={{
          fontSize: '11.5px', fontWeight: 700, color: '#334155',
          display: 'block', marginBottom: '7px',
        }}>
          Garment Type
        </label>
        <select
          value={garmentType}
          onChange={(e) => setGarmentType(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '12px',
            border: `1.5px solid #E2E8F0`, fontSize: '13px',
            fontWeight: 600, color: '#0F172A', background: '#F8FAFF',
            outline: 'none', cursor: 'pointer', appearance: 'auto',
          }}
        >
          {GARMENT_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        style={{
          width: '100%',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: canGenerate
            ? `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`
            : '#CBD5E1',
          color: '#fff',
          fontWeight: 800,
          fontSize: '14px',
          padding: '15px 24px',
          borderRadius: '16px',
          border: 'none',
          cursor: canGenerate ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          boxShadow: canGenerate ? `0 6px 24px rgba(37,99,235,0.35)` : 'none',
          letterSpacing: '-0.01em',
        }}
        onMouseEnter={e => { if (canGenerate) { e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.48)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = canGenerate ? '0 6px 24px rgba(37,99,235,0.35)' : 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {generating
          ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
          : <>Generate My Try-On <ArrowRight size={15} strokeWidth={2.5} /></>
        }
      </button>

      {/* Hints & errors */}
      {generating && slowHint && (
        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textAlign: 'center' }}>
          ⏳ Warming up the AI model — this can take up to a minute.
        </div>
      )}
      {error && (
        <div style={{
          fontSize: '12px', color: '#DC2626', fontWeight: 600,
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 10, padding: '10px 14px',
        }}>
          {error}
        </div>
      )}

      {/* Result */}
      {resultUrl && (
        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <img src={resultUrl} alt="Try-on result" style={{ width: '100%', display: 'block' }} />
        </div>
      )}

      {/* Trust strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        {['Secure Upload', 'Real AI Model', 'Instant Result'].map((label) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>
            <CheckCircle2 size={10} color={BLUE} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Section ──────────────────────────────────────────────────── */
const SECTION_CSS = `
  @keyframes vz-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .vz-tryon-btn-primary:hover { background: linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%) !important; box-shadow: 0 10px 40px rgba(37,99,235,0.5) !important; transform: translateY(-2px); }
  @media (max-width: 1024px) {
    .vz-tryon-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
    .vz-tryon-card-inner { padding: 40px 28px !important; }
    .vz-tryon-heading { font-size: 2rem !important; }
    .vz-tryon-img-card { margin: 0 auto; max-width: 480px; }
  }
  @media (max-width: 640px) {
    .vz-tryon-card-inner { padding: 32px 20px !important; }
  }
`;

export default function VirtualTryOnSection() {
  const { openModal } = useModal();

  return (
    <section
      id="virtual-try-on"
      style={{
        padding: '24px 24px 80px',
        background: 'linear-gradient(180deg, #F8FAFF 0%, #FAFBFF 100%)',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <style>{SECTION_CSS}</style>

      <div
        className="vz-tryon-card-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '32px',
          padding: '64px 72px',
          boxShadow: '0 2px 40px rgba(37,99,235,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          border: '1px solid rgba(226,232,240,0.7)',
          position: 'relative',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 440, height: 440, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 320, height: 320, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)',
        }} />

        <div
          className="vz-tryon-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '5fr 7fr',
            gap: '48px',
            alignItems: 'center',
            position: 'relative',
          }}
        >

          {/* ── LEFT: Copy & CTA ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            {/* Pill badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: BLUE_LIGHT,
              border: `1px solid ${BLUE_MID}`,
              borderRadius: '999px',
              padding: '5px 14px',
              fontSize: '11px', fontWeight: 700, color: BLUE,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              <Sparkles size={11} strokeWidth={2.5} />
              Next-Gen Virtual Try-On
            </div>

            {/* Headline */}
            <h2
              className="vz-tryon-heading"
              style={{
                fontSize: 'clamp(1.85rem, 2.8vw, 2.75rem)',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.035em',
                lineHeight: 1.18,
                margin: '0 0 20px',
                maxWidth: '420px',
              }}
            >
              Let Your Customers{' '}
              <span style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #4F46E5 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Try It On
              </span>{' '}Before They Buy
            </h2>

            {/* Body copy */}
            <p style={{
              fontSize: '15px',
              color: '#64748B',
              lineHeight: 1.8,
              margin: '0 0 40px',
              maxWidth: '480px',
            }}>
              Shopping online shouldn't feel like a guessing game. AI Virtual
              Try-On lets your shoppers see exactly how any outfit looks on them,
              before they ever hit checkout. Fashion brands use it to create
              personal, engaging shopping experiences that build trust, reduce
              hesitation, and turn browsers into buyers across websites, mobile
              apps, and in-store kiosks.
            </p>


            {/* CTA button */}
            <motion.button
              onClick={() => openModal('Book a Free Demo', FIELD_PRESETS.all)}
              id="virtual-tryon-cta"
              className="vz-tryon-btn-primary"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                background: `linear-gradient(135deg, ${BLUE} 0%, #4F46E5 100%)`,
                color: '#fff',
                fontWeight: 800, fontSize: '15px',
                padding: '16px 32px', borderRadius: '18px',
                border: 'none', cursor: 'pointer',
                boxShadow: `0 6px 28px rgba(37,99,235,0.38)`,
                letterSpacing: '-0.01em',
                transition: 'box-shadow 0.25s ease',
                fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 40px rgba(37,99,235,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,99,235,0.38)'; }}
            >
              Book A Free Demo
              <ArrowRight size={15} strokeWidth={2.5} />
            </motion.button>
          </motion.div>

          {/* ── RIGHT: Smart Mirror Editorial Image ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="vz-tryon-img-card"
            style={{
              position: 'relative',
              width: '100%',
              background: '#fff',
              borderRadius: '28px',
              border: '1px solid rgba(226,232,240,0.8)',
              boxShadow: '0 8px 40px rgba(37,99,235,0.08), 0 2px 12px rgba(0,0,0,0.06)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/virtual_tryon_smart_mirror.jpg"
              alt="AI Virtual Try-On smart mirror — woman seeing herself in a green lehenga"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                borderRadius: '12px',
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
