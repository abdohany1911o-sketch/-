import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoMamDkCRcJWDkkkohwiJ-STrLovpWQ",
  authDomain: "eximqq.firebaseapp.com",
  projectId: "eximqq",
  storageBucket: "eximqq.firebasestorage.app",
  messagingSenderId: "1073252736269",
  appId: "1:1073252736269:web:3f4f4d161e53e2d1a8e444"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 مهم جدًا
export const auth = getAuth(app);