import React from 'react';
import {auth, provider, fbauth, db}  from './firebase.js';
import "./button-7.css"
import { serverTimestamp } from "firebase/firestore";
  
const Login = () => {
  
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }
      
    const signin = () => {
        auth.signInWithPopup(provider).then((authUser) => {
            db.collection("users").doc(authUser.user.displayName).set({timestamp: serverTimestamp()});
        db.collection('follow').doc('following').collection(authUser.user.displayName).doc(authUser.user.displayName).set({timestamp:serverTimestamp()});
        sleep(500).then(() => {
        window.location.reload();});
        }).catch(alert);
    }
    const signin1 = () => {
        auth
        .signInWithPopup(fbauth)
        .then((authUser) => {
            db.collection("users").doc(authUser.user.displayName).set({timestamp: serverTimestamp()});
        db.collection('follow').doc('following').collection(authUser.user.displayName).doc(authUser.user.displayName).set({timestamp:serverTimestamp()});
        sleep(500).then(() => {
        window.location.reload();});
        })
        .catch(alert);
    }
      
    return (
        <div>
            <button className='button-7' onClick={signin}>Sign In with Google</button><br/>
            <button className='button-7' onClick={signin1}>Sign In with Facebook</button>
        </div>
    );
}
  
export default Login;