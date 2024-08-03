import React from "react";
import { Box, Skeleton } from "@mui/material";

const LoaderSkeleton = () => {
  return (
    <Box
      style={{
        backgroundColor: "#FFF",
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{ width: "200px" }}>
        <Skeleton
          sx={{ bgcolor: "grey.300" }}
          animation="wave"
          variant="rectangular"
          width={"100%"}
          height={"100%"}
        />
      </div>
      <div style={{ width: "calc(100% - 200px)" }}>
        <Skeleton
          sx={{ bgcolor: "grey.200" }}
          animation="wave"
          variant="rectangular"
          width={"100%"}
          height={"100%"}
        />
      </div>
    </Box>
  );
};

export default LoaderSkeleton;
