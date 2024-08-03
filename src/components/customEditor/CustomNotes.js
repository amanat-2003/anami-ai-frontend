import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import { EDJ_TOOLS } from "./EditorTools.js";
import "./CustomNotes.css";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../context/auth.js";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "Heading",
        level: 1,
      },
    },
  ],
};

const CustomNotes = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(INITIAL_DATA);
  const [noteName, setNoteName] = useState("");
  const editorInstance = useRef(null);
  const loader = useRef(false);
  const [saving, setSaving] = useState(false);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        new DragDrop(editor);
        editorInstance.current = editor;
      },
      data,
      tools: EDJ_TOOLS,
      autofocus: true,
      onChange: async () => {
        const content = await editor.saver.save();
        setData(content);
      },
    });
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
    } else if (auth.user) {
      if (!editorInstance.current && !loader.current) {
        loader.current = true;
        initEditor();
      }

      return () => {
        if (editorInstance.current) {
          editorInstance.current.destroy();
          editorInstance.current = null;
        }
      };
    }
    // eslint-disable-next-line
  }, [auth]);

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);

    try {
      if (!noteName) {
        toast.error("Note name is required");
        return;
      }
      if (editorInstance.current) {
        const savedData = await editorInstance.current.saver.save();
        setData(savedData);
        try {
          const noteData = {
            noteName: noteName.toLowerCase().trim(),
            noteData: savedData.blocks,
          };
          const response = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/custom-note/save-note-data`,
            noteData,
            {
              params: { userId: auth?.user?._id },
            }
          );
          if (response.status === 201) {
            toast.success("Note saved successfully.");
            navigate(`/user/departments`);
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
            toast.error(
              "An unexpected error occurred. Please try again later."
            );
          }
          console.error(error);
        }
      }
    } catch (error) {
      console.error("Failed to save data:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"row"} width={"100%"}>
      <Box width={"100%"} padding={"15px"} height={"100vh"} overflow={"auto"}>
        <Box
          width={"100%"}
          padding={"5px"}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={"8px"}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"start"}
            justifyContent={"start"}
            padding={"0 5px"}
          >
            <Typography
              component={"label"}
              variant="overline"
              htmlFor="noteName"
              style={{ textTransform: "capitalize" }}
            >
              Note Name
            </Typography>
            <input
              type="text"
              name="notename"
              id="noteName"
              required
              title="note name"
              placeholder="Untitled"
              style={{
                padding: "5px",
                border: "1px solid black",
                borderRadius: "5px",
                outline: "none",
                fontSize: ".9em",
              }}
              value={noteName}
              onChange={(e) => setNoteName(e.target.value)}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={"8px"}
            padding={"0 5px"}
          >
            <Button
              variant="contained"
              style={{ background: "white", color: "black" }}
              onClick={() => navigate("/user/departments")}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              style={{
                height: "fit-content",
                border: "2px solid black",
                color: "black",
              }}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              style={{
                height: "fit-content",
                background: "black",
                color: "white",
              }}
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? (
                <CircularProgress size={"25px"} style={{ color: "white" }} />
              ) : (
                <>Save</>
              )}
            </Button>
          </Box>
        </Box>
        <Box padding={"5px"} margin={"5px 0"}>
          <div
            id="editorjs"
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "5px",
            }}
          ></div>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomNotes;
