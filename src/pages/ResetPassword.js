// import css file
import "../css/ResetPassword.css";
//import from package
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Paper } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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

// ___________________________________________________________reset password section___________________________________________________________

const ResetPassword = () => {
  //for authentication
  const { myResetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const params = new URLSearchParams(useLocation().search);
  const code = params.get("oobCode");

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //showSweetAlertPopup
  function showSweetAlertPopup() {
    swal({
      title: "Success",
      text: "Password Reset successfully",
      icon: "success",
      closeOnClickOutside: false,
    }).then((willRedirect) => {
      if (willRedirect) {
        //replace only last arg of current path
        navigate("../login");
      }
    });
  }
  const handleResetPassword = async (e) => {
    e.preventDefault();
    //remove all prev error
    setError("");
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
    //if any field is empty
    if (!newPassword || !confirmPassword)
      return setError("Please fill all the required fields.");
    //password validation
    else if (!newPassword.match(passwordRegex))
      return setError(
        "Password must contain min 6 digit character,1 uppercase letter,1 lowercase letter, 1 digit,1 special character."
      );
    else if (confirmPassword !== newPassword)
      return setError("Password not matched.");
    else {
      setLoading(true);
      try {
        await myResetPassword(code, newPassword);
        showSweetAlertPopup();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); //always execute
      }
    }
  };

  return (
    <div
      id="resetPassword_page"
      className="row d-flex justify-content-center align-items-center"
    >
      <div className="col-md-6 col-lg-3">
        <Paper component={Box} p={3} m={1}>
          {/*_________login heading___________ */}
          <div className="text-center py-2" id="resetPassword_heading">
            Reset Password
          </div>
          <form onSubmit={handleResetPassword}>
            {/* _______________________________________________new password field_________________________________________________________ */}

            <div className="py-2">
              <FormControl style={{ width: "100%" }} variant="standard">
                <InputLabel htmlFor="standard-adornment-amount">
                  New Password*
                </InputLabel>
                <Input
                  className="py-1"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  name="newPassword"
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
            {/* ----------------------------------------------------confirm password field---------------------------------- */}

            <div className="py-2">
              <FormControl style={{ width: "100%" }} variant="standard">
                <InputLabel htmlFor="standard-adornment-amount">
                  Confirm Password*
                </InputLabel>
                <Input
                  className="py-1"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
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
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                id="resetPassword_btn"
                className="my-3"
                variant="contained"
              >
                {loading ? <TailSpin height="30" color="grey" /> : "Save"}
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default ResetPassword;
