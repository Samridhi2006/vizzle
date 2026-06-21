import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import StepNavigation from './components/StepNavigation';
import { docsContent as wordpressContent } from './data/docsContent';
import { shopifyDocsContent } from './data/shopifyDocsContent';

import './docs.css';

function DocsPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('wordpress');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep, activeTab]);

  const currentDocsContent = activeTab === 'shopify' ? shopifyDocsContent : wordpressContent;

  return (
    <div className="vizzle-docs-container pt-28">
      <Navbar />
      <StepNavigation 
        activeStep={activeStep} 
        setActiveStep={setActiveStep}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveStep(0);
        }}
        docsContent={currentDocsContent}
      />
      
      <div className="main-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
        <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} docsContent={currentDocsContent} />
        
        <main className="flex-1 min-w-0">
          <div className="content-container">
            {activeTab === 'wordpress' || activeTab === 'shopify' ? (
              <ContentArea activeStep={activeStep} docsContent={currentDocsContent} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem', color: '#8b95a5' }}>
                <p>Documentation for Custom API is coming soon.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DocsPage;


