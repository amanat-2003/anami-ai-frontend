import React from "react";

import { IconButton, Tooltip, Grid, Typography, Box } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "85px",
  justifyContent: "space-between",
  padding: "13px",
  borderRadius: "5px",
  border: "solid 1px #d9d9d9",
  backgroundColor: "#fff",
  position: "relative",
  cursor: "pointer",
  margin: "5px",
};

const cardTitleStyle = {
  fontSize: "17px",
  marginBottom: "4px",
};

const cardSubheaderStyle = {
  display: "flex",
  flexDirection: "column",
  fontSize: "12px",
  color: "#888",
};

const CardView = ({ assets, handleOpenAssetChat, handleOpenShareDialog }) => {
  const groupedAssets = assets.reduce((acc, asset) => {
    if (!acc[asset.departmentName]) {
      acc[asset.departmentName] = [];
    }
    acc[asset.departmentName].push(asset);
    return acc;
  }, {});

  return (
    <Box
      style={{
        position: "relative",
        height: `calc(100vh - 220px)`,
        overflow: "auto",
      }}
    >
      {Object.entries(groupedAssets).map(
        ([departmentName, departmentAssets]) => (
          <div key={departmentName}>
            <Typography
              style={{ margin: "17px 5px 3px 5px", fontSize: "20px" }}
            >
              {departmentName}
            </Typography>
            <Grid container spacing={0}>
              {departmentAssets.map((asset, index) => (
                <Grid item xs={6} sm={6} md={4} lg={3} xl={2.4} key={asset._id}>
                  <div
                    style={{ ...cardStyle }}
                    onClick={() => {
                      handleOpenAssetChat(asset);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "start",
                      }}
                    >
                      <div
                        style={{
                          ...cardTitleStyle,
                          width: `calc(100% - 50px)`,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={asset.name}
                      >
                        {asset.name}
                      </div>
                      <div
                        style={{
                          ...cardSubheaderStyle,
                          width: `calc(100% - 30px)`,
                        }}
                      >
                        <span
                          style={{
                            width: `calc(100%)`,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={asset.model}
                        >{`Model: ${asset.model}`}</span>
                        {/* <span
                          style={{
                            width: `calc(100%)`,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={asset.operatorName}
                        >{`PIC: ${asset.operatorName}`}</span> */}
                        <span
                          style={{
                            width: `calc(100%)`,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={asset.operatorName}
                        >
                          {`Date created: ${new Date(
                            asset?.createdAt
                          ).toLocaleDateString("en-US", {
                            hour12: false,
                          })}`}
                        </span>
                      </div>
                      <Tooltip title={"Share"} arrow>
                        <IconButton
                          aria-label="Share Asset"
                          style={{
                            position: "absolute",
                            bottom: "5px",
                            right: "5px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Stop propagation here
                            handleOpenShareDialog(asset);
                          }}
                        >
                          <ShareIcon style={{ fontSize: "20px" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )
      )}
    </Box>
  );
};

export default CardView;
