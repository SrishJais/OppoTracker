// import css file
import "../css/MyCard.css";
import React from "react";
//import from package
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

/* __________________________________________________________card section___________________________________________ */

const MyCard = ({
  loading,
  bgcolor,
  descriptioncolor,
  countingno,
  description,
}) => {
  return (
    <Card className="p-3" style={{ backgroundColor: `${bgcolor}` }}>
      <CardContent>
        <div className="py-2 counting">{countingno}</div>
        <b style={{ color: `${descriptioncolor}` }}>{description}</b>
      </CardContent>
    </Card>
  );
};

export default MyCard;
