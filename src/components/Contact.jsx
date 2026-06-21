import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name: `${e.target.firstName.value} ${e.target.lastName.value}`,
      email: e.target.email.value,
      message: e.target.message.value,
      _subject: "New Contact Form Submission from Vizzle",
      _template: "table" // Uses a nice table format for the email
    };

    try {
      // Send email via FormSubmit AJAX API
      await fetch("https://formsubmit.co/ajax/info@vizzle.in", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      e.target.reset(); // Clear the form
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSubmitting(false);
      alert("Something went wrong. Please try again later.");
    }
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
                    <input type="text" id="firstName" name="firstName" required className="w-full px-5 py-4 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-[#1D8DB2]/50 focus:border-[#1D8DB2] focus:bg-white outline-none transition-all duration-300 shadow-sm" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required className="w-full px-5 py-4 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-[#1D8DB2]/50 focus:border-[#1D8DB2] focus:bg-white outline-none transition-all duration-300 shadow-sm" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="email" name="email" required className="w-full px-5 py-4 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-[#1D8DB2]/50 focus:border-[#1D8DB2] focus:bg-white outline-none transition-all duration-300 shadow-sm" placeholder="john@example.com" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea id="message" name="message" rows="5" required className="w-full px-5 py-4 bg-white/50 border border-white/80 rounded-xl focus:ring-2 focus:ring-[#1D8DB2]/50 focus:border-[#1D8DB2] focus:bg-white outline-none transition-all duration-300 resize-none shadow-sm" placeholder="How can we help you?"></textarea>
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
