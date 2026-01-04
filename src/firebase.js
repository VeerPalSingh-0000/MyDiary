import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBTvrbw-XCHgHcGnkLmbnVgxxKW_ofFCto",
  authDomain: "mydiary-44ae1.firebaseapp.com",
  projectId: "mydiary-44ae1",
  storageBucket: "mydiary-44ae1.firebasestorage.app",
  messagingSenderId: "569396488404",
  appId: "1:569396488404:web:5e9fc8a7c8baaed0723341",
  measurementId: "G-CHY08VQEZ5"
};

const app = initializeApp(firebaseConfig);

// 2. Initialize and Export services
export const auth = getAuth(app);
export const db = getFirestore(app); // This fixes the "db not found" error
export const provider = new GoogleAuthProvider();

// 3. Helper functions
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const signupEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const loginEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);