import axios from "axios";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.js";
import {
  Box,
  Button,
  Dialog,
  TextField,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotificationDetailPanel = (props) => {
  const { handleLogout, selectedNotification, setSingleNotificationSelected } =
    props;

  const [auth] = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);

  const handleCloseCommentDialog = () => {
    setCommentDialogOpen(false);
  };

  const openInNewTab = (url) => {
    window.open(`/admin/view-file/${url}`, "_blank");
  };

  const approveDocument = async (docId, forProcessing) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/admin/approval/approve-doc`,
        {
          documentId: docId,
          forProcessing: forProcessing,
        }
      );

      if (response.status === 200) {
        setSingleNotificationSelected(false);
        const fileId =
          selectedNotification?.documentId || selectedNotification?.noteId;
        const fileName =
          selectedNotification?.documentName || selectedNotification?.noteName;
        const notificationContent = `${fileName} is approved by admin`;

        await axios.post(
          `${process.env.REACT_APP_API}/api/v1/notification/new-notification`,
          {
            recipientId: selectedNotification?.senderId,
            senderId: selectedNotification?.recipientId,
            type: "Approved",
            content: notificationContent,
            senderName: auth?.user?.username,
            documentId: fileId,
            noteId: fileId,
            documentName: fileName,
            noteName: fileName,
            comment: comment,
          }
        );
        setComment("");
        toast.success(response.data.message);
        setSingleNotificationSelected(false);
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

  const handleDeny = async () => {
    try {
      const fileId =
        selectedNotification?.documentId || selectedNotification?.noteId;
      const fileName =
        selectedNotification?.documentName || selectedNotification?.noteName;
      const notificationContent = `${fileName} is not approved by admin`;

      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/notification/new-notification`,
        {
          recipientId: selectedNotification?.senderId,
          senderId: selectedNotification?.recipientId,
          type: "Not Approved",
          content: notificationContent,
          senderName: auth?.user?.username,
          documentId: fileId,
          noteId: fileId,
          documentName: fileName,
          noteName: fileName,
          comment: comment,
        }
      );
      setSingleNotificationSelected(false);

      toast.success("Informed user");
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

  return (
    <>
      {/* comment dialog on deny */}
      <Dialog open={isCommentDialogOpen} onClose={handleCloseCommentDialog}>
        <DialogTitle>Any Comment</DialogTitle>
        <DialogContent>
          <TextField
            label="Add a Comment"
            multiline
            autoFocus
            // rows={4}
            fullWidth
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
            margin="normal"
            style={{ minWidth: "350px" }}
          />
        </DialogContent>
        <Button
          onClick={() => {
            handleCloseCommentDialog();
            handleDeny();
            navigate(
              auth?.user?.role === 1
                ? "/admin/notifications"
                : "/user/notifications"
            );
          }}
          color="primary"
        >
          Send
        </Button>
      </Dialog>
      <Box
        style={{
          backgroundColor: "#FFF",
          height: `calc(100%)`,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "50px",
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
            Notifications
          </div>
        </Box>

        <div
          style={{
            marginTop: "10px",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fafafa",
            height: "calc(100% - 100px)",
            margin: "35px 0 0 0",
          }}
        >
          <Box
            maxheight="70px"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "10px 20px 10px 10px",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              onClick={() => {
                setSingleNotificationSelected(false);
              }}
            >
              <ArrowBackIcon style={{ fontSize: "25px" }} />
            </IconButton>
            <div
              style={{
                fontSize: "15px",
                textAlign: "left",
                color: "#0f8fa9",
              }}
            >
              {new Date(selectedNotification?.createdAt).toLocaleTimeString(
                "en-US",
                {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </div>
          </Box>
          <div
            style={{
              display: "flex",
              padding: "8px 0px 0px 57px",
              height: "calc(100vh - 170px)",
              flexDirection: "column",
              gap: "13px",
            }}
          >
            <div
              style={{
                margin: "0 0 0 0",
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: "600",
                textAlign: "left",
                color: "#000",
                overflowWrap: "break-word",
              }}
            >
              Sender : {selectedNotification?.senderName}
            </div>
            <div
              style={{
                margin: "0 0 0 0",
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: "600",
                textAlign: "left",
                color: "#000",
                overflowWrap: "break-word",
              }}
            >
              Subject: {selectedNotification?.type}
            </div>
            <div
              style={{
                margin: "10px 0 0 0",
                fontFamily: "Inter",
                fontSize: "16px",
                textAlign: "left",
                color: "#000",
                whiteSpace: "pre-wrap",
                overflowY: "auto",
              }}
            >
              {`${selectedNotification?.content}${"\n"}${
                selectedNotification?.comment?.length > 0
                  ? `Reason: ${selectedNotification?.comment}`
                  : ""
              }`}
            </div>
          </div>
          {auth.user.role === 1 ? (
            <>
              {selectedNotification?.documentId ||
              selectedNotification?.noteId ? (
                <>
                  <div
                    maxheight="70px"
                    style={{
                      display: "flex",
                      cursor: "pointer",
                      margin: "10px 60px 2px 60px",
                      padding: "13px 13px 13px 13px",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => {
                        openInNewTab(
                          selectedNotification?.documentId ||
                            selectedNotification?.noteId
                        );
                      }}
                      sx={{
                        color: "#0F8FA9",
                        "&:hover": {
                          backgroundColor: "#E7F5F6",
                        },
                      }}
                    >
                      View Document
                    </Button>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="outlined"
                        size="medium"
                        color="error"
                        onClick={() => {
                          setCommentDialogOpen(true);
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#FF000010",
                          },
                        }}
                      >
                        Deny
                      </Button>
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={() => {
                          approveDocument(
                            selectedNotification?.documentId ||
                              selectedNotification?.noteId,
                            selectedNotification?.type.includes("Processing")
                          );
                          navigate(
                            auth?.user?.role === 1
                              ? "/admin/notifications"
                              : "/user/notifications"
                          );
                        }}
                        sx={{
                          backgroundColor: "#0F8FA9",
                          "&:hover": {
                            backgroundColor: "#075D73",
                          },
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </Box>
    </>
  );
};

export default NotificationDetailPanel;
