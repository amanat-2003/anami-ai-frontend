import axios from "axios";
import toast from "react-hot-toast";
import React, { useState } from "react";

import {
  Box,
  Fab,
  Menu,
  Select,
  Tooltip,
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
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
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";

const PDFItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.pdf$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img alt="pdf" src="/images/pdfIcon2.png" style={{ height: "25px" }} />
      </IconButton>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          fontSize: "13px",
        }}
        title={fileNameWithoutExtension}
      >
        {fileNameWithoutExtension}
      </div>
    </>
  );
};

const PPTItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.pptx?$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img alt="ppt" src="/images/pptIcon2.png" style={{ height: "25px" }} />
      </IconButton>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          fontSize: "13px",
        }}
        title={fileNameWithoutExtension}
      >
        {fileNameWithoutExtension}
      </div>
    </>
  );
};

const WordItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.docx?$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img
          alt="word"
          src="/images/wordIcon2.png"
          style={{ height: "25px" }}
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
        title={fileNameWithoutExtension}
      >
        {fileNameWithoutExtension}
      </div>
    </>
  );
};

const CSVItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.csv?$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img alt="csv" src="/images/csvIcon.png" style={{ height: "25px" }} />
      </IconButton>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          fontSize: "13px",
        }}
        title={fileNameWithoutExtension}
      >
        {fileNameWithoutExtension}
      </div>
    </>
  );
};

const TextItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.txt$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img
          alt="text"
          src="/images/textIcon2.png"
          style={{ height: "25px" }}
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
        title={fileNameWithoutExtension}
      >
        {fileNameWithoutExtension}
      </div>
    </>
  );
};

const DocumentItem = ({
  auth,
  document,
  documentToProcess,
  handleShowDocument,
  handleProcessDocument,
  handleDocFileDownload,
  handleOpenDocumentDeleteDialog,
  vectorstoreConversionInProgress,
  handleOpenMetadataDialog,
  handleDocumentSelection,
  deleteDocumentLoader,
  selectedDocuments,
  setNotificationContent,
  setNotificationReturnMessage,
  handleOpenPermissionConfirmDialog,
  setSelectedDocument,
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

  const lastDotIndex = document.fileName.lastIndexOf(".");
  const fileExtension = document.fileName
    .substring(lastDotIndex + 1)
    .toLowerCase();

  // Render the respective document item component based on file type
  const renderDocumentItem = () => {
    switch (fileExtension) {
      case "pdf":
        return <PDFItem document={document} />;
      // case "ppt":
      case "pptx":
        return <PPTItem document={document} />;
      // case "doc":
      case "docx":
        return <WordItem document={document} />;
      case "csv":
        return <CSVItem document={document} />;
      case "txt":
        return <TextItem document={document} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: "50%", minWidth: "200px", maxWidth: "20%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "4px",
          padding: "2px",
          borderRadius: "5px",
          border: "solid 1px #eee",
          position: "relative",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
        onClick={() => {
          if (!deleteDocumentLoader) {
            handleShowDocument(document);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {document.processed ? (
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
        {(isHovered || selectedDocuments?.length > 0) && (
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
            checked={selectedDocuments.includes(document)}
            onClick={(e) => {
              e.stopPropagation();
              handleDocumentSelection(document);
            }}
          />
        )}
        {renderDocumentItem()}
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
        {!document.processed && (
          <MenuItem
            disabled={vectorstoreConversionInProgress}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              handleProcessDocument(document);
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
            handleDocFileDownload(document);
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
            setSelectedDocument(document);
            if (
              auth?.user?.permissions.includes("Delete Document") ||
              auth?.user?.permissions.includes("All") ||
              document.isApprovedForDeletion
            ) {
              setIsDocDisplayOpen(false);
              handleOpenDocumentDeleteDialog(document);
            } else {
              const notificationObject = {
                recipientId: auth?.user?.admin,
                senderId: auth?.user?._id,
                type: "Document Approval for Deletion",
                content: `${auth?.user?.username} seeking permission for deleting document: '${document?.fileName}'.\nThe document is in asset: '${document?.assetName}' `,
                senderName: auth?.user?.username,
                assetId: document?.asset,
                assetName: document?.assetName,
                documentName: document?.fileName,
                documentId: document?._id,
              };

              setNotificationContent(notificationObject);
              setNotificationReturnMessage("Sent for approval for deletion");
              handleOpenPermissionConfirmDialog();
            }
          }}
          disabled={
            documentToProcess?._id === document._id &&
            vectorstoreConversionInProgress
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
            handleOpenMetadataDialog(document);
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

const Documents = ({
  auth,
  documents,
  openComponent,
  handleLogout,
  documentToProcess,
  handleShowDocument,
  handleProcessDocument,
  handleDocFileDownload,
  handleOpenUploadDocumentForm,
  handleOpenDocumentDeleteDialog,
  vectorstoreConversionInProgress,
  selectedDocuments,
  setSelectedDocuments,
  handleDeleteMultipleDocuments,
  deleteDocumentLoader,
  setIsDocDisplayOpen,
  setSelectedDocument,
}) => {
  const [filterText, setFilterText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState({});
  const [notificationContent, setNotificationContent] = useState({});
  const [isPermissionConfirmDialogOpen, setPermissionConfirmDialogOpen] =
    useState(false);
  const [notificationReturnMessage, setNotificationReturnMessage] =
    useState("");

  const [isMetadataDialogOpen, setMetadataDialogOpen] = useState(false);
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

  const handleOpenMetadataDialog = (media) => {
    setSelectedMedia(media);
    setMetadataDialogOpen(true);
  };

  const handleCloseMetadataDialog = () => {
    setMetadataDialogOpen(false);
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

  const handleDocumentSelection = (document) => {
    const index = selectedDocuments.findIndex(
      (doc) => doc?._id === document._id
    );

    if (index !== -1) {
      setSelectedDocuments((prevSelectedDocuments) =>
        prevSelectedDocuments.filter((doc) => doc._id !== document._id)
      );
    } else {
      setSelectedDocuments((prevSelectedDocuments) => [
        ...prevSelectedDocuments,
        document,
      ]);
    }
  };

  const handleSelectAllDocuments = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents);
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

  const sortedDocuments = documents.sort((a, b) => {
    if (sortingItem.key === "Processed") {
      if (a.processed && !b.processed) return 1;
      if (!a.processed && b.processed) return -1;
      return 0;
    } else if (sortingItem.key === "Date added") {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortingItem.key === "A-Z") {
      return a.fileName.localeCompare(b.fileName);
    }
    return sortedDocuments;
  });

  const filterSortedDocuments = sortedDocuments
    ? documents.filter((doc) => new RegExp(filterText, "i").test(doc?.fileName))
    : sortedDocuments;

  return (
    <>
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
        {documents.length > 0 ? (
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
                  <CloseOutlinedIcon sx={{ color: "#000" }} />
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
                Documents
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
                  style: { borderRadius: "10px", backgroundColor: "#fff" },
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
              {selectedDocuments?.length > 0 ? (
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
                    checked={selectedDocuments.length === documents.length}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAllDocuments();
                    }}
                  />
                  <Typography sx={{ padding: "0 15px 0 5px" }} variant="body2">
                    Selected - {selectedDocuments?.length}/{documents.length}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={deleteDocumentLoader}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMultipleDocuments();
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
                    Total - {documents.length}
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
                {filterSortedDocuments.length > 0 ? (
                  filterSortedDocuments.map((document, index) => (
                    <DocumentItem
                      key={index}
                      auth={auth}
                      document={document}
                      handleOpenDocumentDeleteDialog={
                        handleOpenDocumentDeleteDialog
                      }
                      handleProcessDocument={handleProcessDocument}
                      handleDocFileDownload={handleDocFileDownload}
                      documentToProcess={documentToProcess}
                      vectorstoreConversionInProgress={
                        vectorstoreConversionInProgress
                      }
                      handleShowDocument={handleShowDocument}
                      handleOpenMetadataDialog={handleOpenMetadataDialog}
                      handleDocumentSelection={handleDocumentSelection}
                      deleteDocumentLoader={deleteDocumentLoader}
                      selectedDocuments={selectedDocuments}
                      setIsDocDisplayOpen={setIsDocDisplayOpen}
                      setNotificationContent={setNotificationContent}
                      setNotificationReturnMessage={
                        setNotificationReturnMessage
                      }
                      handleOpenPermissionConfirmDialog={
                        handleOpenPermissionConfirmDialog
                      }
                      setSelectedDocument={setSelectedDocument}
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
                    No matching documents found.
                  </div>
                )}
              </div>
            </div>
            <Tooltip
              title="Upload New Document"
              aria-label="Upload New Document"
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
                  handleOpenUploadDocumentForm();
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
                  Upload Documents for Your Project
                </Typography>
                <Typography style={{ marginBottom: "30px" }} variant="body2">
                  You haven't uploaded any documents for this project yet.
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
                    handleOpenUploadDocumentForm();
                  }}
                >
                  <Typography variant="body2">Upload Documents</Typography>
                </button>
              </div>
              <img
                src="/images/docUploadBackground.png"
                alt="Document Gallery"
                style={{ maxWidth: "100%", maxHeight: "80%" }}
              />
            </div>
          </div>
        )}
      </Box>
    </>
  );
};

export default Documents;
