import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAavN1bUqEhBNFLduCMu9zy2VQpOdGHMvI",
  authDomain: "josek-pro.firebaseapp.com",
  projectId: "josek-pro",
  storageBucket: "josek-pro.firebasestorage.app",
  messagingSenderId: "704984614633",
  appId: "1:704984614633:web:42f263f9ebfcaf68089278",
  measurementId: "G-6T7TJRKH1J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
