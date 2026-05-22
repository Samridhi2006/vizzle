/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";

function Navbar({ launchingRef, setIsFormOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="backdrop-blur-lg w-full fixed top-0 left-1/2 transform -translate-x-1/2 z-50 text-sm bg-[#F9F3FA] md:text-base lg:text-lg sm:w-[95%] sm:rounded-3xl sm:top-2 sm:bg-[#F9F3FA]/80">
      <nav className="container mx-auto flex items-center justify-between h-[6.5rem] px-4 sm:px-1 2xl:px-16">
        
        {/* Logo */}
        <Link to="/">
          <img
            src="/logo.png"
            alt="Vizzle logo"
            className="w-[175px] md:w-[200px] transition-all duration-500"
          />
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex gap-3">

          {/* Download App */}
          <a
            href="https://play.google.com/store/apps/details?id=app.vercel.vizzle_pwa.twa&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-[#1D8DB2] text-white text-sm shadow-md hover:shadow-inner"
          >
            Download App
          </a>
          <a
            href="https://dashboard.vizzle.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-[#1D8DB2] text-white text-sm shadow-md hover:shadow-inner"
          >
            Integrate Us
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden relative w-10 h-10 z-50">
          {!isMenuOpen ? (
            <Bars3Icon
              className="w-10 h-10 cursor-pointer text-blue-950"
              onClick={() => setIsMenuOpen(true)}
            />
          ) : (
            <XMarkIcon
              className="w-10 h-10 cursor-pointer text-blue-950"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute sm:hidden top-24 left-0 w-full p-5 flex gap-3 bg-[#F9F3FA] transition-all duration-500 ${
            isMenuOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full pointer-events-none"
          }`}
        >
          {/* Google Play */}
          <a
            href="https://play.google.com/store/apps/details?id=app.vercel.vizzle_pwa.twa&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#1D8DB2] text-white text-xs shadow-md"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            Download Now
          </a>

          <a
            href="https://dashboard.vizzle.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#1D8DB2] text-white text-xs shadow-md"
          >
            Integrate Us
          </a>

        </div>
      </nav>
    </header>
  );
}

export default Navbar;
