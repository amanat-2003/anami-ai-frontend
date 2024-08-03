import React, { useState, useRef, useMemo } from "react";

import {
  Box,
  Grid,
  Fade,
  Menu,
  Paper,
  Select,
  Dialog,
  MenuItem,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  FormControl,
  DialogTitle,
  ListItemIcon,
  DialogActions,
  DialogContent,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Draggable from "react-draggable";
import ReactPlayer from "react-player";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ArtTrackRoundedIcon from "@mui/icons-material/ArtTrackRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

function PaperComponent(props) {
  const paperRef = useRef(null);

  return (
    <Draggable
      handle={[".draggable-dialog"]}
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper {...props} ref={paperRef} />
    </Draggable>
  );
}

const VideoItem = ({
  video,
  handleOpenVideoInNewTab,
  handleFileDownload,
  handleAddExistingVideo,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [videoDisplay, setVideoDisplay] = useState(false);

  const handleOpenDialog = () => {
    setVideoDisplay(true);
  };

  const handleCloseDialog = () => {
    setVideoDisplay(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const videoSrc = useMemo(
    () => `${video.filePath}`,
    // () => `${video.signedUrl}`,
    [video]
  );

  const dialogTitleStyle = {
    padding: "0",
    cursor: "move",
  };

  const dialogContentStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    padding: "0px",
    borderRadius: "0px 0px 5px 5px",
  };

  const dialogVideoTitleStyle = {
    fontSize: "15px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const videoContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: "5px",
    backgroundColor: "#e9f1f8",
    position: "relative",
    overflow: "hidden",
    height: "140px",
    borderRadius: "5px 5px 7px 7px",
    border: "2px solid #e9f1f8",
  };

  const videoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "3px",
    cursor: "pointer",
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
        open={videoDisplay}
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
        <DialogTitle style={dialogTitleStyle} className="draggable-dialog">
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
                handleOpenVideoInNewTab(video);
              }}
              disabled
            >
              <OpenInNewRoundedIcon style={{ color: "transparent" }} />
            </IconButton>
            <div style={dialogVideoTitleStyle}>{video.fileName}</div>
            <IconButton
              onClick={() => {
                handleCloseDialog();
              }}
            >
              <CloseOutlinedIcon style={{ color: "#0f8fa9" }} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={dialogContentStyle} className="draggable-dialog">
          <ReactPlayer
            url={videoSrc}
            controls={true}
            height={"auto"}
            width={"100%"}
            stopOnUnmount
          />
          <Box
            sx={{
              display: "flex",
              position: "relative",
              width: "100%",
              padding: "7px 20px 0px 25px",
            }}
          >
            <Typography
              variant="subtitle2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "18px",
                marginBottom: "5px",
              }}
            >
              Transcription
            </Typography>
          </Box>
          <Box style={{ padding: "0px 25px 0px 25px" }}>
            <Box
              sx={{
                width: "100%",
                overflow: "auto",
                maxHeight: "127px",
              }}
            >
              {video.transcription ? (
                <div
                  style={{
                    fontSize: "13px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {video?.transcription}
                </div>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    gap: "5px",
                    flexDirection: "column",
                    color: "grey",
                  }}
                >
                  No transcription
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "move",
            padding: "12px",
          }}
          className="draggable-dialog"
        ></DialogActions>
      </Dialog>
      <div style={videoContainerStyle}>
        <div style={{ height: "100px" }}>
          <video
            src={videoSrc}
            alt={video.fileName}
            loading="lazy"
            style={videoStyle}
            onClick={() => handleOpenDialog()}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0px 0px 0px 10px",
            height: "35px",
          }}
        >
          <div style={titleStyle} title={video.fileName}>
            {video.fileName}
          </div>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
          >
            <MoreVertOutlinedIcon style={{ color: "#000" }} />
          </IconButton>
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
        {/* <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleOpenVideoInNewTab(video);
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
        </MenuItem> */}
        {/* <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            // handleOpenVideoInNewTab(video);
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <PostAddRoundedIcon />
          </ListItemIcon>
          Generate Note
        </MenuItem> */}
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleFileDownload(video);
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
            handleAddExistingVideo({
              videofileName: video?.fileName,
              videofilePath: video.filePath,
            });
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <ArtTrackRoundedIcon />
          </ListItemIcon>
          Insert
        </MenuItem>
        {/* <Divider />
        <MenuItem>
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <InfoIcon />
          </ListItemIcon>
          About
        </MenuItem> */}
      </Menu>
    </div>
  );
};

const ImageItem = ({
  image,
  handleOpenImageInNewTab,
  handleFileDownload,
  handleAddExistingImage,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
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
    // () => `${image.signedUrl}`,
    [image]
  );

  const dialogTitleStyle = {
    padding: "0",
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
    height: "200px",
    borderRadius: "5px 5px 7px 7px",
    border: "2px solid #e9f1f8",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "3px",
    cursor: "pointer",
  };

  const titleStyle = {
    fontSize: "13px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <Dialog open={imageDisplay} onClose={handleCloseDialog}>
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
              disabled
            >
              {/* <OpenInNewRoundedIcon style={{ color: "#0f8fa9" }} /> */}
            </IconButton>
            <div style={dialogImageTitleStyle}>{image.fileName}</div>
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
      <div style={imageContainerStyle}>
        <div style={{ height: "160px" }}>
          <img
            src={imageSrc}
            alt={image.fileName}
            style={imageStyle}
            onClick={() => handleOpenDialog()}
            loading="lazy"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0px 0px 0px 10px",
            height: "35px",
          }}
        >
          <div style={titleStyle} title={image.fileName}>
            {image.fileName}
          </div>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
          >
            <MoreVertOutlinedIcon style={{ color: "#000" }} />
          </IconButton>
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
        {/* <MenuItem
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
        </MenuItem> */}
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleFileDownload(image);
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

            handleAddExistingImage({
              imagefileName: image.fileName,
              imagefilePath: image.filePath,
            });
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <ArtTrackRoundedIcon />
          </ListItemIcon>
          Insert
        </MenuItem>
        {/* 
        <MenuItem>
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <InfoIcon />
          </ListItemIcon>
          About
        </MenuItem> */}
      </Menu>
    </div>
  );
};

export default function NoteMediaList(props) {
  const {
    user,
    handleLogout,
    openComponent,
    images,
    videos,
    isImageMediaListOpen,
    handleCloseMediaList,
    handleAddExistingImage,
    handleAddExistingVideo,
    handleVideoFileDownload,
    handleImageFileDownload,
  } = props;

  const [filterText, setFilterText] = useState("");
  const [sortingItem, setSortingItem] = useState({
    key: "A-Z",
    text: "alphabetically",
  });
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

  let media;
  media = isImageMediaListOpen ? images : videos;
  const activeComponent = isImageMediaListOpen ? "Images" : "Videos";

  const sortedMedia = media?.sort((a, b) => {
    if (sortingItem.key === "Date added") {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortingItem.key === "A-Z") {
      return a.fileName.localeCompare(b.fileName);
    }
    return sortedMedia;
  });

  const filterSortedMedia = sortedMedia
    ? media?.filter((video) =>
        new RegExp(filterText, "i").test(video?.fileName)
      )
    : sortedMedia;

  const handleOpenVideoInNewTab = (video) => {
    window.open(`${video.filePath}`, "_blank");
  };

  return (
    <Box
      p={2}
      height={`calc(100vh)`}
      style={{
        marginTop: "0px",
        backgroundColor: "#fff",
        padding: "10px 20px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "50px",
          alignItems: "center",
          margin: "10px 10px",
        }}
      >
        <div style={{ position: "absolute", right: "20px" }}>
          <IconButton onClick={handleCloseMediaList}>
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
          {activeComponent}
        </div>
      </Box>
      <div
        style={{
          height: "50px",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "50px",
        }}
      >
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={filterText}
          style={{ borderRadius: "10px", width: "100%", marginLeft: "5px" }}
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
                sortingOptions.find((option) => option.key === e.target.value)
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
          marginTop: "10px",
          height: `calc(100% - 180px)`,
          overflow: "auto",
          paddingInline: "5px",
        }}
      >
        <Grid container spacing={0}>
          {media?.length > 0 ? (
            filterSortedMedia.length > 0 ? (
              filterSortedMedia.map((media, index) => (
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4} key={index}>
                  {activeComponent === "Videos" && (
                    <VideoItem
                      user={user}
                      video={media}
                      handleLogout={handleLogout}
                      openComponent={openComponent}
                      handleOpenVideoInNewTab={handleOpenVideoInNewTab}
                      handleFileDownload={handleVideoFileDownload}
                      handleAddExistingVideo={handleAddExistingVideo}
                    />
                  )}
                  {activeComponent === "Images" && (
                    <ImageItem
                      image={media}
                      handleOpenVideoInNewTab={handleOpenVideoInNewTab}
                      handleFileDownload={handleImageFileDownload}
                      handleAddExistingImage={handleAddExistingImage}
                    />
                  )}
                </Grid>
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
                No matching {activeComponent} found.
              </div>
            )
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
              You don't have any {activeComponent}..
            </div>
          )}
        </Grid>
      </div>
    </Box>
  );
}
