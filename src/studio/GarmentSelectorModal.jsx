import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { WOMEN_GARMENTS } from '../data/womenGarments';
import { MEN_GARMENTS } from '../data/menGarments';
import { BOYS_GARMENTS } from '../data/boysGarments';
import { GIRLS_GARMENTS } from '../data/girlsGarments';

export default function GarmentSelectorModal({ isOpen, onClose, selectedId, onSelect, audience = 'women' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMen = audience === 'men';
  const isBoys = audience === 'boys';
  const isGirls = audience === 'girls';
  const garments = isGirls ? GIRLS_GARMENTS : isBoys ? BOYS_GARMENTS : isMen ? MEN_GARMENTS : WOMEN_GARMENTS;
  const title = isGirls ? "All Girls' Garments" : isBoys ? "All Boys' Garments" : isMen ? 'Select Your Garment Type' : "All Women's Garments";
  const fallbackImg = isGirls ? '/garments/girls/sweatshirt.png' : isBoys ? '/garments/boys/sweatshirt.png' : isMen ? '/garments/men/full_sleeve_shirt.png' : '/garments/women-picker/saree.jpg';
  const selectedBorderClass = isMen
    ? 'border-2 border-[#e11d74] bg-pink-50/20 ring-2 ring-[#e11d74]/20 shadow-xs'
    : 'border-2 border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-xs';
  const selectedBadgeClass = isMen ? 'bg-[#e11d74]' : 'bg-blue-600';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col z-10"
        >
          {/* Header matching Screenshot 1 & 2 */}
          <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {title}
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

          {/* 5-Column Scrollable Grid matching Screenshots */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {garments.map((garment) => {
                const isSelected = selectedId === garment.id;
                return (
                  <button
                    key={garment.id}
                    type="button"
                    onClick={() => {
                      onSelect(garment.id);
                      onClose();
                    }}
                    className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col bg-white text-left overflow-hidden ${
                      isSelected
                        ? selectedBorderClass
                        : 'border-slate-200 hover:border-slate-300 shadow-none hover:shadow-xs'
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
