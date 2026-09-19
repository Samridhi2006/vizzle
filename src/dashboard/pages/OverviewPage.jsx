import { Store, Package, Zap, Users, CreditCard, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATS = [
  { label: "Stores", value: "0", icon: Store, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Products", value: "0", icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Try-ons (30d)", value: "0", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Unique users (30d)", value: "0", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
];

export default function OverviewPage() {
  const navigate = useNavigate();
  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Virtual try-on platform — stores, products, analytics.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/stores")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors min-h-[44px] cursor-pointer"
        >
          <Plus size={15} /> New Store
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={18} className={color} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Credit Balance */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <CreditCard size={18} className="text-blue-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Credit Balance</p>
            <p className="text-xl font-bold text-gray-900">₹0.00</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard/billing")}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors min-h-[44px] cursor-pointer"
        >
          Top Up →
        </button>
      </div>

      {/* Step 1 CTA */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Step 1 — Create a Store</p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Store size={18} className="text-blue-500" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Create your first store</p>
              <p className="text-xs text-gray-400">Get an API key instantly.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/stores")}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors min-h-[44px] cursor-pointer"
          >
            <Plus size={14} /> Create Store
          </button>
        </div>
      </div>

      {/* Studio CTA */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-100 rounded-xl p-5">
        <p className="text-sm font-bold text-gray-900 mb-1">🎨 Ready to create catalogues?</p>
        <p className="text-xs text-gray-500 mb-3">Turn flat-lay garments into professional model shoots in minutes.</p>
        <button
          onClick={() => navigate("/dashboard/studio")}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          Open Studio →
        </button>
      </div>
    </div>
  );
}
