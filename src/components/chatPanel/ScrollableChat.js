import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import React, { useState } from "react";
import { useAuth } from "../../context/auth.js";

import {
  Box,
  Avatar,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
// import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

const handleOpenImageInNewTab = (imageFilePath) => {
  window.open(`${imageFilePath}`, "_blank");
};

const handleOpenVideoInNewTab = (videoFilePath) => {
  window.open(`${videoFilePath}`, "_blank");
};

const ImageItem = ({ imageFileName, imageFilePath }) => {
  const [imageDisplay, setImageDisplay] = useState(false);

  const handleOpenDialog = () => {
    setImageDisplay(true);
  };

  const handleCloseDialog = () => {
    setImageDisplay(false);
  };

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

  const imgSource = imageFilePath;

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
                handleOpenImageInNewTab(imageFilePath);
              }}
              disabled
            >
              {/* <OpenInNewRoundedIcon style={{ color: "#0f8fa9" }} /> */}
            </IconButton>
            <div style={dialogImageTitleStyle}>{imageFileName}</div>
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
            loading="lazy"
            src={imgSource}
            alt={imageFileName}
            style={dialogImageStyle}
          />
        </DialogContent>
      </Dialog>
      <div style={imageContainerStyle}>
        <img
          src={imgSource}
          alt={imageFileName}
          style={imageStyle}
          onClick={(e) => {
            handleOpenDialog();
            e.stopPropagation();
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

const VideoItem = ({ videoFilePath, videoFileName, message }) => {
  const [videoDisplay, setVideoDisplay] = useState(false);

  const handleOpenDialog = () => {
    setVideoDisplay(true);
  };

  const handleCloseDialog = () => {
    setVideoDisplay(false);
  };

  const videoSrc = videoFilePath;

  const dialogTitleStyle = {
    padding: "0",
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
    position: "relative",
    overflow: "hidden",
    borderRadius: "5px 5px 7px 7px",
  };

  const videoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "3px",
    cursor: "pointer",
  };

  return (
    <div>
      <Dialog
        open={videoDisplay}
        onClose={handleCloseDialog}
        style={{
          backgroundColor: "#0001",
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
                handleOpenVideoInNewTab(videoFilePath);
              }}
            >
              {/* <OpenInNewRoundedIcon style={{ color: "#0f8fa9" }} /> */}
            </IconButton>
            <div style={dialogVideoTitleStyle}>{videoFileName}</div>
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
          <ReactPlayer
            url={videoSrc}
            controls={true}
            height={"auto"}
            width={"100%"}
            stopOnUnmount
          />
          {message?.content?.length > 0 ? (
            <>
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
              <Box style={{ padding: "0px 25px 15px 25px" }}>
                <Box
                  sx={{
                    width: "100%",
                    overflow: "auto",
                    maxHeight: "127px",
                  }}
                >
                  {message.content ? (
                    <div
                      style={{
                        fontSize: "13px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {message?.content}
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
                        marginBottom: "10px",
                      }}
                    >
                      No transcription
                    </Box>
                  )}
                </Box>
              </Box>
            </>
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
      <div style={videoContainerStyle}>
        <div style={{ height: "100px" }}>
          <video
            src={videoSrc}
            alt={videoFileName}
            loading="lazy"
            style={videoStyle}
            onClick={() => handleOpenDialog()}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "5px",
          }}
        >
          {videoFileName}
        </div>
      </div>
    </div>
  );
};

const DocumentItem = ({
  user,
  DocumentFileName,
  DocumentFilePath,
  senderName,
  DocumentFileId,
}) => {
  const openInNewTab = (docId) => {
    if (user?.role === 0) {
      window.open(`/user/view-file/${docId}`, "_blank");
    } else if (user?.role === 1) {
      window.open(`/admin/view-file/${docId}`, "_blank");
    } else {
      toast.success("Access Denied");
    }
  };
  const documentSource = DocumentFileId;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "5px",
          padding: "3px",
          borderRadius: "3px",
          border: "solid 1px #d9d9d9",
          backgroundColor:
            senderName === user?.username ? "#d2edef" : "#e8e8e8",
          position: "relative",
          cursor: "pointer",
          maxWidth: "40vw",
        }}
        onClick={() => {
          openInNewTab(documentSource);
        }}
      >
        <IconButton size="small" style={{ background: "transparent" }}>
          <InsertDriveFileOutlinedIcon />
        </IconButton>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            // width: "70%",
          }}
          title={DocumentFileName}
        >
          {DocumentFileName}
        </div>
      </div>
    </div>
  );
};

const ScrollableChat = (props) => {
  const {
    conversationMessages,
    selectedMessages,
    setSelectedMessages,
    chatContainerRef,
    selectedConversation,
    user,
  } = props;

  const [auth] = useAuth();
  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prevSelectedMessagesIds) => {
      if (prevSelectedMessagesIds.includes(messageId)) {
        return prevSelectedMessagesIds.filter(
          (selectedIndex) => selectedIndex !== messageId
        );
      } else {
        return [...prevSelectedMessagesIds, messageId];
      }
    });
  };
  function highlightLinksInText(text) {
    const urlRegex =
      // eslint-disable-next-line
      /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi;

    // const webRegex = /(?:^|\s)((?:https?:\/\/)?(?:www\.)?[^\s]+\.[^\s]+)/gi;
    const emailRegex = /(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)/gi;

    const replacedText = text
      .replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      })
      // .replace(webRegex, (url) => {
      //   return `<a href="https://${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      // })
      .replace(emailRegex, (email) => {
        return `<a href=mailto:${email}>${email}</a>`;
      });

    return replacedText;
    // const urlRegex = /(?:^|\s)((?:https?:\/\/)?(?:www\.)?(?:[\w-]+\.)*([\w-]{2,}\.(?:com|org|net|gov|edu|mil|int|co\.uk|in|io|ai|ly|gl|us)))(?:$|\s)/gi;
    // const emailRegex = /(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)/ig;

    // const replacedText = text.replace(urlRegex, (url) => {
    //   return `<a href="${url.startsWith('http') ? url : 'http://' + url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    // }).replace(emailRegex, (email) => {
    //   return `<a href="mailto:${email}">${email}</a>`;
    // });

    // return replacedText;
  }

  return (
    <>
      <div ref={chatContainerRef}>
        {conversationMessages?.map((message, index) => (
          <Box
            key={index}
            onClick={(event) => {
              if (!event.target.classList.contains("inner-div")) {
                handleSelectMessage(message?._id);
              }
            }}
            sx={{
              display: "flex",
              cursor: "pointer",
              marginBottom: "2px",
              borderRadius: "8px",
              backgroundColor: selectedMessages.includes(message?._id)
                ? "lightblue"
                : "transparent",
              justifyContent:
                message?.senderName === auth.user?.username
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <div
              className="inner-div"
              style={{
                display: "flex",
                flexDirection: "row",
                cursor: "text",
                margin:
                  message?.senderName === auth.user?.username
                    ? "0px 8px 0px 0px"
                    : "0px 0px 0px 8px",
                padding: "5px",
                maxWidth: "75%",
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {selectedConversation.isGroupChat &&
              message?.senderName !== auth.user?.username ? (
                <Avatar
                  sx={{
                    bgcolor: "primary.light",
                    height: "25px",
                    width: "25px",
                  }}
                  src={message?.senderProfilePic}
                ></Avatar>
              ) : (
                <></>
              )}
              <Box
                style={{
                  borderRadius: "5px",
                  margin:
                    message?.senderName === auth.user?.username
                      ? "0px 5px 0px 0px"
                      : "0px 0px 0px 5px",
                  backgroundColor:
                    message?.senderName === auth.user?.username
                      ? "#e7f5f6"
                      : "#f4f4f4",
                  padding: "5px",
                  width: "auto",
                }}
              >
                {selectedConversation.isGroupChat &&
                message?.senderName !== auth.user?.username ? (
                  <Box
                    style={{
                      textAlign: "left",
                      fontSize: "15px",
                      fontFamily: "Inter",
                      marginLeft: "5px",
                    }}
                    sx={{ color: "primary.light" }}
                  >
                    {message?.senderName}
                  </Box>
                ) : (
                  <></>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "0px 5px 0px 5px",
                  }}
                >
                  {message?.type === "Text" && (
                    <div
                      style={{
                        fontFamily: "Inter",
                        fontSize: "15px",
                        width: "fit-content",
                        whiteSpace: "pre-wrap",
                        textAlign: "left",
                        padding:
                          message?.senderName === auth.user?.username
                            ? "5px 0px 5px 5px"
                            : "0px 0px 5px 0px",
                      }}
                    >
                      <span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightLinksInText(message?.content),
                          }}
                        />
                        {/* {highlightLinksInText(message?.content)} */}
                      </span>
                      {/* {message?.content} */}
                    </div>
                  )}
                  {message?.type === "Image" && (
                    <ImageItem
                      user={user}
                      imageFilePath={message?.filePath}
                      imageFileName={message?.fileName}
                    />
                  )}
                  {message?.type === "Document" && (
                    <DocumentItem
                      user={user}
                      DocumentFilePath={message?.filePath}
                      DocumentFileName={message?.fileName}
                      DocumentFileId={message?.fileId}
                    />
                  )}
                  {message?.type === "Video" && (
                    <VideoItem
                      user={user}
                      senderName={message?.senderName}
                      videoFilePath={message?.filePath}
                      videoFileName={message?.fileName}
                      message={message}
                    />
                  )}
                  <div
                    style={{
                      margin: "5px 0px 0 0",
                      fontFamily: "Inter",
                      fontSize: "10px",
                      textAlign: "right",
                      color: "#000",
                      gap: "5px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    {message?.createdAt ? (
                      <>
                        <div>
                          {new Date(message?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              hour12: false,
                            }
                          )}
                        </div>
                        <div>
                          {new Date(message?.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour12: false,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </Box>
            </div>
          </Box>
        ))}
      </div>
    </>
  );
};

export default ScrollableChat;
