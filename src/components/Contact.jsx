import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Facebook, Instagram, Youtube, Linkedin, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import Footer from "./Footer";
import ContactFAQSection from "./ContactFAQSection";
import PlanConsultationBanner from "./PlanConsultationBanner";
import { useModal } from "../context/ModalContext";

export default function Contact() {
  const { openSignInModal } = useModal();
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("https://formsubmit.co/ajax/support@vizzle.in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          brand: formData.brandName,
          email: formData.email,
          phone: formData.phone,
          _subject: "New Contact Form Inquiry from Vizzle Contact Page",
          _template: "table",
        }),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", brandName: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error sending contact inquiry:", error);
      setIsSubmitting(false);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col justify-between">
      {/* ── Mini Top Bar ── */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:border-slate-300 rounded-full px-3.5 py-1.5 shadow-xs transition-all"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </Link>
          <div className="w-[1px] h-5 bg-slate-200" />
          <img src="/viz.png" alt="Vizzle" className="h-7 w-auto" />
        </div>
        <button
          onClick={openSignInModal}
          className="text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-black px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
        >
          Sign In
        </button>
      </div>

      <main className="flex-1 w-full">
        {/* Page Title (H1) */}
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 text-center tracking-tight pt-12 sm:pt-16 pb-10 sm:pb-12">
          Contact Us
        </h1>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-24">
          
          {/* Left Column — Direct Contact Details */}
          <div className="lg:col-span-6 space-y-8 pr-0 lg:pr-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                We'd Love to Hear From You
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                If you have a quick question, or you are ready to go headfirst, our team is here and ready to assist you in solving your problem.
              </p>
            </div>

            {/* Direct Contact Items */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-900 shrink-0" />
                <a
                  href="mailto:support@vizzle.in"
                  className="text-sm sm:text-base font-semibold text-slate-900 hover:text-cyan-600 transition-colors"
                >
                  support@vizzle.in
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-900 shrink-0" />
                <a
                  href="https://wa.me/917729883692?text=Hi%20Vizzle%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base font-semibold text-slate-900 hover:text-cyan-600 transition-colors"
                >
                  +91 7729883692
                </a>
              </div>
            </div>

            {/* Follow Us On Section */}
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block mb-3">
                Follow Us On
              </span>
              <div className="flex items-center gap-4 text-slate-800">
                <a
                  href="https://www.facebook.com/vizzle.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-cyan-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/vizzle.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-cyan-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/@vizzle"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-cyan-600 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/vizzle-official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-cyan-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column — Floating Form Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-lg shadow-slate-100">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-6">
              Get In Touch
            </h3>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Message Received!</h4>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-bold text-slate-900 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name* */}
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5">
                    Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                  />
                </div>

                {/* Brand Name */}
                <div>
                  <label htmlFor="brandName" className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Enter your brand name"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                  />
                </div>

                {/* Email* */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                  />
                </div>

                {/* Phone* */}
                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-2 bg-[#14171A] hover:bg-black text-white font-bold rounded-2xl text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>

                {/* Legal Disclaimer */}
                <p className="text-xs text-slate-500 text-center mt-5">
                  By submitting, you agree to our{" "}
                  <Link to="/privacy-policy" className="font-semibold text-slate-700 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="font-semibold text-slate-700 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ── Frequently Asked Questions Section ── */}
        <ContactFAQSection />

        {/* ── Not Sure Which Plan Banner (Above Footer) ── */}
        <PlanConsultationBanner />
      </main>

      {/* Complete Dark Footer */}
      <Footer />
    </div>
  );
}
