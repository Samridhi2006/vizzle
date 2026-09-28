import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BlogNewsletterBanner() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Uses formsubmit.co — same service as the Contact form, delivers to info@vizzle.in
      const res = await fetch('https://formsubmit.co/ajax/info@vizzle.in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          name: 'Newsletter Subscriber',
          _subject: `New Newsletter Subscriber: ${email}`,
          _template: 'table',
          message: `A new user has subscribed to the Vizzle newsletter.\n\nSubscriber Email: ${email}`,
        }),
      });

      const data = await res.json();

      if (data.success === 'true' || res.ok) {
        setIsSubmitted(true);
        setEmail('');
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      // Fallback: open mailto so no subscriber is lost
      window.open(
        `mailto:info@vizzle.in?subject=Newsletter%20Subscription&body=Please%20add%20me%20to%20your%20newsletter%3A%20${encodeURIComponent(email)}`,
        '_blank'
      );
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollDown = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 mb-20">
      <div
        className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#E8DFC8]/60 shadow-[0_12px_45px_rgba(50,35,20,0.06)] min-h-[500px] lg:min-h-[540px] flex flex-col justify-between bg-[#EFE6DC]"
        style={{
          backgroundImage: "url('/images/blogs/blog_newsletter_banner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Soft atmospheric gradient overlay for perfect typography contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(239, 230, 220, 0.98) 0%, rgba(239, 230, 220, 0.95) 42%, rgba(239, 230, 220, 0.6) 62%, rgba(239, 230, 220, 0.15) 80%, transparent 100%)',
          }}
        />

        {/* Mobile vertical falloff gradient */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              'linear-gradient(to bottom, rgba(239, 230, 220, 0.97) 0%, rgba(239, 230, 220, 0.92) 65%, rgba(239, 230, 220, 0.4) 100%)',
          }}
        />

        {/* ── Content Area ── */}
        <div className="relative z-10 p-7 sm:p-12 lg:p-16 max-w-xl xl:max-w-2xl flex-1 flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <span className="text-[10.5px] sm:text-xs font-bold tracking-[0.22em] text-[#78716C] uppercase font-sans">
              STYLE &nbsp;/&nbsp; TRENDS &nbsp;/&nbsp; YOU
            </span>
            <span className="w-10 sm:w-14 h-[1px] bg-[#A8A29E]/60 inline-block" />
          </div>

          {/* Heading */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.08] tracking-tight text-[#1C1917] mb-4 sm:mb-5 font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Get AI Fashion Tips <br />
            <span
              className="italic font-normal text-[#9E6D38]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              in Your Inbox
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className="text-[#57534E] text-sm sm:text-[15px] leading-relaxed mb-7 sm:mb-8 max-w-[460px]"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            Join thousands of Indian fashion lovers and brand owners who get our weekly
            insights on AI catalogues, try-on tech, and growing smarter online.
          </p>

          {/* Email Subscription Form */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="relative flex items-center bg-white rounded-full border border-stone-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-1.5 pl-4 sm:pl-5 max-w-[430px] focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-[#9E6D38]/20 transition-all">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" strokeWidth={1.8} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent px-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 outline-none"
                style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
              />
              <button
                type="submit"
                disabled={isSubmitted || isLoading}
                className="shrink-0 bg-[#18181B] hover:bg-black active:scale-95 text-white text-xs sm:text-[13px] font-semibold px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-85"
                style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
              >
                {isSubmitted ? (
                  <span>Subscribed! ✓</span>
                ) : isLoading ? (
                  <span>Sending…</span>
                ) : (
                  <>
                    <span>It's Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              No spam. Unsubscribe anytime.
            </span>
          </div>
        </div>

        {/* ── Scroll Down Indicator ── */}
        <div className="relative z-10 w-full flex justify-center pb-5 sm:pb-6">
          <button
            type="button"
            onClick={handleScrollDown}
            className="flex flex-col items-center gap-1.5 text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer group"
          >
            <div className="w-5 h-8 rounded-full border-[1.5px] border-stone-400 group-hover:border-stone-600 flex items-start justify-center p-1 transition-colors">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="w-1 h-2 rounded-full bg-stone-500 group-hover:bg-stone-700"
              />
            </div>
            <span
              className="tracking-wide"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
            >
              Scroll Down
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
