import { useState, useRef, useCallback } from 'react';
import { Check, X, Image as ImageIcon, AlertCircle, Upload } from 'lucide-react';

// IDs of Boys' multi-piece garments that need a two-upload flow
// (currently none in the Boys catalog, but list is here for future use)
const BOYS_MULTI_PIECE_IDS = [];

/**
 * BoysUploadStep
 * Step 3 for the Boys' audience.
 *
 * Single-piece garments  → single upload box (left) + good/bad guide (right)
 * Multi-piece garments   → two upload boxes stacked (left) + good/bad guide (right)
 *
 * Props:
 *   garmentLabel  – human-readable name from Step 2, e.g. "Hoodie", "Full sleeve shirt"
 *   garmentId     – id from BOYS_GARMENTS, used to detect multi-piece
 *   onUpload      – optional callback(file) after successful upload
 */
export default function BoysUploadStep({ garmentLabel = 'Garment', garmentId = '', onUpload }) {
  const isMultiPiece = BOYS_MULTI_PIECE_IDS.includes(garmentId);

  // Single-upload state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  const validateAndSet = useCallback((f) => {
    if (!f) return;
    if (!f.type.match(/^image\/(jpeg|png|webp)$/i)) {
      setError('Please upload a valid JPG or PNG image.');
      return;
    }
    if (f.size > MAX_SIZE) {
      setError('File size exceeds 10 MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile(f);
      setPreview(e.target.result);
      setError('');
      if (onUpload) onUpload(f);
    };
    reader.readAsDataURL(f);
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    validateAndSet(dropped);
  }, [validateAndSet]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">

      {/* ── Step Header ── */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-900">Upload Garment Image</h3>
        </div>
        <p className="text-xs text-slate-500 ml-8">Upload a clean flat lay garment image</p>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* ═══ LEFT: Upload Box ═══ */}
        <div className="lg:col-span-5 flex flex-col">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !preview && inputRef.current?.click()}
            className={`
              group flex-1 rounded-xl border-2 border-dashed transition-all duration-200
              flex flex-col items-center justify-center text-center p-8 relative min-h-[240px]
              ${preview
                ? 'border-blue-500/70 bg-white ring-2 ring-blue-500/10 cursor-default'
                : dragging
                  ? 'border-blue-400 bg-blue-50/60 cursor-copy'
                  : 'border-slate-200 bg-slate-50/40 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer'
              }
            `}
          >
            {preview ? (
              /* ── Uploaded state ── */
              <div className="relative flex flex-col items-center gap-3 w-full">
                <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-slate-50">
                  <img src={preview} alt="Uploaded garment" className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                    {file?.name || `${garmentLabel} uploaded`}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1 mt-1">
                    <Check size={11} strokeWidth={3} />
                    Ready for generation
                  </p>
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={removeFile}
                  title="Remove and re-upload"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 text-white hover:bg-red-600 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              /* ── Empty / drag-over state ── */
              <>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  dragging ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-blue-50'
                }`}>
                  <Upload size={22} className={`transition-colors ${dragging ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-400'}`} />
                </div>
                <p className="text-sm font-bold text-slate-800 mb-1">
                  Upload {garmentLabel}
                </p>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Drag and drop an image here · JPG, PNG · Max 10MB
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 px-4 py-2 rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  <ImageIcon size={13} className="text-slate-500" />
                  Browse
                </button>
                {error && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-3">
                    <AlertCircle size={12} /> {error}
                  </p>
                )}
              </>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => validateAndSet(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* ═══ RIGHT: Good / Bad Reference Guide ═══ */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4 items-stretch">

          {/* Good Input Card */}
          <div className="rounded-xl border border-emerald-200 bg-white overflow-hidden flex flex-col shadow-xs">
            {/* Header */}
            <div className="flex flex-col items-center py-3 px-3 border-b border-emerald-100">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-xs">
                <Check size={13} strokeWidth={3} />
              </div>
              <span className="text-xs font-extrabold text-emerald-700 tracking-wide">Good Input</span>
            </div>
            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-3 bg-white min-h-[160px]">
              <img
                src="/images/studio/boys_guide/good.jpg"
                alt="Good garment upload example — clean flat-lay"
                className="w-full h-full object-contain max-h-[180px]"
              />
            </div>
            {/* Caption */}
            <div className="bg-emerald-50 border-t border-emerald-100 py-2 px-3 text-center">
              <p className="text-[11px] text-emerald-700 font-semibold">Clean flat-lay, white background</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">No wrinkles · Clear edges · Even lighting</p>
            </div>
          </div>

          {/* Bad Input Card */}
          <div className="rounded-xl border border-red-200 bg-red-50/30 overflow-hidden flex flex-col shadow-xs">
            {/* Header */}
            <div className="flex flex-col items-center py-3 px-3 border-b border-red-100 bg-red-50/50">
              <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center mb-1.5 shadow-xs">
                <X size={13} strokeWidth={3} />
              </div>
              <span className="text-xs font-extrabold text-red-600 tracking-wide">Bad Input</span>
            </div>
            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-3 bg-white/70 min-h-[160px]">
              <img
                src="/images/studio/boys_guide/bad.jpg"
                alt="Bad garment upload example — wrinkled, cluttered"
                className="w-full h-full object-contain max-h-[180px]"
              />
            </div>
            {/* Caption */}
            <div className="bg-red-50 border-t border-red-100 py-2 px-3 text-center">
              <p className="text-[11px] text-red-600 font-semibold">Wrinkled / poor lighting</p>
              <p className="text-[10px] text-red-500 mt-0.5">Cluttered background · Folded garment · Dark corners</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
