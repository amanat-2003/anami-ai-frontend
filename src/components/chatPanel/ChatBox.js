import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth.js";

import {
  Box,
  Menu,
  Button,
  Avatar,
  Select,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  FormControl,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import DeleteIcon from "@mui/icons-material/Delete";
import MicOffIcon from "@mui/icons-material/MicOff";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";

import { getSender, getSenderFull, getSenderProfilePic } from "./ChatLogics.js";
import PdfUploader from "./PdfUploader.js";
import ImgUploader from "./ImgUploader.js";
import ProfileDialog from "./ProfileDialog.js";
import VideoUploader from "./VideoUploader.js";
import ScrollableChat from "./ScrollableChat.js";
import GroupInfoDialog from "./GroupInfoDialog.js";
import { useNavigate } from "react-router-dom";
import { useSocketService } from "../../context/socketService.js";

const ChatBox = (props) => {
  const {
    loading,
    allUsers,
    userInput,
    languages,
    leaveGroup,
    chatLanguage,
    handleLogout,
    setUserInput,
    noMoreMessages,
    chatContainerRef,
    selectedMessages,
    handleSendMessage,
    setSelectedMessages,
    handleDeleteMessage,
    selectedConversation,
    conversationMessages,
    handleLanguageChange,
    deletingMessageLoader,
    handleClearConversation,
    handleDeleteConversation,
    loadingMoreMessageLoader,
    clearingConversationLoader,
    deletingConversationLoader,
    openComponent,
    setIsNewMessage,
    setSelectedConversation,
  } = props;

  const navigate = useNavigate();
  const [isSpeakingChatPanel, setIsSpeakingChatPanel] = useState(false);
  const [isLocalStorageUpdated, setLocalStorageUpdation] = useSocketService();

  useEffect(() => {
    if (auth.user === null && auth.token === "") {
      navigate("/login");
      localStorage.clear();
      toast.success("Logout successful");
    } else if (auth.user) {
      const storedSelectedConversation = localStorage.getItem(
        "selectedConversation"
      );
      if (storedSelectedConversation) {
        const parsedConversations = JSON.parse(storedSelectedConversation);
        setSelectedConversation(parsedConversations);
      }
    }
    setLocalStorageUpdation(false);
    // eslint-disable-next-line
  }, [isLocalStorageUpdated]);

  const {
    transcript: transcriptQuery,
    listening,
    resetTranscript: resetTranscriptQuery,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

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
    setIsSpeakingChatPanel(true);
    await startListening();
  };

  // Turn Mic Off
  const handleTurnMicOff = async () => {
    const spokenText = transcriptQuery;
    if (spokenText.trim() !== "" && isSpeakingChatPanel) {
      if (userInput.trim() !== "") {
        setUserInput((prevInput) => prevInput + " " + spokenText);
      } else {
        setUserInput(spokenText);
      }
    }
    setIsSpeakingChatPanel(false);
    await stopListening();
    resetTranscriptQuery();
  };

  const handleTextInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [auth] = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUploadDocumentForm, setOpenUploadDocumentForm] = useState(false);
  const [openUploadImageForm, setOpenUploadImageForm] = useState(false);
  const [openUploadVideoForm, setOpenUploadVideoForm] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMediaButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleOpenUploadDocumentForm = () => {
    setOpenUploadDocumentForm(true);
  };

  const handleCloseDocumentUploadForm = () => {
    setOpenUploadDocumentForm(false);
  };

  const handleOpenUploadImageForm = () => {
    setOpenUploadImageForm(true);
  };

  const handleCloseImageUploadForm = () => {
    setOpenUploadImageForm(false);
  };

  const handleOpenVideoUploadForm = () => {
    setOpenUploadVideoForm(true);
  };

  const handleCloseVideoUploadForm = () => {
    setOpenUploadVideoForm(false);
  };

  return (
    <>
      <Box width="100%" height="100vh" sx={{ padding: "0px", margin: "0px" }}>
        {/* Upload document form */}
        {openUploadDocumentForm && (
          <PdfUploader
            openUploadDocumentForm={openUploadDocumentForm}
            onClose={handleCloseDocumentUploadForm}
            selectedConversation={selectedConversation}
            user={auth.user}
            handleLogout={handleLogout}
            setIsNewMessage={setIsNewMessage}
          />
        )}
        {/* Upload Image form */}
        {openUploadImageForm && (
          <ImgUploader
            openUploadImageForm={openUploadImageForm}
            onClose={handleCloseImageUploadForm}
            selectedConversation={selectedConversation}
            user={auth.user}
            handleLogout={handleLogout}
            openComponent={openComponent}
            setIsNewMessage={setIsNewMessage}
          />
        )}
        {openUploadVideoForm && (
          <VideoUploader
            openUploadVideoForm={openUploadVideoForm}
            onClose={handleCloseVideoUploadForm}
            selectedConversation={selectedConversation}
            user={auth.user}
            handleLogout={handleLogout}
            openComponent={openComponent}
            setIsNewMessage={setIsNewMessage}
          />
        )}

        {selectedConversation ? (
          <>
            <Box
              sx={{
                display: "flex",
                height: "115px",
                padding: "0px 5px",
                width: "100%",
              }}
            >
              {!selectedConversation?.isGroupChat ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {/* {"not a group chat"} */}
                  <Avatar
                    style={{
                      width: "40px",
                      height: "40px",
                      margin: "0px 0px 0px 13px",
                      border: "1px solid #ddd",
                    }}
                    src={getSenderProfilePic(
                      auth?.user,
                      selectedConversation?.users
                    )}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginInline: "20px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        color: "#000",
                        fontSize: "22px",
                        height: "30px",
                        margin: "0px 50px 0px 0px",
                        fontWeight: 500,
                        textAlign: "left",
                      }}
                    >
                      {getSender(auth?.user, selectedConversation.users)}
                    </div>
                    <IconButton
                      d={{ base: "flex" }}
                      onClick={() => {
                        setDialogOpen(true);
                      }}
                    >
                      <InfoOutlinedIcon />
                    </IconButton>
                  </div>
                  <ProfileDialog
                    user={getSenderFull(auth?.user, selectedConversation.users)}
                    handleDeleteConversation={handleDeleteConversation}
                    handleClearConversation={handleClearConversation}
                    isDialogOpen={isDialogOpen}
                    handleDialogClose={handleDialogClose}
                    deletingMessageLoader={deletingMessageLoader}
                  />
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {/* {"group chat"} */}
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        backgroundColor: "#0f8fa9",
                        width: "40px",
                        height: "40px",
                        margin: "0px 0px 0px 13px",
                        border: "1px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      src={
                        !selectedConversation.isGroupChat
                          ? getSenderProfilePic(
                              auth?.user,
                              selectedConversation?.users
                            )
                          : selectedConversation?.groupProfilePic
                      }
                    >
                      {selectedConversation.isGroupChat ? (
                        <GroupsIcon />
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginInline: "20px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          color: "#000",
                          fontSize: "24px",
                          height: "29px",
                          margin: "0px 48px 0px 0px",
                          fontWeight: 500,
                          textAlign: "left",
                        }}
                      >
                        {selectedConversation.groupName}
                      </div>
                      <IconButton
                        d={{ base: "flex" }}
                        onClick={() => {
                          setDialogOpen(true);
                        }}
                      >
                        <InfoOutlinedIcon />
                      </IconButton>
                    </div>

                    <GroupInfoDialog
                      selectedConversation={selectedConversation}
                      handleDeleteConversation={handleDeleteConversation}
                      handleClearConversation={handleClearConversation}
                      isDialogOpen={isDialogOpen}
                      handleDialogClose={handleDialogClose}
                      leaveGroup={leaveGroup}
                      allUsers={allUsers}
                      handleLogout={handleLogout}
                    />
                  </div>
                </>
              )}
            </Box>
            <Box sx={{ height: `calc(100% - 115px)` }}>
              {loading ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: `calc(100% - 100px)`,
                    }}
                  >
                    <CircularProgress />
                  </div>
                </>
              ) : (
                <>
                  {clearingConversationLoader || deletingConversationLoader ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "calc(100% - 100px)",
                        flexDirection: "column",
                      }}
                    >
                      <CircularProgress />
                      {clearingConversationLoader ? (
                        <div>Deleting Messages</div>
                      ) : (
                        <div>Deleting Conversation</div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Box>
                        {selectedMessages?.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingInline: "20px",
                              backgroundColor: "#77A1",
                              borderRadius: "10px",
                              height: "40px",
                            }}
                          >
                            <Typography sx={{ padding: "5px" }}>
                              {selectedMessages?.length} Messages selected
                            </Typography>
                            <Button
                              disabled={deletingMessageLoader}
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                handleDeleteMessage();
                              }}
                            >
                              {deletingMessageLoader ? (
                                <CircularProgress size={13} />
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </Box>
                        )}
                      </Box>
                      <div
                        ref={chatContainerRef}
                        style={{
                          height:
                            selectedMessages?.length === 0
                              ? `calc(100% - 95px)`
                              : `calc(100% - 135px)`,
                          overflow: "auto",
                        }}
                      >
                        {!noMoreMessages && loadingMoreMessageLoader && (
                          <div>Loading...</div>
                        )}
                        <ScrollableChat
                          conversationMessages={conversationMessages}
                          selectedConversation={selectedConversation}
                          selectedMessages={selectedMessages}
                          setSelectedMessages={setSelectedMessages}
                          handleDeleteMessage={handleDeleteMessage}
                          chatContainerRef={chatContainerRef}
                          user={auth.user}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Bottom text pane */}
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  height: "95px",
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
                    minWidth: `calc(100% - 150px)`,
                  }}
                >
                  <TextField
                    variant="outlined"
                    size="small"
                    onClick={handleTurnMicOff}
                    placeholder="Your message here..."
                    multiline
                    maxRows={2}
                    value={
                      isSpeakingChatPanel
                        ? userInput + " " + transcriptQuery
                        : userInput
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.shiftKey) {
                        handleTextInputChange(e, "\n");
                      } else if (e.key === "Enter" && userInput.trim() !== "") {
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
                          {isSpeakingChatPanel ? (
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
                            gap: "5px",
                          }}
                        >
                          <Tooltip title={"Attach Media"} arrow placement="top">
                            <span>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  handleMediaButtonClick(e);
                                }}
                                aria-label="Send Message"
                                style={{
                                  padding: "1px",
                                  marginRight: "3px",
                                  background: "transparent",
                                }}
                              >
                                <AttachFileOutlinedIcon
                                  style={{
                                    fontSize: "20px",
                                    color: "grey",
                                    transform: "rotate(45deg)",
                                  }}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title={"Send"} arrow placement="top">
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
                                disabled={listening || userInput.trim() === ""}
                              >
                                <SendRoundedIcon
                                  style={{
                                    fontSize: "20px",
                                    color:
                                      userInput.trim() !== "" && !listening
                                        ? "green"
                                        : "grey",
                                  }}
                                />
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
                      horizontal: "right",
                    }}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleOpenUploadDocumentForm();
                        handleClose();
                      }}
                    >
                      <ListItemIcon
                        style={{
                          fontSize: "20px",
                          color: "#3C4043",
                        }}
                      >
                        <DescriptionOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText>Documents</ListItemText>
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleOpenUploadImageForm();
                        handleClose();
                      }}
                    >
                      <ListItemIcon
                        style={{
                          fontSize: "20px",
                          color: "#3C4043",
                        }}
                      >
                        <PhotoSizeSelectActualOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText>Images</ListItemText>
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleOpenVideoUploadForm();
                        handleClose();
                        // openComponent("Videos");
                      }}
                    >
                      <ListItemIcon
                        style={{
                          fontSize: "20px",
                          color: "#3C4043",
                        }}
                      >
                        <OndemandVideoIcon />
                      </ListItemIcon>
                      <ListItemText>Videos</ListItemText>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </Box>
          </>
        ) : (
          <Box
            height="100vh"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MailOutlinedIcon style={{ color: "#d9d9d9", fontSize: "200px" }} />
          </Box>
        )}
      </Box>
    </>
  );
};

export default ChatBox;
