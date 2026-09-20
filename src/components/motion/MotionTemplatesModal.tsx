"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOTION_TEMPLATES } from "@/data/motionTemplatesData";
import MotionPreviewCard, { MotionTemplate } from "./MotionPreviewCard";

interface MotionTemplatesModalProps {
  isOpen: boolean;
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

const CATEGORIES = ["All", "Runway & Fashion", "Indian & Ethnic", "Lifestyle", "Dramatic"];

export default function MotionTemplatesModal({
  isOpen,
  selected,
  onSelect,
  onClose,
}: MotionTemplatesModalProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const selectedTemplate = (MOTION_TEMPLATES as MotionTemplate[]).find(
    (t) => t.id === selected
  );

  const filteredTemplates = (MOTION_TEMPLATES as MotionTemplate[]).filter((t) => {
    const matchesCategory =
      activeCategory === "All" || t.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-4xl flex flex-col overflow-hidden z-10"
          style={{ maxHeight: "90vh" }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">All Motion Templates</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {MOTION_TEMPLATES.length} cinematic motion presets — hover to preview, click to select
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Filters Bar */}
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search presets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="p-6 overflow-y-auto flex-1">
            {filteredTemplates.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-medium">
                No templates found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredTemplates.map((t) => (
                  <MotionPreviewCard
                    key={t.id}
                    template={t}
                    isSelected={selected === t.id}
                    onSelect={(id) => onSelect(id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
            <p className="text-xs text-slate-500">
              Selected:{" "}
              <span className="font-bold text-blue-700">
                {selectedTemplate?.title || "None"}
              </span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
            >
              Apply Template
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
