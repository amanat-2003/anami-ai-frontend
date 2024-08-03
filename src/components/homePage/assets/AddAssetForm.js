import axios from "axios";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import { useAuth } from "../../../context/auth.js";
import React, { useRef, useState } from "react";

import {
  Slide,
  Paper,
  Button,
  Select,
  Dialog,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
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

const AddAssetForm = (props) => {
  const {
    assets,
    onClose,
    setAssets,
    departments,
    handleLogout,
    selectedDepartment,
    openCreateAssetForm,
    handleDepartmentChange,
  } = props;
  const [auth] = useAuth();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [maintenanceJob, setMaintenanceJob] = useState("");
  const [maintenanceAlert, setMaintenanceAlert] = useState("");
  const [upcomingMaintenanceDate, setUpcomingMaintenanceDate] = useState("");

  const resetFormFields = () => {
    setName("");
    setYear("");
    setModel("");
    setLocation("");
    setOperatorName("");
    setMaintenanceJob("");
    setMaintenanceAlert("");
    setUpcomingMaintenanceDate("");
  };

  // Create Asset
  const handleAddAsset = async (event) => {
    event.preventDefault();
    try {
      if (!selectedDepartment) {
        toast.error("Department is required");
        return;
      }
      const assetData = new FormData();
      assetData.append("year", year);
      assetData.append("model", model);
      assetData.append("name", name.trim());
      assetData.append("location", location);
      assetData.append("userId", auth.user._id);
      assetData.append("operatorName", operatorName);
      assetData.append("maintenanceJob", maintenanceJob);
      assetData.append("maintenanceAlert", maintenanceAlert);
      assetData.append("departmentId", selectedDepartment._id);
      assetData.append("upcomingMaintenanceDate", upcomingMaintenanceDate);
      assetData.append("departmentName", selectedDepartment.departmentName);

      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/asset/create-asset`,
          assetData
        ),
        {
          loading: "Creating Asset... Please Wait!",
          success: (response) => {
            if (response.status === 201) {
              const newAsset = response.data.asset;
              const updatedAssets = [...assets, newAsset].sort((a, b) =>
                a.name.localeCompare(b.name)
              ); // Append the new asset and re-sort the array
              setAssets(updatedAssets);
              // localStorage.setItem(
              //   "allAssets",
              //   JSON.stringify(updatedAssets || {})
              // );
              resetFormFields();
              onClose();
              return response.data.message;
            } else {
              // Handle unexpected success response
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
      open={openCreateAssetForm}
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
        Create Asset
      </DialogTitle>
      <DialogContent>
        <FormControl
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
            shrink={true}
            style={{ backgroundColor: "#FFF" }}
            htmlFor="department-select"
          >
            Department
          </InputLabel>
          <Select
            value={selectedDepartment ? selectedDepartment._id : ""}
            onChange={handleDepartmentChange}
            label="Department"
            style={{
              borderRadius: "20px",
              height: "45px",
            }}
            inputProps={{
              name: "department",
              id: "department-select",
            }}
          >
            {departments?.length > 0 ? (
              departments.map((department) => (
                <MenuItem key={department._id} value={department._id}>
                  {department.departmentName}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                <Typography variant="subtitle1">
                  No department created
                </Typography>
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          name="name"
          required
          fullWidth
          value={name}
          onChange={(event) => setName(event.target.value)}
          InputLabelProps={{
            shrink: true,
            variant: "outlined",
          }}
          InputProps={{
            style: {
              borderRadius: "20px",
              height: "45px",
              marginBottom: "10px",
            },
          }}
        />
        <TextField
          margin="dense"
          label="Model"
          type="text"
          name="model"
          required
          fullWidth
          value={model}
          onChange={(event) => setModel(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              borderRadius: "20px",
              height: "45px",
              marginBottom: "10px",
            },
          }}
        />
        <TextField
          margin="dense"
          label="Year"
          type="number"
          name="year"
          required
          fullWidth
          value={year}
          onChange={(event) => {
            let inputYear = event.target.value;
            // Remove any non-numeric characters
            inputYear = inputYear.replace(/\D/g, "");
            if (inputYear <= 9999) {
              setYear(inputYear);
            }
          }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              borderRadius: "20px",
              height: "45px",
              marginBottom: "10px",
            },
          }}
        />
        <TextField
          margin="dense"
          label="Upcoming Maintenance Date"
          type="date"
          name="upcomingMaintenanceDate"
          fullWidth
          value={upcomingMaintenanceDate}
          onChange={(event) => setUpcomingMaintenanceDate(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              borderRadius: "20px",
              height: "45px",
              marginBottom: "10px",
            },
          }}
        />
        <TextField
          margin="dense"
          label="Maintenance Job"
          type="text"
          name="maintenanceJob"
          fullWidth
          value={maintenanceJob}
          onChange={(event) => setMaintenanceJob(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              borderRadius: "20px",
              height: "45px",
              marginBottom: "10px",
            },
          }}
        />
        <TextField
          margin="dense"
          label="Maintenance Alert"
          type="text"
          name="maintenanceAlert"
          fullWidth
          value={maintenanceAlert}
          onChange={(event) => setMaintenanceAlert(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              borderRadius: "20px",
              height: "45px",
              marginBottom: "10px",
            },
          }}
        />
        <TextField
          margin="dense"
          label="Location"
          type="text"
          name="location"
          fullWidth
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              borderRadius: "20px",
              height: "45px",
              marginBottom: "10px",
            },
          }}
        />
        <TextField
          margin="dense"
          label="Operator Name"
          type="text"
          name="operatorName"
          fullWidth
          value={operatorName}
          onChange={(event) => setOperatorName(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              borderRadius: "20px",
              height: "45px",
            },
          }}
        />
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
        <Button color="primary" onClick={handleAddAsset}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAssetForm;
