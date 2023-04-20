// import css file
import "../css/Header.css";
//import from package
import React from "react";
//import my components
import Logo from "../assets/logo.png"; //local img import
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { AiOutlineLogout } from "react-icons/ai";
//for authentication
import { useAuth } from "../myFirebase/myAuthFirebase";
import AvatarDialog from "./AvatarDialog";

/* __________________________________________________________header section___________________________________________ */

const Header = () => {
  const tempoppDataValue =
    sessionStorage.getItem("tempOppData") !== "[]"
      ? JSON.parse(sessionStorage.getItem("tempOppData"))
      : [];
  //for authentication
  const { currentUser, myLogout } = useAuth();
  const navigate = useNavigate();
  //for logout
  const handleLogout = async () => {
    try {
      await myLogout();
      sessionStorage.setItem("tempOppData", JSON.stringify([]));
      navigate("../home");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-light">
      <div className="d-flex justify-content-between w-100">
        {/* _____________________________________________logo and brand name section____________________________________ */}
        <Link to="/home" className="link_comp">
          {/* logo */}
          <div id="web_name">
            <span className="navbar-brand">
              <img src={Logo} width="30" height="30" alt="website logo" />
            </span>
            {/* app name  */}
            <span id="app_name">
              Oppo<span style={{ color: "orange" }}>Tracker</span>
            </span>
          </div>
        </Link>
        <div className="d-flex">
          {/*________ Avatar dialog box to show user info______ */}
          {currentUser && <AvatarDialog />}
          <div className="d-flex align-items-center">
            {/*_____________________________________________________navbar menu section_________________________________________*/}
            <div className="d-flex align-items-center">
              <div>
                {/* Toggler btn for menu for mobile/phone */}
                <button
                  className="navbar-toggler mb-1"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                {/*______________________________________________________nav menu items__________________________________________________ */}

                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav mr-auto">
                    {/* home menu (shown only to loggedin user)*/}
                    {currentUser && (
                      <li className="nav-item mr-1 mb-1">
                        <NavLink to="/home" className="nav-link">
                          Home<span className="sr-only">(current)</span>
                        </NavLink>
                      </li>
                    )}
                    {/* track menu (shown only to loggedin user)*/}
                    {currentUser && (
                      <li className="nav-item mr-1 mb-1">
                        <NavLink to="/track" className="nav-link">
                          Track<span className="sr-only">(current)</span>
                        </NavLink>
                      </li>
                    )}
                    {/*_____________login btn(accessible only to logout user) and logout btn(accessible only to current user)___________ */}

                    {currentUser ? (
                      <AiOutlineLogout id="logout" onClick={handleLogout} />
                    ) : (
                      <li className="align-self-center mt-2 mb-1">
                        <Link to="/login" className="link_comp">
                          <Button id="login_page_btn" variant="contained">
                            LOGIN
                          </Button>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
