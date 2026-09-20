"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FolderOpen,
  Upload,
  Check,
  ChevronRight,
  Film,
  AlertCircle,
  X,
  Play,
  Share2,
  Download,
} from "lucide-react";
import MotionTemplatesModal from "@/components/motion/MotionTemplatesModal";
import MotionPreviewCard, { MotionTemplate } from "@/components/motion/MotionPreviewCard";
import { CAROUSEL_TEMPLATES, MOTION_TEMPLATES } from "@/data/motionTemplatesData";

const QUALITY_OPTIONS = ["360p", "540p", "720p", "1080p (HD)"];
const CREDITS_REQUIRED = 150;
const USER_CREDITS = 250;

/* ============================================================
   Upload Dropzone
   ============================================================ */
function UploadDropzone({
  onImageSelected,
}: {
  onImageSelected?: (file: File | null, url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageSelected?.(file, url);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-[340px] sm:min-h-[480px] rounded-3xl border-2 transition-all duration-300 p-6 sm:p-10 text-center shadow-sm
        ${
          dragging
            ? "border-blue-400 bg-blue-50/50 shadow-blue-100"
            : preview
            ? "border-slate-200 bg-white cursor-default"
            : "border-dashed border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer"
        }`}
      onClick={() => !preview && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full max-w-xs mx-auto flex flex-col items-center"
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Uploaded"
                className="w-full rounded-2xl object-cover shadow-lg max-h-80 border border-slate-200"
              />
              <div className="motion-scan absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onImageSelected?.(null, null);
              }}
              className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-md"
            >
              <X size={13} />
            </button>
            <p className="mt-4 text-sm font-semibold text-slate-700">Image ready to animate</p>
            <p className="text-xs text-slate-400 mt-1">Select a template and generate your video</p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-16 h-16 mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 animate-pulse opacity-20" />
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm relative">
                <Sparkles size={26} strokeWidth={1.8} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Animate Your Fashion</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-8 max-w-sm leading-relaxed">
              Drag and drop your model or garment image here, or choose from your catalog.
            </p>
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="w-full border border-slate-200 hover:border-slate-400 text-slate-800 font-semibold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 bg-white transition-all cursor-pointer"
              >
                <FolderOpen size={15} strokeWidth={2} /> Browse Image Library
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload size={15} strokeWidth={2} /> Upload Custom Image
              </motion.button>
            </div>
            <p className="mt-6 text-[11px] text-slate-400">JPG, PNG, WEBP — Max 10 MB</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   Main Motion Studio Page
   ============================================================ */
export default function MotionStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("runway-walk");
  const [duration, setDuration] = useState(10);
  const [quality, setQuality] = useState("720p");
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const canGenerate = USER_CREDITS >= CREDITS_REQUIRED;
  const activeTemplate =
    (MOTION_TEMPLATES as MotionTemplate[]).find((t) => t.id === selectedTemplate) ||
    (CAROUSEL_TEMPLATES as MotionTemplate[])[0];

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 text-blue-600 mb-1.5 font-semibold text-xs tracking-wider uppercase">
            <Film size={15} /> Motion Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cinematic AI Video Generation
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Transform high-resolution fashion and catalogue images into fluid, ultra-realistic motion videos
            with cinematic camera pan and runway dynamics.
          </p>
        </div>

        {/* 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Upload / Image Input */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6"
          >
            <UploadDropzone
              onImageSelected={(_file, url) => setUploadedImage(url)}
            />
          </motion.div>

          {/* RIGHT: Video Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-6 space-y-5"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Configure Your Video</h2>

              {/* Template Carousel */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Film size={13} className="text-blue-600" />
                  Motion Template
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                  {(CAROUSEL_TEMPLATES as MotionTemplate[]).map((t) => (
                    <MotionPreviewCard
                      key={t.id}
                      template={t}
                      isSelected={selectedTemplate === t.id}
                      onSelect={setSelectedTemplate}
                      size="small"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
                >
                  <ChevronRight size={14} className="text-blue-500" />
                  View all {MOTION_TEMPLATES.length} templates
                </button>
              </div>

              {/* Duration & Quality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={30}
                    value={duration}
                    onChange={(e) =>
                      setDuration(Math.max(3, Math.min(30, Number(e.target.value))))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                  >
                    {QUALITY_OPTIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Credit summary */}
              <div
                className={`rounded-2xl px-4 py-3.5 border flex items-center justify-between gap-3 ${
                  canGenerate ? "bg-slate-50 border-slate-100" : "bg-blue-50/80 border-blue-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!canGenerate && (
                    <AlertCircle size={15} className="text-blue-500 shrink-0" />
                  )}
                  <p className="text-xs font-medium text-slate-600 leading-tight">
                    {!canGenerate ? (
                      <>
                        <span className="text-blue-600 font-bold">
                          {CREDITS_REQUIRED} credits required
                        </span>{" "}
                        — you have{" "}
                        <span className="font-bold text-slate-800">
                          {USER_CREDITS} credits
                        </span>
                        .
                      </>
                    ) : (
                      <>
                        <span className="text-blue-600 font-bold">
                          {CREDITS_REQUIRED} credits
                        </span>{" "}
                        will be used
                      </>
                    )}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                  ~{duration + 5}s est.
                </span>
              </div>

              {/* Generate CTA Button */}
              <motion.button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !canGenerate}
                whileHover={
                  canGenerate && !generating
                    ? { scale: 1.015, boxShadow: "0 8px 30px rgba(37,99,235,0.25)" }
                    : {}
                }
                whileTap={canGenerate && !generating ? { scale: 0.98 } : {}}
                className={`w-full px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98] cursor-pointer
                  ${
                    canGenerate && !generating
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none disabled:opacity-50"
                  }`}
              >
                {generating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Generating Cinematic Video...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} strokeWidth={2} />
                    {canGenerate ? "Generate Motion Video" : "Top up credits to generate"}
                  </>
                )}
              </motion.button>
            </div>

            {/* Result preview card */}
            <AnimatePresence>
              {generated && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check size={11} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Your video is ready!</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-32 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 shrink-0 relative bg-slate-950">
                      {activeTemplate?.previewVideoUrl ? (
                        <video
                          src={activeTemplate.previewVideoUrl}
                          poster={activeTemplate.posterImage}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : activeTemplate?.posterImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeTemplate.posterImage}
                          alt="result"
                          className="w-full h-full object-cover motion-pan-up"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {activeTemplate?.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {quality} • {duration}s • 60 FPS MP4
                        </p>
                      </div>
                      <div className="flex gap-2.5 mt-4">
                        <button
                          type="button"
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download size={13} /> Download Video
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Share2 size={13} /> Share
                        </button>
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
        onSelect={(id) => {
          setSelectedTemplate(id);
          setTemplateModalOpen(false);
        }}
        onClose={() => setTemplateModalOpen(false)}
      />
    </div>
  );
}
