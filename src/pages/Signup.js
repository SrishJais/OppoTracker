// import css file
import "../css/Signup.css";
//import from package
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";//password icon
import InputAdornment from "@mui/material/InputAdornment";
//for alert component
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
//popover for password instructions
import { FaInfoCircle } from "react-icons/fa"; //info icon
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
//for toggle password
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
//sweet alert
import swal from "sweetalert";
//for loading
import { TailSpin } from "react-loader-spinner";
//authentication
import { useAuth } from "../myFirebase/myAuthFirebase";
//for firestore database
import { useFirestore } from "../myFirebase/myFirestoreFirebase";

// ____________________________________________________________Signup section___________________________________________________________

const Signup = () => {
  //for authentication
  const { mySignup, currentUser,myLogout,verifyEmail} = useAuth();
  //from firestore database
  const { addNew } = useFirestore();

  const [formData, setformData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword:""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //____________________________________________handle input fields _____________________________________________________
  function handleInput(e) {
    setformData({ ...formData, [e.target.name]: e.target.value });
  }

  // _______________________________________popover for password instructions____________________________________________
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //  _______________________________________________toggle password_______________________________________________________
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  //_____________________________________________________________showSweetAlertPopup________________________________________
  function showSweetAlertPopup() {
    swal({
      title: "Welcome",
      text: "Signed up successfully.Verification email sent.Check your email.",
      icon: "success",
      closeOnClickOutside: false,
    }).then((willRedirect) => {
      if (willRedirect) {
        //replace only last arg of current path
        navigate("../login");
      }
    });
  }
  //_____________________________________________________handle Sign up_____________________________________________________

  const handleSignUp = async (e) => {
    e.preventDefault();
    //remove all prev error
    setError("");

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;

    //if any field is empty
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword)
      return setError("All fields are required");
    //email validation
    else if (!formData.email.match(emailRegex))
      return setError("Invalid email");
    //password validation
    else if (!formData.password.match(passwordRegex))
      return setError(
        "Password must contain min 6 digit characters,1 uppercase letter,1 lowercase letter, 1 digit,1 special character"
      );
    else if(formData.confirmPassword!==formData.password)
      return setError("Password not matched");
    else {
      setLoading(true);
      try {
        const result=await mySignup(formData.email, formData.password);
        // intentionally storing in separate collection ,other way is to store the user name in currentUser obj
        await addNew("Users", {userId: result.user.uid,username: formData.username});
        await myLogout();
        await verifyEmail(result.user);
        showSweetAlertPopup();
      }catch (err) {
        if (err.code === "auth/email-already-in-use")
          return setError(
            "email already in use,please login or try with another email"
          );
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      id="signup_page"
      className="row d-flex justify-content-center align-items-center"
    >
      <div className="col-md-6 col-lg-3">
        <Paper component={Box} p={3} m={1}>
          {/*_____________________________________________________________signup heading___________________________________________ */}
          <div className="text-center py-2" id="signup_heading">
            Sign up
          </div>

          {/*___________________________________________________________input fields__________________________________________ */}
          {/*__________________________________________________________ username field________________________________________*/}
          <form noValidate="novalidate" onSubmit={handleSignUp}>
            <div className="py-2">
              <TextField
                name="username"
                value={formData.username}
                onChange={handleInput}
                id="standard-basic1"
                placeholder="Username *"
                type="text"
                fullWidth
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                autoComplete="on"
              />
            </div>

            {/* -----------------------------------------------email field----------------------------------------------------- */}
            <div className="py-2">
              <TextField
                value={formData.email}
                onChange={handleInput}
                name="email"
                id="standard-basic2"
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
            {/* -------------------------------------------------------------password field---------------------------------- */}
            <div className="py-2">
              <TextField
                value={formData.password}
                onChange={handleInput}
                name="password"
                id="standard-password-input"
                placeholder="Password *"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HttpsIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                variant="standard"
              />
            </div>
            {/* password instruction and toggle password icon */}
              <div className="d-flex justify-content-between">               
            {/* __________Popover for password instructions__________ */}
                <FaInfoCircle id="passInstruction_icon" onClick={handleClick} />
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Typography sx={{ p: 2, width: "300px" }} id="passPopup">
                    Password must contain min 6 digit characters,1 uppercase
                    letter,1 lowercase letter, 1 digit,1 special character.
                  </Typography>
                </Popover>
                {/* _______________________Toggle password_______________________ */}
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  className="p-0 togglePass_icon"
                >
                  {showPassword ? <VisibilityOff className="visibilityPosition"/> : <Visibility className="visibilityPosition"/>}
                </IconButton>
              </div>
            {/* ----------------------------------------------------confirm password field---------------------------------- */}
            <div className="pb-2">
              <TextField
                value={formData.confirmPassword}
                onChange={handleInput}
                name="confirmPassword"
                id="standard-confirmPassword-input"
                placeholder="Confirm Password *"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HttpsIcon/>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                variant="standard"
              />
            </div>
              {/* password instruction and toggle password icon  */}
             <div>
              <div className="d-flex justify-content-end">               
                {/* _______________________Toggle password_______________________ */}
                 <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfirmPassword}
                  className="p-0 togglePass_icon"
                >
                  {showConfirmPassword ? <VisibilityOff className="visibilityPosition" style={{bottom:"19px"}}/> : <Visibility className="visibilityPosition" style={{bottom:"19px"}}/>}
                </IconButton>
              </div>

            </div>
            {/* __________________________________________display error during signup____________________________________________*/}
            {error && (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="error">
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              </Stack>
            )}
            {/*___________________________________________________________signpup btn___________________________________________- */}
            <div>
              <Button
                id="signup_btn"
                type="submit"
                className="my-3"
                fullWidth
                variant="contained"
              >
                {loading ? <TailSpin height="30" color="grey" /> : "SIGN UP"}
              </Button>
            </div>
          </form>
          {/*________________________________________________________________login page link_____________________________________ */}
          <div className="pt-1">
            Already have an account ?
            <Link to="/login" className="link_comp ml-2">
              Log in
            </Link>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Signup;
