/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Play, Star, Sparkles, Zap, Shirt } from 'lucide-react';

const SLIDES = [
  { src: '/hero_model_1.jpg', label: 'Couture Violet Gown', tag: 'AI Catalog Shoot' },
  { src: '/hero_model_2.jpg', label: 'Magenta Power Blazer', tag: 'Virtual Try-On' },
  { src: '/hero_model_3.jpg', label: 'Before / After Draping', tag: 'Instant Try-On' },
  { src: '/hero_model_4.jpg', label: 'Indigo Satin Editorial', tag: 'AI Catalog Shoot' },
];

const AVATARS = [
  { initials: 'SA', color: '#2563EB' },
  { initials: 'MK', color: '#1D4ED8' },
  { initials: 'PR', color: '#0284C7' },
  { initials: 'LT', color: '#4F46E5' },
];

const HERO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  .hero-root * { font-family: 'Plus Jakarta Sans', Outfit, sans-serif; }
  @keyframes heroFadeIn { from { opacity:0; transform:scale(1.04); } to { opacity:1; transform:scale(1); } }
  @keyframes fadeSlideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulseGlow { 0%,100% { opacity:0.55; transform:scale(1); } 50% { opacity:0.85; transform:scale(1.08); } }
  @keyframes badgePulse { 0%,100% { box-shadow:0 0 0 0 rgba(37,99,235,0.35); } 50% { box-shadow:0 0 0 8px rgba(37,99,235,0); } }
  @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
  @keyframes slideInLeft { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
  @keyframes slideInRight { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
  .hero-gradient-text {
    background: linear-gradient(135deg, #2563EB 0%, #3B82F6 40%, #4F46E5 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .hero-primary-btn { background:linear-gradient(135deg,#2563EB,#4F46E5); transition:all 0.3s ease; box-shadow:0 4px 20px rgba(37,99,235,0.35); }
  .hero-primary-btn:hover { background:linear-gradient(135deg,#1D4ED8,#4338CA); box-shadow:0 6px 28px rgba(37,99,235,0.5); transform:translateY(-2px); }
  .hero-secondary-btn { border:1.5px solid rgba(37,99,235,0.35); background:rgba(37,99,235,0.06); backdrop-filter:blur(8px); transition:all 0.3s ease; }
  .hero-secondary-btn:hover { background:rgba(37,99,235,0.12); border-color:rgba(37,99,235,0.7); transform:translateY(-2px); box-shadow:0 4px 16px rgba(37,99,235,0.2); }
  .hero-left-col { animation:slideInLeft 0.75s cubic-bezier(0.4,0,0.2,1) 0.1s both; }
  .hero-right-col { animation:slideInRight 0.75s cubic-bezier(0.4,0,0.2,1) 0.25s both; }
`;

function AvatarGroup() {
  return (
    <div className="flex items-center gap-3 mt-6">
      <div className="flex -space-x-2">
        {AVATARS.map((av, i) => (
          <div
            key={i}
            style={{ backgroundColor: av.color, zIndex: AVATARS.length - i }}
            className="relative w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-md"
          >
            {av.initials}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-blue-500 text-blue-500" />
          ))}
        </div>
        <span className="text-xs text-gray-500 mt-0.5">
          Trusted by{' '}
          <span className="font-semibold text-gray-700">100+ fashion labels</span>
        </span>
      </div>
    </div>
  );
}

function GlassChip({ icon: Icon, text, position }) {
  const isTopLeft = position === 'top-left';
  return (
    <div
      className={
        'absolute flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold text-white shadow-xl ' +
        (isTopLeft ? 'top-4 left-4' : 'bottom-4 right-4')
      }
      style={{
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.25)',
        animation: 'fadeSlideUp 0.6s ease both',
      }}
    >
      <Icon size={14} className="shrink-0" />
      {text}
    </div>
  );
}

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const advance = useCallback(
    (next) => {
      if (isAnimating) return;
      setPrev(current);
      setIsAnimating(true);
      setCurrent(next);
      setTimeout(() => {
        setPrev(null);
        setIsAnimating(false);
      }, 600);
    },
    [current, isAnimating]
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      advance((current + 1) % SLIDES.length);
    }, 3200);
    return () => clearInterval(timerRef.current);
  }, [current, advance]);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    advance(idx);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto lg:max-w-none">
      {/* Card */}
      <div
        className="relative overflow-hidden shadow-2xl"
        style={{ borderRadius: '2rem', aspectRatio: '3/4', maxHeight: '540px' }}
      >
        {/* Outgoing */}
        {prev !== null && (
          <img
            key={'prev-' + prev}
            src={SLIDES[prev].src}
            alt={SLIDES[prev].label}
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ zIndex: 1 }}
          />
        )}
        {/* Active */}
        <img
          key={'slide-' + current}
          src={SLIDES[current].src}
          alt={SLIDES[current].label}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ zIndex: 2, animation: 'heroFadeIn 0.6s cubic-bezier(0.4,0,0.2,1) both' }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
          }}
        />
        {/* Slide label */}
        <div className="absolute bottom-12 left-4 text-white" style={{ zIndex: 4 }}>
          <p className="text-[10px] uppercase tracking-widest opacity-70">
            {SLIDES[current].tag}
          </p>
          <p className="text-sm font-semibold leading-tight">{SLIDES[current].label}</p>
        </div>
        {/* Glass chips */}
        <div style={{ zIndex: 5, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <GlassChip icon={Zap} text="10x Faster Production" position="top-left" />
          <GlassChip icon={Shirt} text="Instant Virtual Try-On" position="bottom-right" />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            id={'hero-slide-dot-' + i}
            aria-label={'Go to slide ' + (i + 1)}
            className="transition-all duration-300"
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '9999px',
              background:
                i === current
                  ? 'linear-gradient(90deg, #7C3AED, #6366F1)'
                  : '#D1D5DB',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HeroSection({ setIsFormOpen }) {
  return (
    <>
      {/* Injected CSS */}
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      <section
        className="hero-root relative w-full overflow-hidden"
        style={{ background: '#FAFAFA', minHeight: '100vh', paddingTop: '108px', paddingBottom: '80px' }}
      >
        {/* Radial mesh glows */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
        >
          <div
            style={{
              position: 'absolute', top: '-10%', left: '-5%',
              width: '600px', height: '600px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
              animation: 'pulseGlow 6s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute', top: '20%', right: '-8%',
              width: '500px', height: '500px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%)',
              animation: 'pulseGlow 8s ease-in-out 2s infinite',
            }}
          />
          <div
            style={{
              position: 'absolute', bottom: '-15%', left: '35%',
              width: '700px', height: '400px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
              animation: 'pulseGlow 10s ease-in-out 1s infinite',
            }}
          />
        </div>

        {/* Main content grid */}
        <div
          className="relative mx-auto px-5 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-8"
          style={{ maxWidth: '1280px', zIndex: 1 }}
        >
          {/* ── LEFT COLUMN (60%) ── */}
          <div
            className="hero-left-col flex-1 lg:basis-3/5 flex flex-col items-center lg:items-start text-center lg:text-left"
            style={{ paddingTop: '12px' }}
          >
            {/* Top badge */}
            <div
              id="hero-top-badge"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 cursor-default select-none"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(99,102,241,0.1))',
                border: '1px solid rgba(37,99,235,0.25)',
                color: '#7C3AED',
                animation: 'badgePulse 2.5s ease-in-out infinite',
              }}
            >
              <Sparkles size={15} className="shrink-0" />
              <span>&#9889; Next-Gen AI Fashion &amp; Virtual Try-On</span>
            </div>

            {/* H1 */}
            <h1
              className="font-black leading-tight tracking-tight mb-5"
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
                color: '#0F0A1E',
                letterSpacing: '-0.02em',
              }}
            >
              Transform Your Fashion Brand with{' '}
              <span className="hero-gradient-text">AI Virtual Try-On</span>{' '}
              &amp; Studio-Quality Catalogs.
            </h1>

            {/* Subheading */}
            <p
              className="mb-8 max-w-xl"
              style={{
                fontSize: 'clamp(0.95rem, 1.4vw, 1.125rem)',
                color: '#6B7280',
                lineHeight: '1.75',
              }}
            >
              Generate hyper-realistic model imagery and seamless virtual try-on
              experiences in seconds &mdash; without expensive photoshoots.
            </p>

            {/* CTA group */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                id="hero-cta-primary"
                onClick={() => setIsFormOpen && setIsFormOpen(true)}
                className="hero-primary-btn flex items-center gap-2 px-7 py-4 rounded-full text-white font-bold text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                Book Free Demo
                <ArrowRight size={17} className="shrink-0" />
              </button>

              <a
                id="hero-cta-secondary"
                href="https://www.youtube.com/@vizzle_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-secondary-btn flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm sm:text-base w-full sm:w-auto justify-center"
                style={{ color: '#7C3AED' }}
              >
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                  style={{ background: 'rgba(37,99,235,0.12)' }}
                >
                  <Play
                    size={13}
                    className="fill-[#7C3AED] text-[#7C3AED]"
                    style={{ marginLeft: '2px' }}
                  />
                </span>
                Watch 1-Min Demo
              </a>
            </div>

            {/* Trust avatars */}
            <AvatarGroup />

            {/* Stats */}
            <div
              className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-8 pt-8"
              style={{ borderTop: '1px solid rgba(37,99,235,0.12)' }}
            >
              {[
                { value: '10x', label: 'Faster Catalog Shoots' },
                { value: '98%', label: 'Photorealism Score' },
                { value: '60s', label: 'Time-to-Model' },
              ].map((stat) => (
                <div key={stat.value} className="flex flex-col">
                  <span
                    className="font-black text-2xl"
                    style={{ color: '#7C3AED', lineHeight: 1 }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN (40%) — Carousel ── */}
          <div className="hero-right-col flex-1 lg:basis-2/5 w-full flex flex-col items-center">
            <Carousel />
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
