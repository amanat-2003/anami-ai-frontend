import "./Register.css";

import axios from "axios";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

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

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [showpass, setShowpass] = useState(false);
  const [captchaVerificationStatus, setCaptchaVerificationStatus] =
    useState(false);

  const handleClickShowPassword = () => {
    setShowpass(!showpass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleVerifyCaptcha = () => {
    setCaptchaVerificationStatus(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        {
          username,
          email,
          password,
          phone,
          company,
          address,
        }
      );

      if (response.status === 201) {
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

  document.title = "ZippiAi - Register";

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
        className="registerBox"
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
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              marginBlock: "20px",
              rowGap: "10px",
            }}
          >
            <TextField
              label="Username"
              required
              margin="dense"
              // size="small"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              label="Email"
              type="email"
              required
              margin="dense"
              // size="small"
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
              type={showpass ? "text" : "password"}
              required
              margin="dense"
              // size="small"
              fullWidth
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "#FAFAFA",
              }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: {
                  borderRadius: "0px",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showpass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Contact"
              type="number"
              required
              margin="dense"
              // size="small"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              label="Company"
              required
              margin="dense"
              // size="small"
              fullWidth
              value={company}
              onChange={(e) => setCompany(e.target.value)}
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
              label="Address"
              required
              margin="dense"
              // size="small"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              Sign up
            </Button>
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
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

export default Register;
