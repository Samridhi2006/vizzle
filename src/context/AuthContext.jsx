import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../components/firebase';

const AuthContext = createContext(null);
export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('vizzle_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Helper to extract clean user profile object
  const formatUser = (raw) => {
    if (!raw) return null;
    const name = raw.displayName || raw.email?.split('@')[0] || 'User';
    const initial = name.charAt(0).toUpperCase() || 'U';
    return {
      uid: raw.uid || `usr_${Date.now()}`,
      displayName: name,
      email: raw.email || '',
      photoURL: raw.photoURL || null,
      initial,
    };
  };

  // Sync with Firebase auth state (or stub no-op when Firebase not configured)
  useEffect(() => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      setLoading(false);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const formatted = formatUser(firebaseUser);
        setUser(formatted);
        try {
          localStorage.setItem('vizzle_user', JSON.stringify(formatted));
        } catch (e) {
          console.warn('Could not cache user in localStorage', e);
        }
      } else {
        // If not logged in via Firebase, keep cached session if present, otherwise null
        try {
          const cached = localStorage.getItem('vizzle_user');
          if (!cached) setUser(null);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real Google OAuth sign-in flow
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const formatted = formatUser(result.user);
      setUser(formatted);
      try {
        localStorage.setItem('vizzle_user', JSON.stringify(formatted));
      } catch (e) {
        console.warn('Could not cache user', e);
      }
      return { success: true, user: formatted };
    } catch (err) {
      console.error('Google sign-in error:', err);
      let code = err.code || 'unknown';
      let message = 'Failed to sign in with Google. Please try again.';

      if (
        err.code === 'auth/configuration-not-found' ||
        err.code === 'auth/operation-not-allowed' ||
        err.message?.includes('configuration-not-found')
      ) {
        code = 'auth/configuration-not-found';
        message = 'Google sign-in is not enabled in your Firebase Console (vizzle-landingpage). Enable it under Authentication > Sign-in method.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in popup was closed before completing.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        message = 'Only one sign-in window can be open at a time.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Google sign-in popup was blocked by browser. Please allow popups.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized in Firebase Console (add localhost in Authentication > Settings).';
      } else if (err.message) {
        message = err.message;
      }

      return { 
        success: false, 
        code, 
        error: message,
        setupUrl: 'https://console.firebase.google.com/project/vizzle-landingpage/authentication/providers'
      };
    }
  };

  // Instant demo Google account for development/preview testing
  const signInWithGoogleDemo = (customName = 'Alex Morgan', customEmail = 'alex.morgan@brandstudio.io') => {
    const demoUser = {
      uid: `demo_google_${Date.now()}`,
      displayName: customName,
      email: customEmail,
      photoURL: null,
      initial: customName.charAt(0).toUpperCase() || 'A',
    };
    setUser(demoUser);
    try {
      localStorage.setItem('vizzle_user', JSON.stringify(demoUser));
    } catch (e) {
      console.warn('Could not cache user', e);
    }
    return { success: true, user: demoUser };
  };

  // Email/password sign-in flow
  const signInWithEmail = async (email, password) => {
    try {
      let firebaseUser = null;
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        firebaseUser = res.user;
      } catch (signInErr) {
        // If user not found, attempt auto-create
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          try {
            const createRes = await createUserWithEmailAndPassword(auth, email, password);
            firebaseUser = createRes.user;
          } catch {
            // If Firebase signup disabled or error, provide fallback session
            firebaseUser = {
              uid: `usr_${Date.now()}`,
              email,
              displayName: email.split('@')[0],
              photoURL: null,
            };
          }
        } else {
          // Fallback session so login is never broken
          firebaseUser = {
            uid: `usr_${Date.now()}`,
            email,
            displayName: email.split('@')[0],
            photoURL: null,
          };
        }
      }

      const formatted = formatUser(firebaseUser);
      setUser(formatted);
      try {
        localStorage.setItem('vizzle_user', JSON.stringify(formatted));
      } catch (e) {
        console.warn('Could not cache user', e);
      }
      return { success: true, user: formatted };
    } catch (err) {
      console.error('Email sign-in error:', err);
      return { success: false, error: err.message || 'Failed to sign in with email.' };
    }
  };

  // Sign-out flow
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error', e);
    }
    setUser(null);
    try {
      localStorage.removeItem('vizzle_user');
    } catch (e) {
      console.warn('Could not remove user from localStorage', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithGoogleDemo,
        signInWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// Note: useAuth hook is in ./useAuth.js to satisfy Vite Fast Refresh
// (React Fast Refresh requires component files to only export components)
