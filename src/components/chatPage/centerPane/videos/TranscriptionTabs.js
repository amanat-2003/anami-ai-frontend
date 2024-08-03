import React, { useState } from "react";
import { Box, IconButton, Tab, Tabs, Tooltip, Typography } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const TranscriptionTabs = ({
  video,
  selectedTab,
  setSelectedTab,
  setSelectedTranscript,
  handleRenameTranscription,
}) => {
  const [labelName, setLabelName] = useState("");
  const [editingLabel, setEditingLabel] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedTranscript(video?.transcriptions[newValue]);
  };

  const handleEditLabel = (id) => {
    setEditingLabel(id);
  };

  return (
    <div style={{ height: "60px" }}>
      <Box sx={{ padding: "7px 20px 0px 25px" }}>
        <Typography
          variant="subtitle2"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            marginBottom: "5px",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Transcription Tabs"
          >
            {video?.transcriptions.map((transcript, index) => (
              <Tab
                key={transcript._id}
                style={{
                  margin: "0px",
                  padding:
                    editingLabel === transcript._id
                      ? "0 5px 0 0"
                      : selectedTab === index
                      ? "0 5px 0 10px"
                      : "0 7px",
                  background: selectedTab === index ? "#00F1" : "transparent",
                  borderRadius: "7px 7px 0 0",
                }}
                label={
                  editingLabel === transcript._id ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "35px",
                        paddingLeft: "0",
                        width: `calc(150px)`,
                      }}
                    >
                      <input
                        type="text"
                        value={labelName}
                        onChange={(event) => setLabelName(event.target.value)}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && labelName.trim() !== "") {
                            e.preventDefault();
                            handleRenameTranscription(labelName);
                            setEditingLabel(null);
                          }
                        }}
                        autoFocus
                        style={{
                          fontSize: "14px",
                          maxWidth: `calc(100px)`,
                          height: "100%",
                          padding: "10px",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          width: `calc(50px)`,
                        }}
                      >
                        <Tooltip title={"Save"} arrow>
                          <IconButton
                            size="small"
                            aria-label="Save"
                            style={{
                              margin: "0px",
                              padding: "0px",
                              // background: "transparent",
                              cursor: "default",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (labelName.trim() !== "") {
                                handleRenameTranscription(labelName);
                                setEditingLabel(null);
                              }
                            }}
                          >
                            <CheckRoundedIcon
                              style={{
                                fontSize: "20px",
                                color: "#3C4043",
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={"Cancel"} arrow>
                          <IconButton
                            size="small"
                            aria-label="Cancel"
                            style={{
                              margin: "0px",
                              padding: "0px",
                              // background: "transparent",
                              cursor: "default",
                            }}
                            onClick={(e) => {
                              setEditingLabel(null);
                              e.stopPropagation();
                            }}
                          >
                            <CloseRoundedIcon
                              style={{
                                fontSize: "20px",
                                color: "#3C4043",
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {transcript.label}
                      {selectedTab === index &&
                        editingLabel !== transcript._id && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "5px",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => {
                                setLabelName(transcript.label);
                                handleEditLabel(transcript._id);
                              }}
                              style={{ cursor: "default" }}
                            >
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                          </div>
                        )}
                    </div>
                  )
                }
              />
            ))}
          </Tabs>
        </Typography>
      </Box>
    </div>
  );
};

export default TranscriptionTabs;
