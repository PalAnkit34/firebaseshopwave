
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOGh0ExzbyuCzZrorT2_zlIMs_5LXnzsg",
  authDomain: "cultivated-pen-437311-m1.firebaseapp.com",
  projectId: "cultivated-pen-437311-m1",
  storageBucket: "cultivated-pen-437311-m1.appspot.com",
  messagingSenderId: "627366191718",
  appId: "1:627366191718:web:f08ca5fff847c13a5643a7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
