import { useState, useMemo, useEffect } from "react";
import { X, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BACKGROUNDS } from "../data/backgrounds";

export default function BackgroundPickerModal({
  isOpen,
  selected,
  onSelect,
  onClose,
  backgrounds = BACKGROUNDS,
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    backgrounds.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["all", ...Array.from(set)];
  }, [backgrounds]);

  // Filtered backgrounds based on search and category
  const filteredBackgrounds = useMemo(() => {
    return backgrounds.filter((b) => {
      const matchesCategory =
        selectedCategory === "all" || b.category === selectedCategory;
      const matchesSearch =
        !search.trim() ||
        b.label.toLowerCase().includes(search.toLowerCase()) ||
        (b.category && b.category.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [backgrounds, selectedCategory, search]);

  if (!isOpen) return null;

  const currentSelectedBg = backgrounds.find((b) => b.id === selected);

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
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                All Studio Backgrounds
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose from {backgrounds.length} high-fashion interior and studio settings
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="px-6 sm:px-8 py-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search backgrounds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Category Filter Pills (scrollable) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat === "all" ? "All Settings" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* 5-Column Scrollable Grid */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            {filteredBackgrounds.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No backgrounds match your search.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {filteredBackgrounds.map((b) => {
                  const isSelected = selected === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => onSelect(b.id)}
                      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col bg-white text-left overflow-hidden ${
                        isSelected
                          ? "border-2 border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 shadow-none hover:shadow-xs"
                      }`}
                      style={{ borderRadius: "12px" }}
                    >
                      {/* Photo Container */}
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

                        {/* Unified Vizzle Brand Blue Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs z-10">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* Label in Title Case centered in plain white strip below photo */}
                      <div className="w-full py-2.5 px-2 text-center bg-white">
                        <p className="text-xs sm:text-[12px] font-bold text-slate-800 tracking-tight truncate">
                          {b.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer with Active Selection and Done Button */}
          <div className="px-6 sm:px-8 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-600">
              Selected:{" "}
              <span className="font-bold text-slate-900">
                {currentSelectedBg?.label || "None"}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
