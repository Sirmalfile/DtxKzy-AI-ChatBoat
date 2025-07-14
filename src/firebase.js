import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail, // Add this import
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Paste your config here
const firebaseConfig = {
  apiKey: "AIzaSyAJxGIf75riELiLG45s0wSqZxXfJuC7M8w",
  authDomain: "dtxkzy-d2cc2.firebaseapp.com",
  projectId: "dtxkzy-d2cc2",
  storageBucket: "dtxkzy-d2cc2.firebasestorage.app",
  messagingSenderId: "626586768673",
  appId: "1:626586768673:web:98d100f0799ff7bf09da60",
  measurementId: "G-42W9H4B9NZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  db,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail, // Add this export
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc
};