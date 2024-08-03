import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import { EDJ_TOOLS } from "./EditorTools.js";
import "./CustomNotes.css";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/auth.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const CustomNoteUpdate = () => {
  const [auth, setAuth] = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [noteName, setNoteName] = useState("");
  const [myNote, setMyNote] = useState(null);
  const editorInstance = useRef(null);
  const loader = useRef(false);
  const [updating, setUpdating] = useState(false);

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
      getNoteData();
    }
    // eslint-disable-next-line
  }, [auth, params.noteId]);

  useEffect(() => {
    if (!editorInstance.current && !loader.current && myNote !== null) {
      loader.current = true;
      initEditor();
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
    // eslint-disable-next-line
  }, [noteName]);

  const initEditor = () => {
    if (!editorInstance.current) {
      const editor = new EditorJS({
        holder: "update-editorjs",
        onReady: () => {
          new DragDrop(editor);
          editorInstance.current = editor;
        },
        data: {
          time: new Date().getTime(),
          blocks: myNote,
        },
        tools: EDJ_TOOLS,
        autofocus: true,
        onChange: async () => {
          const content = await editor.saver.save();
          setMyNote(content.blocks);
        },
      });
    }
  };

  const getNoteData = async () => {
    if (loading || !params.noteId) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/custom-note/get-note-data/${params.noteId}`
      );
      if (response.status === 200) {
        const note = response.data.note;
        setMyNote(note.data);
        setNoteName(note.name);
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

  const handleUpdate = async () => {
    if (updating || !params?.noteId) return;
    setUpdating(true);

    try {
      const noteData = {
        noteId: params?.noteId,
        updatedNoteData: myNote,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/custom-note/update-note-data`,
        noteData,
        {
          params: { userId: auth?.user?._id },
        }
      );
      if (response.status === 200) {
        toast.success("Note updated successfully.");
        navigate("/user/departments");
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
      setUpdating(false);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"row"} width={"100%"}>
      <Box width={"100%"} padding={"15px"} height={"100vh"} overflow={"auto"}>
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
        ) : !noteName || !myNote ? (
          <Box
            width={"100%"}
            padding={"5px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant="body1" component={"h1"}>
              No such note exists
            </Typography>
          </Box>
        ) : (
          <Box width={"100%"}>
            <Box
              width={"100%"}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              padding={"5px"}
              gap={"1px"}
            >
              <Typography
                variant="subtitle1"
                component={"span"}
                style={{ color: "black", textTransform: "capitalize" }}
              >
                {noteName}
              </Typography>
              <Box
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                gap={"5px"}
              >
                <Button
                  variant="contained"
                  style={{ background: "white", color: "black" }}
                  onClick={() => navigate("/user/departments")}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ background: "black", color: "white" }}
                  disabled={updating}
                  onClick={handleUpdate}
                >
                  {updating ? (
                    <CircularProgress
                      size={"25px"}
                      style={{ color: "white" }}
                    />
                  ) : (
                    <>Update</>
                  )}
                </Button>
              </Box>
            </Box>
            <Divider />
            <Box padding={"5px"} margin={"5px 0"}>
              <div
                id="update-editorjs"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "5px",
                }}
              ></div>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CustomNoteUpdate;
