import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {

  apiKey:
    "AIzaSyDWVEoBVmFzJ25PcQQ-69NuTGtA7u_svIk",

  authDomain:
    "eximq-b0e92.firebaseapp.com",

  projectId:
    "eximq-b0e92",

  storageBucket:
    "eximq-b0e92.firebasestorage.app",

  messagingSenderId:
    "458301665779",

  appId:
    "1:458301665779:web:7b6bc28e98dd681750e286",

  measurementId:
    "G-SH8B6QEMC7"
};

const app =
  initializeApp(firebaseConfig);

export const db =
  getFirestore(app);