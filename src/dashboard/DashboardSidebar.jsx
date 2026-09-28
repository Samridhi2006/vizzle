import { NavLink, useNavigate } from 'react-router-dom';
import {
  Wand2, LayoutDashboard, Store, Package,
  BarChart2, CreditCard, Code2, LogOut, MessageCircle, Film, Images, X
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

const NAV_GROUPS = [
  {
    groupLabel: 'CREATE',
    items: [
      { label: 'Studio',        icon: Wand2,   path: '/dashboard/studio' },
      { label: 'Motion Studio', icon: Film,    path: '/dashboard/motion-studio', accent: 'purple' },
      { label: 'My Creations',  icon: Images,  path: '/dashboard/creations',     accent: 'pink' },
    ],
  },
  {
    groupLabel: 'MANAGE',
    items: [
      { label: 'Overview',          icon: LayoutDashboard, path: '/dashboard/overview' },
      { label: 'Stores',            icon: Store,           path: '/dashboard/stores' },
      { label: 'Products',          icon: Package,         path: '/dashboard/products' },
      { label: 'Analytics',         icon: BarChart2,       path: '/dashboard/analytics' },
      { label: 'Credits & Billing', icon: CreditCard,      path: '/dashboard/billing' },
      { label: 'Integration',       icon: Code2,           path: '/dashboard/integration' },
    ],
  },
];

export default function DashboardSidebar({ mobileOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const renderSidebarContent = (isMobile = false) => (
    <>
      {/* Logo */}
      <div>
        <div className="flex items-center justify-between px-4 py-[18px] border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Vizzle" className="h-8 w-auto" onError={e => { e.target.style.display='none'; }} />
            <span className="text-base font-bold text-gray-900 tracking-tight">Vizzle</span>
          </div>
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={19} />
            </button>
          )}
        </div>

        {/* Nav groups */}
        <nav className="px-3 py-3 flex flex-col gap-3">
          {NAV_GROUPS.map(({ groupLabel, items }) => (
            <div key={groupLabel}>
              <p className="px-3 mb-1 text-[9px] font-bold text-gray-400 tracking-widest uppercase">{groupLabel}</p>
              <div className="flex flex-col gap-0.5">
                {items.map(({ label, icon: Icon, path, accent }) => (
                  <NavLink
                    key={label}
                    to={path}
                    onClick={() => {
                      if (isMobile) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={17}
                          strokeWidth={1.8}
                          className={isActive ? 'text-blue-500' : 'text-gray-400'}
                        />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom utilities */}
      <div className="px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
        <a
          href="https://wa.me/918310247975"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-all min-h-[44px]"
        >
          <MessageCircle size={17} strokeWidth={1.8} className="text-green-500" />
          WhatsApp Support
        </a>
        <button
          onClick={async () => {
            if (isMobile) onClose();
            await logout();
            navigate('/');
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all w-full cursor-pointer min-h-[44px]"
        >
          <LogOut size={17} strokeWidth={1.8} className="text-gray-400" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on screens < 768px) */}
      <aside
        className="hidden md:flex flex-col justify-between bg-white border-r border-gray-200 flex-shrink-0"
        style={{ width: '188px', minHeight: '100vh' }}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer (visible on screens < 768px when mobileOpen is true) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          {/* Slide-over panel */}
          <aside
            className="relative flex flex-col justify-between bg-white w-64 max-w-[80vw] h-full shadow-2xl z-10 overflow-y-auto"
          >
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
