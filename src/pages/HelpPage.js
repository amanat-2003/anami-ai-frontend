import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { useAuth } from "../context/auth.js";

import { Box, TextField, Button, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const attributeStyle = {
  fontWeight: "500",
  color: "#000",
  fontSize: "17px",
  width: "100px",
};

const textFieldStyle = {
  borderRadius: "15px",
  height: "37px",
  backgroundColor: "#ededed",
  width: "100%",
};

const HelpPage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [message, setMessage] = useState();
  const [subject, setSubject] = useState();

  const resetFormFields = () => {
    setSubject("");
    setMessage("");
  };

  const handleClose = () => {
    window.history.go(-1);
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
  };

  useEffect(() => {
    if (auth.user === null && auth.token === "") {
      navigate("/login");
      localStorage.clear();
      toast.success("Logout successful");
    }
    // eslint-disable-next-line
  }, [auth]);

  // Handle Submit Query
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const queryData = new FormData();
      queryData.append("userId", auth?.user?._id);
      queryData.append("subject", subject);
      queryData.append("body", message);

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/help/query`,
        queryData
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        toast.error(error.response.data.message);
        if (
          error.response.data.message ===
          "Session expired!\nPlease login again."
        ) {
          handleLogout();
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("Network error. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    } finally {
      resetFormFields();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        height: "100vh",
        backgroundColor: "#fff",
        overflow: "auto",
        padding: "0px",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "50px",
          border: "solid 1px #d9d9d9",
          alignItems: "center",
          padding: "5px",
          width: "100%",
        }}
      >
        <IconButton onClick={handleClose}>
          <CloseOutlinedIcon sx={{ color: "#000" }} />
        </IconButton>
      </Box>

      <div
        style={{
          display: "flex",
          height: "80px",
          flexDirection: "column",
          width: "100%",
          maxWidth: "600px",
          justifyContent: "center",
          gap: "5px",
          padding: "20px",
          color: "#000",
          fontWeight: "bold",
          fontSize: "28px",
        }}
      >
        Help and Support
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "600px",
          height: `calc(100% - 80px)`,
          overflow: "auto",
          padding: "20px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              margin: "0 0 15px 0",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div style={attributeStyle}>Name</div>
            <TextField
              margin="dense"
              type="text"
              name="name"
              required
              fullWidth
              value={auth?.user?.username}
              disabled={true}
              InputProps={{
                style: textFieldStyle,
              }}
            />
          </div>

          <div
            style={{
              margin: "0 0 15px 0",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div style={attributeStyle}>Email</div>
            <TextField
              type="email"
              autoComplete="email"
              margin="dense"
              required
              fullWidth
              value={auth?.user?.email}
              disabled={true}
              InputProps={{
                style: textFieldStyle,
              }}
            />
          </div>
          <div
            style={{
              margin: "0 0 15px 0",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div style={attributeStyle}>Subject</div>
            <TextField
              type="text"
              margin="dense"
              name="subject"
              required
              fullWidth
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              InputProps={{
                style: textFieldStyle,
              }}
            />
          </div>
          <div
            style={{
              margin: "0 0 15px 0",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div style={attributeStyle}>Message</div>
            <TextField
              margin="dense"
              type="text"
              name="message"
              required
              fullWidth
              multiline
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              style={{
                backgroundColor: "#FFF",
                overflow: "auto",
              }}
              InputProps={{
                style: {
                  borderRadius: "15px",
                  backgroundColor: "#ededed",
                  width: "100%",
                },
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              sx={{
                padding: "7px 50px",
                borderRadius: "5px",
                color: "#fff",
                fontSize: "15px",
                backgroundColor: "#0F8FA9",
                "&:hover": {
                  backgroundColor: "#075D73",
                },
              }}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </Box>
  );
};

export default HelpPage;
