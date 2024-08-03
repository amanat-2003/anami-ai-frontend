import "./NotificationsPage.css";

import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth.js";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { Box, IconButton, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useSocket } from "../context/socket.js";
import { useNotificationContext } from "../context/notification.js";

import LeftSideDrawer from "../components/LeftSideDrawer.js";
import NotificationListPanel from "../components/notificationPage/NotificationListPanel.js";
import NotificationDetailPanel from "../components/notificationPage/NotificationDetailPanel.js";

const NotificationsPage = () => {
  const [socket] = useSocket();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [, , increaseNotificationCount] = useNotificationContext();

  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedControl, setSelectedControl] = useState(1);
  const [allNotifications, setAllNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [isMainDrawerOpen, setIsMainDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isSingleNotificationSelected, setSingleNotificationSelected] =
    useState(false);

  const handleCloseMainDrawer = () => {
    setIsMainDrawerOpen(false);
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
  };

  useEffect(() => {
    if (auth.user === null && auth.token === "") {
      navigate("/login");
      localStorage.clear();
      toast.success("Logout successful");
    } else if (auth.user) {
      fetchAllNotifications();
    }
    // eslint-disable-next-line
  }, [auth]);

  useEffect(() => {
    const handleNewNotification = (newNotification) => {
      increaseNotificationCount();
      setAllNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
      setUnreadNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("assetSharingNotification", handleNewNotification);
    socket.on("assetRemovalNotification", handleNewNotification);
    socket.on("departmentSharingNotification", handleNewNotification);
    socket.on("departmentRemovalNotification", handleNewNotification);

    return () => {
      socket.removeAllListeners("newNotification");
      socket.removeAllListeners("assetSharingNotification");
      socket.removeAllListeners("assetRemovalNotification");
      socket.removeAllListeners("departmentSharingNotification");
      socket.removeAllListeners("departmentRemovalNotification");
    };

    // eslint-disable-next-line
  }, [socket]);

  const sideControls = [
    { id: 1, name: "All" },
    { id: 2, name: "Read" },
    { id: 3, name: "Unread" },
  ];

  const getFilteredNotifications = () => {
    switch (selectedControl) {
      case 1:
        return allNotifications;
      case 2:
        return readNotifications;
      case 3:
        return unreadNotifications;
      default:
        return allNotifications;
    }
  };

  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      setSelectedNotification([]);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/notification/fetch-all-notifications`,
        {
          params: { recipientId: auth?.user?._id },
        }
      );
      if (response.status === 200) {
        const notifications = (response.data?.notificationList || [])?.sort(
          (a, b) => {
            // Sort by createdAt in descending order
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
        );
        setAllNotifications(notifications);
        setReadNotifications(
          notifications.filter((notification) => notification.isRead)
        );
        setUnreadNotifications(
          notifications.filter((notification) => !notification.isRead)
        );
        // localStorage.setItem(
        //   "allNotifications",
        //   JSON.stringify(notifications || [])
        // );
      } else {
        console.error("Unexpected error:", response.status);
      }
      setLoading(false);
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

  const makeNotificationsRead = async (unreadSelectedNotifications) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/notification/read-notifications`,
        {
          notificationList: unreadSelectedNotifications,
          userId: auth.user._id,
        }
      );
      if (response.status === 200) {
        const updatedNotifications = allNotifications.map((notification) => {
          if (unreadSelectedNotifications.includes(notification)) {
            return { ...notification, isRead: true };
          }
          return notification;
        });

        setAllNotifications(updatedNotifications);
        setReadNotifications(
          updatedNotifications.filter((notification) => notification.isRead)
        );
        setUnreadNotifications(
          updatedNotifications.filter((notification) => !notification.isRead)
        );
        // localStorage.setItem(
        //   "allNotifications",
        //   JSON.stringify(updatedNotifications || [])
        // );

        setSelectAll(false);
        setSelectedNotifications([]);
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const deleteNotifications = async (selectedNotifications) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/notification/delete-notifications`,
        { notificationList: selectedNotifications, userId: auth.user._id }
      );
      if (response.status === 200) {
        const updatedNotifications = allNotifications.filter(
          (notification) => !selectedNotifications.includes(notification)
        );

        setAllNotifications(updatedNotifications);
        setReadNotifications(
          updatedNotifications.filter((notification) => notification.isRead)
        );
        setUnreadNotifications(
          updatedNotifications.filter((notification) => !notification.isRead)
        );
        // localStorage.setItem(
        //   "allNotifications",
        //   JSON.stringify(updatedNotifications || [])
        // );

        setSelectAll(false);
        setSelectedNotifications([]);
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const readSingleNotification = async (clickedNotification) => {
    try {
      const unreadClickedNotifications = allNotifications.filter(
        (notification) => notification._id === clickedNotification._id
      );
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/notification/read-notifications`,
        {
          notificationList: unreadClickedNotifications,
          userId: auth.user._id,
        }
      );
      if (response.status === 200) {
        const updatedNotifications = allNotifications.map((notification) => {
          if (unreadClickedNotifications.includes(notification)) {
            return { ...notification, isRead: true };
          }
          return notification;
        });
        setAllNotifications(updatedNotifications);
        // localStorage.setItem(
        //   "allNotifications",
        //   JSON.stringify(updatedNotifications || [])
        // );

        setReadNotifications(
          updatedNotifications.filter((notification) => notification.isRead)
        );
        setUnreadNotifications(
          updatedNotifications.filter((notification) => !notification.isRead)
        );
        setSelectAll(false);
        setSelectedNotifications([]);
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  const deleteSingleNotification = async (clickedNotification) => {
    try {
      const clickedNotifications = allNotifications.filter(
        (notification) => notification._id === clickedNotification._id
      );
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/notification/delete-notifications`,
        { notificationList: clickedNotifications, userId: auth.user._id }
      );
      if (response.status === 200) {
        const updatedNotifications = allNotifications.filter(
          (notification) => !clickedNotifications.includes(notification)
        );

        setAllNotifications(updatedNotifications);
        setReadNotifications(
          updatedNotifications.filter((notification) => notification.isRead)
        );
        setUnreadNotifications(
          updatedNotifications.filter((notification) => !notification.isRead)
        );
        // localStorage.setItem(
        //   "allNotifications",
        //   JSON.stringify(updatedNotifications || [])
        // );

        setSelectAll(false);
        setSelectedNotifications([]);
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };

  document.title = "ZippiAi - Notifications";

  return (
    <Box sx={{ display: "flex", margin: "0" }}>
      <LeftSideDrawer
        pageKey={"Notifications"}
        handleLogout={handleLogout}
        isMainDrawerOpen={isMainDrawerOpen}
        setIsMainDrawerOpen={setIsMainDrawerOpen}
        handleCloseMainDrawer={handleCloseMainDrawer}
      />
      <Box
        sx={{
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFF",
            paddingBlock: "2rem",
            height: `calc(100vh)`,
            position: "relative",
          }}
          className="notifications-main-container"
        >
          {isMainDrawerOpen && (
            <Tooltip
              title="Close Navbar"
              aria-label="Close Navbar"
              placement="right"
              arrow
            >
              <IconButton
                onClick={handleCloseMainDrawer}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0px",
                  borderRadius: "0px",
                  padding: "10px 0px",
                  background: "transparent",
                  zIndex: "99",
                }}
                sx={{
                  "&:hover": {
                    color: "#000",
                  },
                }}
              >
                <ChevronLeftIcon style={{ fontSize: "25px" }} />
              </IconButton>
            </Tooltip>
          )}
          {!isSingleNotificationSelected ? (
            <NotificationListPanel
              loading={loading}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              sideControls={sideControls}
              selectedControl={selectedControl}
              setSelectedControl={setSelectedControl}
              notificationList={getFilteredNotifications()}
              deleteNotifications={deleteNotifications}
              makeNotificationsRead={makeNotificationsRead}
              selectedNotifications={selectedNotifications}
              readSingleNotification={readSingleNotification}
              setSelectedNotification={setSelectedNotification}
              setSelectedNotifications={setSelectedNotifications}
              deleteSingleNotification={deleteSingleNotification}
              setSingleNotificationSelected={setSingleNotificationSelected}
            />
          ) : (
            <NotificationDetailPanel
              handleLogout={handleLogout}
              selectedNotification={selectedNotification}
              setSingleNotificationSelected={setSingleNotificationSelected}
            />
          )}
        </div>
      </Box>
    </Box>
  );
};

export default NotificationsPage;
