// import css file
import "../css/Home.css";
//import from package
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
//animation
import "animate.css";

// ____________________________________________________________Home/landing page section________________________________________________
const Home = () => {
  return (
    <>
      <div id="image" className="d-flex align-items-center">
        <div className="row d-flex justify-content-justify pl-2 ml-md-4 ml-lg-5">
          <div
            className="col-md-7 col-lg-4 py-3 animate__animated animate__zoomIn"
            id="landing_content"
          >
            <h2 id="landing_heading">Welcome to OppoTracker!!! </h2>
            <p className="py-3 text-left" id="landing-text">
              Get a competitive edge by utilizing our website that provides CRUD
              functionalities, powerful search and sort capabilities,and
              filtering options to track and manage all your business
              opportunities. With our platform, you can effortlessly store and
              organize all the relevant information regarding your opportunities
              to ensure you never miss important deadlines.
            </p>
            <div className="d-flex justify-content-start">
              <Link to="/track" className="link_comp ">
                <Button id="getStarted_btn" variant="contained">
                  GET STARTED
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
