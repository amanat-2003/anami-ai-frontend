import axios from "axios";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import React, { useEffect, useRef, useState } from "react";

import {
  Slide,
  Paper,
  Dialog,
  Button,
  Checkbox,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
} from "@mui/material";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

const UpdateDepartmentForm = (props) => {
  const {
    admin,
    onClose,
    allUsers,
    departments,
    handleLogout,
    setDepartments,
    selectedDepartment,
    setSelectedDepartment,
    openUpdateDepartmentForm,
    handleOpenDepartmentDeleteDialog,
  } = props;
  const filteredUsers = allUsers.filter((user) =>
    selectedDepartment?.allowedUsers?.includes(user._id)
  );
  const [selectedusers, setSelectedusers] = useState(filteredUsers);
  const [departmentName, setDepartmentName] = useState(
    selectedDepartment.departmentName
  );
  // State variables to track changes
  const [isDepartmentNameChanged, setIsDepartmentNameChanged] = useState(false);
  const [areUsersChanged, setAreUsersChanged] = useState(false);

  const resetFormFields = () => {
    setDepartmentName("");
    setSelectedDepartment();
    setSelectedusers();
  };

  const handleOptionSelect = (options) => {
    setSelectedusers(options);
  };

  useEffect(() => {
    // Check if department name is changed
    setIsDepartmentNameChanged(
      departmentName !== selectedDepartment.departmentName
    );
  }, [departmentName, selectedDepartment.departmentName]);

  useEffect(() => {
    // Check if selected users are changed
    const selectedUserIds = selectedusers.map((user) => user._id);
    const selectedDepartmentUserIds = filteredUsers
      .filter((user) => user._id !== admin._id)
      .map((user) => user._id);
    setAreUsersChanged(
      JSON.stringify(selectedUserIds) !==
        JSON.stringify(selectedDepartmentUserIds)
    );
    // eslint-disable-next-line
  }, [selectedusers, filteredUsers]);

  // const updateLocalStorageItems = async (updatedDepartment) => {
  //   const storageKeys = [
  //     "allNotes",
  //     "allAssets",
  //     "allImages",
  //     "allVideos",
  //     "allDocuments",
  //   ];

  //   // Step 1: Update department name in stored items
  //   const updateDepartmentNameInItems = (items, updatedDepartment) => {
  //     return items.map((item) => {
  //       if (item.department === updatedDepartment._id) {
  //         item.departmentName = updatedDepartment.departmentName;
  //       }
  //       return item;
  //     });
  //   };

  //   // Step 2: Retrieve and update items from localStorage
  //   storageKeys.forEach((key) => {
  //     const storedItems = JSON.parse(localStorage.getItem(key));
  //     if (storedItems) {
  //       const updatedItems = updateDepartmentNameInItems(
  //         storedItems,
  //         updatedDepartment
  //       );
  //       localStorage.setItem(key, JSON.stringify(updatedItems));
  //     }
  //   });

  //   // Step 3: Update selectedAsset if exists
  //   const selectedAssetKey = "selectedAsset";
  //   const storedSelectedAsset = JSON.parse(
  //     localStorage.getItem(selectedAssetKey)
  //   );
  //   if (storedSelectedAsset) {
  //     if (storedSelectedAsset.department === updatedDepartment._id) {
  //       storedSelectedAsset.departmentName = updatedDepartment.departmentName;
  //       localStorage.setItem(
  //         selectedAssetKey,
  //         JSON.stringify(storedSelectedAsset)
  //       );
  //     }
  //   }
  // };

  // Update Department

  const handleUpdateDepartment = async () => {
    try {
      if (!departmentName.trim()) {
        toast.error("Department name is required");
        return;
      }
      const selectedUserIds = selectedusers.map((option) => option._id);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/department/update-department/${selectedDepartment._id}`,
        {
          adminId: admin._id,
          departmentId: selectedDepartment._id,
          updatedUserIds: selectedUserIds,
          departmentName: departmentName.trim(),
        }
      );
      if (response.status === 200) {
        const updatedDepartment = response.data.department;
        const updatedDepartments = departments.map((department) => {
          if (department._id === updatedDepartment._id) {
            return updatedDepartment;
          }
          return department;
        });

        // Sort departments based
        updatedDepartments.sort((a, b) =>
          a.departmentName.localeCompare(b.departmentName)
        );

        setDepartments(updatedDepartments);

        // Update localStorage
        // await updateLocalStorageItems(updatedDepartment);
        // localStorage.setItem(
        //   "allDepartments",
        //   JSON.stringify(updatedDepartments)
        // );
        resetFormFields();
        onClose();
        toast.success(response.data.message);
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

  return (
    <Dialog
      open={openUpdateDepartmentForm}
      onClose={onClose}
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
        Modify {selectedDepartment.departmentName}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Department Name"
          type="text"
          name="departmentName"
          required
          multiline
          fullWidth
          value={departmentName}
          onChange={(event) => setDepartmentName(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              borderRadius: "5px",
              height: "45px",
            },
          }}
        />
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
            minWidth: 400,
            marginTop: "10px",
          }}
          renderInput={(params) => <TextField {...params} label="Users" />}
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 25px 25px 25px",
          gap: "30px",
        }}
      >
        <Button
          color="error"
          onClick={() => {
            handleOpenDepartmentDeleteDialog();
            onClose();
          }}
        >
          Delete
        </Button>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={onClose}
            type="error"
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateDepartment}
            disabled={
              !departmentName.trim() ||
              (!isDepartmentNameChanged && !areUsersChanged)
            }
            sx={{
              color: "#fff",
              fontSize: "14px",
              backgroundColor: "#0F8FA9",
              "&:hover": {
                backgroundColor: "#075D73",
              },
            }}
          >
            Update
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDepartmentForm;
