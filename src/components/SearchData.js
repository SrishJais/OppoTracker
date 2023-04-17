// import css file
import "../css/SearchData.css";
//import from package
import React, { useContext, useEffect, useState } from "react";
import { Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
//for context api
import { myContext } from "../App";
import { conditionalOppDataContext } from "../App";

// ____________________________________________________________searchData section________________________________________________

const SearchData = () => {
  //for context api
  const { oppData } = useContext(myContext); //global context
  const { setConditionalOppData } = useContext(conditionalOppDataContext);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    //search only if data is present
    if (oppData.length !== 0) {
      //by default search term remains empty,show all data
      if (searchTerm === "") setConditionalOppData(oppData);
      else {
        const searchResults = oppData.filter((val) =>
          val.oppName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setConditionalOppData(searchResults);
      }
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <Paper
      component="form"
      sx={{ display: "flex", alignItems: "center" }}
      id="searchSection"
    >
      <IconButton type="button" aria-label="search" id="searchTerm_icon">
        {/* search icon */}
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Opportunities"
        name="searchTerm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <IconButton
          color="error"
          aria-label="clear"
          id="clearSearchTerm_icon"
          onClick={() => setSearchTerm("")}
        >
          {/* clear search data icon */}
          <ClearIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchData;
