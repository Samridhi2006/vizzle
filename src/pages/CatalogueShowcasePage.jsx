import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import LeadCaptureSection from '../components/LeadCaptureSection';
import Footer from '../components/Footer';

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ['Women Western Wear', 'Men Western Wear', 'Women Ethnic Wear', 'Men Ethnic Wear', 'Kids Wear', 'Accessories'];

const ITEMS = [
  // Women Western Wear
  { id: 1,  category: 'Women Western Wear', src: '/partners/model_cream_trench.jpg',      alt: 'Cream Trench Coat and Hat'              },
  { id: 2,  category: 'Women Western Wear', src: '/gallery/col3_trench_coat.jpg',          alt: 'Khaki Trench Coat with Handbag'         },
  { id: 3,  category: 'Women Western Wear', src: '/gallery/col2_teal_suit.jpg',            alt: 'Peacock Teal Formal Suit'               },
  { id: 4,  category: 'Women Western Wear', src: '/gallery/col5_female_denim.jpg',         alt: 'Denim Trucker Jacket & Jeans'           },
  { id: 5,  category: 'Women Western Wear', src: '/showcase/western_emerald_dress.jpg',    alt: 'Emerald Green Satin Slip Dress'         },
  { id: 6,  category: 'Women Western Wear', src: '/showcase/western_beige_coord.jpg',      alt: 'Beige Linen Blazer Co-ord Set'          },
  { id: 7,  category: 'Women Western Wear', src: '/showcase/western_black_cocktail.jpg',   alt: 'Black One-Shoulder Cocktail Dress'      },
  { id: 8,  category: 'Women Western Wear', src: '/showcase/western_leather_jacket.jpg',   alt: 'Black Biker Leather Jacket and Denim'   },

  // Men Western Wear
  { id: 9,  category: 'Men Western Wear', src: '/gallery/col1_male_portrait.jpg',        alt: 'Textured Blazer & Knit Polo'            },
  { id: 10, category: 'Men Western Wear', src: '/gallery/col2_male_full.jpg',             alt: 'Olive Bomber Jacket & Trousers'         },
  { id: 11, category: 'Men Western Wear', src: '/gallery/col2_male_seated.jpg',           alt: 'Mustard Striped Shirt & Jeans'          },
  { id: 12, category: 'Men Western Wear', src: '/showcase/men_charcoal_suit.jpg',         alt: 'Charcoal Double-Breasted Suit'          },
  { id: 13, category: 'Men Western Wear', src: '/showcase/men_wine_suit.jpg',             alt: 'Burgundy Wine Three-Piece Suit'         },
  { id: 14, category: 'Men Western Wear', src: '/showcase/men_denim_streetwear.jpg',      alt: 'Denim Jacket & Hoodie Streetwear'       },
  { id: 15, category: 'Men Western Wear', src: '/catalogue/ecom_main.jpg',                alt: 'Burgundy Polo & Cream Chinos'           },
  { id: 16, category: 'Men Western Wear', src: '/vz_menswear_blazer.jpg',                 alt: 'Brown Wool Blazer & Beige Chinos'       },

  // Women Ethnic Wear
  { id: 17, category: 'Women Ethnic Wear', src: '/gallery/col1_seated_saree.jpg',       alt: 'Bronze Kanjeevaram Saree'  },
  { id: 18, category: 'Women Ethnic Wear', src: '/gallery/col4_red_saree.jpg',           alt: 'Ruby Red Banarasi Saree'   },
  { id: 19, category: 'Women Ethnic Wear', src: '/gallery/col3_indo_western.jpg',        alt: 'Indo-Western Peplum'       },
  { id: 20, category: 'Women Ethnic Wear', src: '/gallery/col5_extra_lehenga.jpg',       alt: 'Magenta Gold Silk Lehenga' },
  { id: 21, category: 'Women Ethnic Wear', src: '/gallery/col3_extra_anarkali.jpg',      alt: 'Green Georgette Anarkali'  },
  { id: 22, category: 'Women Ethnic Wear', src: '/catalogue/market_main.jpg',            alt: 'Ethnic Market Catalogue'   },
  { id: 23, category: 'Women Ethnic Wear', src: '/brand_floral_saree.jpg',               alt: 'Floral Print Saree'        },
  { id: 24, category: 'Women Ethnic Wear', src: '/vz_thumb_lilac_saree.jpg',             alt: 'Lilac Draped Saree'        },

  // Men Ethnic Wear
  { id: 25, category: 'Men Ethnic Wear', src: '/showcase/men_sherwani_ivory.jpg',         alt: 'Ivory & Gold Embroidered Sherwani'      },
  { id: 26, category: 'Men Ethnic Wear', src: '/showcase/men_indo_blue.jpg',               alt: 'Midnight Blue Indo-Western Achkan'      },
  { id: 27, category: 'Men Ethnic Wear', src: '/gallery/col4_male_sherwani.jpg',           alt: 'Royal Raw Silk Gold Sherwani'           },
  { id: 28, category: 'Men Ethnic Wear', src: '/gallery/col1_extra_kurta.jpg',             alt: 'Teal Block-Print Kurta Churidar'        },
  { id: 29, category: 'Men Ethnic Wear', src: '/showcase/men_ethnic_bandhgala.jpg',        alt: 'Burgundy Velvet Jodhpuri Bandhgala'     },
  { id: 30, category: 'Men Ethnic Wear', src: '/showcase/men_ethnic_nehru_jacket.jpg',     alt: 'Mint Green Chikankari with Nehru Jacket'},
  { id: 31, category: 'Men Ethnic Wear', src: '/showcase/men_ethnic_draped_kurta.jpg',     alt: 'Mustard Yellow Festive Draped Kurta'    },
  { id: 32, category: 'Men Ethnic Wear', src: '/showcase/men_ethnic_black_achkan.jpg',     alt: 'Jet Black Gold Embroidered Achkan'      },

  // Kids Wear
  { id: 33, category: 'Kids Wear', src: '/showcase/kids_boy_kurta.jpg',             alt: 'Boy Yellow Silk Kurta Set'              },
  { id: 34, category: 'Kids Wear', src: '/showcase/kids_girl_sharara.jpg',           alt: 'Girl Pastel Peach Sharara Suit'         },
  { id: 35, category: 'Kids Wear', src: '/gallery/col5_boy_denim.jpg',               alt: 'Boy Denim Jacket & Jeans'               },
  { id: 36, category: 'Kids Wear', src: '/showcase/kids_girl_floral_dress.jpg',      alt: 'Girl Yellow Floral Summer Dress'        },
  { id: 37, category: 'Kids Wear', src: '/showcase/kids_boy_polo_shorts.jpg',        alt: 'Boy Striped Polo & Chino Shorts'        },
  { id: 38, category: 'Kids Wear', src: '/showcase/kids_girl_lehenga.jpg',           alt: 'Girl Magenta & Teal Festive Lehenga'    },
  { id: 39, category: 'Kids Wear', src: '/showcase/kids_boy_nehru_kurta.jpg',        alt: 'Boy Royal Blue Nehru Jacket Set'        },
  { id: 40, category: 'Kids Wear', src: '/showcase/kids_girl_tulle_frock.jpg',       alt: 'Girl Blush Pink Tulle Party Frock'      },

  // Accessories
  { id: 41, category: 'Accessories', src: '/showcase/access_handbag.jpg',         alt: 'Lilac Leather Structured Handbag'       },
  { id: 42, category: 'Accessories', src: '/showcase/access_jewellery.jpg',        alt: 'Heritage Temple Gold & Polki Choker'    },
  { id: 43, category: 'Accessories', src: '/gallery/col3_jewellery_macro.jpg',     alt: 'Pearl & Diamond Drop Earrings'          },
  { id: 44, category: 'Accessories', src: '/partners/handbag_purple.jpg',          alt: 'Luxury Lavender Quilted Handbag'        },
  { id: 45, category: 'Accessories', src: '/showcase/access_watch.jpg',            alt: 'Rose-Gold Emerald Chronograph Watch'    },
  { id: 46, category: 'Accessories', src: '/showcase/access_sunglasses.jpg',       alt: 'Designer Tortoiseshell Cat-Eye Sunglasses'},
  { id: 47, category: 'Accessories', src: '/showcase/access_gold_stack.jpg',       alt: 'Layered 18k Gold Chains & Ring Stack'   },
  { id: 48, category: 'Accessories', src: '/brand_portrait_jewellery.jpg',         alt: 'Brand Portrait Jewellery Editorial'     },
];

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    id: 1,
    question: 'Do I need professional garment photos to use Vizzle?',
    answer: "The Vizzle platform works with the types of photos that most clothing brands already use. You don't need expensive professional photos to get started. As long as your garment images are clear and meet our basic quality guidelines, Vizzle can transform them into high-quality catalogue images.",
  },
  {
    id: 2,
    question: 'Can I purchase additional credits if they run out?',
    answer: 'Yes. Credits are flexible and designed to fit around your business needs. If you need more credits, you can purchase additional credits at any time without interrupting your workflow.',
  },
  {
    id: 3,
    question: 'Do unused credits expire?',
    answer: "Unused credits do not expire, so you can use them whenever you need them. If you are unsure how many credits you will need for your next batch, our team can help you estimate based on your product count. It's also a good idea to upload all your garment images at once to avoid wasted credits.",
  },
  {
    id: 4,
    question: 'Can Vizzle handle a large product catalogue all at once?',
    answer: 'Yes. Vizzle is built to process large product catalogues efficiently. It eliminates the time-intensive process of creating catalogue images at scale, helping brands generate consistent, high-quality images quickly and easily.',
  },
  {
    id: 5,
    question: 'Do catalogue images created by Vizzle suit Amazon, Flipkart or Myntra listings?',
    answer: 'Yes. Vizzle creates high-quality catalogue images that are suitable for major marketplaces such as Amazon, Flipkart, and Myntra, provided they meet each platform\'s listing requirements. You can download them directly and upload them to your marketplace seller account.',
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: isOpen ? '1.5px solid #CBD5E1' : '1.5px solid rgba(226,232,240,0.9)',
        boxShadow: isOpen ? '0 4px 16px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      {/* Question row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px',
        padding: '20px 24px',
      }}>
        <span style={{
          fontSize: '15px', fontWeight: 700,
          color: '#0F172A', letterSpacing: '-0.02em',
          lineHeight: 1.45, flex: 1,
        }}>
          {faq.question}
        </span>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: isOpen ? '#FFF1F2' : '#F1F5F9',
          color: isOpen ? '#F43F5E' : '#64748B',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
          transition: 'background 0.25s ease, color 0.25s ease',
        }}>
          {isOpen
            ? <ChevronUp size={15} strokeWidth={2.5} />
            : <ChevronDown size={15} strokeWidth={2.5} />}
        </div>
      </div>

      {/* Animated answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '4px 24px 24px',
              fontSize: '13.5px', color: '#475569',
              lineHeight: 1.8,
              borderTop: '1px solid rgba(241,245,249,0.8)',
              paddingTop: '14px',
            }}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQSection() {
  const [openId, setOpenId] = useState(null);
  return (
    <section style={{
      background: '#F8FAFF',
      padding: '80px 24px 100px',
      fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
            fontWeight: 900, color: '#0F172A',
            letterSpacing: '-0.04em', lineHeight: 1.15,
            margin: '0 0 12px',
          }}>
            Any Questions?{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              We Have Answers.
            </span>
          </h2>
          <p style={{
            fontSize: '14.5px', color: '#64748B',
            maxWidth: '480px', margin: '0 auto', lineHeight: 1.7,
          }}>
            Everything you need to know before you start your first AI catalogue photoshoot.
          </p>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(prev => (prev === faq.id ? null : faq.id))}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ item }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#F1F5F9',
        position: 'relative',
        aspectRatio: '3/4',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
    >
      <img
        src={item.src}
        alt={item.alt}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.5s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.00)')}
        onError={e => { e.currentTarget.parentElement.style.background = '#CBD5E1'; e.currentTarget.style.display = 'none'; }}
      />
      {/* Hover gradient overlay + label */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
        opacity: 0, transition: 'opacity 0.3s ease',
        display: 'flex', alignItems: 'flex-end', padding: '14px',
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
      >
        <span style={{
          color: '#fff', fontSize: '10.5px', fontWeight: 700,
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          borderRadius: '999px', padding: '4px 12px',
          border: '1px solid rgba(255,255,255,0.25)',
        }}>
          {item.category}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CatalogueShowcasePage() {
  const [active, setActive] = useState('Women Western Wear');
  const filtered = ITEMS.filter(i => i.category === active);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #F1F5F9',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 600, color: '#475569',
          textDecoration: 'none', transition: 'color 0.2s ease',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0891B2')}
          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back to Home
        </Link>
        <div style={{ width: '1px', height: '20px', background: '#E2E8F0' }} />
        <img src="/viz.png" alt="Vizzle" style={{ height: '28px', width: 'auto' }} />
      </div>

      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h1 style={{
            fontSize: 'clamp(1.9rem, 4vw, 3rem)',
            fontWeight: 900, color: '#0F172A',
            letterSpacing: '-0.04em', lineHeight: 1.13,
            margin: '0 0 14px',
          }}>
            Your Products. Real Models.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Zero Photoshoot.
            </span>
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
            Browse AI catalogue photoshoots created for Indian fashion brands — across every category, style, and look.
          </p>
        </motion.div>

        {/* ── Filter Pills ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '36px' }}>
          {CATEGORIES.map(cat => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: '9px 20px', borderRadius: '999px',
                  border: 'none',
                  background: isActive ? '#0F172A' : '#F1F5F9',
                  color: isActive ? '#fff' : '#475569',
                  fontSize: '12px', fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 10px rgba(15,23,42,0.22)' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569'; } }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >
            {filtered.map(item => <Card key={item.id} item={item} />)}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── Lead Capture ─────────────────────────────────────────────────── */}
      <LeadCaptureSection />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Footer />

    </div>
  );
}
