import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const requiredEnv = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_APP_ID'
];

const missing = requiredEnv.filter(k => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing Firebase env variables:', missing.join(', '));
  // throw a clear error so app won't attempt auth operations
  throw new Error('Firebase environment variables missing: ' + missing.join(', '));
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// simple sanity checks
if (!firebaseConfig.authDomain.includes(firebaseConfig.projectId)) {
  console.warn('⚠️ authDomain does not include projectId — verify values in .env');
}

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized:', firebaseConfig.projectId);
  // analytics can fail in some environments; guard it
  try { getAnalytics(app); } catch (e) { /* ignore analytics errors */ }
} catch (err) {
  console.error('❌ Firebase initialization failed:', err);
  throw err;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
