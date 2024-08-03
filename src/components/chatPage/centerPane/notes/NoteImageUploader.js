import Draggable from "react-draggable";
import React, { useRef } from "react";

import {
  Grid,
  Slide,
  Paper,
  Dialog,
  Button,
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

export default function NoteImageUploader(props) {
  const {
    onClose,
    open,
    handleOpenImageMediaList,
    handleImageChange,
    imageFileInputRef,
  } = props;

  return (
    <Dialog
      open={open}
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
        Add Images
      </DialogTitle>
      <DialogContent style={{ paddingTop: "5px" }}>
        <Grid container rowSpacing={2}>
          <Grid
            item
            xs={12}
            mt={2}
            sx={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <input
              accept="image/png, image/jpeg, image/jpg"
              style={{ display: "none" }}
              id="file-input"
              type="file"
              ref={imageFileInputRef}
              onChange={handleImageChange}
              multiple
            />
            <label htmlFor="file-input">
              <Button
                variant="contained"
                component="span"
                sx={{
                  borderRadius: "5px",
                  color: "white",
                  paddingInline: "50px",
                  backgroundColor: "#0F8FA9",
                  "&:hover": {
                    backgroundColor: "#075D73",
                  },
                }}
              >
                Upload
              </Button>
            </label>
            <Button
              variant="contained"
              component="span"
              sx={{
                borderRadius: "5px",
                color: "white",
                paddingInline: "50px",
                backgroundColor: "#0F8FA9",
                "&:hover": {
                  backgroundColor: "#075D73",
                },
              }}
              onClick={() => {
                onClose();
                handleOpenImageMediaList();
              }}
            >
              Storage
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button onClick={onClose} sx={{ color: "#dd2025" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
