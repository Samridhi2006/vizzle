import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, Shield, ArrowRight, HelpCircle } from "lucide-react";

function Pricing() {
  const [tryOnCount, setTryOnCount] = useState(500);
  const [videoCount, setVideoCount] = useState(100);

  const calculatedCost = Math.round((tryOnCount * 2.5) + (videoCount * 5.0));

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F3FA] text-gray-800">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-100/80 text-[#1D8DB2] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm border border-blue-200">
            <Sparkles size={14} /> Transparent Pricing Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#235D71] mb-6 leading-tight">
            One-Time Setup + <br className="hidden sm:inline" />
            <span className="text-[#1D8DB2]">Pay-As-You-Go API Usage</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Activate your store with a one-time setup tier to set your rate limits, then recharge your store wallet with prepaid API credits as you grow.
          </p>
        </div>

        {/* SECTION 1: SET UP COST (One Time) */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              Step 1: Required One-Time Setup
            </span>
            <h2 className="text-3xl font-extrabold text-[#235D71] mt-3">
              SET UP COST <span className="text-[#1D8DB2]">(One Time Fee)</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              One-time store activation fee granting dedicated hourly & daily API rate limits.
            </p>
          </div>

          {/* Setup Cost Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Basic */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Starter Store</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Basic</span>
                </div>
                <div className="text-3xl font-extrabold text-[#235D71] mb-1">₹2,000/-</div>
                <div className="text-xs text-gray-500 mb-6">One-time setup fee</div>

                <div className="space-y-3 text-sm text-gray-700 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Req / hour:</span>
                    <strong className="text-[#235D71]">100 req/hr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Req / day:</span>
                    <strong className="text-[#235D71]">1,000 req/day</strong>
                  </div>
                </div>
              </div>

              <a
                href="https://dashboard.vizzle.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#235D71] font-bold text-xs transition-colors"
              >
                Choose Basic Plan
              </a>
            </div>

            {/* Gold */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#1D8DB2] shadow-xl flex flex-col justify-between relative transform lg:-translate-y-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D8DB2] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                Most Popular
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1D8DB2]">Growth Store</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Gold</span>
                </div>
                <div className="text-3xl font-extrabold text-[#235D71] mb-1">₹5,000/-</div>
                <div className="text-xs text-gray-500 mb-6">One-time setup fee</div>

                <div className="space-y-3 text-sm text-gray-700 mb-6 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Req / hour:</span>
                    <strong className="text-[#1D8DB2]">300 req/hr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Req / day:</span>
                    <strong className="text-[#1D8DB2]">3,000 req/day</strong>
                  </div>
                </div>
              </div>

              <a
                href="https://dashboard.vizzle.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-xl bg-[#1D8DB2] hover:bg-[#187290] text-white font-bold text-xs shadow-md transition-colors"
              >
                Choose Gold Plan
              </a>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-3xl p-6 border border-purple-200 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">High Volume</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Premium</span>
                </div>
                <div className="text-3xl font-extrabold text-[#235D71] mb-1">₹15,000/-</div>
                <div className="text-xs text-gray-500 mb-6">One-time setup fee</div>

                <div className="space-y-3 text-sm text-gray-700 mb-6 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Req / hour:</span>
                    <strong className="text-purple-700">1,500 req/hr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Req / day:</span>
                    <strong className="text-purple-700">15,000 req/day</strong>
                  </div>
                </div>
              </div>

              <a
                href="https://dashboard.vizzle.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                Choose Premium Plan
              </a>
            </div>

            {/* Enterprise */}
            <div className="bg-[#0f172a] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Custom Scale</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">Enterprise</span>
                </div>
                <div className="text-3xl font-extrabold text-white mb-1">TBD</div>
                <div className="text-xs text-gray-400 mb-6">Custom SLAs & volume pricing</div>

                <div className="space-y-3 text-sm text-gray-300 mb-6 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Req / hour:</span>
                    <strong className="text-blue-300">Custom</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Req / day:</span>
                    <strong className="text-blue-300">Custom</strong>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
              >
                Contact Sales
              </Link>
            </div>

          </div>
        </div>

        {/* SECTION 2: API COST (Recurring Pay As You Go) */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D8DB2] bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200 shadow-sm inline-block mb-3">
              Step 2: Recharge Wallet &amp; Usage Credits
            </span>
            <h2 className="text-3xl font-extrabold text-[#235D71]">Pay-As-You-Go Credit Top-Ups</h2>
            <p className="text-sm text-gray-500 mt-1">
              Wallet credits never expire. Use your balance for Virtual Try-On Images or AI Fashion Videos.
            </p>
          </div>

          {/* API Cost Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <th className="py-3.5 px-6">Top-Up Amount</th>
                    <th className="py-3.5 px-6">Wallet Credit Received</th>
                    <th className="py-3.5 px-6">Max Try-On Images</th>
                    <th className="py-3.5 px-6">Max AI Videos</th>
                    <th className="py-3.5 px-6 text-right">Bonus Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm font-medium">
                  
                  {/* ₹100 */}
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-gray-900">₹100</td>
                    <td className="py-4 px-6 font-bold text-[#1D8DB2]">₹100</td>
                    <td className="py-4 px-6 text-[#235D71] font-bold">40 images</td>
                    <td className="py-4 px-6 text-purple-700 font-bold">20 videos</td>
                    <td className="py-4 px-6 text-right text-gray-400 font-normal">Standard</td>
                  </tr>

                  {/* ₹500 */}
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-gray-900">₹500</td>
                    <td className="py-4 px-6 font-bold text-[#1D8DB2]">
                      ₹550 <span className="text-xs font-semibold text-emerald-600 ml-1">(+₹50 extra)</span>
                    </td>
                    <td className="py-4 px-6 text-[#235D71] font-bold">220 images</td>
                    <td className="py-4 px-6 text-purple-700 font-bold">110 videos</td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">+10% Bonus</span>
                    </td>
                  </tr>

                  {/* ₹1,000 */}
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-gray-900">₹1,000</td>
                    <td className="py-4 px-6 font-bold text-[#1D8DB2]">
                      ₹1,100 <span className="text-xs font-semibold text-emerald-600 ml-1">(+₹100 extra)</span>
                    </td>
                    <td className="py-4 px-6 text-[#235D71] font-bold">440 images</td>
                    <td className="py-4 px-6 text-purple-700 font-bold">220 videos</td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">+10% Bonus</span>
                    </td>
                  </tr>

                  {/* ₹2,000 */}
                  <tr className="hover:bg-blue-50/30 transition-colors bg-blue-50/20">
                    <td className="py-4 px-6 font-extrabold text-[#235D71]">₹2,000</td>
                    <td className="py-4 px-6 font-extrabold text-[#1D8DB2]">
                      ₹2,300 <span className="text-xs font-bold text-emerald-600 ml-1">(+₹300 extra)</span>
                    </td>
                    <td className="py-4 px-6 text-[#235D71] font-bold">920 images</td>
                    <td className="py-4 px-6 text-purple-700 font-bold">460 videos</td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">+15% Bonus</span>
                    </td>
                  </tr>

                  {/* ₹5,000 */}
                  <tr className="hover:bg-blue-50/30 transition-colors bg-amber-50/20">
                    <td className="py-4 px-6 font-extrabold text-gray-900">₹5,000</td>
                    <td className="py-4 px-6 font-extrabold text-[#1D8DB2]">
                      ₹6,000 <span className="text-xs font-bold text-emerald-600 ml-1">(+₹1,000 extra)</span>
                    </td>
                    <td className="py-4 px-6 text-[#235D71] font-bold">2,400 images</td>
                    <td className="py-4 px-6 text-purple-700 font-bold">1,200 videos</td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm">+20% Bonus</span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <span>💳 Processed instantly via Razorpay (UPI, GPay, Credit/Debit Cards, Net Banking)</span>
              <a
                href="https://dashboard.vizzle.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#1D8DB2] hover:underline whitespace-nowrap"
              >
                Top up store wallet →
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Estimator */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xl mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#235D71] mb-2">
              💡 Estimate Your Monthly Usage Volume
            </h2>
            <p className="text-sm text-gray-500">
              Drag the sliders below to estimate your store&apos;s monthly try-on and video generation capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Try-On Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-sm text-gray-700">Virtual Try-On Images</label>
                <span className="font-extrabold text-[#1D8DB2] text-base">{tryOnCount} images / mo</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={tryOnCount}
                onChange={(e) => setTryOnCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D8DB2]"
              />
            </div>

            {/* Video Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-sm text-gray-700">AI Fashion Videos</label>
                <span className="font-extrabold text-purple-700 text-base">{videoCount} videos / mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={videoCount}
                onChange={(e) => setVideoCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>

          <div className="bg-[#F9F3FA] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-purple-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Monthly Generations</span>
              <div className="text-3xl font-extrabold text-[#235D71]">{(tryOnCount + videoCount).toLocaleString()} <span className="text-xs font-medium text-gray-500">generations / month</span></div>
            </div>
            <a
              href="https://dashboard.vizzle.in"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-8 rounded-xl bg-[#1D8DB2] hover:bg-[#16708e] text-white font-bold text-sm shadow-md transition-all whitespace-nowrap"
            >
              Get Started Now
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Pricing;
