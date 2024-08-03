import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import ClosedCaptionRoundedIcon from "@mui/icons-material/ClosedCaptionRounded";

const TranscriptionContent = ({
  video,
  selectedTab,
  handleTranscribeVideo,
  transcriptionInProgress,
}) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const colors = [
    "#fef2e9",
    "#faeded",
    "#f6ebf1",
    "#f0ecf5",
    "#e9f1f8",
    "#e7f5f6",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 500);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

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
    <div
      style={{
        width: "100%",
        overflow: "auto",
        marginBottom: "16px",
        height:
          video?.transcriptions[selectedTab]?.text.length > 0
            ? "calc(100% - 50px)"
            : "100%",
        padding: "15px 5px",
      }}
    >
      {video?.transcriptions[selectedTab]?.text.length > 0 ? (
        <div
          style={{
            fontSize: "13px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.5",
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: parseText(video?.transcriptions[selectedTab]?.text),
            }}
          />
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            gap: "5px",
            flexDirection: "row",
            color: "grey",
          }}
        >
          <Typography>No transcription</Typography>
          <Tooltip title="Transcribe" arrow placement="bottom">
            <span>
              <IconButton
                style={{
                  backgroundColor: colors[currentColorIndex],
                  padding: "7px",
                }}
                disabled={transcriptionInProgress}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTranscribeVideo();
                }}
              >
                <ClosedCaptionRoundedIcon
                  style={{ color: "#000", fontSize: "17px" }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
    </div>
  );
};

export default TranscriptionContent;
