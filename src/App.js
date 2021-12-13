import React, {useEffect, useState} from 'react';
import './App.css';
import app from './FirebaseConfig';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [phone, setPhone] = useState();
  const [otp, setOtp] = useState();
  const [user, setUser] = useState()

  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setUser(user)
        console.log(user)
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

  },[])

  function handlePhone(e){
    setPhone(e.target.value)
  }

  function handleOtp(e){
    setOtp(e.target.value)
  }

  function configureCaptcha(){
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
      },
      defaultCountry: "IN"
    }, auth);
  }
  
  function onSignInSubmit(e){
    e.preventDefault()
    const phoneNumber = "+91"+phone
    const appVerifier = window.recaptchaVerifier;
    configureCaptcha()
    const auth = getAuth();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          console.log("OTP sent")
          // ...
        }).catch((error) => {
          // Error; SMS not sent
          // ...
        });
  }

  function onSubmitOtp(e){
    e.preventDefault()
    const code = otp;
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      const user = result.user;
      console.log(user)
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
    });

  }

  function signOutNow() {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Done")
    }).catch((error) => {
      // An error happened.
      console.log("Error")
    });
  }

  return (
    <div className="container">
      <div id="sign-in-button"></div>
      <input type="text" placeholder='Enter your mobile nos.' value={phone} onChange={handlePhone}/>
      <input type="submit" onClick={onSignInSubmit}/>
      <br/>
      <input type="text" placeholder='Enter your otp' value={otp} onChange={handleOtp}/>
      <input type="submit" onClick={onSubmitOtp}/>
      <div>{user ? user.phoneNumber: null}</div>
      <input type="submit" value="signout" onClick={signOutNow}/>
    </div>
  );
}

export default App;
