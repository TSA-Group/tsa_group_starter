// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbL-ITW3-NkxttwqdfTN6Wc8V9ljbnDz4",
  authDomain: "gatherly-49306.firebaseapp.com",
  projectId: "gatherly-49306",
  storageBucket: "gatherly-49306.firebasestorage.app",
  messagingSenderId: "347577816820",
  appId: "1:347577816820:web:5c52fb48786df3859c70a1",
  measurementId: "G-T9GKM5XYN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
