import axios from "axios";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import React, { useEffect, useRef, useState } from "react";

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

const UpdateAssetForm = (props) => {
  const {
    asset,
    assets,
    onClose,
    setAssets,
    departments,
    handleLogout,
    setSelectedAsset,
    selectedDepartment,
    openUpdateAssetForm,
    setSelectedDepartment,
    handleDepartmentChange,
  } = props;
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [operatorName, setOperatorName] = useState("");

  useEffect(() => {
    if (openUpdateAssetForm) {
      setName(asset.name);
      setModel(asset.model);
      setYear(asset.year);
      setLocation(asset.location);
      setOperatorName(asset.operatorName);
    }
    // eslint-disable-next-line
  }, [openUpdateAssetForm, asset]);

  const resetFormFields = () => {
    setSelectedDepartment("");
    setName("");
    setModel("");
    setYear("");
    setLocation("");
    setOperatorName("");
  };

  // Update Asset
  const handleUpdateAsset = async (id) => {
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
      assetData.append("operatorName", operatorName);
      assetData.append("departmentId", selectedDepartment._id);
      assetData.append("departmentName", selectedDepartment.departmentName);

      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/asset/update-asset/${id}`,
        assetData
      );
      if (response.status === 200) {
        const updatedAsset = response.data.asset;
        const updatedAssets = assets.map((asset) => {
          if (asset._id === updatedAsset._id) {
            return updatedAsset;
          }
          return asset;
        });

        // Sort assets based
        updatedAssets.sort((a, b) => a.name.localeCompare(b.name));

        setAssets(updatedAssets);
        setSelectedAsset(updatedAsset);
        localStorage.setItem("asset", JSON.stringify(updatedAsset));

        // Update localStorage
        // localStorage.setItem("allAssets", JSON.stringify(updatedAssets));
        // localStorage.setItem("selectedAsset", JSON.stringify(updatedAsset));
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
      open={openUpdateAssetForm}
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
        Update Asset
      </DialogTitle>
      <DialogContent>
        {departments.find(
          (department) => department._id === selectedDepartment?._id
        ) && (
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
        )}
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
          onChange={(event) => setYear(event.target.value)}
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
        <Button
          onClick={() => {
            handleUpdateAsset(asset._id);
          }}
          color="primary"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAssetForm;
