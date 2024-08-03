import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DepartmentCard({ boxStyle, avatarStyle, value }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={boxStyle}
      onClick={() => {
        navigate("/admin/departments");
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "5px",
        }}
      >
        <span
          style={{
            color: "#7a7b7c",
          }}
        >
          Departments
        </span>
        <span
          style={{
            color: "#000",
            fontSize: 19,
            fontWeight: 550,
          }}
        >
          {value}
        </span>
      </div>
      <Avatar sx={avatarStyle}>
        <AccountBalanceRoundedIcon sx={{ color: "#0f8fa9" }} />
      </Avatar>
    </Box>
  );
}
