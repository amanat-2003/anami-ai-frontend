import React from "react";

import {
  Table,
  Tooltip,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  TableContainer,
  Box,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

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

const TabularView = ({
  assets,
  handleOpenAssetChat,
  handleOpenShareDialog,
}) => {
  const renderTableCell = (value) => {
    return value || "-";
  };

  return (
    <Box
      style={{
        position: "relative",
        height: `calc(100vh - 220px)`,
        overflow: "auto",
      }}
    >
      {assets.length > 0 ? (
        <TableContainer
          style={{
            maxWidth: "100%",
            padding: "5px",
            height: `calc(100vh - 225px)`,
          }}
        >
          <Table style={{ ...tableStyle }}>
            <TableHead>
              <TableRow>
                <TableCell style={headerCellStyle}>S.No.</TableCell>
                <TableCell style={headerCellStyle}>Name</TableCell>
                <TableCell style={headerCellStyle}>Department</TableCell>
                <TableCell style={headerCellStyle}>Model</TableCell>
                <TableCell style={headerCellStyle}>Year</TableCell>
                <TableCell style={headerCellStyle}>Maintenance Date</TableCell>
                <TableCell style={headerCellStyle}>
                  Last Maintenance Job
                </TableCell>
                <TableCell style={headerCellStyle}>Maintenance Alert</TableCell>
                <TableCell style={headerCellStyle}>Location</TableCell>
                <TableCell style={headerCellStyle}>Operator</TableCell>
                <TableCell style={headerCellStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset, index) => (
                <TableRow
                  key={index}
                  style={index % 2 === 0 ? oddRowStyle : evenRowStyle}
                >
                  <TableCell style={cellStyle}>{index + 1}</TableCell>
                  <TableCell
                    style={{ ...cellStyle, cursor: "pointer" }}
                    onClick={() => {
                      handleOpenAssetChat(asset);
                    }}
                  >
                    {renderTableCell(asset.name)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(asset.departmentName)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(asset.model)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(asset.year)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(
                      asset.upcomingMaintenanceDate
                        ? asset.upcomingMaintenanceDate.substring(0, 10)
                        : null
                    )}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(asset?.maintenanceJob)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(asset.maintenanceAlert)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(asset.location)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    {renderTableCell(asset.operatorName)}
                  </TableCell>
                  <TableCell style={cellStyle}>
                    <Tooltip title={"Share"} arrow>
                      <IconButton
                        aria-label="Share Asset"
                        style={{
                          background: "transparent",
                        }}
                        onClick={() => handleOpenShareDialog(asset)}
                      >
                        <ShareIcon style={{ fontSize: "20px" }} />
                      </IconButton>
                    </Tooltip>
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
          You have no assets for selected department!
        </Typography>
      )}
    </Box>
  );
};

export default TabularView;
