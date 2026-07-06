import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaShopify, FaWordpress, FaCode } from 'react-icons/fa';

export const CUSTOM_API_DOCS_URL = 'https://dashboard.vizzle.in/dashboard/docs';

export default function StepNavigation({ activeStep, setActiveStep, activeTab, setActiveTab, docsContent }) {
  const tabs = [
    { id: 'wordpress', label: 'WordPress', icon: <FaWordpress /> },
    { id: 'shopify', label: 'Shopify', icon: <FaShopify /> },
    { id: 'custom', label: 'Custom API', icon: <FaCode /> }
  ];

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    if (activeStep < docsContent.length - 1) setActiveStep(activeStep + 1);
  };
  return (
    <div className="step-nav-bar bg-[#F9F3FA] sticky top-[112px] z-40 border-b border-black/10 py-3">
      <div className="w-full px-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          <div className="flex items-center overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
            <div className="bg-black/5 rounded flex p-1 gap-1 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-2 md:px-5 md:py-2 text-sm md:text-[1.05rem] rounded border-none cursor-pointer transition-colors ${activeTab === tab.id ? 'bg-[var(--accent-color)] text-white' : 'bg-transparent text-gray-600 hover:bg-black/5'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="flex items-center">
              <span className="text-sm md:text-[1.05rem] text-gray-600 border border-black/10 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full">
                Step <span className="text-[var(--accent-color)] ml-1 font-bold">{activeStep + 1}/{docsContent.length}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrev}
                disabled={activeStep === 0}
                className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded transition-all ${activeStep > 0 ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white hover:opacity-90' : 'bg-gray-100 border-black/10 text-gray-400 cursor-not-allowed opacity-50'}`}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNext}
                disabled={activeStep === docsContent.length - 1}
                className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded transition-all ${activeStep < docsContent.length - 1 ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white hover:opacity-90' : 'bg-gray-100 border-black/10 text-gray-400 cursor-not-allowed opacity-50'}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
