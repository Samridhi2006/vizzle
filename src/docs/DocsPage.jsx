import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import StepNavigation, { CUSTOM_API_DOCS_URL } from './components/StepNavigation';
import { docsContent as wordpressContent } from './data/docsContent';
import { shopifyDocsContent } from './data/shopifyDocsContent';
import { customApiDocsContent } from './data/customApiDocsContent';

import './docs.css';

function DocsPage() {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('wordpress');

  // Parse URL parameters to open specific tabs
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && (tabParam === 'wordpress' || tabParam === 'shopify' || tabParam === 'custom')) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep, activeTab]);

  const currentDocsContent =
    activeTab === 'shopify'
      ? shopifyDocsContent
      : activeTab === 'custom'
        ? customApiDocsContent
        : wordpressContent;

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
            <ContentArea
              activeStep={activeStep}
              docsContent={currentDocsContent}
              externalLink={
                activeTab === 'custom' && activeStep === customApiDocsContent.length - 1
                  ? { url: CUSTOM_API_DOCS_URL, label: 'Open Full API Reference' }
                  : null
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DocsPage;


