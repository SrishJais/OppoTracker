// import css file
import "../css/DeadlineCalendar.css";
import { Box, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
//for context api
import { myContext } from "../App";
import { conditionalOppDataContext } from "../App";

function DeadlineCalendar() {
  //for context api
  const { oppData } = React.useContext(myContext);
  const { setConditionalOppData } = React.useContext(conditionalOppDataContext);

  const [calenderValue, setCalenderValue] = useState("");
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
    // filter only if data is present
    if (oppData.length !== 0 && calenderValue !== "") {
      setConditionalOppData(
        oppData.filter((val) => {
          return (
            new Date(val.regisDeadline).setHours(0, 0, 0, 0) ===
              new Date(calenderValue).setHours(0, 0, 0, 0) &&
            val.status === "pending..."
          );
        })
      );
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [calenderValue]);

  useEffect(() => {
    const filteredResult = [];
    oppData.forEach((val) => {
      if (
        new Date().setHours(0, 0, 0, 0) <=
          new Date(val.regisDeadline).setHours(0, 0, 0, 0) &&
        val.status === "pending..."
      )
        filteredResult.push(new Date(val.regisDeadline).setHours(0, 0, 0, 0));
    });
    setHighlightedDates(filteredResult);
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [oppData]);

  return (
    <>
      <Paper
        component={Box}
        p={2}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <div
          className="pb-2"
          style={{ fontWeight: "bold", textAlign: "center" }}
        >
          Upcoming Pending Deadlines
        </div>
        <div className="d-flex justify-content-center">
          <Calendar
            name="calenderValue"
            value={calenderValue}
            //note in calendar target object is not present
            onChange={(e) => setCalenderValue(e)}
            tileClassName={({ date }) => {
              if (
                highlightedDates.includes(new Date(date).setHours(0, 0, 0, 0))
              ) {
                return "highlight";
              }
            }}
          />
        </div>
        <b
          className="pl-4"
          style={{ color: "rgb(82, 116, 185)", cursor: "pointer" }}
          onClick={() => setConditionalOppData(oppData)}
        >
          See all list...
        </b>
      </Paper>
    </>
  );
}
export default DeadlineCalendar;
