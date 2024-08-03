// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ8JfAAXBPS_RwTCOkQQXrQgCC8q9NSbY",
  authDomain: "inventory-tr.firebaseapp.com",
  projectId: "inventory-tr",
  storageBucket: "inventory-tr.appspot.com",
  messagingSenderId: "871623202601",
  appId: "1:871623202601:web:8067aba48afcf078d90938",
  measurementId: "G-M1W3DCNRPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {firestore, app, auth, provider, signInWithPopup, signOut, onAuthStateChanged};