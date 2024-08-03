import * as React from "react";
import Avatar from "@mui/material/Avatar";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UserCard({ boxStyle, avatarStyle, value }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={boxStyle}
      onClick={() => {
        navigate("/admin/users");
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
          Users
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
        <PeopleAltIcon sx={{ color: "#0f8fa9" }} />
      </Avatar>
    </Box>
  );
}
