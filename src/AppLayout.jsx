import { useRef, useState } from "react";
import About from "./components/About";
import Footer from "./components/Footer";
import Homesection from "./components/Homesection";
import Navbar from "./components/Navbar";
import VizzlePage from "./components/VizzlePage";
import VizzlePage2 from "./components/VizzlePage2";
import Text from "./components/Text";
import Steps from "./components/Steps";
import Platforms from "./components/Platforms";


function AppLayout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const launchingRef = useRef(null);
  const aboutRef = useRef(null);
  const VizzlePageRef = useRef(null);
  const VizzlePage2Ref = useRef(null);
  const TextRef = useRef(null);
  const stepsRef = useRef(null);

  return (
    <div>
      <Navbar launchingRef={launchingRef} setIsFormOpen={setIsFormOpen} />
      <Homesection
        launchingRef={launchingRef}
        VizzlePageRef={VizzlePageRef}
        aboutRef={aboutRef}
        setIsFormOpen={setIsFormOpen}
      />

      <div ref={stepsRef}>
        <Steps />
      </div>

      <div>
        <Platforms />
      </div>
      
      <div ref={VizzlePageRef}>
        <VizzlePage />
      </div>

      <div ref={VizzlePage2Ref}>
        <VizzlePage2 />
      </div>

      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={TextRef}>
        <Text />
      </div>
      
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918310247975?text=Hey%21%20I%20want%20more%20info%20about%20vizzle"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#25D366",
          color: "#fff",
          borderRadius: "50px",
          padding: "14px 20px",
          boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "14px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,211,102,0.75)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,0.5)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          style={{ width: "22px", height: "22px", flexShrink: 0 }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp Us
      </a>
    </div>
  );
}

export default AppLayout;
