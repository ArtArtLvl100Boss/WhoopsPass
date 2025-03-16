import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRria-CEw2qNExJbjt11NEGAB6OMU91O0",
  projectId: "passwordmanager-905f0",
  authDomain: "passwordmanager-905f0.firebaseapp.com",
  storageBucket: "passwordmanager-905f0.appspot.com",
}

// Initialize Firebase
let app: FirebaseApp

if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

export const db = getFirestore(app)
export const auth = getAuth(app)

