import "./Assets.css";

import axios from "axios";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.js";
import React, { useEffect, useRef, useState } from "react";

import {
  Fab,
  Box,
  Slide,
  Paper,
  Button,
  Dialog,
  Tooltip,
  Checkbox,
  TextField,
  Typography,
  IconButton,
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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import CardView from "../../homePage/assets/CardView.js";
import TabularView from "../../homePage/assets/TabularView.js";
import AddAssetForm from "../../homePage/assets/AddAssetForm.js";

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

const Assets = (props) => {
  const {
    assets,
    allUsers,
    setAssets,
    departments,
    openComponent,
    viewDepartment,
  } = props;

  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [selectedAsset, setSelectedAsset] = useState();
  const [isShareDialogOpen, setOpenShareDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(viewDepartment);
  const [openCreateAssetForm, setOpenCreateAssetForm] = useState(false);
  const [notificationContent, setNotificationContent] = useState({});
  const [notificationReturnMessage, setNotificationReturnMessage] =
    useState("");
  const [isPermissionConfirmDialogOpen, setPermissionConfirmDialogOpen] =
    useState(false);

  const handleOpenPermissionConfirmDialog = () => {
    setPermissionConfirmDialogOpen(true);
  };

  const handleClosePermissionConfirmDialog = () => {
    setPermissionConfirmDialogOpen(false);
    setNotificationContent({});
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
    }
  }, [auth, navigate]);

  const handleSearch = (e) => {
    const search = e.target.value?.toLowerCase();
    setSearchText(search);
  };

  const selectedDepartmentAssets = assets.filter(
    (asset) => asset.department === viewDepartment._id
  );
  // : assets;

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
    } = asset;

    // Convert values to lowercase for case-insensitive comparison
    const nameLowerCase = name?.toLowerCase();
    const modelLowerCase = model?.toLowerCase();
    const locationLowerCase = location?.toLowerCase();
    const operatorNameLowerCase = operatorName?.toLowerCase();
    const departmentNameLowerCase = departmentName?.toLowerCase();
    const maintenanceAlertLowerCase = maintenanceAlert?.toLowerCase();

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
      operatorNameLowerCase.includes(searchText)
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
    localStorage.setItem(
      "selectedDepartment",
      JSON.stringify(viewDepartment || {})
    );
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
      toast.error("Asset sharing not permitted \nKindly contact admin.");
      const notificationObject = {
        recipientId: auth?.user?.admin,
        senderId: auth?.user?._id,
        type: "Asset sharing",
        content: `${auth?.user?.username} wants to share the asset '${asset.name}'.`,
        senderName: auth?.user?.username,
        assetId: asset._id,
        assetName: asset.name,
      };
      const returnMessage = "Admin notified to update required permission";
      setNotificationContent(notificationObject);
      setNotificationReturnMessage(returnMessage);
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

  document.title = "ZippiAi - Assets";

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* send notification dialog */}
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
          <Button onClick={handleClosePermissionConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendNotification} color="error" autoFocus>
            yes
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
            getOptionLabel={(option) => option.username}
            onChange={(event, value) => handleOptionSelect(value)}
            value={selectedusers}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.username}
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

      <div
        style={{
          backgroundColor: "#FFF",
          paddingBlock: "2rem",
          height: `calc(100vh)`,
          position: "relative",
        }}
        className="assets-main-container"
      >
        <div>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"space-between"}
            style={{
              marginBottom: "10px",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "0px", left: "-45px" }}>
              <IconButton
                onClick={() => {
                  localStorage.removeItem("selectedDepartment");
                  openComponent("Departments");
                }}
              >
                <CloseOutlinedIcon sx={{ color: "#000" }} />
              </IconButton>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                margin: "5px 5px 5px 20px",
                gap: "5px",
                width: "70%",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  width: `calc(100%)`,
                }}
              >
                {viewDepartment.departmentName}
              </div>
            </div>

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
                  backgroundColor: viewMode === "card" ? "#0F8FA966" : "#FFF",
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
                  backgroundColor: viewMode === "table" ? "#0F8FA966" : "#FFF",
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
                width: `calc(100%)`,
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
          </div>

          <div style={{ position: "relative" }}>
            {/* Assets */}
            {filteredAssets[0] != null ? (
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
                    content: `${auth?.user?.username} seeking permission for creating a new asset.`,
                    senderName: auth?.user?.username,
                  };
                  const returnMessage =
                    "Admin notified to update required permission";
                  setNotificationContent(notificationObject);
                  setNotificationReturnMessage(returnMessage);
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
  );
};

export default Assets;
