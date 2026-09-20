import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Globe, FileText, Shield, Users, Image, Award, CreditCard, Wifi, AlertTriangle, XCircle, RefreshCcw, Headphones
} from "lucide-react";
import LeadCaptureSection from "../components/LeadCaptureSection";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    num: "1",
    icon: FileText,
    title: "Acceptance of Terms",
    bullets: [],
    para: `By installing, accessing, or using the Vizzle application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App. These Terms constitute a legally binding agreement between you ("Merchant") and Vizzle ("Company", "we", "our", "us").`,
  },
  {
    num: "2",
    icon: Users,
    title: "Eligibility",
    bullets: [],
    para: "To use the Vizzle App, you must have a valid Shopify store and be authorized to install applications on behalf of your business. By using the App, you represent and warrant that you meet these requirements and that all information you provide is accurate and complete.",
  },
  {
    num: "3",
    icon: Shield,
    title: "Merchant Responsibilities",
    bullets: [
      "Provide accurate store information and keep it up to date.",
      "Obtain any necessary consent from your customers before collecting or processing their photos for virtual try-on.",
      "Use the App in compliance with all applicable laws, regulations, and Shopify policies.",
      "Ensure the App is not used for any unlawful, harmful, or fraudulent purposes.",
    ],
    para: "",
  },
  {
    num: "4",
    icon: Image,
    title: "Customer Photos",
    bullets: [],
    para: "Photos uploaded by customers are processed solely to generate AI-powered virtual try-on images. Vizzle does not sell or share customer photos with third parties for advertising purposes. Merchants are responsible for clearly informing their customers how their data will be used and for obtaining appropriate consents in compliance with applicable privacy laws.",
  },
  {
    num: "5",
    icon: Award,
    title: "Intellectual Property",
    bullets: [],
    para: "The Vizzle App ” including its software, AI technology, trademarks, user interface, and all related content â€” remains the exclusive property of Vizzle. All rights are reserved. Merchants retain full ownership of their product images and store content. Nothing in these Terms transfers any intellectual property rights to you except the limited license to use the App as permitted herein.",
  },
  {
    num: "6",
    icon: CreditCard,
    title: "Subscription and Billing",
    bullets: [],
    para: "Subscription fees are billed according to your selected plan through Shopify Billing or another agreed payment method. All fees are non-refundable except as required by applicable law. Failure to pay applicable fees may result in suspension or termination of your access to the service. We reserve the right to change pricing with reasonable notice.",
  },
  {
    num: "7",
    icon: Wifi,
    title: "Service Availability",
    bullets: [],
    para: "We strive to provide reliable and uninterrupted service, but we do not guarantee 100% uptime. Scheduled maintenance, software updates, or third-party infrastructure outages may temporarily affect service availability. We will make reasonable efforts to minimize disruptions and notify users of planned downtime where possible.",
  },
  {
    num: "8",
    icon: AlertTriangle,
    title: "Limitation of Liability",
    bullets: [],
    para: "To the maximum extent permitted by applicable law, Vizzle shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the App, including but not limited to loss of profits, data, or goodwill. Our total aggregate liability shall not exceed the total fees paid by the merchant during the 12-month period preceding the claim.",
  },
  {
    num: "9",
    icon: XCircle,
    title: "Termination",
    bullets: [],
    para: "Either party may terminate use of the App at any time. Upon termination, your license to use the App will immediately cease. Access to the service may be discontinued and retained data may be deleted in accordance with our data retention policy. Provisions that by their nature should survive termination will do so.",
  },
  {
    num: "10",
    icon: RefreshCcw,
    title: "Changes to These Terms",
    bullets: [],
    para: "We may update these Terms from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will provide reasonable notice of material changes (e.g., via email or in-app notification). Continued use of the App after the effective date of revised Terms constitutes your acceptance of the updated Terms.",
  },
];

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  const goBack = () => window.history.length > 1 ? navigate(-1) : navigate('/');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sticky Nav */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-14 flex items-center gap-3">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <FileText size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">Terms of Service</span>
          <div className="ml-auto">
            <img src="/logo.png" alt="Vizzle" style={{ height: 28, width: "auto" }} onError={e => { e.target.style.display = "none"; }} />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-5">
            <FileText size={12} />
            Legal Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-4">Last updated: September 2026</p>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Please read these Terms of Service carefully before using the Vizzle platform. By accessing or using our service, you agree to be bound by these terms.
          </p>
          <div className="mt-8 h-px bg-gradient-to-r from-blue-200 via-blue-100 to-transparent" />
        </div>

        {/* Sections â€” clean single-column, no number badges */}
        <div className="space-y-10">
          {SECTIONS.map(({ num, icon: Icon, title, para, bullets }) => (
            <section key={num} className="border-b border-slate-100 pb-10 last:border-0">
              {/* Section Header */}
              <div className="flex items-center gap-2.5 mb-3">
                <Icon size={18} className="text-blue-600 shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {num}. {title}
                </h2>
              </div>

              {/* Body */}
              <div className="text-sm sm:text-[15px] text-slate-600 leading-relaxed pl-[26px]">
                {para && <p>{para}</p>}
                {bullets.length > 0 && (
                  <ul className="space-y-2 mt-1">
                    {bullets.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          {/* Section 11 â€” Contact */}
          <section className="pb-4">
            <div className="flex items-center gap-2.5 mb-3">
              <Headphones size={18} className="text-blue-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">11. Contact Us</h2>
            </div>
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed pl-[26px] mb-5">
              If you have any questions about these Terms of Service, please reach out to us:
            </p>
            <div className="ml-[26px] rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <img src="/logo.png" alt="Vizzle" style={{ height: 24, width: "auto" }} onError={e => { e.target.style.display = "none"; }} />
                <span className="font-bold text-slate-900 text-sm">Vizzle</span>
              </div>
              {[
                { href: "mailto:info@vizzle.in", icon: Mail, label: "Email", display: "info@vizzle.in" },
                { href: "tel:+918310247975", icon: Phone, label: "Phone", display: "+91 83102 47975" },
                { href: "https://www.vizzle.in", icon: Globe, label: "Website", display: "www.vizzle.in", external: true },
              ].map(({ href, icon: Icon, label, display, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">{display}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Get In Touch form â€” same as homepage */}
      <LeadCaptureSection />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
