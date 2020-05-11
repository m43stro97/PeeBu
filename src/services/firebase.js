import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAFdaXfk4neMblum6xMq9sL3o33XN4MDho",
  authDomain: "peebu-b1d74.firebaseapp.com",
  databaseURL: "https://peebu-b1d74.firebaseio.com",
  projectId: "peebu-b1d74",
  storageBucket: "peebu-b1d74.appspot.com",
  messagingSenderId: "293436232690",
  appId: "1:293436232690:web:85a93cdaa662141280d16b",
  measurementId: "G-9MDGS3X3JX"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export default db;