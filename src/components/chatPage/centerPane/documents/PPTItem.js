import { IconButton } from "@mui/material";
import React from "react";

export const PPTItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.pptx?$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img alt="ppt" src="/images/pptIcon2.png" style={{ height: "25px" }} />
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
