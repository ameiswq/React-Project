import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCf7tzLnNT2n4_kLLHgLVmTBHV4ZrVAMCk",
  authDomain: "endterm-1de93.firebaseapp.com",
  projectId: "endterm-1de93",
  storageBucket: "endterm-1de93.firebasestorage.app",
  messagingSenderId: "647776849532",
  appId: "1:647776849532:web:7d0eea7ddbe862d0a483f9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);