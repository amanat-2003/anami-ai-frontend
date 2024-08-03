import axios from "axios";
import toast from "react-hot-toast";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Drawer,
  Button,
  styled,
  // Accordion,
  IconButton,
  Typography,
  // AccordionDetails,
  // AccordionSummary,
  Tooltip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderColor: "transparent",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// const MaintenanceAccordion = (props) => {
//   const {
//     auth,
//     asset,
//     openComponent,
//     setNotificationContent,
//     setNotificationReturnMessage,
//     handleOpenAddAssetMaintenanceForm,
//     handleOpenPermissionConfirmDialog,
//   } = props;
//   const [expanded, setExpanded] = useState(false);

//   const handleAccordionChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   const renderValue = (value) => {
//     return value || "-";
//   };

//   return (
//     <div>
//       <Accordion
//         expanded={expanded === "panel1"}
//         onChange={handleAccordionChange("panel1")}
//         sx={{
//           backgroundColor: "transparent",
//           boxShadow: "none",
//           "&:before": { display: "none" },
//           borderTop: "1px solid #e0e0e0",
//           padding: "0px",
//         }}
//       >
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1bh-content"
//           id="panel1bh-header"
//           sx={{
//             backgroundColor: "transparent",
//             margin: 0,
//             padding: "0 0 0 5px",
//           }}
//         >
//           <Typography
//             sx={{ flexShrink: 2, fontSize: "14px", fontWeight: "450" }}
//           >
//             Last Maintenance
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails sx={{ padding: "5px", margin: 0 }}>
//           <Typography>{renderValue(asset?.maintenanceJob)}</Typography>
//         </AccordionDetails>
//       </Accordion>

//       <Accordion
//         expanded={expanded === "panel2"}
//         onChange={handleAccordionChange("panel2")}
//         sx={{
//           backgroundColor: "transparent",
//           boxShadow: "none",
//           "&:before": { display: "none" },
//           borderTop: "1px solid #e0e0e0",
//         }}
//       >
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel2bh-content"
//           id="panel2bh-header"
//           sx={{
//             backgroundColor: "transparent",
//             margin: 0,
//             padding: "0 0 0 5px",
//           }}
//         >
//           <Typography
//             sx={{ flexShrink: 2, fontSize: "14px", fontWeight: "450" }}
//           >
//             Upcoming Maintenance Date
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails sx={{ padding: "5px" }}>
//           <Typography>
//             {renderValue(
//               asset?.upcomingMaintenanceDate
//                 ? asset?.upcomingMaintenanceDate.substring(0, 10)
//                 : null
//             )}
//           </Typography>
//         </AccordionDetails>
//       </Accordion>

//       <Accordion
//         expanded={expanded === "panel3"}
//         onChange={handleAccordionChange("panel3")}
//         sx={{
//           backgroundColor: "transparent",
//           boxShadow: "none",
//           "&:before": { display: "none" },
//           borderBlock: "1px solid #e0e0e0",
//         }}
//       >
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel3bh-content"
//           id="panel3bh-header"
//           sx={{
//             backgroundColor: "transparent",
//             margin: 0,
//             padding: "0 0 0 5px",
//           }}
//         >
//           <Typography
//             sx={{ flexShrink: 2, fontSize: "14px", fontWeight: "450" }}
//           >
//             Alert
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails sx={{ padding: "5px" }}>
//           <Typography>{renderValue(asset?.maintenanceAlert)}</Typography>
//         </AccordionDetails>
//       </Accordion>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "25px",
//         }}
//       >
//         <div
//           style={{
//             cursor: "pointer",
//             fontWeight: "500",
//             fontSize: "14px",
//             color: "#0a97a4",
//             display: "flex",
//             justifyContent: "center",
//             alignContent: "center",
//             marginBottom: "32px",
//             marginTop: "10px",
//           }}
//           onClick={() => {
//             if (
//               auth?.user?.permissions.includes("Update Asset") ||
//               auth?.user?.permissions.includes("All")
//             ) {
//               handleOpenAddAssetMaintenanceForm(asset);
//             } else {
//               const notificationObject = {
//                 recipientId: auth?.user?.admin,
//                 senderId: auth?.user?._id,
//                 type: "Asset Updation Permission",
//                 content: `${auth?.user?.username} seeking permission for updating the asset ${asset.name}.`,
//                 senderName: auth?.user?.username,
//               };
//               setNotificationContent(notificationObject);
//               setNotificationReturnMessage(
//                 "Admin notified to update required permission"
//               );
//               handleOpenPermissionConfirmDialog();
//             }
//           }}
//         >
//           Add Record
//         </div>
//         <div
//           style={{
//             cursor: "pointer",
//             fontWeight: "500",
//             fontSize: "14px",
//             color: "#0a97a4",
//             display: "flex",
//             justifyContent: "center",
//             alignContent: "center",
//             marginBottom: "32px",
//             marginTop: "10px",
//           }}
//           onClick={() => {
//             openComponent("MaintenanceRecords");
//           }}
//         >
//           View History
//         </div>
//       </div>
//     </div>
//   );
// };

const Resources = ({ data, activeComponent }) => {
  return (
    <Grid
      container
      rowGap={1.5}
      columnSpacing={0}
      style={{ padding: "0 0 0 5px" }}
    >
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              backgroundColor: "transparent",
              padding: "0",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "450",
                cursor: "pointer",
              }}
              onClick={() => {
                if (
                  activeComponent === "AddNote" ||
                  activeComponent === "UpdateNote"
                ) {
                  if (item.label !== "Notes") {
                    item.function();
                  }
                } else {
                  item.function();
                }
              }}
            >
              {item.label}
            </Typography>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};

const MachineDetailDrawer = (props) => {
  const {
    auth,
    asset,
    drawerWidth,
    handleLogout,
    openComponent,
    isOpenRightDrawer,
    setIsViewDetailsPopupOpen,
    handleOpenAssetDeleteDialog,
    // handleOpenAddAssetMaintenanceForm,
    activeComponent,
  } = props;

  const displayDocs = () => {
    openComponent("Documents");
  };

  const displayNotes = () => {
    openComponent("Notes");
  };

  const displayImages = () => {
    openComponent("Images");
  };

  const displayVideos = () => {
    openComponent("Videos");
  };

  // const displayCustomNotes = () => {
  //   openComponent("CustomNotes");
  // };

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

  return (
    <>
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

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 1,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: `calc(100vh)`,
            boxSizing: "border-box",
            backgroundImage:
              "linear-gradient(193deg, #fef2e9, #faeded, #f6ebf1, #f0ecf5, #e9f1f8, #e7f5f6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderBottom: "solid 1px #53267E22",
          },
        }}
        variant="persistent"
        anchor="right"
        open={isOpenRightDrawer}
      >
        <div style={{ height: "calc(100% - 80px)" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "5px",
              height: "100%",
              width: `calc(100%)`,
            }}
          >
            {asset && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  height: "100%",
                  width: "calc(100%)",
                  padding: "0 15px",
                }}
              >
                <Tooltip title={"Asset Info"} placement="left" arrow>
                  <IconButton
                    onClick={() => {
                      setIsViewDetailsPopupOpen(true);
                    }}
                    style={{
                      padding: "5px",
                      margin: "0 0 0 5px",
                      position: "absolute",
                      top: 5,
                      right: 5,
                    }}
                  >
                    <InfoOutlinedIcon style={{ fontSize: "17px" }} />
                  </IconButton>
                </Tooltip>
                <DrawerHeader
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "35px 0px 15px 0px",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={asset.name}
                  >
                    {asset.name}
                  </Typography>
                </DrawerHeader>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    marginTop: "10px",
                    overflow: "auto",
                  }}
                >
                  {/* <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "20px",
                        textAlign: "center",
                      }}
                    >
                      Maintenance
                    </Typography>
                    <MaintenanceAccordion
                      auth={auth}
                      asset={asset}
                      openComponent={openComponent}
                      handleOpenAddAssetMaintenanceForm={
                        handleOpenAddAssetMaintenanceForm
                      }
                      setNotificationContent={setNotificationContent}
                      setNotificationReturnMessage={
                        setNotificationReturnMessage
                      }
                      handleOpenPermissionConfirmDialog={
                        handleOpenPermissionConfirmDialog
                      }
                    />
                  </Box> */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "20px",
                        textAlign: "center",
                      }}
                    >
                      Resources
                    </Typography>
                    <Resources
                      data={[
                        {
                          label: "Documents",
                          function: displayDocs,
                        },
                        { label: "Notes", function: displayNotes },
                        { label: "Photos", function: displayImages },
                        { label: "Videos", function: displayVideos },
                        // { label: "Notes-v2", function: displayCustomNotes },
                      ]}
                      activeComponent={activeComponent}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </div>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button
            color="error"
            disabled={
              !(
                auth?.user?.permissions.includes("Delete Asset") ||
                auth?.user?.permissions.includes("All")
              )
            }
            onClick={() => {
              if (
                auth?.user?.permissions.includes("Delete Asset") ||
                auth?.user?.permissions.includes("All")
              ) {
                handleOpenAssetDeleteDialog(asset);
              } else {
                const notificationObject = {
                  recipientId: auth?.user?.admin,
                  senderId: auth?.user?._id,
                  type: "Asset Deletion Permission",
                  content: `${auth?.user?.username} seeking permission for deleting the asset ${asset.name}.`,
                  senderName: auth?.user?.username,
                };
                setNotificationContent(notificationObject);
                setNotificationReturnMessage(
                  "Admin notified to update required permission"
                );
                handleOpenPermissionConfirmDialog();
              }
            }}
          >
            Delete Asset
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default MachineDetailDrawer;
