import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD6zt8yNi32PZdudHcagJLeH7J-XwjiiPk",
  authDomain: "gbcfinal-ab9a2.firebaseapp.com",
  projectId: "gbcfinal-ab9a2",
  storageBucket: "gbcfinal-ab9a2.appspot.com",
  messagingSenderId: "952063930405",
  appId: "1:952063930405:web:c408b3cd95298b59840fcc",
  measurementId: "G-K2FQKESSH9",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth, db };
