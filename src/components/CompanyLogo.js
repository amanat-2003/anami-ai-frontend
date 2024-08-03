import React from "react";

import { Box } from "@mui/material";

const CompanyLogo = ({ handleLogo }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "35px 10px 25px",
        width: "100%",
      }}
    >
      <img
        src="/images/ZippiAiLogo.png"
        alt="Logo"
        style={{
          maxWidth: "150px",
          paddingRight: "10px",
          cursor: "pointer",
        }}
        onClick={handleLogo}
      />
    </Box>
  );
};

export default CompanyLogo;
