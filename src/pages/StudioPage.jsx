import StudioSidebar from '../studio/StudioSidebar';
import StudioTopBar from '../studio/StudioTopBar';
import StudioWorkflow from '../studio/StudioWorkflow';

export default function StudioPage() {
  return (
    <div
      className="flex font-sans"
      style={{ height: '100vh', overflow: 'hidden', background: '#f0f4f8' }}
    >
      {/* Left Sidebar — matches actual dashboard */}
      <StudioSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top App Bar */}
        <StudioTopBar
          pageName="Studio"
          subtitle="Create premium AI catalogue shoots from flat lay garments in minutes."
        />

        {/* Scrollable Workflow */}
        <StudioWorkflow />
      </div>
    </div>
  );
}
