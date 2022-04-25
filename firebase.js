import firebase from "firebase/compat/app";
import "firebase/compat/firestore"
import "firebase/compat/auth"
import "firebase/compat/storage"

const firebaseApp = firebase.initializeApp({
    //enter api key
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
var provider = new firebase.auth.GoogleAuthProvider(); 
const fbauth = new firebase.auth.FacebookAuthProvider();

export { db, auth, storage, provider, fbauth };