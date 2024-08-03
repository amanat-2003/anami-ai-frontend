import React, { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";

import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const TranscriptionActions = ({
  video,
  selectedTab,
  handleGenerateNote,
  handleDeleteTranscription,
  handleOpenModificationDialog,
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "10px 0px",
        gap: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <Tooltip title="Modify" placement="bottom" arrow>
          <span>
            <IconButton
              style={{
                backgroundColor: colors[currentColorIndex],
                padding: "7px",
              }}
              disabled={video?.transcriptions[selectedTab]?.text.length <= 0}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenModificationDialog();
              }}
            >
              <AutoFixHighRoundedIcon
                style={{ color: "#000", fontSize: "17px" }}
              />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Create Note" placement="bottom" arrow>
          <span>
            <IconButton
              style={{
                backgroundColor: "#0000FF10",
                padding: "7px",
              }}
              disabled={video?.transcriptions[selectedTab]?.text.length <= 0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleGenerateNote(
                  video?.transcriptions[selectedTab].text.trim()
                );
                e.stopPropagation();
              }}
            >
              <PostAddRoundedIcon style={{ color: "#000", fontSize: "17px" }} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete" placement="bottom" arrow>
          <span>
            <IconButton
              style={{
                padding: "7px",
                background: "#F001",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteTranscription();
              }}
            >
              <DeleteOutlineRoundedIcon
                style={{ color: "#F00", fontSize: "17px" }}
              />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default TranscriptionActions;
