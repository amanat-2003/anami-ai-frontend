import { IconButton } from "@mui/material";
import React from "react";

export const CSVItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.csv?$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img alt="csv" src="/images/csvIcon.png" style={{ height: "25px" }} />
      </IconButton>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          fontSize: "13px",
        }}
        title={fileNameWithoutExtension}
      >
        {fileNameWithoutExtension}
      </div>
    </>
  );
};
