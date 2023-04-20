// import css file
import "../css/ForgotPassword.css";
//import from package
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";
//for alert component
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
//sweet alert
import swal from "sweetalert";
//for loading
import { TailSpin } from "react-loader-spinner";
//for authentication
import { useAuth } from "../myFirebase/myAuthFirebase";
// ___________________________________________________________forgot password section_______________________________________________

const ForgotPassword = () => {
  //for authentication
  const { myForgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //showSweetAlertPopup when successfully signed up
  function showSweetAlertPopup() {
    swal({
      title: "Success",
      text: "Email sent ,check your email to reset the password.",
      icon: "success",
      closeOnClickOutside: false,
    }).then((willRedirect) => {
      if (willRedirect) {
        //replace only last arg of current path
        navigate("../login");
      }
    });
  }
  // __________________________________________________handle sending password reset link___________________________________________
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    //remove all prev error
    setError("");
    //if any field is empty
    if (!email) return setError("email is required");
    else {
      setLoading(true);
      try {
        await myForgotPassword(email);
        showSweetAlertPopup();
      } catch (err) {
        if (err.code === "auth/user-not-found")
          return setError(
            "User account not found. Please check your email address."
          );
        setError(err.message);
      } finally {
        setLoading(false); //always execute
      }
    }
  };

  return (
    <div
      id="forgotPassword_page"
      className="row d-flex justify-content-center align-items-center"
    >
      <div className="col-md-6 col-lg-3">
        <Paper component={Box} p={3} m={1}>
          {/*_________login heading___________ */}
          <div className="text-center py-2" id="forgotPassword_heading">
            Forgot Password
          </div>
          <form onSubmit={handleForgotPassword}>
            {/* _______________________________________________email field_________________________________________________________ */}
            <div className="py-2">
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                id="standard-basic"
                placeholder="Email *"
                type="email"
                fullWidth
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                autoComplete="on"
              />
            </div>
            {/* __________________________________________display error _________________________________________________ */}
            {error && (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="error">
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              </Stack>
            )}

            {/*_________send Reset Email btn___________ */}
            <div>
              <Button
                type="submit"
                id="forgotPassword_btn"
                className="my-3"
                fullWidth
                variant="contained"
              >
                {loading ? (
                  <TailSpin height="30" color="grey" />
                ) : (
                  "SEND RESET EMAIL"
                )}
              </Button>
            </div>
          </form>

          <p id="horizontal-line">OR</p>
          {/*_________login page link___________ */}
          <div className="pt-1 d-flex justify-content-center">
            <Link to="/login" className="link_comp">
              Log in
            </Link>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ForgotPassword;
