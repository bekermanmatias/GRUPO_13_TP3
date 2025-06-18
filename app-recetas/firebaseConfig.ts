import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUsUwrpx6sKcF8XEbxvZFUjVqmL5uE6YE",
  authDomain: "apprecetas-cc7bf.firebaseapp.com",
  projectId: "apprecetas-cc7bf",
  storageBucket: "apprecetas-cc7bf.firebasestorage.app",
  messagingSenderId: "102304954780",
  appId: "1:102304954780:web:08f0cadf8ab299f63eb059"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 