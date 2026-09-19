// firebase.js
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let db = null;
let auth = null;
let googleProvider = null;

try {
  if (firebaseConfig.apiKey) {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } else {
    throw new Error('No Firebase API key — running in demo mode');
  }
} catch (e) {
  console.warn('[Vizzle] Firebase unavailable:', e.message, '— using demo/offline mode.');
  db = null;
  // Stub auth object that matches the Firebase Auth interface
  // AuthContext calls: auth.onAuthStateChanged(callback)
  auth = {
    currentUser: null,
    // Called as auth.onAuthStateChanged(cb) — first arg is the callback
    onAuthStateChanged: (cb) => {
      if (typeof cb === 'function') cb(null);
      return () => {}; // unsubscribe noop
    },
    signOut: async () => {},
  };
  googleProvider = null;
}

export { db, auth, googleProvider };

