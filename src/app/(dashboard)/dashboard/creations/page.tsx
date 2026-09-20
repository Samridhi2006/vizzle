"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  ShoppingBag,
  Tag,
  Calendar,
  ChevronDown,
  Sparkles,
  Download,
  Eye,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
} from "lucide-react";

interface CatalogItem {
  id: string;
  image: string;
  garment: string;
  segment: string;
  platform: string;
  date: string;
}

const MOCK_ITEMS: CatalogItem[] = [];

const FILTER_CONFIGS = [
  {
    id: "segment",
    icon: User,
    label: "All Segments",
    options: ["All Segments", "Women", "Men", "Boy", "Girl"],
  },
  {
    id: "platform",
    icon: ShoppingBag,
    label: "All Platforms",
    options: ["All Platforms", "Amazon", "Flipkart", "Myntra", "Shopify", "Ajio", "Meesho"],
  },
  {
    id: "garment",
    icon: Tag,
    label: "All Garment Types",
    options: [
      "All Garment Types",
      "Saree",
      "Kurti",
      "Crop Top",
      "Suit",
      "Hoodie",
      "Jacket",
      "Dress",
      "Lehenga",
    ],
  },
  {
    id: "date",
    icon: Calendar,
    label: "Date",
    options: ["Newest First", "Oldest First", "Last 7 Days", "Last 30 Days"],
  },
];

/* ============================================================
   Filter Dropdown
   ============================================================ */
function FilterDropdown({
  config,
  value,
  onChange,
}: {
  config: (typeof FILTER_CONFIGS)[0];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = config.icon;
  const isActive = value !== config.options[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap cursor-pointer
          ${
            isActive
              ? "border-blue-300 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        <Icon size={14} className={isActive ? "text-blue-500" : "text-slate-400"} />
        {value}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-1.5 left-0 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 w-48 z-30"
          >
            {config.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer
                  ${
                    value === opt
                      ? "text-blue-600 bg-blue-50/70"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {opt}
                {value === opt && <Check size={12} strokeWidth={3} className="text-blue-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   Catalog Card
   ============================================================ */
function CatalogCard({ item }: { item: CatalogItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.garment} className="w-full h-full object-cover" />

        <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200/60 shadow-sm">
          {item.platform}
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2"
            >
              <button
                className="w-9 h-9 rounded-xl bg-white/95 flex items-center justify-center hover:bg-white shadow-md transition-all hover:scale-110 cursor-pointer"
                title="Download HD"
              >
                <Download size={15} className="text-slate-800" />
              </button>
              <button
                className="w-9 h-9 rounded-xl bg-white/95 flex items-center justify-center hover:bg-white shadow-md transition-all hover:scale-110 cursor-pointer"
                title="Preview"
              >
                <Eye size={15} className="text-slate-800" />
              </button>
              <button
                className="w-9 h-9 rounded-xl bg-red-500/90 flex items-center justify-center hover:bg-red-600 shadow-md transition-all hover:scale-110 cursor-pointer"
                title="Delete"
              >
                <Trash2 size={15} className="text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-3 py-2.5 border-t border-slate-100">
        <p className="text-[11px] font-bold text-slate-800 truncate">{item.garment}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {item.segment} • {item.date}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   Empty State
   ============================================================ */
function EmptyState() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto"
    >
      <div className="relative mb-7">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-600 blur-2xl opacity-20 scale-125 animate-pulse" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/80 flex items-center justify-center shadow-sm">
          <ImageIcon size={32} className="text-blue-500" strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
        No Clothing Generated Yet
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">
        Generate your first AI catalogue or motion video in the Studio to get started. Your creations
        will appear here.
      </p>

      <motion.button
        type="button"
        onClick={() => router.push("/dashboard/studio")}
        whileHover={{ scale: 1.03, boxShadow: "0 12px 32px rgba(37,99,235,0.25)" }}
        whileTap={{ scale: 0.97 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
      >
        <Sparkles size={16} strokeWidth={2} />
        Get Started in Studio
      </motion.button>
    </motion.div>
  );
}

/* ============================================================
   Main Page
   ============================================================ */
export default function CreationsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({
    segment: "All Segments",
    platform: "All Platforms",
    garment: "All Garment Types",
    date: "Newest First",
  });

  const setFilter = (id: string, val: string) =>
    setFilters((f) => ({ ...f, [id]: val }));

  const filtered = MOCK_ITEMS.filter((item) => {
    if (search && !item.garment.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.segment !== "All Segments" && item.segment !== filters.segment) return false;
    if (filters.platform !== "All Platforms" && item.platform !== filters.platform) return false;
    if (filters.garment !== "All Garment Types" && item.garment !== filters.garment) return false;
    return true;
  });

  const hasActiveFilters =
    search ||
    Object.entries(filters).some(([k, v]) => {
      const conf = FILTER_CONFIGS.find((c) => c.id === k);
      return conf && v !== conf.options[0];
    });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Heading */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-blue-600 mb-1 font-semibold text-xs tracking-wider uppercase">
            <ImageIcon size={14} /> Catalogues
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Creations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View, manage, and download your previously generated catalog images and motion renders.
          </p>
        </motion.div>

        {/* Filter / Search Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3.5 mb-6 flex flex-wrap items-center gap-3"
        >
          {/* Search input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search Catalogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-400 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-7 bg-slate-200" />

          {/* Filter dropdowns */}
          {FILTER_CONFIGS.map((cfg) => (
            <FilterDropdown
              key={cfg.id}
              config={cfg}
              value={filters[cfg.id]}
              onChange={(v) => setFilter(cfg.id, v)}
            />
          ))}

          {/* Clear all filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilters({
                  segment: "All Segments",
                  platform: "All Platforms",
                  garment: "All Garment Types",
                  date: "Newest First",
                });
              }}
              className="ml-auto flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <X size={12} /> Clear all
            </button>
          )}
        </motion.div>

        {/* Content area */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filtered.map((item) => (
              <CatalogCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
