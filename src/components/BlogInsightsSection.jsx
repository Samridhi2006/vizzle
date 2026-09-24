import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ─── Blog Data ────────────────────────────────────────────────────────────────
const BLOGS = [
  {
    id: 'streetwear',
    image: '/blogs/blog_banner_streetwear.jpg',
    category: 'AI Catalogue Creation',
    date: 'August 2026',
    title: 'Automate Catalog Photography for Seasonal Launches',
    excerpt:
      'How to launch new streetwear and western collections 10x faster with AI studio pipelines without physical shoots.',
    color: '#0891B2',
  },
  {
    id: 'couture',
    image: '/blogs/blog_banner_couture.jpg',
    category: 'AI Catalog Creation',
    date: 'August 2026',
    title: 'Standardize Product Images Across Multi-Channel Catalogues',
    excerpt:
      'How to eliminate inconsistent model lighting, messy backgrounds, and mixed poses across your Myntra, Amazon, and Shopify stores.',
    color: '#4F46E5',
  },
  {
    id: 'coords',
    image: '/blogs/blog_banner_coords.jpg',
    category: 'AI Fashion Catalogue',
    date: 'August 2026',
    title: 'AI Photoshoot for Clothing Brands: Complete Scaling Guide',
    excerpt:
      'Everything modern direct-to-consumer fashion labels need to know about setting up virtual model workflows.',
    color: '#0891B2',
  },
];

// ─── Single Blog Card ─────────────────────────────────────────────────────────
function BlogCard({ blog, index }) {
  return (
    <Link to="/blogs" style={{ textDecoration: 'none', display: 'block' }}>
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: '#fff',
        borderRadius: '24px',
        border: '1px solid rgba(226,232,240,0.8)',
        padding: '16px 16px 24px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 48px rgba(0,0,0,0.11)',
        transition: { duration: 0.25 },
      }}
    >
      {/* ── Banner Image ── */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#E2E8F0',
        marginBottom: '16px',
        position: 'relative',
      }}>
        <motion.img
          src={blog.image}
          alt={blog.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onError={e => {
            // Fallback gradient placeholder while image loads
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.style.background =
              'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)';
          }}
        />
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category + Date */}
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: blog.color,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '8px',
        }}>
          {blog.category}
          <span style={{ color: '#94A3B8', fontWeight: 500, marginLeft: '6px' }}>
            · {blog.date}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.02em',
          lineHeight: 1.4,
          margin: '0 0 8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          transition: 'color 0.2s ease',
        }}>
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p style={{
          fontSize: '13px',
          color: '#64748B',
          lineHeight: 1.65,
          margin: '0 0 16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {blog.excerpt}
        </p>

        {/* Learn More link */}
        <Link
          to="/blogs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0F172A',
            marginTop: 'auto',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#0891B2'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#0F172A'; }}
        >
          Learn More
          <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      </div>
    </motion.article>
    </Link>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function BlogInsightsSection() {
  return (
    <section
      id="blog-insights"
      style={{
        background: '#F8FAFF',
        padding: '80px 24px 88px',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.9rem, 4vw, 2.75rem)',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            margin: '0 0 14px',
          }}>
            Ideas Shaping the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Future of Fashion Commerce
            </span>
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#64748B',
            lineHeight: 1.75,
            margin: 0,
          }}>
            Stay ahead with expert insights on AI-generated fashion imagery, virtual models,
            and digital commerce.
          </p>
        </motion.div>

        {/* ── 3-Card Blog Grid ─────────────────────────────── */}
        <div
          className="vz-blog-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px',
          }}
        >
          {BLOGS.map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} index={i} />
          ))}
        </div>

        {/* ── CTA Button ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.35 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}
        >
          <a
            href="https://medium.com/@info_58939/try-before-you-buy-how-vizzle-solves-indias-online-fashion-return-problem-2d456c1d97d4"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              background: '#fff',
              color: '#0F172A',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'all 0.25s ease',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#06B6D4';
              e.currentTarget.style.color = '#0891B2';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(8,145,178,0.15)';
              e.currentTarget.querySelector('.arrow-icon').style.transform = 'translateX(4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#0F172A';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
              e.currentTarget.querySelector('.arrow-icon').style.transform = 'translateX(0px)';
            }}
          >
            <span>View More Blogs</span>
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="arrow-icon"
              style={{ transition: 'transform 0.2s ease' }}
            />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
