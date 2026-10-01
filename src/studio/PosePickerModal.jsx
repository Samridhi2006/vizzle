import { useState, useMemo } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { POSE_CATEGORIES } from "../data/poses";

export default function PosePickerModal({ isOpen, selected, onSelect, onClose, poses = [] }) {
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredPoses = useMemo(() => {
    return poses.filter((p) => {
      if (filterCategory !== "all" && p.category !== filterCategory) return false;
      return true;
    });
  }, [poses, filterCategory]);

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
          className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden z-10"
        >
          {/* Fixed Sticky Header & Category Filter Pills */}
          <div className="flex flex-col border-b border-slate-100 bg-white shrink-0 z-10">
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                All Poses
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

            {/* Category Filter Pill Row */}
            <div className="px-6 sm:px-8 pb-4.5 pt-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {POSE_CATEGORIES.map((cat) => {
                const isActive = filterCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilterCategory(cat.id)}
                    className={`rounded-full px-4 py-1.5 text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "border border-blue-600 bg-blue-600 text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6-Column Scrollable Grid */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {filteredPoses.map((p) => {
                const isSelected = selected === p.id;
                const poseName = p.name || p.label;
                const poseImg = p.imagePath || p.img;
                const poseSub = p.sublabel || "Catalogue pose";

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelect(p.id)}
                    className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col items-center bg-white text-left p-2.5 ${
                      isSelected
                        ? "border-2 border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-500/20"
                        : "border border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                    style={{ borderRadius: "12px" }}
                  >
                    {/* Full-body Portrait Photo */}
                    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 relative flex items-center justify-center">
                      <img
                        src={poseImg}
                        alt={poseName}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/hero_model_1.jpg";
                        }}
                      />

                      {/* Small circular blue badge, top-right corner of the image */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Pose name & descriptor in plain white strip below photo */}
                    <div className="w-full pt-2 pb-0.5 text-center bg-white">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight truncate">
                        {poseName}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal truncate mt-0.5">
                        {poseSub}
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
