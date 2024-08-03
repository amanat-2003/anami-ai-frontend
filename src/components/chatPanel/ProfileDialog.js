import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

const ProfileDialog = (props) => {
  const {
    user,
    isDialogOpen,
    handleDialogClose,
    handleClearConversation,
    handleDeleteConversation,
  } = props;

  return (
    <>
      <Dialog onClose={handleDialogClose} open={isDialogOpen}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>Username: {user.username}</div>
          <div>Email: {user.email}</div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClearConversation();
              handleDialogClose();
            }}
          >
            Clear Chat
          </Button>
          <Button
            onClick={() => {
              handleDeleteConversation();
              handleDialogClose();
            }}
          >
            Delete Chat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileDialog;
