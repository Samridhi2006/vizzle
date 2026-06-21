import React from 'react';
import { Check } from 'lucide-react';

export default function Sidebar({ activeStep, setActiveStep, docsContent }) {
  return (
    <aside className="hidden lg:block w-[18rem] border-r border-black/10 p-8 sticky top-[168px] h-[calc(100vh-168px)] overflow-y-auto">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-color)', marginBottom: '2rem' }}>
        Steps
      </h2>
      <nav style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 'calc(2.60rem - 1px)', top: '2.25rem', bottom: '2.25rem', width: '2px', backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 0 }}>
          <div 
            style={{ 
              position: 'absolute', top: 0, width: '100%', transition: 'all 0.5s ease-out',
              height: `${(activeStep / (docsContent.length - 1)) * 100}%`,
              background: 'var(--accent-color)'
            }}
          ></div>
        </div>
        
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 10 }}>
          {docsContent.map((step, index) => {
            const isActive = activeStep === index;
            const isCompleted = index < activeStep;
            const number = String(index + 1).padStart(2, '0');
            
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.5rem',
                  border: isActive ? '1px solid rgba(0,0,0,0.1)' : '1px solid transparent',
                  background: isActive ? 'rgba(0,0,0,0.05)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s'
                }}
              >
                <div style={{
                  position: 'relative', zIndex: 10, flexShrink: 0, width: '3rem', height: '3rem',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.3s',
                  background: isActive ? 'var(--accent-color)' : (isCompleted ? 'var(--accent-color)' : '#fff'),
                  color: isActive ? '#fff' : (isCompleted ? '#fff' : '#666'),
                  border: isActive ? 'none' : (isCompleted ? 'none' : '2px solid #ccc'),
                  boxShadow: isActive ? '0 0 10px rgba(29, 141, 178, 0.4)' : 'none'
                }}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <span>{number}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: '1.05rem', fontWeight: 'bold', color: isActive ? 'var(--brand-heading)' : (isCompleted ? 'var(--accent-color)' : '#666') }}>
                    {step.title}
                  </span>
                  {isActive && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-color)', marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Current
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
