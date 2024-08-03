import "./HomePage.css";

import axios from "axios";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import { useAuth } from "../context/auth.js";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import {
  Fab,
  Box,
  Slide,
  Paper,
  Select,
  Button,
  Dialog,
  Tooltip,
  Skeleton,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
  InputAdornment,
  DialogContentText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TocRoundedIcon from "@mui/icons-material/TocRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
// import { useSocketService } from "../context/socketService.js";

import LeftSideDrawer from "../components/LeftSideDrawer.js";
import CardView from "../components/homePage/assets/CardView.js";
import TabularView from "../components/homePage/assets/TabularView.js";
import AddAssetForm from "../components/homePage/assets/AddAssetForm.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function PaperComponent(props) {
  const paperRef = useRef(null);

  return (
    <Draggable
      handle={".draggable-dialog"}
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper {...props} ref={paperRef} />
    </Draggable>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [assets, setAssets] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [departments, setDepartments] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState();
  const [isMainDrawerOpen, setIsMainDrawerOpen] = useState(false);
  const [isShareDialogOpen, setOpenShareDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [openCreateAssetForm, setOpenCreateAssetForm] = useState(false);
  const [viewDepartment, setViewDepartment] = useState({
    _id: "",
    departmentName: "All",
  });
  const [assetLoading, setAssetLoading] = useState(false);
  // const [isLocalStorageUpdated, setLocalStorageUpdation] = useSocketService();
  const [isPermissionConfirmDialogOpen, setPermissionConfirmDialogOpen] =
    useState(false);
  const [notificationContent, setNotificationContent] = useState({});
  const [notificationReturnMessage, setNotificationReturnMessage] =
    useState("");

  const handleOpenPermissionConfirmDialog = () => {
    setPermissionConfirmDialogOpen(true);
  };

  const handleClosePermissionConfirmDialog = () => {
    setPermissionConfirmDialogOpen(false);
    setNotificationContent({});
  };
  const handleCloseMainDrawer = () => {
    setIsMainDrawerOpen(false);
  };

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
      // const storedDepartments = localStorage.getItem("allDepartments");
      // if (storedDepartments) {
      //   setDepartments(JSON.parse(storedDepartments));
      // } else {
      // }
      getAllDepartments();

      // const storedAssets = localStorage.getItem("allAssets");
      // if (storedAssets) {
      //   setAssets(JSON.parse(storedAssets));
      // } else {
      // }
      getAllAssets();

      // const storedUsers = localStorage.getItem("allUsers");
      // if (storedUsers) {
      //   const sortedUsers = JSON.parse(storedUsers)
      //     ?.filter((user) => user._id !== auth?.user._id)
      //     .sort((a, b) => a.username.localeCompare(b.username))
      //     .map((user, index) => ({
      //       ...user,
      //       id: index + 1,
      //     }));
      //   setAllUsers(sortedUsers);
      // } else {
      // }
      getAllUsers();
      localStorage.removeItem("chatMessages");
    }
    // setLocalStorageUpdation(false);
    // eslint-disable-next-line
  }, [auth]);

  const handleSearch = (e) => {
    const search = e.target.value?.toLowerCase();
    setSearchText(search);
  };

  const selectedDepartmentAssets = viewDepartment._id
    ? assets.filter((asset) => asset.department === viewDepartment._id)
    : assets;

  const filteredAssets = selectedDepartmentAssets.filter((asset) => {
    // Extracting values of specific properties for comparison
    const {
      name,
      year,
      model,
      location,
      operatorName,
      departmentName,
      maintenanceJob,
      maintenanceAlert,
      upcomingMaintenanceDate,
      media,
    } = asset;

    // Convert values to lowercase for case-insensitive comparison
    const nameLowerCase = name?.toLowerCase();
    const modelLowerCase = model?.toLowerCase();
    const locationLowerCase = location?.toLowerCase();
    const operatorNameLowerCase = operatorName?.toLowerCase();
    const departmentNameLowerCase = departmentName?.toLowerCase();
    const maintenanceAlertLowerCase = maintenanceAlert?.toLowerCase();
    const documentNames = media.documentNameList || [];
    const noteNames = media.noteNameList || [];
    const imageNames = media.imageNameList || [];
    const videoNames = media.videoNameList || [];

    // Check if any property value includes the search text
    return (
      departmentNameLowerCase.includes(searchText) ||
      nameLowerCase.includes(searchText) ||
      modelLowerCase.includes(searchText) ||
      year.toString().includes(searchText) ||
      (upcomingMaintenanceDate &&
        upcomingMaintenanceDate.toString().includes(searchText)) ||
      (maintenanceJob && maintenanceJob?.toLowerCase().includes(searchText)) ||
      maintenanceAlertLowerCase.includes(searchText) ||
      locationLowerCase.includes(searchText) ||
      operatorNameLowerCase.includes(searchText) ||
      documentNames.some((documentName) =>
        documentName.toLowerCase().includes(searchText)
      ) ||
      noteNames.some((noteName) =>
        noteName.toLowerCase().includes(searchText)
      ) ||
      imageNames.some((imageName) =>
        imageName.toLowerCase().includes(searchText)
      ) ||
      videoNames.some((videoName) =>
        videoName.toLowerCase().includes(searchText)
      )
    );
  });

  const filteredUsers = allUsers.filter((user) =>
    selectedAsset?.allowedUsers?.includes(user._id)
  );

  const [selectedusers, setSelectedusers] = useState(
    allUsers.filter(
      (user) =>
        selectedAsset?.allowedUsers?.includes(user._id) &&
        user._id !== auth?.user._id
    )
  );

  useEffect(() => {
    setSelectedusers(filteredUsers);
    // eslint-disable-next-line
  }, [selectedAsset]);

  const handleOpenShareDialog = (asset) => {
    if (
      auth?.user?.permissions.includes("Share Asset") ||
      auth?.user?.permissions.includes("All")
    ) {
      setOpenShareDialog(true);
      setSelectedAsset(asset);
    } else {
      const notificationObject = {
        recipientId: auth?.user?.admin,
        senderId: auth?.user?._id,
        type: "Asset sharing",
        senderName: auth?.user?.username,
        assetId: asset._id,
        assetName: asset.name,
        content: `${auth?.user?.username} wants to share the asset '${asset.name}'.`,
      };

      setNotificationContent(notificationObject);
      setNotificationReturnMessage(
        "Admin notified to update required permission"
      );
      handleOpenPermissionConfirmDialog();
    }
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
    setSelectedAsset();
  };

  const handleOptionSelect = (options) => {
    const fixedOption = allUsers.find((user) => user._id === auth?.user?.admin);
    const filteredOptions = options?.filter(
      (user) => user._id !== auth?.user?.admin
    );
    const selectedOptions =
      auth?.user?._id === auth?.user?.admin
        ? filteredOptions
        : [fixedOption, ...filteredOptions];

    setSelectedusers(selectedOptions);
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/user/all-users`,
        {
          params: { adminId: auth?.user?.admin },
        }
      );
      if (response.status === 200) {
        const sortedUsers = response.data?.users
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user, index) => ({
            id: index + 1,
            ...user,
          }));
        const filteredUsers = sortedUsers
          ?.filter((user) => user._id !== auth?.user._id)
          .map((user, index) => ({
            id: index + 1,
            ...user,
          }));
        setAllUsers(filteredUsers);
        // localStorage.setItem("allUsers", JSON.stringify(sortedUsers || {}));
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
      }
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

  // Get all departments
  const getAllDepartments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/department/all-departments`,
        {
          params: { userId: auth?.user?._id },
        }
      );
      if (response.data?.success) {
        const sortedDepartments = response.data?.departments?.sort((a, b) =>
          a.departmentName.localeCompare(b.departmentName)
        );
        setDepartments(sortedDepartments);
        // localStorage.setItem(
        //   "allDepartments",
        //   JSON.stringify(sortedDepartments || {})
        // );
      } else {
        toast.error(response.data.message);
      }
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

  // Get all assets
  const getAllAssets = async () => {
    try {
      setAssetLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/asset/all-assets`,
        {
          params: { userId: auth?.user?._id },
        }
      );
      if (response.status === 200) {
        const sortedAssets = response.data?.assets?.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setAssets(sortedAssets);
        // localStorage.setItem("allAssets", JSON.stringify(sortedAssets || {}));
      } else {
        toast.error(response.data.message);
      }
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
    } finally {
      setAssetLoading(false);
    }
  };

  const handleShareAsset = async () => {
    try {
      const selectedUserIds = selectedusers.map((option) => option._id);
      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/asset/share-asset/${selectedAsset._id}`,
          {
            userId: auth?.user?._id,
            assetId: selectedAsset._id,
            updatedUserIds: selectedUserIds,
          }
        ),
        {
          loading: "Sharing Asset...",
          success: (response) => {
            if (response.status === 200) {
              const updatedAsset = response.data.asset;
              const updatedAssets = assets.map((asset) => {
                if (asset._id === updatedAsset._id) {
                  return updatedAsset;
                }
                return asset;
              });

              setAssets(updatedAssets);
              // localStorage.setItem(
              //   "allAssets",
              //   JSON.stringify(updatedAssets || {})
              // );
              setSelectedAsset();
              handleCloseShareDialog();
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            setSelectedAsset();
            handleCloseShareDialog();
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

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const handleDepartmentChange = async (event) => {
    const selectedDepartmentId = event.target.value;
    const selected = departments.find(
      (department) => department._id === selectedDepartmentId
    );
    setSelectedDepartment(selected || {});
  };

  const handleViewDepartmentChange = async (event) => {
    const selectedDepartmentId = event.target.value;
    if (selectedDepartmentId === "") {
      setViewDepartment({ _id: "", departmentName: "All" });
    } else {
      const selected = departments.find(
        (department) => department._id === selectedDepartmentId
      );
      setViewDepartment(selected || "");
    }
  };

  const handleOpenCreateAssetForm = () => {
    setOpenCreateAssetForm(true);
  };

  const handleCloseCreateAssetForm = () => {
    setSelectedDepartment("");
    setOpenCreateAssetForm(false);
  };

  const handleOpenAssetChat = (asset) => {
    try {
      if (asset !== null && auth.user) {
        if (selectedAsset?._id !== asset._id) {
          localStorage.removeItem("allChats");
          localStorage.removeItem("allNotes");
          localStorage.removeItem("allImages");
          localStorage.removeItem("allVideos");
          localStorage.removeItem("allDocuments");
          localStorage.removeItem("selectedChat");
          localStorage.removeItem("chatMessages");
          // localStorage.setItem("selectedAsset", JSON.stringify(asset));
        }
        setSelectedAsset(asset);
        if (auth.user.role === 1) {
          navigate(`/admin/chat/${asset._id}`);
        } else {
          navigate(`/user/chat/${asset._id}`);
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendNotification = () => {
    toast.promise(
      axios.post(
        `${process.env.REACT_APP_API}/api/v1/notification/new-notification`,
        notificationContent
      ),
      {
        success: (response) => {
          setNotificationContent({});
          setNotificationReturnMessage("");
          handleClosePermissionConfirmDialog();
          return notificationReturnMessage;
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
  };

  document.title = "ZippiAi - Assets";

  return (
    <>
      <Box sx={{ display: "flex", margin: "0" }}>
        {/* Request Access Dialog */}
        <Dialog
          open={isPermissionConfirmDialogOpen}
          onClose={handleClosePermissionConfirmDialog}
        >
          <DialogContent>
            <DialogContentText>
              You are not authorized to perform the action. Do you want to ask
              permission from the admin.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePermissionConfirmDialog} color="error">
              Cancel
            </Button>
            <Button onClick={handleSendNotification} color="primary" autoFocus>
              Request Access
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share asset dialog */}
        <Dialog
          open={isShareDialogOpen}
          onClose={handleCloseShareDialog}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog"
          TransitionComponent={Transition}
          TransitionProps={{
            timeout: {
              enter: 500,
              exit: 200,
            },
          }}
        >
          <DialogTitle
            style={{ textAlign: "center", cursor: "move" }}
            className="draggable-dialog"
          >
            Share Asset
          </DialogTitle>
          <DialogContent>
            <Autocomplete
              multiple
              options={allUsers}
              disableCloseOnSelect
              getOptionLabel={(option) => option?.username}
              onChange={(event, value) => handleOptionSelect(value)}
              value={selectedusers}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    disabled={option?._id === auth?.user.admin}
                  />
                  {option?.username}
                </li>
              )}
              style={{
                width: 500,
                marginTop: "20px",
              }}
              renderInput={(params) => <TextField {...params} label="Users" />}
            />
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button color="error" onClick={handleCloseShareDialog}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleShareAsset}>
              Update Users
            </Button>
          </DialogActions>
        </Dialog>

        <LeftSideDrawer
          pageKey={"Assets"}
          handleLogout={handleLogout}
          isMainDrawerOpen={isMainDrawerOpen}
          setIsMainDrawerOpen={setIsMainDrawerOpen}
        />

        <Box
          sx={{
            width: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              paddingBlock: "2rem",
              height: `calc(100vh)`,
              position: "relative",
            }}
            className="homepage-main-container"
          >
            {isMainDrawerOpen && (
              <Tooltip
                title="Close Navbar"
                aria-label="Close Navbar"
                placement="right"
                arrow
              >
                <IconButton
                  onClick={handleCloseMainDrawer}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    borderRadius: "0px",
                    padding: "10px 0px",
                    background: "transparent",
                    zIndex: "99",
                  }}
                  sx={{
                    "&:hover": {
                      color: "#000",
                    },
                  }}
                >
                  <ChevronLeftIcon style={{ fontSize: "25px" }} />
                </IconButton>
              </Tooltip>
            )}
            <div style={{ width: "100%", height: "100%" }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent={"space-between"}
                style={{
                  marginBottom: "10px",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    height: "40px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "Inter",
                      fontSize: "24px",
                      textalign: "left",
                      color: "#000",
                    }}
                  >
                    Assets
                  </div>
                </Box>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    border: "1px solid #EEE",
                    borderRadius: "50px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        viewMode === "card" ? "#0F8FA966" : "#FFF",
                      borderRadius: "50px 0px 0px 50px",
                      width: "30px",
                      height: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => toggleViewMode("card")}
                  >
                    <Tooltip
                      title="Card View"
                      aria-label="Card View"
                      arrow
                      placement="bottom"
                    >
                      <GridViewOutlinedIcon
                        style={{
                          fontSize: "17px",
                          marginLeft: "5px",
                        }}
                      />
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      backgroundColor:
                        viewMode === "table" ? "#0F8FA966" : "#FFF",
                      borderRadius: "0px 50px 50px 0px",
                      width: "30px",
                      height: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => toggleViewMode("table")}
                  >
                    <Tooltip
                      title="Tabular View"
                      aria-label="Tabular View"
                      arrow
                      placement="bottom"
                    >
                      <TocRoundedIcon style={{ fontSize: "24px" }} />
                    </Tooltip>
                  </div>
                </div>
              </Box>
              <div style={{ padding: "5px", marginBlock: "20px" }}>
                <TextField
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                  value={searchText}
                  style={{
                    borderRadius: "10px",
                    width: `calc(100% - 150px)`,
                    // marginLeft: "10px",
                  }}
                  onChange={handleSearch}
                  height="50px"
                  InputProps={{
                    style: {
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                    },

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton disabled={true}>
                          <SearchIcon sx={{ color: "#909090" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#FFF",
                    width: "140px",
                  }}
                >
                  <InputLabel>Departments</InputLabel>
                  <Select
                    value={viewDepartment ? viewDepartment._id : ""}
                    onChange={handleViewDepartmentChange}
                    label="Departments"
                  >
                    {departments?.length > 0 && (
                      <MenuItem value="">All</MenuItem>
                    )}
                    {departments?.length > 0 ? (
                      departments?.map((department) => (
                        <MenuItem key={department?._id} value={department?._id}>
                          {department?.departmentName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        <Typography variant="subtitle1">
                          No departments
                        </Typography>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: `calc(100vh - 220px)`,
                }}
              >
                {/* Assets */}
                {assetLoading ? (
                  <Skeleton
                    sx={{ height: "100%", width: "100%" }}
                    animation="wave"
                    variant="rectangular"
                    width={"100%"}
                    height={"100%"}
                  />
                ) : filteredAssets[0] != null ? (
                  <>
                    {/* Render Assets Based on View Mode */}
                    {viewMode === "card" ? (
                      <CardView
                        assets={filteredAssets}
                        handleOpenAssetChat={handleOpenAssetChat}
                        handleOpenShareDialog={handleOpenShareDialog}
                      />
                    ) : (
                      <TabularView
                        assets={filteredAssets}
                        handleOpenAssetChat={handleOpenAssetChat}
                        handleOpenShareDialog={handleOpenShareDialog}
                      />
                    )}
                  </>
                ) : (
                  <Typography
                    variant="h5"
                    minHeight={"50vh"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    textTransform={"uppercase"}
                    sx={{ fontSize: { xs: "h4", sm: "h6" } }}
                  >
                    You have no assets as of now.
                  </Typography>
                )}
              </div>
              <Tooltip
                title="Add New Asset"
                aria-label="Add New Asset"
                arrow
                placement="bottom"
              >
                <Fab
                  color="primary"
                  aria-label="add"
                  size="small"
                  onClick={() => {
                    if (
                      auth?.user?.permissions.includes("Create Asset") ||
                      auth?.user?.permissions.includes("All")
                    ) {
                      handleOpenCreateAssetForm();
                    } else {
                      const notificationObject = {
                        recipientId: auth?.user?.admin,
                        senderId: auth?.user?._id,
                        type: "Asset Creation Permission",
                        senderName: auth?.user?.username,
                        content: `${auth?.user?.username} seeking permission for creating a new asset.`,
                      };

                      setNotificationContent(notificationObject);
                      setNotificationReturnMessage(
                        "Admin notified to update required permission"
                      );
                      handleOpenPermissionConfirmDialog();
                    }
                  }}
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    right: "30px",
                    color: "#FFF",
                    background: "#0f8fa9",
                    fontSize: "45px",
                  }}
                >
                  <AddIcon style={{ fontSize: "35px" }} />
                </Fab>
              </Tooltip>
              {/* Create Asset Form */}
              {openCreateAssetForm && (
                <AddAssetForm
                  assets={assets}
                  setAssets={setAssets}
                  departments={departments}
                  handleLogout={handleLogout}
                  onClose={handleCloseCreateAssetForm}
                  selectedDepartment={selectedDepartment}
                  openCreateAssetForm={openCreateAssetForm}
                  handleDepartmentChange={handleDepartmentChange}
                />
              )}
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
