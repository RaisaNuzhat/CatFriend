// import { initializeApp} from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth} from 'firebase/auth';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCEFSKRFsHZcCs9Y8PtfM0Wl_I_yQO2DCI",
//   authDomain: "catfriend-b09f1.firebaseapp.com",
//   projectId: "catfriend-b09f1",
//   storageBucket: "catfriend-b09f1.appspot.com",
//   messagingSenderId: "249116433336",
//   appId: "1:249116433336:web:13657c9922123c9b404d4d",
// };
//
// const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

  // export { app, auth, getApp, getAuth };
// Initialize Firebase

//
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth();






import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage here

const firebaseConfig = {
  apiKey: "AIzaSyCEFSKRFsHZcCs9Y8PtfM0Wl_I_yQO2DCI",
  authDomain: "catfriend-b09f1.firebaseapp.com",
  projectId: "catfriend-b09f1",
  storageBucket: "catfriend-b09f1.appspot.com",
  messagingSenderId: "249116433336",
  appId: "1:249116433336:web:13657c9922123c9b404d4d",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };