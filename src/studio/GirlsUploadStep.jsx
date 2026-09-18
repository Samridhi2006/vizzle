import { useState, useRef, useCallback } from 'react';
import { Check, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

/**
 * GirlsUploadStep
 * Step 3 for the Girls' audience (single-item garments: crop tops, shirts, t-shirts, hoodies, jackets, kurtis, frocks, etc.)
 *
 * Props:
 *   garmentLabel  – human-readable name from Step 2, e.g. "Crop top", "Full sleeve Shirt", "Kurti", etc.
 *   garmentId     – id from GIRLS_GARMENTS
 *   onUpload      – optional callback(file) after successful upload
 */
export default function GirlsUploadStep({ garmentLabel = 'Garment', garmentId = '', onUpload }) {
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
      setError('File size exceeds 10MB limit.');
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

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
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-full bg-[#D82E78] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
            3
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Upload Garment Image</h3>
        </div>
        <p className="text-xs text-slate-500 ml-8">Upload a clean flat lay garment image</p>
      </div>

      {/* ── Two-Column Panel inside a Light Gray Rounded Container ── */}
      <div className="bg-[#F8F9FA] rounded-2xl p-4 sm:p-5 border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">

          {/* ═══ LEFT COLUMN: Upload Box ═══ */}
          <div className="flex flex-col h-full">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !preview && inputRef.current?.click()}
              className={`
                flex-1 rounded-xl border transition-all duration-200
                flex flex-col items-center justify-center text-center p-6 sm:p-8 relative min-h-[250px]
                ${preview
                  ? 'border-pink-400 bg-white ring-2 ring-pink-500/10 cursor-default'
                  : dragging
                    ? 'border-pink-400 bg-pink-50/40 cursor-copy'
                    : 'border-slate-200/80 bg-white hover:border-pink-300 hover:bg-pink-50/20 cursor-pointer'
                }
              `}
            >
              {preview ? (
                /* Uploaded Preview State */
                <div className="relative flex flex-col items-center gap-3 w-full py-2">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-xs">
                    <img
                      src={preview}
                      alt="Uploaded garment preview"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[220px]">
                      {file?.name || `${garmentLabel} uploaded`}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1 mt-1">
                      <Check size={12} strokeWidth={3} />
                      Ready for generation
                    </p>
                  </div>
                  {/* Remove / re-upload button */}
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
                /* Empty Upload State */
                <>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                    Upload {garmentLabel}
                  </p>
                  <p className="text-xs text-slate-400 font-normal">
                    Drag and drop an image here · JPG, PNG · Max 10MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-pink-600 transition-colors mt-3.5 cursor-pointer"
                  >
                    <ImageIcon size={14} className="text-slate-600" />
                    <span>Browse</span>
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

          {/* ═══ RIGHT COLUMN: Good / Bad Input Guide ═══ */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">

            {/* Card 1: Good Input */}
            <div className="bg-white rounded-xl border border-slate-200/70 p-4 sm:p-5 flex flex-col items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#00C466] tracking-wide text-center">
                Good Input
              </span>

              <div className="flex-1 flex items-center justify-center py-2 sm:py-3 w-full">
                <img
                  src="/images/studio/girls_guide/good.jpg"
                  alt="Good Input - Clean unwrinkled girls garment flat lay"
                  className="max-h-[145px] sm:max-h-[160px] w-auto object-contain"
                />
              </div>

              <div className="w-6 h-6 rounded-full bg-[#00C466] text-white flex items-center justify-center shadow-xs mt-1">
                <Check size={14} strokeWidth={3} />
              </div>
            </div>

            {/* Card 2: Bad Input */}
            <div className="bg-[#FFF4F4] rounded-xl border border-red-100/70 p-4 sm:p-5 flex flex-col items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#FF3B30] tracking-wide text-center">
                Bad Input
              </span>

              <div className="flex-1 flex items-center justify-center py-2 sm:py-3 w-full">
                <img
                  src="/images/studio/girls_guide/bad.jpg"
                  alt="Bad Input - Wrinkled girls garment"
                  className="max-h-[145px] sm:max-h-[160px] w-auto object-contain"
                />
              </div>

              <div className="w-6 h-6 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shadow-xs mt-1">
                <X size={14} strokeWidth={3} />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
