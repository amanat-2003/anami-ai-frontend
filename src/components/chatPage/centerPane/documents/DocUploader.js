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
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
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

export default function DocUploader(props) {
  const {
    user,
    asset,
    onClose,
    documents,
    setDocuments,
    handleLogout,
    openUploadDocumentForm,
  } = props;

  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [documentInProgress, setDocumentInProgress] = useState("");
  const [processedDocuments, setProcessedDocuments] = useState([]);

  // Sort the selected documents by name
  const sortedDocuments = selectedDocuments
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const isDuplicate = (file) => {
    return selectedDocuments.some(
      (selectedFile) => selectedFile.name === file.name
    );
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    // Create a set for efficient lookup of selected file names
    const selectedFileNames = new Set(
      selectedDocuments.map((file) => file.name)
    );

    // Allowed file types and size limit
    const allowedTypes = new Set([
      // "text/csv",
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ]);
    const maxFileSize = 100 * 1024 * 1024; // 100MB

    // Filter files: remove duplicates, check type and size
    const uniqueFiles = Array.from(files).filter(
      (file) => !selectedFileNames.has(file.name)
    );
    const allowedFiles = [];
    const rejectedFiles = [];

    uniqueFiles.forEach((file) => {
      if (file.size <= maxFileSize && allowedTypes.has(file.type)) {
        allowedFiles.push(file);
      } else {
        rejectedFiles.push(file);
      }
    });

    // Check if the total number of selected files does not exceed 10
    if (selectedDocuments.length + uniqueFiles.length > 10) {
      toast.error("You can only upload a maximum of 10 files.");
      return;
    }

    // Update the selected documents
    setSelectedDocuments((prevFiles) => [...prevFiles, ...allowedFiles]);

    if (rejectedFiles.length > 0) {
      toast.error(
        `The following files are not supported or exceed the 100MB limit:\n\n${rejectedFiles
          .map((file) => file.name)
          .join("\n")}`
      );
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const uniqueFiles = files.filter((file) => !isDuplicate(file));
    setSelectedDocuments([...selectedDocuments, ...uniqueFiles]);
    setDragging(false);
  };

  const handleRemoveDocument = (fileToRemove) => {
    const updatedFiles = selectedDocuments.filter(
      (file) => file !== fileToRemove
    );
    setSelectedDocuments(updatedFiles);

    // Clear the file input value to allow re-selection of the removed file
    fileInputRef.current.value = "";
  };

  const handleDragAndDropClick = () => {
    fileInputRef.current.click();
  };

  const resetUploader = () => {
    setSelectedDocuments([]);
    setDragging(false);
    fileInputRef.current.value = "";
    setUploading(false);
  };

  const handleDocumentUpload = async () => {
    try {
      if (selectedDocuments.length === 0) {
        toast.error("No documents selected for upload");
      }
      setUploading(true);

      const updatedDocuments = [...documents];

      for (const file of selectedDocuments) {
        setDocumentInProgress(file);
        const documentData = new FormData();
        documentData.append("userId", user._id);
        documentData.append("assetId", asset._id);
        documentData.append("document", file);

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/document/upload-document`,
            documentData
          );

          if (response.status === 201) {
            const newDocument = response.data.document;

            setProcessedDocuments((prevDocuments) => [
              ...prevDocuments,
              newDocument,
            ]);

            // Update state and localStorage for each document
            updatedDocuments.push(newDocument);

            setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
            // localStorage.setItem(
            //   "allDocuments",
            //   JSON.stringify(updatedDocuments)
            // );
            toast.success("Document uploaded: " + newDocument.fileName);
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
            toast.error(
              "An unexpected error occurred. Please try again later."
            );
          }
          console.error(error);
        } finally {
          setDocumentInProgress("");
        }
      }
      // Sort documents
      const sortedDocuments = updatedDocuments.sort((a, b) =>
        a.fileName.localeCompare(b.fileName)
      );
      setDocuments(sortedDocuments);
      // localStorage.setItem("allDocuments", JSON.stringify(sortedDocuments));
      resetUploader();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getTotalDocumentsSize = () => {
    return selectedDocuments.reduce(
      (totalSize, file) => totalSize + file.size,
      0
    );
  };

  return (
    <Dialog
      open={openUploadDocumentForm}
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
        Upload files for {asset.name}
      </DialogTitle>
      <DialogContent style={{ paddingTop: "5px", width: "100%" }}>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <div
              onClick={handleDragAndDropClick}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              style={{
                border: `1px dashed ${dragging ? "#dd2025" : "#909090"}`,
                color: "#909090",
                cursor: "pointer",
                // width: `calc(100%) - 50px`,
                minWidth: "150px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "150px",
              }}
            >
              {dragging ? (
                <Typography style={{ fontWeight: "500" }}>
                  Drop files here
                </Typography>
              ) : (
                <div
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileUploadOutlinedIcon
                    style={{ fontSize: "40px", marginBottom: "10px" }}
                  />
                  Click or drag and drop files here
                </div>
              )}
            </div>
            <input
              accept=".pdf, .docx, .pptx, .txt"
              style={{ display: "none" }}
              id="file-input"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
            />
            <Grid item xs={12} mt={2}>
              <input
                accept=".pdf, .docx, .pptx, .txt"
                style={{ display: "none" }}
                id="file-input"
                type="file"
                onChange={handleFileChange}
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
                  Select Files
                </Button>
              </label>
            </Grid>
          </Grid>
          <Box
            mt={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography variant="subtitle2">
              Total file size:{" "}
              {(getTotalDocumentsSize() / 1024 / 1024).toFixed(2)}MB
            </Typography>
            <Typography variant="subtitle2" style={{ margin: "5px 0 0 0" }}>
              {`Selected files: ${selectedDocuments.length}/10`}
            </Typography>
          </Box>
          <Grid item xs={12}>
            <Box
              style={{
                maxHeight: "145px",
                overflow: "auto",
              }}
            >
              {selectedDocuments.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                    overflow: "auto",
                  }}
                >
                  {sortedDocuments.map((file, index) => {
                    const isDocumentProcessed = processedDocuments.some(
                      (item) => item.fileName === file.name
                    );
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "7px",
                          borderRadius: "50px",
                          padding: "3px 5px 3px 13px",
                          backgroundColor: "#EEE",
                          maxWidth: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "11px",
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          ({(file.size / 1024 / 1024).toFixed(2)}
                          MB)
                        </Typography>
                        {/* Actions */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {isDocumentProcessed ? (
                            <CheckCircleRoundedIcon
                              sx={{
                                fontSize: "22px",
                                color: "#4D2",
                                padding: "0px",
                                margin: "0px",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <>
                              {file.name === documentInProgress?.name ? (
                                <CircularProgress
                                  sx={{ color: "#4D2" }}
                                  size={15}
                                  thickness={4}
                                />
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "7px",
                                  }}
                                >
                                  <Tooltip
                                    title="Remove"
                                    arrow
                                    placement="bottom"
                                  >
                                    <span>
                                      <IconButton
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          fontSize: "22px",
                                          background: "transparent",
                                        }}
                                        disabled={uploading}
                                        onClick={() =>
                                          handleRemoveDocument(file)
                                        }
                                      >
                                        <CancelRoundedIcon
                                          sx={{
                                            fontSize: "22px",
                                            color: "#AAA",
                                            "&:hover": {
                                              color: "#888",
                                            },
                                            backgroundColor: "transparent",
                                            borderRadius: "50%",
                                          }}
                                          style={{ cursor: "pointer" }}
                                        />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Typography variant="subtitle1">No files selected</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
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
        {uploading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            {selectedDocuments.length > 0 && (
              <Button onClick={handleDocumentUpload} sx={{ color: "#0f8fa9" }}>
                Save
              </Button>
            )}
          </>
        )}
        <Button onClick={onClose} sx={{ color: "#dd2025" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
