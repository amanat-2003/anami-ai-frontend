import axios from "axios";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import { useAuth } from "../../../context/auth";
import React, { useRef, useState } from "react";

import {
  Slide,
  Paper,
  Dialog,
  Button,
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

const AddUserForm = (props) => {
  const {
    onClose,
    allUsers,
    setAllUsers,
    departments,
    permissions,
    handleLogout,
    openAddUserForm,
  } = props;
  const [auth] = useAuth();
  const [email, setUserEmail] = useState("");
  const [phone, setUserPhone] = useState("");
  const [username, setUserName] = useState("");
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const resetFormFields = () => {
    setUserName("");
    setUserEmail("");
    setUserPhone("");
  };
  const handleDepartmentChange = (options) => {
    setSelectedDepartments(options);
  };

  const handleOptionSelect = (options) => {
    setSelectedPermission(options);
  };

  // Create User
  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      if (!username.trim()) {
        toast.error("Username is required");
        return;
      }
      const selectedPermissionsName = selectedPermission.map(
        (option) => option.name
      );
      const selectedDepartmentIds = selectedDepartments.map(
        (option) => option._id
      );

      const userData = new FormData();
      userData.append("adminId", auth?.user?._id);
      userData.append("username", username);
      userData.append("email", email);
      userData.append("phone", phone);
      userData.append("departments", selectedDepartmentIds);
      userData.append("permissions", selectedPermissionsName);

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/admin/user/add-user`,
        userData
      );
      if (response.status === 201) {
        const newUser = response.data.user;
        const newUsers = [...allUsers, newUser];
        const updatedUsers = newUsers
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user, index) => ({
            ...user,
            id: index + 1,
          })); // Append the new user and re-sort the array
        setAllUsers(updatedUsers);
        // localStorage.setItem("allUsers", JSON.stringify(updatedUsers || {}));
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
      open={openAddUserForm}
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
        Add User
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="User Name"
          type="text"
          name="username"
          required
          fullWidth
          value={username}
          onChange={(event) => setUserName(event.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="User Email"
          type="text"
          name="email"
          required
          fullWidth
          value={email}
          onChange={(event) => setUserEmail(event.target.value.toLowerCase())}
        />
        <TextField
          autoFocus
          margin="dense"
          label="User Phone Number"
          type="text"
          name="phone"
          required
          fullWidth
          value={phone}
          onChange={(event) => {
            let inputContact = event.target.value;
            // Remove any non-numeric characters
            inputContact = inputContact.replace(/\D/g, "");
            if (inputContact <= 9999999999) {
              setUserPhone(inputContact);
            }
          }}
        />

        <Autocomplete
          multiple
          options={departments}
          disableCloseOnSelect
          getOptionLabel={(option) => option.departmentName}
          onChange={(event, value) => handleDepartmentChange(value)}
          value={selectedDepartments}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.departmentName}
            </li>
          )}
          fullWidth
          sx={{
            flex: 1,
            width: "100%",
            background: "red",
            marginTop: "10px",
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Departments"
              required
              style={{
                flex: 1,
                backgroundColor: "#FFF",
                width: "100%",
              }}
            />
          )}
        />

        {/* <FormControl
          fullWidth
          size="small"
          variant="outlined"
          required
          style={{
            backgroundColor: "#FFF",
            margin: "10px 0 15px 0",
            height: "55px",
          }}
        >
          <InputLabel id="department-label" style={{ backgroundColor: "#fff" }}>
            Departments
          </InputLabel>
          <Select
            labelId="department-label"
            id="department-select"
            multiple
            value={selectedDepartments}
            onChange={handleDepartmentChange}
            variant="outlined"
            fullWidth
            style={{ height: "100%" }}
          >
            {departments.map((department) => (
              <MenuItem key={department._id} value={department._id}>
                {department.departmentName}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {/* permissions dropdown */}
        <Autocomplete
          multiple
          options={permissions}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          onChange={(event, value) => handleOptionSelect(value)}
          value={selectedPermission}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          fullWidth
          sx={{
            flex: 1,
            width: "100%",
            background: "red",
            marginTop: "13px",
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Permissions"
              required
              style={{
                flex: 1,
                backgroundColor: "#FFF",
                width: "100%",
              }}
            />
          )}
        />
        {/* <FormControl
          fullWidth
          size="small"
          variant="outlined"
          required
          style={{
            flex: 1,
            backgroundColor: "#FFF",
            marginBlock: "15px",
          }}
        >
          <InputLabel
            id="permission-label"
            required
            shrink={true}
            style={{ backgroundColor: "#fff", padding: "4px" }}
          >
            Permissions
          </InputLabel>
          <Select
            labelId="permission-label"
            id="permission-select"
            multiple
            value={selectedPermission}
            onChange={handlePermissionChange}
            variant="outlined"
            fullWidth
            style={{ borderRadius: "20px", height: "45px" }}
          >
            {permissions.map((permission, index) => (
              <MenuItem key={index} value={permission.name}>
                {permission.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleAddUser}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserForm;
