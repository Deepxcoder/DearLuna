import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCR0jAHfjCmlMB3z0HOO_M2EssYJ_9_IpU",
  authDomain: "dearluna-bushu.firebaseapp.com",
  projectId: "dearluna-bushu",
  storageBucket: "dearluna-bushu.firebasestorage.app",
  messagingSenderId: "885184178709",
  appId: "1:885184178709:web:35fb97eaf34e9eb486fc1c",
  measurementId: "G-DPLBCQLK55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics, but only if supported by the browser
let analytics = null;
isSupported().then(yes => yes ? analytics = getAnalytics(app) : null);

export { app, analytics };
