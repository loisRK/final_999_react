// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXaKK0J0pKKCKpiuQwxxU9yQiImQxjcIo",
  authDomain: "project-9b19f.firebaseapp.com",
  databaseURL: "https://project-9b19f-default-rtdb.firebaseio.com",
  projectId: "project-9b19f",
  storageBucket: "project-9b19f.appspot.com",
  messagingSenderId: "1080562495797",
  appId: "1:1080562495797:web:c5cc80a1387d7779f71c7c",
  measurementId: "G-KGVZCWZCP4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig;
