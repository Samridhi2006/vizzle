import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    id: 1,
    question: 'What is Vizzle and how does it work?',
    answer:
      'Vizzle is an AI-powered platform built for Indian fashion brands, clothing retailers, and e-commerce sellers. It turns basic garment images into professional, studio-quality catalogue photos — without any physical photoshoot. You simply upload a flat-lay, hanger, or mannequin photo of your garment. The AI then places it on a model, adds a clean background, adjusts the lighting, and delivers a catalogue-ready image within minutes. No studio booking, no model hiring, no editing software, and no waiting days for results. Vizzle also offers an AI virtual try-on feature that lets your customers see how an outfit looks on their own body — available for both your website and offline retail kiosks. Everything is designed to help fashion businesses grow faster, spend less, and look more professional across every sales channel.',
  },
  {
    id: 2,
    question: 'Do I need professional photos of my garments to get started?',
    answer:
      'No. You do not need a professional photographer or a studio setup to begin using Vizzle. The platform is built to work with the kind of garment images most clothing brands already have on hand. A simple flat-lay photo on a plain surface, a hanger shot against a wall, or even a mannequin image is enough to get high-quality results. Once you upload the image, our AI handles everything else — model placement, background, lighting, fabric draping, and final finishing. Most users are surprised by how little they need to provide to get catalogue-quality outputs. If your garment photo is clear and the fabric details are visible, Vizzle will produce a clean, professional result every time.',
  },
  {
    id: 3,
    question: 'How is an AI catalogue photoshoot different from a traditional photoshoot?',
    answer:
      'A traditional photoshoot involves booking a photography studio, hiring one or more models, coordinating a stylist, shooting each garment individually, and then waiting for post-production editing to be completed. The full process for a single collection can take one to two weeks and cost anywhere from ₹15,000 to ₹50,000 or more depending on the number of products and the city. With an AI catalogue photoshoot on Vizzle, the entire process happens digitally. You upload your garment images, choose your preferred model type and background, and receive professional catalogue photos within minutes. There are no logistics to manage, no scheduling delays, and no surprise costs. For brands that launch new collections frequently or manage large catalogues, this speed and cost saving makes a significant difference to how fast they can go to market.',
  },
  {
    id: 4,
    question: 'What types of clothing and fashion categories does Vizzle support?',
    answer:
      'Vizzle supports a wide range of Indian and international fashion categories. On the ethnic wear side, it handles sarees, lehengas, salwar kameez, anarkalis, kurtas, sherwanis, ethnic co-ord sets, and bridal wear — including garments with intricate embroidery, zari work, prints, and embellishments. For western and casual wear, it works with dresses, tops, shirts, trousers, and casual co-ords. It also supports men\'s fashion, children\'s clothing across all age groups, and accessories. Because Vizzle is specifically trained on Indian garment types, it understands how traditional fabrics drape and how different silhouettes fall on a body — giving you results that are accurate to your product, not just a generic AI overlay.',
  },
  {
    id: 5,
    question: 'Can Vizzle help my brand sell on Amazon, Flipkart, or Myntra?',
    answer:
      'Yes. All catalogue images produced by Vizzle are high-resolution and formatted to meet the image quality standards of major Indian marketplaces including Amazon, Flipkart, Myntra, and Meesho. The images are clean, well-lit, and free of background distractions — which is exactly what marketplace algorithms and buyers respond to best. You can download your AI-generated catalogue photos directly from the platform and upload them to your seller account without any further editing. Many brands using Vizzle report better click-through rates and stronger conversion on their marketplace listings after switching from low-quality product photos to AI catalogue images, simply because consistent, professional visuals build more trust with buyers.',
  },
  {
    id: 6,
    question: 'What is the AI virtual try-on feature and who is it for?',
    answer:
      'Vizzle\'s AI virtual try-on feature lets your customers see how any outfit looks on their own body — before they place an order. The shopper uploads a photo of themselves or uses their device camera, selects an outfit from your catalogue, and the AI places the garment on their body with realistic draping and fit. The result appears in seconds and can be downloaded or shared. This feature is available for online fashion stores through a simple website integration, and also for offline retail environments through a kiosk or tablet setup in your store or shopping mall. It is particularly valuable for categories like sarees, bridal wear, and ethnic fashion, where the way a garment drapes on a specific body type matters a great deal to the buying decision. Brands that offer virtual try-on see higher engagement, lower return rates, and more confident customers.',
  },
  {
    id: 7,
    question: 'Is there a free trial and how do I get started?',
    answer:
      'Yes. Vizzle offers a free trial for new users so you can test the platform with your own garments before committing to any paid plan. No credit card is required to start the trial. Simply sign up, upload two or three of your garment images, and see the AI catalogue outputs for yourself. This gives you a real, hands-on feel for the quality of the results and how the platform fits your workflow. If you want to see the virtual try-on feature in action for your store or kiosk setup, you can book a free demo with our team — we will walk you through everything live and answer any questions specific to your business. Getting started takes less than five minutes.',
  },
];

// ─── Single Accordion Item ────────────────────────────────────────────────────
function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: faq.id * 0.05 }}
      onClick={onToggle}
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: isOpen ? '1.5px solid rgba(6,182,212,0.35)' : '1.5px solid rgba(226,232,240,0.9)',
        padding: '20px',
        boxShadow: isOpen
          ? '0 4px 20px rgba(8,145,178,0.08)'
          : '0 1px 4px rgba(0,0,0,0.03)',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Question row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: isOpen ? '#0891B2' : '#0F172A',
          letterSpacing: '-0.02em',
          lineHeight: 1.45,
          margin: 0,
          flex: 1,
          transition: 'color 0.25s ease',
        }}>
          {faq.question}
        </h3>

        {/* Toggle pill */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isOpen ? 'rgba(8,145,178,0.08)' : '#F1F5F9',
          color: isOpen ? '#0891B2' : '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.25s ease, color 0.25s ease',
        }}>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ChevronDown size={15} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>

      {/* Answer with AnimatePresence */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontSize: '13.5px',
              color: '#475569',
              lineHeight: 1.8,
              margin: '14px 0 0',
              paddingTop: '14px',
              borderTop: '1px solid #F1F5F9',
            }}>
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function FAQSection() {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      style={{
        background: '#F8FAFF',
        padding: '80px 24px 88px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            margin: '0 0 12px',
          }}>
            Frequently Asked{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Questions
            </span>
          </h2>
          <p style={{
            fontSize: '14.5px',
            color: '#64748B',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Everything you want to know about AI catalogue photoshoots and <span style={{ whiteSpace: 'nowrap' }}>virtual try-on</span>
          </p>
        </motion.div>

        {/* ── Accordion List ───────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map(faq => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
