import { ArrowRight, ShieldCheck, Mail } from 'lucide-react';

export default function PlanConsultationBanner() {
  const handleClick = () => {
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = formElement.querySelector('input');
      if (input) input.focus();
    }
  };

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 mb-20">
      <div
        className="relative rounded-[32px] overflow-hidden border border-[#EBE2D8] shadow-[0_12px_45px_rgba(50,35,20,0.05)] min-h-[480px] lg:min-h-[520px] flex items-center bg-[#F5EEE6]"
        style={{
          backgroundImage: "url('/images/contact/contact_demo_banner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Horizontal gradient blend to seamlessly merge photography with solid warm beige #F5EEE6 */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              'linear-gradient(to right, #F5EEE6 0%, #F5EEE6 38%, rgba(245, 238, 230, 0.85) 55%, rgba(245, 238, 230, 0.4) 70%, transparent 90%)',
          }}
        />

        {/* Mobile vertical falloff gradient mask */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              'linear-gradient(to bottom, #F5EEE6 0%, rgba(245, 238, 230, 0.95) 50%, rgba(245, 238, 230, 0.75) 75%, rgba(245, 238, 230, 0.3) 100%)',
          }}
        />

        {/* ── Content Area ── */}
        <div className="relative z-10 p-7 sm:p-12 lg:p-16 max-w-xl xl:max-w-2xl flex flex-col justify-center">
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
            Not Sure Which Plan <br />
            <span
              className="italic font-normal text-[#1C1917]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Is Right for You?
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className="text-[#57534E] text-sm sm:text-[15px] leading-relaxed mb-8 max-w-[440px]"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            Schedule a no-cost 20-minute appointment and let the team guide you through the process.
          </p>

          {/* Pill CTA Button */}
          <div>
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center gap-3 bg-[#1C1917] hover:bg-black text-white pl-6 pr-2 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98] group cursor-pointer"
            >
              <span className="text-sm sm:text-[15px] font-bold tracking-tight">
                Book A Free Demo
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E2B777] to-[#C29656] text-[#1C1917] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </button>
          </div>

          {/* Trust/Guarantee badges */}
          <div className="flex items-center gap-4 text-xs text-[#78716C] mt-8">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0" />
              <span style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>No spam.</span>
            </div>
            <span className="w-[1px] h-3 bg-stone-300" />
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-stone-500 shrink-0" />
              <span style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>Unsubscribe anytime.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
