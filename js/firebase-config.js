/**
 * EMMA C2C — Firebase Configuration
 * Project: EMMA c2c (emma-c2c)
 * 
 * This file initializes Firebase services for the EMMA platform:
 * - Firestore: Multi-program document store for milestones, branding, timelines
 * - Auth: Anonymous (students) + Email/Password (faculty admin)
 * - Analytics: Usage tracking
 */

// Firebase CDN compat SDK (no bundler required — vanilla JS project)
// Loaded via <script> tags in index.html before this file

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBz8SlTV94u1n1U-nTxSRvJchLw41fBREM",
  authDomain: "emma-c2c.firebaseapp.com",
  projectId: "emma-c2c",
  storageBucket: "emma-c2c.firebasestorage.app",
  messagingSenderId: "801338727299",
  appId: "1:801338727299:web:b9dc3ce4265810917034b6",
  measurementId: "G-EPHM30CNRD"
};

// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG);

// Service references
const db = firebase.firestore();
const auth = firebase.auth();

// Enable offline persistence for Firestore (students on spotty campus WiFi)
db.enablePersistence({ synchronizeTabs: true })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[EMMA] Firestore persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('[EMMA] Firestore persistence not available in this browser');
    }
  });

console.log('[EMMA] Firebase initialized — project: emma-c2c');
