import { initializeApp, type FirebaseApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore/lite';

const env = import.meta.env;

/**
 * Firebase web config. These values identify the project and are safe to ship
 * in the page: access is controlled by firestore.rules, not by hiding them.
 */
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const useEmulators = env.VITE_FIREBASE_EMULATORS === '1';
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = initializeApp(firebaseConfig);
    const siteKey = env.VITE_FIREBASE_APPCHECK_SITE_KEY as string | undefined;
    if (siteKey && !useEmulators) {
      // Optional abuse protection for the public booking form. Loaded on demand.
      void import('firebase/app-check').then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
        initializeAppCheck(app!, { provider: new ReCaptchaV3Provider(siteKey), isTokenAutoRefreshEnabled: true });
      }).catch(() => undefined);
    }
  }
  return app;
}

export function getDb(): Firestore | null {
  const current = getFirebaseApp();
  if (!current) return null;
  if (!db) {
    db = getFirestore(current);
    if (useEmulators) connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  return db;
}
