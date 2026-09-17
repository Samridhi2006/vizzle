import { createContext, useContext, useState, useCallback } from 'react';
import CTAModal, { FIELD_PRESETS } from '../components/CTAModal';
import SignInModal from '../components/SignInModal';

// ─── Context ───────────────────────────────────────────────────────────────────
const ModalContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ModalProvider({ children }) {
  const [config, setConfig] = useState(null); // { title, fieldKeys }
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const openModal = useCallback((title, fieldKeys = FIELD_PRESETS.all) => {
    setConfig({ title, fieldKeys });
  }, []);

  const closeModal = useCallback(() => setConfig(null), []);

  const openSignInModal = useCallback(() => {
    setIsSignInOpen(true);
  }, []);

  const closeSignInModal = useCallback(() => {
    setIsSignInOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isSignInOpen,
        openSignInModal,
        closeSignInModal,
      }}
    >
      {children}
      <CTAModal
        isOpen={!!config}
        onClose={closeModal}
        title={config?.title ?? 'Schedule A Demo'}
        fieldKeys={config?.fieldKeys ?? FIELD_PRESETS.all}
        onSubmitSuccess={(data) => {
          // Optionally fire analytics/events here
          console.info('[Vizzle] Modal submitted:', data);
        }}
      />
      <SignInModal isOpen={isSignInOpen} onClose={closeSignInModal} />
    </ModalContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside <ModalProvider>');
  return ctx;
}

export { FIELD_PRESETS };
