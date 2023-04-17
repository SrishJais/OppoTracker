// import css file
import "../css/FilterSort.css";
//import from package
import React, { useContext, useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
//for context api
import { myContext } from "../App";
import { conditionalOppDataContext } from "../App";

const FilterSort = () => {
  //for context api
  const { oppData } = useContext(myContext);
  const { setConditionalOppData } = useContext(conditionalOppDataContext);

  const [filterOption, setFilterOption] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    // filter only if data is present
    if (oppData.length !== 0) {
      if (filterOption === "All") setConditionalOppData(oppData);
      else if (filterOption === "applied" || filterOption === "pending...")
        setConditionalOppData(
          oppData.filter((val) => val.status === filterOption)
        );
      else if (filterOption === "open" || filterOption === "closed") {
        // const currentDate = new Date();
        setConditionalOppData(
          oppData.filter((val) => {
            //comparison of registration date and current date in date obj format here only
            const currentDate = new Date().setHours(0, 0, 0, 0);
            const deadlineDate = new Date(val.regisDeadline).setHours(
              0,
              0,
              0,
              0
            );
            if (filterOption === "open") return currentDate <= deadlineDate;
            return currentDate > deadlineDate;
          })
        );
      }
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [filterOption]);

  useEffect(() => {
    // sort only if data is present
    if (oppData.length !== 0) {
      if (sortOption === "New to Old") setConditionalOppData(oppData);
      else if (sortOption === "Old to New")
        setConditionalOppData(oppData.slice().reverse());
      else if (sortOption === "deadline")
        setConditionalOppData(
          oppData
            .slice()
            .sort(
              (val1, val2) =>
                new Date(val2.regisDeadline).setHours(0, 0, 0, 0) -
                new Date(val1.regisDeadline).setHours(0, 0, 0, 0)
            )
        );
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [sortOption]);

  return (
    <>
      {/* ________filter list_________*/}
      <div className="form-group px-1">
        <div className="d-flex align-items-center mx-1">
          <div id="filter_icon">
            <FilterAltIcon />
          </div>
          <label id="filter_label">Filter</label>
        </div>
        <select
          className="form-control"
          style={{ height: "44px" }}
          name="filterOption"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option>All</option>
          <option>applied</option>
          <option>pending...</option>
          <option>open</option>
          <option>closed</option>
        </select>
      </div>
      {/* _________sort list___________ */}
      <div className="form-group">
        <div className="d-flex align-items-center mx-1">
          <div id="sort_icon">
            <SortIcon />
          </div>
          <label id="sort_label">Sort By</label>
        </div>
        <select
          className="form-control "
          style={{ height: "44px" }}
          name="sortOption"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option>New to Old</option>
          <option>Old to New</option>
          <option>deadline</option>
        </select>
      </div>
    </>
  );
};

export default FilterSort;
