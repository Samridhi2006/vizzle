/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Homesection({ launchingRef, aboutRef, setIsFormOpen }) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (ref, offset = 0) => {
    if (ref && ref.current) {
      const top =
        ref.current.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden py-28 z-40 bg-[#F9F3FA]">
      <div className="container mx-auto my-8 px-1 flex flex-col items-center justify-evenly gap-6 sm:flex-row sm:gap-0 sm:my-4">
        
        {/* LEFT CONTENT */}
        <div className="max-w-2xl flex flex-col items-center sm:items-start">
          
          {/* Header Buttons */}
          <div className="hidden flex-wrap justify-start max-w-fit px-1 py-1 text-xs shadow-inner rounded-full bg-[#1D8DB2] sm:flex">
            <button
              onClick={() => scrollToSection(aboutRef, -100)}
              className="px-3 py-2 rounded-full shadow-lg bg-white sm:px-4 sm:py-2"
            >
              What's new?
            </button>
            <button
              onClick={() => scrollToSection(aboutRef, -100)}
              className="px-2 text-white"
            >
              Check our deals →
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="my-4 mx-8 text-center sm:text-left sm:my-8 sm:mx-0">
            <h1 className="mt-0 mb-2 text-4xl font-baloo font-extrabold text-[#235D71] sm:text-5xl lg:text-7xl sm:mt-4">
              The Future of Fashion is VIZZLE.
            </h1>
            <p className="text-sm text-[#555] sm:text-xl">
              Visualize Your Style Effortlessly.
            </p>
          </div>

          {/* ✅ Privacy Policy Checkbox */}
          <div className="flex items-center gap-2 my-4 text-xs sm:text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-[#333]">
              I agree to the{" "}
              <Link
                to="/privacy-policy"
                className="text-blue-600 underline"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-row justify-start gap-2 text-xs sm:text-sm">
            

            <a
              href="https://play.google.com/store/apps/details?id=app.vercel.vizzle_pwa.twa&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-3 rounded-full shadow-lg border sm:px-4 ${
                accepted
                  ? "border-[#1D8DB2] text-[#1D8DB2] hover:shadow-md"
                  : "border-gray-400 text-gray-400 cursor-not-allowed pointer-events-none"
              }`}
            >
             
              Download App
            </a>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="w-[22.5rem] md:w-[35rem] h-auto">
          <img
            src="vizzleVisuals.png"
            alt="vizzleVisuals"
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}

export default Homesection;
