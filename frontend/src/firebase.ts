import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl3o8qwQucMvu3r1tbyYTKYJBVGpy0aVw",
  authDomain: "hackathon---2025---klask.firebaseapp.com",
  projectId: "hackathon---2025---klask",
  storageBucket: "hackathon---2025---klask.firebasestorage.app",
  messagingSenderId: "264143499189",
  appId: "1:264143499189:web:5a72b47da3055ec2e6b3fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };