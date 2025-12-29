import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAmALe64W4EOEg78CsDUqKSKF1fROW9tbo",
  authDomain: "calendar1705.firebaseapp.com",
  databaseURL: "https://calendar1705-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "calendar1705",
  storageBucket: "calendar1705.firebasestorage.app",
  messagingSenderId: "415969074992",
  appId: "1:415969074992:web:f1a263de2e7849c615b2f5",
  measurementId: "G-CW6ZRR2W4Y"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);