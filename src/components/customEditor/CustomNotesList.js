import React, { useEffect, useState } from "react";
import "./CustomNotes.css";
import { useAuth } from "../../context/auth.js";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CustomNotesList = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [myNotes, setMyNotes] = useState([]);
  const [deleting, setDeleting] = useState(false);

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
    } else if (auth.user) {
      getAllNotes();
    }
    // eslint-disable-next-line
  }, [auth]);

  // Fetch all the notes
  const getAllNotes = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/custom-note/get-all-notes-info`
      );
      if (response.status === 200) {
        const sortedNotes = response.data.notes;
        setMyNotes(sortedNotes);
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
    } finally {
      setLoading(false);
    }
  };

  // Delete the note
  const handleDelete = async ({ id }) => {
    if (deleting || !id) return;

    setDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/custom-note/delete-note-data/${id}`,
        {
          params: { userId: auth?.user?._id },
        }
      );
      if (response.status === 200) {
        setMyNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
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
      setDeleting(false);
    }
  };

  // mvoe to update note page
  const handleClick = ({ id }) => {
    navigate(`/user/custom/notes/update/${id}`);
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      width={"100%"}
      margin={"10px 16px"}
      padding={"10px 19px"}
    >
      <Box width={"100%"} padding={"15px"} height={"100vh"} overflow={"auto"}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
          gap={"5px"}
          padding={"5px 1px"}
        >
          <Typography
            variant="h4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <img
              alt="pdf"
              src="/images/noteIcon2.png"
              style={{
                height: "30px",
              }}
            />
            Custom Templates
          </Typography>
          <div>
            <IconButton
              variant="outline"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                background: "white",
                border: "1px solid black",
                borderRadius: "3px",
                textTransform: "capitalize",
                height: "40px",
              }}
              onClick={() => navigate(`/user/custom/notes/create`)}
            >
              <PostAddRoundedIcon />
            </IconButton>
            <IconButton
              variant="outline"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                background: "white",
                border: "1px solid black",
                // borderRadius: "3px",
                textTransform: "capitalize",
                height: "40px",
              }}
              onClick={() => getAllNotes()}
            >
              {loading ? (
                <CircularProgress size={"24px"} style={{ color: "black" }} />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </div>
        </Box>
        <Box width={"100%"} padding={"5px"}>
          {loading ? (
            <Box
              width={"100%"}
              height={"100vh"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <CircularProgress style={{ color: "black" }} />
            </Box>
          ) : (
            <Box width={"100%"}>
              {myNotes.length === 0 ? (
                <Typography
                  variant="body1"
                  component={"h6"}
                  style={{ padding: "5px", color: "black" }}
                >
                  No notes found.
                </Typography>
              ) : (
                <Box
                  padding={"5px"}
                  width={"100%"}
                  marginTop={"8px"}
                  gap={"5px"}
                >
                  {myNotes.map((note, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid black",
                        borderRadius: "5px",
                        padding: "5px 8px",
                        boxShadow: "0 0 7px #dadce0",
                        maxWidth: "720px",
                        margin: "10px auto",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => handleClick({ id: note._id })}
                      >
                        <Typography
                          variant="subtitle1"
                          component={"h1"}
                          style={{
                            textTransform: "capitalize",
                          }}
                        >
                          {note.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{ color: "gray", marginTop: "5px" }}
                        >
                          {new Date(note.dateTime).toLocaleString()}
                        </Typography>
                      </div>
                      <div>
                        <Tooltip
                          title="Delete"
                          aria-label="delete note"
                          placement="right"
                          arrow
                        >
                          <IconButton
                            disabled={deleting}
                            onClick={() => handleDelete({ id: note._id })}
                          >
                            <DeleteOutlineRoundedIcon
                              style={{ color: "black" }}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomNotesList;
