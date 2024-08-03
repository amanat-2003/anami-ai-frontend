import axios from "axios";
import toast from "react-hot-toast";
import React, { useRef } from "react";
import Draggable from "react-draggable";

import {
  Slide,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

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

const DeleteDepartmentDialog = (props) => {
  const {
    admin,
    departments,
    handleLogout,
    setDepartments,
    selectedDepartment,
    setSelectedDepartment,
    isDepartmentDeleteDialogOpen,
    handleCloseDepartmentDeleteDialog,
  } = props;

  const handleDeleteDepartment = async () => {
    try {
      toast.promise(
        axios.delete(
          `${process.env.REACT_APP_API}/api/v1/department/delete-department?departmentId=${selectedDepartment._id}&adminId=${admin._id}`
        ),
        {
          loading: "Deleting Department... Please Wait!",
          success: (response) => {
            if (response.status === 200) {
              const updatedDepartments = departments.filter(
                (department) => department._id !== selectedDepartment._id
              );
              setDepartments(updatedDepartments);
              setSelectedDepartment("");
              // localStorage.setItem(
              //   "allDepartments",
              //   JSON.stringify(updatedDepartments)
              // );
              localStorage.removeItem("selectedDepartment");
              // const storedAssets = localStorage.getItem("allAssets");
              // const parsedAssets = JSON.parse(storedAssets);
              // const updatedAssets = parsedAssets.filter(
              //   (asset) => asset.department !== selectedDepartment._id
              // );
              // localStorage.setItem("allAssets", JSON.stringify(updatedAssets));
              localStorage.removeItem("selectedAsset");
              localStorage.removeItem("allNotes");
              localStorage.removeItem("allDocuments");
              localStorage.removeItem("allVideos");
              localStorage.removeItem("allImages");
              localStorage.removeItem("allChats");
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

  return (
    <Dialog
      open={isDepartmentDeleteDialogOpen}
      onClose={handleCloseDepartmentDeleteDialog}
      aria-labelledby="alert-dialog"
      PaperComponent={PaperComponent}
      aria-describedby="alert-dialog-description"
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
        Delete {selectedDepartment.departmentName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to delete department ${
            selectedDepartment ? selectedDepartment.departmentName : ""
          } and all of its associated assets, documents, notes and chats?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDepartmentDeleteDialog} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleDeleteDepartment();
            handleCloseDepartmentDeleteDialog();
          }}
          color="error"
          variant="outlined"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDepartmentDialog;
