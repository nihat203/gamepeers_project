import React from 'react';
import {auth, provider, fbauth}  from './firebase.js';
import "./button-7.css"
  
const Login = () => {
  
    const signin = () => {
        auth.signInWithPopup(provider).catch(alert);
    }
    const signin1 = () => {
        auth.signInWithPopup(fbauth).catch(alert);
    }
      
    return (
        <div>
            <button className='button-7' onClick={signin}>Sign In with Google</button><br/>
            <button className='button-7' onClick={signin1}>Sign In with Facebook</button>
        </div>
    );
}
  
export default Login;