import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Store, Package, BarChart2,
  CreditCard, Code2, Wand2, LogOut, MessageCircle, ChevronLeft
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Stores', icon: Store, path: '/stores' },
  { label: 'Products', icon: Package, path: '/products' },
  { label: 'Analytics', icon: BarChart2, path: '/analytics' },
  { label: 'Credits & Billing', icon: CreditCard, path: '/billing' },
  { label: 'Integration', icon: Code2, path: '/integration' },
  { label: 'Studio', icon: Wand2, path: '/studio' },
];

export default function StudioSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="flex flex-col justify-between bg-white border-r border-gray-200 flex-shrink-0"
      style={{ width: '185px', minHeight: '100vh' }}
    >
      {/* Top: Logo + Nav */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
          <img src="/logo.png" alt="Vizzle" className="h-8 w-auto" />
          <span className="text-base font-bold text-gray-900 tracking-tight leading-none">Vizzle</span>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className={isActive ? 'text-blue-500' : 'text-gray-400'}
                />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Sign out + WhatsApp */}
      <div className="px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
        >
          <LogOut size={17} strokeWidth={1.8} className="text-gray-400" />
          Sign out
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-all">
          <MessageCircle size={17} strokeWidth={1.8} className="text-green-500" />
          WhatsApp Support
        </button>
      </div>
    </aside>
  );
}
