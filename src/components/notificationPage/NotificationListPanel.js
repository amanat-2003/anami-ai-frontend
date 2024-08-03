import React from "react";

import {
  Box,
  Tab,
  Tabs,
  Button,
  Tooltip,
  Checkbox,
  Typography,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from "@mui/material";
import MarkAsUnreadOutlinedIcon from "@mui/icons-material/MarkAsUnreadOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const cellStyle = {
  textAlign: "center",
  padding: "2px",
  color: "#000",
  border: "1px solid #7772",
  cursor: "pointer",
};

const headerCellStyle = {
  textAlign: "center",
  padding: "7px",
  color: "#FFF",
  background: "#0f8fa9",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const lightCellStyle = {
  textAlign: "center",
  padding: "2px",
  color: "#000",
  border: "1px solid #7772",
  backgroundColor: "#e7f5f6",
};

const NotificationListPanel = (props) => {
  const {
    loading,
    selectAll,
    setSelectAll,
    sideControls,
    selectedControl,
    notificationList,
    setSelectedControl,
    deleteNotifications,
    makeNotificationsRead,
    selectedNotifications,
    readSingleNotification,
    setSelectedNotification,
    setSelectedNotifications,
    deleteSingleNotification,
    setSingleNotificationSelected,
  } = props;

  const handleControlChange = (event, newValue) => {
    setSelectedControl(newValue);
  };

  const handleCheckboxClick = (notification) => {
    if (selectedNotifications.includes(notification)) {
      setSelectedNotifications(
        selectedNotifications.filter((noti) => noti._id !== notification._id)
      );
    } else {
      setSelectedNotifications([...selectedNotifications, notification]);
    }
  };

  const handleSelectAllClick = () => {
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notificationList);
    }
    setSelectAll(!selectAll);
  };

  return (
    <>
      <Box
        style={{
          backgroundColor: "#FFF",
          height: `calc(100%)`,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "50px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              fontFamily: "Inter",
              fontSize: "24px",
              textalign: "left",
              color: "#000",
            }}
          >
            Notifications
          </div>
        </Box>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            background: "#0f8fa911",
            margin: "35px 0 0 0",
          }}
        >
          <div style={{ display: "flex", flexGrow: 1 }}>
            <Tabs
              value={selectedControl}
              onChange={handleControlChange}
              indicatorColor="primary"
              textColor="primary"
            >
              {sideControls.map((control) => (
                <Tab key={control.id} label={control.name} value={control.id} />
              ))}
            </Tabs>
          </div>
          <div style={{ display: "flex", flexGrow: 1, height: "100%" }}>
            {notificationList.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  height: "100%",
                  gap: "15px",
                  flexGrow: 1,
                }}
              >
                {selectedNotifications.length > 0 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginInline: "10px",
                      }}
                    >
                      {/* Check if there are unread notifications in selectedNotifications */}
                      {selectedNotifications.some(
                        (notification) => !notification.isRead
                      ) && (
                        <Button
                          variant="text"
                          onClick={() => {
                            const unreadSelectedNotifications =
                              selectedNotifications.filter(
                                (notification) => !notification.isRead
                              );
                            makeNotificationsRead(unreadSelectedNotifications);
                          }}
                          startIcon={
                            <MarkAsUnreadOutlinedIcon
                              sx={{ color: "#000", fontSize: "14px" }}
                            />
                          }
                        >
                          <Typography
                            sx={{
                              color: "#000",
                              fontSize: "12px",
                              fontFamily: "Inter",
                            }}
                          >
                            Mark as read
                          </Typography>
                        </Button>
                      )}

                      <Button
                        variant="text"
                        onClick={() => {
                          deleteNotifications(selectedNotifications);
                        }}
                        startIcon={
                          <DeleteOutlineOutlinedIcon
                            sx={{ color: "#000", fontSize: "14px" }}
                          />
                        }
                      >
                        <Typography
                          sx={{
                            color: "#000",
                            fontSize: "12px",
                            fontFamily: "Inter",
                          }}
                        >
                          Delete
                        </Typography>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div
          style={{
            height: "calc(100% - 125px)",
            minHeight: "200px",
            overflow: "auto",
            position: "relative",
          }}
        >
          {loading ? (
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
          ) : (
            <div style={{ height: "100px", position: "relative" }}>
              {notificationList.length > 0 ? (
                <TableContainer
                  style={{
                    maxWidth: "100%",
                    overflow: "auto",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ ...headerCellStyle, width: "0px" }}>
                          <Checkbox
                            color="primary"
                            checked={selectAll}
                            onChange={handleSelectAllClick}
                          />
                        </TableCell>
                        <TableCell style={headerCellStyle}>Sender</TableCell>
                        <TableCell style={headerCellStyle}>Time</TableCell>
                        <TableCell style={headerCellStyle}>Type</TableCell>
                        <TableCell style={headerCellStyle}>Content</TableCell>
                        <TableCell style={headerCellStyle}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {notificationList.map((notification, index) => (
                        <TableRow
                          key={index}
                          style={
                            notification.isRead ? cellStyle : lightCellStyle
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNotification(notification);
                            setSingleNotificationSelected(true);
                            if (!notification.isRead) {
                              readSingleNotification(notification);
                            }
                          }}
                        >
                          <TableCell
                            style={cellStyle}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckboxClick(notification);
                            }}
                          >
                            <Checkbox
                              color="primary"
                              checked={
                                selectAll ||
                                selectedNotifications.includes(notification)
                              }
                            />
                          </TableCell>
                          <TableCell style={{ ...cellStyle, width: "15%" }}>
                            <div>{notification.senderName}</div>
                          </TableCell>
                          <TableCell style={{ ...cellStyle, width: "15%" }}>
                            <div>
                              {new Date(
                                notification?.createdAt
                              ).toLocaleDateString()}{" "}
                              {new Date(
                                notification?.createdAt
                              ).toLocaleTimeString("en-US", {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </TableCell>
                          <TableCell style={cellStyle}>
                            {notification.type}
                          </TableCell>

                          <TableCell
                            style={{
                              ...cellStyle,
                              textAlign: "left",
                              padding: "15px 20px",
                              width: "200px",
                              maxWidth: "500px",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {notification?.content}
                            </div>
                          </TableCell>

                          <TableCell style={{ ...cellStyle, width: "100px" }}>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: "center",
                              }}
                            >
                              {!notification.isRead && (
                                <Tooltip title="Mark as read" placement="top">
                                  <IconButton
                                    style={{ padding: 0 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      readSingleNotification(notification);
                                    }}
                                  >
                                    <MarkEmailReadOutlinedIcon
                                      style={{ fontSize: "18px" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Delete" placement="top">
                                <IconButton
                                  style={{ padding: 0 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    deleteSingleNotification(notification);
                                  }}
                                >
                                  <DeleteOutlineOutlinedIcon
                                    style={{ fontSize: "18px" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60vh",
                  }}
                >
                  No Notifications
                </div>
              )}
            </div>
          )}
        </div>
      </Box>
    </>
  );
};

export default NotificationListPanel;
