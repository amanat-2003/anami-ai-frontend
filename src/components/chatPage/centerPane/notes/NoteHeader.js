import React, { useEffect, useState } from "react";

import {
  Box,
  Select,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArtTrackRoundedIcon from "@mui/icons-material/ArtTrackRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ClosedCaptionRoundedIcon from "@mui/icons-material/ClosedCaptionRounded";
import ClosedCaptionDisabledRoundedIcon from "@mui/icons-material/ClosedCaptionDisabledRounded";

const NoteHeader = ({
  quillRef,
  fileName,
  setFileName,
  languages,
  noteLanguage,
  handleLanguageChange,
  handleTurnMicOn,
  handleTurnMicOff,
  // handleBrowserBack,
  isTranscribeButtonDisabled,
  isSpeakingNoteSection,
  handleSaveNote,
  handleSaveDraft,
  sortedImages,
  handleInsertImage,
  handleRemoveImage,
  sortedVideos,
  handleInsertVideo,
  handleRemoveVideo,
  videoInProgress,
  transcribedVideos,
  handleShowTranscript,
  handleTranscriptVideo,
  setSelectedText,
  setSavedSelection,
  setIsModifyNoteDialogOpen,
  handleOpenImageAddDialog,
  handleOpenVideoAddDialog,
  handleOpenNoteCloseConfirmDialog,
  handleCloseNoteCloseConfirmDialog,
}) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const colors = [
    "#fef2e9",
    "#faeded",
    "#f6ebf1",
    "#f0ecf5",
    "#e9f1f8",
    "#e7f5f6",
  ]; // Add more colors as needed

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 500);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  const handleButtonClick = () => {
    const selection = quillRef.current.getSelection();
    if (selection && selection.length > 0) {
      const currentSelectedText = quillRef.current.getText(
        selection.index,
        selection.length
      );
      setSelectedText(currentSelectedText);
      setSavedSelection(selection);
    } else {
      const editor = quillRef.current;

      const totalLength = editor.getLength();
      editor.setSelection(0, totalLength);
      const entireText = editor.getText();
      const entireSelection = editor.getSelection();

      setSelectedText(entireText);
      setSavedSelection(entireSelection);
    }
    setIsModifyNoteDialogOpen(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "7px",
          flexWrap: "wrap",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexWrap: "wrap",
            gap: "7px",
            paddingLeft: "10px",
          }}
        >
          <div style={{ position: "absolute", left: "-50px", top: "5px" }}>
            <IconButton
              disabled={isTranscribeButtonDisabled}
              onClick={() => {
                handleOpenNoteCloseConfirmDialog();
              }}
            >
              <CloseOutlinedIcon
                sx={{
                  color: "#000",
                }}
              />
            </IconButton>
          </div>
          <TextField
            autoFocus
            size="small"
            label="Title"
            type="text"
            name="name"
            required
            style={{ maxWidth: "400px" }}
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            InputProps={{
              style: {
                borderRadius: "15px",
              },
            }}
          />
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <FormControl
              size="small"
              style={{
                width: "100px",
                backgroundColor: "#FFF",
                margin: "7px",
              }}
            >
              <InputLabel>Language</InputLabel>
              <Select
                value={noteLanguage}
                onChange={(event) => {
                  handleTurnMicOff();
                  handleLanguageChange(event);
                }}
                label="Language"
                style={{
                  fontSize: "14px",
                }}
              >
                {languages?.map((language) => (
                  <MenuItem
                    key={language.code}
                    value={language.name}
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    {language.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isSpeakingNoteSection ? (
              <Tooltip title={"Mic on"} arrow placement="bottom">
                <IconButton
                  aria-label="Turn off Mic"
                  style={{
                    padding: "7px",
                    // margin: "7px",
                  }}
                  onClick={handleTurnMicOff}
                >
                  <MicIcon
                    style={{
                      fontSize: "35px",
                      color: "green",
                    }}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title={"Mic off"} arrow placement="bottom">
                <IconButton
                  aria-label="Turn on Mic"
                  style={{
                    padding: "7px",
                    margin: "0px",
                  }}
                  onClick={handleTurnMicOn}
                >
                  <MicOffIcon
                    style={{
                      fontSize: "35px",
                      color: "grey",
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {/* <input
              accept=".png, .jpg, .jpeg"
              style={{ display: "none" }}
              id="image-input"
              type="file"
              ref={imageFileInputRef}
              onChange={handleImageChange}
              multiple
            /> */}
            {/* <label htmlFor="image-input"> */}
            <Tooltip title={"Add images"} arrow placement={"bottom"}>
              <img
                width="35"
                height="35"
                src="https://img.icons8.com/fluency/48/image.png"
                alt="add"
                style={{ cursor: "pointer" }}
                onClick={handleOpenImageAddDialog}
              />
            </Tooltip>
            {/* </label> */}
            {/* <input
              accept=".mp4"
              style={{ display: "none" }}
              id="video-input"
              type="file"
              ref={videoFileInputRef}
              onChange={handleVideoChange}
              multiple
            /> */}
            {/* <label htmlFor="video-input"> */}
            <Tooltip title={"Add videos"} arrow placement={"bottom"}>
              <img
                width="34"
                height="39"
                src="https://img.icons8.com/fluency/48/video.png"
                alt="add-video"
                style={{ cursor: "pointer" }}
                onClick={handleOpenVideoAddDialog}
              />
            </Tooltip>
            {/* </label> */}
            <Tooltip
              title={
                "Ask ZippiAi assistant to help you in crafting knowledgebase, SOP, manuals and documentation."
              }
              placement="bottom"
              arrow
            >
              <IconButton
                style={{
                  backgroundColor: colors[currentColorIndex],
                  transition: "background-color 0.2s ease",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleButtonClick();
                }}
              >
                <AutoFixHighRoundedIcon
                  style={{ color: "#000", fontSize: "20px" }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <Box
            sx={{
              color:
                isTranscribeButtonDisabled || !fileName.trim()
                  ? "#999"
                  : "#1BA8B5",
              border:
                isTranscribeButtonDisabled || !fileName.trim()
                  ? "1px solid #EEE"
                  : "1px solid #1BA8B5",
              borderRadius: "7px",
              padding: "7px 20px",
              cursor:
                isTranscribeButtonDisabled || !fileName.trim()
                  ? "auto"
                  : "pointer",
              "&:hover": {
                color:
                  isTranscribeButtonDisabled || !fileName.trim()
                    ? "#777"
                    : "#FFF",
                backgroundColor:
                  isTranscribeButtonDisabled || !fileName.trim()
                    ? "#DDD"
                    : "#1BA8B5",
                border:
                  isTranscribeButtonDisabled || !fileName.trim()
                    ? "1px solid #DDD"
                    : "1px solid #1BA8B5",
              },
            }}
            onClick={() => {
              if (!isTranscribeButtonDisabled && fileName.trim()) {
                handleCloseNoteCloseConfirmDialog();
                handleSaveDraft();
              }
            }}
          >
            <Typography
              style={{
                fontWeight: "500",
                textTransform: "uppercase",
                fontSize: "14px",
              }}
            >
              Save draft
            </Typography>
          </Box>
          <Box
            sx={{
              color:
                isTranscribeButtonDisabled || !fileName.trim()
                  ? "#777"
                  : "#FFF",
              backgroundColor:
                isTranscribeButtonDisabled || !fileName.trim()
                  ? "#EEE"
                  : "#1BA8B5",
              borderRadius: "7px",
              padding: "8px 20px",
              cursor:
                isTranscribeButtonDisabled || !fileName.trim()
                  ? "auto"
                  : "pointer",
              "&:hover": {
                color:
                  isTranscribeButtonDisabled || !fileName.trim()
                    ? "#777"
                    : "#FFF",
                backgroundColor:
                  isTranscribeButtonDisabled || !fileName.trim()
                    ? "#DDD"
                    : "#0A97A4",
              },
            }}
            onClick={() => {
              if (!isTranscribeButtonDisabled && fileName.trim()) {
                handleSaveNote();
              }
            }}
          >
            <Typography
              style={{
                fontWeight: "500",
                textTransform: "uppercase",
                fontSize: "14px",
              }}
            >
              Save
            </Typography>
          </Box>
        </Box>
      </div>
      {(sortedImages?.length > 0 || sortedVideos?.length > 0) && (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            marginBlock: "15px",
            gap: "10px",
            maxHeight: "120px",
            overflow: "auto",
          }}
        >
          {sortedImages?.map((file, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "7px",
                border: "1px solid #ccc",
                borderRadius: "500px",
                padding: "0px 5px 0px 10px",
                width: `calc(25% - 8px)`,
                minWidth: "150px",
              }}
            >
              <Typography
                variant="body2"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "7px",
                }}
              >
                <Tooltip title="Insert" arrow placement="bottom">
                  <ArtTrackRoundedIcon
                    sx={{
                      fontSize: "30px",
                      color: "#AAA",
                      "&:hover": {
                        color: "#777",
                      },
                      backgroundColor: "transparent",
                      borderRadius: "50%",
                      padding: "0",
                      margin: "0",
                    }}
                    onClick={() => handleInsertImage(file)}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
                <Tooltip title="Remove" arrow placement="bottom">
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
                    onClick={() => handleRemoveImage(file)}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </div>
            </div>
          ))}
          {sortedVideos?.map((file, index) => {
            const isVideoTranscribed = transcribedVideos.some(
              (item) => item.videoName === file.name
            );

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "7px",
                  border: "1px solid #ccc",
                  borderRadius: "500px",
                  padding: "0px 5px 0px 10px",
                  width: `calc(25% - 8px)`,
                  minWidth: "150px",
                }}
              >
                <Typography
                  variant="body2"
                  style={{
                    width: "calc(115px)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "7px",
                  }}
                >
                  {isVideoTranscribed ? (
                    // Display the "Show Transcript" button
                    <Tooltip title="Show Transcript" arrow placement="bottom">
                      <ClosedCaptionRoundedIcon
                        sx={{
                          fontSize: "25px",
                          color: "#AAA",
                          "&:hover": {
                            color: "#777",
                          },
                          backgroundColor: "transparent",
                          borderRadius: "50%",
                          padding: "0",
                          margin: "0",
                        }}
                        onClick={() => handleShowTranscript(file)}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        isTranscribeButtonDisabled
                          ? "Service busy"
                          : "Transcribe"
                      }
                      arrow
                      placement="bottom"
                    >
                      <span>
                        <IconButton
                          style={{
                            margin: 0,
                            padding: 0,
                            fontSize: "25px",
                            background: "transparent",
                          }}
                          disabled={isTranscribeButtonDisabled}
                          onClick={() => handleTranscriptVideo(file)}
                        >
                          {file.name === videoInProgress?.name ? (
                            <CircularProgress
                              color="success"
                              size={20}
                              thickness={4}
                            />
                          ) : (
                            <ClosedCaptionDisabledRoundedIcon
                              sx={{
                                fontSize: "25px",
                                color: "#AAA",
                                "&:hover": {
                                  color: "#777",
                                },
                                backgroundColor: "transparent",
                                borderRadius: "50%",
                                padding: "0",
                                margin: "0",
                              }}
                            />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                  <Tooltip title="Insert" arrow placement="bottom">
                    <ArtTrackRoundedIcon
                      sx={{
                        fontSize: "30px",
                        color: "#AAA",
                        "&:hover": {
                          color: "#777",
                        },
                        backgroundColor: "transparent",
                        borderRadius: "50%",
                        padding: "0",
                        margin: "0",
                      }}
                      onClick={() => handleInsertVideo(file)}
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                  <Tooltip title="Remove" arrow placement="bottom">
                    <span>
                      <IconButton
                        style={{
                          margin: 0,
                          padding: 0,
                          background: "transparent",
                        }}
                        disabled={file.name === videoInProgress?.name}
                      >
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
                          onClick={() => handleRemoveVideo(file)}
                          style={{ cursor: "pointer" }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </Box>
      )}
    </div>
  );
};

export default NoteHeader;
