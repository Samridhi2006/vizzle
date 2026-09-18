import { Phone, Headphones, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardTopBar({ credits = 100 }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
  const firstName = userName.split(' ')[0];
  const userInitial = user?.initial || userName.charAt(0).toUpperCase() || 'U';
  const userPhoto = user?.photoURL;

  const PAGE_META = {
    '/dashboard/studio':      { title: 'Studio',            sub: 'Create premium AI catalogue shoots from flat lay garments in minutes.' },
    '/dashboard/overview':    { title: 'Overview',          sub: `Welcome back, ${firstName}` },
    '/dashboard/stores':      { title: 'Stores',            sub: 'Manage your connected stores and API keys.' },
    '/dashboard/products':    { title: 'Products',          sub: 'Browse and manage your uploaded product catalogue.' },
    '/dashboard/analytics':   { title: 'Analytics',         sub: 'Track try-on performance, conversions, and user engagement.' },
    '/dashboard/billing':     { title: 'Credits & Billing', sub: 'Manage your credit balance and subscription plan.' },
    '/dashboard/integration': { title: 'Integration',       sub: 'Connect Vizzle to your e-commerce platform via API.' },
  };

  const meta = PAGE_META[pathname] || { title: 'Dashboard', sub: '' };

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
      {/* Left: Page title */}
      <div>
        <p className="text-[15px] font-semibold text-gray-900 leading-none">{meta.title}</p>
        {meta.sub && <p className="text-[11px] text-gray-400 mt-[3px]">{meta.sub}</p>}
      </div>

      {/* Right: credits + avatar */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-gray-400 text-xs font-medium">
          <Phone size={12} />
          +91 83102 47975
        </div>
        <button 
          type="button"
          aria-label="Support"
          className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Headphones size={15} />
        </button>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1.5 rounded-lg">
          <Sparkles size={11} className="text-emerald-500" />
          {credits} Credits
        </div>
        
        {/* Authentic User Profile Avatar */}
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {userInitial}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden xl:block" title={user?.email || userName}>
          {userName}
        </span>
      </div>
    </header>
  );
}
