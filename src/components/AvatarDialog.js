// import css file
import "../css/AvatarDialog.css";
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
//info icon
import { FaInfoCircle } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
//for authentication
import { useAuth } from "../myFirebase/myAuthFirebase";
//for firestore database
import { useFirestore } from "../myFirebase/myFirestoreFirebase";
// ________________________________________________avatar and dialog section____________________________________________
export default function AvatarDialog() {
  //for authentication
  const { currentUser } = useAuth();
  //foe firestore database
  const { fetchDocsByQuery } = useFirestore();

  const [userName, setUserName] = useState("");

  useEffect(() => {
    //fetch one doc of current user using query when docId is not known
    const getUserName = async () => {
      try {
        const querySnapshot = await fetchDocsByQuery(
          "Users",
          "userId",
          currentUser.uid
        );

        setUserName(querySnapshot.docs[0].data().username);
      } catch (err) {}
    };
    if (currentUser) {
      currentUser.displayName
        ? setUserName(currentUser.displayName)
        : getUserName();
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <FaInfoCircle id="userInfo" className="mx-2" onClick={handleClickOpen} />
      <Dialog
        //open dialog at end
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "flex-end",
            alignItems: "flex-start",
          },
        }}
        PaperProps={{
          sx: {
            marginTop: 10,
          },
        }}
        //make behind the dialog everything visible
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0)" },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description"> */}
          <div className="d-flex align-items-center">
            <div>
              <Avatar
                sx={{ bgcolor: "grey", fontWeight: "bold" }}
                className="mr-2"
              >
                {userName.slice(0, 1).toUpperCase()}
              </Avatar>
            </div>
            <div>
              <b>{userName}</b>
              <div style={{ color: "rgb(82, 116, 185)", fontWeight: "bold" }}>
                {currentUser.email}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
