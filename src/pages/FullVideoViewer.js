import axios from "axios";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { useAuth } from "../context/auth.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import TranscriptionTabs from "../components/chatPage/centerPane/videos/TranscriptionTabs.js";
import TranscriptionContent from "../components/chatPage/centerPane/videos/TranscriptionContent.js";

// const checkS3ObjectExists = async (url) => {
//   return fetch(url, { method: "GET" })
//     .then((response) => response.ok)
//     .catch((error) => {
//       console.error(error);
//       return false;
//     });
// };

// const getFileType = (fileName) => {
//   const lastDotIndex = fileName.lastIndexOf(".");
//   const extension = fileName.substring(lastDotIndex + 1).toLowerCase();
//   switch (extension) {
//     case "mp4":
//       return "mp4";
//     case "webp":
//       return "webp";
//     default:
//       return "video";
//   }
// };

const FullVideoViewer = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [video, setVideo] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTranscript, setSelectedTranscript] = useState("");
  const [transcriptionInProgress, setTranscriptionInProgress] = useState(false);

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

  const getVideo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/media/fetch-video/${fileId}`
      );

      if (response.status === 200) {
        setVideo(response.data.file);
        setSelectedTab(0);
        setSelectedTranscript(response.data.file.transcriptions[0]);
      } else {
        toast.error(response.data.message);
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
    }
  };

  useEffect(() => {
    getVideo();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!video || !auth.user) return;
    document.title = video ? `${video.fileName}` : "Video";
    // eslint-disable-next-line
  }, [video]);

  const handleTranscribeVideo = async () => {
    try {
      setTranscriptionInProgress(true);
      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/transcribe-video`,
          {
            userId: auth.user._id,
            videoId: video._id,
          }
        ),
        {
          loading: "Transcribing... Please Wait!",
          success: (response) => {
            const updatedVideo = response.data.video;
            setVideo(updatedVideo);

            // Update localStorage
            // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));
            setTranscriptionInProgress(false);
            return response.data.message;
          },
          error: (error) => {
            setTranscriptionInProgress(false);
            console.error(error);
            if (error.response) {
              // Server responded with a status code outside of 2xx range
              if (
                error.response.data.message ===
                "Session expired!\nPlease login again."
              ) {
                handleLogout();
              }
              return error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              return "Network error. Please try again later.";
            } else {
              // Something happened in setting up the request that triggered an error
              return "An unexpected error occurred. Please try again later.";
            }
          },
        }
      );
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
    }
  };

  const handleRenameTranscription = async (name) => {
    try {
      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/rename-transcription`,
          {
            userId: auth.user._id,
            videoId: video._id,
            transcriptionLabel: name,
            transcriptionId: selectedTranscript._id,
          }
        ),
        {
          loading: "Renaming... Please Wait!",
          success: (response) => {
            if (response.status === 200) {
              const modifiedVideo = response.data.video;
              setVideo(modifiedVideo);
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            console.error(error);
            if (error.response) {
              // Server responded with a status code outside of 2xx range
              if (
                error.response.data.message ===
                "Session expired!\nPlease login again."
              ) {
                handleLogout();
              }
              return error.response.data.message;
            } else if (error.request) {
              // The request was made but no response was received
              return "Network error. Please try again later.";
            } else {
              // Something happened in setting up the request that triggered an error
              return "An unexpected error occurred. Please try again later.";
            }
          },
        }
      );
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
    }
  };

  return (
    <Box sx={{ width: "100%", height: "calc(100vh)", padding: "0px" }}>
      {video && (
        <Grid container>
          <Grid
            item
            xs={6}
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>
              <Typography
                variant="h5"
                style={{
                  fontSize: "18px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "calc(100%)",
                  padding: "7px",
                }}
                title={video.fileName}
              >
                {video.fileName}
              </Typography>
              <ReactPlayer
                url={video.filePath}
                controls
                width="100%"
                height="auto"
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <Box
              style={{
                padding: "5px",
                height: "calc(100vh)",
                overflow: "auto",
              }}
            >
              {video?.transcriptions.length > 0 && (
                <TranscriptionTabs
                  video={video}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  setSelectedTranscript={setSelectedTranscript}
                  handleRenameTranscription={handleRenameTranscription}
                />
              )}
              <div
                style={{
                  padding: "0px 25px",
                  height:
                    video?.transcriptions.length > 0
                      ? "calc(100% - 60px)"
                      : "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TranscriptionContent
                  video={video}
                  selectedTab={selectedTab}
                  handleTranscribeVideo={handleTranscribeVideo}
                  transcriptionInProgress={transcriptionInProgress}
                />
              </div>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FullVideoViewer;
