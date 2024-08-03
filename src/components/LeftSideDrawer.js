import React from "react";
import { styled } from "@mui/material/styles";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/auth.js";
import { useNotificationContext } from "../context/notification.js";
import { useConversationContext } from "../context/conversation.js";

import { Box, Badge, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";

import ProfilePopup from "./ProfilePopup.js";

const userMenuItems = [
  // {
  //   key: "Dashboard",
  //   icon: <DashboardRoundedIcon style={{ fontSize: "20px" }} />,
  //   text: "Dashboard",
  //   link: "/user",
  // },
  {
    key: "Departments",
    icon: <AccountBalanceRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Departments",
    link: "/user/departments",
  },
  {
    key: "Assets",
    icon: <CategoryRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Assets",
    link: "/user/assets",
  },
  {
    key: "Notifications",
    icon: <NotificationsRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Notifications",
    link: "/user/notifications",
    badge: "0",
  },
  {
    key: "Chat",
    icon: <ForumRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Chat",
    link: "/user/chats",
    badge: "0",
  },
];

const adminMenuItems = [
  {
    key: "Dashboard",
    icon: <DashboardRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Dashboard",
    link: "/admin",
  },
  {
    key: "Departments",
    icon: <AccountBalanceRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Departments",
    link: "/admin/departments",
  },
  {
    key: "Assets",
    icon: <CategoryRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Assets",
    link: "/admin/assets",
  },
  {
    key: "Notifications",
    icon: <NotificationsRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Notifications",
    link: "/admin/notifications",
    badge: "0",
  },
  {
    key: "Users",
    icon: <PeopleAltIcon style={{ fontSize: "20px" }} />,
    text: "Users",
    link: "/admin/users",
  },
  {
    key: "Documents",
    icon: <ArticleIcon style={{ fontSize: "20px" }} />,
    text: "Documents",
    link: "/admin/documents",
  },
  {
    key: "Chat",
    icon: <ForumRoundedIcon style={{ fontSize: "20px" }} />,
    text: "Chat",
    link: "/admin/chats",
    badge: "0",
  },
];

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  backgroundSize: "contain", // or "contain"
  backgroundRepeat: "no-repeat",
  overflowX: "hidden",
  overflowY: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderColor: "transparent",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "isMainDrawerOpen",
})(({ theme, isMainDrawerOpen }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  borderColor: "none",
  ...(isMainDrawerOpen && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundImage:
        "linear-gradient(193deg, #fef2e9, #faeded, #f6ebf1, #f0ecf5, #e9f1f8, #e7f5f6)",
      padding: "0 0 10px 0",
    },
  }),
  ...(!isMainDrawerOpen && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundImage:
        "linear-gradient(193deg, #fef2e9, #faeded, #f6ebf1, #f0ecf5, #e9f1f8, #e7f5f6)",
      padding: "0 0 10px 0",
    },
  }),
}));

const LeftSideDrawer = (props) => {
  const { handleLogout, pageKey, isMainDrawerOpen, setIsMainDrawerOpen } =
    props;
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [notificationCount] = useNotificationContext();
  const [unreadConversationCount] = useConversationContext();

  let menuItems = auth?.user?.role === 0 ? userMenuItems : adminMenuItems;

  const handleLogo = () => {
    auth?.user?.role === 0 ? navigate("/user") : navigate("/admin");
  };

  const handleOpenMainDrawer = () => {
    setIsMainDrawerOpen(true);
  };

  return (
    <StyledDrawer variant="permanent" isMainDrawerOpen={isMainDrawerOpen}>
      <DrawerHeader
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "35px 10px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {isMainDrawerOpen ? (
          <>
            <img
              src="/images/ZippiAiLogo.png"
              alt="Logo"
              style={{
                maxWidth: "150px",
                padding: "3px 10px",
              }}
              onClick={handleLogo}
            />
            {/* <IconButton onClick={handleDrawerOpening} >
                <ChevronLeftIcon />
              </IconButton> */}
          </>
        ) : (
          <IconButton onClick={handleOpenMainDrawer}>
            <MenuIcon />
          </IconButton>
        )}
      </DrawerHeader>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "auto",
          width: drawerWidth,
          gap: "25px",
          color: "#777",
          padding: "20px 5px 0 5px",
        }}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.link}
            onClick={() => {
              if (item.text === "Departments") {
                localStorage.removeItem("selectedDepartment");
              }
            }}
            style={{
              textDecoration: "none",
              display: "block",
              color: pageKey === item.key ? "#000" : "#777",
              padding: isMainDrawerOpen ? "0px 20px 0 25px" : "0px 15px 0 15px",
            }}
          >
            <div
              key={item.key}
              style={{
                display: "flex",
                justifyContent: isMainDrawerOpen
                  ? "space-between"
                  : "flex-start",
                alignItems: "center",
                fontSize: "15px",
                cursor: "pointer",
                width: "100%",
                fontWeight: pageKey === item.key ? 500 : 400,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: isMainDrawerOpen
                    ? "space-between"
                    : "flex-start",
                  alignItems: "center",
                  width: "calc(100%)",
                  gap: "5px",
                  fontSize: "15px",
                  cursor: "pointer",
                  fontWeight: pageKey === item.key ? 500 : 400,
                }}
                title={item.text}
              >
                {item.icon}
                {isMainDrawerOpen ? (
                  <div
                    style={{
                      width: "calc(100% - 30px)",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.text}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {isMainDrawerOpen && (
                <>
                  {item.text === "Notifications" && notificationCount > 0 && (
                    <Badge
                      badgeContent={notificationCount}
                      max={9}
                      color="success"
                    />
                  )}
                  {item.text === "Chat" && unreadConversationCount > 0 && (
                    <Badge
                      badgeContent={unreadConversationCount}
                      max={9}
                      color="success"
                    />
                  )}
                </>
              )}
            </div>
          </NavLink>
        ))}
      </Box>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            cursor: "pointer",
            alignItems: "center",
            gap: "5px",
            margin: "6px 5px 15px 5px",
            padding: isMainDrawerOpen ? "0px 5px 0 25px" : "0px 5px 0 15px",

            width: "calc(100%)",
            fontSize: "13px",
            fontWeight: "400",
          }}
          onClick={() => {
            navigate(`/help`);
          }}
        >
          <HeadsetMicRoundedIcon sx={{ fontSize: "21px", color: "grey" }} />
          {isMainDrawerOpen ? (
            <div
              style={{
                width: "calc(100% - 30px)",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              Help And Support
            </div>
          ) : (
            <></>
          )}
        </div>
        <div
          style={{
            padding: isMainDrawerOpen ? "5px 5px 5px 20px" : "5px 5px 5px 10px",
          }}
        >
          {auth?.user && (
            <ProfilePopup auth={auth} handleLogout={handleLogout} />
          )}
        </div>
      </div>
    </StyledDrawer>
  );
};

export default LeftSideDrawer;
