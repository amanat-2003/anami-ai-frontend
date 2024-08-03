import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserBadgeItem = ({ user, handleRemoveUser }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: "1px solid #0A97A455",
        backgroundColor: "#e7f5f6",
        margin: "3px",
        padding: "3px 10px 3px 5px",
        flexGrow: 1,
        gap: "5px",
        maxWidth: "calc(100% - 6px)",
      }}
    >
      <IconButton
        onClick={() => {
          handleRemoveUser(user);
        }}
      >
        <CloseIcon sx={{ fontSize: "20px" }} />
      </IconButton>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "calc(100% - 50px)",
        }}
        title={user?.username}
      >
        {user?.username}
      </div>
    </Box>
  );
};

export default UserBadgeItem;
