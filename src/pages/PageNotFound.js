import React, { useEffect } from "react";
import { useAuth } from "../context/auth.js";
import { useNavigate } from "react-router-dom";

import { Grid, Typography, Button } from "@mui/material";
import toast from "react-hot-toast";

const PageNotFound = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user === null && auth.token === "") {
      navigate("/login");
      localStorage.clear();
      toast.success("Logout successful");
    }
    // eslint-disable-next-line
  }, [auth]);

  const handleReturnHome = () => {
    if (auth?.user?.role === 0) {
      navigate("/user/departments");
    } else if (auth?.user?.role === 1) {
      navigate("/admin");
    }
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: `url("/images/Space.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const imageStyle = {
    maxWidth: "80%",
    height: "auto",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: "8px",
    color: "#FFF",
    maxWidth: "90%",
  };

  const buttonStyle = {
    marginTop: "1rem",
    backgroundColor: "#FF5722",
    color: "#FFF",
  };

  document.title = "ERROR 404";

  return (
    <Grid container style={containerStyle}>
      <Grid
        item
        xs={12}
        sm={12}
        md={4}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src="/images/Error.png" alt="Error 404" style={imageStyle} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={7}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={contentStyle}>
          <Typography variant="h4" gutterBottom style={{ color: "#FF5722" }}>
            Uh-oh! You've stumbled upon uncharted digital territory.
          </Typography>
          <Typography variant="body1" paragraph>
            The page you're seeking appears to be on a cosmic vacation, far away
            from here. Fear not, we're here to guide you back to safety!
          </Typography>
          <ol style={{ color: "#FFF", marginLeft: "1rem" }}>
            <li>
              <Typography variant="body1" paragraph>
                First, ensure that the URL hasn't been caught in a wormhole.
                Check for any mysterious typos.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                If that doesn't do the trick, let's start from square one.
                Return to our cosmic homepage and embark on a new adventure.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                If you're feeling lost in space, don't hesitate to send an
                interstellar transmission to our friendly support team. They're
                always ready to assist you on your journey.
              </Typography>
            </li>
          </ol>
          <Typography variant="body1" paragraph>
            We're tirelessly working to bridge the gap in the digital universe.
            Your patience and cosmic understanding are greatly appreciated!
          </Typography>
          <Button
            onClick={handleReturnHome}
            variant="contained"
            style={buttonStyle}
          >
            Return Home
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default PageNotFound;
