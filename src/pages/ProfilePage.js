import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth.js";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socket.js";
import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Grid,
  Avatar,
  Button,
  Tooltip,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";

const attributeStyle = {
  fontWeight: "500",
  color: "#000",
  fontSize: "17px",
};

const textFieldStyle = {
  borderRadius: "15px",
  height: "37px",
  backgroundColor: "#ededed",
  width: "100%",
};

const PermissionItem = ({ permission }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "5px",
        padding: "4px 7px",
        borderRadius: "7px",
        border: "solid 1px #d9d9d9",
        backgroundColor: "#ededed",
        position: "relative",
        gap: "5px",
      }}
    >
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {permission.name}
      </div>
      <Tooltip title={permission.description} placement="right">
        <InfoOutlinedIcon sx={{ color: "#888", fontSize: "18px" }} />
      </Tooltip>
    </div>
  );
};

const EnterNewPasswordComponent = ({ socket, user }) => {
  const [newPassword, setNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const handleClickShowNewPassword = () => {
    setShowNewPass(!showNewPass);
  };

  const handleClickShowConfirmNewPassword = () => {
    setShowConfirmNewPass(!showConfirmNewPass);
  };
  const handleSaveButton = () => {
    if (newPassword !== confirmNewPassword) {
      setShowPrompt(true);
    } else {
      socket.emit("setNewPassword", {
        newPassword: newPassword,
        userId: user._id,
      });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        maxWidth: "300px",
        padding: "5px 30px",
      }}
    >
      <div
        style={{
          fontWeight: "500",
          fontSize: "20px",
          alignItems: "left",
        }}
      >
        Enter New Password
        <TextField
          type={showNewPass ? "text" : "password"}
          required
          margin="dense"
          fullWidth
          size="small"
          // autoComplete="current-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            style: {
              borderRadius: "5px",
              // height: "45px",
              marginBottom: "10px",
              backgroundColor: "#ededed",
              border: "0px",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowNewPassword}>
                  {showNewPass ? (
                    <Visibility sx={{ fontSize: "20px" }} />
                  ) : (
                    <VisibilityOff sx={{ fontSize: "20px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div
        style={{
          fontWeight: "500",
          fontSize: "20px",
        }}
      >
        Confirm New Password
        <TextField
          type={showConfirmNewPass ? "text" : "password"}
          required
          margin="dense"
          fullWidth
          size="small"
          // autoComplete="current-password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            style: {
              borderRadius: "5px",
              // height: "45px",
              marginBottom: "10px",
              backgroundColor: "#ededed",
              border: "0px",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowConfirmNewPassword}>
                  {showConfirmNewPass ? (
                    <Visibility sx={{ fontSize: "20px" }} />
                  ) : (
                    <VisibilityOff sx={{ fontSize: "20px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        onClick={handleSaveButton}
        sx={{
          // width: "200px",
          borderRadius: "5px",
          height: "40px",
          color: "#fff",
          fontSize: "14px",
          backgroundColor: "#0F8FA9",
          "&:hover": {
            backgroundColor: "#075D73",
          },
        }}
      >
        Save
      </Button>
      {showPrompt && (
        <div
          style={{
            marginTop: "10px",
            color: "#dd2025",
            fontWeight: "500",
            fontSize: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: "20px", color: "#dd2025" }} />
          New Password and Confirm New Password do not match.
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const [socket] = useSocket();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const [username, setUsername] = useState(auth?.user?.username || "");
  const [phone, setPhone] = useState(auth?.user?.phone || "");
  const [userPermissions, setUserPermissions] = useState(
    auth?.user?.permissions || []
  );
  const [loading, setLoading] = useState(false);
  const [isOpenUpdatePassword, setOpenUpdatePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isOldPasswordMatch, setOldPasswordMatch] = useState(false);
  const [showpass, setShowpass] = useState(false);
  const [showIncorrectPasswordEntered, setShowIncorrectPasswordEntered] =
    useState(false);
  const [profilePic, setProfilePic] = useState();
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);
  const [profilePicUrl, setProfilePicUrl] = useState(auth?.user?.profilePic);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
  };

  useEffect(() => {
    if (auth.user === null && auth.token === "") {
      navigate("/login");
      localStorage.clear();
      toast.success("Logout successful");
    } else if (auth.user) {
      // const storedPermissions = localStorage.getItem("userPermissions");
      // if (storedPermissions) {
      //   setLoading(false);
      //   setUserPermissions(JSON.parse(storedPermissions));
      // } else {
      // }
      getAllPermissions();
    }
    // eslint-disable-next-line
  }, [auth]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleSelectProfilePicture = (event) => {
    const file = event.target.files[0];
    if (file.type === "image/png" || file.type === "image/jpeg") {
      if (file.size <= 1 * 1024 * 1024) {
        setProfilePic(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setProfilePicUrl(reader.result);
        };
      } else {
        toast.error("Image Size Limit (1MB) exceeded");
      }
    } else {
      toast.error("Unsupported file format");
    }
  };

  const handleOpenProfilePictureInput = () => {
    fileInputRef.current.click();
  };

  const handleClickShowPassword = () => {
    setShowpass(!showpass);
  };

  const getAllPermissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/user/all-permission`,
        {
          params: { adminId: auth?.user?._id },
        }
      );
      if (response.status === 200) {
        const permissionObjects = [];
        userPermissions?.forEach((permissionName) => {
          const permission = response.data?.permissions?.find(
            (perm) => perm.name === permissionName
          );
          if (permission) {
            permissionObjects.push({
              name: permission.name,
              description: permission.description,
            });
          }
        });
        setUserPermissions(permissionObjects);
        // localStorage.setItem(
        //   "userPermissions",
        //   JSON.stringify(permissionObjects || {})
        // );
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        toast.error(error.response.data.message);
        if (
          error.response.data.message ===
          "Session expired!\nPlease login again."
        ) {
          handleLogout();
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("Network error. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  document.title = "User Profile";

  const handleCloseProfile = () => {
    window.history.go(-1);
  };
  const handleArrowBackButton = () => {
    setOpenUpdatePassword(false);
    setOldPasswordMatch(false);
  };

  const handleCancelButton = () => {
    setUsername(auth?.user.username);
    setPhone(auth?.user.phone);
    handleCloseProfile();
  };

  const handleSubmitButton = async () => {
    try {
      if (
        username === auth?.user.username &&
        phone === auth?.user?.phone &&
        !profilePic
      ) {
        toast.success("No change found");
        return;
      }
      const profileData = new FormData();
      profileData.append("userId", auth?.user._id);
      profileData.append("username", username);
      profileData.append("phone", phone);
      profileData.append("profilePic", profilePic);

      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/auth/update-profile`,
          profileData
        ),
        {
          loading: "Updating Profile... Please Wait!",
          success: (response) => {
            if (response.status === 200) {
              setProfilePic();
              setProfilePicUrl(response.data.profile);
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            console.error(error);
            if (error.response) {
              // Server responded with a status code outside of 2xx range
              if (
                error.response.data.message ===
                "Session expired!\nPlease login again."
              ) {
                handleLogout();
              }
              return error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              return "Network error. Please try again later.";
            } else {
              // Something happened in setting up the request that triggered an error
              return "An unexpected error occurred. Please try again later.";
            }
          },
        }
      );
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        toast.error(error.response.data.message);
        if (
          error.response.data.message ===
          "Session expired!\nPlease login again."
        ) {
          handleLogout();
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("Network error. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const handleNextButton = () => {
    setShowIncorrectPasswordEntered(false);
    socket.emit("passwordMatch", { currentPassword, userId: auth?.user._id });
  };

  useEffect(() => {
    socket?.on("passwordMatchSuccessful", () => {
      setOldPasswordMatch(true);
    });

    socket?.on("passwordMatchFailed", () => {
      setShowIncorrectPasswordEntered(true);
    });
    socket?.on("passwordUpdateSuccessful", () => {
      toast.success("Password Changed Successfully");
      setShowIncorrectPasswordEntered(false);
      setOldPasswordMatch(false);
      handleLogout();
    });

    return () => {
      socket.removeAllListeners("passwordMatchSuccessful");
      socket.removeAllListeners("passwordMatchFailed");
      socket.removeAllListeners("passwordUpdateSuccessful");
    };
    // eslint-disable-next-line
  }, [socket]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        height: "100vh",
        backgroundColor: "#fff",
        overflow: "auto",
        padding: "0px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "50px",
          border: "solid 1px #d9d9d9",
          alignItems: "center",
          padding: "5px",
        }}
      >
        {isOpenUpdatePassword || isOldPasswordMatch ? (
          <IconButton onClick={handleArrowBackButton}>
            <ArrowBackIcon sx={{ color: "#000" }} />
          </IconButton>
        ) : (
          <IconButton onClick={handleCloseProfile}>
            <CloseOutlinedIcon sx={{ color: "#000" }} />
          </IconButton>
        )}
      </Box>
      {isOpenUpdatePassword ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: `calc(100vh - 50px)`,
            overflow: "auto",
          }}
        >
          {isOldPasswordMatch ? (
            <EnterNewPasswordComponent socket={socket} user={auth?.user} />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "350px",
                  padding: "5px 50px",
                }}
              >
                <div
                  style={{
                    fontWeight: "500",
                    fontSize: "18px",
                  }}
                >
                  Enter current password
                </div>
                <TextField
                  type={showpass ? "text" : "password"}
                  required
                  margin="dense"
                  fullWidth
                  size="small"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  InputProps={{
                    style: {
                      borderRadius: "5px",
                      marginBottom: "10px",
                      backgroundColor: "#ededed",
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showpass ? (
                            <Visibility sx={{ fontSize: "20px" }} />
                          ) : (
                            <VisibilityOff sx={{ fontSize: "20px" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  onClick={handleNextButton}
                  sx={{
                    borderRadius: "5px",
                    height: "40px",
                    color: "#fff",
                    fontSize: "14px",
                    backgroundColor: "#0F8FA9",
                    "&:hover": {
                      backgroundColor: "#075D73",
                    },
                  }}
                >
                  Next
                </Button>
                <div
                  style={{
                    marginTop: "10px",
                    color: "#0f8fa9",
                    fontWeight: "600",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/reset-password-mail");
                  }}
                >
                  Forgot Password
                </div>

                {showIncorrectPasswordEntered && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#dd2025",
                      fontWeight: "500",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "not-allowed",
                    }}
                  >
                    <InfoOutlinedIcon
                      sx={{ fontSize: "20px", color: "#dd2025" }}
                    />
                    Incorrect password entered
                  </div>
                )}
              </div>
            </>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: `calc(100vh - 50px)`,
            overflow: "auto",
            padding: "5px 50px",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "80px",
              flexDirection: "column",
              width: "100%",
              maxWidth: "600px",
              justifyContent: "center",
              gap: "5px",
              padding: "20px",
            }}
          >
            <div
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: "28px",
              }}
            >
              Account Settings
            </div>
            <div
              style={{
                color: "#464648",
                fontWeight: "300",
                fontSize: "14px",
              }}
            >
              Manage your Zippi Account
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "600px",
              height: `calc(100% - 80px)`,
              overflow: "auto",
              padding: "20px",
            }}
          >
            <div style={{ margin: "0 0 5px 0" }}>
              <div style={attributeStyle}>Profile photo</div>
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  cursor: "pointer",
                  height: "125px",
                  width: "125px",
                  margin: "15px 5px",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleOpenProfilePictureInput}
              >
                <Avatar
                  src={profilePicUrl}
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                />
                {hovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#fff",
                    }}
                  >
                    <PhotoCameraRoundedIcon style={{ fontSize: "40px" }} />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleSelectProfilePicture}
              />
            </div>
            <div style={{ margin: "0 0 15px 0" }}>
              <div style={attributeStyle}>Full Name</div>
              <TextField
                margin="dense"
                type="text"
                name="name"
                required
                fullWidth
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                InputProps={{
                  style: textFieldStyle,
                }}
              />
            </div>

            <div style={{ margin: "0 0 15px 0" }}>
              <div style={attributeStyle}>Email</div>
              <TextField
                margin="dense"
                type="text"
                name="name"
                required
                fullWidth
                value={auth?.user.email}
                InputProps={{
                  style: textFieldStyle,
                }}
                style={{ cursor: "not-allowed" }}
                disabled={true}
              />
            </div>
            <div style={{ margin: "0 0 15px 0" }}>
              <div style={attributeStyle}>Password</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  gap: "10px",
                  padding: "7px 0 0 0",
                }}
              >
                <TextField
                  margin="dense"
                  type="password"
                  name="name"
                  required
                  value="password"
                  fullWidth
                  InputProps={{
                    style: textFieldStyle,
                  }}
                  style={{ margin: "0px" }}
                  disabled={true}
                />
                <Box
                  onClick={() => {
                    setOpenUpdatePassword(true);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                    height: "37px",
                    borderRadius: "5px",
                    fontSize: "13px",
                    color: "#0F8FA9",
                    cursor: "pointer",
                    border: "1px solid #0F8FA9",
                  }}
                >
                  Update
                </Box>
              </div>
            </div>
            <div style={{ margin: "0 0 15px 0" }}>
              <div style={attributeStyle}>Phone</div>
              <TextField
                margin="dense"
                type="text"
                name="name"
                required
                fullWidth
                value={phone}
                onChange={(event) => {
                  let inputContact = event.target.value;
                  inputContact = inputContact.replace(/\D/g, "");
                  if (inputContact <= 9999999999) {
                    setPhone(inputContact);
                  }
                }}
                InputProps={{
                  style: textFieldStyle,
                }}
              />
            </div>
            <div style={{ margin: "0 0 15px 0" }}>
              <div style={attributeStyle}>Company</div>
              <TextField
                margin="dense"
                type="text"
                name="name"
                required
                fullWidth
                value={auth?.user.company}
                InputProps={{
                  style: textFieldStyle,
                }}
                disabled={true}
              />
            </div>
            <div style={{ margin: "0 0 15px 0" }}>
              <div style={attributeStyle}>Permissions</div>
              <div
                style={{
                  minHeight: "70px",
                  maxheight: "300px",
                  maxWidth: textFieldStyle.width,
                  overflowX: "auto",
                }}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "70px",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <Grid container spacing={0}>
                    {userPermissions.length > 0 ? (
                      userPermissions.map((permission, index) => (
                        <PermissionItem permission={permission} key={index} />
                      ))
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          overflow: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000",
                          fontSize: "14px",
                          fontWeight: "600",
                          textAlign: "left",
                        }}
                      >
                        No permissions.
                      </div>
                    )}
                  </Grid>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                height: "100px",
              }}
            >
              <Button
                type="submit"
                onClick={handleSubmitButton}
                sx={{
                  padding: "7px 50px",
                  borderRadius: "5px",
                  color: "#fff",
                  fontSize: "15px",
                  backgroundColor: "#0F8FA9",
                  "&:hover": {
                    backgroundColor: "#075D73",
                  },
                }}
              >
                Save
              </Button>
              <Button
                type="error"
                variant="outlined"
                color="error"
                sx={{
                  padding: "7px 40px",
                  borderRadius: "5px",
                  fontSize: "15px",
                }}
                onClick={handleCancelButton}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default ProfilePage;
