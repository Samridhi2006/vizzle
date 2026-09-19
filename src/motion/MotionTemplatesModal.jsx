// src/motion/MotionTemplatesModal.jsx
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOTION_TEMPLATES } from "../data/motionTemplatesData";
import MotionPreviewCard from "./MotionPreviewCard";

export default function MotionTemplatesModal({ isOpen, selected, onSelect, onClose }) {
  if (!isOpen) return null;
  const selectedTemplate = MOTION_TEMPLATES.find(t => t.id === selected);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
          <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">All motion templates</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {MOTION_TEMPLATES.length} cinematic presets — hover to preview, click to select
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

          {/* Grid */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {MOTION_TEMPLATES.map((t) => (
                <MotionPreviewCard
                  key={t.id}
                  template={t}
                  isSelected={selected === t.id}
                  onSelect={(id) => onSelect(id)}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between flex-shrink-0">
            <p className="text-xs text-slate-500">
              Selected:{" "}
              <span className="font-bold text-blue-700">
                {selectedTemplate?.title || "None"}
              </span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
            >
              Apply Template
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
