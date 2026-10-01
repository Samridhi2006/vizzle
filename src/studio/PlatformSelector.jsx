import React from "react";
import { Check } from "lucide-react";

export const PLATFORMS_DATA = [
  {
    id: "amazon",
    name: "Amazon",
    tagline: "India's largest marketplace",
    color: "#FF9900",
    badgeBg: "#131921",
    aspectText: "1:1 / 4:5",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#131921] flex items-center justify-center text-white relative shadow-xs">
        <span className="font-black text-sm tracking-tight text-white">a</span>
        <span className="absolute bottom-1 w-3.5 h-1 border-b-2 border-[#FF9900] rounded-full"></span>
      </div>
    ),
  },
  {
    id: "flipkart",
    name: "Flipkart",
    tagline: "Top fashion destination",
    color: "#2874F0",
    badgeBg: "#2874F0",
    aspectText: "3:4 / 1:1",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#2874F0] flex items-center justify-center text-white relative shadow-xs">
        <span className="font-black text-xs text-[#FFE500] italic">f</span>
      </div>
    ),
  },
  {
    id: "myntra",
    name: "Myntra",
    tagline: "Premium fashion & lifestyle",
    color: "#FF3F6C",
    badgeBg: "#FFF0F4",
    aspectText: "3:4 vertical",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF3F6C] via-[#FF6038] to-[#FF9800] flex items-center justify-center text-white shadow-xs">
        <span className="font-black text-xs text-white tracking-tighter">M</span>
      </div>
    ),
  },
  {
    id: "ajio",
    name: "AJIO",
    tagline: "Trendy western & ethnic wear",
    color: "#2C4152",
    badgeBg: "#2C4152",
    aspectText: "3:4 portrait",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#2C4152] flex items-center justify-center text-white shadow-xs">
        <span className="font-extrabold text-[10px] text-white tracking-tight">AJIO</span>
      </div>
    ),
  },
  {
    id: "meesho",
    name: "Meesho",
    tagline: "Social commerce & wholesale",
    color: "#9B1FE8",
    badgeBg: "#F7EEFC",
    aspectText: "1:1 square",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9B1FE8] to-[#F43397] flex items-center justify-center text-white shadow-xs">
        <span className="font-black text-xs text-white">m</span>
      </div>
    ),
  },
  {
    id: "nykaa",
    name: "Nykaa",
    tagline: "Beauty & high-fashion curation",
    color: "#FC2779",
    badgeBg: "#FFF0F6",
    aspectText: "3:4 editorial",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#FC2779] flex items-center justify-center text-white shadow-xs">
        <span className="font-extrabold text-[11px] text-white tracking-wider">NK</span>
      </div>
    ),
  },
  {
    id: "shopify",
    name: "Shopify",
    tagline: "D2C independent brand store",
    color: "#5C6AC4",
    badgeBg: "#EEF0FC",
    aspectText: "Custom / 1:1",
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#95BF47] flex items-center justify-center text-white shadow-xs">
        <span className="font-bold text-xs text-white">S</span>
      </div>
    ),
  },
];

/**
 * PlatformSelector component
 * Renders selectable retail platform cards with official brand styles
 * Active state uses unified Vizzle Brand Blue styling
 */
export default function PlatformSelector({
  selectedPlatform = "amazon",
  onSelectPlatform,
  platforms = PLATFORMS_DATA,
  gridClassName = "grid grid-cols-2 gap-2.5",
}) {
  return (
    <div className={gridClassName}>
      {platforms.map((p) => {
        const isSelected = selectedPlatform === p.id;
        const isShopifySpan = p.id === "shopify" && platforms.length === 7;

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPlatform(p.id)}
            className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col p-3 text-left bg-white ${
              isShopifySpan ? "col-span-2" : ""
            } ${
              isSelected
                ? "border-2 border-blue-600 bg-blue-50/20 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20"
                : "border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2.5">
              {p.icon}
              {isSelected ? (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Check size={12} strokeWidth={3} />
                </div>
              ) : (
                <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">
                  {p.aspectText}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                {p.name}
              </p>
              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                {p.tagline}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
