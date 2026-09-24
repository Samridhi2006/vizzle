import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Shield, Mail, Phone, Globe, FileText,
  Users, Image, AlertTriangle, Lock, Server, Trash2,
  Cookie, BarChart2, Baby, Ban, Award, Wrench,
  Cpu, Database, RefreshCcw, Scale, Headphones, Info
} from "lucide-react";
import LeadCaptureSection from "./LeadCaptureSection";
import Footer from "./Footer";

const SECTIONS = [
  {
    num: "1",
    icon: FileText,
    title: "Important Definitions",
    items: [
      { term: "Merchant", def: "Any business or individual who installs and uses the Vizzle application on their Shopify store." },
      { term: "Customer or End User", def: "The end consumers who visit a Merchant's store and use the virtual try-on feature." },
      { term: "Uploaded Content", def: "Any photographs, images, or other files submitted by Customers through the virtual try-on feature." },
      { term: "Generated Content", def: "AI-produced virtual try-on images created from Uploaded Content." },
      { term: "Personal Information", def: "Any data that identifies or could reasonably be used to identify an individual." },
    ],
    para: "",
    bullets: [],
  },
  {
    num: "2",
    icon: Database,
    title: "Information We May Collect",
    para: "",
    bullets: [],
    subsections: [
      {
        label: "Merchant Information",
        items: [
          "Store name, URL, and contact details.",
          "Billing and subscription information.",
          "API credentials used to connect Vizzle with your Shopify store.",
          "Usage logs and technical data.",
        ],
      },
      {
        label: "Customer Information",
        items: [
          "Photographs or selfies uploaded for virtual try-on.",
          "Product images used in try-on sessions.",
          "Device type, browser information, and session data.",
          "Generated virtual try-on output images.",
        ],
      },
    ],
  },
  {
    num: "3",
    icon: Image,
    title: "Virtual Try-On Images",
    para: "Customer-uploaded photographs are processed securely and exclusively to generate AI virtual try-on images. Images are transmitted over encrypted channels, processed by our AI models, and the results are returned to the Merchant's storefront. We do not use these images for any purpose other than fulfilling the try-on service requested.",
    bullets: [],
  },
  {
    num: "4",
    icon: AlertTriangle,
    title: "AI-Generated Content Disclaimer",
    para: "AI-generated try-on results are approximations only. Vizzle makes no guarantee that generated images accurately represent the physical appearance, fit, color, or texture of any product. Results may vary based on image quality, garment type, and lighting conditions. Customers should treat generated images as a visual guide, not a definitive representation.",
    bullets: [],
  },
  {
    num: "5",
    icon: Users,
    title: "Customer Photographs",
    para: "Photographs uploaded by Customers are used solely for the purpose of generating virtual try-on images. Merchants are responsible for obtaining all necessary consents from their customers prior to enabling this feature, and for ensuring that customers are informed of how their images will be used.",
    bullets: [
      "Photos are processed transiently and not stored longer than necessary to deliver the service.",
      "Merchants must not upload photographs of individuals without their explicit consent.",
      "Vizzle reserves the right to remove content that violates these terms.",
    ],
  },
  {
    num: "6",
    icon: Shield,
    title: "Responsibility for Uploaded Content",
    para: "Merchants are solely responsible for ensuring that all Uploaded Content â€” including customer photographs and product images â€” complies with applicable laws, does not infringe any third-party rights, and has been submitted with all necessary permissions and consents. Vizzle is not liable for Uploaded Content that violates these requirements.",
    bullets: [],
  },
  {
    num: "7",
    icon: Lock,
    title: "Privacy and Consent Responsibilities",
    para: "Before collecting or submitting any customer photographs through the Vizzle App, Merchants must:",
    bullets: [
      "Publish a clear and accessible Privacy Policy on their storefront.",
      "Obtain explicit, informed consent from customers before processing their images.",
      "Inform customers of the purpose, duration, and processing details of their data.",
      "Ensure compliance with applicable regional privacy regulations (e.g., GDPR, PDPA, IT Act 2000).",
    ],
  },
  {
    num: "8",
    icon: Wrench,
    title: "Use of Information",
    para: "Vizzle uses collected information to:",
    bullets: [
      "Provide, operate, and improve the virtual try-on service.",
      "Generate AI-powered try-on results for Customers.",
      "Authenticate Merchants and manage subscriptions.",
      "Deliver technical support and respond to enquiries.",
      "Monitor platform health, detect abuse, and ensure security.",
      "Comply with applicable legal obligations.",
    ],
  },
  {
    num: "9",
    icon: Cpu,
    title: "AI Model Training",
    para: "Customer-uploaded photographs and AI-generated results are NOT used to train general-purpose AI models without explicit written consent from the Merchant. Aggregated, de-identified, or anonymised data may be used to improve the accuracy and performance of Vizzle's proprietary AI models. Merchants may opt out by contacting us at info@vizzle.in.",
    bullets: [],
  },
  {
    num: "10",
    icon: Server,
    title: "Third-Party Service Providers",
    para: "Vizzle may engage reputable third-party vendors to support its operations, including:",
    bullets: [
      "Cloud hosting and data storage providers.",
      "AI and machine learning processing infrastructure.",
      "Analytics and error monitoring tools.",
      "Payment processing and billing services.",
      "Customer support platforms.",
    ],
  },
  {
    num: "11",
    icon: Globe,
    title: "International Data Processing",
    para: "Vizzle operates globally and your data may be processed in countries other than your own. By using our service, Merchants and their Customers acknowledge that data may be transferred to and stored in countries with different data protection laws. We implement appropriate safeguards to protect data during international transfers.",
    bullets: [],
  },
  {
    num: "12",
    icon: Lock,
    title: "Data Security",
    para: "We implement industry-standard security measures to protect personal information, including:",
    bullets: [
      "Encryption of data in transit (TLS/HTTPS) and at rest (AES-256).",
      "Access controls and authentication mechanisms.",
      "Regular security audits and vulnerability assessments.",
      "Incident response procedures for potential data breaches.",
    ],
  },
  {
    num: "13",
    icon: Database,
    title: "Data Retention",
    para: "We retain personal data only as long as necessary to provide our services, fulfill legal obligations, or resolve disputes. Uploaded photographs are automatically purged within a short period after the try-on session is completed. Merchant account data is retained for the duration of the subscription and a reasonable period thereafter.",
    bullets: [],
  },
  {
    num: "14",
    icon: Trash2,
    title: "Deletion Requests",
    para: "Merchants and Customers may request deletion of their personal data at any time by contacting us at info@vizzle.in. We will process deletion requests within 30 days, except where retention is required by law. Note that deletion of certain data may affect the ability to use some features of the service.",
    bullets: [],
  },
  {
    num: "15",
    icon: Cookie,
    title: "Cookies and Similar Technologies",
    para: "Vizzle uses cookies and similar tracking technologies to improve service performance, maintain sessions, and gather anonymous usage analytics. You may control cookie preferences through your browser settings. Disabling cookies may limit some functionalities of the service.",
    bullets: [],
  },
  {
    num: "16",
    icon: BarChart2,
    title: "Aggregated and De-Identified Information",
    para: "We may use or disclose aggregated or de-identified data (information that cannot reasonably identify any individual) for business analysis, service improvement, research, or marketing purposes. This data is not considered personal information under this Policy.",
    bullets: [],
  },
  {
    num: "17",
    icon: Baby,
    title: "Children's Privacy",
    para: "The Vizzle platform is not intended for use by individuals under the age of 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal data from children. If we become aware that a child has submitted personal data, we will take steps to delete it promptly.",
    bullets: [],
  },
  {
    num: "18",
    icon: Ban,
    title: "Prohibited Content and Uses",
    para: "Merchants and Customers must not upload or use the Vizzle service to process:",
    bullets: [
      "Images of individuals under the age of 18 for virtual try-on purposes.",
      "Photographs obtained without the subject's explicit consent.",
      "Content that is sexually explicit, hateful, defamatory, or otherwise illegal.",
      "Images that infringe on any third-party intellectual property rights.",
    ],
  },
  {
    num: "19",
    icon: Award,
    title: "Intellectual Property",
    para: "The Vizzle platform â€” including its software, AI technology, algorithms, trademarks, brand identity, and all associated content â€” is the exclusive proprietary property of Vizzle. All rights are reserved. Merchants retain ownership of their product content. Nothing in this Policy transfers any intellectual property rights from Vizzle to any party.",
    bullets: [],
  },
  {
    num: "20",
    icon: FileText,
    title: "Third-Party Intellectual Property",
    para: "Merchants are solely responsible for ensuring that product images and any other content they upload do not infringe the intellectual property rights of any third party, including but not limited to copyrights, trademarks, and design rights.",
    bullets: [],
  },
  {
    num: "21",
    icon: AlertTriangle,
    title: "Copyright Complaints",
    para: "If you believe any content on the Vizzle platform infringes your copyright, please contact us immediately at info@vizzle.in with details of the allegedly infringing content and proof of your ownership. We will investigate and take appropriate action in accordance with applicable law.",
    bullets: [],
  },
  {
    num: "22",
    icon: Shield,
    title: "Merchant Responsibilities",
    para: "Merchants are responsible for all activities that occur under their account. This includes:",
    bullets: [
      "Maintaining the confidentiality of their API keys and login credentials.",
      "Ensuring their use of the platform complies with this Policy and all applicable laws.",
      "Promptly reporting any suspected security breaches or unauthorized access.",
      "Obtaining and maintaining all necessary customer consents.",
    ],
  },
  {
    num: "23",
    icon: AlertTriangle,
    title: "No Guarantee of AI Accuracy",
    para: "Vizzle provides AI-powered virtual try-on technology on an 'as-is' basis. We do not guarantee the accuracy, completeness, or suitability of AI-generated results for any particular purpose. Customers should use generated images as a reference tool only and not as a substitute for viewing the actual product.",
    bullets: [],
  },
  {
    num: "24",
    icon: Scale,
    title: "Limitation of Liability",
    para: "To the maximum extent permitted by applicable law, Vizzle shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of or related to the use of the platform, including reliance on AI-generated content. Our total aggregate liability shall not exceed the fees paid by the Merchant in the 12 months preceding the claim.",
    bullets: [],
  },
  {
    num: "25",
    icon: Shield,
    title: "Indemnification",
    para: "Merchants agree to indemnify, defend, and hold harmless Vizzle and its officers, directors, employees, and agents from any claims, losses, damages, or expenses (including reasonable legal fees) arising out of their use of the platform, violation of this Policy, or infringement of any third-party rights.",
    bullets: [],
  },
  {
    num: "26",
    icon: Users,
    title: "Privacy Rights",
    para: "Depending on your jurisdiction, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict processing of your information. To exercise any of these rights, please contact us at info@vizzle.in. We will respond to valid requests within the legally required timeframe.",
    bullets: [],
  },
  {
    num: "27",
    icon: RefreshCcw,
    title: "Changes to This Privacy Policy",
    para: "Vizzle reserves the right to update this Privacy Policy at any time. We will notify Merchants of material changes via email or in-app notification. Continued use of the platform after the effective date of any revised Policy constitutes acceptance of the changes.",
    bullets: [],
  },
  {
    num: "28",
    icon: Headphones,
    title: "Contact Us",
    para: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us using the details below.",
    bullets: [],
    isContact: true,
  },
  {
    num: "29",
    icon: Info,
    title: "Important Legal Notice",
    para: "This Privacy Policy is governed by the laws of India. By using the Vizzle platform, Merchants and their Customers consent to the jurisdiction of Indian courts for any disputes arising under this Policy. If any provision of this Policy is found to be unenforceable, the remaining provisions will continue in full force and effect.",
    bullets: [],
  },
];

export default function PrivacyPolicy() {
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
          <Shield size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">Privacy Policy</span>
          <div className="ml-auto">
            <img src="/logo.png" alt="Vizzle" style={{ height: 28, width: "auto" }} onError={e => { e.target.style.display = "none"; }} />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-5">
            <Shield size={12} />
            Legal Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-4">Effective Date: August 25, 2026</p>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Vizzle ("we," "our," or "us") is committed to protecting the privacy and security of
            information processed through our services. This Privacy Policy explains how we collect,
            use, store, and protect personal information in connection with our AI-powered virtual
            try-on platform for Shopify merchants.
          </p>
          <div className="mt-8 h-px bg-gradient-to-r from-blue-200 via-blue-100 to-transparent" />
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map(({ num, icon: Icon, title, para, bullets, items, subsections, isContact }) => (
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
                {para && <p className="mb-3">{para}</p>}

                {/* Definitions list */}
                {items && items.length > 0 && (
                  <dl className="space-y-3 mt-2">
                    {items.map(({ term, def }) => (
                      <div key={term} className="flex gap-2">
                        <dt className="font-bold text-slate-800 shrink-0">&ldquo;{term}&rdquo;</dt>
                        <dd className="text-slate-600">&mdash; {def}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* Subsections (e.g. section 2) */}
                {subsections && subsections.map(({ label, items: subItems }) => (
                  <div key={label} className="mt-4">
                    <p className="font-bold text-slate-800 mb-2">{label}</p>
                    <ul className="space-y-1.5">
                      {subItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Standard bullet list */}
                {bullets && bullets.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {bullets.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Contact card â€” section 28 */}
                {isContact && (
                  <div className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="/logo.png" alt="Vizzle" style={{ height: 24, width: "auto" }} onError={e => { e.target.style.display = "none"; }} />
                      <span className="font-bold text-slate-900 text-sm">Vizzle</span>
                    </div>
                    {[
                      { href: "mailto:info@vizzle.in", icon: Mail, label: "Email", display: "info@vizzle.in" },
                      { href: "tel:+918310247975", icon: Phone, label: "Phone", display: "+91 83102 47975" },
                      { href: "https://www.vizzle.in", icon: Globe, label: "Website", display: "www.vizzle.in", external: true },
                    ].map(({ href, icon: ContactIcon, label, display, external }) => (
                      <a
                        key={label}
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <ContactIcon size={15} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">{display}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Get In Touch form â€” same as homepage */}
      <LeadCaptureSection />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
