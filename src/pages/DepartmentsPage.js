import "./DepartmentsPage.css";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.js";
import React, { useEffect, useState } from "react";

import {
  Fab,
  Box,
  Tooltip,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import { useSocketService } from "../context/socketService.js";

import LeftSideDrawer from "../components/LeftSideDrawer.js";
import Assets from "../components/admin/departmentsPage/Assets.js";
import AddDepartmentForm from "../components/admin/departmentsPage/AddDepartmentForm.js";
import DepartmentCardView from "../components/admin/departmentsPage/DepartmentCardView.js";

const DepartmentsPage = () => {
  const navigate = useNavigate();
  const [openCreateDepartmentForm, setOpenCreateDepartmentForm] =
    useState(false);
  // const [isLocalStorageUpdated, setLocalStorageUpdation] = useSocketService();
  const [auth, setAuth] = useAuth();
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isMainDrawerOpen, setIsMainDrawerOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Departments");

  const openComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleCloseMainDrawer = () => {
    setIsMainDrawerOpen(false);
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
  };

  useEffect(() => {
    const storedDepartment = localStorage.getItem("selectedDepartment");
    if (storedDepartment) {
      setSelectedDepartment(JSON.parse(storedDepartment));
      openComponent("Assets");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (auth.user === null && auth.token === "") {
      navigate("/login");
      localStorage.clear();
      toast.success("Logout successful");
    } else if (auth.user) {
      // const storedDepartments = localStorage.getItem("allDepartments");
      // if (storedDepartments) {
      //   setDepartments(JSON.parse(storedDepartments));
      // } else {
      // }
      getAllDepartments();

      // const storedAssets = localStorage.getItem("allAssets");
      // if (storedAssets) {
      //   setAssets(JSON.parse(storedAssets));
      // } else {
      // }
      getAllAssets();

      // const storedUsers = localStorage.getItem("allUsers");
      // if (storedUsers) {
      //   const sortedUsers = JSON.parse(storedUsers)
      //     ?.filter((user) => user._id !== auth?.user._id)
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
    // setLocalStorageUpdation(false);
    // eslint-disable-next-line
  }, [auth]);

  // Get all departments
  const getAllDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/department/all-departments`,
        {
          params: { userId: auth?.user?._id },
        }
      );
      if (response.data?.success) {
        const sortedDepartments = response.data?.departments?.sort((a, b) =>
          a.departmentName.localeCompare(b.departmentName)
        );
        setDepartments(sortedDepartments);
        // localStorage.setItem(
        //   "allDepartments",
        //   JSON.stringify(sortedDepartments || {})
        // );
      } else {
        toast.error(response.data.message);
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

  // Get all assets
  const getAllAssets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/asset/all-assets`,
        {
          params: { userId: auth?.user?._id },
        }
      );
      if (response.status === 200) {
        const sortedAssets = response.data?.assets?.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setAssets(sortedAssets);
        // localStorage.setItem("allAssets", JSON.stringify(sortedAssets || {}));
      } else {
        toast.error(response.data.message);
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

  // Get all users
  const getAllUsers = async () => {
    try {
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
        const filteredUsers = sortedUsers
          ?.filter((user) => user._id !== auth?.user._id)
          .map((user, index) => ({
            id: index + 1,
            ...user,
          }));
        setAllUsers(filteredUsers);
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
  };

  const handleOpenCreateDepartmentForm = () => {
    setOpenCreateDepartmentForm(true);
  };

  const handleCloseCreateDepartmentForm = () => {
    setOpenCreateDepartmentForm(false);
  };

  const filteredDepartments = filterText
    ? departments.filter((department) =>
        new RegExp(filterText, "i").test(department?.departmentName)
      )
    : departments;

  document.title = "ZippiAi - Home";

  return (
    <>
      <Box
        style={{
          display: "flex",
          margin: "0 0 0 0",
        }}
      >
        <LeftSideDrawer
          pageKey={"Departments"}
          handleLogout={handleLogout}
          isMainDrawerOpen={isMainDrawerOpen}
          setIsMainDrawerOpen={setIsMainDrawerOpen}
          handleCloseMainDrawer={handleCloseMainDrawer}
        />

        {activeComponent === "Assets" && (
          <Assets
            viewDepartment={selectedDepartment}
            openComponent={openComponent}
            activeComponent={activeComponent}
            assets={assets}
            setAssets={setAssets}
            allUsers={allUsers}
            departments={departments}
          />
        )}

        {activeComponent === "Departments" && (
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
              className="departmentsPage-main-container"
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
                  Departments
                </div>
              </Box>

              <div
                style={{
                  padding: "5px",
                  marginBlock: "30px",
                }}
              >
                <TextField
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                  value={filterText}
                  style={{
                    borderRadius: "10px",
                    width: "100%",
                  }}
                  onChange={handleFilterChange}
                  height="50px"
                  InputProps={{
                    style: {
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon sx={{ color: "#909090" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Box>
                {/* Create Department Form */}
                {openCreateDepartmentForm && (
                  <AddDepartmentForm
                    departments={departments}
                    setDepartments={setDepartments}
                    handleLogout={handleLogout}
                    openCreateDepartmentForm={openCreateDepartmentForm}
                    onClose={handleCloseCreateDepartmentForm}
                    user={auth.user}
                    allUsers={allUsers}
                  />
                )}
              </Box>
              {loading ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "70vh",
                    }}
                  >
                    <CircularProgress />
                  </div>
                </>
              ) : (
                <>
                  {/* Departments */}
                  {departments?.length > 0 ? (
                    <>
                      <DepartmentCardView
                        assets={assets}
                        user={auth?.user}
                        allUsers={allUsers}
                        handleLogout={handleLogout}
                        openComponent={openComponent}
                        setDepartments={setDepartments}
                        departments={filteredDepartments}
                        selectedDepartment={selectedDepartment}
                        setSelectedDepartment={setSelectedDepartment}
                      />
                    </>
                  ) : (
                    <Typography
                      variant="h5"
                      minHeight={"50vh"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      textTransform={"uppercase"}
                      sx={{ fontSize: { xs: "h4", sm: "h6" } }}
                    >
                      You have no Departments. Kindly create one.
                    </Typography>
                  )}
                </>
              )}
              {auth?.user?.role === 1 && (
                <Tooltip
                  title="Add New Department"
                  aria-label="Add New Department"
                  arrow
                  placement="bottom"
                >
                  <Fab
                    color="primary"
                    aria-label="add"
                    size="small"
                    onClick={handleOpenCreateDepartmentForm}
                    style={{
                      position: "absolute",
                      bottom: "30px",
                      right: "30px",
                      color: "#FFF",
                      background: "#0f8fa9",
                      fontSize: "45px",
                    }}
                  >
                    <AddIcon style={{ fontSize: "35px" }} />
                  </Fab>
                </Tooltip>
              )}
            </div>
          </Box>
        )}
      </Box>
    </>
  );
};

export default DepartmentsPage;
