import axios from "axios";
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Container, Typography, CircularProgress } from "@mui/material";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const titleStyle = {
  marginBottom: "16px",
  fontSize: "23px",
  fontWeight: "bold",
};

const messageStyle = {
  marginTop: "16px",
  fontSize: "16px",
};

const loadingStyle = {
  fontSize: "16px",
};

const UserVerification = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [isComponentMounted, setIsComponentMounted] = useState(true);

  const verifyUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/verify-user/${userId}`
      );

      if (response.status === 200) {
        setIsVerified(true);
        setMessage(response.data.message);
        toast.success(response.data.message);

        const redirectTimeout = setTimeout(() => {
          if (isComponentMounted) {
            navigate("/login");
          }
        }, response.data.redirectDelay || 5000);

        return () => clearTimeout(redirectTimeout);
      } else {
        setError(response.data.message);
        setTimeout(verifyUser, 10000);
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

  useEffect(() => {
    verifyUser();
    setIsComponentMounted(true);
    return () => {
      setIsComponentMounted(false);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (redirectCountdown > 0) {
      const timer = setInterval(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [redirectCountdown]);

  document.title = "ZippiAi - Verify";

  return (
    <Container maxWidth="sm" style={containerStyle}>
      <Typography variant="h4" style={titleStyle}>
        Verifying User
      </Typography>
      {error ? (
        <Typography variant="body1" style={{ ...messageStyle, color: "red" }}>
          {error}
        </Typography>
      ) : isVerified ? (
        <Typography variant="body1" style={{ ...messageStyle, color: "green" }}>
          {message}. Redirecting to the login page in {redirectCountdown}{" "}
          seconds...
        </Typography>
      ) : (
        <CircularProgress color="primary" style={loadingStyle} />
      )}
    </Container>
  );
};

export default UserVerification;
