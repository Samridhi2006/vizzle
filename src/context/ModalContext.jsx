import { createContext, useContext, useState, useCallback } from 'react';
import CTAModal, { FIELD_PRESETS } from '../components/CTAModal';

// ─── Context ───────────────────────────────────────────────────────────────────
const ModalContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ModalProvider({ children }) {
  const [config, setConfig] = useState(null); // { title, fieldKeys }

  const openModal = useCallback((title, fieldKeys = FIELD_PRESETS.all) => {
    setConfig({ title, fieldKeys });
  }, []);

  const closeModal = useCallback(() => setConfig(null), []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
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
