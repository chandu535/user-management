import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getUserProfileAPI,
  updateUserProfileAPI,
  uploadProfileAPI,
} from "../lib/services/auth";
import dayjs from "dayjs";
import Errors from "./core/Errors";
import { toast } from "sonner";
import Cookies from "js-cookie";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [uploadingProfileLoading, setUploadingProfileLoading] = useState(false);
  const [file, setFile] = useState(null);
  console.log(file, "filefile");

  const logout = () => {
    localStorage.clear();
    Cookies.remove("token");
    window.location.replace("/");
  };
  const getUserProfile = async () => {
    setShowLoading(true);
    try {
      const response = await getUserProfileAPI();
      const responseData = await response.json();
      if (response.status === 200 || response.status === 201) {
        setProfileData(responseData.data);
        // setFile(responseData.data.profile_pic);
        convertBase64ToReadableStream(responseData.data.profile_pic);
      } else if (response.status == 401 || response.status == 403) {
        logout();
      } else {
        throw responseData;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowLoading(false);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);

  const onChangeTextField = (e) => {
    setEditProfileData({ ...editProfileData, [e.target.name]: e.target.value });
  };
  const onUpdateProfile = async () => {
    setUpdateLoading(true);
    try {
      const payload = {
        first_name: editProfileData.first_name
          ? editProfileData.first_name
          : undefined,
        last_name: editProfileData.last_name
          ? editProfileData.last_name
          : undefined,
        user_name: editProfileData.user_name
          ? editProfileData.user_name
          : undefined,
      };

      const response = await updateUserProfileAPI({ payload });
      const responseData = await response.json();
      if (response.status === 200 || response.status === 201) {
        setEditProfile(false);
        getUserProfile();
      } else if (response.status == 401 || response.status == 403) {
        logout();
      } else if (response.status == 422) {
        setValidationErrors(responseData.errors?.details);
      } else {
        throw responseData;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };
  const getLoadingText = () => {
    if (showLoading) {
      return "Getting Profile...";
    }
    if (updateLoading) {
      return "Updating Profile...";
    }
    if (uploadingProfileLoading) {
      return "Uploading Profile...";
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    const blobURL = URL.createObjectURL(file);
    setFile(blobURL);
    try {
      setUploadingProfileLoading(true);
      const response = await uploadProfileAPI({
        file: file,
      });
      const responseData = await response.json();
      if (response.status === 200 || response.status === 201) {
        toast.success(responseData.message);
      } else if (response.status == 401 || response.status == 403) {
        logout();
      } else {
        throw responseData;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingProfileLoading(false);
    }
  };

  const convertBase64ToReadableStream = (base64) => {
    try {
      setFile(base64);
    } catch (error) {
      console.error("Error converting base64 to blob:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      {!editProfile ? (
        <Card sx={{ width: "25%", padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setEditProfile(true);
                setEditProfileData(profileData);
              }}
            >
              Edit
            </Button>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "1rem",
              paddingBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Profile</h3>
            <div>
              Last Login:{" "}
              {dayjs(profileData?.last_login).format("DD-MMM-YYYY hh:mm A")}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "1rem",
            }}
          >
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
              <Avatar
                src={file ? file : ""}
                sx={{
                  width: "100px",
                  height: "100px",
                  color: "#013b79",
                  bgcolor: "#f5c543",
                }}
              >
                {(profileData?.first_name ? profileData?.first_name[0] : "") +
                  (profileData?.last_name ? profileData?.last_name[0] : "")}
              </Avatar>
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".jpg, .png, .jpeg"
              hidden
              onChange={onFileChange}
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{ textAlign: "center", fontSize: "1rem", display: "flex" }}
            >
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                First Name:
              </div>
              <div>{profileData?.first_name}</div>
            </div>
            <div
              style={{ textAlign: "center", fontSize: "1rem", display: "flex" }}
            >
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Last Name:
              </div>
              <div>{profileData?.last_name}</div>
            </div>
            <div
              style={{ textAlign: "center", fontSize: "1rem", display: "flex" }}
            >
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Username:
              </div>
              <div>{profileData?.user_name}</div>
            </div>
            <div
              style={{ textAlign: "center", fontSize: "1rem", display: "flex" }}
            >
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Email:
              </div>
              <div>{profileData?.email}</div>
            </div>
          </div>
        </Card>
      ) : (
        <Card sx={{ width: "25%", padding: "2rem" }}>
          <div
            style={{
              textAlign: "center",
              fontSize: "1rem",
              paddingBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Edit Profile</h3>
            <div>
              Last Login:{" "}
              {dayjs(profileData?.last_login).format("DD-MMM-YYYY hh:mm A")}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "1rem",
            }}
          >
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
              <Avatar
                src={file ? file : ""}
                sx={{
                  width: "100px",
                  height: "100px",
                  color: "#013b79",
                  bgcolor: "#f5c543",
                }}
              >
                {(profileData?.first_name ? profileData?.first_name[0] : "") +
                  (profileData?.last_name ? profileData?.last_name[0] : "")}
              </Avatar>
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".jpg, .png, .jpeg"
              hidden
              onChange={onFileChange}
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                First Name:
              </div>

              <div>
                <TextField
                  value={editProfileData?.first_name}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "10px",
                    },
                  }}
                  onChange={onChangeTextField}
                  placeholder="Enter First Name"
                  name="first_name"
                />
                <Errors
                  validationErrors={validationErrors}
                  keyName={"first_name"}
                />
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Last Name:
              </div>
              <div>
                <TextField
                  value={editProfileData?.last_name}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "10px",
                    },
                  }}
                  onChange={onChangeTextField}
                  placeholder="Enter First Name"
                  name="last_name"
                />
                <Errors
                  validationErrors={validationErrors}
                  keyName={"last_name"}
                />
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Username:
              </div>
              <div>
                <TextField
                  value={editProfileData?.user_name}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "10px",
                    },
                  }}
                  onChange={onChangeTextField}
                  placeholder="Enter user name"
                  name="user_name"
                />
                <Errors
                  validationErrors={validationErrors}
                  keyName={"user_name"}
                />
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Email:
              </div>
              <div>
                <TextField
                  disabled
                  value={editProfileData?.email}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "10px",
                    },
                  }}
                  onChange={onChangeTextField}
                  placeholder="Enter user name"
                  name="email"
                />
                <Errors validationErrors={validationErrors} keyName={"email"} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setEditProfileData({});
                setEditProfile(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => onUpdateProfile()}>Update</Button>
          </div>
        </Card>
      )}

      <Backdrop open={showLoading || updateLoading || uploadingProfileLoading}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "#fff" }} />
          <p style={{ color: "#fff", fontSize: "1rem", fontWeight: "bold" }}>
            {getLoadingText()}
          </p>
        </div>
      </Backdrop>
    </div>
  );
};

export default Profile;
