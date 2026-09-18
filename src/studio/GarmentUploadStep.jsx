import { useState, useRef } from 'react';
import { Check, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function GarmentUploadStep({ garmentLabel = 'Saree', onBodyUpload, onPalluUpload }) {
  const [bodyFile, setBodyFile] = useState(null);
  const [bodyPreview, setBodyPreview] = useState(null);
  const [bodyError, setBodyError] = useState('');

  const [palluFile, setPalluFile] = useState(null);
  const [palluPreview, setPalluPreview] = useState(null);
  const [palluError, setPalluError] = useState('');

  const bodyInputRef = useRef(null);
  const palluInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (file, type) => {
    if (!file) return;

    // Validate type
    if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
      if (type === 'body') setBodyError('Please upload a valid JPG or PNG image.');
      else setPalluError('Please upload a valid JPG or PNG image.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      if (type === 'body') setBodyError('File size exceeds 10MB limit.');
      else setPalluError('File size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'body') {
        setBodyFile(file);
        setBodyPreview(e.target.result);
        setBodyError('');
        if (onBodyUpload) onBodyUpload(file);
      } else {
        setPalluFile(file);
        setPalluPreview(e.target.result);
        setPalluError('');
        if (onPalluUpload) onPalluUpload(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type, e) => {
    e.stopPropagation();
    if (type === 'body') {
      setBodyFile(null);
      setBodyPreview(null);
      setBodyError('');
      if (bodyInputRef.current) bodyInputRef.current.value = '';
    } else {
      setPalluFile(null);
      setPalluPreview(null);
      setPalluError('');
      if (palluInputRef.current) palluInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
      {/* ── Numbered Step Header ── */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-900">Upload Garment Images</h3>
        </div>
        <p className="text-xs text-slate-500 ml-8">Upload a clean flat lay garment image</p>
      </div>

      {/* ── Two-Column Light Panel Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ── LEFT COLUMN: Upload Boxes (Stacked Vertically) ── */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {/* Card 1: Body */}
          <div
            onClick={() => !bodyPreview && bodyInputRef.current?.click()}
            className={`group rounded-xl border transition-all duration-200 p-6 flex flex-col items-center justify-center text-center flex-1 bg-white relative ${
              bodyPreview
                ? 'border-pink-500/80 ring-2 ring-pink-500/10'
                : 'border-slate-200 hover:border-slate-300 cursor-pointer'
            }`}
          >
            {bodyPreview ? (
              <div className="relative w-full flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center mb-2">
                  <img src={bodyPreview} alt="Body Preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                  {bodyFile?.name || 'Body Image Uploaded'}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <Check size={12} strokeWidth={3} /> Ready for generation
                </p>
                <button
                  type="button"
                  onClick={(e) => removeFile('body', e)}
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-800 text-white hover:bg-red-600 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-slate-900">Body</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">JPG, PNG · Max 10MB</p>

                <button
                  type="button"
                  onClick={() => bodyInputRef.current?.click()}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-pink-600 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 rounded-lg"
                >
                  <ImageIcon size={13} className="text-slate-600" />
                  <span>Browse</span>
                </button>

                {bodyError && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-2">
                    <AlertCircle size={12} /> {bodyError}
                  </p>
                )}
              </>
            )}

            <input
              ref={bodyInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0], 'body')}
            />
          </div>

          {/* Card 2: Pallu */}
          <div
            onClick={() => !palluPreview && palluInputRef.current?.click()}
            className={`group rounded-xl border transition-all duration-200 p-6 flex flex-col items-center justify-center text-center flex-1 bg-white relative ${
              palluPreview
                ? 'border-pink-500/80 ring-2 ring-pink-500/10'
                : 'border-slate-200 hover:border-slate-300 cursor-pointer'
            }`}
          >
            {palluPreview ? (
              <div className="relative w-full flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center mb-2">
                  <img src={palluPreview} alt="Pallu Preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                  {palluFile?.name || 'Pallu Image Uploaded'}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <Check size={12} strokeWidth={3} /> Ready for generation
                </p>
                <button
                  type="button"
                  onClick={(e) => removeFile('pallu', e)}
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-800 text-white hover:bg-red-600 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-slate-900">Pallu</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">JPG, PNG · Max 10MB</p>

                <button
                  type="button"
                  onClick={() => palluInputRef.current?.click()}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-pink-600 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 rounded-lg"
                >
                  <ImageIcon size={13} className="text-slate-600" />
                  <span>Browse</span>
                </button>

                {palluError && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-2">
                    <AlertCircle size={12} /> {palluError}
                  </p>
                )}
              </>
            )}

            <input
              ref={palluInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0], 'pallu')}
            />
          </div>
        </div>

        {/* ── RIGHT COLUMN: Do's/Don'ts Visual Guide (3 Cards Side by Side) ── */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-stretch">
          {/* Guide Card 1: DO's */}
          <div className="border border-[#0f7a3d] rounded-xl bg-white p-2.5 flex flex-col justify-between overflow-hidden shadow-xs">
            {/* Header: Green Checkmark Badge + "DO's" Heading */}
            <div className="flex flex-col items-center pt-0.5 pb-2">
              <div className="w-5 h-5 rounded-full bg-[#0f7a3d] text-white flex items-center justify-center shadow-xs mb-1">
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="text-xs font-extrabold text-[#0f7a3d] tracking-wide">DO's</span>
            </div>

            {/* Two Stacked Example Images with Full-Width Green Caption Bars */}
            <div className="flex-1 flex flex-col gap-2 justify-center">
              {/* Stack 1: Body */}
              <div className="w-full rounded-md overflow-hidden border border-slate-100 flex flex-col bg-slate-50">
                <div className="h-[96px] w-full overflow-hidden flex items-center justify-center bg-white">
                  <img
                    src="/images/studio/saree_guide/body.jpg"
                    alt="Body"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#0f7a3d] text-white text-[11px] font-bold text-center py-1 shrink-0">
                  Body
                </div>
              </div>

              {/* Stack 2: Pallu */}
              <div className="w-full rounded-md overflow-hidden border border-slate-100 flex flex-col bg-slate-50">
                <div className="h-[96px] w-full overflow-hidden flex items-center justify-center bg-white">
                  <img
                    src="/images/studio/saree_guide/pallu.jpg"
                    alt="Pallu"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#0f7a3d] text-white text-[11px] font-bold text-center py-1 shrink-0">
                  Pallu
                </div>
              </div>
            </div>
          </div>

          {/* Guide Card 2: DON'Ts (No Folded Saree) */}
          <div className="border border-[#d6293e] rounded-xl bg-white p-2.5 flex flex-col justify-between overflow-hidden shadow-xs">
            {/* Header: Red X Badge + "DON'Ts" Heading */}
            <div className="flex flex-col items-center pt-0.5 pb-2">
              <div className="w-5 h-5 rounded-full bg-[#d6293e] text-white flex items-center justify-center shadow-xs mb-1">
                <X size={12} strokeWidth={3} />
              </div>
              <span className="text-xs font-extrabold text-[#d6293e] tracking-wide">DON'Ts</span>
            </div>

            {/* Example Image: Folded Saree with Red Caption Bar */}
            <div className="w-full flex-1 flex flex-col rounded-md overflow-hidden border border-slate-100 bg-white justify-between">
              <div className="flex-1 flex items-center justify-center p-2 min-h-[190px]">
                <img
                  src="/images/studio/saree_guide/folded.jpg"
                  alt="No Folded Saree"
                  className="max-h-[185px] w-auto object-contain"
                />
              </div>
              <div className="bg-[#b30000] text-white text-[11px] font-bold text-center py-1.5 shrink-0">
                No Folded Saree
              </div>
            </div>
          </div>

          {/* Guide Card 3: DON'Ts (No Long Saree) */}
          <div className="border border-[#d6293e] rounded-xl bg-white p-2.5 flex flex-col justify-between overflow-hidden shadow-xs">
            {/* Header: Red X Badge + "DON'Ts" Heading */}
            <div className="flex flex-col items-center pt-0.5 pb-2">
              <div className="w-5 h-5 rounded-full bg-[#d6293e] text-white flex items-center justify-center shadow-xs mb-1">
                <X size={12} strokeWidth={3} />
              </div>
              <span className="text-xs font-extrabold text-[#d6293e] tracking-wide">DON'Ts</span>
            </div>

            {/* Example Image: Long Continuous Saree with Red Caption Bar */}
            <div className="w-full flex-1 flex flex-col rounded-md overflow-hidden border border-slate-100 bg-white justify-between">
              <div className="flex-1 flex items-center justify-center p-2 min-h-[190px]">
                <img
                  src="/images/studio/saree_guide/long.jpg"
                  alt="No Long Saree"
                  className="max-h-[185px] w-auto object-contain"
                />
              </div>
              <div className="bg-[#b30000] text-white text-[11px] font-bold text-center py-1.5 shrink-0">
                No Long Saree
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
