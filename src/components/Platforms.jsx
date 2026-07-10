import React from 'react';
import { FaShopify, FaWordpress } from 'react-icons/fa';

const platforms = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Seamlessly integrate Vizzle with your Shopify store in just a few clicks. Offer your customers a magical try-on experience directly on your product pages.',
    icon: (
      <FaShopify className="w-12 h-12 text-[#95BF47]" />
    ),
    bgColor: 'bg-[#95BF47]/10',
    borderColor: 'border-[#95BF47]/20',
  },
  {
    id: 'wordpress',
    name: 'WordPress / WooCommerce',
    description: 'Add our lightweight plugin to your WooCommerce site. Enhance your catalog with AR capabilities without writing a single line of code.',
    icon: (
      <FaWordpress className="w-12 h-12 text-[#21759b]" />
    ),
    bgColor: 'bg-[#21759b]/10',
    borderColor: 'border-[#21759b]/20',
  },
  {
    id: 'custom',
    name: 'Custom APIs',
    description: 'Building something unique? Our robust APIs and SDKs allow you to integrate Vizzle\'s try-on technology directly into your bespoke platform or app.',
    icon: (
      <svg className="w-12 h-12 text-[#1D8DB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    bgColor: 'bg-[#1D8DB2]/10',
    borderColor: 'border-[#1D8DB2]/20',
  }
];

function Platforms() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-tr from-[#F9F3FA] via-white to-blue-50/30">
      {/* Decorative premium blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-b from-[#1D8DB2]/20 to-[#235D71]/10 rounded-full blur-[100px] opacity-70"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-t from-purple-300/20 to-blue-300/20 rounded-full blur-[100px] opacity-70"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-[#1D8DB2] font-bold tracking-widest uppercase text-xs mb-4 shadow-sm">Integrations</span>
          <h3 className="text-4xl md:text-6xl font-extrabold text-[#235D71] font-baloo drop-shadow-sm">Works Everywhere You Do</h3>
          <p className="mt-6 text-gray-600 text-xl font-light">
            No matter what platform powers your store, we've got you covered. Easy setup, seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {platforms.map((platform) => (
            <div 
              key={platform.id} 
              className={`flex flex-col bg-white/40 backdrop-blur-xl rounded-3xl p-10 border-2 border-[#1D8DB2]/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:border-[#1D8DB2]/50 hover:shadow-[0_20px_60px_rgba(29,141,178,0.12)] transition-all duration-500 transform hover:-translate-y-2 group`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/80 group-hover:scale-110 transition-transform duration-500 ${platform.bgColor}`}>
                {platform.icon}
              </div>
              
              <h4 className="text-3xl font-extrabold text-[#235D71] mb-5 font-baloo">{platform.name}</h4>
              <p className="text-gray-600 leading-relaxed mb-8 flex-grow font-light text-lg">
                {platform.description}
              </p>
              
              <a 
                href={`/docs?tab=${platform.id}`}
                className="inline-flex items-center text-[#1D8DB2] font-bold tracking-wide hover:text-[#156e8c] transition-colors mt-auto group-hover:translate-x-2 duration-300"
              >
                View Documentation
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

export default Platforms;
