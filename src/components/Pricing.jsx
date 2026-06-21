import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F3FA]">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 mt-16">
        <div className="max-w-2xl bg-white p-12 md:p-16 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#1D8DB2] opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center items-center gap-3 mb-6">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-[#1D8DB2] text-sm font-bold tracking-wide uppercase">
                Pricing Plans
              </span>
              <span className="inline-block py-1 px-4 rounded-full bg-gradient-to-r from-[#235D71] to-[#1D8DB2] text-white text-sm font-extrabold tracking-wide uppercase shadow-md transform hover:scale-105 transition-transform cursor-default">
                🎉 Free Plan: 3 Months Free
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#235D71] mb-6 font-baloo leading-tight">
              Exciting Features <br/> <span className="text-[#1D8DB2]">Coming Soon!</span>
            </h1>
            
            <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              We're currently putting the finishing touches on our premium plans. In the meantime, sign up now to get our <span className="font-bold text-[#1D8DB2]">Free Plan</span> with 3 months of full access. Stay tuned for more!
            </p>
            
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full text-white bg-[#1D8DB2] hover:bg-[#156e8c] md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Pricing;
