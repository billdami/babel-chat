import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// TODO move values to env vars/github secrets
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB8e36IB4hllGvW70k85-ScEbDSXXxghdc",
  authDomain: "babel-chat-online.firebaseapp.com",
  databaseURL: "https://babel-chat-online-default-rtdb.firebaseio.com",
  projectId: "babel-chat-online",
  storageBucket: "babel-chat-online.appspot.com",
  messagingSenderId: "660337776646",
  appId: "1:660337776646:web:0f2e4f4d80899377140b87",
  measurementId: "G-7XEDS5SJ6C"
};

const app = firebase.initializeApp(FIREBASE_CONFIG);

export default app;

