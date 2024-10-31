import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importa el módulo de autenticación

const firebaseConfig = {
  apiKey: "AIzaSyDuASd7h3OFuxekwDmt314U94UzqOFBkJg",
  authDomain: "login-velocimetro.firebaseapp.com",
  projectId: "login-velocimetro",
  storageBucket: "login-velocimetro.firebasestorage.app",
  messagingSenderId: "378415967520",
  appId: "1:378415967520:web:ff33a86eab3b1abec1bb45",
  measurementId: "G-BBDQ9ZRBD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Inicializa autenticación

export { db, auth }; // Exporta Firestore y Auth
