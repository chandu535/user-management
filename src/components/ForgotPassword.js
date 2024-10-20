import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, Card, IconButton, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react18-input-otp";
import { toast } from "sonner";
import { sendOTPAPI, verifyForgotPasswordAPI } from "../lib/services/auth";
import Errors from "./core/Errors";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isMailSent, setIsMailSent] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      setValidationErrors({});
      setErrorMessage("");

      let res = await sendOTPAPI({
        payload: { email: userDetails?.email ? userDetails?.email : undefined },
      });
      let responseData = await res.json();
      if (res.status === 200 || res.status === 201) {
        toast.success(responseData.message);
        setIsMailSent(true);
      } else if (res.status == 422) {
        setValidationErrors(responseData.errors?.details);
      } else {
        throw responseData;
      }
    } catch (err) {
      console.error("test");
      dispatch(setUserDetails({ test: "done" }));
      toast.error(err?.message || "Login Failed");
    } finally {
      setShowLoading(false);
    }
  };

  const verifyOTPAndChangePassword = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    try {
      const response = await verifyForgotPasswordAPI({
        payload: {
          email: userDetails?.email ? userDetails?.email : undefined,
          otp: userDetails?.otp ? userDetails?.otp : undefined,
          password: userDetails?.password ? userDetails?.password : undefined,
          confirm_password: userDetails?.confirm_password
            ? userDetails?.confirm_password
            : undefined,
        },
      });
      const responseData = await response.json();
      if (response.status === 200 || response.status === 201) {
        toast.success(responseData.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.status == 422) {
        setValidationErrors(responseData.errors?.details);
      } else {
        throw responseData;
      }
    } catch (error) {
      toast.error(error?.message || "Login Failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  const onChangeTextField = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
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
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label>Email</label>
              <div style={{ display: "flex", gap: "1rem" }}>
                <TextField
                  size="small"
                  placeholder="Enter your email"
                  variant="outlined"
                  type={"text"}
                  name="email"
                  value={userDetails?.email}
                  onChange={onChangeTextField}
                  disabled={isMailSent}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={showLoading || isMailSent}
                >
                  {showLoading ? (
                    <CircularProgress size={"1.5rem"} sx={{ color: "#fff" }} />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
              <Errors validationErrors={validationErrors} keyName={"email"} />
            </div>
          </form>

          {isMailSent ? (
            <form onSubmit={verifyOTPAndChangePassword}>
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
                disabled={verifyLoading}
              >
                {verifyLoading ? (
                  <CircularProgress size={"1.5rem"} sx={{ color: "#fff" }} />
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          ) : (
            ""
          )}
          <div>
            Want to create an account?
            <Link to="/sign-up">Sign Up</Link>
          </div>
        </Card>
      </div>
    </>
  );
};
export default ForgotPassword;
