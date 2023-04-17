import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./myFirebase/myAuthFirebase";
import { FirestoreProvider } from "./myFirebase/myFirestoreFirebase";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <FirestoreProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FirestoreProvider>
  </BrowserRouter>
);
