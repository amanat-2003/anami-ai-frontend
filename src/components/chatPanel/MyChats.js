import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/auth.js";

import {
  Box,
  Badge,
  Avatar,
  Divider,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowCircleRight from "@mui/icons-material/ArrowCircleRight";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";

import { getSender, getSenderProfilePic } from "./ChatLogics.js";
import UserBadgeItem from "./UserBadgeItem.js";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";

const MyChats = (props) => {
  const {
    allUsers,
    handleLogout,
    conversations,
    setSelectedMessages,
    selectedConversation,
    handleNewConversation,
    newConversationLoader,
    setSelectedConversation,
    fetchSingleConversation,
    setConversationMessages,
    setDeletingMessageLoader,
    newGroupConversationLoader,
    setNewGroupConversationLoader,
    setClearingConversationLoader,
    setDeletingConversationLoader,
    setConversations,
  } = props;

  const [auth] = useAuth();
  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [filterText, setFilterText] = useState("");
  const [groupProfilePic, setProfilePic] = useState();
  const [profilePicUrl, setProfilePicUrl] = useState();
  const [iscreateNewChat, setCreatNewChat] = useState(false);
  const [isAskingGroupName, setAskingGroupName] = useState(false);
  const [isCreatingNewGroup, setCreatingNewGroup] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleSelectGroupProfilePicture = (event) => {
    const file = event.target.files[0];
    if (file.type === "image/png" || file.type === "image/jpeg") {
      if (file.size <= 1 * 1024 * 1024) {
        setProfilePic(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setProfilePicUrl(reader.result);
        };
      } else {
        toast.error("Image Size Limit (1MB) exceeded");
      }
    } else {
      toast.error("Unsupported file format");
    }
  };

  const handleOpenGroupProfilePictureInput = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const storedConversation = localStorage.getItem("allConversations");
    if (storedConversation) {
      const parsedConversation = JSON.parse(storedConversation);
      setConversations(parsedConversation);
    }
    //eslint-disable-next-line
  }, [selectedConversation]);

  const filteredConversation = filterText
    ? conversations.filter(
        (conversation) =>
          conversation?.groupName
            ?.toLowerCase()
            .includes(filterText.toLowerCase()) ||
          conversation?.users[0]?.username
            .toLowerCase()
            .includes(filterText.toLocaleLowerCase()) ||
          conversation?.users[1]?.username
            .toLowerCase()
            .includes(filterText.toLocaleLowerCase())
      )
    : conversations;

  const users = allUsers
    ?.filter((user) => user._id !== auth?.user?._id)
    .map((user, index) => ({
      ...user,
      id: index + 1,
    }));

  const filteredUsers = filterText
    ? users.filter((user) =>
        user?.username?.toLowerCase().includes(filterText.toLowerCase())
      )
    : users;

  function getFirstTwoLetters(name) {
    const words = name?.split(" ");
    if (words.length === 1) {
      return name.charAt(0);
    }

    let result = "";
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      result += words[i].charAt(0);
    }

    return result;
  }

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  async function markConversationAsRead(selectedConversationId) {
    // handling mark as read on frontend
    const storedConversations = localStorage.getItem("allConversations");
    const parsedConversation = JSON.parse(storedConversations);
    let selectedConversation = parsedConversation.find(
      (conversation) => conversation._id === selectedConversationId
    );
    let selectedConversationIndex = parsedConversation.findIndex(
      (conversation) => conversation._id === selectedConversationId
    );
    const tempId = parsedConversation[
      selectedConversationIndex
    ].users.findIndex((user) => user.email === auth?.user?.email);
    if (selectedConversation) {
      let loggedInUserIndex = selectedConversation.users.findIndex(
        (user) => user.email === auth.user.email
      );
      if (loggedInUserIndex !== -1) {
        if (
          selectedConversation.users[loggedInUserIndex]
            .numberOfUnreadMessages !== 0
        ) {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_API}/api/v1/conversation/mark-conversation-read?conversationId=${selectedConversationId}&senderName=${auth.user.username}`
            );
            if (response.status === 200) {
              selectedConversation.users[
                loggedInUserIndex
              ].numberOfUnreadMessages = 0;
              parsedConversation[selectedConversationIndex].users[
                tempId
              ].numberOfUnreadMessages = 0;
              localStorage.setItem(
                "selectedConversation",
                JSON.stringify(selectedConversation)
              );
              localStorage.setItem(
                "allConversations",
                JSON.stringify(parsedConversation)
              );
              setConversations(parsedConversation);
              setSelectedConversation(selectedConversation);
            } else {
              console.error("Unexpected error:", response.status);
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
        }
      }
    }
    // handling mark as read on backend
  }

  const handleAddUserInGroup = (user) => {
    const userExists = groupList.some((groupUser) => groupUser.id === user.id);
    if (!userExists) {
      setGroupList([...groupList, user]);
    }
  };
  const handleRemoveUser = (delUser) => {
    setGroupList(groupList.filter((sel) => sel.id !== delUser.id));
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      toast.error("Group name is required");
      return;
    }

    try {
      setNewGroupConversationLoader(true);
      // socket.emit("makeNewGroupConversation", {
      //   groupName: groupName,
      //   senderId: auth.user._id,
      //   groupMembers: groupList,
      // });

      const groupData = new FormData();
      groupData.append("senderId", auth?.user._id);
      groupData.append("groupName", groupName);
      groupData.append("groupMembers", JSON.stringify(groupList));
      groupData.append(
        "groupProfilePic",
        groupProfilePic ? groupProfilePic : null
      );
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/conversation/new-group-conversation`,
        groupData
      );
      setGroupList([]);
      setCreatingNewGroup(false);
      setCreatNewChat(false);
      setGroupName("");
      setAskingGroupName("");
      setFilterText("");
      setProfilePicUrl("");
    } catch (error) {
      console.error(error);
      if (
        error.response.data.message === "Session expired!\nPlease login again."
      ) {
        toast.error(error.response.data.message);
        handleLogout();
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "auto",
          height: "100vh",
          padding: "2rem 15px 0",
          borderRight: "solid 1px #0f8fa9",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "50px",
            padding: "0px 15px",
          }}
        >
          <Typography
            style={{
              fontSize: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {isCreatingNewGroup ? "Add Users" : "Messaging"}
          </Typography>

          <IconButton
            style={{
              margin: "0px",
              padding: "0px",
              borderRadius: "5px",
            }}
            onClick={() => {
              setCreatNewChat(!iscreateNewChat);
              setCreatingNewGroup(false);
              setAskingGroupName(false);
              setSelectedConversation();
              setGroupName("");
              setAskingGroupName("");
              setFilterText("");
              setGroupList([]);
            }}
          >
            {iscreateNewChat ? (
              <CloseOutlinedIcon sx={{ color: "#0f8fa9" }} />
            ) : (
              <AddCommentOutlinedIcon sx={{ color: "#0f8fa9" }} />
            )}
          </IconButton>
        </Box>

        {isAskingGroupName ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 15px 5px 15px",
                width: "auto",
                height: "50px",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  cursor: "pointer",
                  height: "40px",
                  width: "40px",
                  margin: "0px 5px",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleOpenGroupProfilePictureInput}
              >
                <Avatar
                  src={profilePicUrl}
                  sx={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid #ddd",
                  }}
                />
                {hovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#fff",
                    }}
                  >
                    <PhotoCameraRoundedIcon style={{ fontSize: "20px" }} />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleSelectGroupProfilePicture}
                />
              </div>
              <TextField
                size="small"
                label="Group Name"
                variant="outlined"
                style={{ width: "calc(100% - 90px)" }}
                value={groupName}
                onChange={handleGroupNameChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && groupName.trim() !== "") {
                    e.preventDefault();
                    handleCreateGroup();
                  }
                }}
                fullWidth
                height="50px"
                InputProps={{
                  style: { borderRadius: "7px" },
                }}
              />
              <IconButton
                onClick={() => {
                  handleCreateGroup();
                }}
                disabled={!groupName}
                style={{ padding: "0", margin: "0" }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: "35px",
                    color: !groupName ? "grey" : "#0f8fa9",
                  }}
                />
              </IconButton>
            </Box>
          </>
        ) : (
          <div style={{ height: "calc(100% - 60px)" }}>
            {iscreateNewChat ? (
              <div style={{ height: "calc(100% - 70px)" }}>
                <Box
                  sx={{
                    padding: "5px 15px 5px 15px",
                    width: "auto",
                    height: "50px",
                    marginTop: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    placeholder="Search..."
                    variant="outlined"
                    size="small"
                    value={filterText}
                    style={{
                      width: isCreatingNewGroup ? "calc(100% - 50px)" : "100%",
                    }}
                    onChange={handleFilterChange}
                    height="50px"
                    InputProps={{
                      style: { borderRadius: "7px", padding: "0 0 0 10px" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon style={{ color: "grey" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {isCreatingNewGroup && (
                    <IconButton
                      onClick={() => {
                        setAskingGroupName(true);
                      }}
                      disabled={groupList.length <= 0}
                      style={{ padding: "0", margin: "0" }}
                    >
                      <ArrowCircleRight
                        sx={{
                          fontSize: "35px",
                          color: groupList.length <= 0 ? "grey" : "#0f8fa9",
                        }}
                      />
                    </IconButton>
                  )}
                </Box>
                <div
                  style={{ maxHeight: "calc(100% - 10px)", overflow: "auto" }}
                >
                  {isCreatingNewGroup ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        width: "100%",
                        overflow: "auto",
                        alignItems: "center",
                        padding: "5px 15px 5px 15px",
                      }}
                    >
                      {groupList.length > 0 ? (
                        <>
                          {groupList.map((user, index) => (
                            <UserBadgeItem
                              key={user._id}
                              user={user}
                              handleRemoveUser={handleRemoveUser}
                            />
                          ))}
                        </>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            // backgroundColor: "blue",
                          }}
                        >
                          <Typography variant="subtitle1">
                            Select users to add into group
                          </Typography>
                        </div>
                      )}
                    </Box>
                  ) : (
                    <>
                      {/* new group box */}
                      <Box
                        onClick={() => {
                          setCreatingNewGroup(true);
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          padding: "10px 15px 10px 20px",
                          cursor: "pointer",
                          gap: "13px",
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            backgroundColor: "#0f8fa9",
                            height: "35px",
                            width: "35px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #ddd",
                          }}
                        >
                          <Typography
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <GroupsOutlinedIcon style={{ fontSize: "20px" }} />
                          </Typography>
                        </Avatar>

                        <Typography
                          style={{
                            fontSize: "15px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "calc(100% - 20px)",
                            color: "#0f8fa9",
                          }}
                          variant="h6"
                        >
                          Create New Group
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Divider />
                  <div
                    style={{
                      overflow: "auto",
                      height: isCreatingNewGroup
                        ? `calc(100% - 210px)`
                        : `calc(100% - 160px)`,
                    }}
                  >
                    {allUsers ? (
                      <>
                        {filteredUsers.map((user, index) => (
                          <Box
                            key={index}
                            onClick={() => {
                              if (isCreatingNewGroup) {
                                handleAddUserInGroup(user);
                                setFilterText("");
                              } else {
                                handleNewConversation(user);
                                setSelectedConversation();
                                setFilterText("");
                                setCreatNewChat(false);
                              }
                            }}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              padding: "10px 20px",
                              cursor: "pointer",
                              gap: "10px",
                            }}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#0A97A422",
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "primary.light",
                                backgroundColor: "#0f8fa9",
                                height: "35px",
                                width: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid #ddd",
                              }}
                              src={user?.profilePic}
                            >
                              <Typography style={{ fontSize: "15px" }}>
                                {getFirstTwoLetters(user.username)}
                              </Typography>
                            </Avatar>
                            <div
                              style={{
                                height: "auto",
                                margin: "5px 0px 5px 5px",
                                fontSize: "15px",
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "calc(100%)",
                              }}
                              title={user.username}
                            >
                              {user.username}
                            </div>
                          </Box>
                        ))}
                      </>
                    ) : (
                      <div
                        // add some loading animation
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ height: "calc(100% - 50px)" }}>
                <Box
                  sx={{
                    padding: "5px 15px 5px 15px",
                    width: "auto",
                    height: "50px",
                    marginTop: "30px",
                  }}
                >
                  <TextField
                    placeholder="Search..."
                    variant="outlined"
                    size="small"
                    value={filterText}
                    fullWidth
                    onChange={handleFilterChange}
                    height="50px"
                    InputProps={{
                      style: { borderRadius: "7px", padding: "0 0 0 10px" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon style={{ color: "grey" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <div
                  style={{
                    overflow: "auto",
                    height: `calc(100% - 44px)`,
                  }}
                >
                  {newConversationLoader || newGroupConversationLoader ? (
                    <div
                      style={{
                        height: "100px",
                        flexDirection: "column",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress size={16} />
                      <div>Creating New Conversation</div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {conversations ? (
                    <>
                      {filteredConversation?.map((chat, index) => (
                        <Box
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            padding: "10px 15px 10px 20px",
                            cursor: "pointer",
                            gap: "10px",
                          }}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#0A97A422",
                            },
                          }}
                          onClick={() => {
                            markConversationAsRead(chat._id);
                            setFilterText("");
                            setDeletingMessageLoader(false);
                            setClearingConversationLoader(false);
                            setDeletingConversationLoader(false);
                            setSelectedConversation(chat);
                            localStorage.setItem(
                              "selectedConversation",
                              JSON.stringify(chat || {})
                            );
                            if (selectedConversation?._id !== chat._id) {
                              setSelectedMessages([]);
                              setConversationMessages([]);
                              fetchSingleConversation(chat);
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "primary.light",
                              backgroundColor: "#0f8fa9",
                              height: "35px",
                              width: "35px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #ddd",
                            }}
                            src={
                              !chat.isGroupChat
                                ? getSenderProfilePic(auth?.user, chat?.users)
                                : chat?.groupProfilePic
                            }
                          >
                            {chat.isGroupChat ? <GroupsIcon /> : <PersonIcon />}
                          </Avatar>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: `calc(100% - 70px)`,
                            }}
                          >
                            <div
                              style={{
                                height: "auto",
                                margin: "5px 0px 5px 5px",
                                fontSize: "15px",
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "calc(100% - 20px)",
                              }}
                            >
                              {!chat.isGroupChat ? (
                                <>{getSender(auth?.user, chat.users)}</>
                              ) : (
                                chat.groupName
                              )}
                            </div>

                            {/* add last message of the user from conversation */}
                            <div
                              style={{
                                color: "#5d5d5d",
                                textAlign: "left",
                                margin: "0 10px 4px 6px",
                                fontSize: "10px",
                                width: `calc(100% - 20px)`,
                                maxHeight: "25px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {chat.isGroupChat && (
                                <>
                                  {chat.latestMessage?.senderName?.length > 10
                                    ? chat.latestMessage?.senderName?.substring(
                                        0,
                                        10
                                      ) + "... "
                                    : chat.latestMessage?.senderName}
                                  {chat.latestMessage?.senderName?.length > 0
                                    ? ": "
                                    : ""}
                                </>
                              )}
                              {chat.latestMessage?.message}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {chat._id !== selectedConversation?._id && (
                              <>
                                {chat.users.map((user) => {
                                  if (user.email === auth?.user?.email) {
                                    return (
                                      <Badge
                                        key={user._id}
                                        badgeContent={
                                          user.numberOfUnreadMessages
                                        }
                                        max={9}
                                        color="info"
                                      />
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </>
                            )}
                          </div>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Box>
    </>
  );
};

export default MyChats;
