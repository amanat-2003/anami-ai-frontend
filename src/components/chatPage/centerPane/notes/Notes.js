import axios from "axios";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";

import {
  Box,
  Fab,
  Menu,
  Select,
  Tooltip,
  MenuItem,
  TextField,
  IconButton,
  InputLabel,
  FormControl,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import MediaMetadataDialog from "../MediaMetadataDialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import CloseNoteConfirmDialog from "./CloseNoteConfirmDialog";

const NoteItem = ({
  auth,
  note,
  noteToProcess,
  openComponent,
  handleShowDocument,
  setSelectedNote,
  handleProcessNote,
  handleDocFileDownload,
  handleOpenNoteDeleteDialog,
  vectorstoreConversionInProgress,
  handleOpenMetadataDialog,
  handleNoteSelection,
  deleteNoteLoader,
  selectedNotes,
  setNotificationContent,
  setNotificationReturnMessage,
  handleOpenPermissionConfirmDialog,
  setIsDocDisplayOpen,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div style={{ width: "50%", minWidth: "200px", maxWidth: "20%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "5px",
          padding: "3px",
          borderRadius: "5px",
          border: "solid 1px #eee",
          position: "relative",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
        onClick={() => {
          if (!deleteNoteLoader) {
            handleShowDocument(note);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {note.processed ? (
          <></>
        ) : (
          <>
            <Tooltip title={"Not Processed"} placement="top" arrow>
              <InfoIcon
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  fontSize: "13px",
                  color: "red",
                }}
              />
            </Tooltip>
          </>
        )}
        {(isHovered || selectedNotes?.length > 0) && (
          <Checkbox
            color="primary"
            size="small"
            style={{
              cursor: "default",
              padding: "7px",
              borderRadius: "2px",
              position: "absolute",
              zIndex: 2,
              background: "#FFF",
            }}
            checked={selectedNotes.includes(note)}
            onClick={(e) => {
              e.stopPropagation();
              handleNoteSelection(note);
            }}
          />
        )}
        <IconButton size="small" style={{ background: "transparent" }}>
          <img
            alt="pdf"
            src="/images/noteIcon2.png"
            style={{
              height: "25px",
            }}
          />
        </IconButton>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
            fontSize: "13px",
          }}
          title={document.fileName}
        >
          {note.fileName}
        </div>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e);
          }}
          style={{ cursor: "auto" }}
        >
          <MoreVertOutlinedIcon style={{ color: "#000" }} />
        </IconButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          disabled={
            noteToProcess?._id === note._id && vectorstoreConversionInProgress
          }
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            setSelectedNote(note);
            if (
              auth?.user?.permissions.includes("Update Note") ||
              auth?.user?.permissions.includes("All")
            ) {
              openComponent("UpdateNote");
            } else {
              const notificationObject = {
                recipientId: auth?.user?.admin,
                senderId: auth?.user?._id,
                type: "Note Updation Permission",
                content: `${auth?.user?.username} asked for permission to update the note: ${note.fileName}`,
                senderName: auth?.user?.username,
              };
              const returnMessage =
                "Admin notified to update required permission";
              setNotificationContent(notificationObject);
              setNotificationReturnMessage(returnMessage);
              handleOpenPermissionConfirmDialog();
            }
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <EditNoteRoundedIcon />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {!note.processed && (
          <MenuItem
            disabled={vectorstoreConversionInProgress}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              handleProcessNote(note);
            }}
          >
            <ListItemIcon
              style={{
                fontSize: "20px",
                color: "#3C4043",
              }}
            >
              <SettingsSuggestOutlinedIcon style={{ fontSize: "28px" }} />
            </ListItemIcon>
            <ListItemText>Process</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleDocFileDownload(note);
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <FileDownloadOutlinedIcon />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            setSelectedNote(note);
            if (
              auth?.user?.permissions.includes("All") ||
              auth?.user?.permissions.includes("Delete Note") ||
              note.isApprovedForDeletion
            ) {
              setIsDocDisplayOpen(false);
              handleOpenNoteDeleteDialog(note);
            } else {
              const notificationObject = {
                recipientId: auth?.user?.admin,
                senderId: auth?.user?._id,
                type: "Note Approval for Deletion",
                content: `${auth?.user?.username} seeking permission for deleting note: '${note?.fileName}'.
                The note is in asset: '${note?.assetName}'`,
                senderName: auth?.user?.username,
                assetId: note?.asset,
                assetName: note?.assetName,
                noteName: note?.fileName,
                documentId: note._id,
              };

              setNotificationContent(notificationObject);
              setNotificationReturnMessage("Sent for approval for deletion");
              handleOpenPermissionConfirmDialog();
            }
          }}
          disabled={
            noteToProcess?._id === note._id && vectorstoreConversionInProgress
          }
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <DeleteOutlinedIcon />
          </ListItemIcon>
          Delete
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleOpenMetadataDialog(note);
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <InfoOutlinedIcon />
          </ListItemIcon>
          About
        </MenuItem>
      </Menu>
    </div>
  );
};

const Notes = ({
  auth,
  notes,
  handleLogout,
  openComponent,
  noteToProcess,
  handleShowDocument,
  setSelectedNote,
  handleCreateNote,
  handleProcessNote,
  handleDocFileDownload,
  handleOpenNoteDeleteDialog,
  vectorstoreConversionInProgress,
  selectedNotes,
  setSelectedNotes,
  deleteNoteLoader,
  setIsDocDisplayOpen,
  handleDeleteMultipleNotes,
  isNoteCloseConfirmDialogOpen,
  handleCloseNoteCloseConfirmDialog,
}) => {
  const [filterText, setFilterText] = useState("");
  const [isMetadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState({});
  const [notificationContent, setNotificationContent] = useState({});
  const [isPermissionConfirmDialogOpen, setPermissionConfirmDialogOpen] =
    useState(false);
  const [notificationReturnMessage, setNotificationReturnMessage] =
    useState("");
  const [sortingItem, setSortingItem] = useState({
    key: "Processed",
    text: "processed",
  });

  const handleOpenPermissionConfirmDialog = () => {
    setPermissionConfirmDialogOpen(true);
  };

  const handleClosePermissionConfirmDialog = () => {
    setPermissionConfirmDialogOpen(false);
    setNotificationContent({});
  };

  useEffect(() => {
    setSelectedNotes([]);
    //eslint-disable-next-line
  }, []);

  const handleOpenMetadataDialog = (media) => {
    setSelectedMedia(media);
    setMetadataDialogOpen(true);
  };

  const handleCloseMetadataDialog = () => {
    setMetadataDialogOpen(false);
  };

  const handleNoteSelection = (note) => {
    const index = selectedNotes.findIndex((n) => n?._id === note._id);

    if (index !== -1) {
      setSelectedNotes((prevSelectedNotes) =>
        prevSelectedNotes.filter((n) => n._id !== note._id)
      );
    } else {
      setSelectedNotes((prevSelectedNotes) => [...prevSelectedNotes, note]);
    }
  };

  const handleSelectAllNotes = () => {
    if (selectedNotes.length === notes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(notes);
    }
  };

  const sortingOptions = [
    {
      key: "A-Z",
      text: "alphabetically",
    },
    {
      key: "Processed",
      text: "processed",
    },
    {
      key: "Date added",
      text: "uploadDate",
    },
  ];

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSendNotification = () => {
    toast.promise(
      axios.post(
        `${process.env.REACT_APP_API}/api/v1/notification/new-notification`,
        notificationContent
      ),
      {
        success: (response) => {
          setNotificationContent({});
          setNotificationReturnMessage("");
          handleClosePermissionConfirmDialog();
          return notificationReturnMessage;
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
  };

  const sortedNotes = notes.sort((a, b) => {
    if (sortingItem.key === "Processed") {
      if (a.processed && !b.processed) return 1;
      if (!a.processed && b.processed) return -1;
      return 0;
    } else if (sortingItem.key === "Date added") {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortingItem.key === "A-Z") {
      return a.fileName.localeCompare(b.fileName);
    }
    return sortedNotes;
  });

  const filterSortedNotes = sortedNotes
    ? notes.filter((note) => new RegExp(filterText, "i").test(note?.fileName))
    : sortedNotes;

  return (
    <>
      {isNoteCloseConfirmDialogOpen && (
        <CloseNoteConfirmDialog
          isNoteCloseConfirmDialogOpen={isNoteCloseConfirmDialogOpen}
          handleCloseNoteCloseConfirmDialog={handleCloseNoteCloseConfirmDialog}
        />
      )}
      {isMetadataDialogOpen && (
        <MediaMetadataDialog
          isOpen={isMetadataDialogOpen}
          onClose={handleCloseMetadataDialog}
          media={selectedMedia}
        />
      )}

      {/* Request Access Dialog */}
      <Dialog
        open={isPermissionConfirmDialogOpen}
        onClose={handleClosePermissionConfirmDialog}
      >
        <DialogContent>
          <DialogContentText>
            You are not authorized to perform the action. Do you want to ask
            permission from the admin.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermissionConfirmDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleSendNotification} color="primary" autoFocus>
            Request Access
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        height={`calc(100vh)`}
        style={{
          marginTop: "0px",
          backgroundColor: "#fff",
          padding: "25px",
          position: "relative",
        }}
      >
        {notes.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                height: "50px",
                alignItems: "center",
                margin: "10px 10px",
              }}
            >
              <div style={{ position: "absolute" }}>
                <IconButton
                  onClick={() => {
                    openComponent("MainChatSection");
                  }}
                >
                  <CloseOutlinedIcon
                    sx={{
                      color: "#000",
                    }}
                  />
                </IconButton>
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#000",
                  fontSize: "22px",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                Notes
              </div>
            </Box>
            <div
              style={{
                height: "50px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                value={filterText}
                style={{
                  borderRadius: "10px",
                  width: "100%",
                  marginLeft: "5px",
                }}
                onChange={handleFilterChange}
                height="50px"
                InputProps={{
                  style: {
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#909090" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl
                variant="outlined"
                size="small"
                style={{ marginRight: "5px", minWidth: "130px" }}
              >
                <InputLabel id="sorting-label">Sort</InputLabel>
                <Select
                  labelId="sorting-label"
                  id="sorting-select"
                  value={sortingItem.key}
                  onChange={(e) => {
                    setSortingItem(
                      sortingOptions.find(
                        (option) => option.key === e.target.value
                      )
                    );
                  }}
                  label="Sort"
                >
                  {sortingOptions.map((item, index) => (
                    <MenuItem key={index} value={item.key}>
                      {item.key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                height: "40px",
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              {selectedNotes?.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: "#AAA1",
                    borderRadius: "20px",
                    height: "40px",
                  }}
                >
                  <Checkbox
                    color="info"
                    size="small"
                    checked={selectedNotes.length === notes.length}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAllNotes();
                    }}
                  />
                  <Typography sx={{ padding: "0 15px 0 5px" }} variant="body2">
                    Selected - {selectedNotes?.length}/{notes.length}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={deleteNoteLoader}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMultipleNotes();
                    }}
                  >
                    <DeleteOutlinedIcon
                      style={{ color: "#000", fontSize: "20px" }}
                    />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    borderRadius: "10px",
                    padding: "0 0 0 5px",
                    height: "40px",
                  }}
                >
                  <Typography sx={{ padding: "0px" }} variant="body2">
                    Total - {notes.length}
                  </Typography>
                </Box>
              )}
            </div>
            <div
              style={{
                marginTop: "10px",
                height: `calc(100% - 180px)`,
                overflow: "auto",
                paddingInline: "5px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "calc(100%)",
                }}
              >
                {filterSortedNotes.length > 0 ? (
                  filterSortedNotes.map((note, index) => (
                    <NoteItem
                      key={index}
                      auth={auth}
                      note={note}
                      openComponent={openComponent}
                      noteToProcess={noteToProcess}
                      handleShowDocument={handleShowDocument}
                      setSelectedNote={setSelectedNote}
                      handleProcessNote={handleProcessNote}
                      handleDocFileDownload={handleDocFileDownload}
                      handleOpenNoteDeleteDialog={handleOpenNoteDeleteDialog}
                      vectorstoreConversionInProgress={
                        vectorstoreConversionInProgress
                      }
                      handleOpenMetadataDialog={handleOpenMetadataDialog}
                      handleNoteSelection={handleNoteSelection}
                      deleteNoteLoader={deleteNoteLoader}
                      selectedNotes={selectedNotes}
                      setNotificationContent={setNotificationContent}
                      setNotificationReturnMessage={
                        setNotificationReturnMessage
                      }
                      handleOpenPermissionConfirmDialog={
                        handleOpenPermissionConfirmDialog
                      }
                      setIsDocDisplayOpen={setIsDocDisplayOpen}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      minHeight: "60vh",
                      maxHeight: "60vh",
                      width: "100%",
                      overflow: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#000",
                      fontSize: "18px",
                      textAlign: "left",
                    }}
                  >
                    No matching notes found.
                  </div>
                )}
              </div>
            </div>
            <Tooltip
              title="Create New Note"
              aria-label="Create New Note"
              arrow
              placement="bottom"
            >
              <Fab
                color="primary"
                aria-label="add"
                size="small"
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  color: "#FFF",
                  background: "#0f8fa9",
                  fontSize: "45px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateNote();
                }}
              >
                <AddIcon style={{ fontSize: "35px" }} />
              </Fab>
            </Tooltip>
          </>
        ) : (
          <div style={{ height: "100%" }}>
            <div
              style={{
                height: `calc(100%)`,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center",
                padding: "20px",
                boxSizing: "border-box",
                fontSize: "24px",
                borderRadius: "4px",
              }}
            >
              <div>
                <Typography
                  style={{ marginBottom: "10px", fontSize: "35px" }}
                  variant="body2"
                >
                  Create Notes for Your Project
                </Typography>
                <Typography style={{ marginBottom: "30px" }} variant="body2">
                  You haven't created any notes for this project yet.
                </Typography>
                <button
                  style={{
                    padding: "12px 24px",
                    fontSize: "15px",
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "background 0.3s ease",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateNote();
                  }}
                >
                  <Typography variant="body2">Create Note</Typography>
                </button>
              </div>
              <img
                src="/images/noteUploadBackground.jpg"
                alt="Note Gallery"
                style={{ maxWidth: "100%", maxHeight: "80%" }}
              />
            </div>
          </div>
        )}
      </Box>
    </>
  );
};

export default Notes;
