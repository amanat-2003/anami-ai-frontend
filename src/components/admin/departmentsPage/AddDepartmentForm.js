import axios from "axios";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import React, { useRef, useState } from "react";

import {
  Paper,
  Slide,
  Button,
  Dialog,
  Checkbox,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
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

const AddDepartmentForm = (props) => {
  const {
    user,
    onClose,
    allUsers,
    departments,
    handleLogout,
    setDepartments,
    openCreateDepartmentForm,
  } = props;
  const [departmentName, setDepartmentName] = useState("");
  const [selectedusers, setSelectedusers] = useState([]);

  const resetFormFields = () => {
    setDepartmentName("");
  };

  const handleOptionSelect = (options) => {
    setSelectedusers(options);
  };

  // Create Department
  const handleAddDepartment = async (event) => {
    event.preventDefault();
    try {
      if (!departmentName.trim()) {
        toast.error("Department name is required");
        return;
      }
      const selectedUserIds = selectedusers.map((option) => option._id);

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/department/create-department`,
        {
          adminId: user._id,
          departmentName: departmentName.trim(),
          departmentAllowedUserIds: selectedUserIds,
        }
      );
      if (response.status === 201) {
        const newDepartment = response.data.department;
        const updatedDepartments = [...departments, newDepartment].sort(
          (a, b) => a.departmentName.localeCompare(b.departmentName)
        ); // Append the new department and re-sort the array
        setDepartments(updatedDepartments);
        // localStorage.setItem(
        //   "allDepartments",
        //   JSON.stringify(updatedDepartments || {})
        // );
        resetFormFields();
        onClose();
        toast.success(response.data.message);
      } else {
        // Handle unexpected success response
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
      open={openCreateDepartmentForm}
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
        Add Department
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
            width: 500,
            marginTop: "10px",
          }}
          renderInput={(params) => <TextField {...params} label="Users" />}
        />
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "20px",
        }}
      >
        <Button type="error" variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleAddDepartment}
          sx={{
            width: "100px",
            color: "#fff",
            fontSize: "17px",
            padding: "3px",
            backgroundColor: "#0F8FA9",
            "&:hover": {
              backgroundColor: "#075D73",
            },
          }}
          disabled={!departmentName.trim()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDepartmentForm;
