import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const CloseNoteConfirmDialog = (props) => {
  const {
    isNoteCloseConfirmDialogOpen,
    handleCloseNoteCloseConfirmDialog,
    handleSaveDraft,
    handleDeleteNote,
    createdNote,
    openComponent,
    isUpdatingNote,
    resetNoteText,
  } = props;

  return (
    <Dialog
      open={isNoteCloseConfirmDialogOpen}
      onClose={handleCloseNoteCloseConfirmDialog}
    >
      <DialogTitle>Do you want to save changes?</DialogTitle>

      <DialogContent
        style={{ display: "flex", flexDirection: "column" }}
      ></DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleSaveDraft();
            handleCloseNoteCloseConfirmDialog();
            if (!isUpdatingNote) {
              resetNoteText();
            }
          }}
          color="primary"
        >
          Save
        </Button>
        <Button
          onClick={() => {
            if (isUpdatingNote) {
              openComponent("Notes");
              handleCloseNoteCloseConfirmDialog();
            } else {
              resetNoteText();
              handleDeleteNote(createdNote);
            }
          }}
          color="primary"
        >
          Discard
        </Button>
        <Button onClick={handleCloseNoteCloseConfirmDialog} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseNoteConfirmDialog;
