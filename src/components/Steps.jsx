import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: 'Setup Account & Store',
    description: 'Sign up and set up your Store to get started with the platform and its services.',
    buttonText: 'View Documentation'
  },
  {
    id: 2,
    title: 'Setup Plugin & API Key',
    description: 'Use our plugin for wordpress and shopify or follow docs to set up the custom store with API key.',
    buttonText: 'View Documentation'
  },
  {
    id: 3,
    title: 'Add or import products',
    description: 'Manually add your best products or import them in bulk directly from the site.',
    buttonText: 'View Documentation'
  },
  {
    id: 4,
    title: 'Start Virtual Try On',
    description: 'Create an API key to securely connect your store with external services.',
    buttonText: 'View Documentation'
  }
];

function Steps() {
  return (
    <section className="py-32 bg-[#1D8DB2] text-white relative overflow-hidden">
      {/* Decorative background blobs to make glassmorphism visible */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[40rem] h-[40rem] bg-[#235D71] rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-[40rem] h-[40rem] bg-[#70BBD4] rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-[#1a7a9e] rounded-full filter blur-[120px] opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-[90rem] relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-sm">How It Works</h2>
          <p className="text-blue-50 text-xl max-w-2xl mx-auto">
            Get started with Vizzle in four simple steps that take minutes to implement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 min-h-[420px] flex flex-col items-center text-center hover:bg-white/20 hover:border-white/40 hover:-translate-y-3 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)]"
            >
              <div className="w-full text-center mb-8">
                <span className="text-7xl font-extrabold text-white/90 drop-shadow-md">{step.id}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-sm">{step.title}</h3>
              <p className="text-blue-50 text-base leading-relaxed mb-10 flex-grow font-light">
                {step.description}
              </p>
              <Link 
                to="/docs"
                className="bg-white hover:bg-gray-50 text-[#1D8DB2] w-full text-center block text-base font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.3)] hover:-translate-y-1"
              >
                {step.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Steps;
