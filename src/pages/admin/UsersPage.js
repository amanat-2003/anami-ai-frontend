import "./UsersPage.css";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.js";
import React, { useEffect, useState } from "react";

import {
  Box,
  Fab,
  Table,
  styled,
  Switch,
  Button,
  Dialog,
  Tooltip,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableSortLabel,
  TableContainer,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import LeftSideDrawer from "../../components/LeftSideDrawer.js";
import AddUserForm from "../../components/admin/usersPage/AddUserForm.js";
import UpdateUserForm from "../../components/admin/usersPage/UpdateUserForm.js";

const CustomSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#0A97A4",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#A97A4",
  },
}));

const cellStyle = {
  textAlign: "center",
  padding: "12px",
  color: "#000",
  border: "1px solid #7772",
};

const tableStyle = {
  width: "100%",
  borderRadius: "5px 5px 0 0",
  overflow: "auto",
};

const headerCellStyle = {
  ...cellStyle,
  background: "#0f8fa9",
  border: "1px solid #FFF2",
  color: "#FFF",
  position: "sticky",
  top: "-10px",
  zIndex: 100,
};

const oddRowStyle = {
  backgroundColor: "#FFF",
};

const evenRowStyle = {
  backgroundColor: "#0B57D005",
};

const UsersPage = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [departments, setDepartments] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [openAddUserForm, setOpenAddUserForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMainDrawerOpen, setIsMainDrawerOpen] = useState(false);

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
      // const storedDepartments = localStorage.getItem("allDepartments");
      // if (storedDepartments) {
      //   setDepartments(JSON.parse(storedDepartments));
      // } else {
      // }
      getAllDepartments();

      // const storedPermissions = localStorage.getItem("allPermissions");
      // if (storedPermissions) {
      //   setPermissions(JSON.parse(storedPermissions));
      // } else {
      // }
      getAllPermissions();

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
    // eslint-disable-next-line
  }, [auth]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((notification) => notification.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id, row) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setSelectedRow(
      newSelected.length > 0
        ? visibleRows.find((r) => r.id === newSelected[0]) || null
        : null
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  // Avoid a layout jump when reaching the last page with empty allUsers.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allUsers.length) : 0;

  const visibleRows = stableSort(allUsers, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const headCells = [
    {
      id: "username",
      numeric: false,
      disablePadding: true,
      label: "Username",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: true,
      label: "Email",
    },
    {
      id: "phone",
      numeric: true,
      disablePadding: false,
      label: "Phone Number",
    },
    {
      id: "verified",
      numeric: false,
      disablePadding: true,
      label: "Verified",
    },
  ];

  // Get all users
  const getAllUsers = async () => {
    try {
      setLoading(true);
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
            ...user,
            id: index + 1,
          }));
        const filteredUsers = sortedUsers
          ?.filter((user) => user._id !== auth?.user._id)
          .map((user, index) => ({
            ...user,
            id: index + 1,
          }));
        setAllUsers(filteredUsers);
        // localStorage.setItem("allUsers", JSON.stringify(sortedUsers || {}));
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
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

  const getAllPermissions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/user/all-permission`,
        {
          params: { adminId: auth?.user?.admin },
        }
      );
      if (response.status === 200) {
        const sortedPermissions = response.data?.permissions?.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setPermissions(sortedPermissions);
        // localStorage.setItem(
        //   "allPermissions",
        //   JSON.stringify(sortedPermissions || {})
        // );
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

  const getAllDepartments = async () => {
    try {
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

  const handleAuthorizeUser = async (userId, isAuthorised) => {
    try {
      const userData = new FormData();
      userData.append("userId", userId);
      userData.append("newAuthStatus", isAuthorised);

      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/admin/user/authorize-user`,
        userData
      );
      if (response.status === 200) {
        const updatedUser = response.data.user;
        const updatedUsers = allUsers.map((user) => {
          if (user._id === updatedUser._id) {
            return updatedUser;
          }
          return user;
        });
        const sortedUsers = updatedUsers
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user, index) => ({
            id: index + 1,
            ...user,
          }));

        setAllUsers(sortedUsers);
        // localStorage.setItem("allUsers", JSON.stringify(sortedUsers));
        toast.success(response.data.message);
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

  const handleOpenAddUserForm = () => {
    setOpenAddUserForm(true);
  };

  const handleCloseAddUserForm = () => {
    setOpenAddUserForm(false);
  };

  //table toolbar
  function EnhancedTableToolbar(props) {
    const { numSelected, selected, setSelected } = props;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editedusername, setUserName] = useState(selected?.username || "");
    const [editedPhone, setUserPhone] = useState(selected?.phone || "");

    const [tempDepartments] = useState(selected?.allowedDepartments || []);
    const filteredDepartments = departments.filter((department) =>
      tempDepartments?.includes(department._id)
    );
    const [editedDepartments, setUserDepartments] =
      useState(filteredDepartments);

    const [tempPermissions] = useState(selected?.permissions || []);

    const filteredPermissions = permissions.filter((permission) =>
      tempPermissions?.includes(permission.name)
    );
    const [editedPermissions, setUserPermissions] =
      useState(filteredPermissions);

    const handleEditButtonClick = () => {
      setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
      setSelected([]);
      setIsEditModalOpen(false);
    };

    const handleDeleteButtonClick = () => {
      setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
      setSelected([]);
      setIsDeleteModalOpen(false);
    };

    const handleUpdateButtonClick = async () => {
      try {
        if (!editedusername.trim()) {
          toast.error("Username is required");
          return;
        }
        setSelected([]);
        const permissionNames = editedPermissions.map((obj) => obj.name);
        const departmentIds = editedDepartments.map((obj) => obj._id);
        const userData = new FormData();
        userData.append("userId", selected._id);
        userData.append("username", editedusername.trim());
        userData.append("phone", editedPhone);
        userData.append("departments", departmentIds);
        userData.append("permissions", permissionNames);

        const response = await axios.put(
          `${process.env.REACT_APP_API}/api/v1/admin/user/update-user`,
          userData
        );
        if (response.status === 200) {
          const updatedUser = response.data.user;
          const updatedUsers = allUsers.map((user) => {
            if (user._id === updatedUser._id) {
              return updatedUser;
            }
            return user;
          });

          const sortedUsers = updatedUsers
            .sort((a, b) => a.username.localeCompare(b.username))
            .map((user, index) => ({
              id: index + 1,
              ...user,
            }));

          setAllUsers(sortedUsers);
          // localStorage.setItem("allUsers", JSON.stringify(sortedUsers));
          toast.success(response.data.message);
        } else {
          console.error("Unexpected success response:", response);
          toast.error("Unexpected error");
        }
        handleEditModalClose();
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
      handleEditModalClose();
    };

    const getSelectedIds = () => {
      if (numSelected.length === 0) {
        return [];
      }
      const selectedIds = visibleRows
        .filter((row) => numSelected.includes(row.id))
        .map((selectedRow) => selectedRow._id);
      return selectedIds;
    };

    const handleConfirmDeleteButtonClick = async () => {
      try {
        const userIds = getSelectedIds();
        const adminId = auth?.user?._id;
        if (userIds.length <= 0) {
          toast.error("No user selected");
          return;
        }
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/api/v1/admin/user/delete-user`,
          {
            data: { userIds, adminId },
          }
        );
        if (response.status === 200) {
          const updatedUsers = allUsers.filter(
            (user) => !userIds.includes(user._id)
          );

          const sortedUsers = updatedUsers
            .sort((a, b) => a.username.localeCompare(b.username))
            .map((user, index) => ({
              ...user,
              id: index + 1,
            }));

          setAllUsers(sortedUsers);
          // localStorage.setItem("allUsers", JSON.stringify(sortedUsers));
          toast.success(response.data.message);
        } else {
          console.error("Unexpected success response:", response);
          toast.error("Unexpected error");
        }
        setSelected([]);
        handleDeleteModalClose();
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
      handleEditModalClose();
    };

    return (
      <>
        <Box
          style={{
            background: "#0f8fa911",
            maxHeight: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 5px 0px 15px",
          }}
        >
          {numSelected.length > 0 && (
            <>
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {numSelected.length} selected
              </Typography>
              <Tooltip title="Edit">
                <span>
                  <IconButton
                    onClick={handleEditButtonClick}
                    sx={{ color: "#0f8fa9" }}
                    disabled={numSelected.length !== 1}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title="Delete"
                onClick={handleDeleteButtonClick}
                sx={{ color: "#0f8fa9" }}
              >
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

        {isEditModalOpen && (
          <UpdateUserForm
            isEditModalOpen={isEditModalOpen}
            handleEditModalClose={handleEditModalClose}
            editedUsername={editedusername}
            setUserName={setUserName}
            editedPhone={editedPhone}
            setUserPhone={setUserPhone}
            departments={departments}
            permissions={permissions}
            selectedDepartments={editedDepartments}
            setSelectedDepartments={setUserDepartments}
            selectedPermission={editedPermissions}
            setSelectedPermissions={setUserPermissions}
            handleUpdateButtonClick={handleUpdateButtonClick}
          />
        )}

        <Dialog
          open={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          aria-labelledby="draggable-dialog"
        >
          <DialogTitle
            style={{ textAlign: "center", cursor: "move" }}
            className="draggable-dialog"
          >
            Confirm deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete the selected users? This action
            can't be undone.
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button color="error" onClick={handleDeleteModalClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleConfirmDeleteButtonClick}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  //table head
  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" style={headerCellStyle}>
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          <TableCell
            key="id"
            align="left"
            size="small"
            padding="none"
            sortDirection={orderBy === "id" ? order : false}
            style={headerCellStyle}
          >
            <TableSortLabel
              active={orderBy === "id"}
              direction={orderBy === "id" ? order : "asc"}
              onClick={createSortHandler("id")}
            >
              S.No.
              {orderBy === "id" ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              style={headerCellStyle}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}

          <TableCell style={headerCellStyle}>Permission</TableCell>

          <TableCell padding="checkbox" style={headerCellStyle}>
            {" "}
            Authorization
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  function Row(props) {
    const { row, isItemSelected } = props;
    var permissionsString = row.permissions.join(", ");

    return (
      <>
        <TableRow
          sx={{ "& > *": { borderBottom: "unset" } }}
          style={{ backgroundColor: "#fafafa" }}
        >
          <TableCell padding="checkbox" style={cellStyle}>
            <Checkbox
              onClick={(event) => handleClick(event, row.id, row)}
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.id}
              selected={isItemSelected}
              color="primary"
              checked={isItemSelected}
            />
          </TableCell>
          <TableCell size="small" style={cellStyle}>
            {row.id}
          </TableCell>
          <TableCell style={cellStyle}>{row.username}</TableCell>
          <TableCell style={cellStyle}>{row.email}</TableCell>
          <TableCell style={cellStyle}>{row.phone}</TableCell>
          <TableCell style={cellStyle}>
            {row.isVerified ? "yes" : "no"}
          </TableCell>
          <TableCell
            style={{
              ...cellStyle,
              maxWidth: "200px",
              overflowWrap: "break-word",
            }}
          >
            {permissionsString}
          </TableCell>

          <TableCell padding="checkbox" style={cellStyle}>
            <CustomSwitch
              checked={row.isAuthorised}
              onChange={() => {
                handleAuthorizeUser(row._id, !row.isAuthorised);
              }}
              name="loading"
              size="small"
            />
          </TableCell>
        </TableRow>
      </>
    );
  }

  document.title = "ZippiAi - Users";

  return (
    <>
      <Box
        style={{
          display: "flex",
          margin: "0",
        }}
      >
        <LeftSideDrawer
          pageKey={"Users"}
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
            className="usersPage-main-container"
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
                marginBottom: selected.length > 0 ? "0px" : "40px",
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
                Users
              </div>
            </Box>
            {loading ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "calc(100vh - 225px)",
                  }}
                >
                  <CircularProgress />
                </div>
              </>
            ) : (
              <>
                {visibleRows.length > 0 ? (
                  <>
                    <EnhancedTableToolbar
                      numSelected={selected}
                      selected={selectedRow}
                      setSelected={setSelected}
                    />
                    <TableContainer
                      style={{
                        maxWidth: "100%",
                        height: `calc(100vh - 225px)`,
                      }}
                    >
                      <Table
                        style={{ ...tableStyle }}
                        aria-labelledby="tableTitle"
                      >
                        <EnhancedTableHead
                          numSelected={selected.length}
                          order={order}
                          orderBy={orderBy}
                          onSelectAllClick={handleSelectAllClick}
                          onRequestSort={handleRequestSort}
                          rowCount={visibleRows.length}
                        />
                        <TableBody>
                          {visibleRows.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            return (
                              <Row
                                key={index}
                                row={row}
                                isItemSelected={isItemSelected}
                                style={
                                  index % 2 === 0 ? oddRowStyle : evenRowStyle
                                }
                              />
                            );
                          })}
                          {emptyRows > 0 && (
                            <TableRow
                              style={{
                                height: 33 * emptyRows,
                              }}
                            >
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 15]}
                      component="div"
                      count={allUsers.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "65vh",
                      }}
                    >
                      No user profiles created.
                    </div>
                  </>
                )}
              </>
            )}
            <Tooltip
              title="Create New User"
              aria-label="Create New User"
              arrow
              placement="bottom"
            >
              <Fab
                color="primary"
                aria-label="add"
                size="small"
                onClick={handleOpenAddUserForm}
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
            {openAddUserForm && (
              <AddUserForm
                openAddUserForm={openAddUserForm}
                onClose={handleCloseAddUserForm}
                allUsers={allUsers}
                setAllUsers={setAllUsers}
                departments={departments}
                permissions={permissions}
                handleLogout={handleLogout}
              />
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default UsersPage;
