'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "syncsalesai",
  appId: "1:803003637899:web:0ed93b4041a9070e7a748e",
  storageBucket: "syncsalesai.firebasestorage.app",
  apiKey: "AIzaSyC1cwbvwroshmq84O6u54-3RBgcekFcNJI",
  authDomain: "syncsalesai.firebaseapp.com",
  messagingSenderId: "803003637899",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
