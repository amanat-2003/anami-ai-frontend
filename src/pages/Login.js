import "./Login.css";

import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/auth.js";
import ReCAPTCHA from "react-google-recaptcha";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotificationContext } from "../context/notification.js";
import { useConversationContext } from "../context/conversation.js";

import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showpass, setShowpass] = useState(false);
  const [captchaVerificationStatus, setCaptchaVerificationStatus] =
    useState(false);

  const [, setUnreadConversationCount] = useConversationContext();
  const [, setNotificationCount] = useNotificationContext();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    // Clear localStorage except for the "auth" item
    for (let key in localStorage) {
      if (key !== "auth") {
        localStorage.removeItem(key);
      }
    }

    const authCheck = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/validate-auth`
      );

      if (response.status === 200) {
        const parsedAuth = JSON.parse(storedAuth);
        setAuth({
          ...auth,
          user: parsedAuth.user,
          token: parsedAuth.token,
        });
        setNotificationCount(parsedAuth.unreadNotification);
        setUnreadConversationCount(parsedAuth.unreadConversation);
        if (parsedAuth.user.role === 0) {
          navigate("/user/departments");
        } else if (parsedAuth.user.role === 1) {
          navigate("/admin");
        } else {
          navigate("/developer");
        }
      } else {
        setAuth({
          ...auth,
          user: null,
          token: "",
        });
        localStorage.clear();
      }
    };
    if (storedAuth) authCheck();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (auth.user === null && auth.token === "") {
      navigate("/login");
      localStorage.clear();
    }
    // eslint-disable-next-line
  }, [auth]);

  const handleClickShowPassword = () => {
    setShowpass(!showpass);
  };

  const handleVerifyCaptcha = () => {
    setCaptchaVerificationStatus(true);
  };

  // Form Submission Function
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        // Clear localStorage except for the "auth" item
        for (let key in localStorage) {
          if (key !== "auth") {
            localStorage.removeItem(key);
          }
        }

        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        setNotificationCount(response.data.unreadNotification);
        setUnreadConversationCount(response.data.unreadConversation);
        localStorage.setItem("auth", JSON.stringify(response.data));
        if (location.state && location.state.from) {
          navigate(location.state.from);
        } else {
          if (response.data.user.role === 0) {
            navigate("/user/departments");
          } else {
            navigate("/admin/departments");
          }
        }
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        toast.error(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("Network error. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error(error);
    }
  };
  document.title = "ZippiAi - Login";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
        overflow: "auto",
        padding: "0px",
      }}
    >
      <div
        style={{
          maxWidth: "425px",
          width: "90%",
          margin: "20px auto",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 1)",
          backdropFilter: "blur(4px)",
        }}
        className="loginBox"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/ZippiAiLogo.png"
            alt="Logo"
            width="100%"
            height="auto"
            style={{ padding: "20px 0", maxWidth: "200px" }}
          />
        </Box>

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              marginBlock: "20px",
              rowGap: "20px",
            }}
          >
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              required
              margin="dense"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              style={{
                backgroundColor: "#FAFAFA",
              }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: {
                  borderRadius: "0px",
                },
              }}
            />
            <TextField
              label="Password"
              style={{ backgroundColor: "#FAFAFA" }}
              type={showpass ? "text" : "password"}
              required
              margin="dense"
              fullWidth
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { borderRadius: "0px" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showpass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <ReCAPTCHA
            sitekey={`${process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}`}
            onChange={handleVerifyCaptcha}
            style={{ marginBottom: "10px" }}
          />
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!captchaVerificationStatus}
              sx={{
                width: "100%",
                borderRadius: "0",
                color: "white",
                height: "50px",
                backgroundColor: "#0F8FA9",
                "&:hover": {
                  backgroundColor: "#075D73",
                },
              }}
            >
              Login
            </Button>
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Typography
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                color: "#0F8FA9",
                fontSize: "12px",
              }}
              onClick={() => {
                navigate("/reset-password-mail");
              }}
            >
              Forgot Password?{" "}
            </Typography>
            <Typography
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                color: "#0F8FA9",
                fontSize: "12px",
              }}
              onClick={() => {
                navigate("/register");
              }}
            >
              Don't have an Account?
            </Typography>
          </Box>
        </form>
      </div>
    </Box>
  );
};

export default Login;
