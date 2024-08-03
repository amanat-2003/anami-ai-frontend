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
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
// import ClosedCaptionRoundedIcon from "@mui/icons-material/ClosedCaptionRounded";
// import ClosedCaptionDisabledRoundedIcon from "@mui/icons-material/ClosedCaptionDisabledRounded";

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

export default function VideoUploader(props) {
  const {
    user,
    asset,
    onClose,
    videos,
    setVideos,
    handleLogout,
    selectedVideos,
    videoFileInputRef,
    setSelectedVideos,
    openUploadVideoForm,
  } = props;

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoInProgress, setVideoInProgress] = useState("");
  const [processedVideos, setProcessedVideos] = useState([]);

  // Sort the selected videos by name
  const sortedVideos = selectedVideos
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const isDuplicate = (video) => {
    return selectedVideos.some(
      (selectedVideo) => selectedVideo.name === video.name
    );
  };

  // Handle Videos
  const handleVideoChange = (event) => {
    const files = event.target.files;
    const selectedFileNames = selectedVideos.map((file) => file.name);

    // Filter out duplicate files by comparing file names
    const uniqueFiles = Array.from(files).filter((file) => {
      return !selectedFileNames.includes(file.name);
    });

    // Check if the total number of selected files does not exceed 5
    if (selectedVideos.length + uniqueFiles.length > 10) {
      toast.error("You can only upload a maximum of 10 videos at a time.");
      return;
    }

    // Check each file's type and size before adding it to the selectedVideos
    const allowedFiles = [];
    const rejectedFiles = [];

    const checkFile = (file) => {
      return new Promise((resolve) => {
        // Check if the file is a mp4
        if (file.type === "video/mp4") {
          // Check if the file size is within the limit
          if (file.size <= 1 * 1024 * 1024 * 1024) {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
              window.URL.revokeObjectURL(video.src);
              const duration = video.duration;

              if (duration <= 2 * 60 * 60) {
                resolve({ allowed: true, file });
              } else {
                resolve({ allowed: false, file });
              }
            };

            video.onerror = () => {
              resolve({ allowed: false, file });
            };

            video.src = URL.createObjectURL(file);
          } else {
            resolve({ allowed: false, file });
          }
        } else {
          resolve({ allowed: false, file });
        }
      });
    };

    const checkFiles = async () => {
      for (const file of uniqueFiles) {
        const result = await checkFile(file);
        if (result.allowed) {
          allowedFiles.push(result.file);
        } else {
          rejectedFiles.push(result.file);
        }
      }

      setSelectedVideos((prevFiles) => [...prevFiles, ...allowedFiles]);

      if (rejectedFiles.length > 0) {
        toast.error(
          `The following files are not MP4 videos, exceed the 1GB limit, or exceed the 2-hour limit:\n\n${rejectedFiles
            .map((file) => file.name)
            .join("\n")}`
        );
      }
    };

    checkFiles();
  };

  const handleRemoveVideo = (fileToRemove) => {
    const updateSelectedFiles = selectedVideos.filter(
      (file) => file !== fileToRemove
    );
    setSelectedVideos(updateSelectedFiles);
    // Clear the file input value to allow re-selection of the removed file
    videoFileInputRef.current.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const uniqueFiles = files.filter((file) => !isDuplicate(file));
    setSelectedVideos([...selectedVideos, ...uniqueFiles]);
    setDragging(false);
  };

  const handleDragAndDropClick = () => {
    videoFileInputRef.current.click();
  };

  const resetUploader = () => {
    setSelectedVideos([]);
    setDragging(false);
    videoFileInputRef.current.value = "";
    setUploading(false);
  };

  const handleVideoUpload = async () => {
    try {
      if (selectedVideos.length === 0) {
        toast.error("No videos selected for upload");
      }
      setUploading(true);

      const updatedVideos = [...videos];

      for (const file of selectedVideos) {
        setVideoInProgress(file);
        const videoData = new FormData();
        videoData.append("userId", user._id);
        videoData.append("assetId", asset._id);
        videoData.append("video", file);

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/media/upload-video`,
            videoData
          );

          if (response.status === 201) {
            const newVideo = response.data.video;

            setProcessedVideos((prevVideos) => [...prevVideos, newVideo]);

            // Update state and localStorage for each video
            updatedVideos.push(newVideo);

            setVideos((prevVideos) => [...prevVideos, newVideo]);
            // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));
            toast.success("Video uploaded: " + newVideo.fileName);
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
          setVideoInProgress("");
        }
      }
      // Sort videos
      const sortedVideos = updatedVideos.sort((a, b) =>
        a.fileName.localeCompare(b.fileName)
      );
      setVideos(sortedVideos);
      // localStorage.setItem("allVideos", JSON.stringify(sortedVideos));
      resetUploader();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getTotalVideosSize = () => {
    return selectedVideos.reduce((totalSize, file) => totalSize + file.size, 0);
  };

  return (
    <Dialog
      open={openUploadVideoForm}
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
        Upload videos for {asset.name}
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
                  Drop Video files here
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
                  Click or drag and drop video files here
                </div>
              )}
            </div>
            <input
              accept=".mp4"
              style={{ display: "none" }}
              id="video-input"
              type="file"
              ref={videoFileInputRef}
              onChange={handleVideoChange}
              multiple
            />
            <Grid item xs={12} mt={2}>
              <input
                accept=".mp4"
                style={{ display: "none" }}
                id="video-input"
                type="file"
                ref={videoFileInputRef}
                onChange={handleVideoChange}
                multiple
              />
              <label htmlFor="video-input">
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
                  Select Videos
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
              Total size: {(getTotalVideosSize() / 1024 / 1024).toFixed(2)}MB
            </Typography>
            <Typography variant="subtitle2" style={{ margin: "5px 0 0 0" }}>
              {`Selected videos: ${selectedVideos.length}/10`}
            </Typography>
          </Box>
          <Grid item xs={12}>
            <Box
              style={{
                maxHeight: "145px",
                overflow: "auto",
              }}
            >
              {selectedVideos.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                    overflow: "auto",
                  }}
                >
                  {sortedVideos.map((file, index) => {
                    const isVideoProcessed = processedVideos.some(
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
                          {isVideoProcessed ? (
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
                              {file.name === videoInProgress?.name ? (
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
                                        onClick={() => handleRemoveVideo(file)}
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
                <Typography variant="subtitle1">No videos selected</Typography>
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
            {selectedVideos.length > 0 && (
              <Button onClick={handleVideoUpload} sx={{ color: "#0f8fa9" }}>
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
