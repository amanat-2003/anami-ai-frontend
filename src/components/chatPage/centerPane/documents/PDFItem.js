import React from "react";
import { IconButton } from "@mui/material";

export const PDFItem = ({ document }) => {
  const fileNameWithoutExtension = document.fileName.replace(/\.pdf$/, "");

  return (
    <>
      <IconButton size="small" style={{ background: "transparent" }}>
        <img alt="pdf" src="/images/pdfIcon2.png" style={{ height: "25px" }} />
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
