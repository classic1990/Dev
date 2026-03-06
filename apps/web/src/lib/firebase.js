// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsNc3ICL86f2WE-kNghRqAiNgBR4FeiLU",
  authDomain: "classic-e8ab7.firebaseapp.com",
  projectId: "classic-e8ab7",
  storageBucket: "classic-e8ab7.firebasestorage.app",
  messagingSenderId: "596308927760",
  appId: "1:596308927760:web:a12be9b2dffb5bc72cb195",
  measurementId: "G-PC2891EP7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

export { app, analytics, db, auth, googleProvider };
