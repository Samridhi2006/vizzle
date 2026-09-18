import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';

export default function DashboardLayout() {
  return (
    <div className="flex font-sans" style={{ height: '100vh', overflow: 'hidden', background: '#f0f4f8' }}>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopBar credits={100} />
        {/* Page content via nested route */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
