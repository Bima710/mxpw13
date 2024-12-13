// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfr0ZsR1Tbkqnl5mKy5IVbcEKfPUJxIHo",
  authDomain: "mobilecrossweek11-5c3c8.firebaseapp.com",
  databaseURL: "https://mobilecrossweek11-5c3c8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mobilecrossweek11-5c3c8",
  storageBucket: "mobilecrossweek11-5c3c8.firebasestorage.app",
  messagingSenderId: "779584871805",
  appId: "1:779584871805:web:17ae30310c2813290a0014",
  measurementId: "G-Y1ZCBGQYF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

(async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    getAnalytics(app);
  }
})();

export default firebaseConfig;