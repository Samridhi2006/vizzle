import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./AppLayout";
import PrivacyPolicy from "./components/privacy";
import Form from "./components/Form";
import Greeting from "./components/Greeting";
import Admin from "./components/Admin";  
import DocsPage from "./docs/DocsPage";
import Contact from "./components/Contact";
import Pricing from "./components/Pricing"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main landing page */}
        <Route path="/" element={<AppLayout />} />

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

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />

        {/* Pricing Page */}
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
