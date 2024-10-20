import { Button, Card, IconButton, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setUserDetails } from "../Store/AuthSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import Errors from "./core/Errors";
import { signInAPI } from "../lib/services/auth";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/feed");
    }
  }, []);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      setValidationErrors({});
      setErrorMessage("");

      let res = await signInAPI(username, password);

      let responseData = await res.json();

      if (res.status === 200 || res.status === 201) {
        toast.success(responseData.message);
        dispatch(setUserDetails(responseData.data));

        Cookies.set("token", responseData.data.accessToken);
        navigate("/feed");
      } else if (res.status == 422) {
        setValidationErrors(responseData.errors?.details);
      } else if (res.status == 401) {
        setErrorMessage(responseData.message);
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
              <label>User Name</label>
              <TextField
                size="small"
                placeholder="Enter your user name"
                variant="outlined"
                type={"text"}
                name="name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
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
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
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
              <div
                style={{
                  cursor: "pointer",
                  color: "blue",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </div>
              <Errors
                validationErrors={validationErrors}
                keyName={"password"}
              />
            </div>
            <Typography>{errorMessage}</Typography>
            <Button
              type="submit"
              variant="contained"
              disabled={showLoading === true ? true : false}
            >
              {showLoading ? (
                <CircularProgress size={"1.5rem"} sx={{ color: "#fff" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div>
            Want to create an account?
            <Link to="/sign-up">Sign Up</Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SignIn;
