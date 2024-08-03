import "./MainChatSection.css";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";
import React, { useMemo, useRef, useState } from "react";

import {
  Box,
  Fade,
  Paper,
  Dialog,
  Select,
  Avatar,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  FormControl,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Menu,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
// import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
// import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
// import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
// import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
// import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

import AnimatedIcon from "../../AnimatedIcon.js";
import TypingAnimation from "./TypingAnimation.js";

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

const parseText = (text) => {
  let html = text
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<ul><li>$1</li></ul>")
    .replace(/^\n/gm, "<br/>")
    .replace(/^\n{2,}/g, "</p><p>")
    .replace(/\[([^[]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/```([^`]+)```/gs, "<pre>$1</pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\n/gm, "<br/>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/(?:^|\n)(\|.*\|)\s*(?=\n|$)/g, (match) => {
      const rows = match
        .trim()
        .split("\n")
        .map((row) => {
          const cells = row
            .split("|")
            .filter(Boolean)
            .map((cell) => cell.trim());
          return `<tr>${cells
            .map(
              (cell) =>
                `<td style="padding: 5px; border: 1px solid black; width: ${
                  100 / cells.length
                }%; height: 100%;">${cell}</td>`
            )
            .join("")}</tr>`;
        })
        .join("");
      return `<table style="width: 100%; display: table; table-layout: fixed; border-collapse: collapse;">${rows}</table>`;
    });

  // Close all <ul> tags (since we opened them unconditionally)
  html = html.replace(/<\/ul><ul>/g, "");

  // Wrap all in a paragraph tag to ensure proper Quill handling
  html = `<p>${html}</p>`;

  return html;
};

const VideoItem = ({ video, handleOpenVideoInNewTab }) => {
  const [videoDisplay, setVideoDisplay] = useState(false);

  const handleOpenDialog = () => {
    setVideoDisplay(true);
  };

  const handleCloseDialog = () => {
    setVideoDisplay(false);
  };

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
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const videoContainerStyle = {
    height: "50px",
    minWidth: "50px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    maxWidth: "300px",
    border: "solid 1px #d9d9d9",
    borderRadius: "3px",
    padding: "3px",
    width: "100%",
    cursor: "pointer",
  };

  const titleStyle = {
    display: "flex",
    flexDirection: "row",
    fontFamily: "Inter",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "12px",
    width: "85%",
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
        <DialogTitle style={dialogTitleStyle}>
          <IconButton
            style={{ margin: "0px 5px" }}
            onClick={() => {
              handleOpenVideoInNewTab(video);
            }}
            disabled
          >
            {/* <OpenInNewRoundedIcon style={{ color: "transparent" }} /> */}
          </IconButton>
          <div style={dialogVideoTitleStyle} className="draggable-dialog">
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
          <ReactPlayer
            url={videoSrc}
            controls={true}
            height={"auto"}
            width={"100%"}
            stopOnUnmount
          />
          {/* <Box
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
              {video.pageContent ? (
                <div
                  style={{
                    fontSize: "13px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: parseText(video?.pageContent),
                    }}
                  />
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
          </Box> */}
        </DialogContent>
        {/* <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "move",
            padding: "12px",
          }}
          className="draggable-dialog"
        ></DialogActions> */}
      </Dialog>
      <div style={videoContainerStyle} onClick={() => handleOpenDialog()}>
        <img
          alt="MP4 Video"
          src="/images/videoIcon.png"
          style={{
            height: "36px",
          }}
        />
        <Typography
          variant="subtitle2"
          style={titleStyle}
          title={video.fileName}
        >
          {video.fileName}
        </Typography>
      </div>
    </div>
  );
};

const DocItem = ({
  id,
  message,
  fileName,
  pageNumbers,
  setPageNumber,
  handleShowDocument,
  setIsDocDisplayOpen,
}) => {
  const docContainerStyle = {
    height: "50px",
    minWidth: "50px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    maxWidth: "300px",
    border: "solid 1px #d9d9d9",
    borderRadius: "3px",
    padding: "3px",
    width: "100%",
  };

  const titleStyle = {
    display: "flex",
    flexDirection: "row",
    fontFamily: "Inter",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "12px",
    width: "calc(100% - 40px)",
  };

  const lastDotIndex = fileName.lastIndexOf(".");
  const fileExtension = fileName.substring(lastDotIndex + 1).toLowerCase();

  const renderSourceImage = () => {
    switch (fileExtension) {
      case "pdf":
        return (
          <img
            alt="pdf"
            src="/images/pdfIcon2.png"
            style={{
              height: "36px",
            }}
          />
        );
      case "ppt":
      case "pptx":
        return (
          <img
            alt="ppt"
            src="/images/pptIcon2.png"
            style={{
              height: "36px",
            }}
          />
        );
      case "doc":
      case "docx":
        return (
          <img
            alt="word"
            src="/images/wordIcon2.png"
            style={{
              height: "36px",
            }}
          />
        );
      case "csv":
        return (
          <img
            alt="csv"
            src="/images/csvIcon2.png"
            style={{
              height: "36px",
            }}
          />
        );
      case "txt":
        return (
          <img
            alt="text"
            src="/images/textIcon2.png"
            style={{
              height: "36px",
            }}
          />
        );
      default:
        return (
          <img
            alt="pdf"
            src="/images/pdfIcon2.png"
            style={{
              height: "36px",
            }}
          />
        );
    }
  };

  return (
    <div
      style={{
        ...docContainerStyle,
        cursor:
          fileExtension === "pdf" || fileExtension === "PDF"
            ? "default"
            : "pointer",
      }}
      onClick={(e) => {
        if (fileExtension !== "pdf" && fileExtension !== "PDF") {
          e.stopPropagation();
          setPageNumber(0);
          handleShowDocument(message.source[id]);
          setIsDocDisplayOpen(true);
        }
      }}
    >
      {renderSourceImage()}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          padding: "0px 5px",
        }}
      >
        <Typography variant="subtitle2" style={titleStyle} title={fileName}>
          {fileName}
        </Typography>
        {(fileExtension === "pdf" || fileExtension === "PDF") && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: "10px",
              flexWrap: "wrap",
              gap: "5px",
            }}
          >
            Pages:
            {pageNumbers.map((pageNo, pageNumberIndex) => (
              <div
                key={`pageNumber_${pageNumberIndex}`}
                variant="contained"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#ebf3fa",
                  color: "#000",
                  padding: "0px 5px",
                  width: "auto",
                  fontSize: "12px",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPageNumber(pageNo);
                  handleShowDocument(message.source[id]);
                  setIsDocDisplayOpen(true);
                }}
              >
                {pageNo}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MainChatSection = ({
  user,
  languages,
  userInput,
  chatLanguage,
  chatMessages,
  selectedChat,
  setUserInput,
  setPageNumber,
  chatContainerRef,
  handleSendMessage,
  responseGenerating,
  setIsDocDisplayOpen,
  handleShowDocument,
  handleLanguageChange,
}) => {
  const {
    transcript: transcriptQuery,
    listening,
    resetTranscript: resetTranscriptQuery,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const [isSpeakingMainChatQuerySection, setIsSpeakingMainChatQuerySection] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // const handleOpenMediaMenu = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleCopyResponse = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Response copied");
    } catch (error) {
      toast.error("Unable to copy");
    }
  };

  const startListening = async () => {
    resetTranscriptQuery();
    const speechLanguage = languages.find(
      (language) => language.name === chatLanguage
    );
    await SpeechRecognition.startListening({
      continuous: true,
      language: speechLanguage.code,
    });
  };

  const stopListening = async () => {
    await SpeechRecognition.stopListening();
    resetTranscriptQuery();
  };

  // Turn Mic On
  const handleTurnMicOn = async () => {
    resetTranscriptQuery();
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser support unavailable for speech to text!");
    }
    if (!isMicrophoneAvailable) {
      toast.error("Mic unavailable!");
    }
    setIsSpeakingMainChatQuerySection(true);
    await startListening();
  };

  // Turn Mic Off
  const handleTurnMicOff = async () => {
    const spokenText = transcriptQuery;
    if (spokenText.trim() !== "" && isSpeakingMainChatQuerySection) {
      if (userInput.trim() !== "") {
        setUserInput((prevInput) => prevInput + " " + spokenText);
      } else {
        setUserInput(spokenText);
      }
    }
    setIsSpeakingMainChatQuerySection(false);
    await stopListening();
    resetTranscriptQuery();
  };

  const handleTextInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div
      style={{
        paddingTop: "10px",
        // backgroundColor: "#fafafa",
        backgroundColor: "#fff",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="chatContainerRef"
          ref={chatContainerRef}
          style={{
            marginTop: "30px",
            height: `calc(90vh - 40px)`,
            // minHeight: "70vh",
            // maxHeight: "80%",
            overflow: "auto",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {chatMessages?.length > 0 || selectedChat ? (
            <>
              {/* Render chat messages */}
              {chatMessages?.map((message, index) => {
                return (
                  <div
                    key={`message_${index}`}
                    style={{
                      display: "flex",
                      justifyContent: message.isUser
                        ? "flex-end"
                        : "flex-start",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.isUser ? (
                      <>
                        <Box
                          sx={{
                            backgroundColor: "#EEE",
                            margin: "20px 10px 15px 10px",
                            padding: "12px 17px",
                            borderRadius: "5px",
                            width: "fit-content",
                            maxWidth: "90%",
                            position: "relative",
                          }}
                        >
                          <Avatar
                            src={user?.profilePic}
                            style={{
                              position: "absolute",
                              right: "-50px",
                              top: "0",
                              width: "40px",
                              height: "40px",
                              border: "1px solid #EEE",
                            }}
                          />
                          <div
                            style={{
                              fontFamily: "Inter",
                              fontSize: "14px",
                              textAlign: "left",
                              color: "#000",
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: parseText(message.text),
                              }}
                            />
                          </div>
                        </Box>
                      </>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Box
                          sx={{
                            backgroundColor: "#fff",
                            margin: "5px 10px 10px 10px",
                            padding: "15px 20px",
                            borderRadius: "5px",
                            width: "fit-content",
                            maxWidth: "100%",
                            position: "relative",
                          }}
                        >
                          {/* <Avatar
                            style={{
                              position: "absolute",
                              left: "-50px",
                              top: "0",
                              width: "30px",
                              height: "25px",
                              border: "0px solid #EEE",
                              background: "transparent"
                            }}
                          >
                            <img src="/images/icon.png" alt="AI" height={"100%"} width={"100%"} />
                          </Avatar> */}
                          <div
                            style={{
                              fontFamily: "Inter",
                              fontSize: "14px",
                              lineHeight: "25px",
                              textAlign: "left",
                              color: "#000",
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: parseText(message.text),
                              }}
                            />
                          </div>
                          {message.source && (
                            <>
                              <div
                                style={{
                                  marginTop: "15px",
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  borderRadius: "5px",
                                  backgroundColor: "#fff",
                                  gap: "5px",
                                  height: "auto",
                                  width: "auto",
                                }}
                              >
                                {Object.entries(message.source).map(
                                  ([id, { fileName, pageNumbers }], index) => {
                                    return fileName.endsWith(".mp4") ? (
                                      <VideoItem
                                        key={`source_${index}`}
                                        video={message.source[id]}
                                      />
                                    ) : fileName ? (
                                      <DocItem
                                        id={id}
                                        key={`source_${index}`}
                                        message={message}
                                        fileName={fileName}
                                        pageNumbers={pageNumbers}
                                        setPageNumber={setPageNumber}
                                        handleShowDocument={handleShowDocument}
                                        setIsDocDisplayOpen={
                                          setIsDocDisplayOpen
                                        }
                                      />
                                    ) : (
                                      <></>
                                    );
                                  }
                                )}
                              </div>
                            </>
                          )}
                        </Box>
                        <div
                          style={{
                            width: "fit-content",
                            margin: "0px 0px 0px 0px",
                            padding: "0px 0px 0px 7px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Tooltip title={"Copy"} arrow placement="bottom">
                            <IconButton
                              size="small"
                              aria-label="Copy to clipboard"
                              style={{
                                fontSize: "25px",
                                // color: "#3C4043",
                                padding: "1px",
                                marginInline: "5px",
                                background: "transparent",
                              }}
                              onClick={() => {
                                handleCopyResponse(message.text);
                              }}
                            >
                              <AnimatedIcon
                                staticSrc="/images/Copy.png"
                                hoverSrc="/images/Copy.gif"
                                alt="Copy Response"
                                width={25}
                                height={25}
                              />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip
                            title={"Good response"}
                            arrow
                            placement="bottom"
                          >
                            <IconButton
                              size="small"
                              aria-label="Mark as good response"
                              style={{
                                fontSize: "25px",
                                // color: "#3C4043",
                                padding: "1px",
                                marginInline: "5px",
                                background: "transparent",
                              }}
                              // onClick={() => {
                              //   handleCopyResponse(message.text);
                              // }}
                            >
                              <AnimatedIcon
                                staticSrc="/images/ThumbsUp.png"
                                hoverSrc="/images/ThumbsUp.gif"
                                alt="Good Response"
                                width={25}
                                height={25}
                              />
                            </IconButton>
                          </Tooltip> */}
                          {/* <Tooltip
                          title={"Bad response"}
                          arrow
                          placement="bottom"
                        >
                          <IconButton
                            size="small"
                            aria-label="Mark as bad response"
                            style={{
                              fontSize: "25px",
                              // color: "#3C4043",
                              padding: "1px",
                              marginInline: "5px",
                              background: "transparent",
                            }}
                            // onClick={() => {
                            //   handleCopyResponse(message.text);
                            // }}
                          >
                            <ThumbDownOutlinedIcon />
                          </IconButton>
                        </Tooltip> */}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {responseGenerating && (
                <div
                  style={{
                    fontFamily: '"Google Sans", "Helvetica Neue", sans-serif',
                    lineHeight: "30px",
                    padding: "10px 0px 0px 10px",
                    fontSize: "16px",
                    marginLeft: "10px",
                  }}
                >
                  <TypingAnimation />
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "100%",
                width: "100%",
                padding: "0 0 200px 0",
              }}
            >
              <div>
                <Typography
                  style={{
                    fontSize: "max(3vw, 35px)",
                    fontWeight: "500",
                    backgroundImage:
                      "linear-gradient(to right, #0A97A4, #2071B8, #A23278, #A23278, #CD494E, #F27926)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Hello, {user?.username}
                </Typography>
                <Typography
                  style={{
                    fontSize: "max(2.5vw, 25px)",
                    fontWeight: "500",
                    color: "#999",
                  }}
                >
                  How can I help you today?
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          height: "10vh",
        }}
      >
        <FormControl
          size="small"
          style={{
            width: "75px",
            backgroundColor: "#FFF",
          }}
        >
          <Select
            value={chatLanguage}
            onChange={(event) => {
              handleTurnMicOff();
              handleLanguageChange(event);
            }}
            style={{
              fontSize: "12px",
            }}
          >
            {languages?.map((language) => (
              <MenuItem
                key={language?.code}
                value={language?.name}
                style={{
                  fontSize: "13px",
                }}
              >
                {language?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: `calc(100% - 300px)`,
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            // disabled={documents.length === 0 && notes.length === 0}
            autoFocus
            placeholder="Ask ZippiAi..."
            multiline
            maxRows={2}
            value={
              isSpeakingMainChatQuerySection
                ? userInput + " " + transcriptQuery
                : userInput
            }
            onClick={handleTurnMicOff}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                handleTextInputChange(e, "\n");
              } else if (
                e.key === "Enter" &&
                !responseGenerating &&
                userInput.trim() !== ""
              ) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onChange={handleTextInputChange}
            style={{
              width: `calc(100%)`,
              backgroundColor: "#FFF",
              overflow: "auto",
              height: "auto",
              borderRadius: "20px",
            }}
            InputProps={{
              style: {
                padding: "5px 5px 5px 5px",
                borderRadius: "20px",
              },
              startAdornment: (
                <div>
                  {isSpeakingMainChatQuerySection ? (
                    <Tooltip title={"Mic On"} arrow placement="top">
                      <IconButton
                        size="small"
                        aria-label="Mic On"
                        style={{
                          fontSize: "25px",
                          color: "#3C4043",
                          padding: "1px",
                          marginInline: "5px",
                          background: "transparent",
                        }}
                        onClick={(e) => {
                          handleTurnMicOff();
                          e.stopPropagation();
                        }}
                      >
                        <MicIcon
                          style={{
                            fontSize: "25px",
                            color: "green",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={"Mic Off"} arrow placement="top">
                      <IconButton
                        size="small"
                        aria-label="Mic Off"
                        style={{
                          fontSize: "25px",
                          color: "#3C4043",
                          padding: "1px",
                          marginInline: "5px",
                          background: "transparent",
                        }}
                        onClick={(e) => {
                          handleTurnMicOn();
                          e.stopPropagation();
                        }}
                      >
                        <MicOffIcon
                          style={{
                            fontSize: "25px",
                            color: "grey",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              ),
              endAdornment: (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Tooltip title={"Attach Files"} arrow placement="top">
                    <span>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          handleOpenMediaMenu(e);
                        }}
                        aria-label="Attach Files"
                        style={{
                          padding: "0px",
                          marginRight: "5px",
                          background: "transparent",
                        }}
                        disabled={listening || responseGenerating}
                      >
                        {responseGenerating ? (
                          <>
                            <CircularProgress
                              color="success"
                              size={20}
                              thickness={4}
                            />
                          </>
                        ) : (
                          <>
                            <AttachFileOutlinedIcon
                              style={{
                                fontSize: "20px",
                                color: "grey",
                                transform: "rotate(45deg)",
                              }}
                            />
                          </>
                        )}
                      </IconButton>
                    </span>
                  </Tooltip> */}
                  <Tooltip
                    title={responseGenerating ? "Generating" : "Send"}
                    arrow
                    placement="top"
                  >
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (userInput.trim() !== "") {
                            handleSendMessage();
                          }
                        }}
                        aria-label="Send Message"
                        style={{
                          padding: "1px",
                          marginRight: "3px",
                          background: "transparent",
                        }}
                        disabled={
                          listening ||
                          userInput.trim() === "" ||
                          responseGenerating
                        }
                      >
                        {responseGenerating ? (
                          <>
                            <CircularProgress
                              color="success"
                              size={20}
                              thickness={4}
                            />
                          </>
                        ) : (
                          <>
                            <SendRoundedIcon
                              style={{
                                fontSize: "20px",
                                color:
                                  userInput.trim() !== "" && !listening
                                    ? "green"
                                    : "grey",
                              }}
                            />
                          </>
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              ),
            }}
          />
          <Menu
            anchorEl={anchorEl}
            id="media-menu"
            open={open}
            onClose={handleClose}
            onClick={(e) => {
              handleClose();
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Tooltip title="Documents" placement="left" arrow>
              <MenuItem
                onClick={() => {
                  // handleOpenUploadDocumentForm();
                  handleClose();
                }}
              >
                <img
                  alt="MP4 Video"
                  src="/images/documentGallery.png"
                  style={{
                    height: "25px",
                  }}
                />
              </MenuItem>
            </Tooltip>

            <Tooltip title="Images" placement="left" arrow>
              <MenuItem
                onClick={() => {
                  // handleOpenUploadImageForm();
                  handleClose();
                }}
              >
                <img
                  alt="MP4 Video"
                  src="/images/imageGallery.png"
                  style={{
                    height: "25px",
                  }}
                />
              </MenuItem>
            </Tooltip>

            <Tooltip title="Videos" placement="left" arrow>
              <MenuItem
                onClick={() => {
                  // handleOpenVideoUploadForm();
                  handleClose();
                }}
              >
                <img
                  alt="MP4 Video"
                  src="/images/videoGallery.png"
                  style={{
                    height: "25px",
                  }}
                />
              </MenuItem>
            </Tooltip>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default MainChatSection;
