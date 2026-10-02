import React, { useMemo } from "react";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { sareeSpecificPoses, isSareeGarment } from "../data/sareePoses";
import { WOMEN_POSES, MEN_POSES, BOYS_POSES, GIRLS_POSES } from "../data/poses";

/**
 * PoseSelector component for Vizzle Studio
 * - Automatically switches to specialized Saree Drape collection for saree garments
 * - Renders exactly 10 catalogue poses in a clean 5-column x 2-row grid, with all remaining poses in "View All"
 * - Brand Blue highlight, glow, checkmark badges, and full-screen modal integration
 */
export default function PoseSelector({
  selectedGarment,
  selectedPose,
  onSelectPose,
  onViewAll,
  audience = "women",
  customPoses = null,
}) {
  // 1. Conditional Garment Detection Logic
  const isSaree = useMemo(() => {
    if (audience !== "women") return false;
    return isSareeGarment(selectedGarment);
  }, [selectedGarment, audience]);

  // Determine active pose collection
  const availablePoses = useMemo(() => {
    if (isSaree) {
      return sareeSpecificPoses;
    }
    if (customPoses && customPoses.length > 0) {
      return customPoses;
    }
    if (audience === "men") return MEN_POSES;
    if (audience === "boys") return BOYS_POSES;
    if (audience === "girls") return GIRLS_POSES;
    return WOMEN_POSES;
  }, [isSaree, customPoses, audience]);

  // Render exactly 10 photos in the default grid (5 columns x 2 rows), rest in "View All".
  // If the user selected a pose from "View All" beyond the top 10, keep it visible in the 10-card view.
  const displayPoses = useMemo(() => {
    if (isSaree) return availablePoses;
    const top10 = availablePoses.slice(0, 10);
    const inTop10 = top10.some((p) => p.id === selectedPose);
    if (inTop10 || !selectedPose) return top10;
    const selectedObj = availablePoses.find((p) => p.id === selectedPose);
    if (!selectedObj) return top10;
    return [...top10.slice(0, 9), selectedObj];
  }, [availablePoses, isSaree, selectedPose]);

  return (
    <div>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              6
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Choose Pose</span>
              {isSaree && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
                  <Sparkles size={11} className="text-blue-600" />
                  Saree Drape Collection
                </span>
              )}
            </h3>
          </div>
          <p className="text-xs text-slate-500 ml-8">
            {isSaree
              ? "Specialized traditional and contemporary saree drape poses showcasing pallu flow and silhouette"
              : `Select catalogue pose for your ${audience === "men" ? "men's" : audience === "boys" ? "boys'" : audience === "girls" ? "girls'" : "women's"} collection`}
          </p>
        </div>

        {/* "View All" link aligned top-right of this section */}
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200/70 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>View All</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Grid of exactly 10 cards (5 columns x 2 rows) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-0.5">
        {displayPoses.map((pose) => {
          const isSelected = selectedPose === pose.id;
          const poseName = pose.name || pose.label;
          const poseImg = pose.imagePath || pose.img;
          const poseSublabel = pose.sublabel || (isSaree ? "Saree drape" : "Catalog pose");

          return (
            <button
              key={pose.id}
              type="button"
              onClick={() => onSelectPose(pose.id)}
              className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center bg-white p-2 overflow-hidden text-left ${
                isSelected
                  ? "border-2 border-blue-600 bg-blue-50/20 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20"
                  : "border border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              {/* Professional model preview image container (aspect 3/4) */}
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 relative flex items-center justify-center">
                <img
                  src={poseImg}
                  alt={poseName}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/hero_model_1.jpg";
                  }}
                />

                {/* Vizzle Brand Blue selection badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Pose name & descriptor in clean white strip */}
              <div className="w-full pt-2 pb-0.5 text-center bg-white">
                <p className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight truncate">
                  {poseName}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  {poseSublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
