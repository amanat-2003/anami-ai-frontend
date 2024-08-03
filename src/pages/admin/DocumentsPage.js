import "./DocumentsPage.css";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.js";
import React, { useEffect, useState } from "react";

import {
  Box,
  Table,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  TableHead,
  IconButton,
  TableContainer,
  InputAdornment,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import { useSocketService } from "../../context/socketService.js";

import LeftSideDrawer from "../../components/LeftSideDrawer.js";

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

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allUserDocuments, setAllUserDocuments] = useState([]);
  const [isMainDrawerOpen, setIsMainDrawerOpen] = useState(false);
  // const [isLocalStorageUpdated, setLocalStorageUpdation] = useSocketService();
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

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
      // const storedDocuments = localStorage.getItem("allUserDocuments");
      // if (storedDocuments) {
      //   setAllUserDocuments(JSON.parse(storedDocuments));
      // } else {
      // }
      getAllUserDocuments();
      // setLocalStorageUpdation(false);
    }
    // eslint-disable-next-line
  }, [auth]);

  const renderTableCell = (value) => {
    return value || "-";
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredDocuments = allUserDocuments.filter((document) => {
    // Extracting values of specific properties for comparison
    const { userName, departmentName, assetName, fileName } = document;

    // Convert values to lowercase for case-insensitive comparison
    const departmentNameLowerCase = departmentName.toLowerCase();
    const userNameLowerCase = userName.toLowerCase();
    const assetNameLowerCase = assetName.toLowerCase();
    const fileNameLowerCase = fileName.toLowerCase();

    // Check if any property value includes the search text
    return (
      departmentNameLowerCase.includes(filterText) ||
      userNameLowerCase.includes(filterText) ||
      assetNameLowerCase.includes(filterText) ||
      fileNameLowerCase.includes(filterText)
    );
  });

  const visibleRows = filteredDocuments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getAllUserDocuments = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/approval/all-documents`,
        {
          params: { adminId: auth?.user?.admin },
        }
      );

      if (response.status === 200) {
        const sortedDocuments = response.data?.documents?.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        setAllUserDocuments(sortedDocuments || {});
        // localStorage.setItem(
        //   "allUserDocuments",
        //   JSON.stringify(sortedDocuments || {})
        // );
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

  const openInNewTab = (docId) => {
    window.open(`/admin/view-file/${docId}`, "_blank");
  };

  document.title = "ZippiAi - Documents";

  return (
    <Box sx={{ display: "flex", margin: 0 }}>
      <LeftSideDrawer
        pageKey={"Documents"}
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
          className="documentsPage-main-container"
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
              Documents
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

          {loading ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "60vh",
                }}
              >
                <CircularProgress />
              </div>
            </>
          ) : (
            <>
              {allUserDocuments.length > 0 ? (
                <>
                  <TableContainer
                    style={{
                      maxWidth: "100%",
                      padding: "5px",
                      height: `calc(100vh - 275px)`,
                    }}
                  >
                    <Table style={{ ...tableStyle }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={headerCellStyle}>S.No.</TableCell>
                          <TableCell style={headerCellStyle}>
                            UserName
                          </TableCell>
                          <TableCell style={headerCellStyle}>
                            Department{" "}
                          </TableCell>
                          <TableCell style={headerCellStyle}>Asset</TableCell>
                          <TableCell
                            style={{ ...headerCellStyle, maxWidth: "150px" }}
                          >
                            Document
                          </TableCell>
                          {/* <TableCell style={headerCellStyle}>Approved for processing</TableCell>
                              <TableCell style={headerCellStyle}>Approved for Deleting</TableCell> */}
                          <TableCell style={headerCellStyle}>
                            Processed
                          </TableCell>
                          <TableCell style={headerCellStyle}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {visibleRows.map((document, index) => (
                          <TableRow
                            key={index}
                            style={index % 2 === 0 ? oddRowStyle : evenRowStyle}
                          >
                            <TableCell style={cellStyle}>{index + 1}</TableCell>
                            <TableCell style={cellStyle}>
                              {renderTableCell(document.userName)}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {renderTableCell(document.departmentName)}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {renderTableCell(document.assetName)}
                            </TableCell>
                            <TableCell
                              style={{
                                ...cellStyle,
                                maxWidth: "150px",
                                overflowWrap: "break-word",
                              }}
                            >
                              {renderTableCell(document.fileName)}
                            </TableCell>
                            {/* <TableCell style={cellStyle}>
                                  isDocumentApproved ? "yes" : <> 
                                  {document.isApprovedForProcess ? "yes" : "no"}
                                </TableCell> */}

                            {/* <TableCell style={cellStyle}>
                                  {document.isApprovedForDeletion ? "yes" : "no"}
                                </TableCell> */}

                            <TableCell style={cellStyle}>
                              {document.processed ? "yes" : "no"}
                            </TableCell>

                            <TableCell style={cellStyle}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <Button
                                    onClick={() => {
                                      openInNewTab(document._id);
                                    }}
                                    sx={{
                                      color: "#0f8fa9",
                                      "&:hover": {
                                        backgroundColor: "#E7F5F6",
                                      },
                                    }}
                                  >
                                    View Document
                                  </Button>
                                </div>
                                {/* <div style={{ display: "flex", alignItems: "flex-end" }}>
                          <Button
                            onClick={() => {
                              makeDocumentApproved(document._id);

                            }}
                          > Approve</Button> 
                          </div> */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={filteredDocuments.length}
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
                      height: "70vh",
                    }}
                  >
                    Users have not uploaded any document yet.
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default DocumentsPage;
