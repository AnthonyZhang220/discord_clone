// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 0

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: String(process.env.REACT_APP_FIREBASE_API_KEY),
    authDomain: String(process.env.REACT_APP_AUTH_DOMAIN),
    databaseURL: String(process.env.REACT_APP_DATABASE_URL),
    projectId: String(process.env.REACT_APP_PROJECT_ID),
    storageBucket: String(process.env.REACT_APP_STORAGE_BUCKET),
    messagingSenderId: String(process.env.REACT_APP_MESSAGING_SENDER_ID),
    appId: String(process.env.REACT_APP_FIREBASE_APP_ID),
    measurementId: String(process.env.REACT_APP_MEASUREMENT_ID),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimedb = getDatabase(app);