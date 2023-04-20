// import css file
import "./App.css";
//import from package
import React, { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
//import my components
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TrackOpportunity from "./pages/TrackOpportunity";
import AddUpdateListItem from "./pages/AddUpdateListItem";
import Details from "./pages/Details";
import ForgotPassword from "./pages/ForgotPassword";
import PageNotFound from "./pages/PageNotFound";

import ProtectedRoute from "./components/ProtectedRoute";

// Create a new context
export const myContext = createContext();
export const conditionalOppDataContext = createContext();
export const cntContext = createContext("");

function App() {
  // Get the value from session sotrage.
  const tempoppDataValue =
    sessionStorage.getItem("tempOppData") !== "[]"
      ? JSON.parse(sessionStorage.getItem("tempOppData"))
      : [];
  // Use this value as the default value for the state
  let [oppData, setOppData] = useState([]);
  const [conditionalOppData, setConditionalOppData] =
    useState(tempoppDataValue);
  const [appliedOppCount, setAppliedOppCount] = useState(0);
  const [pendingOppCount, setPendingOppCount] = useState(0);

  return (
    <div className="App">
      <Header />
      <myContext.Provider value={{ oppData, setOppData }}>
        <cntContext.Provider
          value={{
            appliedOppCount,
            setAppliedOppCount,
            pendingOppCount,
            setPendingOppCount,
          }}
        >
          <conditionalOppDataContext.Provider
            value={{ conditionalOppData, setConditionalOppData }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/track"
                element={<ProtectedRoute Cmp={<TrackOpportunity />} />}
              />
              <Route
                path="/addUpdate/:id?"
                element={<ProtectedRoute Cmp={<AddUpdateListItem />} />}
              />
              <Route
                path="/details/:id"
                element={<ProtectedRoute Cmp={<Details />} />}
              />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </conditionalOppDataContext.Provider>
        </cntContext.Provider>
      </myContext.Provider>
    </div>
  );
}

export default App;
