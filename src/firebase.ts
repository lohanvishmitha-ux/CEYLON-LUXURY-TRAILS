import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "direct-magpie-dknl3",
  appId: "1:268310616844:web:3201c2d1f91f7047300729",
  apiKey: "AIzaSyC4VCfmCWcPps0GuDmdbe9KYuL_O0HVDZY",
  authDomain: "direct-magpie-dknl3.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-ceylonluxurytrai-c830a8b8-5c6a-4233-98b2-ac866258c51d",
  storageBucket: "direct-magpie-dknl3.firebasestorage.app",
  messagingSenderId: "268310616844",
  measurementId: "",
  oAuthClientId: "268310616844-fqgoj03e4gpma2p7hup7v4l10d1fb56j.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// Initialize Firebase App safely
let app: any = null;
let db: any = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
} catch (error) {
  console.warn('Firebase initial init warning:', error);
  try {
    if (app) db = getFirestore(app);
  } catch (fallbackError) {
    console.error('Firestore init error:', fallbackError);
  }
}

export { db };
export default app;