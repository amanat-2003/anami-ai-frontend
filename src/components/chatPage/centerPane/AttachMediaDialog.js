import axios from "axios";
import { toast } from "react-hot-toast";
import Draggable from "react-draggable";
import React, { useState, useRef } from "react";

import {
  Box,
  Grid,
  Slide,
  Paper,
  Dialog,
  Button,
  Tooltip,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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

export default function AttachMediaDialog(props) {
  const {
    user,
    asset,
    onClose,
    handleLogout,
    notes,
    images,
    videos,
    documents,
    setNotes,
    setImages,
    setVideos,
    setDocuments,
    openAttachMediaDialog,
    setOpenAttachMediaDialog,
  } = props;

  // Sort the selected documents by name
  const sortedDocuments = documents
    .slice()
    .sort((a, b) => a.fileName.localeCompare(b.fileName));

  return (
    <Dialog
      open={openAttachMediaDialog}
      onClose={onClose}
      aria-labelledby="draggable-dialog"
      PaperComponent={PaperComponent}
      PaperProps={{
        style: {
          margin: "20px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        },
      }}
      TransitionComponent={Transition}
      TransitionProps={{
        timeout: {
          enter: 500,
          exit: 200,
        },
      }}
      maxWidth
    >
      <DialogTitle
        style={{
          textAlign: "center",
          cursor: "move",
          fontSize: "20px",
          fontWeight: "500",
          padding: "20px 0 0 0",
        }}
        variant="subtitle2"
        className="draggable-dialog"
      >
        Attach files
      </DialogTitle>
      <DialogContent style={{ paddingTop: "5px", width: "100%" }}>
        {/* <Grid container rowSpacing={2}>
          <Grid item xs={12}>{docs}</Grid>
          <Grid item xs={12}></Grid>
        </Grid> */}
      </DialogContent>
      <DialogActions
        style={{
          marginTop: "10px",
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button sx={{ color: "#0f8fa9" }}>Attach</Button>
        <Button onClick={onClose} sx={{ color: "#dd2025" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
