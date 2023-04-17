// import css file
import "../css/AddUpdateListItem.css";
//import from package
import React, { useContext, useRef, useState } from "react";
import { Box, Button, Paper } from "@mui/material";
//for alert component
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { useNavigate, useParams } from "react-router-dom";
import { FcCalendar } from "react-icons/fc";
//sweet alert
import swal from "sweetalert";
// for invalid it ,if id present
import PageNotFound from "./PageNotFound";
//for loading
import { TailSpin } from "react-loader-spinner";
//for context Api
import { myContext } from "../App";
import { cntContext } from "../App";
import { conditionalOppDataContext } from "../App";
//for authentication
import { useAuth } from "../myFirebase/myAuthFirebase";
//for firestore database
import { useFirestore } from "../myFirebase/myFirestoreFirebase";
import { useEffect } from "react";

// ____________________________________________addUpdate_______________________________________________________

const AddUpdateListItem = () => {
  const tempoppDataValue =
    sessionStorage.getItem("tempOppData") !== "[]"
      ? JSON.parse(sessionStorage.getItem("tempOppData"))
      : [];

  //for authentication
  const { currentUser } = useAuth();
  //from firestore database
  const { addNew, update } = useFirestore();

  //for context Api
  const { oppData, setOppData } = useContext(myContext);
  const {
    appliedOppCount,
    setAppliedOppCount,
    pendingOppCount,
    setPendingOppCount,
  } = useContext(cntContext);
  const { conditionalOppData, setConditionalOppData } = useContext(
    conditionalOppDataContext
  );
  //store one opportunity obj
  const [oneOpp, setOneOpp] = useState({
    oppName: "",
    applyLink: "",
    regisDeadline: "",
    status: "pending...",
    examDate: "",
    description: "",
    oppAddedDate: new Date(),
    userId: currentUser.uid,
  });
  const [error, setError] = useState("");
  //to avoid invalid it
  const [idFound, setIdFound] = useState(false);
  const [loading, setLoading] = useState(true); // to avoid flash after refresh

  //for redirection
  const navigate = useNavigate();
  const textAreaRef = useRef(null);

  //For Edit functionality-- populate fields with existing opp data which is req to edit
  const { id } = useParams();

  //For Edit functionality
  useEffect(() => {
    if (id !== undefined && id !== "") {
      tempoppDataValue.forEach((val) => {
        if (val.id === id) {
          //req/valid id
          setIdFound(true);
          setOneOpp({
            oppName: val.oppName,
            applyLink: val.applyLink,
            regisDeadline: val.regisDeadline,
            status: val.status,
            examDate: val.examDate,
            description: val.description,
          });
        }
      });
      setLoading(false);
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInput = (e) => {
    setOneOpp({ ...oneOpp, [e.target.name]: e.target.value });
  };
  // Text area height(visually also) grow dynamically acc to content
  const handleTextareaInput = (e) => {
    setOneOpp({ ...oneOpp, [e.target.name]: e.target.value });
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };
  //_____________________________________________________________-fn for sweet alert____________________________________________________-
  const showSweetAlertPopup = (text) => {
    swal({
      title: "Success!",
      text: text,
      icon: "success",
      closeOnClickOutside: false,
    }).then((willRedirect) => {
      if (willRedirect) {
        //replace only last arg of current path
        navigate("../track");
      }
    });
  };
  // ______________________________________________add ,update fn ____________________________________________________________________
  //validation
  const isValidateReqFields = () => {
    if (
      oneOpp.oppName === "" ||
      oneOpp.applyLink === "" ||
      oneOpp.regisDeadline === ""
    ) {
      setError("Please fill all the required fields");
      return false;
    }
    return true;
  };
  //for addUpdate
  const handleAddUpdateAnOpp = async (e) => {
    e.preventDefault();
    //remove all prev error
    setError("");
    //validation
    if (isValidateReqFields() === false) {
      return;
    }
    try {
      //____________________handle edit___________________________
      if (id !== undefined && id !== "") {
        await update("Opportunities", oneOpp, id);
        const updatedOpp = oppData.map((item) => {
          if (item.id === id) {
            return { ...oneOpp, id }; // replace the existing object with the updated one
          } else {
            return item; // keep the existing object
          }
        });

        setOppData(updatedOpp);
        sessionStorage.setItem("tempOppData", JSON.stringify(updatedOpp));
        setConditionalOppData(updatedOpp);
        showSweetAlertPopup("An opportunity updated successfully");
      }
      //_________________________handle add________________________
      else {
        const docRef = await addNew("Opportunities", oneOpp);
        setOppData([...oppData, { ...oneOpp, id: docRef.id }]); //with unique id
        sessionStorage.setItem(
          "tempOppData",
          JSON.stringify([...oppData, { ...oneOpp, id: docRef.id }])
        );
        setConditionalOppData([
          ...conditionalOppData,
          { ...oneOpp, id: docRef.id },
        ]); //with unique id
        if (oneOpp.status === "pending...")
          setPendingOppCount(pendingOppCount + 1);
        else setAppliedOppCount(appliedOppCount + 1);
        showSweetAlertPopup("New opportunity added successfully");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  // ________________________________________________firebase related things___________________________________________________________

  return (
    <>
      {id && loading ? (
        <div
          className="d-flex justify-content-center py-4 align-items-center"
          style={{ height: "91vh", color: "grey", fontWeight: "bolder" }}
        >
          <TailSpin height="70" color="grey" />
          Loading...
        </div>
      ) : (
        <>
          {(id && idFound) || !id ? (
            <div
              id="form_addUpdate_page"
              className="row pb-4 d-flex justify-content-center"
            >
              <div className="col-md-8 col-lg-6">
                {/*_________________________________________________add/update heading____________________________________________________ */}
                <div
                  className="text-center mt-5 p-3"
                  id="form_addUpdate_heading"
                >
                  {id !== undefined && id !== "" ? "Update" : "Add"} Opportunity
                </div>

                <Paper
                  component={Box}
                  p={3}
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                >
                  {/*_________________________________________________form fields____________________________________________________ */}
                  <form onSubmit={handleAddUpdateAnOpp}>
                    {/* Opportunity name */}
                    <div className="row">
                      <div className="col-md-12 form-group">
                        <label
                          htmlFor="formGroupExampleInput"
                          className="form_addUpdate_label"
                        >
                          Opportunity name
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          name="oppName"
                          value={oneOpp.oppName}
                          onChange={handleInput}
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput"
                        />
                      </div>
                    </div>
                    {/* application link */}
                    <div className="row">
                      <div className="col-md-12 form-group">
                        <label
                          htmlFor="formGroupExampleInput"
                          className="form_addUpdate_label"
                        >
                          Application link
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          name="applyLink"
                          value={oneOpp.applyLink}
                          onChange={handleInput}
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput"
                        />
                      </div>
                    </div>
                    {/* registration deadline & status */}
                    <div className="row">
                      {/* registration deadline */}
                      <div className="col-md-6 form-group">
                        <label className="form_addUpdate_label">
                          Registration deadline
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="d-flex">
                          <input
                            name="regisDeadline"
                            value={oneOpp.regisDeadline}
                            onChange={handleInput}
                            type="date"
                            className="form-control oneOppDate datePicker"
                          />
                          <span style={{ pointerEvents: "none" }}>
                            <FcCalendar className="calendar_icon" />
                          </span>
                        </div>
                      </div>
                      {/* application status */}
                      <div className="col-md-6 form-group">
                        <label className="form_addUpdate_label">
                          Apply status
                        </label>
                        <select
                          className="form-control "
                          name="status"
                          value={oneOpp.status}
                          onChange={handleInput}
                          id="oneOppStatus"
                          style={{ height: "44px" }}
                        >
                          <option>pending...</option>
                          <option>applied</option>
                        </select>
                      </div>
                    </div>

                    {/* Exam date */}
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label className="form_addUpdate_label">
                          Exam date
                        </label>
                        <div className="d-flex">
                          <input
                            name="examDate"
                            value={oneOpp.examDate}
                            onChange={handleInput}
                            type="date"
                            className="form-control oneOppDate datePicker"
                          />
                          {/* pointerEvents allow mouse events to pass through the icon element to the parent element. */}
                          <span style={{ pointerEvents: "none" }}>
                            <FcCalendar className="calendar_icon" />
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Description/Notes */}
                    <div className="row">
                      <div className="col-md-12 form-group">
                        <label className="form_addUpdate_label">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={oneOpp.description}
                          onChange={handleTextareaInput}
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          ref={textAreaRef}
                        ></textarea>
                      </div>
                    </div>
                    {/* __________________________________________display error during add/update a opportunity_______________________ */}
                    {error && (
                      <Stack sx={{ width: "100%" }} spacing={2}>
                        <Alert severity="error">
                          <AlertTitle>{error}</AlertTitle>
                        </Alert>
                      </Stack>
                    )}
                    {/*_________add/update btn___________ */}
                    <div className="d-flex justify-content-center">
                      <Button
                        type="submit"
                        id="form_addUpdate_btn"
                        className="my-3"
                        variant="contained"
                      >
                        {id !== undefined && id !== "" ? "Update" : "Add"}
                      </Button>
                    </div>
                  </form>
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

export default AddUpdateListItem;
