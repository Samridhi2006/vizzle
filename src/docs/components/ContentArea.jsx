import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function ContentArea({ activeStep, docsContent, externalLink }) {
  const currentDoc = docsContent[activeStep];
  
  // Convert markdown to HTML
  const htmlContent = DOMPurify.sanitize(marked.parse(currentDoc.content));
  const contentRef = useRef(null);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (contentRef.current) {
      const yOffset = -180; // Offset for the sticky StepNavigation and Navbar
      const y = contentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeStep]);

  return (
    <div ref={contentRef} style={{ paddingBottom: '3rem', animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
        <span 
          className="step-number-spark text-5xl md:text-[4.5rem]"
          style={{ 
            fontWeight: 'bold', color: 'var(--accent-color)', 
            letterSpacing: '-0.025em', lineHeight: 1
          }}
        >
          {String(activeStep + 1).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-heading)', fontWeight: 'bold' }}>Step</span>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>{activeStep + 1} of {docsContent.length}</span>
        </div>
      </div>
      
      <h1 
        className="font-black uppercase tracking-tight text-3xl md:text-4xl lg:text-[2.5rem] mb-6 md:mb-10 leading-tight"
        style={{ 
        background: 'linear-gradient(to right, #235D71, #1D8DB2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {currentDoc.title}
      </h1>
      
      <div style={{ 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle top highlight and ambient glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(29, 141, 178, 0.2), transparent)' }}></div>
        <div style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '300px', background: 'radial-gradient(ellipse at top, rgba(0, 210, 255, 0.05), transparent 70%)', pointerEvents: 'none' }}></div>
        
        <div className="markdown-content px-1 py-4 md:p-[3.5rem] relative z-10">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>

      {externalLink && (
        <div className="mt-8 flex justify-center">
          <a
            href={externalLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-color)] text-white font-semibold text-sm md:text-base hover:opacity-90 transition-opacity no-underline shadow-[0_4px_20px_rgba(29,141,178,0.25)]"
          >
            {externalLink.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
