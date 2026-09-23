import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";

// Public pages
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
import AITrialRoomPage from "./pages/AITrialRoomPage";
import BlogsPage from "./pages/BlogsPage";
import SignInPage from "./pages/SignInPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

// Dashboard — nested route layout
import DashboardLayout from "./dashboard/DashboardLayout";
import StudioDashboardPage from "./dashboard/pages/StudioDashboardPage";
import OverviewPage from "./dashboard/pages/OverviewPage";
import StoresPage from "./dashboard/pages/StoresPage";
import ProductsPage from "./dashboard/pages/ProductsPage";
import AnalyticsPage from "./dashboard/pages/AnalyticsPage";
import BillingPage from "./dashboard/pages/BillingPage";
import IntegrationPage from "./dashboard/pages/IntegrationPage";
import MotionStudioPage from "./dashboard/pages/MotionStudioPage";
import CreationsPage from "./dashboard/pages/CreationsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            {/* ── Public / Marketing ── */}
            <Route path="/" element={<AppLayout />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/form" element={<Form />} />
            <Route path="/greeting" element={<Greeting />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-panel" element={<AdminPanelPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/api" element={<ApiRefPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/catalogue-showcase" element={<CatalogueShowcasePage />} />
            <Route path="/virtual-try-on" element={<VirtualTryOnPage />} />
            <Route path="/ai-trial-room" element={<AITrialRoomPage />} />
            <Route path="/blogs" element={<BlogsPage />} />

            {/* ── Legacy sign-in routes → eliminated, direct modal on landing ── */}
            <Route path="/signin" element={<Navigate to="/dashboard/studio" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard/studio" replace />} />

            {/* ── Legacy /studio → redirect to new canonical route ── */}
            <Route path="/studio" element={<Navigate to="/dashboard/studio" replace />} />

            {/* ── Dashboard (authenticated, nested layout) ── */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              {/* Default: redirect /dashboard → /dashboard/studio */}
              <Route index element={<Navigate to="/dashboard/studio" replace />} />
              <Route path="studio"         element={<StudioDashboardPage />} />
              <Route path="motion-studio"  element={<MotionStudioPage />} />
              <Route path="creations"      element={<CreationsPage />} />
              <Route path="overview"       element={<OverviewPage />} />
              <Route path="stores"      element={<StoresPage />} />
              <Route path="products"    element={<ProductsPage />} />
              <Route path="analytics"   element={<AnalyticsPage />} />
              <Route path="billing"     element={<BillingPage />} />
              <Route path="integration" element={<IntegrationPage />} />
            </Route>
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
