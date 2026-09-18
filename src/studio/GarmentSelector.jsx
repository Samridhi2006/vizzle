import { useState, useMemo } from 'react';
import { Check, Sparkles, ChevronRight, Grid } from 'lucide-react';
import { WOMEN_GARMENTS, GARMENT_CATEGORIES, POPULAR_GARMENT_IDS } from '../data/womenGarments';
import GarmentSelectorModal from './GarmentSelectorModal';

export default function GarmentSelector({ selectedId, onSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Find currently selected garment
  const selectedGarment = useMemo(() => {
    return WOMEN_GARMENTS.find((g) => g.id === selectedId) || WOMEN_GARMENTS[0];
  }, [selectedId]);

  // Main Dashboard Preview Grid:
  // Shows 5 or 10 curated popular garments in a clean 5-column grid.
  // If the user selects a garment not in the popular list, ensure it appears in the grid.
  const previewGarments = useMemo(() => {
    let list = [];
    if (activeCategory === 'all') {
      // Top 10 popular garments
      list = WOMEN_GARMENTS.filter((g) => POPULAR_GARMENT_IDS.includes(g.id));
    } else {
      // First 5-10 garments of selected category
      list = WOMEN_GARMENTS.filter((g) => g.category === activeCategory).slice(0, 10);
    }

    // If current selected garment isn't in preview, prepend or include it
    if (selectedGarment && !list.some((g) => g.id === selectedGarment.id)) {
      list = [selectedGarment, ...list.slice(0, 9)];
    }

    return list;
  }, [activeCategory, selectedGarment]);

  return (
    <div className="space-y-3.5">
      {/* ── Top Bar: Single Row Categories & "View All" Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        {/* Single-Row Clean Category Pills (No overflow scrollbar) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {GARMENT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* View All Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100/80 px-3 py-1 rounded-lg border border-pink-200/70 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Grid size={12} />
          <span>View All (38)</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* ── 5-Column Clean Product Tile Grid (Reference: AI Vastra style) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-4.5">
        {previewGarments.map((garment) => {
          const isSelected = selectedId === garment.id;
          return (
            <button
              key={garment.id}
              type="button"
              onClick={() => onSelect(garment.id)}
              className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center bg-[#FAFAFC] hover:bg-white text-left ${
                isSelected
                  ? 'border-pink-500 ring-2 ring-pink-500/20 shadow-md bg-white'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Product image container with clean white background and padding */}
              <div className="w-full aspect-square rounded-xl bg-white flex items-center justify-center p-3.5 overflow-hidden">
                <img
                  src={garment.img}
                  alt={garment.label}
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/garments/women/saree.jpg';
                  }}
                />
              </div>

              {/* Selected checkmark badge top-right */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs">
                  <Check size={11} strokeWidth={3} />
                </div>
              )}

              {/* Garment label in plain area BELOW the image (no overlay text, no dark gradient) */}
              <div className="w-full pt-2 pb-2.5 px-2.5 text-center">
                <p className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight truncate">
                  {garment.label}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate capitalize mt-0.5">
                  {garment.categoryLabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Full Catalog Modal ── */}
      <GarmentSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </div>
  );
}
