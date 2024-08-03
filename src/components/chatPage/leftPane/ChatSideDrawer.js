import React, { useState } from "react";
import {
  Box,
  Menu,
  Drawer,
  Button,
  styled,
  Tooltip,
  MenuItem,
  IconButton,
  Typography,
  CardActions,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListItemIcon from "@mui/material/ListItemIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WestRoundedIcon from "@mui/icons-material/WestRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderColor: "transparent",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const ChatItem = ({
  chat,
  fetchChat,
  selectedChat,
  openComponent,
  selectedChats,
  handleUpdateChat,
  handleChatSelection,
  handleOpenChatDeleteDialog,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [chatName, setChatName] = useState("");
  const [utilityIcons, setUtilityIcons] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setChatName("");
    setIsEditing(false);
  };

  const handleSwitchIcons = (val) => {
    setUtilityIcons(val);
  };

  const handleRenameClick = (e) => {
    setChatName(chat.chatName);
    handleSwitchIcons(false);
    handleOpenEdit();
    handleClose();
    e.stopPropagation();
  };

  const handleDeleteClick = (e) => {
    handleOpenChatDeleteDialog(chat);
    handleClose();
    e.stopPropagation();
  };

  const handleSaveClick = (chat, chatName) => {
    handleUpdateChat(chat._id, chatName);
    handleCloseEdit();
    handleSwitchIcons(true);
  };

  const open = Boolean(anchorEl);

  return (
    <div
      style={{
        marginTop: "0px",
        cursor: "pointer",
        transition: "background-color 0.5s ease",
        backgroundColor:
          selectedChat?._id === chat._id ? "#FFF5" : "transparent",
        color: "#000",
        border: "1px solid #EEE",
        borderRadius: "15px",
      }}
      onClick={() => {
        if (chat._id !== selectedChat?._id) {
          fetchChat(chat);
          setIsEditing(false);
          setUtilityIcons(true);
        }
        openComponent("MainChatSection");
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardActions
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "35px",
          paddingLeft: "0",
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={chatName}
            onChange={(event) => setChatName(event.target.value)}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              fontSize: "14px",
              width: `calc(100%)`,
              border: "none",
              outline: "none",
              background: "transparent",
              marginLeft: "13px",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "75%",
            }}
          >
            {(isHovered || selectedChats?.length > 0) && (
              <Checkbox
                color="primary"
                size="small"
                style={{
                  cursor: "default",
                  padding: "2px 2px 2px 2px",
                  borderRadius: "2px",
                  position: "relative",
                  left: "-5px",
                  zIndex: 2,
                }}
                checked={selectedChats.includes(chat)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChatSelection(chat);
                }}
              />
            )}
            <Typography
              style={{
                fontSize: "14px",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                paddingLeft:
                  isHovered || selectedChats?.length > 0 ? "0px" : "24px",
              }}
              title={chat.chatName}
            >
              {chat.chatName}
            </Typography>
          </div>
        )}
        {isHovered && utilityIcons && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: `calc(25px)`,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                handleClick(e);
                e.stopPropagation();
              }}
              style={{
                margin: "0px",
              }}
            >
              <MoreVertIcon
                style={{
                  fontSize: "20px",
                  color: "#3C4043",
                  cursor: "default",
                }}
              />
            </IconButton>
          </div>
        )}
        {isEditing && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: `calc(50px)`,
            }}
          >
            <Tooltip title={"Save"} arrow>
              <IconButton
                size="small"
                aria-label="Save"
                style={{
                  margin: "0px",
                  padding: "0px",
                  background: "transparent",
                }}
                onClick={(e) => {
                  handleSaveClick(chat, chatName);
                  e.stopPropagation();
                }}
              >
                <CheckRoundedIcon
                  style={{
                    fontSize: "20px",
                    color: "#3C4043",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Cancel"} arrow>
              <IconButton
                size="small"
                aria-label="Cancel"
                style={{
                  margin: "0px",
                  padding: "0px",
                  background: "transparent",
                }}
                onClick={(e) => {
                  handleSwitchIcons(true);
                  handleCloseEdit();
                  e.stopPropagation();
                }}
              >
                <CloseRoundedIcon
                  style={{
                    fontSize: "20px",
                    color: "#3C4043",
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        )}
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
          <MenuItem onClick={handleRenameClick}>
            <ListItemIcon>
              <DriveFileRenameOutlineRoundedIcon
                style={{
                  fontSize: "20px",
                  color: "#3C4043",
                }}
              />
            </ListItemIcon>
            Rename
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteSweepOutlinedIcon
                style={{
                  fontSize: "20px",
                  color: "#3C4043",
                }}
              />
            </ListItemIcon>
            Delete
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" style={{ color: "#777" }}>
              {chat && new Date(chat.updatedAt).toLocaleDateString()}
            </Typography>
          </MenuItem>
        </Menu>
      </CardActions>
    </div>
  );
};

export default function ChatSideDrawer(props) {
  const {
    chats,
    fetchChat,
    drawerWidth,
    selectedChat,
    openComponent,
    selectedAsset,
    handleNewChat,
    selectedChats,
    hasDialogShown,
    activeComponent,
    handleUpdateChat,
    isOpenLeftDrawer,
    setSelectedChats,
    handleOpenChatDeleteDialog,
    handleOpenNoteCloseConfirmDialog,
    handleOpenMultipleChatDeleteDialog,
  } = props;

  const handleChatSelection = (selectedChat) => {
    const chatIndex = selectedChats.findIndex(
      (chat) => chat?._id === selectedChat?._id
    );
    if (chatIndex !== -1) {
      setSelectedChats((prevSelectedChats) =>
        prevSelectedChats.filter((chat, index) => index !== chatIndex)
      );
    } else {
      setSelectedChats((prevSelectedChats) => [
        ...prevSelectedChats,
        selectedChat,
      ]);
    }
  };

  const handleSelectAllChats = () => {
    if (selectedChats.length === chats.length) {
      setSelectedChats([]);
    } else {
      setSelectedChats(chats);
    }
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 1,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          height: `calc(100vh)`,
          boxSizing: "border-box",
          backgroundImage:
            "linear-gradient(193deg, #fef2e9, #faeded, #f6ebf1, #f0ecf5, #e9f1f8, #e7f5f6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "0px 20px",
          borderBottom: "solid 1px #53267E22",
        },
      }}
      variant="persistent"
      anchor="left"
      open={isOpenLeftDrawer}
    >
      <DrawerHeader
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "35px 10px 25px 10px",
          // cursor: "pointer",
          width: "100%",
        }}
        // onClick={handleLogo}
      >
        <img
          src="/images/ZippiAiLogo.png"
          alt="Logo"
          style={{
            maxWidth: "150px",
            paddingRight: "10px",
          }}
        />
      </DrawerHeader>
      <div
        style={{
          textAlign: "left",
          fontSize: "15px",
          marginLeft: "10px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          columnGap: "10px",
          cursor: "pointer",
          color: "#0f8fa9",
        }}
        onClick={() => {
          if (
            activeComponent === "AddNote" ||
            activeComponent === "UpdateNote"
          ) {
            if (hasDialogShown) {
              window.history.go(-1);
            } else {
              handleOpenNoteCloseConfirmDialog();
            }
          } else {
            window.history.go(-1);
          }
        }}
      >
        <WestRoundedIcon style={{ fontSize: "22px" }} />
        Back
      </div>
      {/* Chat History */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "auto",
        }}
      >
        <div style={{ padding: "0px 0px 15px 0px" }}>
          <Button
            startIcon={<AddIcon />}
            disabled={
              Boolean(!selectedChat) && activeComponent === "MainChatSection"
            }
            fullWidth
            onClick={handleNewChat}
            sx={{
              backgroundColor: "#FFF5",
              color: "#0f8fa9",
            }}
          >
            New Chat
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            style={{
              textAlign: "left",
              fontSize: "16px",
              fontWeight: "500",
              marginLeft: "10px",
            }}
          >
            Recent chats
          </Typography>
        </div>
        {selectedChats.length > 0 && (
          <div
            style={{
              marginTop: "5px",
              transition: "background-color 0.5s ease",
              backgroundColor: "#AAA6",
              color: "#000",
              borderRadius: "15px",
            }}
          >
            <CardActions
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "35px",
                paddingLeft: "0",
                width: `calc(100%)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "calc(100% - 25px)",
                }}
              >
                <Tooltip
                  title={
                    selectedChats.length === chats.length
                      ? "Deselect All"
                      : "Select All"
                  }
                  arrow
                >
                  <Checkbox
                    color="primary"
                    size="small"
                    style={{
                      cursor: "default",
                    }}
                    checked={selectedChats.length === chats.length}
                    onClick={handleSelectAllChats}
                  />
                </Tooltip>
                <Typography
                  style={{
                    fontSize: "14px",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={`${selectedChats?.length} selected`}
                >
                  {selectedChats?.length} selected
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: `calc(25px)`,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    handleOpenMultipleChatDeleteDialog();
                    e.stopPropagation();
                  }}
                  disabled={selectedChats?.length <= 0}
                  style={{
                    margin: "0px",
                  }}
                >
                  <DeleteOutlineOutlinedIcon
                    style={{
                      fontSize: "20px",
                      color: selectedChats?.length <= 0 ? "#999" : "#3C4043",
                      cursor: "default",
                    }}
                  />
                </IconButton>
              </div>
            </CardActions>
          </div>
        )}
        {selectedAsset && (
          <>
            <div
              style={{
                overflow: "auto",
                marginBottom: "20px",
                height: "100%",
              }}
            >
              {/* Chat History buttons here */}
              {chats.length === 0 ? (
                <Typography
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#888",
                    height: "100%",
                  }}
                >
                  No chats available. You can save and access your chats here.
                </Typography>
              ) : (
                <>
                  {chats.map((chat, index) => (
                    <ChatItem
                      key={index}
                      chat={chat}
                      fetchChat={fetchChat}
                      selectedChat={selectedChat}
                      openComponent={openComponent}
                      handleUpdateChat={handleUpdateChat}
                      handleOpenChatDeleteDialog={handleOpenChatDeleteDialog}
                      handleChatSelection={handleChatSelection}
                      selectedChats={selectedChats}
                      handleOpenMultipleChatDeleteDialog={
                        handleOpenMultipleChatDeleteDialog
                      }
                      handleSelectAllChats={handleSelectAllChats}
                    />
                  ))}
                </>
              )}
            </div>
          </>
        )}
      </Box>
    </Drawer>
  );
}
