import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import Cookies from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.Signin.user_details);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getProfile = () => {
    navigate("/profile");
  };
  const handleUpdate = () => {
    navigate("/update-password");
  };

  const handleLogout = async () => {
    dispatch({
      type: "SIGN_OUT",
      payload: {},
    });
    Cookies.remove("token");
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <Card
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "2rem",
          padding: "1.5rem",
        }}
      >
        <Tooltip title="Open settings">
          <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
            <Avatar
              sx={{
                color: "#fff",
                backgroundColor: "#b03877",
                width: 35,
                height: 35,
              }}
              sizes="small"
              alt="Admin"
            >
              {(userData?.first_name ? userData?.first_name[0] : "") +
                (userData?.last_name ? userData?.last_name[0] : "")}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem
            onClick={() => {
              getProfile();
              handleCloseUserMenu();
            }}
          >
            <Grid>
              <Grid item xs={12}>
                <Typography textAlign="center">View Profile</Typography>
              </Grid>
            </Grid>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleUpdate();
              handleCloseUserMenu();
            }}
          >
            <Grid>
              <Grid item xs={12}>
                <Typography textAlign="center">Update Password</Typography>
              </Grid>
            </Grid>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleLogout();
              handleCloseUserMenu();
            }}
          >
            <Grid>
              <Grid item xs={12}>
                <Typography textAlign="center">Logout</Typography>
              </Grid>
            </Grid>
          </MenuItem>
        </Menu>
      </Card>
      <Outlet />
    </>
  );
};

export default Navbar;
