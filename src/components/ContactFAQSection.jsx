import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    id: 1,
    q: 'How do I book a free demo with Vizzle?',
    a: "Booking a demo is simple. Fill in the contact form on this page with your name, brand name, email, and phone number — and our team will get back to you within one business day to schedule a session at a time that works for you. The demo is a live walkthrough of the platform, where our team shows you how AI catalogue creation and virtual try-on work for your specific type of business. The demo is customizable for any use case — maybe you're a boutique, an e-commerce store or a retail chain. There is no commitment required and no sales pressure.",
  },
  {
    id: 2,
    q: 'How fast is  Vizzle team to reply to enquiries?',
    a: "We respond to all queries within a day, usually. Or you can directly contact us through phone or WhatsApp with your urgent queries on time-sensitive work such as product launches, trade show deployments, or any work which requires immediate help or attention. Phone No. +91 8310247975. We know there's a world of fashion out there and like to ensure there's no waiting around when you require your assistance.",
  },
  {
    id: 3,
    q: 'Can you tailor Vizzle for my own environment of my business?',
    a: "Yes. Whether you're an e-commerce, D2C brand, a retail business with several storefronts, or a fashion marketplace, AI Vizzle is optimized to suit various business models. If your technical needs are somewhat unique, like custom API integrations and/or a white-labeled solution or even a kiosk setup with some branded UI, we can chat about what a custom setup would look like for you. Dedicated Support and Customized Onboarding Process for Enterprise clients and large Scale Deployments. Please contact us via the contact form or phone to open up that conversation!",
  },
  {
    id: 4,
    q: 'What kind of support does Vizzle provide after sign-up?',
    a: "Once you are on the platform, our support team is available to help you with everything from uploading your first garment batch to troubleshooting technical queries. New users also get an onboarding walkthrough to make sure you are comfortable with the dashboard, understand how credits work, and know how to get the best quality outputs from your garment images. For offline kiosk clients, our team provides assisted on-ground deployment and trains your in-store staff on how to manage the system. Documentation and resources for self-service are available, but when you need a human, a member of our team will always be on hand.",
  },
  {
    id: 5,
    q: 'Would Vizzle be appropriate for use in smaller boutiques, or just for larger brands?',
    a: "Vizzle is built for fashion businesses of all sizes. Small boutiques and solo clothing sellers use it to create professional catalogue images without the budget for a photoshoot. Growing D2C brands use it to keep up with the pace of new collection launches. It is utilized by big manufacturers and retail chains in the production of bulk catalogues and for store kiosk rollouts. The platform scales with your business. You can start on a small plan with a limited number of catalogue outputs and upgrade as your needs grow. The free trial is specifically designed so that smaller brands can test the quality and value of the platform before committing to any paid plan.",
  },
];

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`bg-white rounded-2xl border ${isOpen ? 'border-slate-300 shadow-sm' : 'border-slate-200/90 shadow-xs'
        } hover:border-slate-300 transition-all overflow-hidden`}
    >
      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer select-none gap-4"
      >
        <span className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight flex-1">
          {item.q}
        </span>

        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
            }`}
        >
          {isOpen ? (
            <ChevronUp size={16} strokeWidth={2.5} />
          ) : (
            <ChevronDown size={16} strokeWidth={2.5} />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 text-sm sm:text-[14.5px] leading-relaxed text-slate-600 border-t border-slate-100/80 mt-1 pt-4">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full py-16 sm:py-20 px-4">
      {/* ── Header Section ── */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 text-center tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 text-center text-xs sm:text-sm mt-3 mb-12 max-w-2xl mx-auto leading-relaxed">
          Vizzle helps fashion brands generate high-quality catalogue visuals faster while reducing production effort and maintaining consistent visual quality across collections.
        </p>
      </div>

      {/* ── Accordion List ── */}
      <div className="max-w-4xl mx-auto px-4 w-full space-y-4 mb-20">
        {FAQS.map((faq, index) => (
          <FAQItem
            key={faq.id}
            item={faq}
            index={index}
            isOpen={openIndex === index}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  );
}
