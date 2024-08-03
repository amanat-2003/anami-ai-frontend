import React, { useState } from "react";

import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  TableContainer,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

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
  border: "1px solid #FFF5",
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

const MaintenanceRecords = ({ auth, asset, openComponent }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
    return `${formattedDate} ${formattedTime} UTC`;
  };

  const [searchText, setSearchText] = useState("");

  const handleFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  const renderTableCell = (value) => {
    return value || "-";
  };

  const maintenanceHistory = asset?.maintenanceRecords;
  const sortedMaintenanceHistory = maintenanceHistory.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredMaintenanceHistory = sortedMaintenanceHistory.filter(
    (record) => {
      // Extracting values of specific properties for comparison
      const { maintenanceActivity, date, maintenanceAlert } = record;

      // Convert values to lowercase for case-insensitive comparison
      const maintenanceActivityLowerCase = maintenanceActivity.toLowerCase();
      const maintenanceAlertLowerCase = maintenanceAlert.toLowerCase();

      // Check if any property value includes the search text
      return (
        maintenanceActivityLowerCase.includes(searchText) ||
        maintenanceAlertLowerCase.includes(searchText) ||
        (date && date.toString().includes(searchText))
      );
    }
  );

  return (
    <Box
      p={2}
      height={`calc(100vh)`}
      style={{
        marginTop: "0px",
        backgroundColor: "#fff",
        padding: "10px 20px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "50px",
          alignItems: "center",
          margin: "10px 10px",
        }}
      >
        <div style={{ position: "absolute" }}>
          <IconButton
            onClick={() => {
              openComponent("MainChatSection");
            }}
          >
            <CloseOutlinedIcon sx={{ color: "#000" }} />
          </IconButton>
        </div>
        <div
          style={{
            display: "flex",
            color: "#000",
            fontSize: "22px",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          Maintenance History
        </div>
      </Box>
      <div
        style={{
          height: "50px",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "15px",
        }}
      >
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={searchText}
          style={{
            borderRadius: "10px",
            width: "100%",
            marginLeft: "5px",
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
      <div
        style={{
          marginTop: "10px",
          height: `calc(100% - 160px)`,
          overflow: "auto",
          paddingInline: "5px",
        }}
      >
        <div style={{ position: "relative" }}>
          {asset ? (
            <TableContainer
              style={{
                maxWidth: "100%",
                padding: "5px",
                height: `calc(100vh - 180px)`,
              }}
            >
              <Table style={{ ...tableStyle }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={headerCellStyle}>S.No.</TableCell>
                    <TableCell style={headerCellStyle}>
                      Maintenance Activity
                    </TableCell>
                    <TableCell style={headerCellStyle}>
                      Maintenance Date
                    </TableCell>
                    <TableCell style={headerCellStyle}>
                      Maintenance Alert
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMaintenanceHistory?.map((record, index) => (
                    <TableRow
                      key={index}
                      style={index % 2 === 0 ? oddRowStyle : evenRowStyle}
                    >
                      <TableCell style={cellStyle}>{index + 1}</TableCell>
                      <TableCell style={cellStyle}>
                        {renderTableCell(record.maintenanceActivity)}
                      </TableCell>
                      <TableCell style={cellStyle}>
                        {renderTableCell(formatDate(record.date))}
                      </TableCell>
                      <TableCell style={cellStyle}>
                        {renderTableCell(record?.maintenanceAlert)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              variant="h5"
              minHeight={"60vh"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              textTransform={"uppercase"}
              sx={{ fontSize: { xs: "h4", sm: "h6" } }}
            >
              You have no maintenance history for selected asset!
            </Typography>
          )}
        </div>
      </div>
    </Box>
  );
};

export default MaintenanceRecords;
