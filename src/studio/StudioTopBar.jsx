import { useAuth } from '../context/useAuth';

export default function StudioTopBar({ 
  pageName = 'Studio', 
  subtitle = 'Create premium AI catalogue shoots from flat lay garments in minutes.' 
}) {
  const { user } = useAuth();
  const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
  const userInitial = user?.initial || userName.charAt(0).toUpperCase() || 'U';
  const userPhoto = user?.photoURL;

  return (
    <header
      className="flex items-center justify-between bg-white border-b border-gray-200 flex-shrink-0 px-6"
      style={{ height: '60px' }}
    >
      {/* Left: Breadcrumb */}
      <div>
        <p className="text-base font-semibold text-gray-900 leading-none">{pageName}</p>
        <p className="text-xs text-gray-400 mt-1 leading-none">{subtitle}</p>
      </div>

      {/* Right: User Avatar */}
      <div className="flex items-center gap-2">
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
            style={{ background: '#3b82f6' }}
          >
            {userInitial}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:block" title={user?.email || userName}>
          {userName}
        </span>
      </div>
    </header>
  );
}
