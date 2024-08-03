import axios from "axios";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";
import React, { useMemo, useRef, useState } from "react";

import {
  Box,
  Fab,
  Fade,
  Grid,
  Menu,
  Paper,
  Select,
  Dialog,
  Tooltip,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  DialogTitle,
  FormControl,
  ListItemIcon,
  DialogContent,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
// import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import TranscriptionTabs from "./TranscriptionTabs.js";
import MediaMetadataDialog from "../MediaMetadataDialog";
import TranscriptionActions from "./TranscriptionActions.js";
import TranscriptionContent from "./TranscriptionContent.js";
import ModifyTranscriptDialog from "./ModifyTranscriptDialog.js";

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

const VideoItem = ({
  user,
  video,
  videos,
  setVideos,
  handleLogout,
  handleGenerateNote,
  handleOpenVideoInNewTab,
  handleVideoFileDownload,
  handleOpenVideoDeleteDialog,
  handleOpenMetadataDialog,
  handleVideoSelection,
  selectedExistingVideos,
  deleteVideoLoader,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTranscript, setSelectedTranscript] = useState(
    video.transcriptions[0]
  );
  const [videoDisplay, setVideoDisplay] = useState(false);
  const [isModifyTranscriptDialogOpen, setIsModifyTranscriptDialogOpen] =
    useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [transcriptionInProgress, setTranscriptionInProgress] = useState(false);
  const [
    transcriptionModificationInProgress,
    setTranscriptionModificationInProgress,
  ] = useState(false);

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

  const videoSrc = useMemo(() => `${video.filePath}`, [video]);

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
    position: "relative",
    padding: "0px",
    borderRadius: "0px 0px 5px 5px",
  };

  const dialogVideoTitleStyle = {
    fontSize: "15px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "calc(100% - 100px)",
  };

  const videoContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: "5px",
    backgroundColor: "#e9f1f8",
    position: "relative",
    overflow: "hidden",
    height: "148px",
    borderRadius: "5px 5px 7px 7px",
    border: "5px solid #e9f1f8",
  };

  const videoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "3px",
    border: selectedExistingVideos.includes(video) ? "1px solid #55F" : "",
  };

  const titleStyle = {
    fontSize: "13px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const prompts = [
    {
      key: 1,
      value: "Reform",
      prompt:
        "Reform the text to improve the grammar, sentence structure and easy to understand language, without changing the meaning of the original text.",
    },
    {
      key: 2,
      value: "Summarize",
      prompt:
        "Summarize the text in a easy to understand language with accurate information.",
    },
    {
      key: 3,
      value: "Make SOPs",
      prompt:
        "Use the text to make detailed Standard Operating Procedures with proper subheadings and explaination.",
    },
  ];

  const resetPromptFields = () => {
    setTextFieldValue("");
    setModifiedText("");
  };

  const handleOpenModificationDialog = () => {
    setIsModifyTranscriptDialogOpen(true);
  };

  const handleTranscriptDialogClose = () => {
    setIsModifyTranscriptDialogOpen(false);
    resetPromptFields();
  };

  const handleTranscribeVideo = async () => {
    try {
      setTranscriptionInProgress(true);
      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/transcribe-video`,
          {
            userId: user._id,
            videoId: video._id,
          }
        ),
        {
          loading: "Transcribing... Please Wait!",
          success: (response) => {
            const updatedVideo = response.data.video;
            const updatedVideos = videos.map((video) => {
              if (video._id === updatedVideo._id) {
                return updatedVideo;
              }
              return video;
            });

            // Sort videos
            updatedVideos.sort((a, b) => a.fileName.localeCompare(b.fileName));

            setVideos(updatedVideos);

            // Update localStorage
            // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));
            setTranscriptionInProgress(false);
            return response.data.message;
          },
          error: (error) => {
            setTranscriptionInProgress(false);
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const handleModifyTranscription = async (promptText) => {
    try {
      setTranscriptionModificationInProgress(true);
      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/modify-transcription`,
          {
            userId: user._id,
            videoId: video._id,
            text:
              modifiedText.trim().length > 0
                ? modifiedText
                : selectedTranscript.text,
            prompt: promptText || textFieldValue,
          }
        ),
        {
          loading: "Modifying... Please Wait!",
          success: (response) => {
            setModifiedText(response.data.answer[0].text);
            setTranscriptionModificationInProgress(false);
            return response.data.message;
          },
          error: (error) => {
            setTranscriptionModificationInProgress(false);
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const handleSaveNewTranscription = async () => {
    try {
      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/save-transcription`,
          {
            userId: user._id,
            videoId: video._id,
            transcription: modifiedText,
          }
        ),
        {
          loading: "Saving... Please Wait!",
          success: (response) => {
            if (response.status === 200) {
              const modifiedVideo = response.data.video;
              const updatedVideos = videos.map((vid) => {
                if (vid._id === video._id) {
                  return modifiedVideo;
                }
                return vid;
              });
              setVideos(updatedVideos);

              // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));

              handleTranscriptDialogClose();
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const handleReplaceTranscription = async (transcript) => {
    try {
      setTranscriptionModificationInProgress(true);
      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/replace-transcription`,
          {
            userId: user._id,
            videoId: video._id,
            transcriptionId: transcript._id,
            transcription: modifiedText,
          }
        ),
        {
          loading: "Saving... Please Wait!",
          success: (response) => {
            if (response.status === 200) {
              const modifiedVideo = response.data.video;
              const updatedVideos = videos.map((vid) => {
                if (vid._id === video._id) {
                  return modifiedVideo;
                }
                return vid;
              });
              setVideos(updatedVideos);

              // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));

              handleTranscriptDialogClose();
              setTranscriptionModificationInProgress(false);
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            setTranscriptionModificationInProgress(false);
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const handleRenameTranscription = async (name) => {
    try {
      setTranscriptionModificationInProgress(true);
      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/rename-transcription`,
          {
            userId: user._id,
            videoId: video._id,
            transcriptionLabel: name,
            transcriptionId: selectedTranscript._id,
          }
        ),
        {
          loading: "Renaming... Please Wait!",
          success: (response) => {
            if (response.status === 200) {
              const modifiedVideo = response.data.video;
              const updatedVideos = videos.map((vid) => {
                if (vid._id === video._id) {
                  return modifiedVideo;
                }
                return vid;
              });
              setVideos(updatedVideos);

              // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));

              handleTranscriptDialogClose();
              setTranscriptionModificationInProgress(false);
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            setTranscriptionModificationInProgress(false);
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const handleDeleteTranscription = async () => {
    try {
      if (selectedTranscript.isOriginal) {
        toast.error("Can't delete original transcription");
        return;
      }
      toast.promise(
        axios.delete(
          `${process.env.REACT_APP_API}/api/v1/media/delete-transcription`,
          {
            params: {
              userId: user._id,
              videoId: video._id,
              transcriptionId: selectedTranscript._id,
            },
          }
        ),
        {
          loading: "Deleting... Please Wait!",
          success: (response) => {
            setSelectedTab(0);
            setSelectedTranscript(video.transcriptions[0]);
            const updatedVideo = response.data.video;
            const updatedVideos = videos.map((video) => {
              if (video._id === updatedVideo._id) {
                return updatedVideo;
              }
              return video;
            });

            // Sort videos
            updatedVideos.sort((a, b) => a.fileName.localeCompare(b.fileName));

            setVideos(updatedVideos);

            // Update localStorage
            // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));
            return response.data.message;
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <ModifyTranscriptDialog
        prompts={prompts}
        modifiedText={modifiedText}
        textFieldValue={textFieldValue}
        transcription={video?.transcription}
        setTextFieldValue={setTextFieldValue}
        handleGenerateNote={handleGenerateNote}
        selectedTranscript={selectedTranscript}
        handleSaveNewTranscription={handleSaveNewTranscription}
        handleReplaceTranscription={handleReplaceTranscription}
        handleModifyTranscription={handleModifyTranscription}
        handleTranscriptDialogClose={handleTranscriptDialogClose}
        isModifyTranscriptDialogOpen={isModifyTranscriptDialogOpen}
        transcriptionModificationInProgress={
          transcriptionModificationInProgress
        }
      />
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
        maxWidth
      >
        <DialogTitle style={dialogTitleStyle}>
          <IconButton
            style={{ margin: "0px 5px" }}
            onClick={() => {
              handleOpenVideoInNewTab(video);
            }}
          >
            <OpenInNewRoundedIcon style={{ color: "#0f8fa9" }} />
          </IconButton>
          <div
            style={dialogVideoTitleStyle}
            className="draggable-dialog"
            title={video.fileName}
          >
            {video.fileName}
          </div>
          <IconButton
            style={{ margin: "0px 5px" }}
            onClick={() => {
              handleCloseDialog();
            }}
          >
            <CloseOutlinedIcon style={{ color: "#0f8fa9" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent style={dialogContentStyle}>
          <Grid container>
            <Grid item xs={12} lg={6}>
              <ReactPlayer
                url={video.filePath}
                controls
                height="auto"
                width="100%"
                stopOnUnmount
              />
            </Grid>
            <Grid
              item
              xs={12}
              lg={6}
              style={{
                maxHeight: "55vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {video?.transcriptions.length > 0 && (
                <TranscriptionTabs
                  video={video}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  setSelectedTranscript={setSelectedTranscript}
                  handleRenameTranscription={handleRenameTranscription}
                />
              )}
              <div
                style={{
                  padding: "0px 25px 10px 25px",
                  height:
                    video?.transcriptions.length > 0
                      ? "calc(100% - 60px)"
                      : "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {video?.transcriptions[selectedTab]?.text.length > 0 && (
                  <TranscriptionActions
                    video={video}
                    selectedTab={selectedTab}
                    handleGenerateNote={handleGenerateNote}
                    handleDeleteTranscription={handleDeleteTranscription}
                    handleOpenModificationDialog={handleOpenModificationDialog}
                  />
                )}
                <TranscriptionContent
                  video={video}
                  selectedTab={selectedTab}
                  handleTranscribeVideo={handleTranscribeVideo}
                  transcriptionInProgress={transcriptionInProgress}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <div
        style={videoContainerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* {video.processed ? (
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
        )} */}
        {(isHovered || selectedExistingVideos?.length > 0) && (
          <Checkbox
            color="primary"
            size="small"
            style={{
              cursor: "default",
              padding: "2px 2px 2px 2px",
              borderRadius: "2px",
              position: "absolute",
              left: "-3px",
              top: "-3px",
              zIndex: 2,
              background: "#e9f1f8",
            }}
            checked={selectedExistingVideos.includes(video)}
            onClick={(e) => {
              e.stopPropagation();
              handleVideoSelection(video);
            }}
          />
        )}
        <div
          style={{ height: "100px", cursor: "pointer" }}
          onClick={() => {
            if (!deleteVideoLoader) {
              handleOpenDialog();
            }
          }}
        >
          <video
            src={videoSrc}
            alt={video.fileName}
            loading="lazy"
            style={videoStyle}
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
              title={video.fileName}
            >
              {video.fileName}
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
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleGenerateNote(video?.transcription.trim());
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
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleVideoFileDownload(video);
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
            handleOpenVideoDeleteDialog(video);
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
            handleOpenMetadataDialog(video);
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

const Videos = ({
  user,
  videos,
  setVideos,
  handleLogout,
  openComponent,
  handleGenerateNote,
  handleOpenVideoInNewTab,
  handleVideoFileDownload,
  handleOpenUploadVideoForm,
  handleOpenVideoDeleteDialog,
  selectedExistingVideos,
  setSelectedExistingVideos,
  deleteVideoLoader,
  handleDeleteMultipleVideos,
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

  const handleVideoSelection = (video) => {
    const index = selectedExistingVideos.findIndex(
      (vid) => vid?._id === video._id
    );

    if (index !== -1) {
      setSelectedExistingVideos((prevSelectedVideos) =>
        prevSelectedVideos.filter((vid) => vid._id !== video._id)
      );
    } else {
      setSelectedExistingVideos((prevSelectedVideos) => [
        ...prevSelectedVideos,
        video,
      ]);
    }
  };

  const handleSelectAllvideos = () => {
    if (selectedExistingVideos.length === videos.length) {
      setSelectedExistingVideos([]);
    } else {
      setSelectedExistingVideos(videos);
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

  const sortedVideos = videos?.sort((a, b) => {
    if (sortingItem.key === "Date added") {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortingItem.key === "A-Z") {
      return a.fileName.localeCompare(b.fileName);
    }
    return sortedVideos;
  });

  const filterSortedVideos = sortedVideos
    ? videos?.filter((video) =>
        new RegExp(filterText, "i").test(video?.fileName)
      )
    : sortedVideos;

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
        {videos?.length > 0 ? (
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
                Videos
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
              {selectedExistingVideos?.length > 0 ? (
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
                    checked={selectedExistingVideos.length === videos.length}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAllvideos();
                    }}
                  />
                  <Typography sx={{ padding: "0 15px 0 5px" }} variant="body2">
                    Selected - {selectedExistingVideos?.length}/{videos.length}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={deleteVideoLoader}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMultipleVideos();
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
                    Total - {videos.length}
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
                {filterSortedVideos.length > 0 ? (
                  filterSortedVideos.map((video, index) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} xl={2.4} key={index}>
                      <VideoItem
                        user={user}
                        video={video}
                        videos={videos}
                        setVideos={setVideos}
                        handleLogout={handleLogout}
                        handleGenerateNote={handleGenerateNote}
                        handleOpenVideoInNewTab={handleOpenVideoInNewTab}
                        handleVideoFileDownload={handleVideoFileDownload}
                        handleOpenVideoDeleteDialog={
                          handleOpenVideoDeleteDialog
                        }
                        handleOpenMetadataDialog={handleOpenMetadataDialog}
                        handleVideoSelection={handleVideoSelection}
                        selectedExistingVideos={selectedExistingVideos}
                        deleteVideoLoader={deleteVideoLoader}
                      />
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
                    No matching videos found.
                  </div>
                )}
              </Grid>
            </div>
            <Tooltip
              title="Upload New Video"
              aria-label="Upload New Video"
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
                  handleOpenUploadVideoForm();
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
                  Upload Videos for Your Project
                </Typography>
                <Typography style={{ marginBottom: "30px" }} variant="body2">
                  You haven't uploaded any videos for this project yet.
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
                    handleOpenUploadVideoForm();
                  }}
                >
                  <Typography variant="body2">Upload Videos</Typography>
                </button>
              </div>
              <img
                src="/images/videoUploadBackground.jpg"
                alt="Video Gallery"
                style={{ maxWidth: "100%", maxHeight: "80%" }}
              />
            </div>
          </div>
        )}
      </Box>
    </>
  );
};

export default Videos;
