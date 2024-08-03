import axios from "axios";
import { toast } from "react-hot-toast";
import Draggable from "react-draggable";
import React, { useState, useRef } from "react";

import {
  Box,
  Chip,
  Grid,
  Icon,
  Slide,
  Paper,
  Dialog,
  Button,
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

export default function PdfUploader(props) {
  const {
    user,
    onClose,
    handleLogout,
    selectedConversation,
    openUploadDocumentForm,
    setIsNewMessage,
  } = props;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  const isDuplicate = (file) => {
    return selectedFiles.some(
      (selectedFile) => selectedFile.name === file.name
    );
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    // Create an array to keep track of selected file names
    const selectedFileNames = selectedFiles.map((file) => file.name);

    // Filter out duplicate files by comparing file names
    const uniqueFiles = Array.from(files).filter((file) => {
      return !selectedFileNames.includes(file.name);
    });

    // Check if the total number of selected files does not exceed 10
    if (selectedFiles.length + uniqueFiles.length > 10) {
      toast.error("You can only upload a maximum of 10 files.");
      return;
    }

    // Check each file's type and size before adding it to the selectedFiles
    const allowedFiles = [];
    const rejectedFiles = [];

    for (const file of uniqueFiles) {
      // Check if the file is a PDF
      if (file.type === "application/pdf") {
        // Check if the file size is within the limit
        if (file.size <= 100 * 1024 * 1024) {
          allowedFiles.push(file);
        } else {
          rejectedFiles.push(file);
        }
      } else {
        rejectedFiles.push(file);
      }
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...allowedFiles]);

    if (rejectedFiles.length > 0) {
      toast.error(
        `The following files are not PDFs or exceed the 100MB limit:\n\n${rejectedFiles
          .map((file) => file.name)
          .join("\n")}`
      );
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const uniqueFiles = files.filter((file) => !isDuplicate(file));
    setSelectedFiles([...selectedFiles, ...uniqueFiles]);
    setDragging(false);
  };

  const handleRemoveFile = (fileToRemove) => {
    const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
    setSelectedFiles(updatedFiles);

    // Clear the file input value to allow re-selection of the removed file
    fileInputRef.current.value = "";
    // Clear the upload progress for the removed file
    const progress = { ...uploadProgress };
    delete progress[fileToRemove.name];
    setUploadProgress(progress);
  };

  const handleDragAndDropClick = () => {
    fileInputRef.current.click();
  };

  const resetUploader = () => {
    setSelectedFiles([]);
    setDragging(false);
    fileInputRef.current.value = "";
    setUploadProgress({});
    setUploading(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      setUploading(true);
      setIsNewMessage(true);
      const uploadPromises = selectedFiles.map((file) => {
        if (!uploadProgress[file.name] || uploadProgress[file.name] < 100) {
          // Upload the file if it's not uploaded completely
          const config = {
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const progress = Math.round((loaded * 100) / total);
              setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [file.name]: progress,
              }));
            },
          };

          const uploadFile = async () => {
            try {
              const formData = new FormData();
              formData.append("userId", user._id);
              formData.append("pdfFiles", file);
              formData.append("conversationId", selectedConversation._id);

              const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/conversation/share-docs`,
                formData,
                config
              );

              if (response.data.success) {
                // Mark the file as uploaded
                setUploadProgress((prevProgress) => ({
                  ...prevProgress,
                  [file.name]: 100,
                }));
                onClose();
              } else {
                toast.error(response.data.message);
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
            }
          };

          return uploadFile();
        } else {
          return Promise.resolve();
        }
      });

      Promise.all(uploadPromises)
        .then(() => {
          // All files have been uploaded, call the success handler
          // handleDocumentUploadSuccess();
          toast.success("Documents Shared");
          resetUploader();
        })
        .catch((error) => {
          console.error(error);
          // Handle any errors here
        });
    } else {
      toast.error("No files selected for upload");
    }
  };

  const getTotalFileSize = () => {
    return selectedFiles.reduce((totalSize, file) => totalSize + file.size, 0);
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
        Upload files for sharing
      </DialogTitle>
      <DialogContent style={{ paddingTop: "5px" }}>
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
                  Drop PDF files here
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
                  Click or drag and drop PDF files here
                </div>
              )}
            </div>
            <input
              accept="application/pdf"
              style={{ display: "none" }}
              id="file-input"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
            />
            <Grid item xs={12} mt={2}>
              <input
                accept="application/pdf"
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
              Total file size: {(getTotalFileSize() / 1024 / 1024).toFixed(2)}MB
            </Typography>
            <Typography variant="subtitle2" style={{ margin: "5px 0 0 0" }}>
              {`Selected files: ${selectedFiles.length}/10`}
            </Typography>
          </Box>
          <Grid item xs={12}>
            <Box
              style={{
                maxHeight: "145px",
                overflowY: "auto",
              }}
            >
              {selectedFiles.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                  }}
                >
                  {selectedFiles
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((file, index) => (
                      <div key={index}>
                        <Chip
                          label={`${file.name} (${(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)}MB)`}
                          onDelete={() => handleRemoveFile(file)}
                          style={{
                            // backgroundColor: "#0f8fa9",
                            color: "#000",
                            maxWidth: "500px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          variant="filled"
                          deleteIcon={
                            <Icon
                              style={{
                                fontSize: "24px",
                                padding: "0 10px 0 10px",
                                margin: "0 6px 0 -6px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "transparent",
                                borderRadius: "50%",
                              }}
                            >
                              {uploadProgress[file.name] !== undefined ? (
                                uploadProgress[file.name] < 100 ? (
                                  <div>
                                    <CircularProgress
                                      variant="determinate"
                                      value={uploadProgress[file.name]}
                                      size={22}
                                    >
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        {uploadProgress[file.name]}%
                                      </Typography>
                                    </CircularProgress>
                                  </div>
                                ) : (
                                  <CheckCircleRoundedIcon
                                    sx={{
                                      fontSize: "24px",
                                      color: "#6D6",
                                      padding: "0px",
                                      margin: "0px",
                                      borderRadius: "50%",
                                    }}
                                  />
                                )
                              ) : (
                                <CancelRoundedIcon
                                  sx={{
                                    fontSize: "24px",
                                    color: "#AAA",
                                    "&:hover": {
                                      color: "#777",
                                    },
                                    backgroundColor: "transparent",
                                    borderRadius: "50%",
                                  }}
                                />
                              )}
                            </Icon>
                          }
                        />
                      </div>
                    ))}
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
            {selectedFiles.length > 0 && (
              <Button onClick={handleUpload} sx={{ color: "#0f8fa9" }}>
                Upload
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
