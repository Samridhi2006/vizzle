import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured.");
  }

  try {
    const parsed = JSON.parse(raw) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }
}

let cachedAuth: Auth | null = null;
export function hasFirebaseServiceAccount() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

export function getFirebaseAdminAuth(): Auth {
  if (cachedAuth) return cachedAuth;

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert(getServiceAccount()),
    });

  cachedAuth = getAuth(app);
  return cachedAuth;
}
