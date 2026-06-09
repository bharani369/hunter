import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import firebaseConfigDefault from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigDefault.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigDefault.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigDefault.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigDefault.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigDefault.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigDefault.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigDefault.measurementId,
};

// Only use the named database ID if we are NOT overriding the project ID via environment variables (meaning we are using the AI Studio default),
// OR if the user explicitly provided a database ID override via VITE_FIREBASE_FIRESTORE_DATABASE_ID.
// If the user provided their own project ID but NO database ID, we should default to undefined so it uses the '(default)' database.
const isUsingCustomProject = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;
const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || 
  (isUsingCustomProject ? undefined : firebaseConfigDefault.firestoreDatabaseId);

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  // Helps in some environments when WebSockets are blocked
  experimentalForceLongPolling: true 
}, firestoreDatabaseId);
export const auth = getAuth(app);
