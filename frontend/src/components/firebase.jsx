import {initializeApp} from "firebase/app";
import {getDatabase, ref, push, onChildAdded} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDptRCS_dGINIPFeKYAEsAogBwdSvxr_no",
  authDomain: "coffeeshopmanager-7ec48.firebaseapp.com",
  databaseURL: "https://coffeeshopmanager-7ec48-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coffeeshopmanager-7ec48",
  storageBucket: "coffeeshopmanager-7ec48.firebasestorage.app",
  messagingSenderId: "872956914920",
  appId: "1:872956914920:web:2b4df94c44f17259cd2d5d",
  measurementId: "G-WVBSRBH5E8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {database, ref, push, onChildAdded};