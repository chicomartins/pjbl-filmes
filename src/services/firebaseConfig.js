// src/config/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApHNnCgLE2aNvFhxiegyjmm_qC30AoaS4",
  authDomain: "pjbl-filmes.firebaseapp.com",
  projectId: "pjbl-filmes",
  storageBucket: "pjbl-filmes.appspot.com",
  messagingSenderId: "359462250155",
  appId: "1:359462250155:web:955416328706ca1b0c79ee",
  measurementId: "G-VCW9LPYKEY"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
