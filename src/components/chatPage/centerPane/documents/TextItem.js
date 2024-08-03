import { IconButton } from "@mui/material";
import React from "react";

export const TextItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.txt$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img
          alt="text"
          src="/images/textIcon2.png"
          style={{ height: "25px" }}
        />
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
