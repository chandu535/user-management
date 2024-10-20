import { Button, Card, IconButton, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setUserDetails as setUserDetailsToStore } from "../Store/AuthSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import { sendOTPAPI, signUpAPI } from "../lib/services/auth";
import Errors from "./core/Errors";
import OtpInput from "react18-input-otp";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState({
    // user_name: "sridhar11",
    // first_name: "sridhar",
    // last_name: "chowdary",
    // email: "sridhar@gmail.com",
    // password: "Sridhar@1818",
    // otp: "849508",
    // confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [emailSentOrNot, setEmailSentOrNot] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/feed");
    }
  }, []);

  const onChangeTextField = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };
  let handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      setValidationErrors({});
      setErrorMessage("");

      const payload = {
        user_name: userDetails.user_name ? userDetails.user_name : undefined,
        first_name: userDetails.first_name ? userDetails.first_name : undefined,
        last_name: userDetails.last_name ? userDetails.last_name : undefined,
        email: userDetails.email ? userDetails.email : undefined,
        password: userDetails.password ? userDetails.password : undefined,
        confirm_password: userDetails.confirm_password
          ? userDetails.confirm_password
          : undefined,
        otp: userDetails.otp ? userDetails.otp : undefined,
      };
      let res = await signUpAPI({ payload });
      let responseData = await res.json();

      if (res.status === 200 || res.status === 201) {
        toast.success(responseData.message);
        dispatch(setUserDetailsToStore(responseData.data));
        navigate("/feed");
      } else if (res.status == 422) {
        setValidationErrors(responseData.errors?.details);
      } else {
        toast.error(responseData.message || "Login Failed");
        throw responseData;
      }
    } catch (err) {
      console.error("test");
      toast.error(err?.message || "Login Failed");
    } finally {
      setShowLoading(false);
    }
  };

  const [otpLoading, setOtpLoading] = useState(false);

  let sendOTP = async (e) => {
    setOtpLoading(true);
    setValidationErrors([]);
    e.preventDefault();
    try {
      let res = await sendOTPAPI({ payload: { email: userDetails.email } });
      let responseData = await res.json();
      if (res.status === 200 || res.status === 201) {
        toast.success(responseData.message);
        setEmailSentOrNot(true);
      } else if (res.status == 422) {
        setValidationErrors(responseData.errors?.details);
      } else if (res.status == 401) {
        setErrorMessage(responseData.message);
      } else {
        throw responseData;
      }
    } catch (err) {
      toast.error(err?.message || "Login Failed");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card sx={{ width: "25%", padding: "0 3rem 3rem 3rem " }}>
          <img src="login/login-top-right-img.png" alt="" />
          <img src="login/login-bottom-left-img.png" alt="" />
          <div>
            <img src="login/login-logo.svg" alt="" />
          </div>
          <div>
            <h3>Welcome Back</h3>
            <p>Enter your email and password to access your account</p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Email</label>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <TextField
                size="small"
                placeholder="Enter your Email"
                variant="outlined"
                type={"text"}
                name="email"
                disabled={emailSentOrNot || otpLoading}
                value={userDetails?.email}
                onChange={onChangeTextField}
                style={{
                  background: "#FAF4F0",
                  width: "100%",
                  borderRadius: "8px",
                }}
              />
              <Button
                sx={{ width: "120px", textTransform: "none" }}
                onClick={sendOTP}
                variant="contained"
                disabled={emailSentOrNot || otpLoading}
              >
                {otpLoading ? (
                  <CircularProgress size={"1.5rem"} sx={{ color: "#fff" }} />
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
            <Errors validationErrors={validationErrors} keyName={"email"} />
          </div>
          {emailSentOrNot ? (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label>OTP</label>
                <OtpInput
                  value={userDetails?.otp}
                  onChange={(e) => {
                    setUserDetails((prev) => ({ ...prev, otp: e }));
                  }}
                  numInputs={6}
                  isInputNum
                  shouldAutoFocus
                  inputStyle="otpInputs"
                />
                <Errors validationErrors={validationErrors} keyName={"otp"} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>First Name</label>
                <TextField
                  size="small"
                  placeholder="Enter your first name"
                  variant="outlined"
                  type={"text"}
                  name="first_name"
                  value={userDetails?.first_name}
                  onChange={onChangeTextField}
                  style={{
                    background: "#FAF4F0",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
                <Errors
                  validationErrors={validationErrors}
                  keyName={"first_name"}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Last Name</label>
                <TextField
                  size="small"
                  placeholder="Enter your last name"
                  variant="outlined"
                  type={"text"}
                  name="last_name"
                  value={userDetails?.last_name}
                  onChange={onChangeTextField}
                  style={{
                    background: "#FAF4F0",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
                <Errors
                  validationErrors={validationErrors}
                  keyName={"last_name"}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>User Name</label>
                <TextField
                  size="small"
                  placeholder="Enter your user name"
                  variant="outlined"
                  type={"text"}
                  name="user_name"
                  value={userDetails?.user_name}
                  onChange={onChangeTextField}
                  style={{
                    background: "#FAF4F0",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
                <Errors
                  validationErrors={validationErrors}
                  keyName={"user_name"}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Password </label>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={userDetails?.password}
                  name="password"
                  onChange={onChangeTextField}
                  style={{
                    background: "#FAF4F0",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                />
                <Errors
                  validationErrors={validationErrors}
                  keyName={"password"}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Confirm Password </label>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={userDetails?.confirm_password}
                  name="confirm_password"
                  onChange={onChangeTextField}
                  style={{
                    background: "#FAF4F0",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                />
                <Errors
                  validationErrors={validationErrors}
                  keyName={"confirm_password"}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                disabled={showLoading === true ? true : false}
              >
                {showLoading ? (
                  <CircularProgress size={"1.5rem"} sx={{ color: "#fff" }} />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          ) : (
            ""
          )}
          <div>
            Already have an account?
            <Link to="/">Login</Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SignUp;
