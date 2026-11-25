import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore/lite';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

const API_KEY = import.meta.env.VITE_API_KEY;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

// Only initialize if minimum valid Firebase credentials are provided
if (API_KEY && PROJECT_ID) {
  try {
    const firebaseConfig = {
      apiKey: API_KEY,
      authDomain: import.meta.env.VITE_AUTH_DOMAIN,
      projectId: PROJECT_ID,
      storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGING_ID,
      appId: import.meta.env.VITE_APP_ID,
      measurementId: import.meta.env.VITE_MEASUREMENT_ID,
    };

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (err) {
    console.warn('[Firebase] Initialization skipped or failed; falling back to high-fidelity demo catalog mode.', err);
  }
}

export { db };
export const isFirebaseConfigured = Boolean(db);
