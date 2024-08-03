import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Fade,
  Avatar,
  Popover,
  Typography,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const ProfilePopup = ({ auth, handleLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenProfilePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfilePopup = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "profile-popup" : undefined;

  const handleOpenProfilePage = () => {
    auth?.user?.role === 1
      ? navigate(`/admin/profile`)
      : navigate(`/user/profile`);
  };

  return (
    <div style={{ width: "100%", padding: "5px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: `calc(100%)`,
          cursor: "pointer",
        }}
        onClick={handleOpenProfilePopup}
        title={auth?.user?.username}
      >
        <Avatar
          src={auth?.user?.profilePic}
          style={{
            marginRight: "15px",
            width: "30px",
            height: "30px",
          }}
        />
        <Typography
          style={{
            fontWeight: "500",
            color: "#0a97a4",
            fontSize: "15px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: `calc(100%)`,
          }}
        >
          {auth?.user?.username}
        </Typography>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseProfilePopup}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            style: {
              background: "#FFFE",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              width: "200px",
            },
          },
        }}
        TransitionProps={{ timeout: { enter: 300, exit: 300 } }}
        TransitionComponent={Fade}
      >
        <Box
          sx={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Box
            sx={{
              padding: "0 0 0 5px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Box display="flex" alignItems="center">
              <div
                style={{
                  fontSize: "17px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: "600",
                  width: `calc(100%)`,
                }}
                title={auth?.user?.username}
              >
                {auth?.user.username}
              </div>
            </Box>
            <Box display="flex" alignItems="center">
              <div
                style={{
                  fontSize: "13px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: `calc(100%)`,
                  color: "#909090",
                }}
                title={auth.user.email}
              >
                {auth.user.email}
              </div>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <IconButton
              size="small"
              onClick={handleOpenProfilePage}
              style={{
                fontSize: "15px",
                color: "#222",
                borderRadius: "5px",
                width: "100%",
                justifyContent: "flex-start",
                gap: "10px",
                padding: "5px",
              }}
            >
              <SettingsOutlinedIcon style={{ fontSize: "20px" }} />
              Settings
            </IconButton>
            <IconButton
              size="small"
              onClick={handleLogout}
              style={{
                fontSize: "15px",
                color: "#222",
                borderRadius: "5px",
                width: "100%",
                justifyContent: "flex-start",
                gap: "10px",
                padding: "5px",
              }}
            >
              <LogoutIcon style={{ fontSize: "20px" }} />
              Logout
            </IconButton>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default ProfilePopup;
