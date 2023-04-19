// import css file
import "../css/TableWithPagenation.css";
//import from package
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
//mui tooltip
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
//sweet alert
import swal from "sweetalert";
//moment package
import moment from "moment";
//animation
import "animate.css";
//for context api
import { myContext } from "../App";
import { cntContext } from "../App";
import { conditionalOppDataContext } from "../App";
//for firestore database
import { useFirestore } from "../myFirebase/myFirestoreFirebase";

// ____________________________________________________TableWithPagenation section____________________________________________________________________

export default function TableWithPagenation() {
  //for context api
  const { oppData, setOppData } = React.useContext(myContext); //global context
  const {
    appliedOppCount,
    setAppliedOppCount,
    pendingOppCount,
    setPendingOppCount,
  } = React.useContext(cntContext);
  const { conditionalOppData, setConditionalOppData } = React.useContext(
    conditionalOppDataContext
  );
  //for firestore database
  const { remove } = useFirestore();

  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    setRows(conditionalOppData);
  }, [conditionalOppData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // __________________________________________________delete an opp___________________________________________________________
  const handleDeleteAnOpp = async (id) => {
    try {
      await remove("Opportunities", id);
      let oneOpp;
      //delete from oppData also to avoid refresh
      const oppDataAfterDelete = oppData.filter((val) => {
        oneOpp = val;
        return val.id !== id;
      });
      setOppData(oppDataAfterDelete);
      setConditionalOppData(oppDataAfterDelete);
      swal({
        title: "Success",
        text: "An opportunity has been deleted!",
        icon: "success",
      });
      if (oneOpp.status === "pending...")
        setPendingOppCount(pendingOppCount - 1);
      else setAppliedOppCount(appliedOppCount - 1);
    } catch (err) {
      console.log(err.message);
    }
  };
  const ConfirmDeletePopup = (id) => {
    swal({
      title: "Are you confirm?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      closeOnClickOutside: false,
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) handleDeleteAnOpp(id);
    });
  };
  // __________________________________________________________________________________________________________________________

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 1000 }}>
        <Table stickyHeader aria-label="sticky table" id="table">
          <TableHead>
            <TableRow>
              <TableCell className="tableHeader" align="center">
                #
              </TableCell>
              <TableCell className="tableHeader" align="center">
                Opportunity Name
              </TableCell>
              <TableCell className="tableHeader" align="center">
                Apply Link
              </TableCell>
              <TableCell className="tableHeader" align="center">
                Registration Deadline
              </TableCell>
              <TableCell className="tableHeader" align="center">
                Status
              </TableCell>
              <TableCell className="tableHeader" align="center">
                Actions
              </TableCell>
              <TableCell className="tableHeader" align="center">
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 &&
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const { oppName, applyLink, regisDeadline, status, id } = row;

                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                      <TableCell className="tableBodyCell" align="center">
                        {index + 1}
                      </TableCell>
                      {/* opportunity name */}
                      <TableCell
                        className="tableBodyCell"
                        id="ListItem_oppName"
                      >
                        {oppName}
                      </TableCell>

                      {/* link */}
                      <TableCell className="tableBodyCell" align="center">
                        <a href={applyLink} style={{ textDecoration: "none" }}>
                          Link
                        </a>
                      </TableCell>

                      {/* registration deadline */}
                      <TableCell
                        className="tableBodyCell"
                        style={{
                          color:
                            new Date().setHours(0, 0, 0, 0) <=
                            new Date(regisDeadline).setHours(0, 0, 0, 0)
                              ? "#dc3545"
                              : "rgba(0, 0, 0, 0.54)",
                        }}
                        align="center"
                      >
                        {moment(regisDeadline).format(" D MMM YYYY")}
                      </TableCell>
                      {/* status */}
                      <TableCell className="tableBodyCell" align="center">
                        <span
                          id={
                            status === "pending..."
                              ? "pendingClass"
                              : "appliedClass"
                          }
                          className="p-2"
                        >
                          {status}
                        </span>
                      </TableCell>
                      {/*Actions*/}
                      <TableCell className="tableBodyCell p-0" align="center">
                        {/* edit icon */}
                        <Tooltip title="Edit">
                          <Link to={`/addUpdate/${id}`} className="link_comp">
                            <IconButton id="editBtn" className="p-0 mr-1">
                              <EditIcon id="track_edit_icon" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        {/* delete icon */}
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => ConfirmDeletePopup(id)}
                            id="deleteBtn"
                            className="p-0 ml-1"
                          >
                            <DeleteIcon id="track_delete_icon" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      <TableCell className="tableBodyCell" align="left">
                        <Link to={`/details/${id}`} className="link_comp">
                          <Button id="more_btn" variant="contained">
                            More...
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        {rows && rows.length === 0 && (
          <div className="d-flex justify-content-center py-5" id="noResult">
            No opportunity found
          </div>
        )}
      </TableContainer>
      <TablePagination
        // very imp to align pagenation part of table vertically center
        sx={{
          ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
            {
              marginTop: "1em",
              marginBottom: "1em",
            },
        }}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows && rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
