import React from "react";
import { Skeleton } from "@mui/material";

const LeftDrawerSkeleton = () => {
  return (
    <div style={{ width: "100%" }}>
      <Skeleton
        sx={{ bgcolor: "grey.300" }}
        animation="wave"
        variant="rectangular"
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
};

export default LeftDrawerSkeleton;
