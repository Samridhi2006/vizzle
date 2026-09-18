import { CreditCard, Zap, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    name: "Starter Pack",
    subtitle: "Perfect for Startups",
    price: "₹1,000",
    tryons: 160,
    perUnit: "₹6.25 per Try-On",
    features: ["160 AI Try-Ons", "Instant Priority Processing", "Pay Only for Successful Try-Ons", "White Label Integration", "Website & Shopify Integration", "Standard AI Quality"],
  },
  {
    name: "Growth Pack",
    subtitle: "Most Popular Choice",
    price: "₹2,500",
    tryons: 450,
    perUnit: "₹5.56 per Try-On",
    features: ["450 AI Try-Ons", "Instant Priority Processing", "Pay Only for Successful Try-Ons", "White Label Integration", "Website & Shopify Integration", "Standard AI Quality"],
    popular: true,
  },
  {
    name: "Pro Pack",
    subtitle: "Best for Growing Businesses",
    price: "₹5,000",
    tryons: 960,
    perUnit: "₹5.21 per Try-On",
    features: ["960 AI Try-Ons", "Instant Priority Processing", "Pay Only for Successful Try-Ons", "White Label Integration", "Website & Shopify Integration", "Standard AI Quality"],
  },
  {
    name: "Enterprise Pack",
    subtitle: "Enterprises & High Volume",
    price: "₹10,000",
    tryons: 2000,
    perUnit: "₹5.00 per Try-On",
    features: ["2,000 AI Try-Ons", "Instant Priority Processing", "Pay Only for Successful Try-Ons", "White Label Integration", "Website & Shopify Integration", "Standard AI Quality"],
  },
];

export default function BillingPage() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Credits & Billing</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your credit balance and subscription plan.</p>
      </div>
      {/* Balance card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <CreditCard size={22} className="text-blue-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Current Credit Balance</p>
            <p className="text-3xl font-black text-gray-900">100 <span className="text-base font-semibold text-gray-400">credits</span></p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-2">Equivalent to</p>
          <p className="text-sm font-bold text-gray-800">10 × 2K generations</p>
          <p className="text-sm font-bold text-gray-500">5 × 4K generations</p>
        </div>
      </div>

      {/* Plans */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3">Top Up Credits</p>
        <div className="grid grid-cols-4 gap-3">
          {PLANS.map(({ name, subtitle, price, tryons, perUnit, features, popular }) => (
            <div
              key={name}
              className={`rounded-xl border-2 p-5 shadow-sm flex flex-col relative ${
                popular
                  ? "bg-[#1D8DB2] border-[#1D8DB2] shadow-lg shadow-[#1D8DB2]/30"
                  : "bg-white border-gray-100"
              }`}
            >
              {popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#1D8DB2] bg-white px-3 py-0.5 rounded-full whitespace-nowrap border border-[#1D8DB2]/30">
                  Best Value
                </span>
              )}
              <p className={`text-sm font-bold mb-0 ${popular ? "text-white" : "text-gray-900"}`}>{name}</p>
              <p className={`text-[11px] mb-2 ${popular ? "text-white/70" : "text-gray-400"}`}>{subtitle}</p>
              <p className={`text-2xl font-black ${popular ? "text-white" : "text-gray-900"}`}>{price}</p>
              <p className={`text-xs mb-1 ${popular ? "text-white/70" : "text-gray-400"}`}>/ {tryons.toLocaleString()} Try-Ons</p>
              <p className={`text-[11px] font-semibold mb-4 ${popular ? "text-white/90" : "text-[#1D8DB2]"}`}>{perUnit}</p>
              <ul className="space-y-2 mb-5 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <Check size={12} className={`mt-0.5 shrink-0 ${popular ? "text-white" : "text-emerald-500"}`} strokeWidth={3} />
                    <span className={popular ? "text-white/90" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                popular
                  ? "bg-white text-[#1D8DB2] hover:bg-white/90"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}>
                Buy Now <ArrowRight size={13} />
              </button>
            </div>

          ))}
        </div>
      </div>

      {/* Usage history */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Usage History</p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Zap size={24} className="text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No usage history yet.</p>
        </div>
      </div>
    </div>
  );
}
