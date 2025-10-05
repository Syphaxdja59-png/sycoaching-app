import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const raw = import.meta.env.VITE_FIREBASE_CONFIG || '{\"apiKey\": \"AIzaSyExiMEtybudLgHDYpgstTygzVmvW6Nwc\", \"authDomain\": \"sycoaching-1640d.firebaseapp.com\", \"projectId\": \"sycoaching-1640d\", \"storageBucket\": \"sycoaching-1640d.appspot.com\", \"messagingSenderId\": \"28478905589\", \"appId\": \"1:28478905589:web:32c2ea3e7109c923ca940c\", \"measurementId\": \"G-NLX99KCWKX\"}';
let firebaseConfig = null;
try {
  firebaseConfig = raw ? JSON.parse(raw) : null;
} catch (e) {
  console.error('Erreur parsing VITE_FIREBASE_CONFIG', e);
}

let app = null;
let auth = null;
let db = null;
let firebaseInitialized = false;

if (firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    firebaseInitialized = true;
  } catch (err) {
    console.error('Erreur lors de l\'initialisation firebase:', err);
  }
} else {
  console.warn('Aucun firebaseConfig trouvé');
}

export { app, auth, db, firebaseInitialized, signInAnonymously, onAuthStateChanged };
