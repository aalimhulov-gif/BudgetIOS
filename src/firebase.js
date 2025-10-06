import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGN93LsNnRGcqGpesVWAg8jP0m6XsQAuA",
  authDomain: "budget-ami.firebaseapp.com",
  databaseURL: "https://budget-ami-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "budget-ami",
  storageBucket: "budget-ami.firebasestorage.app",
  messagingSenderId: "976854941281",
  appId: "1:976854941281:web:f40e81033cf52d236af420"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);