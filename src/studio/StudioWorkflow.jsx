import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Check, ChevronRight, Sparkles, Plus, ArrowRight,
  LayoutGrid, Zap, Star, Image as ImageIcon, Layers, X
} from "lucide-react";
import ModelPickerModal from "./ModelPickerModal";
import BackgroundPickerModal from "./BackgroundPickerModal";
import GarmentSelector from "./GarmentSelector";
import GarmentUploadStep from "./GarmentUploadStep";
import BoysUploadStep from "./BoysUploadStep";
import GirlsUploadStep from "./GirlsUploadStep";
import { WOMEN_GARMENTS } from "../data/womenGarments";
import { MEN_GARMENTS } from "../data/menGarments";
import { BOYS_GARMENTS, BOYS_GARMENT_CATEGORIES, BOYS_POPULAR_IDS } from "../data/boysGarments";
import { GIRLS_GARMENTS, GIRLS_GARMENT_CATEGORIES, GIRLS_POPULAR_IDS } from "../data/girlsGarments";
import { AI_MODELS } from "../data/aiModels";
import { MEN_AI_MODELS } from "../data/menAiModels";
import { BOYS_AI_MODELS } from "../data/boysAiModels";
import { GIRLS_AI_MODELS } from "../data/girlsAiModels";
import PosePickerModal from "./PosePickerModal";
import PoseSelector from "./PoseSelector";
import { WOMEN_POSES, MEN_POSES, BOYS_POSES, GIRLS_POSES } from "../data/poses";
import { sareeSpecificPoses, isSareeGarment } from "../data/sareePoses";
import { BACKGROUNDS } from "../data/backgrounds";
import PlatformSelector from "./PlatformSelector";
import PlatformPreview from "./PlatformPreview";

// ── Data ──────────────────────────────────────────────────────────────────────

const GARMENTS = {
  women: WOMEN_GARMENTS,
  men: MEN_GARMENTS,
  boys: BOYS_GARMENTS,
  girls: GIRLS_GARMENTS,
};









const PLATFORMS = [
  { id: "amazon", label: "Amazon", color: "#FF9900", letter: "A" },
  { id: "flipkart", label: "Flipkart", color: "#2874F0", letter: "F" },
  { id: "myntra", label: "Myntra", color: "#FF3F6C", letter: "M" },
  { id: "ajio", label: "Ajio", color: "#1C1C1C", letter: "AJ" },
  { id: "meesho", label: "Meesho", color: "#9B1FE8", letter: "Me" },
  { id: "nykaa", label: "Nykaa", color: "#FC2779", letter: "Nk" },
  { id: "shopify", label: "Shopify", color: "#5C6AC4", letter: "Sh" },
];

const RATIOS = [
  { id: "1:1", label: "1:1", sub: "2048 × 2048 px" },
  { id: "2:3", label: "2:3", sub: "1365 × 2048 px" },
  { id: "3:4", label: "3:4", sub: "1536 × 2048 px" },
  { id: "4:5", label: "4:5", sub: "1638 × 2048 px" },
  { id: "9:16", label: "9:16", sub: "1152 × 2048 px" },
  { id: "16:9", label: "16:9", sub: "2048 × 1152 px" },
  { id: "custom", label: "+ Custom", sub: "Enter size" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StepHeader({ number, title, children }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SelectionCard({ img, label, selected, onClick, sublabel, aspectClass = "aspect-square" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center bg-white text-left w-full overflow-hidden ${
        selected
          ? "border-2 border-blue-600 ring-2 ring-blue-100 shadow-md shadow-blue-500/20"
          : "border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs"
      }`}
    >
      <div className={`w-full ${aspectClass} bg-white flex items-center justify-center p-3 sm:p-4 overflow-hidden relative`}>
        <img
          src={img}
          alt={label}
          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-102"
        />
        {selected && (
          <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xs">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        )}
      </div>
      <div className="w-full py-2.5 sm:py-3 px-2 text-center bg-white border-t border-slate-100/70">
        <p className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight truncate">
          {label}
        </p>
        {sublabel && (
          <p className="text-[10px] text-slate-400 font-medium truncate capitalize mt-0.5">
            {sublabel}
          </p>
        )}
      </div>
    </button>
  );
}

function UploadZone({ label, onFile }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handle = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFile && onFile(file);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all min-h-[160px] ${
        dragging ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
      }`}
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
    >
      {preview ? (
        <>
          <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
          <button
            className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center z-10"
            onClick={(e) => { e.stopPropagation(); setPreview(null); }}
          >
            <X size={12} className="text-white" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Upload size={18} />
          </div>
          <p className="text-xs font-semibold text-center text-slate-500">{label}</p>
          <p className="text-[10px] text-slate-400">JPG, PNG — Max 10MB</p>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files[0])} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function StudioWorkflow() {
  const [mode, setMode] = useState("single");
  const [audience, setAudience] = useState("women");
  const [garmentType, setGarmentType] = useState("crop-top");
  const [selectedModel, setSelectedModel] = useState("meera");
  const [selectedBg, setSelectedBg] = useState("natural-limestone-wall");
  const [selectedCustomPose, setSelectedCustomPose] = useState("front-view");
  const [customBackgrounds, setCustomBackgrounds] = useState([]);
  const customBgInputRef = useRef(null);

  const handleCustomBgUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newId = `custom-${Date.now()}`;
    const newBg = {
      id: newId,
      label: file.name.replace(/\.[^/.]+$/, "").slice(0, 24),
      img: URL.createObjectURL(file),
      isCustom: true,
    };
    setCustomBackgrounds((prev) => [newBg, ...prev]);
    setSelectedBg(newId);
    e.target.value = "";
  };
  const [platform, setPlatform] = useState("amazon");
  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("2K");
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [bgModalOpen, setBgModalOpen] = useState(false);
  const [poseModalOpen, setPoseModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const isSaree = useMemo(() => {
    if (audience !== "women") return false;
    return isSareeGarment(garmentType);
  }, [garmentType, audience]);

  const currentPoses =
    isSaree              ? sareeSpecificPoses :
    audience === "girls" ? GIRLS_POSES :
    audience === "boys"  ? BOYS_POSES :
    audience === "men"   ? MEN_POSES  :
    WOMEN_POSES;

  // Auto-sync pose selection when switching between saree and regular garments
  useEffect(() => {
    if (isSaree) {
      const isSareePose = sareeSpecificPoses.some((p) => p.id === selectedCustomPose);
      if (!isSareePose) {
        setSelectedCustomPose("saree-pose-1");
      }
    } else {
      const isSareePose = sareeSpecificPoses.some((p) => p.id === selectedCustomPose);
      if (isSareePose) {
        setSelectedCustomPose(
          audience === "men" ? "men-pose-01" :
          audience === "boys" ? "boy-pose-01" :
          audience === "girls" ? "girl-pose-01" :
          "front-view"
        );
      }
    }
  }, [isSaree, audience]);
  const currentModels =
    audience === "men"   ? MEN_AI_MODELS   :
    audience === "boys"  ? BOYS_AI_MODELS  :
    audience === "girls" ? GIRLS_AI_MODELS :
    AI_MODELS;

  // Render exactly 10 models in the default grid (5 columns x 2 rows).
  // If the user selected a model from the "View All" modal beyond the first 10,
  // keep the selection visible in the 10-card view.
  const visibleModels = useMemo(() => {
    const top10 = currentModels.slice(0, 10);
    const inTop10 = top10.some((m) => m.id === selectedModel);
    if (inTop10 || !selectedModel) return top10;
    const selectedObj = currentModels.find((m) => m.id === selectedModel);
    if (!selectedObj) return top10;
    return [...top10.slice(0, 9), selectedObj];
  }, [currentModels, selectedModel]);

  // Render exactly 10 backgrounds in the default grid (5 columns x 2 rows).
  // If the user selected a background from the "View All" modal beyond the first 10,
  // keep the selection visible in the 10-card view.
  const visibleBackgrounds = useMemo(() => {
    const top10 = BACKGROUNDS.slice(0, 10);
    const inTop10 = top10.some((b) => b.id === selectedBg);
    if (inTop10 || !selectedBg || selectedBg.startsWith("custom-")) return top10;
    const selectedObj = BACKGROUNDS.find((b) => b.id === selectedBg);
    if (!selectedObj) return top10;
    return [...top10.slice(0, 9), selectedObj];
  }, [selectedBg]);

  const AUDIENCES = [
    { id: "women", label: "Women" },
    { id: "men", label: "Men" },
    { id: "boys", label: "Boys" },
    { id: "girls", label: "Girls" },
  ];

  const credits = resolution === "2K" ? 10 : 20;

  const currentGarmentLabel = useMemo(() => {
    return GARMENTS[audience]?.find((g) => g.id === garmentType)?.label || "Garment";
  }, [audience, garmentType]);

  const currentModelName = useMemo(() => {
    return currentModels?.find((m) => m.id === selectedModel)?.name || "Fashion Model";
  }, [currentModels, selectedModel]);

  const activePoseObj = useMemo(() => {
    return currentPoses?.find((p) => p.id === selectedCustomPose) || currentPoses?.[0];
  }, [currentPoses, selectedCustomPose]);

  const previewAsset = useMemo(() => {
    if (generated) return "/catalogue/brand_main.jpg";
    return activePoseObj?.img || activePoseObj?.imagePath || "/images/poses/women/front_view.jpg";
  }, [generated, activePoseObj]);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#f0f4f8' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">

        {/* ── Step 1: Audience ── */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
          <StepHeader number={1} title="Create Catalogue For" />
          <div className="flex flex-wrap gap-2.5">
            {AUDIENCES.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setAudience(a.id);
                  setGarmentType(a.id === "girls" ? "girl-sweatshirt" : GARMENTS[a.id][0].id);
                  if (a.id === "boys")       setSelectedCustomPose("boy-pose-01");
                  else if (a.id === "girls") setSelectedCustomPose("girl-pose-01");
                  else if (a.id === "men")   setSelectedCustomPose("men-pose-01");
                  else                       setSelectedCustomPose("front-view");
                  // Reset selectedModel to the correct default for this audience
                  // Using unique per-audience IDs prevents any cross-audience border bleed
                  if (a.id === "men")        setSelectedModel("jun");
                  else if (a.id === "boys")  setSelectedModel("boy-leo");
                  else if (a.id === "girls") setSelectedModel("girl-model-01");
                  else                       setSelectedModel("meera");
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 cursor-pointer ${
                  audience === a.id
                    ? "border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/80"
                }`}
              >
                <span>{a.label}</span>
                {audience === a.id && <Check size={13} className="text-blue-600" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 2: Garment Type ── */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
          {audience === "women" || audience === "men" || audience === "boys" || audience === "girls" ? (
            <GarmentSelector
              selectedId={garmentType}
              onSelect={setGarmentType}
              mode={mode}
              setMode={setMode}
              audience={audience}
            />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <StepHeader number={2} title="Select Your Garment Type" />
              </div>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Select the garment category</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
                  {GARMENTS[audience].map((g) => (
                    <SelectionCard
                      key={g.id}
                      img={g.img}
                      label={g.label}
                      sublabel={g.categoryLabel}
                      selected={garmentType === g.id}
                      onClick={() => setGarmentType(g.id)}
                      aspectClass="aspect-square"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Step 3: Upload ── */}
        {audience === "women" ? (
          <GarmentUploadStep
            garmentLabel={GARMENTS[audience].find(g => g.id === garmentType)?.label || "Saree"}
          />
        ) : audience === "boys" ? (
          <BoysUploadStep
            garmentLabel={GARMENTS[audience].find(g => g.id === garmentType)?.label || "Garment"}
            garmentId={garmentType}
          />
        ) : audience === "girls" ? (
          <GirlsUploadStep
            garmentLabel={GARMENTS[audience].find(g => g.id === garmentType)?.label || "Garment"}
            garmentId={garmentType}
          />
        ) : (
          /* ── Men / default: single-garment upload panel ── */
          <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
            {/* Numbered header */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Upload Your {GARMENTS[audience].find(g => g.id === garmentType)?.label || "Garment"} Image
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Upload a clean flat-lay garment photo for best results</p>
              </div>
            </div>

            {/* Two-column panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

              {/* LEFT — Upload Dropzone */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Upload Image</p>
                <UploadZone label="Click or drag &amp; drop your garment" />
              </div>

              {/* RIGHT — Quality Guide */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Quality Guide</p>
                <div className="grid grid-cols-2 gap-3">

                  {/* Good card */}
                  <div className="rounded-xl overflow-hidden border-2 border-emerald-300 bg-white shadow-sm">
                    <div className="relative">
                      <img
                        src="/images/studio/men_guide/good.jpg"
                        alt="Good input example"
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        <Check size={8} strokeWidth={3} />
                        Good
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-700 font-semibold text-center py-2 bg-emerald-50 border-t border-emerald-100">
                      Clean flat-lay, clear edges
                    </p>
                  </div>

                  {/* Avoid card */}
                  <div className="rounded-xl overflow-hidden border-2 border-red-300 bg-white shadow-sm">
                    <div className="relative">
                      <img
                        src="/images/studio/men_guide/bad.jpg"
                        alt="Bad input example"
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        <X size={8} strokeWidth={3} />
                        Avoid
                      </div>
                    </div>
                    <p className="text-[10px] text-red-600 font-semibold text-center py-2 bg-red-50 border-t border-red-100">
                      Wrinkled or poorly lit
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: AI Model ── */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  4
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Choose AI Model</h3>
              </div>
              <p className="text-xs text-slate-500 ml-8">
                Select the fashion model for your catalogue
              </p>
            </div>

            {/* "View All >" pill button aligned top-right of this section */}
            <button
              type="button"
              onClick={() => setModelModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-3.5 py-1.5 rounded-full border border-blue-200/70 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>View All</span>
              <ChevronRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* 10-Item Grid (5 columns x 2 rows, responsive to 2-3 cols on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {visibleModels.map((m) => {
              const isSelected = selectedModel === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModel(m.id)}
                  className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col items-center bg-white text-left p-2.5 ${
                    isSelected
                      ? "border-2 border-blue-600 ring-2 ring-blue-500/20 shadow-none bg-blue-50/10"
                      : "border-slate-200 hover:border-slate-300 shadow-none"
                  }`}
                  style={{ borderRadius: "12px" }}
                >
                  {/* Portrait photo container (square for men, boys & girls matching reference, 3:4 for others) */}
                  <div className={`w-full ${audience === "men" || audience === "boys" || audience === "girls" ? "aspect-square" : "aspect-[3/4]"} rounded-lg overflow-hidden bg-slate-50 relative flex items-center justify-center`}>
                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/hero_model_1.jpg";
                      }}
                    />

                    {/* Small circular badge, top-right corner of the image, blue background with white checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs z-10">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Model's first name in bold, centered, in a plain white strip below the photo */}
                  <div className="w-full pt-2 pb-0.5 text-center bg-white">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight truncate">
                      {m.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 5: Select Background ── */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
          {/* Header with numbered circle ⑤ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  5
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Select Background</h3>
              </div>
              <p className="text-xs text-slate-500 ml-8">
                Choose high-fashion interior or studio setting for your collection
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setBgModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-3.5 py-1.5 rounded-full border border-blue-200/70 transition-all cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight size={13} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => customBgInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200/80 transition-colors cursor-pointer"
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Upload Background</span>
              </button>
            </div>
          </div>

          {/* Hidden file input for custom background */}
          <input
            type="file"
            ref={customBgInputRef}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleCustomBgUpload}
          />

          {/* Custom Uploads row - single compact row when empty, with zero excess whitespace */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-700 tracking-tight">Custom Backgrounds</p>
              {customBackgrounds.length > 0 && (
                <span className="text-[11px] font-medium text-slate-400">
                  {customBackgrounds.length} uploaded
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {/* "Add Background" upload card */}
              <button
                type="button"
                onClick={() => customBgInputRef.current?.click()}
                className="w-[140px] h-[92px] shrink-0 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/80 hover:bg-blue-50/30 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 group-hover:border-blue-300 flex items-center justify-center text-slate-500 group-hover:text-blue-600 shadow-2xs transition-colors">
                  <Plus size={14} strokeWidth={2.5} />
                </div>
                <p className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                  Add Background
                </p>
                <p className="text-[9px] text-slate-400">JPG, PNG · Max 10MB</p>
              </button>

              {/* Uploaded custom backgrounds */}
              {customBackgrounds.map((bg) => {
                const isSelected = selectedBg === bg.id;
                return (
                  <div key={bg.id} className="relative group shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedBg(bg.id)}
                      className={`w-[140px] h-[92px] rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer flex flex-col text-left bg-white ${
                        isSelected
                          ? "border-2 border-blue-600 ring-2 ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-full h-[62px] bg-slate-100 overflow-hidden relative">
                        <img src={bg.img} alt={bg.label} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div className="w-full py-1 px-1.5 bg-white text-center">
                        <p className="text-[11px] font-bold text-slate-800 truncate">{bg.label}</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomBackgrounds((prev) => prev.filter((item) => item.id !== bg.id));
                        if (selectedBg === bg.id) setSelectedBg("natural-limestone-wall");
                      }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 shadow-xs"
                      title="Remove"
                    >
                      <X size={10} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Studio Backgrounds Header */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700 tracking-tight">Studio Backgrounds</p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-medium">{BACKGROUNDS.length} options</span>
              <button
                type="button"
                onClick={() => setBgModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight size={13} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* 10-Item Grid (5 columns x 2 rows, responsive to 2-3 cols on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
            {visibleBackgrounds.map((b) => {
              const isSelected = selectedBg === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBg(b.id)}
                  className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col bg-white text-left overflow-hidden ${
                    isSelected
                      ? "border-2 border-blue-600 ring-2 ring-blue-500/20 shadow-none bg-blue-50/10"
                      : "border-slate-200 hover:border-slate-300 shadow-none"
                  }`}
                  style={{ borderRadius: "12px" }}
                >
                  {/* Photo container */}
                  <div className="w-full aspect-[4/3] overflow-hidden bg-slate-100 relative">
                    <img
                      src={b.img}
                      alt={b.label}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/catalogue/brand_flatlay.jpg";
                      }}
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs z-10">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Name in Title Case centered in plain white strip below photo */}
                  <div className="w-full py-2.5 px-1.5 text-center bg-white">
                    <p className="text-xs sm:text-[12px] font-bold text-slate-800 tracking-tight truncate">
                      {b.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 6: Choose Pose (Dynamic Saree Drape collection for Saree garments) ── */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
          <PoseSelector
            selectedGarment={garmentType}
            selectedPose={selectedCustomPose}
            onSelectPose={setSelectedCustomPose}
            onViewAll={() => setPoseModalOpen(true)}
            audience={audience}
            customPoses={currentPoses}
          />
        </div>

        {/* ── Step 7: Publishing Platform (Left) & Catalogue Preview (Right Beside It) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Publishing Platform Selection Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  7
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Publishing Platform</h3>
              </div>
              <p className="text-xs text-slate-500 ml-8 mb-4">
                Select your retail or e-commerce destination
              </p>

              <PlatformSelector
                selectedPlatform={platform}
                onSelectPlatform={setPlatform}
                gridClassName="grid grid-cols-2 gap-2.5"
              />
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-blue-600" />
                <span>Auto-calibrated for store</span>
              </span>
              <span className="font-bold text-blue-600 uppercase text-[10px] tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                {platform} Ready
              </span>
            </div>
          </div>

          {/* Right: Dedicated Catalogue Preview Card (Beside Publishing Platform) */}
          <div className="lg:col-span-7 flex flex-col">
            <PlatformPreview
              platform={platform}
              previewImage={previewAsset}
              garmentLabel={currentGarmentLabel}
              modelName={currentModelName}
              generating={generating}
              generated={generated}
              ratio={ratio}
              resolution={resolution}
            />
          </div>
        </div>

        {/* ── Step 8: Aspect Ratio ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <StepHeader number={8} title="Aspect Ratio" />
          <div className="flex flex-wrap gap-3">
            {RATIOS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRatio(r.id)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 text-sm transition-all min-w-[80px] ${
                  ratio === r.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-100 hover:border-blue-200"
                }`}
              >
                <span className={`text-sm font-bold ${ratio === r.id ? "text-blue-600" : "text-slate-700"}`}>{r.label}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">{r.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 9: Resolution + Generate ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <StepHeader number={9} title="Output Resolution" />
          <div className="flex gap-3 mb-6">
            {[
              { id: "2K", label: "2K", credits: 10 },
              { id: "4K", label: "4K", credits: 20 },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setResolution(r.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                  resolution === r.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-100 text-slate-600 hover:border-blue-200"
                }`}
              >
                {r.id === "4K" && <Star size={13} className={resolution === "4K" ? "text-blue-600" : "text-slate-400"} />}
                {r.label}
                <span className={`text-[10px] font-medium ${resolution === r.id ? "text-blue-600" : "text-slate-400"}`}>
                  {r.credits} credits
                </span>
              </button>
            ))}
          </div>

          {/* Summary bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 mb-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold text-slate-700">
                <span className="text-blue-600">{credits} Credits</span> required
              </p>
              <p className="text-xs text-slate-400">You have 100 credits · {Math.floor(100 / credits)} generation{Math.floor(100 / credits) !== 1 ? "s" : ""}</p>
            </div>
            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
              <p className="text-xs text-slate-400">Estimated time</p>
              <p className="text-sm font-bold text-slate-700">~25 seconds</p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            <Sparkles size={18} />
            {generating ? "Generating…" : "✨ Generate Catalogue"}
            {!generating && <ArrowRight size={16} />}
          </button>
        </div>

        {/* ── Step 11: Preview / Empty State ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {generated ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6"
              >
                <p className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-blue-600" /> Your Catalogue is Ready
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["/catalogue/brand_main.jpg", "/catalogue/lookbook_main.jpg", "/catalogue/social_main.jpg"].map((src, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-[3/4] bg-slate-100">
                      <img src={src} alt={`result-${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 px-8 text-center"
              >
                {/* 3D folder illustration */}
                <div className="relative w-24 h-24 mb-6">
                  <div className="w-24 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border-2 border-blue-200/60 absolute bottom-0" />
                  <div className="w-16 h-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-t-xl absolute top-0 left-0 border-2 border-t border-blue-200/60" />
                  <div className="absolute -top-3 right-0 w-14 h-16 bg-white border-2 border-slate-200 rounded-xl shadow-md flex items-center justify-center rotate-6">
                    <ImageIcon size={20} className="text-slate-300" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">Turn garments into catalogue‑ready visuals</h3>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
                  Upload a garment, choose your preferred style, and generate professional catalogue images in just a few clicks.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Studio quality output", "Multiple model options", "Ready for ecommerce"].map((feat) => (
                    <span key={feat} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                      <Check size={11} strokeWidth={3} className="text-emerald-500" />
                      {feat}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Model Picker Modal */}
      <ModelPickerModal
        isOpen={modelModalOpen}
        selected={selectedModel}
        onSelect={setSelectedModel}
        onClose={() => setModelModalOpen(false)}
        audience={audience}
      />

      {/* Background Picker Modal */}
      <BackgroundPickerModal
        isOpen={bgModalOpen}
        selected={selectedBg}
        onSelect={setSelectedBg}
        onClose={() => setBgModalOpen(false)}
        backgrounds={BACKGROUNDS}
      />

      {/* Pose Picker Modal */}
      <PosePickerModal
        isOpen={poseModalOpen}
        selected={selectedCustomPose}
        onSelect={setSelectedCustomPose}
        onClose={() => setPoseModalOpen(false)}
        poses={currentPoses}
      />
    </div>
  );
}
