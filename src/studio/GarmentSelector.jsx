import { useState, useMemo } from 'react';
import { Check, LayoutGrid } from 'lucide-react';
import { WOMEN_GARMENTS, POPULAR_GARMENT_IDS } from '../data/womenGarments';
import { MEN_GARMENTS, MEN_POPULAR_IDS } from '../data/menGarments';
import { BOYS_GARMENTS, BOYS_POPULAR_IDS } from '../data/boysGarments';
import { GIRLS_GARMENTS, GIRLS_POPULAR_IDS } from '../data/girlsGarments';
import GarmentSelectorModal from './GarmentSelectorModal';

export default function GarmentSelector({
  selectedId,
  onSelect,
  mode = 'single',
  setMode,
  audience = 'women',
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMen = audience === 'men';
  const isBoys = audience === 'boys';
  const isGirls = audience === 'girls';
  const allGarments = isGirls ? GIRLS_GARMENTS : isBoys ? BOYS_GARMENTS : isMen ? MEN_GARMENTS : WOMEN_GARMENTS;
  const popularIds = isGirls ? GIRLS_POPULAR_IDS : isBoys ? BOYS_POPULAR_IDS : isMen ? MEN_POPULAR_IDS : POPULAR_GARMENT_IDS;
  const fallbackImg = isGirls ? '/garments/girls/sweatshirt.png' : isBoys ? '/garments/boys/sweatshirt.png' : isMen ? '/garments/men/full_sleeve_shirt.png' : '/garments/women-picker/saree.jpg';

  const selectedBorderClass = isMen
    ? 'border-2 border-[#e11d74] ring-2 ring-[#e11d74]/20 shadow-none bg-pink-50/10'
    : 'border-2 border-blue-600 ring-2 ring-blue-500/20 shadow-none bg-blue-50/10';
  const selectedBadgeClass = isMen ? 'bg-[#e11d74]' : 'bg-blue-600';

  // Initial 10 visible garments matching Screenshots:
  // If the user selected a garment not in the top 10, keep it visible in the 10 cards
  const visibleGarments = useMemo(() => {
    const top10 = popularIds
      .map((id) => allGarments.find((g) => g.id === id))
      .filter(Boolean);

    const isInTop10 = top10.some((g) => g.id === selectedId);
    if (isInTop10 || !selectedId) return top10;

    const selectedObj = allGarments.find((g) => g.id === selectedId);
    if (!selectedObj) return top10;

    return [...top10.slice(0, 9), selectedObj];
  }, [allGarments, popularIds, selectedId]);

  return (
    <div>
      {/* ── Header with Number 2, Title, Subtitle, and "View All" button ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              2
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Select Your Garment Type
            </h3>
          </div>
          <p className="text-xs text-slate-500 ml-8">
            Choose the garment category for your catalogue
          </p>
        </div>

        {/* View All Button with 4-square grid icon matching reference */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-100/70 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg border border-blue-200/70 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <LayoutGrid size={14} />
          <span>View All</span>
        </button>
      </div>

      {/* ── Single / Batch Toggle Pills directly under Title ── */}
      {setMode && (
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-full mb-4 ml-8">
          {['single', 'batch'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-4 py-1 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                mode === m
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* ── 5-Column by 2-Row Grid (Exactly 10 Items matching Screenshot) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
        {visibleGarments.map((garment) => {
          const isSelected = selectedId === garment.id;
          return (
            <button
              key={garment.id}
              type="button"
              onClick={() => onSelect(garment.id)}
              className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col bg-white text-left overflow-hidden ${
                isSelected
                  ? selectedBorderClass
                  : 'border-slate-200 hover:border-slate-300 shadow-none'
              }`}
              style={{ borderRadius: '12px' }}
            >
              {/* Product image container with clean soft grey background */}
              <div className="w-full aspect-square bg-slate-50/70 flex items-center justify-center p-3 sm:p-4 overflow-hidden relative">
                <img
                  src={garment.img}
                  alt={garment.label}
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImg;
                  }}
                />

                {/* Selected checkmark badge top-right */}
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${selectedBadgeClass} text-white flex items-center justify-center shadow-xs z-10`}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Garment label in plain white area below the image */}
              <div className="w-full py-2.5 px-2 text-center bg-white">
                <p className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight truncate">
                  {garment.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Full Catalog Modal matching Screenshot 1 & 2 ── */}
      <GarmentSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedId={selectedId}
        onSelect={onSelect}
        audience={audience}
      />
    </div>
  );
}
