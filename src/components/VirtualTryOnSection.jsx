import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Upload, Loader2, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dashboard.vizzle.in';

const GARMENT_TYPES = [
  'Saree', 'Kurti', 'Lehenga', 'Anarkali', 'Salwar Kameez',
  'Shirt', 'T-shirt', 'Coat', 'Jacket', 'Dress', 'Jumpsuit',
  'Jeans', 'Trousers', 'Skirt',
];

async function uploadDemoPhoto(file) {
  const form = new FormData();
  form.append('photo', file);
  const res = await fetch(`${API_BASE}/api/v1/demo/upload`, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Upload failed');
  return data.url;
}

function SlotUploader({ label, previewUrl, busy, onPick }) {
  const inputRef = useRef(null);
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
        {label}
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          height: '180px',
          borderRadius: '14px',
          border: previewUrl ? '1px solid rgba(226,232,240,0.9)' : '2px dashed rgba(8,145,178,0.35)',
          background: previewUrl ? '#0F172A' : '#F3FBFC',
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#0891B2' }}>
            {busy ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{busy ? 'Uploading…' : 'Click to upload'}</span>
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

function TryOnDemo() {
  const [personUrl, setPersonUrl] = useState(null);
  const [garmentUrl, setGarmentUrl] = useState(null);
  const [garmentType, setGarmentType] = useState(GARMENT_TYPES[0]);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  async function handlePick(slot, file) {
    setError(null);
    setUploadingSlot(slot);
    try {
      const url = await uploadDemoPhoto(file);
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
    setResultUrl(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/demo/composite-tryon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ human_img: personUrl, garm_img: garmentUrl, garment_type: garmentType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Try-on generation failed');
      setResultUrl(data.output_url);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  const canGenerate = personUrl && garmentUrl && !generating && !uploadingSlot;

  return (
    <div
      style={{
        background: '#FAF9F6',
        border: '1px solid rgba(226,232,240,0.8)',
        borderRadius: '20px',
        padding: '24px',
      }}
    >
      {resultUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            borderRadius: '14px', overflow: 'hidden', height: '340px',
            background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={resultUrl} alt="Your virtual try-on result" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <button
            onClick={() => { setResultUrl(null); }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: '#fff', border: '1px solid rgba(8,145,178,0.35)', color: '#0891B2',
              fontWeight: 700, fontSize: '13.5px', padding: '11px 20px', borderRadius: '999px', cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} /> Try another combination
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
            <SlotUploader
              label="1. Your Photo"
              previewUrl={personUrl}
              busy={uploadingSlot === 'person'}
              onPick={(file) => handlePick('person', file)}
            />
            <SlotUploader
              label="2. Garment Photo"
              previewUrl={garmentUrl}
              busy={uploadingSlot === 'garment'}
              onPick={(file) => handlePick('garment', file)}
            />
          </div>

          <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Garment Type
          </label>
          <select
            value={garmentType}
            onChange={(e) => setGarmentType(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid rgba(226,232,240,0.9)', fontSize: '13.5px',
              fontWeight: 600, color: '#0F172A', marginBottom: '16px', background: '#fff',
            }}
          >
            {GARMENT_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{
              width: '100%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: canGenerate ? 'linear-gradient(135deg, #0891B2 0%, #0D9488 100%)' : '#CBD5E1',
              color: '#fff', fontWeight: 700, fontSize: '14.5px', padding: '14px', borderRadius: '999px',
              border: 'none', cursor: canGenerate ? 'pointer' : 'not-allowed',
            }}
          >
            {generating ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : <>Generate My Try-On <ArrowRight size={15} /></>}
          </button>

          {error && (
            <div style={{ marginTop: '12px', fontSize: '12.5px', color: '#DC2626', fontWeight: 600 }}>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function VirtualTryOnSection() {
  return (
    <section
      id="virtual-try-on"
      style={{
        padding: '16px 24px 64px',
        background: '#FAFBFF',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div
        className="vz-tryon-card"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#FAF9F6',
          borderRadius: '28px',
          overflow: 'hidden',
          padding: '56px 64px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center',
          position: 'relative',
        }}
      >

        {/* Subtle ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── LEFT: Copy & CTA ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Pill tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ECFEFF',
            border: '1px solid rgba(165,243,252,0.8)',
            borderRadius: '999px',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#0E7490',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            <Sparkles size={11} strokeWidth={2.5} />
            Next-Gen Virtual Try-On
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}>
            Let Your Customers Try It On Before They Buy
          </h2>

          {/* Body copy */}
          <p style={{
            fontSize: '14.5px',
            color: '#64748B',
            lineHeight: 1.8,
            margin: '0 0 36px',
          }}>
            Shopping online shouldn't feel like a guessing game. AI Virtual
            Try-On lets your shoppers see exactly how any outfit looks on them,
            before they ever hit checkout. Fashion brands use it to create
            personal, engaging shopping experiences that build trust, reduce
            hesitation, and turn browsers into buyers across websites, mobile
            apps, and in-store kiosks.
          </p>

          {/* CTA */}
          <motion.a
            href="#"
            id="virtual-tryon-cta"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0891B2 0%, #0D9488 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14.5px',
              padding: '14px 28px',
              borderRadius: '999px',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(8,145,178,0.28)',
              letterSpacing: '-0.01em',
              transition: 'box-shadow 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(8,145,178,0.42)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(8,145,178,0.28)'; }}
          >
            Book A Free Demo
            <ArrowRight size={15} strokeWidth={2.5} />
          </motion.a>
        </motion.div>

        {/* ── RIGHT: Live Try-On Demo ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="vz-tryon-mirror"
          style={{
            position: 'relative',
            width: '100%',
            height: '480px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <TryOnDemo />
        </motion.div>

      </div>
    </section>
  );
}
