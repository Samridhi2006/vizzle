"use client";

import { useState, useRef, useCallback } from "react";
import {
  Check, ChevronDown, ChevronUp, Upload, X, Plus,
  Wand2, Image as ImageIcon, Users, LayoutGrid, Layers,
  Camera, Sparkles, Info, Zap
} from "lucide-react";
import { cn } from "@/lib/client/utils";
import { WOMEN_GARMENTS, GARMENT_CATEGORIES, POPULAR_GARMENT_IDS, type GarmentItem } from "@/data/womenGarments";
import { MEN_GARMENTS } from "@/data/menGarments";
import { BOYS_GARMENTS } from "@/data/boysGarments";
import { GIRLS_GARMENTS } from "@/data/girlsGarments";
import { AI_MODELS, type AIModel } from "@/data/aiModels";
import { MEN_AI_MODELS } from "@/data/menAiModels";
import { WOMEN_POSES, MEN_POSES, POSE_CATEGORIES, type Pose } from "@/data/poses";
import { BACKGROUNDS, type Background } from "@/data/backgrounds";

import { PLATFORMS, ASPECT_RATIOS, type AspectRatioOption } from "@/data/studioOptions";

/* ============================================================
   TYPES
   ============================================================ */
type Audience = "women" | "men" | "boys" | "girls";
type UploadMode = "single" | "batch";

const AUDIENCES: { id: Audience; label: string }[] = [
  { id: "women", label: "Women" },
  { id: "men",   label: "Men" },
  { id: "boys",  label: "Boys" },
  { id: "girls", label: "Girls" },
];


function getGarments(audience: Audience): GarmentItem[] {
  switch (audience) {
    case "men": return MEN_GARMENTS;
    case "boys": return BOYS_GARMENTS;
    case "girls": return GIRLS_GARMENTS;
    default: return WOMEN_GARMENTS;
  }
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

// Step header pill
function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-studio-600 text-xs font-bold text-white">
      {n}
    </span>
  );
}

// Garment card
function GarmentCard({
  item, selected, onClick,
}: { item: GarmentItem; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-all",
        selected ? "border-studio-600 ring-2 ring-studio-200" : "border-gray-200 hover:border-studio-300"
      )}
    >
      <div className="relative p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.img}
          alt={item.label}
          className="aspect-[3/4] w-full rounded-lg object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/vz_female_beige_suit.jpg";
          }}
        />
        {selected && (
          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-studio-600 shadow">
            <Check size={11} className="text-white" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="px-2 pb-2.5 pt-1">
        <p className="truncate text-center text-[11px] font-semibold text-gray-800">{item.label}</p>
      </div>
    </button>
  );
}

// Model card
function ModelCard({
  model, selected, onClick,
}: { model: AIModel; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[14px] bg-white text-left transition-all cursor-pointer",
        selected
          ? "border-[2.5px] border-blue-600 shadow-sm ring-1 ring-blue-500/20"
          : "border border-gray-200 hover:border-gray-300 hover:shadow-xs"
      )}
    >
      <div className="relative p-2.5 pb-0">
        <div className="relative overflow-hidden rounded-[10px] bg-gray-50 aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={model.img}
            alt={model.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/vz_female_beige_suit.jpg"; }}
          />
          {selected && (
            <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 shadow-md z-10">
              <Check size={11} className="text-white" strokeWidth={3} />
            </span>
          )}
        </div>
      </div>
      <div className="bg-white py-3 px-2 text-center">
        <p className="truncate text-xs sm:text-[13px] font-bold text-gray-900 tracking-tight">{model.name}</p>
      </div>
    </button>
  );
}

// Pose card
function PoseCard({
  pose, selected, onClick,
}: { pose: Pose; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[14px] bg-white text-left transition-all cursor-pointer",
        selected
          ? "border-[2.5px] border-blue-600 shadow-sm ring-1 ring-blue-500/20"
          : "border border-gray-200 hover:border-gray-300 hover:shadow-xs"
      )}
    >
      <div className="relative p-2.5 pb-0">
        <div className="relative overflow-hidden rounded-[10px] bg-gray-50 aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pose.img}
            alt={pose.label}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/garments/men/suit.jpg"; }}
          />
          {selected && (
            <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 shadow-md z-10">
              <Check size={11} className="text-white" strokeWidth={3} />
            </span>
          )}
        </div>
      </div>
      <div className="bg-white py-2.5 px-2 text-center">
        <p className="truncate text-xs sm:text-[13px] font-bold text-gray-900 tracking-tight">{pose.label}</p>
        <p className="truncate text-[10px] sm:text-[11px] text-gray-500 font-normal mt-0.5">{pose.sublabel}</p>
      </div>
    </button>
  );
}

// Background card
function BackgroundCard({
  bg, selected, onClick,
}: { bg: Background; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-all",
        selected ? "border-studio-600 ring-2 ring-studio-200" : "border-gray-200 hover:border-studio-300"
      )}
    >
      <div className="relative p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bg.img}
          alt={bg.label}
          className="aspect-[4/3] w-full rounded-lg object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "/vz_female_beige_suit.jpg"; }}
        />
        {selected && (
          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-studio-600 shadow">
            <Check size={11} className="text-white" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="px-2 pb-2.5 pt-1">
        <p className="truncate text-center text-[10px] font-semibold text-gray-700">{bg.label}</p>
        <p className="truncate text-center text-[9px] text-gray-400">{bg.category}</p>
      </div>
    </button>
  );
}

// Upload zone
function UploadZone({
  label, hint, preview, onFile, onClear,
}: {
  label: string;
  hint: string;
  preview: string | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <div
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed text-center transition-colors",
          preview ? "border-studio-300 p-2" : "border-gray-300 p-6 hover:border-studio-400"
        )}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
            >
              <X size={12} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="mx-auto max-h-40 rounded-lg object-contain" />
          </>
        ) : (
          <>
            <Upload size={22} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">Click to upload</p>
            <p className="mt-0.5 text-xs text-gray-400">{hint}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
      </div>
    </div>
  );
}

// View All modal wrapper
function ModalOverlay({
  open, onClose, title, headerBottom, children,
}: { open: boolean; onClose: () => void; title: string; headerBottom?: React.ReactNode; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 sm:p-6 lg:p-8 overflow-y-auto"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col border-b border-gray-100 bg-white shrink-0 z-10">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          {headerBottom && (
            <div className="px-6 sm:px-8 pb-4 pt-0">
              {headerBottom}
            </div>
          )}
        </div>
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function StudioPage() {
  // State
  const [audience, setAudience] = useState<Audience>("women");
  const [mode, setMode] = useState<UploadMode>("single");
  const [category, setCategory] = useState("all");
  const [selectedGarment, setSelectedGarment] = useState<string | null>(null);
  const [garmentModalOpen, setGarmentModalOpen] = useState(false);

  // Upload previews
  const [bodyPreview, setBodyPreview] = useState<string | null>(null);
  const [palluPreview, setPalluPreview] = useState<string | null>(null);

  // Model
  const [selectedModel, setSelectedModel] = useState<string>("meera");
  const [modelModalOpen, setModelModalOpen] = useState(false);

  // Pose
  const [selectedPose, setSelectedPose] = useState<string>("front-view");
  const [poseModalOpen, setPoseModalOpen] = useState(false);
  const [poseCategory, setPoseCategory] = useState("all");

  // Background
  const [selectedBg, setSelectedBg] = useState<string>("natural-limestone-wall");
  const [bgModalOpen, setBgModalOpen] = useState(false);
  const [customBgPreview, setCustomBgPreview] = useState<string | null>(null);

  // Input refs for file uploads
  const bodyInputRef = useRef<HTMLInputElement>(null);
  const palluInputRef = useRef<HTMLInputElement>(null);

  // Platform, ratio, resolution
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["amazon"]);
  const [aspectRatio, setAspectRatio] = useState<string>("3:4");
  const [resolution, setResolution] = useState<string>("2K");
  const creditCost = resolution === "2K" ? 10 : 20;

  // Generating
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const garments = getGarments(audience);
  const popularGarments = audience === "women"
    ? garments.filter((g) => POPULAR_GARMENT_IDS.includes(g.id)).slice(0, 10)
    : garments.slice(0, 10);

  const filteredGarments = category === "all" ? garments : garments.filter((g) => g.category === category);
  const poses = audience === "men" ? MEN_POSES : WOMEN_POSES;
  const filteredPoses = poseCategory === "all" ? poses : poses.filter((p) => p.category === poseCategory);

  const selectedGarmentItem = garments.find((g) => g.id === selectedGarment);
  const models = (audience === "men" || audience === "boys") ? MEN_AI_MODELS : AI_MODELS;
  const selectedModelItem = models.find((m) => m.id === selectedModel) || models[0];
  const selectedPoseItem = poses.find((p) => p.id === selectedPose) || poses[0];
  const selectedBgItem = BACKGROUNDS.find((b) => b.id === selectedBg);

  const isSaree = selectedGarmentItem?.id === "saree" || selectedGarmentItem?.category === "ethnic";

  function makePreview(file: File, setter: (s: string | null) => void) {
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleGenerate() {
    if (!selectedGarment) { alert("Please select a garment type first."); return; }
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2500);
  }

  // Summary bar text helpers
  const summaryItems = [
    selectedGarmentItem ? { icon: Layers, label: selectedGarmentItem.label } : null,
    selectedModelItem ? { icon: Users, label: selectedModelItem.name } : null,
    selectedPoseItem ? { icon: Camera, label: selectedPoseItem.label } : null,
    selectedBgItem ? { icon: ImageIcon, label: selectedBgItem.label } : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string }[];

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* PAGE HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 size={20} className="text-studio-600" />
            <h1 className="text-xl font-extrabold text-gray-900">AI Studio</h1>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Create professional catalogue images with AI virtual try-on.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={!selectedGarment || generating}
          className={cn(
            "flex items-center gap-2 rounded-xl border-2 border-black px-5 py-2.5 text-sm font-bold transition-all",
            !selectedGarment || generating
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-studio-600 text-white hover:bg-studio-700"
          )}
        >
          {generating ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Generating…</>
          ) : (
            <><Sparkles size={15} />Generate Images</>
          )}
        </button>
      </div>

      {/* SUMMARY BAR */}
      {summaryItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-studio-100 bg-studio-50 px-4 py-2.5">
          <span className="mr-1 text-xs font-semibold text-studio-700">Selected:</span>
          {summaryItems.map(({ icon: Icon, label }, i) => (
            <span key={i} className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm border border-studio-100">
              <Icon size={11} className="text-studio-600" />
              {label}
            </span>
          ))}
        </div>
      )}

      {/* STEP 1 — AUDIENCE */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <StepBadge n={1} />
          <div>
            <p className="font-bold text-gray-900">Select Audience</p>
            <p className="text-xs text-gray-500">Choose the target audience for your catalogue</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                setAudience(a.id);
                setSelectedGarment(null);
                setCategory("all");
                setSelectedModel((a.id === "men" || a.id === "boys") ? "arjun" : "meera");
                setSelectedPose((a.id === "men" || a.id === "boys") ? "men-front-view" : "front-view");
              }}
              className={cn(
                "rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-all",
                audience === a.id
                  ? "border-studio-600 bg-studio-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-studio-300"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>

      {/* STEP 2 — GARMENT TYPE */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StepBadge n={2} />
            <div>
              <p className="font-bold text-gray-900">Select Your Garment Type</p>
              <p className="text-xs text-gray-500">Choose the garment category for your catalogue</p>
            </div>
          </div>
          <button
            onClick={() => setGarmentModalOpen(true)}
            className="rounded-lg border border-studio-200 bg-studio-50 px-3 py-1.5 text-xs font-semibold text-studio-700 hover:bg-studio-100 transition-colors"
          >
            View All
          </button>
        </div>
        {/* Upload mode toggle */}
        <div className="mb-4 inline-flex rounded-full border border-gray-200 bg-gray-100 p-0.5">
          {(["single", "batch"] as UploadMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
                mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        {/* 5-column popular grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {popularGarments.map((g) => (
            <GarmentCard
              key={g.id}
              item={g}
              selected={selectedGarment === g.id}
              onClick={() => setSelectedGarment(g.id)}
            />
          ))}
        </div>
      </section>


      {/* STEP 3 — UPLOAD GARMENT */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <StepBadge n={3} />
          <div>
            <p className="font-bold text-gray-900">Upload Garment Images</p>
            <p className="text-xs text-gray-500">Upload a clean flat-lay or mannequin garment image</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* LEFT: Upload boxes */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {/* Body upload */}
            <div
              onClick={() => !bodyPreview && bodyInputRef.current?.click()}
              className={cn(
                "group relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border p-6 text-center transition-all",
                bodyPreview ? "border-studio-500 ring-2 ring-studio-100" : "border-gray-200 hover:border-gray-300"
              )}
            >
              {bodyPreview ? (
                <div className="relative flex w-full flex-col items-center">
                  <div className="mb-2 h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bodyPreview} alt="Body" className="h-full w-full object-cover" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">Body image uploaded</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <Check size={12} strokeWidth={3} /> Ready for generation
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setBodyPreview(null); }}
                    className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white shadow hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedGarmentItem?.id === "saree" ? "Body (Saree draped)" : "Garment Image"}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-gray-400">JPG, PNG · Max 10MB</p>
                  <button
                    type="button"
                    onClick={() => bodyInputRef.current?.click()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <ImageIcon size={13} className="text-gray-500" /> Browse
                  </button>
                </>
              )}
              <input ref={bodyInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) makePreview(f, setBodyPreview); }} />
            </div>

            {/* Pallu upload — only for Saree */}
            {selectedGarmentItem?.id === "saree" && (
              <div
                onClick={() => !palluPreview && palluInputRef.current?.click()}
                className={cn(
                  "group relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border p-6 text-center transition-all",
                  palluPreview ? "border-studio-500 ring-2 ring-studio-100" : "border-gray-200 hover:border-gray-300"
                )}
              >
                {palluPreview ? (
                  <div className="relative flex w-full flex-col items-center">
                    <div className="mb-2 h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={palluPreview} alt="Pallu" className="h-full w-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-gray-800">Pallu image uploaded</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <Check size={12} strokeWidth={3} /> Ready for generation
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPalluPreview(null); }}
                      className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white shadow hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-900">Pallu</p>
                    <p className="mt-0.5 text-xs font-medium text-gray-400">JPG, PNG · Max 10MB</p>
                    <button
                      type="button"
                      onClick={() => palluInputRef.current?.click()}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      <ImageIcon size={13} className="text-gray-500" /> Browse
                    </button>
                  </>
                )}
                <input ref={palluInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) makePreview(f, setPalluPreview); }} />
              </div>
            )}
          </div>

          {/* RIGHT: Saree Do/Dont guide — show only for Saree, else plain tip */}
          <div className="lg:col-span-7">
            {selectedGarmentItem?.id === "saree" ? (
              <div className="grid grid-cols-3 gap-3.5 h-full items-stretch">
                {/* DOs card */}
                <div className="flex flex-col overflow-hidden rounded-xl border border-[#0f7a3d] bg-white p-2.5 shadow-sm">
                  <div className="flex flex-col items-center pb-2 pt-0.5">
                    <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0f7a3d] text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-extrabold tracking-wide text-[#0f7a3d]">DO s</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-2">
                    <div className="flex flex-col overflow-hidden rounded-md border border-gray-100">
                      <div className="flex h-24 w-full items-center justify-center overflow-hidden bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/studio/saree_guide/body.jpg" alt="Body" className="h-full w-full object-cover" />
                      </div>
                      <div className="shrink-0 bg-[#0f7a3d] py-1 text-center text-[11px] font-bold text-white">Body</div>
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-md border border-gray-100">
                      <div className="flex h-24 w-full items-center justify-center overflow-hidden bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/studio/saree_guide/pallu.jpg" alt="Pallu" className="h-full w-full object-cover" />
                      </div>
                      <div className="shrink-0 bg-[#0f7a3d] py-1 text-center text-[11px] font-bold text-white">Pallu</div>
                    </div>
                  </div>
                </div>
                {/* DONTs card 1 */}
                <div className="flex flex-col overflow-hidden rounded-xl border border-[#d6293e] bg-white p-2.5 shadow-sm">
                  <div className="flex flex-col items-center pb-2 pt-0.5">
                    <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d6293e] text-white">
                      <X size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-extrabold tracking-wide text-[#d6293e]">DON Ts</span>
                  </div>
                  <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-gray-100 bg-white">
                    <div className="flex min-h-[190px] flex-1 items-center justify-center p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/studio/saree_guide/folded.jpg" alt="No folded saree" className="max-h-[185px] w-auto object-contain" />
                    </div>
                    <div className="shrink-0 bg-[#b30000] py-1.5 text-center text-[11px] font-bold text-white">No Folded Saree</div>
                  </div>
                </div>
                {/* DONTs card 2 */}
                <div className="flex flex-col overflow-hidden rounded-xl border border-[#d6293e] bg-white p-2.5 shadow-sm">
                  <div className="flex flex-col items-center pb-2 pt-0.5">
                    <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d6293e] text-white">
                      <X size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-extrabold tracking-wide text-[#d6293e]">DON Ts</span>
                  </div>
                  <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-gray-100 bg-white">
                    <div className="flex min-h-[190px] flex-1 items-center justify-center p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/studio/saree_guide/long.jpg" alt="No long saree" className="max-h-[185px] w-auto object-contain" />
                    </div>
                    <div className="shrink-0 bg-[#b30000] py-1.5 text-center text-[11px] font-bold text-white">No Long Saree</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex gap-2 text-xs text-blue-700">
                  <Info size={14} className="mt-0.5 shrink-0 text-blue-500" />
                  <div>
                    <span className="font-semibold">Tips:</span> Use flat-lay or mannequin shots on a plain
                    background. Avoid wrinkled or folded garments. Min 800x1000px recommended.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STEP 4 — AI MODEL */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StepBadge n={4} />
            <div>
              <p className="font-bold text-gray-900">Choose AI Model</p>
              <p className="text-xs text-gray-500">Select the fashion model for your catalogue</p>
            </div>
          </div>
          <button
            onClick={() => setModelModalOpen(true)}
            className="rounded-lg border border-studio-200 bg-studio-50 px-3 py-1.5 text-xs font-semibold text-studio-700 hover:bg-studio-100 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {models.slice(0, 5).map((m) => (
            <ModelCard
              key={m.id}
              model={m}
              selected={selectedModel === m.id}
              onClick={() => setSelectedModel(m.id)}
            />
          ))}
        </div>
      </section>

      {/* STEP 5 — POSE */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StepBadge n={5} />
            <div>
              <p className="font-bold text-gray-900">Choose Pose</p>
              <p className="text-xs text-gray-500">Select the model pose for your catalogue shoot</p>
            </div>
          </div>
          <button
            onClick={() => setPoseModalOpen(true)}
            className="rounded-lg border border-studio-200 bg-studio-50 px-3 py-1.5 text-xs font-semibold text-studio-700 hover:bg-studio-100 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {poses.slice(0, 6).map((p) => (
            <PoseCard
              key={p.id}
              pose={p}
              selected={selectedPose === p.id}
              onClick={() => setSelectedPose(p.id)}
            />
          ))}
        </div>
      </section>

      {/* STEP 6 — BACKGROUND */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StepBadge n={6} />
            <div>
              <p className="font-bold text-gray-900">Select Background</p>
              <p className="text-xs text-gray-500">Choose the studio background for your shoot</p>
            </div>
          </div>
          <button
            onClick={() => setBgModalOpen(true)}
            className="rounded-lg border border-studio-200 bg-studio-50 px-3 py-1.5 text-xs font-semibold text-studio-700 hover:bg-studio-100 transition-colors"
          >
            View All
          </button>
        </div>

        {/* Custom background upload */}
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-semibold text-gray-600">My Backgrounds</label>
          <div className="flex items-center gap-3">
            {customBgPreview && (
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-studio-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={customBgPreview} alt="custom bg" className="h-full w-full object-cover" />
                <button
                  onClick={() => setCustomBgPreview(null)}
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/50 text-white"
                >
                  <X size={8} />
                </button>
              </div>
            )}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-center transition-colors hover:border-studio-400">
              <Plus size={16} className="text-gray-400" />
              <span className="text-[10px] font-semibold text-gray-500">Add background</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) makePreview(f, setCustomBgPreview);
                }}
              />
            </label>
          </div>
        </div>

        {/* Default backgrounds grid */}
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">Studio Backgrounds</label>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
          {BACKGROUNDS.slice(0, 5).map((bg) => (
            <BackgroundCard
              key={bg.id}
              bg={bg}
              selected={selectedBg === bg.id}
              onClick={() => setSelectedBg(bg.id)}
            />
          ))}
        </div>
      </section>



      {/* STEP 7 — PUBLISHING PLATFORM */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <StepBadge n={7} />
          <div>
            <p className="font-bold text-gray-900">Publishing Platform</p>
            <p className="text-xs text-gray-500">Choose where you will list your products</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlatforms((prev) =>
                prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
              )}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-sm font-semibold transition-all",
                selectedPlatforms.includes(p.id)
                  ? "border-studio-600 bg-studio-50 text-gray-900"
                  : "border-gray-100 text-gray-600 hover:border-blue-200"
              )}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-black text-white"
                style={{ background: p.color }}
              >
                {p.letter}
              </span>
              {p.name}
              {selectedPlatforms.includes(p.id) && (
                <Check size={12} className="text-studio-600" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* STEP 8 — ASPECT RATIO */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <StepBadge n={8} />
          <div>
            <p className="font-bold text-gray-900">Aspect Ratio</p>
            <p className="text-xs text-gray-500">Choose the image dimensions for your platform</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setAspectRatio(r.id)}
              className={cn(
                "flex min-w-[80px] flex-col items-center rounded-xl border-2 px-4 py-3 text-sm transition-all",
                aspectRatio === r.id
                  ? "border-studio-600 bg-studio-50"
                  : "border-gray-100 hover:border-blue-200"
              )}
            >
              <span className={cn("text-sm font-bold", aspectRatio === r.id ? "text-studio-600" : "text-gray-700")}>
                {r.label}
              </span>
              <span className="mt-0.5 text-[9px] text-gray-400">{r.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* STEP 9 — OUTPUT RESOLUTION + GENERATE */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <StepBadge n={9} />
          <div>
            <p className="font-bold text-gray-900">Output Resolution</p>
            <p className="text-xs text-gray-500">Select image quality for your catalogue</p>
          </div>
        </div>

        {/* Resolution toggle */}
        <div className="mb-6 flex gap-3">
          {([
            { id: "2K", label: "2K", credits: 10 },
            { id: "4K", label: "4K", credits: 20 },
          ] as { id: string; label: string; credits: number }[]).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setResolution(r.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-bold transition-all",
                resolution === r.id
                  ? "border-studio-600 bg-studio-50 text-studio-700"
                  : "border-gray-100 text-gray-600 hover:border-blue-200"
              )}
            >
              {r.id === "4K" && (
                <Sparkles size={13} className={resolution === "4K" ? "text-studio-500" : "text-gray-400"} />
              )}
              {r.label}
              <span className={cn("text-[10px] font-medium", resolution === r.id ? "text-studio-500" : "text-gray-400")}>
                {r.credits} credits
              </span>
            </button>
          ))}
        </div>

        {/* Credit summary bar */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-bold text-gray-700">
              <span className="text-studio-600">{creditCost} Credits</span> required
            </p>
            <p className="text-xs text-gray-400">
              You have 100 credits · {Math.floor(100 / creditCost)} generation{Math.floor(100 / creditCost) !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Estimated time</p>
            <p className="text-sm font-bold text-gray-700">~25 seconds</p>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedGarment || generating}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-bold shadow-lg transition-all",
            !selectedGarment || generating
              ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700"
          )}
        >
          <Sparkles size={18} />
          {generating ? "Generating..." : "Generate Catalogue"}
          {!generating && <span className="text-sm opacity-80">→</span>}
        </button>
      </section>

      {/* PREVIEW / EMPTY STATE */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {generated ? (
          <div className="p-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700">
              <Sparkles size={14} className="text-studio-500" /> Your Catalogue is Ready
            </p>
            <div className="grid grid-cols-3 gap-4">
              {["/catalogue/brand_main.jpg", "/catalogue/lookbook_main.jpg", "/catalogue/social_main.jpg"].map((src, i) => (
                <div key={i} className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`result-${i}`} className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/vz_female_beige_suit.jpg"; }} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            {/* 3D folder illustration */}
            <div className="relative mb-6 h-24 w-24">
              <div className="absolute bottom-0 h-20 w-24 rounded-2xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-100 to-indigo-100" />
              <div className="absolute left-0 top-0 h-4 w-16 rounded-t-xl border-2 border-t border-blue-200/60 bg-gradient-to-r from-blue-200 to-indigo-200" />
              <div className="absolute -top-3 right-0 flex h-16 w-14 rotate-6 items-center justify-center rounded-xl border-2 border-gray-200 bg-white shadow-md">
                <ImageIcon size={20} className="text-gray-300" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-800">Turn garments into catalogue-ready visuals</h3>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-gray-400">
              Upload a garment, choose your preferred style, and generate professional catalogue images in just a few clicks.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Studio quality output", "Multiple model options", "Ready for ecommerce"].map((feat) => (
                <span key={feat} className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <Check size={11} strokeWidth={3} className="text-emerald-500" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>


      {/* ============ MODALS ============ */}

      {/* Garment View All Modal */}
      <ModalOverlay
        open={garmentModalOpen}
        onClose={() => setGarmentModalOpen(false)}
        title={`All ${audience.charAt(0).toUpperCase() + audience.slice(1)}'s Garments`}
      >
        {audience === "women" && (
          <div className="mb-4 flex flex-wrap gap-2">
            {GARMENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                  category === cat.id
                    ? "border-studio-600 bg-studio-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-studio-300"
                )}
              >
                {cat.label} {cat.count > 0 && <span className="opacity-70">({cat.count})</span>}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {filteredGarments.map((g) => (
            <GarmentCard
              key={g.id}
              item={g}
              selected={selectedGarment === g.id}
              onClick={() => { setSelectedGarment(g.id); setGarmentModalOpen(false); }}
            />
          ))}
        </div>
      </ModalOverlay>

      {/* Model View All Modal */}
      <ModalOverlay
        open={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        title="All AI Models"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-4.5">
          {models.map((m) => (
            <ModelCard
              key={m.id}
              model={m}
              selected={selectedModel === m.id}
              onClick={() => setSelectedModel(m.id)}
            />
          ))}
        </div>
      </ModalOverlay>

      {/* Pose View All Modal */}
      <ModalOverlay
        open={poseModalOpen}
        onClose={() => setPoseModalOpen(false)}
        title="All Poses"
        headerBottom={
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {POSE_CATEGORIES.map((cat) => {
              const isActive = poseCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPoseCategory(cat.id)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer",
                    isActive
                      ? "border border-blue-600 bg-blue-600 text-white shadow-xs"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {filteredPoses.map((p) => (
            <PoseCard
              key={p.id}
              pose={p}
              selected={selectedPose === p.id}
              onClick={() => setSelectedPose(p.id)}
            />
          ))}
        </div>
      </ModalOverlay>

      {/* Background View All Modal */}
      <ModalOverlay
        open={bgModalOpen}
        onClose={() => setBgModalOpen(false)}
        title="All Backgrounds"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BACKGROUNDS.map((bg) => (
            <BackgroundCard
              key={bg.id}
              bg={bg}
              selected={selectedBg === bg.id}
              onClick={() => { setSelectedBg(bg.id); setBgModalOpen(false); }}
            />
          ))}
        </div>
      </ModalOverlay>
    </div>
  );
}


