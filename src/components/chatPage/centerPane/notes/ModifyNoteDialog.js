import Draggable from "react-draggable";
import { toast } from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Slide,
  Paper,
  Button,
  Dialog,
  Tooltip,
  TextField,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaperComponent(props) {
  const paperRef = useRef(null);

  return (
    <Draggable
      handle={".draggable-dialog"}
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={paperRef}
    >
      <Paper {...props} ref={paperRef} />
    </Draggable>
  );
}

const ModifyNoteDialog = (props) => {
  const {
    prompts,
    quillRef,
    modifiedText,
    savedSelection,
    textFieldValue,
    setTextFieldValue,
    // handleGenerateNote,
    isModifyNoteDialogOpen,
    handleModifyNoteContent,
    textModificationInProgress,
    handleModifyNoteDialogClose,
  } = props;

  const [currentColorIndex, setCurrentColorIndex] = useState(0);

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
    }, 200);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  const handleTextFieldChange = (event) => {
    setTextFieldValue(event.target.value);
  };

  const handleCopyResponse = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied");
    } catch (error) {
      toast.error("Unable to copy");
    }
  };

  const handleReplaceText = (newText) => {
    const selection = savedSelection;
    const quill = quillRef.current;
    if (selection) {
      quill.deleteText(selection.index, selection.length);
      quill.insertText(selection.index, newText);
    } else {
      handleCopyResponse(newText);
    }
    handleModifyNoteDialogClose();
  };

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

  return (
    <div>
      <Dialog
        open={isModifyNoteDialogOpen}
        onClose={handleModifyNoteDialogClose}
        PaperComponent={PaperComponent}
        PaperProps={{ style: { borderRadius: "15px" } }}
        aria-labelledby="draggable-dialog"
        TransitionComponent={Transition}
        TransitionProps={{
          timeout: {
            enter: 500,
            exit: 200,
          },
        }}
        fullWidth
      >
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: `calc(50px)`,
            // backgroundColor: "#e7f5f6",
            padding: "0px",
            cursor: "move",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="draggable-dialog"
          ></div>
          <IconButton
            style={{ margin: "0px 5px" }}
            onClick={handleModifyNoteDialogClose}
          >
            <CloseOutlinedIcon style={{ color: "#0f8fa9" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "2px 0 0 0",
            background: "#FCFCFC",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "5px",
              padding: "0px 30px 5px 30px",
              margin: "0",
            }}
          >
            <TextField
              placeholder="Modify with a custom prompt"
              value={textFieldValue}
              onChange={handleTextFieldChange}
              autoFocus
              fullWidth
              size="small"
              multiline
              maxRows={5}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  handleTextFieldChange(e, "\n");
                } else if (
                  e.key === "Enter" &&
                  textFieldValue.trim() !== "" &&
                  !textModificationInProgress
                ) {
                  e.preventDefault();
                  handleModifyNoteContent();
                }
              }}
              style={{
                width: "100%",
                borderRadius: "25px",
              }}
              InputProps={{
                style: {
                  padding: "5px 5px 5px 20px",
                  backgroundColor: "#FFF",
                  borderRadius: "25px",
                },
                endAdornment: (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip
                      title={
                        "Ask ZippiAi assistant to help you in crafting knowledgebase, SOP, manuals and documentation."
                      }
                      arrow
                      placement="top"
                    >
                      <span>
                        <IconButton
                          size="small"
                          style={{
                            backgroundColor: colors[currentColorIndex],
                            padding: "7px",
                          }}
                          disabled={
                            textFieldValue.trim() === "" ||
                            textModificationInProgress
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleModifyNoteContent();
                          }}
                        >
                          {textModificationInProgress ? (
                            <>
                              <CircularProgress
                                color="success"
                                size={20}
                                thickness={4}
                              />
                            </>
                          ) : (
                            <>
                              <AutoFixHighRoundedIcon
                                style={{ color: "#000", fontSize: "20px" }}
                              />
                            </>
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                ),
              }}
            />
          </div>
          <div style={{ padding: "10px 30px 20px 30px", overflow: "auto" }}>
            {prompts.length > 0 && !modifiedText && (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  margin: "10px 0 0 0",
                  overflow: "auto",
                }}
              >
                {prompts.map((prompt, index) => (
                  <Tooltip
                    title={prompt.prompt}
                    placement="bottom"
                    key={index}
                    arrow
                  >
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                        border: "1px solid #ccc",
                        borderRadius: "500px",
                        padding: "5px 25px",
                        cursor: "pointer",
                      }}
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                          color: "#000",
                          fontWeight: "600",
                          backgroundColor: colors[currentColorIndex],
                        },
                      }}
                      onClick={(e) => {
                        if (!textModificationInProgress) {
                          handleModifyNoteContent(prompt.prompt);
                        }
                        e.stopPropagation();
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {prompt.value}
                      </div>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            )}
            {modifiedText && (
              <div
                style={{
                  overflow: "auto",
                  margin: "10px 0 0 0",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: parseText(modifiedText),
                  }}
                />
              </div>
            )}
          </div>
          {modifiedText && (
            <div
              style={{
                padding: "5px 25px 10px 25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Tooltip title={"Copy"} arrow placement="bottom">
                <IconButton
                  size="small"
                  aria-label="Copy to clipboard"
                  style={{
                    fontSize: "20px",
                    // color: "#3C4043",
                    padding: "1px",
                    marginInline: "5px",
                    background: "transparent",
                  }}
                  onClick={(e) => {
                    handleCopyResponse(modifiedText);
                    e.stopPropagation();
                  }}
                >
                  <ContentCopyRoundedIcon style={{ fontSize: "20px" }} />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 30px",
          }}
        >
          <div>
            {modifiedText && (
              <Button
                onClick={(e) => {
                  handleReplaceText(modifiedText);
                  e.stopPropagation();
                }}
              >
                Replace
              </Button>
            )}
            {/* <Button
              onClick={(e) => {
                if (modifiedText.trim().length > 0) {
                  handleGenerateNote(modifiedText);
                } else {
                  toast.error("No text found");
                }
                e.stopPropagation();
              }}
            >
              Create note
            </Button> */}
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModifyNoteDialog;
