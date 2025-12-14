// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// ✅ Replace these values with your own Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyA87KB7e3VcfWgMm_-m1l7dn00a_1jJgpo",
  authDomain: "edma-1de7c.firebaseapp.com",
  projectId: "edma-1de7c",
  storageBucket: 'edma-1de7c.firebasestorage.app',
  messagingSenderId: '1025906348458',
  appId: "1:1025906348458:web:5539f138d7365bc6689bd3",
};
 

const app = initializeApp(firebaseConfig);

// ✅ Set up auth and provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
