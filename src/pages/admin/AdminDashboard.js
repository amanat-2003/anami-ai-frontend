import "./AdminDashboard.css";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.js";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Table,
  Select,
  Tooltip,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  Typography,
  FormControl,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import { axisClasses } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import LeftSideDrawer from "../../components/LeftSideDrawer.js";
import UserCard from "../../components/admin/dashboard/UserCard.js";
import AssetCard from "../../components/admin/dashboard/AssetCard.js";
import DepartmentCard from "../../components/admin/dashboard/DepartmentCard.js";

const COLORS = ["#53b7cc", "#a07bd3", "#c269a1", "#6caceb", "#dc7d81"];
const boxStyle = {
  height: "100px",
  minWidth: "200px",
  flexShrink: 1,
  flexGrow: 1,
  backgroundColor: "#fafafa",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px",
  cursor: "pointer",
};

const avatarStyle = {
  height: "56px",
  width: "56px",
  backgroundColor: "#e7f5f6",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [allUsersTokens, setAllUsersTokens] = useState([]);
  const [days, setDays] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);
  const [chat, setChat] = useState([]);
  const [isMainDrawerOpen, setIsMainDrawerOpen] = useState(false);
  const [isCurrentMonthDataAvailable, setIsCurrentMonthDataAvailable] =
    useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(4);
  const [numberedData, setNumberedData] = useState({});
  const [storageData, setStorageData] = useState({});
  const [allUsers, setAllUsers] = useState();
  const [selectedUser, setSelectedUser] = useState("All");
  const [barChartLoader, setBarChartLoader] = useState(false);
  const [storageDataLoader, setStorageDataLoader] = useState(false);

  const handleCloseMainDrawer = () => {
    setIsMainDrawerOpen(false);
  };

  const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
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
      getAllUsersTokens();
      getNumberedData();
      getStorageData();

      // const storedUsers = localStorage.getItem("allUsers");
      // if (storedUsers) {
      //   const sortedUsers = JSON.parse(storedUsers)
      //     .sort((a, b) => a.username.localeCompare(b.username))
      //     .map((user, index) => ({
      //       ...user,
      //       id: index + 1,
      //     }));
      //   setAllUsers(sortedUsers);
      // } else {
      // }
      getAllUsers();
    }

    const intervalId = setInterval(() => {
      getAllUsersTokens();
    }, 3600000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [auth]);

  function extractDataForMonth(result, month, selectedUserId) {
    if (!Array.isArray(result)) {
      return [];
    }
    const userData = result?.find(
      (user) => user && user.userId === selectedUserId
    );
    if (!userData) {
      return [];
    }

    const monthData = userData.tokens.find((item) => item.month === month);
    if (!monthData) {
      return [];
    }

    return monthData.tokensByMonth.map((day) => {
      const totalTokens = day.tokens.reduce(
        (total, token) => total + token.embeddings + token.chats,
        0
      );
      return {
        day: day.day,
        totalTokens: totalTokens,
        embeddings: day.tokens[0].embeddings,
        chats: day.tokens[0].chats,
      };
    });
  }

  const getAllUsers = async () => {
    try {
      setBarChartLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/user/all-users`,
        {
          params: { adminId: auth?.user?.admin },
        }
      );
      if (response.status === 200) {
        const sortedUsers = response.data?.users
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user, index) => ({
            id: index + 1,
            ...user,
          }));
        setAllUsers(sortedUsers);
        // localStorage.setItem("allUsers", JSON.stringify(sortedUsers || {}));
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
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
    setBarChartLoader(false);
  };

  const getAllUsersTokens = async () => {
    try {
      setBarChartLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/dashboard/all-users-token?adminId=${auth?.user?.admin}`
      );
      if (response.status === 200) {
        setAllUsersTokens(response?.data?.allUserTokenList);
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
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
    setBarChartLoader(false);
  };

  const getNumberedData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/dashboard/numbered-data?adminId=${auth?.user?.admin}`
      );
      if (response.status === 200) {
        setNumberedData(response.data.resources);
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
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

  const getStorageData = async () => {
    try {
      setStorageDataLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/dashboard/storage-data?adminId=${auth?.user?.admin}`
      );
      if (response.status === 200) {
        setStorageData(response.data.resources);
      } else {
        toast.error(response?.data);
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
    } finally {
      setStorageDataLoader(false);
    }
  };

  useEffect(() => {
    if (selectedUser === "All") {
      const date = new Date(2024, currentMonthIndex - 1, 1);
      const days = [];

      while (date.getMonth() === currentMonthIndex - 1) {
        days.push(date.getDate());
        date.setDate(date.getDate() + 1);
      }

      const aggregatedEmbeddings = [];
      const aggregatedChats = [];
      days.forEach((day) => {
        let embeddingsTotal = 0;
        let chatsTotal = 0;

        allUsersTokens.forEach((user) => {
          user.tokens.forEach((token) => {
            if (token.month === currentMonthIndex) {
              token.tokensByMonth.forEach((tokensByDay) => {
                if (tokensByDay.day === day) {
                  // Calculate day-wise totals for embeddings and chats
                  const embeddings = tokensByDay.tokens.reduce(
                    (total, t) => total + t.embeddings,
                    0
                  );
                  const chats = tokensByDay.tokens.reduce(
                    (total, t) => total + t.chats,
                    0
                  );
                  embeddingsTotal += embeddings;
                  chatsTotal += chats;
                }
              });
            }
          });
        });

        aggregatedEmbeddings.push(embeddingsTotal);
        aggregatedChats.push(chatsTotal);
      });
      setIsCurrentMonthDataAvailable(
        !aggregatedChats.every((item) => item === 0)
      );
      setBarChartLoader(false);
      setDays(days);
      setChat(aggregatedChats);
      setEmbeddings(aggregatedEmbeddings);
    } else {
      const currentMonthData = extractDataForMonth(
        allUsersTokens,
        currentMonthIndex,
        selectedUser
      );
      if (currentMonthData.length > 0) {
        setIsCurrentMonthDataAvailable(true);
        setBarChartLoader(false);
        setDays(currentMonthData.map((item) => item.day));
        setEmbeddings(currentMonthData.map((item) => item.embeddings));
        setChat(currentMonthData.map((item) => item.chats));
      } else {
        setIsCurrentMonthDataAvailable(false);
      }
    }

    // eslint-disable-next-line
  }, [currentMonthIndex, selectedUser, allUsersTokens]);

  const incrementMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex === 12 ? 1 : prevIndex + 1));
  };

  const decrementMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex === 1 ? 12 : prevIndex - 1));
  };
  const data = [
    {
      name: "Documents",
      value: storageData?.documentsStorageUsed || "",
      arcLabel: "Documents",
    },
    {
      name: "Images",
      value: storageData?.imagesStorageUsed || "",
      arcLabel: "Images",
    },
    {
      name: "Videos",
      value: storageData?.videosStorageUsed || "",
      arcLabel: "Videos",
    },
    {
      name: "Notes",
      value: storageData?.notesStorageUsed || "",
      arcLabel: "Notes",
    },
    {
      name: "Conversation Media",
      value: storageData?.conversationMediaStorageUsed || "",
      arcLabel: "Conversation Media",
    },
  ];

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };
  const formatSize = (sizeInBits) => {
    // Define the unit sizes in bits

    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    const gigabyte = megabyte * 1024;
    const terabyte = gigabyte * 1024;

    // Convert size to different units
    if (!sizeInBits) {
      return "";
    }
    if (sizeInBits < kilobyte) {
      return `${sizeInBits.toFixed(2)} B`;
    } else if (sizeInBits < megabyte) {
      return `${(sizeInBits / kilobyte).toFixed(2)} KB`;
    } else if (sizeInBits < gigabyte) {
      return `${(sizeInBits / megabyte).toFixed(2)} MB`;
    } else if (sizeInBits < terabyte) {
      return `${(sizeInBits / gigabyte).toFixed(2)} GB`;
    } else {
      return `${(sizeInBits / terabyte).toFixed(2)} TB`;
    }
  };

  document.title = "ZippiAi - Dashboard";

  return (
    <Box
      style={{
        display: "flex",
        margin: 0,
      }}
    >
      <LeftSideDrawer
        pageKey={"Dashboard"}
        handleLogout={handleLogout}
        isMainDrawerOpen={isMainDrawerOpen}
        setIsMainDrawerOpen={setIsMainDrawerOpen}
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
          className="adminDashboard-main-container"
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
                  left: "0",
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
              Dashboard
            </div>
          </Box>
          <div
            style={{
              padding: "0 0 50px 0",
              overflow: "auto",
              height: "calc(100% - 50px)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                height: "auto",
                margin: "30px 0px",
                flexWrap: "wrap",
              }}
            >
              <DepartmentCard
                boxStyle={boxStyle}
                avatarStyle={avatarStyle}
                value={numberedData.numberOfDepartments}
              />
              <AssetCard
                boxStyle={boxStyle}
                avatarStyle={avatarStyle}
                value={numberedData.numberOfAssets}
              />
              <UserCard
                boxStyle={boxStyle}
                avatarStyle={avatarStyle}
                value={numberedData.numberOfUsers}
              />
            </div>

            <Grid container direction="row" margin="0" padding="0">
              <Grid item xs={12} sm={12} md={12} lg={6} xl={8}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    backgroundColor: "#fff",
                    flexShrink: 1,
                    flexGrow: 1,
                    padding: "0 5px 0 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "50px",
                    }}
                  >
                    <span
                      style={{
                        textAlign: "left",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      Tokens Overview
                    </span>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <div>
                        {allUsers && (
                          <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#FFF",
                              width: "140px",
                            }}
                          >
                            <Select
                              value={selectedUser}
                              onChange={handleUserChange}
                            >
                              <MenuItem value="All">All Users</MenuItem>
                              {allUsers?.length > 0 ? (
                                allUsers?.map((user) => (
                                  <MenuItem key={user?._id} value={user?._id}>
                                    {user?.username}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  <Typography variant="subtitle1">
                                    No Users
                                  </Typography>
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          height: "40px",
                          width: "180px",
                          borderRadius: "5px",
                          padding: "0",
                          border: "solid 1px #d9d9d9",
                        }}
                      >
                        <IconButton
                          onClick={decrementMonth}
                          sx={{
                            height: "40px",
                            width: "40px",
                            borderRadius: "5px 0 0 5px",
                          }}
                        >
                          <KeyboardArrowLeftIcon sx={{ fontSize: "20px" }} />
                        </IconButton>
                        <div className="month-names">
                          <span>{months[currentMonthIndex]}</span>
                        </div>
                        <IconButton
                          onClick={incrementMonth}
                          sx={{
                            height: "40px",
                            width: "40px",
                            borderRadius: "0 5px 5px 0",
                          }}
                        >
                          <KeyboardArrowRightIcon sx={{ fontSize: "20px" }} />
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#fafafa",
                      height: "420px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // padding: "5px",
                      padding: "5px 5px 5px 15px",
                    }}
                  >
                    {isCurrentMonthDataAvailable && !barChartLoader ? (
                      <>
                        <BarChart
                          xAxis={[
                            { scaleType: "band", data: days, label: "Days" },
                          ]}
                          yAxis={[
                            {
                              label: "Tokens (in thousands)",
                            },
                          ]}
                          series={[
                            { data: chat, label: "Chat", color: "#AAD7FF" },
                            {
                              data: embeddings,
                              label: "Embeddings",
                              color: "#94EDF4",
                            },
                          ]}
                          margin={{ top: 45, right: 15, bottom: 60, left: 70 }}
                          sx={{
                            [`.${axisClasses.left} .${axisClasses.label}`]: {
                              transform: "translate(-30px, 0)",
                            },
                            padding: "5px 5px",
                          }}
                        />
                      </>
                    ) : (
                      <>
                        {barChartLoader ? (
                          <CircularProgress />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span>No Data Available</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    gap: "5px",
                    flexShrink: 1,
                    flexGrow: 1,
                    padding: "0 0 0 5px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "left",
                      color: "#000",
                      fontWeight: 600,
                      padding: "5px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Storage Overview
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#fafafa",
                      height: "420px",
                      alignItems: "center",
                      // justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#000",
                        padding: "5px",
                      }}
                    >
                      {`Total storage used : ${
                        formatSize(storageData?.totalStorageUsed) || ""
                      }`}
                    </div>

                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {storageDataLoader ? (
                        <div //style={{ height: "150px", marginTop: "20px" }}
                        >
                          <CircularProgress />
                        </div>
                      ) : (
                        <PieChart
                          colors={COLORS}
                          series={[
                            {
                              data: data,
                              valueFormatter: (v, { dataIndex }) => {
                                return `${v.name} - ${formatSize(v.value)}`;
                              },
                            },
                          ]}
                          height={200}
                        />
                      )}
                    </div>
                    {!storageDataLoader && (
                      <TableContainer
                        sx={{ padding: "5px 15px", maxHeight: "170px" }}
                      >
                        <Table sx={{ border: "none" }}>
                          <TableBody>
                            <TableRow
                              sx={{ display: "flex", flexDirection: "row" }}
                            >
                              <TableCell
                                sx={{
                                  border: "none",
                                  display: "flex",
                                  width: "50%",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: COLORS[0],
                                    marginRight: "5px",
                                  }}
                                />
                                <span>{`Documents : ${
                                  formatSize(
                                    storageData?.documentsStorageUsed
                                  ) || ""
                                }`}</span>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "none",
                                  display: "flex",
                                  width: "50%",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: COLORS[1],
                                    marginRight: "5px",
                                  }}
                                />
                                <span>{`Images : ${
                                  formatSize(storageData?.imagesStorageUsed) ||
                                  ""
                                }`}</span>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{ display: "flex", flexDirection: "row" }}
                            >
                              <TableCell
                                sx={{
                                  border: "none",
                                  display: "flex",
                                  width: "50%",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: COLORS[2],
                                    marginRight: "5px",
                                  }}
                                />
                                <span>{`Videos : ${
                                  formatSize(storageData?.videosStorageUsed) ||
                                  ""
                                }`}</span>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "none",
                                  display: "flex",
                                  width: "50%",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: COLORS[3],
                                    marginRight: "5px",
                                  }}
                                />
                                <span>{`Notes : ${
                                  formatSize(storageData?.notesStorageUsed) ||
                                  ""
                                }`}</span>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{ display: "flex", flexDirection: "row" }}
                            >
                              <TableCell
                                sx={{ border: "none", display: "flex" }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: COLORS[4],
                                    marginRight: "5px",
                                  }}
                                />
                                <span>{`Conversation Media : ${formatSize(
                                  storageData?.conversationMediaStorageUsed
                                )}`}</span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </div>
                </Box>
              </Grid>
            </Grid>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
