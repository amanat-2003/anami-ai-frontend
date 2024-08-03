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

export default function ImageUploader(props) {
  const {
    user,
    asset,
    onClose,
    images,
    setImages,
    handleLogout,
    selectedImages,
    imageFileInputRef,
    setSelectedImages,
    openUploadImageForm,
  } = props;

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageInProgress, setImageInProgress] = useState("");
  const [processedImages, setProcessedImages] = useState([]);

  // Sort the selected images by name
  const sortedImages = selectedImages
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const isDuplicate = (image) => {
    return selectedImages.some(
      (selectedImage) => selectedImage.name === image.name
    );
  };

  // Handle Images
  const handleImageChange = (event) => {
    const files = event.target.files;
    const selectedFileNames = selectedImages.map((file) => file.name);

    // Filter out duplicate files by comparing file names
    const uniqueFiles = Array.from(files).filter((file) => {
      return !selectedFileNames.includes(file.name);
    });

    // Check if the total number of selected files does not exceed 10
    if (selectedImages.length + uniqueFiles.length > 10) {
      toast.error("You can only upload a maximum of 10 images at a time.");
      return;
    }

    // Check each file's type and size before adding it to the selectedImages
    const allowedFiles = [];
    const rejectedFiles = [];

    for (const file of uniqueFiles) {
      // Check if the file is a png or jpeg image
      if (file.type === "image/png" || file.type === "image/jpeg") {
        // Check if the file size is within the limit
        if (file.size <= 20 * 1024 * 1024) {
          allowedFiles.push(file);
        } else {
          rejectedFiles.push(file);
        }
      } else {
        rejectedFiles.push(file);
      }
    }

    setSelectedImages((prevFiles) => [...prevFiles, ...allowedFiles]);

    if (rejectedFiles.length > 0) {
      toast.error(
        `The following files are not PNG or JPEG images or exceed the 20MB limit:\n\n${rejectedFiles
          .map((file) => file.name)
          .join("\n")}`
      );
    }
  };

  const handleRemoveImage = (fileToRemove) => {
    const updateSelectedFiles = selectedImages.filter(
      (file) => file !== fileToRemove
    );
    setSelectedImages(updateSelectedFiles);
    // Clear the file input value to allow re-selection of the removed file
    imageFileInputRef.current.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const uniqueFiles = files.filter((file) => !isDuplicate(file));
    setSelectedImages([...selectedImages, ...uniqueFiles]);
    setDragging(false);
  };

  const handleDragAndDropClick = () => {
    imageFileInputRef.current.click();
  };

  const resetUploader = () => {
    setSelectedImages([]);
    setDragging(false);
    imageFileInputRef.current.value = "";
    setUploading(false);
  };

  const handleImageUpload = async () => {
    try {
      if (selectedImages.length === 0) {
        toast.error("No images selected for upload");
      }
      setUploading(true);

      const updatedImages = [...images];

      for (const file of selectedImages) {
        setImageInProgress(file);
        const imageData = new FormData();
        imageData.append("userId", user._id);
        imageData.append("assetId", asset._id);
        imageData.append("image", file);

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/media/upload-image`,
            imageData
          );

          if (response.status === 201) {
            const newImage = response.data.image;

            setProcessedImages((prevImages) => [...prevImages, newImage]);

            // Update state and localStorage for each image
            updatedImages.push(newImage);

            setImages((prevImages) => [...prevImages, newImage]);
            // localStorage.setItem(
            //   "allImages",
            //   JSON.stringify(updatedImages || {})
            // );
            toast.success("Image uploaded: " + newImage.fileName);
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
          setImageInProgress("");
        }
      }
      // Sort images
      const sortedImages = updatedImages.sort((a, b) =>
        a.fileName.localeCompare(b.fileName)
      );
      setImages(sortedImages);
      // localStorage.setItem("allImages", JSON.stringify(sortedImages));
      resetUploader();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getTotalImagesSize = () => {
    return selectedImages.reduce((totalSize, file) => totalSize + file.size, 0);
  };

  return (
    <Dialog
      open={openUploadImageForm}
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
        Upload images for {asset.name}
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
                  Drop Image files here
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
                  Click or drag and drop image files here
                </div>
              )}
            </div>
            <input
              accept=".png, .jpg, .jpeg"
              style={{ display: "none" }}
              id="image-input"
              type="file"
              ref={imageFileInputRef}
              onChange={handleImageChange}
              multiple
            />
            <Grid item xs={12} mt={2}>
              <input
                accept=".png, .jpg, .jpeg"
                style={{ display: "none" }}
                id="image-input"
                type="file"
                ref={imageFileInputRef}
                onChange={handleImageChange}
                multiple
              />
              <label htmlFor="image-input">
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
                  Select Images
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
              Total size: {(getTotalImagesSize() / 1024 / 1024).toFixed(2)}MB
            </Typography>
            <Typography variant="subtitle2" style={{ margin: "5px 0 0 0" }}>
              {`Selected images: ${selectedImages.length}/10`}
            </Typography>
          </Box>
          <Grid item xs={12}>
            <Box
              style={{
                maxHeight: "145px",
                overflow: "auto",
              }}
            >
              {selectedImages.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                    overflow: "auto",
                  }}
                >
                  {sortedImages.map((file, index) => {
                    const isImageProcessed = processedImages.some(
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
                          {isImageProcessed ? (
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
                              {file.name === imageInProgress?.name ? (
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
                                        onClick={() => handleRemoveImage(file)}
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
                <Typography variant="subtitle1">No images selected</Typography>
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
            {selectedImages.length > 0 && (
              <Button onClick={handleImageUpload} sx={{ color: "#0f8fa9" }}>
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
