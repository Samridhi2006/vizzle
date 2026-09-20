import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search, X, Sparkles } from 'lucide-react';
import { WOMEN_GARMENTS, GARMENT_CATEGORIES } from '../data/womenGarments';

export default function GarmentSelectorModal({ isOpen, onClose, selectedId, onSelect }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGarments = useMemo(() => {
    return WOMEN_GARMENTS.filter((g) => {
      if (activeCategory !== 'all' && g.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesLabel = g.label.toLowerCase().includes(q);
        const matchesDesc = g.description.toLowerCase().includes(q);
        const matchesTags = g.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesLabel && !matchesDesc && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Select Your Garment Type
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full">
                  38 Styles
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Browse our complete studio catalog of women's flat-lays and 3D drapes
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Controls Bar: Single Row Categories & Search */}
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            {/* Single Row Categories (no overflow scrollbar) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {GARMENT_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/70'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Garments Grid: 5 Columns with padded product tiles */}
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
            {filteredGarments.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm font-semibold text-slate-700">No garments found</p>
                <p className="text-xs text-slate-400 mt-1">Try changing your search query or category</p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredGarments.map((garment) => {
                  const isSelected = selectedId === garment.id;
                  return (
                    <button
                      key={garment.id}
                      type="button"
                      onClick={() => {
                        onSelect(garment.id);
                        onClose();
                      }}
                      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center bg-[#FAFAFC] hover:bg-white text-left ${
                        isSelected
                          ? 'border-2 border-blue-600 ring-2 ring-blue-100 shadow-md shadow-blue-500/20 bg-white'
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
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}

                      {/* Label in plain area BELOW the image (no overlay) */}
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
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 text-xs text-slate-500">
            <span>Showing {filteredGarments.length} garments</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
