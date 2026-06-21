import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F9F3FA] via-white to-[#e0f2f7]">
      <Navbar />
      
      {/* Premium Decorative blobs */}
      <div className="absolute top-20 left-0 -ml-32 w-[30rem] h-[30rem] bg-gradient-to-br from-[#1D8DB2]/20 to-purple-400/20 rounded-full blur-[100px] opacity-80 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 -mr-32 -mb-32 w-[30rem] h-[30rem] bg-gradient-to-tl from-[#235D71]/20 to-[#1D8DB2]/20 rounded-full blur-[100px] opacity-80 animate-pulse" style={{animationDelay: '2s'}}></div>

      <main className="flex-grow flex flex-col items-center justify-center py-32 px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/50 backdrop-blur-md border border-[#1D8DB2]/20 text-[#1D8DB2] font-bold tracking-widest uppercase text-xs mb-4 shadow-sm">Support</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#235D71] font-baloo drop-shadow-sm">Let's Connect</h1>
        </div>

        <div className="max-w-5xl w-full bg-white/40 backdrop-blur-xl border-2 border-white/60 rounded-[2.5rem] shadow-[0_20px_60px_rgba(29,141,178,0.1)] overflow-hidden flex flex-col md:flex-row relative">
          
          {/* Contact Information Sidebar */}
          <div className="relative bg-gradient-to-br from-[#235D71] to-[#1D8DB2] text-white p-12 md:w-2/5 flex flex-col justify-between overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-4 font-baloo tracking-wide">Get in Touch</h2>
              <p className="text-base text-blue-50 font-light mb-12 leading-relaxed">
                We'd love to hear from you! Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
              </p>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 font-medium mb-1">Email</p>
                    <p className="text-lg font-semibold">info@vizzle.in</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 flex gap-4 relative z-10">
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white hover:text-[#1D8DB2] hover:-translate-y-1 transition-all duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white hover:text-[#1D8DB2] hover:-translate-y-1 transition-all duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="p-12 md:w-3/5 bg-white/30 backdrop-blur-md">
            <h3 className="text-3xl font-extrabold text-[#235D71] mb-8 font-baloo">Send us a message</h3>
            
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-2xl font-bold text-green-800 mb-2 font-baloo">Message Sent!</h4>
                <p className="text-green-600">Thanks for reaching out. We'll get back to you as soon as possible!</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-[#1D8DB2] font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input type="text" id="firstName" required className="w-full px-5 py-4 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-[#1D8DB2]/50 focus:border-[#1D8DB2] focus:bg-white outline-none transition-all duration-300 shadow-sm" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" required className="w-full px-5 py-4 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-[#1D8DB2]/50 focus:border-[#1D8DB2] focus:bg-white outline-none transition-all duration-300 shadow-sm" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="email" required className="w-full px-5 py-4 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-[#1D8DB2]/50 focus:border-[#1D8DB2] focus:bg-white outline-none transition-all duration-300 shadow-sm" placeholder="john@example.com" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea id="message" rows="5" required className="w-full px-5 py-4 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-[#1D8DB2]/50 focus:border-[#1D8DB2] focus:bg-white outline-none transition-all duration-300 resize-none shadow-sm" placeholder="How can we help you?"></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full text-white font-extrabold text-lg py-4 px-8 rounded-xl transition-all duration-300 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#235D71] to-[#1D8DB2] hover:shadow-[0_10px_20px_rgba(29,141,178,0.3)] transform hover:-translate-y-1'}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Contact;
