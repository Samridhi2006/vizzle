import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Upload, Loader2, CheckCircle2, X, ChevronDown } from 'lucide-react';
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

/* ─── Women's Garment Type Dataset — 30 items ───────────────────────── */
const WOMEN_GARMENTS = [
  // ── Dresses ──────────────────────────────────────────────────────────
  { id: 'Mini Frock',         label: 'Mini Frock',          img: '/garments/women-picker/mini-frock.jpg',          category: 'Dresses',        api: 'dress'         },
  { id: 'Knee Length Frock',  label: 'Knee Length Frock',   img: '/garments/women-picker/knee-length-frock.jpg',   category: 'Dresses',        api: 'dress'         },
  { id: 'Long Frock',         label: 'Long Frock',          img: '/garments/women-picker/long-frock.jpg',          category: 'Dresses',        api: 'dress'         },
  { id: 'Cocktail',           label: 'Cocktail',            img: '/garments/women-picker/cocktail.jpg',            category: 'Dresses',        api: 'dress'         },
  { id: 'Jumpsuit',           label: 'Jumpsuit',            img: '/garments/women-picker/jumpsuit.jpg',            category: 'Dresses',        api: 'jumpsuit'      },
  // ── Ethnic ────────────────────────────────────────────────────────────
  { id: 'Saree',              label: 'Saree',               img: '/garments/women-picker/saree.jpg',               category: 'Ethnic',         api: 'saree'         },
  { id: 'Kurti',              label: 'Kurti',               img: '/garments/women-picker/kurti.jpg',               category: 'Ethnic',         api: 'kurti'         },
  { id: 'Anarkali',           label: 'Anarkali',            img: '/garments/women-picker/anarkali.jpg',            category: 'Ethnic',         api: 'anarkali'      },
  { id: 'Kurti & Pyjama',     label: 'Kurti & Pyjama',      img: '/garments/women-picker/kurti-pyjama.jpg',        category: 'Ethnic',         api: 'kurti'         },
  { id: 'Co-Ord Set',         label: 'Co-Ord Set',          img: '/garments/women-picker/co-ord-set.jpg',          category: 'Ethnic',         api: 'dress'         },
  { id: 'Chudidar',           label: 'Chudidar',            img: '/garments/women-picker/chudidar.jpg',            category: 'Ethnic',         api: 'salwar_kameez' },
  // ── Tops & Shirts ─────────────────────────────────────────────────────
  { id: 'Full Sleeve Shirt',  label: 'Full Sleeve Shirt',   img: '/garments/women-picker/full-sleeve-shirt.jpg',   category: 'Tops',           api: 'shirt'         },
  { id: 'Half Sleeve Shirt',  label: 'Half Sleeve Shirt',   img: '/garments/women-picker/half-sleeve-shirt.jpg',   category: 'Tops',           api: 'shirt'         },
  { id: 'Full Sleeve T-shirt',label: 'Full Sleeve T-shirt', img: '/garments/women-picker/full-sleeve-tshirt.jpg',  category: 'Tops',           api: 't-shirt'       },
  { id: 'Half Sleeve T-shirt',label: 'Half Sleeve T-shirt', img: '/garments/women-picker/half-sleeve-tshirt.jpg',  category: 'Tops',           api: 't-shirt'       },
  { id: 'Top',                label: 'Top',                 img: '/garments/women-picker/top.jpg',                 category: 'Tops',           api: 't-shirt'       },
  { id: 'Crop Top',           label: 'Crop Top',            img: '/garments/women-picker/crop-top.jpg',            category: 'Tops',           api: 't-shirt'       },
  { id: 'Hoodie',             label: 'Hoodie',              img: '/garments/women-picker/hoodie.jpg',              category: 'Tops',           api: 'coat'          },
  { id: 'Sweatshirt',         label: 'Sweatshirt',          img: '/garments/women-picker/sweatshirt.jpg',          category: 'Tops',           api: 'coat'          },
  // ── Outerwear ─────────────────────────────────────────────────────────
  { id: 'One Piece Suit',     label: 'One Piece Suit',      img: '/garments/women-picker/one-piece-suit.jpg',      category: 'Outerwear',      api: 'coat'          },
  { id: 'Two Piece Suit',     label: 'Two Piece Suit',      img: '/garments/women-picker/two-piece-suit.jpg',      category: 'Outerwear',      api: 'coat'          },
  { id: 'Blazer',             label: 'Blazer',              img: '/garments/women-picker/blazer.jpg',              category: 'Outerwear',      api: 'coat'          },
  { id: 'Jacket',             label: 'Jacket',              img: '/garments/women-picker/jacket.jpg',              category: 'Outerwear',      api: 'jacket'        },
  // ── Bottoms ───────────────────────────────────────────────────────────
  { id: 'Jean',               label: 'Jean',                img: '/garments/women-picker/jean.jpg',                category: 'Bottoms',        api: 'jeans'         },
  { id: 'Baggy Jean',         label: 'Baggy Jean',          img: '/garments/women-picker/baggy-jean.jpg',          category: 'Bottoms',        api: 'jeans'         },
  { id: 'Trouser',            label: 'Trouser',             img: '/garments/women-picker/trouser.jpg',             category: 'Bottoms',        api: 'trousers'      },
  { id: 'Track',              label: 'Track',               img: '/garments/women-picker/track.jpg',               category: 'Bottoms',        api: 'trousers'      },
  { id: 'Long Skirt',         label: 'Long Skirt',          img: '/garments/women-picker/long-skirt.jpg',          category: 'Bottoms',        api: 'skirt'         },
  { id: 'Mini Skirt',         label: 'Mini Skirt',          img: '/garments/women-picker/mini-skirt.jpg',          category: 'Bottoms',        api: 'skirt'         },
  { id: 'Short',              label: 'Short',               img: '/garments/women-picker/short.jpg',               category: 'Bottoms',        api: 'trousers'      },
  { id: 'Inner Wear',         label: 'Inner Wear',          img: '/garments/women-picker/inner-wear.jpg',          category: 'Bottoms',        api: 't-shirt'       },
  // ── Mannequin Drapes ──────────────────────────────────────────────────
  { id: 'Saree on Mannequin', label: 'Saree on Mannequin',  img: '/garments/women-picker/saree-mannequin.jpg',     category: 'Mannequin',      api: 'saree'         },
  { id: 'Mini Frock on Mannequin',        label: 'Mini Frock on Mannequin',        img: '/garments/women-picker/mini-frock-mannequin.jpg',   category: 'Mannequin', api: 'dress'    },
  { id: 'Knee Frock on Mannequin',        label: 'Knee Length Frock on Mannequin', img: '/garments/women-picker/knee-frock-mannequin.jpg',   category: 'Mannequin', api: 'dress'    },
  { id: 'Long Frock on Mannequin',        label: 'Long Frock on Mannequin',        img: '/garments/women-picker/long-frock-mannequin.jpg',   category: 'Mannequin', api: 'dress'    },
  { id: 'Kurti on Mannequin',             label: 'Kurti on Mannequin',             img: '/garments/women-picker/kurti-mannequin.jpg',        category: 'Mannequin', api: 'kurti'    },
  { id: 'Kurti & Pyjama on Mannequin',    label: 'Kurti & Pyjama on Mannequin',    img: '/garments/women-picker/kurti-pyjama-mannequin.jpg', category: 'Mannequin', api: 'kurti'    },
  { id: 'Lehenga on Mannequin',           label: 'Lehenga on Mannequin',           img: '/garments/women-picker/lehenga-mannequin.jpg',      category: 'Mannequin', api: 'lehenga'  },
  { id: 'Half Saree on Mannequin',        label: 'Half Saree on Mannequin',        img: '/garments/women-picker/half-saree-mannequin.jpg',   category: 'Mannequin', api: 'saree'    },
  // Assumed labels (from screenshot row 3 of ss2 — partially cut off):
  { id: 'Cocktail on Mannequin',          label: 'Cocktail on Mannequin',          img: '/garments/women-picker/cocktail-mannequin.jpg',     category: 'Mannequin', api: 'dress'    },
];


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

async function generateTryOn({ personUrl, garmentUrl, garmentType, apiValue }) {
  const startRes = await fetch(`${API_BASE}/api/v1/tryon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': WIDGET_API_KEY },
    body: JSON.stringify({
      product_id: garmentUrl,
      user_photo_url: personUrl,
      garment_type: apiValue ?? GARMENT_TYPE_TO_API_VALUE[garmentType] ?? 'auto_detect',
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

/* ─── Garment Type Picker Modal ────────────────────────────────────── */
const GARMENT_CATEGORIES_FILTER = ['All', 'Ethnic', 'Dresses', 'Tops', 'Outerwear', 'Bottoms', 'Mannequin'];

function GarmentTypeModal({ selected, onSelect, onClose }) {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? WOMEN_GARMENTS
    : WOMEN_GARMENTS.filter(g => g.category === filter);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: '20px',
        width: '100%', maxWidth: '860px',
        maxHeight: '88vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
            Select Your Garment Type
          </span>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: '#F1F5F9', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#64748B',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Category filter pills */}
        <div style={{
          display: 'flex', gap: 8, padding: '12px 24px',
          borderBottom: '1px solid #F1F5F9', overflowX: 'auto', flexShrink: 0,
        }}>
          {GARMENT_CATEGORIES_FILTER.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '5px 14px', borderRadius: '999px', fontSize: '12px',
                fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
                background: filter === cat ? BLUE : '#F1F5F9',
                color: filter === cat ? '#fff' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div style={{
          overflowY: 'auto', padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px',
        }}>
          {filtered.map(garment => {
            const isSelected = garment.id === selected;
            return (
              <button
                key={garment.id}
                onClick={() => { onSelect(garment.id); onClose(); }}
                style={{
                  background: isSelected ? '#EFF6FF' : '#F8FAFC',
                  border: isSelected ? `2px solid ${BLUE}` : '1.5px solid #E2E8F0',
                  borderRadius: '12px', cursor: 'pointer', padding: '10px 8px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  boxShadow: isSelected ? `0 4px 16px rgba(37,99,235,0.18)` : 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.background = '#F0F9FF'; }}}
                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 18, height: 18, borderRadius: '50%',
                    background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={12} color="#fff" strokeWidth={2.5} />
                  </div>
                )}
                <div style={{
                  width: '100%', aspectRatio: '3/4', overflow: 'hidden',
                  borderRadius: 8, background: '#F1F5F9',
                }}>
                  <img
                    src={garment.img}
                    alt={garment.id}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <span style={{
                  fontSize: '10.5px', fontWeight: 700, color: isSelected ? BLUE : '#334155',
                  textAlign: 'center', lineHeight: 1.3,
                }}>
                  {garment.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Try-On Demo Widget ────────────────────────────────────────────── */
function TryOnDemo() {
  const [personUrl,    setPersonUrl]    = useState(null);
  const [garmentUrl,   setGarmentUrl]   = useState(null);
  const [garmentType,  setGarmentType]  = useState(WOMEN_GARMENTS[0].id);
  const [showPicker,   setShowPicker]   = useState(false);
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
      const outputUrl = await generateTryOn({
        personUrl,
        garmentUrl,
        garmentType,
        apiValue: WOMEN_GARMENTS.find(g => g.id === garmentType)?.api ?? 'auto_detect',
      });
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

      {/* Garment type visual picker trigger */}
      <div>
        <label style={{
          fontSize: '11.5px', fontWeight: 700, color: '#334155',
          display: 'block', marginBottom: '7px',
        }}>
          Garment Type
        </label>
        <button
          onClick={() => setShowPicker(true)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '12px',
            border: `1.5px solid #E2E8F0`, fontSize: '13px',
            fontWeight: 600, color: '#0F172A', background: '#F8FAFF',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 8,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#93C5FD'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 36, borderRadius: 6, overflow: 'hidden',
              background: '#F1F5F9', flexShrink: 0,
            }}>
              <img
                src={GARMENT_TYPES_VISUAL.find(g => g.id === garmentType)?.img || ''}
                alt={garmentType}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <span>{garmentType}</span>
          </div>
          <ChevronDown size={14} color="#94A3B8" />
        </button>
      </div>

      {/* Garment Type Modal */}
      {showPicker && (
        <GarmentTypeModal
          selected={garmentType}
          onSelect={setGarmentType}
          onClose={() => setShowPicker(false)}
        />
      )}

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
