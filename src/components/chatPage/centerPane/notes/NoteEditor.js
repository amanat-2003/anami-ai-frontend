import axios from "axios";
import toast from "react-hot-toast";
import React, { useCallback, useEffect, useState } from "react";

import { IconButton, Tooltip } from "@mui/material";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import BlotFormatter, {
  ImageSpec,
  AlignAction,
  DeleteAction,
  ResizeAction,
} from "quill-blot-formatter";

import ModifyNoteDialog from "./ModifyNoteDialog.js";

class CustomImageSpec extends ImageSpec {
  getActions() {
    return [DeleteAction, ResizeAction, AlignAction];
  }
}
Quill.register("modules/blotFormatter", BlotFormatter);

// Function to convert plain text to HTML
const parseText = (text) => {
  let html = text
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<ul><li>$1</li></ul>")
    .replace(/^\n/gm, "<br/>")
    .replace(/^\n{2,}/g, "</p><p>")
    .replace(/\[([^[]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/```([^`]+)```/gs, "<pre>$1</pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\n/gm, "<br/>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/(?:^|\n)(\|.*\|)\s*(?=\n|$)/g, (match) => {
      const rows = match
        .trim()
        .split("\n")
        .map((row) => {
          const cells = row
            .split("|")
            .filter(Boolean)
            .map((cell) => cell.trim());
          return `<tr>${cells
            .map(
              (cell) =>
                `<td style="padding: 5px; border: 1px solid black; width: ${
                  100 / cells.length
                }%; height: 100%;">${cell}</td>`
            )
            .join("")}</tr>`;
        })
        .join("");
      return `<table style="width: 100%; display: table; table-layout: fixed; border-collapse: collapse;">${rows}</table>`;
    });

  // Close all <ul> tags (since we opened them unconditionally)
  html = html.replace(/<\/ul><ul>/g, "");

  // Wrap all in a paragraph tag to ensure proper Quill handling
  html = `<p>${html}</p>`;

  return html;
};

const NoteEditor = ({
  user,
  note,
  quillRef,
  noteContent,
  handleLogout,
  selectedText,
  savedSelection,
  setSelectedText,
  setSavedSelection,
  handleGenerateNote,
  isModifyNoteDialogOpen,
  setIsModifyNoteDialogOpen,
}) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [textModificationInProgress, setTextModificationInProgress] =
    useState(false);
  const [modifiedText, setModifiedText] = useState("");

  const colors = [
    "#fef2e9",
    "#faeded",
    "#f6ebf1",
    "#f0ecf5",
    "#e9f1f8",
    "#e7f5f6",
  ]; // Add more colors as needed

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 500);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  const prompts = [
    {
      key: 1,
      value: "Reform",
      prompt:
        "Reform the text to improve the grammar, sentence structure and easy to understand language, without changing the meaning of the original text.",
    },
    {
      key: 2,
      value: "Summarize",
      prompt:
        "Summarize the text in a easy to understand language with accurate information.",
    },
    {
      key: 3,
      value: "Make SOPs",
      prompt:
        "Use the text to make detailed Standard Operating Procedures with proper subheadings and explaination.",
    },
  ];

  const resetPromptFields = () => {
    setSelectedText("");
    setTextFieldValue("");
    setSavedSelection("");
    setModifiedText("");
  };

  const handleTextSelection = () => {
    const selection = quillRef.current.getSelection();
    if (selection && selection.length > 0) {
      const endBounds = quillRef.current.getBounds(
        selection.index + selection.length
      );
      setIsButtonVisible(true);
      setButtonPosition({ top: endBounds.bottom, left: endBounds.left });
    } else {
      setIsButtonVisible(false);
    }
  };

  const handleButtonClick = () => {
    const selection = quillRef.current.getSelection();
    if (selection && selection.length > 0) {
      const currentSelectedText = quillRef.current.getText(
        selection.index,
        selection.length
      );
      setSelectedText(currentSelectedText);
      setSavedSelection(selection);
      setIsModifyNoteDialogOpen(true);
    } else {
      setIsButtonVisible(false);
    }
  };

  const handleModifyNoteDialogClose = () => {
    setIsModifyNoteDialogOpen(false);
    resetPromptFields();
  };

  // Modify note content
  const handleModifyNoteContent = async (promptText) => {
    try {
      setTextModificationInProgress(true);
      toast.promise(
        axios.post(`${process.env.REACT_APP_API}/api/v1/note/modify-note`, {
          userId: user._id,
          noteId: note._id,
          text: selectedText,
          prompt: promptText || textFieldValue,
        }),
        {
          loading: "Modifying... Please Wait!",
          success: (response) => {
            setModifiedText(response.data.answer[0].text);
            setTextModificationInProgress(false);
            return response.data.message;
          },
          error: (error) => {
            setTextModificationInProgress(false);
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

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;
      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const toolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        [{ list: "bullet" }, { list: "ordered" }],
        [{ script: "sub" }, { script: "super" }],
        [
          { font: [] },
          // { size: [] },
          { header: [1, 2, 3, 4, 5, 6, false] },
          { color: [] },
          // { background: [] },
        ],
      ];

      const quillInstance = new Quill("#editor", {
        modules: {
          blotFormatter: {
            specs: [CustomImageSpec],
            overlay: {
              style: {
                border: "2px dashed red",
              },
            },
          },
          toolbar: toolbarOptions,
        },
        theme: "snow",
      });

      const htmlContent = parseText(noteContent);
      quillInstance.root.innerHTML = htmlContent;
      quillRef.current = quillInstance;

      // Event listener for text selection change
      quillInstance.on("selection-change", handleTextSelection);
    },
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current;
      quill.getModule("toolbar").container.style.minHeight = "50px";
      quill.getModule("toolbar").container.style.width = "100%";
      quill.getModule("toolbar").container.style.display = "flex";
      quill.getModule("toolbar").container.style.flexWrap = "wrap";
      quill.getModule("toolbar").container.style.justifyContent = "center";
      quill.getModule("toolbar").container.style.alignItems = "center";
    }
  }, [quillRef]);

  return (
    <>
      <ModifyNoteDialog
        quillRef={quillRef}
        textFieldValue={textFieldValue}
        setTextFieldValue={setTextFieldValue}
        handleGenerateNote={handleGenerateNote}
        isModifyNoteDialogOpen={isModifyNoteDialogOpen}
        handleModifyNoteDialogClose={handleModifyNoteDialogClose}
        handleModifyNoteContent={handleModifyNoteContent}
        prompts={prompts}
        modifiedText={modifiedText}
        savedSelection={savedSelection}
        textModificationInProgress={textModificationInProgress}
      />
      <div
        ref={wrapperRef}
        id="editor"
        style={{
          height: `calc(100%)`,
          overflow: "auto",
          width: "100%",
        }}
      >
        {isButtonVisible && (
          <Tooltip
            title={
              "Ask ZippiAi assistant to help you in crafting knowledgebase, SOP, manuals and documentation."
            }
            placement="bottom"
          >
            <IconButton
              style={{
                position: "absolute",
                top: `${buttonPosition.top}px`,
                left: `${buttonPosition.left + 10}px`,
                backgroundColor: colors[currentColorIndex],
                transition: "background-color 0.2s ease",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleButtonClick();
              }}
            >
              <AutoFixHighRoundedIcon style={{ color: "#000" }} />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </>
  );
};

export default NoteEditor;
