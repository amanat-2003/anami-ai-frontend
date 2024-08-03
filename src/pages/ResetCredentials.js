import "./ResetCredentials.css";

import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, useParams } from "react-router-dom";

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

const ResetCredentials = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [captchaVerificationStatus, setCaptchaVerificationStatus] =
    useState(false);

  const handleClickShowNewPassword = () => {
    setShowNewPass(!showNewPass);
  };

  const handleClickShowConfirmNewPassword = () => {
    setShowConfirmNewPass(!showConfirmNewPass);
  };

  const handleVerifyCaptcha = () => {
    setCaptchaVerificationStatus(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/reset-password/${userId}`,
        {
          newPassword,
          confirmNewPassword,
        }
      );

      if (response.status === 200) {
        navigate("/login");
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
  document.title = "ZippiAi - Password Reset";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
        // backgroundImage: 'url("/images/app_background.png")',
        // backgroundSize: "cover",
        // backgroundPosition: "center bottom",
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
        className="resetCredentialsBox"
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
              label="New Password"
              style={{ backgroundColor: "#FAFAFA" }}
              type={showNewPass ? "text" : "password"}
              required
              margin="dense"
              fullWidth
              autoComplete="current-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { borderRadius: "0px" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowNewPassword}>
                      {showNewPass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              style={{ backgroundColor: "#FAFAFA" }}
              type={showConfirmNewPass ? "text" : "password"}
              required
              margin="dense"
              fullWidth
              autoComplete="current-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { borderRadius: "0px" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowConfirmNewPassword}>
                      {showConfirmNewPass ? <Visibility /> : <VisibilityOff />}
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
              Reset Password
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
                navigate("/register");
              }}
            >
              Make a new Account!
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
                navigate("/login");
              }}
            >
              Already have an Account?
            </Typography>
          </Box>
        </form>
      </div>
    </Box>
  );
};

export default ResetCredentials;
