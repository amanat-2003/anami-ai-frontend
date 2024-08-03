import React, { useRef } from "react";
import Draggable from "react-draggable";

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

const UpdateUserForm = ({
  isEditModalOpen,
  handleEditModalClose,
  editedUsername,
  setUserName,
  editedPhone,
  setUserPhone,
  departments,
  selectedDepartments,
  setSelectedDepartments,
  handleUpdateButtonClick,
  permissions,
  selectedPermission,
  setSelectedPermissions,
}) => {
  const handleOptionSelect = (options) => {
    setSelectedPermissions(options);
  };

  const handleDepartmentChange = (options) => {
    setSelectedDepartments(options);
    // const selectedDepartmentId = event.target.value;
    // if (selectedDepartments.includes(selectedDepartmentId)) {
    //   // If it is, remove it from the array
    //   setSelectedDepartments(
    //     selectedDepartments.filter((id) => id !== selectedDepartmentId)
    //   );
    // } else {
    //   setSelectedDepartments([...selectedDepartments, selectedDepartmentId]);
    // }
  };

  return (
    <Dialog
      open={isEditModalOpen}
      onClose={handleEditModalClose}
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
        Update User
      </DialogTitle>
      <DialogContent>
        <TextField
          disabled
          margin="dense"
          label="Name"
          type="text"
          name="Name"
          required
          multiline
          fullWidth
          value={editedUsername}
        />
        <TextField
          disabled
          margin="dense"
          label="User Phone Number"
          type="text"
          name="Contact"
          required
          multiline
          fullWidth
          value={editedPhone}
        />
        {/* Department drop-down */}
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
            flex: 1,
            backgroundColor: "#FFF",
            marginBlock: "15px",
          }}
        >
          <InputLabel
            id="department-label"
            required
            style={{ backgroundColor: "#fff", padding: "4px" }}
          >
            Departments
          </InputLabel>
          <Select
            labelId="department-label"
            id="department-select"
            value={selectedDepartments}
            style={{ height: "45px" }}
            renderValue={(selected) => (
              <span>
                {selected.map((id, index) => {
                  const selectedDepartment = departments.find(
                    (department) => department._id === id
                  );
                  const separator = index === selected.length - 1 ? "" : ", "; // Add a comma between names, except for the last one
                  return selectedDepartment ? (
                    <span key={index}>
                      {selectedDepartment.departmentName}
                      {separator}
                    </span>
                  ) : null;
                })}
              </span>
            )}
            onChange={handleDepartmentChange}
            fullWidth
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
            marginTop: "10px",
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
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button color="error" onClick={handleEditModalClose}>
          Cancel
        </Button>
        <Button color="primary" autoFocus onClick={handleUpdateButtonClick}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserForm;
