import API_URL from "../config";
import Cookies from "js-cookie";

export const signInAPI = async (username, password) => {
  let url = `${process.env.REACT_APP_API_BASE_URL}/signin`;
  let options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // Accepts: "application/json",
    },
    body: JSON.stringify({
      user_name: username ? username : undefined,
      password: password ? password : undefined,
    }),
  };
  return await fetch(url, options);
};
export const signUpAPI = async ({ payload }) => {
  let url = `${API_URL}/signup`;
  let options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // Accepts: "application/json",
    },
    body: JSON.stringify(payload),
  };
  return await fetch(url, options);
};

export const sendOTPAPI = async ({ payload }) => {
  let url = `${API_URL}/send-otp`;
  let options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  return await fetch(url, options);
};

export const getUserProfileAPI = async () => {
  const url = `${API_URL}/user`;
  let options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: Cookies.get("token"),
    },
  };
  return await fetch(url, options);
};

export const updateUserProfileAPI = async ({ payload }) => {
  const url = `${API_URL}/user`;
  let options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: Cookies.get("token"),
    },
    body: JSON.stringify(payload),
  };
  return await fetch(url, options);
};

export const uploadProfileAPI = async ({ file }) => {
  const formData = new FormData();
  formData.append("profile_pic", file);
  const url = `${API_URL}/user-profile-pic`;
  let options = {
    method: "PUT",
    headers: {
      Authorization: Cookies.get("token"),
    },
    body: formData,
  };
  return await fetch(url, options);
};

export const verifyForgotPasswordAPI = async ({ payload }) => {
  let url = `${API_URL}/forgot-password`;
  let options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  return await fetch(url, options);
};
