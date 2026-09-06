import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Category data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'women-western',
    label: 'Women Western Wear',
    items: [
      { src: '/partners/models_lavender_duo.jpg',  alt: 'Lavender blazer duo lookbook'            },
      { src: '/partners/model_cream_trench.jpg',    alt: 'Cream trench coat editorial'             },
      { src: '/gallery/col3_trench_coat.jpg',       alt: 'Olive-khaki wrap trench coat'            },
      { src: '/gallery/col5_female_denim.jpg',      alt: 'Light wash denim trucker jacket'         },
      { src: '/gallery/col2_teal_suit.jpg',         alt: 'Peacock teal tailored pantsuit'          },
      { src: '/gallery/col3_extra_anarkali.jpg',    alt: 'Forest green Anarkali'                   },
      { src: '/gallery/col1_blouse.jpg',            alt: 'Navy boho silk blouse'                   },
      { src: '/gallery/col5_extra_lehenga.jpg',     alt: 'Magenta gold tissue silk lehenga'        },
    ],
  },
  {
    id: 'men-western',
    label: 'Men Western Wear',
    items: [
      { src: '/gallery/col1_male_portrait.jpg',    alt: 'Charcoal blazer editorial portrait'      },
      { src: '/gallery/col2_male_full.jpg',         alt: 'Olive bomber jacket full-length'         },
      { src: '/gallery/col2_male_seated.jpg',       alt: 'Mustard linen overshirt seated'          },
      { src: '/gallery/col5_wine_suit.jpg',         alt: 'Wine-red asymmetric peplum suit'         },
      { src: '/gallery/col2_extra_suit.jpg',        alt: 'Deep burgundy slim-fit suit'             },
      { src: '/gallery/col4_blazer_back.jpg',       alt: 'Ivory blazer back profile'               },
      { src: '/catalogue/ecom_main.jpg',            alt: 'E-commerce catalogue main shot'          },
      { src: '/vz_menswear_blazer.jpg',             alt: 'Vizzle menswear blazer lookbook'         },
    ],
  },
  {
    id: 'women-ethnic',
    label: 'Women Ethnic Wear',
    items: [
      { src: '/gallery/col1_seated_saree.jpg',     alt: 'Bronze Kanjeevaram saree seated'         },
      { src: '/gallery/col4_red_saree.jpg',         alt: 'Ruby red Banarasi bridal saree'          },
      { src: '/gallery/col3_indo_western.jpg',      alt: 'Indo-western peplum palazzo'             },
      { src: '/gallery/col5_extra_lehenga.jpg',     alt: 'Magenta gold silk lehenga'               },
      { src: '/gallery/col3_extra_anarkali.jpg',    alt: 'Forest green Anarkali suit'              },
      { src: '/catalogue/market_main.jpg',          alt: 'Ethnic market catalogue'                 },
      { src: '/vz_thumb_lilac_saree.jpg',           alt: 'Lilac draped saree thumb'                },
      { src: '/brand_floral_saree.jpg',             alt: 'Floral print saree brand shot'           },
    ],
  },
  {
    id: 'men-ethnic',
    label: 'Men Ethnic Wear',
    items: [
      { src: '/gallery/col4_male_sherwani.jpg',    alt: 'Cream gold raw silk sherwani'            },
      { src: '/gallery/col1_extra_kurta.jpg',       alt: 'Teal block-print kurta churidar'         },
      { src: '/catalogue/social_main.jpg',          alt: 'Social media catalogue shot'             },
      { src: '/catalogue/lookbook_main.jpg',        alt: 'Fashion lookbook main shot'              },
      { src: '/catalogue/brand_main.jpg',           alt: 'Brand catalogue main shot'               },
      { src: '/vz_thumb_violet_shirt.jpg',          alt: 'Violet ethnic shirt thumb'               },
    ],
  },
  {
    id: 'kids',
    label: 'Kids Wear',
    items: [
      { src: '/gallery/col5_boy_denim.jpg',        alt: 'Boy in light blue denim jacket'          },
      { src: '/catalogue/ads_main.jpg',             alt: 'Kids fashion ads catalogue'              },
      { src: '/ai_models_family_lineup.jpg',        alt: 'AI model family lineup'                  },
      { src: '/catalogue/ads_base.jpg',             alt: 'Kids catalogue base shot'                },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    items: [
      { src: '/partners/handbag_purple.jpg',       alt: 'Lilac leather luxury handbag'            },
      { src: '/gallery/col3_jewellery_macro.jpg',   alt: 'Rose-gold pearl earrings macro'          },
      { src: '/partners/rack_pastels.jpg',           alt: 'Pastel wardrobe rack'                    },
      { src: '/vz_jewellery_pearl.jpg',             alt: 'Pearl jewellery Vizzle'                  },
      { src: '/vz_thumb_sunglasses.jpg',            alt: 'Sunglasses product thumb'                },
      { src: '/brand_portrait_jewellery.jpg',       alt: 'Brand portrait jewellery shot'           },
    ],
  },
];

// ─── Single card ──────────────────────────────────────────────────────────────
function ShowcaseCard({ src, alt, category }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#F1F5F9',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.14)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
    >
      {/* Image */}
      <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.00)')}
          onError={e => { e.currentTarget.parentElement.style.background = '#CBD5E1'; e.currentTarget.style.display = 'none'; }}
        />
      </div>

      {/* Bottom label chip */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(15,23,42,0.72)',
        backdropFilter: 'blur(8px)',
        borderRadius: '999px',
        padding: '4px 11px',
        fontSize: '10px',
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '0.02em',
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        {category}
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CatalogueShowcase() {
  const [selected, setSelected] = useState(CATEGORIES[0].id);
  const active = CATEGORIES.find(c => c.id === selected);

  return (
    <section
      id="catalogue-showcase"
      style={{
        background: '#F8FAFF',
        padding: '80px 24px 88px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: '36px' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.9rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            margin: '0 0 12px',
          }}>
            Your Products. Real Models.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Zero Photoshoot.
            </span>
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
            Browse AI catalogue photoshoots created for Indian fashion brands — across every category, style, and look.
          </p>
        </motion.div>

        {/* ── Filter Pills ─────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '36px',
        }}>
          {CATEGORIES.map(cat => {
            const isActive = cat.id === selected;
            return (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  border: isActive ? 'none' : '1px solid transparent',
                  background: isActive ? '#0F172A' : 'transparent',
                  color: isActive ? '#fff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 10px rgba(15,23,42,0.2)' : 'none',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = '#0F172A';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Masonry Grid ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >
            {active.items.map((item, i) => (
              <ShowcaseCard
                key={item.src}
                src={item.src}
                alt={item.alt}
                category={active.label}
              />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
