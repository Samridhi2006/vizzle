"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CATEGORY_PILL_COLORS } from "@/data/motionTemplatesData";

export interface MotionTemplate {
  id: string;
  title: string;
  category: string;
  badgeColor?: string;
  posterImage: string;
  previewVideoUrl?: string;
  duration: number;
  panDir?: string;
}

interface MotionPreviewCardProps {
  template: MotionTemplate;
  isSelected: boolean;
  onSelect: (id: string) => void;
  size?: "small" | "medium" | "large";
}

export default function MotionPreviewCard({
  template,
  isSelected,
  onSelect,
  size = "medium",
}: MotionPreviewCardProps) {
  const [hovered, setHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const { id, title, category, posterImage, previewVideoUrl, duration } = template;
  const hasVideo = !!previewVideoUrl && !videoError;
  const pillColor =
    (CATEGORY_PILL_COLORS as Record<string, string>)[category] ||
    "bg-slate-100 text-slate-600";

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition:
          "transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s, border-color 0.15s",
      }}
      className={`relative rounded-xl overflow-hidden cursor-pointer group text-left w-full
        ${
          isSelected
            ? "border-2 border-blue-600 shadow-md shadow-blue-500/20 scale-[1.03] motion-selected-glow-blue"
            : hovered
            ? "border-2 border-blue-400/60 shadow-sm scale-[1.01]"
            : "border border-slate-200"
        }`}
    >
      {/* Video / Poster area */}
      <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
        {/* Auto-playing looping video — NO center play button overlay */}
        {hasVideo ? (
          <video
            src={previewVideoUrl}
            poster={posterImage}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Fallback: poster image with Ken Burns animation */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterImage}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover ${
              hovered || isSelected
                ? template.panDir === "up"
                  ? "motion-pan-up"
                  : "motion-pan-down"
                : ""
            }`}
            draggable={false}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />

        {/* Scan-line shimmer */}
        {(hovered || isSelected) && (
          <div className="motion-scan absolute inset-0 pointer-events-none" />
        )}

        {/* Top-left: category pill */}
        <div
          className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm z-10 ${pillColor}`}
        >
          {category}
        </div>

        {/* Top-right: selected checkmark badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-md z-10 border border-white/40">
            <Check size={11} strokeWidth={3} className="text-white" />
          </div>
        )}

        {/* Bottom-left: duration badge */}
        <div className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/55 text-white backdrop-blur-sm z-10">
          {duration}s
        </div>

        {/* Bottom glow line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-200 z-10
          ${
            isSelected
              ? "opacity-100 bg-gradient-to-r from-transparent via-blue-600 to-transparent"
              : hovered
              ? "opacity-100 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              : "opacity-0"
          }`}
        />
      </div>

      {/* Label strip */}
      <div
        className={`px-2.5 py-2 border-t transition-colors duration-150
        ${
          isSelected
            ? "bg-blue-50/80 border-blue-200"
            : hovered
            ? "bg-blue-50/50 border-blue-100"
            : "bg-white border-slate-100"
        }`}
      >
        <p
          className={`text-[11px] font-semibold truncate text-center leading-tight transition-colors
          ${isSelected || hovered ? "text-blue-700" : "text-slate-700"}`}
        >
          {title}
        </p>
      </div>
    </button>
  );
}
