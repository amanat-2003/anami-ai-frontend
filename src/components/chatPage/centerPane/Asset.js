import axios from "axios";
import toast from "react-hot-toast";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import {
  Slide,
  Paper,
  Table,
  Dialog,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  DialogContent,
  TableContainer,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

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

const cellStyle = {
  textAlign: "center",
  padding: "15px 30px",
  fontSize: "15px",
  color: "#000",
  border: "1px solid #7772",
};

const tableStyle = {
  width: "100%",
  borderRadius: "5px 5px 0 0",
  overflow: "auto",
};

const headerCellStyle = {
  ...cellStyle,
  background: "#0f8fa9",
  border: "1px solid #FFF5",
  fontSize: "16px",
  color: "#FFF",
  fontWeight: "400",
};

const Asset = ({
  auth,
  asset,
  isOpen,
  onClose,
  handleLogout,
  handleOpenUpdateAssetForm,
}) => {
  const renderTableCell = (value) => {
    return value || "-";
  };

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
      <Dialog
        open={isOpen}
        onClose={onClose}
        PaperComponent={PaperComponent}
        PaperProps={{
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
          },
        }}
        aria-labelledby="draggable-dialog"
        TransitionComponent={Transition}
        TransitionProps={{
          timeout: {
            enter: 500,
            exit: 200,
          },
        }}
        fullWidth
      >
        <IconButton
          style={{ position: "absolute", right: "10px", top: "10px" }}
          onClick={() => {
            onClose();
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
        <div
          style={{
            cursor: "move",
            fontSize: "22px",
            fontWeight: "500",
            width: "100%",
            padding: "40px 0 0 0",
          }}
          className="draggable-dialog"
        >
          {asset?.name}
        </div>
        <DialogContent style={{ padding: "20px 50px 5px 50px", width: "100%" }}>
          {asset && (
            <TableContainer>
              <Table style={{ ...tableStyle }}>
                <TableBody>
                  <TableRow>
                    <TableCell style={headerCellStyle}>Department</TableCell>
                    <TableCell style={cellStyle}>
                      {renderTableCell(asset?.departmentName)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={headerCellStyle}>Model</TableCell>
                    <TableCell style={cellStyle}>
                      {renderTableCell(asset?.model)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={headerCellStyle}>Year</TableCell>
                    <TableCell style={cellStyle}>
                      {renderTableCell(asset?.year)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={headerCellStyle}>Location</TableCell>
                    <TableCell style={cellStyle}>
                      {renderTableCell(asset?.location)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={headerCellStyle}>Operator</TableCell>
                    <TableCell style={cellStyle}>
                      {renderTableCell(asset?.operatorName)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={headerCellStyle}>Created At</TableCell>
                    <TableCell style={cellStyle}>
                      {renderTableCell(
                        new Date(asset?.createdAt).toLocaleDateString("en-US", {
                          hour12: false,
                        })
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={headerCellStyle}>Last Modified</TableCell>
                    <TableCell style={cellStyle}>
                      {renderTableCell(
                        new Date(asset?.updatedAt).toLocaleDateString("en-US", {
                          hour12: false,
                        })
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions style={{ height: "70px" }}>
          <Button
            onClick={() => {
              if (
                auth?.user?.permissions.includes("Update Asset") ||
                auth?.user?.permissions.includes("All")
              ) {
                handleOpenUpdateAssetForm(asset);
              } else {
                const notificationObject = {
                  recipientId: auth?.user?.admin,
                  senderId: auth?.user?._id,
                  type: "Asset Updation Permission",
                  content: `${auth?.user?.username} seeking permission for updating the asset ${asset.name}.`,
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Asset;
