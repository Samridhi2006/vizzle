import { NavLink, useNavigate } from 'react-router-dom';
import {
  Wand2, LayoutDashboard, Store, Package,
  BarChart2, CreditCard, Code2, LogOut, MessageCircle, Film, Images
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

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside
      className="flex flex-col justify-between bg-white border-r border-gray-200 flex-shrink-0"
      style={{ width: '188px', minHeight: '100vh' }}
    >
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-gray-100">
          <img src="/logo.png" alt="Vizzle" className="h-8 w-auto" onError={e => { e.target.style.display='none'; }} />
          <span className="text-base font-bold text-gray-900 tracking-tight">Vizzle</span>
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
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? accent === 'purple'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                            : accent === 'pink'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20'
                            : 'bg-blue-50 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={17}
                          strokeWidth={1.8}
                          className={isActive ? 'text-white' : 'text-gray-400'}
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-all"
        >
          <MessageCircle size={17} strokeWidth={1.8} className="text-green-500" />
          WhatsApp Support
        </a>
        <button
          onClick={async () => {
            await logout();
            navigate('/');
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all w-full cursor-pointer"
        >
          <LogOut size={17} strokeWidth={1.8} className="text-gray-400" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
