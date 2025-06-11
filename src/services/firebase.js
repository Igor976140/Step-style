// services/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA8EQpbZaNDFD23OcphAd3IZ-tfNs9QtFc",
  authDomain: "stepstyledatabase.firebaseapp.com",
  databaseURL: "https://stepstyledatabase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "stepstyledatabase",
  storageBucket: "stepstyledatabase.firebasestorage.app",
  messagingSenderId: "105242911041",
  appId: "1:105242911041:web:def846d5f075b6750801c0",
  measurementId: "G-VVGHDXKCMK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };