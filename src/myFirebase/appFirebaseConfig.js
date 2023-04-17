import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: "oppotracker-6091a.firebaseapp.com",
  projectId: "oppotracker-6091a",
  storageBucket: "oppotracker-6091a.appspot.com",
  messagingSenderId: "542111540957",
  appId: "1:542111540957:web:5219953d733df5dcca1d34",
};
// Initialize Firebase
const myApp = initializeApp(firebaseConfig);
//export it
export default myApp;
