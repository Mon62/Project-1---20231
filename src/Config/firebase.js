import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAk6WY_XUxrJd6fOw_HYnsjO0cMS2kX6pQ",
  authDomain: "project-1---20231---20210618.firebaseapp.com",
  databaseURL: "https://project-1---20231---20210618-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "project-1---20231---20210618",
  storageBucket: "project-1---20231---20210618.appspot.com",
  messagingSenderId: "17763896455",
  appId: "1:17763896455:web:e868bf473f6f888c373c22",
  measurementId: "G-BNHCCFLP95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app)
