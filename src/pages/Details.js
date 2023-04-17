// import css file
import "../css/Details.css";
//import from package
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FcViewDetails } from "react-icons/fc";
import { Box, Button, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import moment from "moment";
import PageNotFound from "./PageNotFound";
//for loading
import { TailSpin } from "react-loader-spinner";
//animation
import "animate.css";
//_________________________________________________________Details section_____________________________________________________

const Details = () => {
  const tempoppDataValue =
    sessionStorage.getItem("tempOppData") !== "[]"
      ? JSON.parse(sessionStorage.getItem("tempOppData"))
      : [];
  //for context api
  const [anOppDetail, setAnOppDetail] = useState({});
  const { id } = useParams();
  const [idFound, setIdFound] = useState(false);
  const [loading, setLoading] = useState(true); // to avoid flash after refresh
  const { oppName, applyLink, regisDeadline, status, examDate, description } =
    anOppDetail;

  useEffect(() => {
    if (id !== undefined && id !== "") {
      tempoppDataValue.forEach((val) => {
        if (val.id === id) {
          //req/valid id
          setIdFound(true);
          setAnOppDetail(val);
        }
      });
      // either id found or not found , make it false after execution of useEffect
      setLoading(false);
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [id]);

  //_________________________________________sharing functionalities using web share api____________________________________________
  const handleShareOppLink = async () => {
    try {
      await navigator.share({
        text: "Check out this opportunity!Apply Now:",
        url: applyLink,
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center py-4 align-items-center"
          style={{ height: "91vh", color: "grey", fontWeight: "bolder" }}
        >
          <TailSpin height="70" color="grey" />
          Loading...
        </div>
      ) : (
        <>
          {idFound ? (
            <div
              id="details_page"
              className="row pb-4 d-flex justify-content-center"
            >
              <div className="col-md-7 col-lg-4">
                {/*________________________details_heading____________ */}
                <div className="text-center py-4" id="details_heading">
                  Opportunity Details
                </div>

                {/*______________________________________________________details section________________________________________________ */}
                <Paper
                  component={Box}
                  p={2}
                  m={1}
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                  className="animate__animated animate__fadeInLeft"
                >
                  {/*________________details header section_______________ */}
                  <div
                    id="details_header_section"
                    className="d-flex justify-content-between align-items-center px-2 mb-2"
                  >
                    <div className="d-flex align-items-center">
                      {/* Details React icon */}
                      <div
                        id="details_icon"
                        className="text-left py-2 align-items-center d-flex"
                      >
                        <FcViewDetails />
                      </div>
                      {/* Opportunity name */}
                      <b className="p-2" id="details_opp_name">
                        {oppName}
                      </b>
                    </div>
                    {/* Apply status */}
                    <div
                      className="apply_status px-2"
                      id={
                        status === "pending..."
                          ? "pendingClass"
                          : "appliedClass"
                      }
                    >
                      {status}
                    </div>
                  </div>
                  {/* _____________________Description/Notes___________________ */}
                  {description && (
                    <>
                      <b>Description:</b>
                      <p variant="h6" id="description" className="pt-1">
                        {description}{" "}
                      </p>
                      <hr />
                    </>
                  )}
                  <b>Details</b>

                  {/* _________________Details of a opportunity________________ */}

                  {/* Apply link */}
                  <div className="details_item">
                    <div className="details_label">Apply Link</div>
                    <b>
                      <a href={applyLink}>Link</a>{" "}
                    </b>
                  </div>
                  {/* Registration deadline */}
                  <div className="details_item">
                    <div className="details_label">Registration deadline</div>
                    <b>{moment(regisDeadline).format(" Do MMM YYYY")}</b>
                  </div>
                  {/* Registration status */}
                  <div className="details_item ">
                    <div className="details_label">Registration status</div>
                    {new Date().setHours(0, 0, 0, 0) <=
                    new Date(regisDeadline).setHours(0, 0, 0, 0) ? (
                      <b id="regisOpen" className="regis_status px-2">
                        open
                      </b>
                    ) : (
                      <b id="regisClosed" className="regis_status px-2">
                        closed
                      </b>
                    )}
                    {/*Apply status */}
                  </div>
                  <div className="details_item">
                    <div className="details_label">Apply status</div>
                    <b>{status === "pending..." ? "Pending" : "Applied"}</b>
                  </div>
                  {examDate && (
                    <div className="details_item">
                      <div className="details_label">Exam date</div>
                      <b style={{ color: "" }}>
                        {moment(examDate).format(" Do MMM YYYY")}
                      </b>
                    </div>
                  )}

                  {/* _________________Edit details page icon________________ */}
                  {/*details edit icon */}
                  <div className="text-right mt-2 p-2">
                    <Link
                      to={`/addUpdate/${anOppDetail.id}`}
                      className="link_comp"
                    >
                      <EditIcon id="details_edit_icon" />
                    </Link>
                  </div>
                  {/* __________________share btn and share icon__________________*/}
                  <div className="d-flex justify-content-center">
                    <Link to="#" className="link_comp">
                      <Button
                        id="share_btn"
                        className="my-1"
                        variant="contained"
                        onClick={handleShareOppLink}
                      >
                        Share Apply Link
                        <ShareIcon id="share_icon" />
                      </Button>
                    </Link>
                  </div>
                </Paper>
              </div>
            </div>
          ) : (
            <PageNotFound />
          )}
        </>
      )}
    </>
  );
};

export default Details;
