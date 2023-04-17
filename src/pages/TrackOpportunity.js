// import css file
import "../css/TrackOpportunity.css";
//import from package
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Paper, Box, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
//import my components
import MyCard from "../components/MyCard";
import TableWithPagenation from "../components/TableWithPagenation";
import SearchData from "../components/SearchData";
import FilterSort from "../components/FilterSort";
//tooltip
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
//sweet alert
import swal from "sweetalert";
//moment package
import moment from "moment";
// for export table as pdf
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
//for context api
import { myContext } from "../App";
import { cntContext } from "../App";
import { conditionalOppDataContext } from "../App";
//authentication
import { useAuth } from "../myFirebase/myAuthFirebase";
//for firestore database
import { useFirestore } from "../myFirebase/myFirestoreFirebase";
import DeadlineCalendar from "../components/DeadlineCalendar";
//for loading
import { TailSpin } from "react-loader-spinner";
//animation
import "animate.css";

// ____________________________________________Track opportunity section_______________________________________________________
const TrackOpportunity = () => {
  //for authentication
  const { currentUser } = useAuth();
  //context api
  const { oppData, setOppData } = useContext(myContext);
  const {
    appliedOppCount,
    setAppliedOppCount,
    pendingOppCount,
    setPendingOppCount,
  } = useContext(cntContext);

  const { setConditionalOppData } = useContext(conditionalOppDataContext);

  //firestore database
  const { remove, fetchDocsByQuery } = useFirestore();
  const [loading, setLoading] = useState(false);

  //________________fetch all opportunities list_______________

  useEffect(() => {
    let pendCnt = 0,
      applyCnt = 0;
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const querySnapshot = await fetchDocsByQuery(
          "Opportunities",
          "userId",
          currentUser.uid
        );
        let result = querySnapshot.docs.map((docRef) => {
          //docRef is snapshot of 1 doc
          // docRef.id is id of each obj(docRef)
          const id = docRef.id;
          //docRef.data is each obj in array of obj
          if (docRef.data().status === "pending...") pendCnt += 1;
          else applyCnt += 1;
          return { ...docRef.data(), id };
        });
        //sort based on inserteddate
        const sortedResult = result.sort((val1, val2) => {
          return val1.oppAddedDate - val2.oppAddedDate;
        });
        //to get new to old
        sortedResult.reverse();
        setPendingOppCount(pendCnt);
        setAppliedOppCount(applyCnt);
        setOppData(result);
        sessionStorage.setItem("tempOppData", JSON.stringify(result));
        setConditionalOppData(result);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false); //always execute
      }
    };
    fetchOpportunities();
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  // ________________clear all opportunity data _________________
  const handleDeleteAll = async (id) => {
    try {
      oppData.forEach(async (val) => {
        await remove("Opportunities", val.id);
      });
      setOppData([]);
      sessionStorage.setItem("tempOppData", JSON.stringify([]));
      setConditionalOppData([]);
      setPendingOppCount(0);
      setAppliedOppCount(0);
      swal("All opportunities had been deleted!", {
        icon: "success",
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  //sweetAlert confirm popup for deleting all opportunity data
  const ConfirmDeleteAllPopup = () => {
    //delete only if data is present
    if (oppData.length > 0) {
      swal({
        title: "Are you confirm?",
        text: "Once deleted, you will not be able to recover this data!",
        icon: "warning",
        closeOnClickOutside: false,
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) handleDeleteAll();
      });
    }
  };

  // _________________generate pdf_____________________
  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Opportunity Lists", 10, 10);
    autoTable(doc, {
      theme: "grid",
      styles: {
        showHead: "everyPage",
      },
      columnStyles: {
        oppName: { cellWidth: 35 },
        applyLink: { cellWidth: 50, textColor: "blue" },
        regisDeadline: { cellWidth: 25 },
        examDate: { cellWidth: 25 },
        description: { cellWidth: 50 },
      },
      headStyles: {
        halign: "center",
      },
      body: oppData,
      didParseCell: (data) => {
        if (data.section === "body") {
          switch (data.column.dataKey) {
            case "regisDeadline":
              data.cell.text = moment(data.cell.raw).format(" D MMM YYYY");
              break;
            case "examDate":
              if (data.cell.raw !== "")
                data.cell.text = moment(data.cell.raw).format(" D MMM YYYY");
              break;
            // no default case intentionally
          }
        }
      },

      columns: [
        { header: "Opportunity Name", dataKey: "oppName" },
        { header: "Apply Link", dataKey: "applyLink" },
        { header: "Registration Deadline", dataKey: "regisDeadline" },
        { header: "ExamDate", dataKey: "examDate" },
        { header: "Description", dataKey: "description" },
      ],
    });
    doc.save("opportunity.pdf");
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
        <div id="track_page">
          <div className="container pb-5">
            {/* heading */}
            <div className="text-center py-4" id="track_heading">
              Track Opportunity
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-md-12 col-lg-11 px-0">
                {/* ________________________________________________________Cards & deadline calendar____________________________________ */}
                <div className="row mb-3" id="cardCalendar">
                  {/* applied applications card */}
                  <div className="col-md-3 my-2 px-0 animate__animated animate__fadeInLeft">
                    <MyCard
                      bgcolor="#12b9b6"
                      descriptioncolor="azure"
                      countingno={appliedOppCount}
                      description="Total applied applications"
                    ></MyCard>
                  </div>

                  {/* pending applications card  */}
                  <div className="col-md-3 my-2 px-0 animate__animated animate__fadeInLeft">
                    <MyCard
                      bgcolor="orange"
                      descriptioncolor="#fff8e2"
                      countingno={pendingOppCount}
                      description="Total pending applications"
                    ></MyCard>
                  </div>
                  {/* React  showing Upcoming Pending deadlines */}
                  <div className="col-md-4 pt-2 px-0 animate__animated animate__fadeInRight">
                    <DeadlineCalendar />
                  </div>
                </div>
                {/* _______________________________________________________Table section_________________________________________________*/}

                <div className="row d-flex justify-content-center px-0">
                  <div className="col-md-11 px-0">
                    {/* table heading */}
                    <div className="d-flex justify-content-between flex-wrap mt-2">
                      <p id="table_heading" className="mb-0 mb-2">
                        Opportunities
                      </p>
                      {/*_________________________________________add new,clear btn and download pdf_____________________________________ */}
                      <div className="d-flex mb-2">
                        {/* clear All btn */}
                        <div>
                          <Button
                            onClick={ConfirmDeleteAllPopup}
                            id="track_clear_btn"
                            className="mr-1"
                            variant="contained"
                          >
                            CLEAR ALL LIST
                          </Button>
                        </div>
                        {/* addnew page btn */}
                        <div>
                          <Link to="/addUpdate" className="link_comp">
                            <Button id="track_addnew_btn" variant="contained">
                              {/* addnew page icon */}
                              <AddCircleOutlineIcon />
                              ADDNEW
                            </Button>
                          </Link>
                        </div>
                        {/* export table as pdf icon */}
                        <Tooltip title="Export whole list as pdf">
                          <IconButton
                            className="p-0"
                            id="exportPdf_icon"
                            onClick={generatePdf}
                          >
                            <BsFillFileEarmarkPdfFill />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="animate__animated animate__fadeInBottomLeft">
                      <Paper component={Box} className=" p-2 mt-2">
                        {/* _________Search,filter,sort________________ */}
                        <div className="d-flex flex-wrap">
                          <div className="col-md-8 d-flex align-self-center justify-content-start p-0 my-2">
                            <SearchData />
                          </div>
                          <div className="col-md-4 d-flex align-items-center justify-content-end px-0">
                            <FilterSort />
                          </div>
                        </div>
                        {/* ______________________Table_____________________*/}
                        <TableWithPagenation />
                      </Paper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrackOpportunity;
