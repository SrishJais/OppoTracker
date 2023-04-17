// import css file
import "../css/Login.css";
//import from package
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import { FcGoogle } from "react-icons/fc";
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
// ___________________________________________________________Login section___________________________________________________________

const Login = () => {
  //for authentication
  const { myLogin, googleLogin, myLogout, setCurrentUser, verifyEmail } =
    useAuth();
  const [LoginResult, setLoginResult] = useState(null);

  const [formData, setformData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const navigate = useNavigate();

  //____________________________________________handle input fields ______________________________________________________________

  function handleInput(e) {
    setformData({ ...formData, [e.target.name]: e.target.value });
  }
  //_____________________________________________________________showSweetAlertPopup________________________________________
  function showSweetAlertPopup() {
    swal({
      title: "Success",
      text: "Verification email sent to verify email address .Check your email.",
      icon: "success",
    });
  }
  //____________________________________________login with email/password _____________________________________________________

  //Login in the web app
  const handleLogin = async (e) => {
    e.preventDefault();
    //remove all prev error
    setError("");
    setGoogleError("");
    //if any field is empty
    if (!formData.email || !formData.password)
      return setError("All fields are required");
    else {
      setLoading(true);
      try {
        const result = await myLogin(formData.email, formData.password);
        setLoginResult(result);
        if (!result.user.emailVerified) {
          await myLogout();
          return setError(
            "Please first verify your email address through your email sent, during Sign up or ask for resend email."
          );
        }
        navigate("../home");
      } catch (err) {
        if (err.code === "auth/wrong-password")
          return setError("wrong password entered,try again!");
        else if (err.code === "auth/too-many-requests")
          return setError(
            "account disabled temporarily due to many failed login attempts.Reset your password or try again later!"
          );
        else if (err.code === "auth/user-not-found")
          return setError(
            "User account not found. Please check your email address or sign up for a new account"
          );
      } finally {
        setLoading(false);
      }
    }
  };

  //____________________________________________login with Google _____________________________________________________

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleError("");
    try {
      const result = await googleLogin();
      const isNewUser = result._tokenResponse.isNewUser;
      if (isNewUser) {
        setGoogleLoading(true);
        //extra line of setting currentUser to null bz after google login and before logout
        // from onAuthStateChanged curentUser parameter gets updated bz myLogout fn is an asynchronous
        //fn which takes time .It avoids flash of setting current user to be visible on the screen after sign up and before login
        setCurrentUser(null);
        //delete user if the user is new from authetication section
        await myLogout();
        await result.user.delete();
        return setGoogleError("Please Sign up before login!!!");
      }
      navigate("../home");
    } catch (err) {
      if (error.code === "auth/cancelled-popup-request")
        return setError("Sign-in cancelled");
      console.log(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };
  const resendEmailVerifyLink = async () => {
    //remove all prev error
    setError("");
    setGoogleError("");
    await verifyEmail(LoginResult.user);
    showSweetAlertPopup();
  };

  return (
    <div
      id="login_page"
      className="row d-flex justify-content-center align-items-center"
    >
      <div className="col-md-6 col-lg-3">
        <Paper component={Box} p={3} m={1}>
          {/*_________login heading___________ */}
          <div className="text-center" id="login_heading">
            Log in
          </div>
          <form onSubmit={handleLogin}>
            {/*__________________________________________________input fields____________________________________________________ */}
            {/* _________________________________email field_____________________________________________ */}

            <div className="py-2">
              <TextField
                value={formData.email}
                onChange={handleInput}
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
            {/* Password field */}
            <div className="py-2">
              <TextField
                value={formData.password}
                onChange={handleInput}
                name="password"
                id="standard-password-input"
                placeholder="Password *"
                type="password"
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

            {/*________Forgot Password link_________ */}
            <div className="text-right pb-1">
              <Link to="/forgotpassword" className="link_comp">
                Forgot Password?
              </Link>
            </div>
            {/* ________display error during login with email/password______________ */}
            {error && (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="error">
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              </Stack>
            )}
            {LoginResult && !loading && (
              <p
                className="mt-1 text-left pb-0 mb-0"
                id="resendEmailVerify"
                onClick={resendEmailVerifyLink}
              >
                Resend email verification?
              </p>
            )}

            {/*_________login btn___________ */}
            <div>
              <Button
                type="submit"
                id="login_btn"
                className="my-3"
                fullWidth
                variant="contained"
              >
                {loading ? <TailSpin height="30" color="grey" /> : "LOGIN"}
              </Button>
            </div>
          </form>

          <p id="horizontal-line">OR</p>

          {/*_________login with google___________ */}
          <div>
            <Button
              variant="contained"
              id="google_icon"
              fullWidth
              className="d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="mr-1" />
              {googleLoading ? (
                <TailSpin height="30" color="grey" />
              ) : (
                <Typography fontWeight="bold">SIGN IN WITH GOOGLE</Typography>
              )}
            </Button>
          </div>

          {googleError && (
            <Stack sx={{ width: "100%" }} spacing={2} mt={1}>
              <Alert severity="error">
                <AlertTitle>{googleError}</AlertTitle>
              </Alert>
            </Stack>
          )}
          {/*_________signup page link___________ */}
          <div className="pt-1 mt-1">
            Don't have an account ?
            <Link to="/signup" className="link_comp ml-2">
              Sign up
            </Link>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
