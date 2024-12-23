// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAznzuhI20QA0DDW23dYr-0-IblqWGX6Y",
  authDomain: "crypto-app-1751f.firebaseapp.com",
  projectId: "crypto-app-1751f",
  storageBucket: "crypto-app-1751f.firebasestorage.app",
  messagingSenderId: "303407768710",
  appId: "1:303407768710:web:faf340bb9b73d215f39d07",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
