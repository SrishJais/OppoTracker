import myApp from "./appFirebaseConfig";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
} from "firebase/auth";
//auth reference
const authref = getAuth(myApp);

//context Api
const authContext = createContext();
//export it
//custom hook for using authContext
export function useAuth() {
  return useContext(authContext);
}

//export
export const AuthProvider = (props) => {
  // Get the value from session sotrage.
  const tempUserValue =
    sessionStorage.getItem("tempUser") !== "null"
      ? JSON.parse(sessionStorage.getItem("tempUser"))
      : null;
  // Use this value as the default value for the state
  const [currentUser, setCurrentUser] = useState(tempUserValue);

  //____________authentication state changed listener_____________________
  //Note:- currentUser is my own created state variable(obj) here.Any change in my our own created state variable ,
  //,i.e,currentUser, will not be reflected in firebase's inbuilt currentUser obj

  useEffect(() => {
    //automatically gets active when only only when login(with any way)/logout/signup
    let unsubscribe = onAuthStateChanged(authref, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setCurrentUser(currentUser);
        sessionStorage.setItem("tempUser", JSON.stringify(currentUser));
      } else {
        setCurrentUser(null);
        sessionStorage.setItem("tempUser", JSON.stringify(null));
      }
    });
    return () => {
      //clean up listening of listener, during unmounting
      unsubscribe();
    };
  }, []);

  //   useEffect(() => {
  //     // Save the currentUser object to local storage whenever it changes
  //     localStorage.setItem('currentUser', JSON.stringify(currentUser));
  // },[currentUser]);

  //-_______________________other fn for authentication______________________
  //sign up
  function mySignup(email, password) {
    return createUserWithEmailAndPassword(authref, email, password);
  }
  //send verification link to avoid fake
  function verifyEmail(tempCurrentUser) {
    return sendEmailVerification(tempCurrentUser);
  }
  //login
  function myLogin(email, password) {
    return signInWithEmailAndPassword(authref, email, password);
  }
  //forgot password
  function myForgotPassword(email) {
    return sendPasswordResetEmail(authref, email);
  }
  //forgot password
  function myResetPassword(oobCode, newPassword) {
    return confirmPasswordReset(authref, oobCode, newPassword);
  }
  //logout
  function myLogout() {
    return signOut(authref);
  }
  //login with google
  function googleLogin() {
    const providerref = new GoogleAuthProvider();
    return signInWithPopup(authref, providerref);
  }
  function isAlreadySignedUp(email) {
    return fetchSignInMethodsForEmail(authref, email);
  }
  const value = {
    currentUser,
    setCurrentUser,
    mySignup,
    verifyEmail,
    myLogin,
    myForgotPassword,
    myResetPassword,
    myLogout,
    googleLogin,
    isAlreadySignedUp,
  };
  return (
    <authContext.Provider value={value}>{props.children}</authContext.Provider>
  );
};
