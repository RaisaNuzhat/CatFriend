import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEFSKRFsHZcCs9Y8PtfM0Wl_I_yQO2DCI",
  authDomain: "catfriend-b09f1.firebaseapp.com",
  projectId: "catfriend-b09f1",
  storageBucket: "catfriend-b09f1.appspot.com",
  messagingSenderId: "249116433336",
  appId: "1:249116433336:web:13657c9922123c9b404d4d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();