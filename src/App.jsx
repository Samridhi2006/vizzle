import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";

import AppLayout from "./AppLayout";
import PrivacyPolicy from "./components/privacy";
import Form from "./components/Form";
import Greeting from "./components/Greeting";
import Admin from "./components/Admin";  
import DocsPage from "./docs/DocsPage";
import ApiRefPage from "./docs/ApiRefPage";
import Contact from "./components/Contact";
import Pricing from "./components/Pricing";
import CatalogueShowcasePage from "./pages/CatalogueShowcasePage"; 
import VirtualTryOnPage from "./pages/VirtualTryOnPage";
import BlogsPage from "./pages/BlogsPage";
import SignInPage from "./pages/SignInPage";

function App() {
  return (
    <ModalProvider>
    <BrowserRouter>
      <Routes>
        {/* Main landing page */}
        <Route path="/" element={<AppLayout />} />

        {/* Sign In / Login */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/login" element={<SignInPage />} />

        {/* Privacy Policy Page */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Form Page */}
        <Route path="/form" element={<Form />} />   {/* ⬅️ FIXED */}

        {/* Greeting Page */}
        <Route path="/greeting" element={<Greeting />} />

        {/* Admin Page */}
        <Route path="/admin" element={<Admin />} />

        {/* Docs Page */}
        <Route path="/docs" element={<DocsPage />} />

        {/* API Reference */}
        <Route path="/docs/api" element={<ApiRefPage />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />

        {/* Catalogue Showcase */}
        <Route path="/catalogue-showcase" element={<CatalogueShowcasePage />} />

        {/* Pricing Page */}
        <Route path="/pricing" element={<Pricing />} />

        {/* Virtual Try-On */}
        <Route path="/virtual-try-on" element={<VirtualTryOnPage />} />

        {/* Blogs */}
        <Route path="/blogs" element={<BlogsPage />} />
      </Routes>
    </BrowserRouter>
    </ModalProvider>
  );
}

export default App;
