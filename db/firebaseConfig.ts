// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "time-tango-7da26.firebaseapp.com",
  projectId: "time-tango-7da26",
  storageBucket: "time-tango-7da26.appspot.com",
  messagingSenderId: "704795060425",
  appId: "1:704795060425:web:cc0772e9247b1d4c13c518",
  measurementId: "G-8C996VRM92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// const analytics = getAnalytics(app);

export {app, db}