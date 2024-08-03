import React, { createContext, useState, useContext, useEffect } from "react";
import { useSocket } from "./socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [socket] = useSocket();
  const [notificationCount, setNotificationCount] = useState(0);

  const increaseNotificationCount = () => {
    setNotificationCount((prevCount) => prevCount + 1);
  };

  const decreaseNotificationCount = (count) => {
    setNotificationCount((prevCount) => prevCount - count);
  };

  const handleNewNotification = async () => {
    increaseNotificationCount();
  };

  useEffect(() => {
    socket?.on("notificationIsRead", (count) => {
      decreaseNotificationCount(count);
    });
    socket?.on("newNotification", handleNewNotification);
    socket?.on("assetSharingNotification", handleNewNotification);
    socket?.on("assetRemovalNotification", handleNewNotification);
    socket?.on("departmentSharingNotification", handleNewNotification);
    socket?.on("departmentRemovalNotification", handleNewNotification);

    return () => {
      socket?.removeAllListeners("notificationIsRead");
      socket?.removeAllListeners("newNotification");
      socket?.removeAllListeners("assetSharingNotification");
      socket?.removeAllListeners("assetRemovalNotification");
      socket?.removeAllListeners("departmentSharingNotification");
      socket?.removeAllListeners("departmentRemovalNotification");
    };
    // eslint-disable-next-line
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={[
        notificationCount,
        setNotificationCount,
        increaseNotificationCount,
      ]}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
