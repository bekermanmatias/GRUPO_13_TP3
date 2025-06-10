// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUsUwrpx6sKcF8XEbxvZFUjVqmL5uE6YE",
  authDomain: "apprecetas-cc7bf.firebaseapp.com",
  projectId: "apprecetas-cc7bf",
  storageBucket: "apprecetas-cc7bf.firebasestorage.app",
  messagingSenderId: "102304954780",
  appId: "1:102304954780:web:08f0cadf8ab299f63eb059"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth
export const auth = getAuth(app);