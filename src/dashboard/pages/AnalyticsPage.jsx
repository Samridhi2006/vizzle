import { BarChart2, TrendingUp, Users, Zap, Eye } from "lucide-react";

const METRICS = [
  { label: "Total Try-ons", value: "0", delta: "+0%", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Unique Users", value: "0", delta: "+0%", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Conversion Rate", value: "0%", delta: "+0%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Page Views", value: "0", delta: "+0%", icon: Eye, color: "text-purple-500", bg: "bg-purple-50" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track try-on performance, conversions, and user engagement.</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {METRICS.map(({ label, value, delta, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={16} className={color} strokeWidth={1.8} />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{delta}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Try-on Activity (Last 30 Days)</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <BarChart2 size={24} className="text-gray-300" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-gray-500">No data yet</p>
          <p className="text-xs text-gray-400 mt-1">Analytics will appear once customers start using virtual try-on.</p>
        </div>
      </div>
    </div>
  );
}
