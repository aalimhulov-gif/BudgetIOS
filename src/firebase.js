import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHBaz4UzPKwcoUgJhXOZaGibTF0d51h74",
  authDomain: "budgetios.firebaseapp.com",
  projectId: "budgetios",
  storageBucket: "budgetios.appspot.com",
  messagingSenderId: "290765372665",
  appId: "1:290765372665:web:04049aa365e159823ff628"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);