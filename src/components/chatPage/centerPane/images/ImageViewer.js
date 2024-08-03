import React, { useMemo, useRef, useState } from "react";
import {
  Fab,
  Box,
  Grid,
  Fade,
  Menu,
  Select,
  Dialog,
  Tooltip,
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  DialogTitle,
  ListItemIcon,
  DialogContent,
  InputAdornment,
  Typography,
  Checkbox,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MediaMetadataDialog from "../MediaMetadataDialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Draggable from "react-draggable";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
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

const ImageItem = ({
  image,
  handleOpenImageInNewTab,
  handleImageFileDownload,
  handleOpenImageDeleteDialog,
  handleOpenMetadataDialog,
  handleImageSelection,
  selectedExistingImages,
  deleteImageLoader,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageDisplay, setImageDisplay] = useState(false);

  const handleOpenDialog = () => {
    setImageDisplay(true);
  };

  const handleCloseDialog = () => {
    setImageDisplay(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const imageSrc = useMemo(
    () => `${image.filePath}`,
    // () => `${process.env.REACT_APP_API}/${image.filePath}`,
    [image]
  );

  const dialogTitleStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: `calc(50px)`,
    backgroundColor: "#e7f5f6",
    padding: "0px",
    cursor: "move",
  };

  const dialogContentStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#e9f1f8",
    position: "relative",
    padding: "0",
    borderRadius: "0px",
  };

  const dialogImageTitleStyle = {
    fontSize: "15px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "calc(100% - 100px)",
  };

  const dialogImageStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0px",
    objectFit: "contain",
  };

  const imageContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: "5px",
    backgroundColor: "#e9f1f8",
    position: "relative",
    overflow: "hidden",
    height: "208px",
    borderRadius: "5px 5px 7px 7px",
    border: "5px solid #e9f1f8",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "3px",
    border: selectedExistingImages.includes(image) ? "1px solid #55F" : "",
  };

  const titleStyle = {
    fontSize: "13px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <Dialog
        open={imageDisplay}
        onClose={handleCloseDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog"
        TransitionComponent={Transition}
        TransitionProps={{
          timeout: {
            enter: 500,
            exit: 200,
          },
        }}
      >
        <DialogTitle style={dialogTitleStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              height: `calc(50px)`,
              backgroundColor: "#e7f5f6",
              padding: "5px 10px",
            }}
          >
            <IconButton
              onClick={() => {
                handleOpenImageInNewTab(image);
              }}
            >
              <OpenInNewRoundedIcon style={{ color: "#0f8fa9" }} />
            </IconButton>
            <div
              style={dialogImageTitleStyle}
              className="draggable-dialog"
              title={image.fileName}
            >
              {image.fileName}
            </div>
            <IconButton
              onClick={() => {
                handleCloseDialog();
              }}
            >
              <CloseOutlinedIcon style={{ color: "#0f8fa9" }} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={dialogContentStyle}>
          <img
            src={imageSrc}
            alt={image.fileName}
            style={dialogImageStyle}
            loading="lazy"
          />
        </DialogContent>
      </Dialog>
      <div
        style={imageContainerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{ height: "160px", cursor: "pointer" }}
          onClick={() => {
            if (!deleteImageLoader) {
              handleOpenDialog();
            }
          }}
        >
          <img
            src={imageSrc}
            alt={image.fileName}
            style={imageStyle}
            loading="lazy"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {(isHovered || selectedExistingImages?.length > 0) && (
            <Checkbox
              color="primary"
              size="small"
              style={{
                cursor: "default",
                padding: "2px 2px 2px 2px",
                borderRadius: "2px",
                position: "absolute",
                left: "-4px",
                top: "-4px",
                zIndex: 2,
                background: "#e9f1f8",
              }}
              checked={selectedExistingImages.includes(image)}
              onClick={(e) => {
                e.stopPropagation();
                handleImageSelection(image);
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "35px",
              width: "100%",
            }}
          >
            <div
              style={{
                ...titleStyle,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "calc(100%)",
                paddingLeft: "10px",
              }}
              title={image.fileName}
            >
              {image.fileName}
            </div>
            <IconButton
              size="small"
              style={{ cursor: "default", fontSize: "calc(50px)" }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
            >
              <MoreVertOutlinedIcon style={{ color: "#000" }} />
            </IconButton>
          </div>
        </div>
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
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleOpenImageInNewTab(image);
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <OpenInNewRoundedIcon />
          </ListItemIcon>
          Open in new tab
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleImageFileDownload(image);
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
            handleOpenImageDeleteDialog(image);
          }}
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
            handleOpenMetadataDialog(image);
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

const Images = ({
  images,
  openComponent,
  handleOpenImageInNewTab,
  handleImageFileDownload,
  handleOpenImageDeleteDialog,
  handleOpenUploadImageForm,
  selectedExistingImages,
  setSelectedExistingImages,
  deleteImageLoader,
  handleDeleteMultipleImages,
}) => {
  const [filterText, setFilterText] = useState("");
  const [isMetadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState({});
  const [sortingItem, setSortingItem] = useState({
    key: "A-Z",
    text: "alphabetically",
  });

  const handleOpenMetadataDialog = (media) => {
    setSelectedMedia(media);
    setMetadataDialogOpen(true);
  };

  const handleCloseMetadataDialog = () => {
    setMetadataDialogOpen(false);
  };

  const handleImageSelection = (image) => {
    const index = selectedExistingImages.findIndex(
      (img) => img?._id === image._id
    );

    if (index !== -1) {
      setSelectedExistingImages((prevSelectedImages) =>
        prevSelectedImages.filter((img) => img._id !== image._id)
      );
    } else {
      setSelectedExistingImages((prevSelectedImages) => [
        ...prevSelectedImages,
        image,
      ]);
    }
  };

  const handleSelectAllImages = () => {
    if (selectedExistingImages.length === images.length) {
      setSelectedExistingImages([]);
    } else {
      setSelectedExistingImages(images);
    }
  };

  const sortingOptions = [
    {
      key: "A-Z",
      text: "alphabetically",
    },
    {
      key: "Date added",
      text: "uploadDate",
    },
  ];

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const sortedImages = images?.sort((a, b) => {
    if (sortingItem.key === "Date added") {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortingItem.key === "A-Z") {
      return a.fileName.localeCompare(b.fileName);
    }
    return sortedImages;
  });

  const filterSortedImages = sortedImages
    ? images?.filter((image) =>
        new RegExp(filterText, "i").test(image?.fileName)
      )
    : sortedImages;

  return (
    <>
      {isMetadataDialogOpen && (
        <MediaMetadataDialog
          isOpen={isMetadataDialogOpen}
          onClose={handleCloseMetadataDialog}
          media={selectedMedia}
        />
      )}
      <Box
        height={`calc(100vh)`}
        style={{
          marginTop: "0px",
          backgroundColor: "#fff",
          padding: "25px",
          position: "relative",
        }}
      >
        {images?.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                height: "50px",
                alignItems: "center",
                margin: "10px 10px",
                padding: "",
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
                Images
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
              {selectedExistingImages?.length > 0 ? (
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
                    checked={selectedExistingImages.length === images.length}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAllImages();
                    }}
                  />
                  <Typography sx={{ padding: "0 15px 0 5px" }} variant="body2">
                    Selected - {selectedExistingImages?.length}/{images.length}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={deleteImageLoader}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMultipleImages();
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
                    Total - {images.length}
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
              }}
            >
              <Grid container spacing={0}>
                {filterSortedImages.length > 0 ? (
                  filterSortedImages.map((image, index) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} xl={2.4} key={index}>
                      <ImageItem
                        image={image}
                        handleOpenImageInNewTab={handleOpenImageInNewTab}
                        handleImageFileDownload={handleImageFileDownload}
                        handleOpenImageDeleteDialog={
                          handleOpenImageDeleteDialog
                        }
                        handleOpenMetadataDialog={handleOpenMetadataDialog}
                        handleImageSelection={handleImageSelection}
                        selectedExistingImages={selectedExistingImages}
                        deleteImageLoader={deleteImageLoader}
                      />
                    </Grid>
                  ))
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      height: "60vh",
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
                    No matching images found.
                  </div>
                )}
              </Grid>
            </div>
            <Tooltip
              title="Upload New Image"
              aria-label="Upload New Image"
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
                  handleOpenUploadImageForm();
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
                  Upload Images for Your Project
                </Typography>
                <Typography style={{ marginBottom: "30px" }} variant="body2">
                  You haven't uploaded any images for this project yet.
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
                    handleOpenUploadImageForm();
                  }}
                >
                  <Typography variant="body2">Upload Images</Typography>
                </button>
              </div>
              <img
                src="/images/imageUploadBackground.jpg"
                alt="Gallery"
                style={{ maxWidth: "100%", maxHeight: "80%" }}
              />
            </div>
          </div>
        )}
      </Box>
    </>
  );
};

export default Images;
