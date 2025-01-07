// lib/firebaseAdmin.js
import admin from "firebase-admin";

// Check if Firebase Admin has already been initialized to avoid reinitializing
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.NEXT_PUBLICE_FIREBASE_ADMIN_SDK || "{}");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL, // Optional if using Firestore
  });

  console.log("Firebase Admin Initialized");
}

export const db = admin.firestore(); // Firestore reference
export const auth = admin.auth();    // Auth reference
export default admin;
