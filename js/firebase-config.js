/**
 * EMMA — Firebase Configuration
 * Project: Think! Design and Planning (think--design-and-planning)
 * Owner: Think! Design and Planning, LLC
 * 
 * Services:
 * - Firestore: Student progress, milestone tracking
 * - Auth: Google SSO (faculty/staff) + Anonymous (students)
 * - Analytics: Usage tracking
 */

// Firebase CDN compat SDK (no bundler required — vanilla JS project)
// Loaded via <script> tags in index.html before this file

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBGXTMyk4bPeU8Q4P3Iyb0pLKFD2imzIo4",
  authDomain: "think--design-and-planning.firebaseapp.com",
  projectId: "think--design-and-planning",
  storageBucket: "think--design-and-planning.firebasestorage.app",
  messagingSenderId: "582582370434",
  appId: "1:582582370434:web:114bb9d97de06f9f4cb49b",
  measurementId: "G-2P5CYY50RL"
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

console.log('[EMMA] Firebase initialized — project: think--design-and-planning');
