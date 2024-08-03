import axios from "axios";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import React, { useEffect, useRef, useState } from "react";

import {
  Slide,
  Paper,
  Button,
  Dialog,
  TextField,
  DialogTitle,
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

const AddMaintenanceRecordForm = (props) => {
  const {
    asset,
    assets,
    onClose,
    setAssets,
    handleLogout,
    setSelectedAsset,
    openAddAssetMaintenanceForm,
  } = props;
  const [maintenanceJob, setMaintenanceJob] = useState("");
  const [maintenanceAlert, setMaintenanceAlert] = useState("");
  const [upcomingMaintenanceDate, setUpcomingMaintenanceDate] = useState("");

  const formattedUpcomingMaintenanceDate =
    asset?.upcomingMaintenanceDate?.split("T")[0];

  useEffect(() => {
    if (openAddAssetMaintenanceForm) {
      setUpcomingMaintenanceDate(
        asset.upcomingMaintenanceDate ? formattedUpcomingMaintenanceDate : ""
      );
    }
    // eslint-disable-next-line
  }, [openAddAssetMaintenanceForm]);

  const resetFormFields = () => {
    setMaintenanceJob("");
    setMaintenanceAlert("");
    setUpcomingMaintenanceDate("");
  };

  // Update Asset
  const handleAddAssetMaintenance = async (id) => {
    try {
      const assetMaintenanceData = new FormData();
      assetMaintenanceData.append("maintenanceJob", maintenanceJob);
      assetMaintenanceData.append("maintenanceAlert", maintenanceAlert);
      assetMaintenanceData.append(
        "upcomingMaintenanceDate",
        upcomingMaintenanceDate
      );

      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/asset/add-asset-maintenance/${id}`,
        assetMaintenanceData
      );
      if (response.status === 201) {
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
      open={openAddAssetMaintenanceForm}
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
        Add Asset Maintenance
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Upcoming Maintenance Date"
          type="date"
          name="upcomingMaintenanceDate"
          fullWidth
          value={upcomingMaintenanceDate || ""}
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
            handleAddAssetMaintenance(asset._id);
          }}
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMaintenanceRecordForm;
