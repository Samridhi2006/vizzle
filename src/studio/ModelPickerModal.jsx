import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AI_MODELS } from "../data/aiModels";
import { MEN_AI_MODELS } from "../data/menAiModels";
import { BOYS_AI_MODELS } from "../data/boysAiModels";
import { GIRLS_AI_MODELS } from "../data/girlsAiModels";

export default function ModelPickerModal({ isOpen, selected, onSelect, onClose, audience = "women" }) {
  const models =
    audience === "boys"  ? BOYS_AI_MODELS  :
    audience === "men"   ? MEN_AI_MODELS   :
    audience === "girls" ? GIRLS_AI_MODELS :
    AI_MODELS;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Light gray backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden z-10"
        >
          {/* Fixed Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              All AI Models
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* 5-Column Scrollable Grid */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-4.5">
              {models.map((m) => {
                const isSelected = selected === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelect(m.id)}
                    className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col items-center bg-white text-left p-2.5 ${
                      isSelected
                        ? "border-[2.5px] border-[#e91e63] shadow-sm ring-1 ring-[#e91e63]/20"
                        : "border border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                    style={{ borderRadius: "12px" }}
                  >
                    {/* Portrait Photo (3:4 aspect ratio, head-to-mid-chest crop) */}
                    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 relative flex items-center justify-center">
                      <img
                        src={m.img}
                        alt={m.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = audience === "men" ? "/garments/men/suit.jpg" : "/hero_model_1.jpg";
                        }}
                      />

                      {/* Small circular badge, top-right corner of the image */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#e91e63] text-white flex items-center justify-center shadow-md z-10">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Model First Name in Bold Centered in White Strip */}
                    <div className="w-full pt-2.5 pb-1 text-center bg-white">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight truncate">
                        {m.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
