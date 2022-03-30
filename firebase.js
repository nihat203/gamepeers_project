import firebase from "firebase/compat/app";
import "firebase/compat/firestore"
import "firebase/compat/auth"
import "firebase/compat/storage"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDPSKseGsABhw55K4P7ev-UKl8BoIHHGUQ",
    authDomain: "projecc-af5ce.firebaseapp.com",
    databaseURL: "  https://projecc-af5ce-default-rtdb.firebaseio.com",
    projectId: "projecc-af5ce",
    storageBucket: "projecc-af5ce.appspot.com",
    messagingSenderId: "106065234005",
    appId: "1:106065234005:web:801965ae1617a7a498acdc",
    measurementId: "G-XR1K34E867"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
var provider = new firebase.auth.GoogleAuthProvider(); 
const fbauth = new firebase.auth.FacebookAuthProvider();

export { db, auth, storage, provider, fbauth };