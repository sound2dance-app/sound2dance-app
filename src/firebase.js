import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// TODO: Replace with your Firebase config
// Get this from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-app.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://your-app.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

// Development: Use emulator for local testing (optional)
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectDatabaseEmulator(database, 'localhost', 9000);
  } catch (error) {
    // Emulator already connected
  }
}

export default app;
