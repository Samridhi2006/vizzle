// src/dashboard/pages/MotionStudioPage.jsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FolderOpen, Upload, Check, ChevronRight, Film, Zap, AlertCircle, X, Play } from "lucide-react";
import MotionTemplatesModal from "../../motion/MotionTemplatesModal";
import MotionPreviewCard from "../../motion/MotionPreviewCard";
import { CAROUSEL_TEMPLATES } from "../../data/motionTemplatesData";

const QUALITY_OPTIONS = ["360p", "540p", "720p", "1080p (HD)"];
const CREDITS_REQUIRED = 150;
const USER_CREDITS = 100;

// ── Upload Dropzone ───────────────────────────────────────────────────────────
function UploadDropzone({ onImageSelected }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageSelected?.(file, url);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-[480px] rounded-3xl border-2 transition-all duration-300 p-10 text-center shadow-sm
        ${dragging ? "border-blue-400 bg-blue-50/50 shadow-blue-100" : preview ? "border-slate-200 bg-white cursor-default" : "border-dashed border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer"}`}
      onClick={() => !preview && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative w-full max-w-xs mx-auto flex flex-col items-center">
            <div className="relative">
              <img src={preview} alt="Uploaded" className="w-full rounded-2xl object-cover shadow-lg max-h-80 border border-slate-200" />
              {/* Scan line animation on preview */}
              <div className="motion-scan absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setPreview(null); onImageSelected?.(null, null); }}
              className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-md"
            ><X size={13} /></button>
            <p className="mt-4 text-sm font-semibold text-slate-700">Image ready to animate ✨</p>
            <p className="text-xs text-slate-400 mt-1">Select a template → Generate your video</p>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
            {/* Animated gradient orb */}
            <div className="relative w-16 h-16 mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 animate-pulse opacity-20" />
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm relative">
                <Sparkles size={26} strokeWidth={1.8} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Animate Your Fashion</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-8 max-w-sm leading-relaxed">
              Drag and drop your image here, or click the button below to upload
            </p>
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={(e) => e.stopPropagation()}
                className="w-full border border-slate-200 hover:border-slate-400 text-slate-800 font-semibold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 bg-white transition-all">
                <FolderOpen size={15} strokeWidth={2} /> Browse Catalogues
              </motion.button>
              <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }} whileTap={{ scale: 0.98 }} type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all">
                <Upload size={15} strokeWidth={2} /> Upload Custom Image
              </motion.button>
            </div>
            <p className="mt-6 text-[11px] text-slate-400">JPG, PNG, WEBP · Max 10 MB</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MotionStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("luxury-runway");
  const [duration, setDuration] = useState(10);
  const [quality, setQuality] = useState("720p");
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const canGenerate = USER_CREDITS >= CREDITS_REQUIRED;
  const activeTemplate = CAROUSEL_TEMPLATES.find(t => t.id === selectedTemplate);

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 3000);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <div className="max-w-6xl mx-auto px-6 py-7 space-y-6">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Film size={14} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Motion Studio</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">BETA</span>
            </div>
            <p className="text-xs text-slate-500 ml-9">Animate a catalogue photo into a motion-ready product video</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border ${canGenerate ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
            <Zap size={11} /> {USER_CREDITS} Credits
          </div>
        </motion.div>

        {/* Two-column workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Upload */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="lg:col-span-6">
            <UploadDropzone onImageSelected={(file, url) => setUploadedImage(url)} />
          </motion.div>

          {/* RIGHT: Config */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Configure your video</h2>

              {/* Template carousel — uses MotionPreviewCard */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Film size={12} className="text-blue-500" />Motion Template
                </p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {CAROUSEL_TEMPLATES.map((t) => (
                    <MotionPreviewCard
                      key={t.id}
                      template={t}
                      isSelected={selectedTemplate === t.id}
                      onSelect={setSelectedTemplate}
                      size="small"
                    />
                  ))}
                </div>
                <button type="button" onClick={() => setTemplateModalOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all flex items-center justify-center gap-1.5">
                  <ChevronRight size={13} className="text-blue-400" /> View all {26} templates
                </button>
              </div>

              {/* Duration & Quality */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Duration (seconds)</label>
                  <input type="number" min={3} max={30} value={duration}
                    onChange={(e) => setDuration(Math.max(3, Math.min(30, Number(e.target.value))))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Quality</label>
                  <select value={quality} onChange={(e) => setQuality(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white">
                    {QUALITY_OPTIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>

              {/* Credit summary */}
              <div className={`rounded-2xl px-4 py-3.5 border flex items-center justify-between gap-3 ${canGenerate ? "bg-slate-50 border-slate-100" : "bg-blue-50/80 border-blue-200"}`}>
                <div className="flex items-center gap-2">
                  {!canGenerate && <AlertCircle size={14} className="text-blue-500 flex-shrink-0" />}
                  <p className="text-[11px] font-medium text-slate-500 leading-tight">
                    {!canGenerate ? (
                      <><span className="text-blue-600 font-bold">{CREDITS_REQUIRED} credits required</span> — you have <span className="font-bold text-slate-700">{USER_CREDITS} credits</span>. <a href="/dashboard/billing" className="text-blue-600 font-bold underline underline-offset-2">Top up to generate.</a></>
                    ) : (
                      <><span className="text-blue-600 font-bold">{CREDITS_REQUIRED} credits</span> will be used</>
                    )}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">~{duration + 5}s</span>
              </div>

              {/* Generate CTA */}
              <motion.button type="button" onClick={handleGenerate} disabled={generating || !canGenerate}
                whileHover={canGenerate && !generating ? { scale: 1.015, boxShadow: "0 8px 30px rgba(37,99,235,0.25)" } : {}}
                whileTap={canGenerate && !generating ? { scale: 0.98 } : {}}
                className={`w-full px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98]
                  ${canGenerate && !generating ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none disabled:opacity-50"}`}>
                {generating ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Generating video…</>
                ) : (
                  <><Sparkles size={15} strokeWidth={2} />{canGenerate ? "Generate video" : "Top up credits to generate"}</>
                )}
              </motion.button>
            </div>

            {/* Result card */}
            <AnimatePresence>
              {generated && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check size={11} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Your video is ready!</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-28 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 relative">
                      {activeTemplate?.posterImage && (
                        <img src={activeTemplate.posterImage} alt="result" className="w-full h-full object-cover motion-pan-up" />
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play size={22} className="text-white drop-shadow-lg ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{activeTemplate?.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{quality} · {duration}s · MP4</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold shadow-xs">Download</button>
                        <button className="px-3 py-2 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">Share</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <MotionTemplatesModal
        isOpen={templateModalOpen}
        selected={selectedTemplate}
        onSelect={(id) => { setSelectedTemplate(id); setTemplateModalOpen(false); }}
        onClose={() => setTemplateModalOpen(false)}
      />
    </div>
  );
}
