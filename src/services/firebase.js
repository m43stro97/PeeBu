import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBkv-V04G-VYKp3a4fUptX7hpDBlLAIehQ",
  authDomain: "peebu-41767.firebaseapp.com",
  databaseURL: "https://peebu-41767.firebaseio.com",
  projectId: "peebu-41767",
  storageBucket: "peebu-41767.appspot.com",
  messagingSenderId: "706834197398",
  appId: "1:706834197398:web:99bf90555288a752f60bb7"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export default db;