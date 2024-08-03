import React, { useState } from "react";

import {
  Menu,
  Tooltip,
  Checkbox,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import { PDFItem } from "./PDFItem.js";
import { PPTItem } from "./PPTItem.js";
import { CSVItem } from "./CSVItem.js";
import { WordItem } from "./WordItem.js";
import { TextItem } from "./TextItem.js";

export const DocumentItem = ({
  auth,
  document,
  documentToProcess,
  handleShowDocument,
  handleProcessDocument,
  handleDocFileDownload,
  handleOpenDocumentDeleteDialog,
  vectorstoreConversionInProgress,
  handleOpenMetadataDialog,
  handleDocumentSelection,
  deleteDocumentLoader,
  selectedDocuments,
  setNotificationContent,
  setNotificationReturnMessage,
  handleOpenPermissionConfirmDialog,
  setSelectedDocument,
  setIsDocDisplayOpen,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const lastDotIndex = document.fileName.lastIndexOf(".");
  const fileExtension = document.fileName
    .substring(lastDotIndex + 1)
    .toLowerCase();

  // Render the respective document item component based on file type
  const renderDocumentItem = () => {
    switch (fileExtension) {
      case "pdf":
        return <PDFItem document={document} />;
      // case "ppt":
      case "pptx":
        return <PPTItem document={document} />;
      // case "doc":
      case "docx":
        return <WordItem document={document} />;
      case "csv":
        return <CSVItem document={document} />;
      case "txt":
        return <TextItem document={document} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: "50%", minWidth: "200px", maxWidth: "20%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "4px",
          padding: "2px",
          borderRadius: "5px",
          border: "solid 1px #eee",
          position: "relative",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
        onClick={() => {
          if (!deleteDocumentLoader) {
            handleShowDocument(document);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {document.processed ? (
          <></>
        ) : (
          <>
            <Tooltip title={"Not Processed"} placement="top" arrow>
              <InfoIcon
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  fontSize: "13px",
                  color: "red",
                }}
              />
            </Tooltip>
          </>
        )}
        {(isHovered || selectedDocuments?.length > 0) && (
          <Checkbox
            color="primary"
            size="small"
            style={{
              cursor: "default",
              padding: "7px",
              borderRadius: "2px",
              position: "absolute",
            }}
            checked={selectedDocuments.includes(document)}
            onClick={(e) => {
              e.stopPropagation();
              handleDocumentSelection(document);
            }}
          />
        )}
        {renderDocumentItem()}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e);
          }}
          style={{ cursor: "auto" }}
        >
          <MoreVertOutlinedIcon style={{ color: "#000" }} />
        </IconButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {!document.processed && (
          <MenuItem
            disabled={vectorstoreConversionInProgress}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              handleProcessDocument(document);
            }}
          >
            <ListItemIcon
              style={{
                fontSize: "20px",
                color: "#3C4043",
              }}
            >
              <SettingsSuggestOutlinedIcon style={{ fontSize: "28px" }} />
            </ListItemIcon>
            <ListItemText>Process</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleDocFileDownload(document);
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <FileDownloadOutlinedIcon />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            setSelectedDocument(document);
            if (
              auth?.user?.permissions.includes("Delete Document") ||
              auth?.user?.permissions.includes("All") ||
              document.isApprovedForDeletion
            ) {
              setIsDocDisplayOpen(false);
              handleOpenDocumentDeleteDialog(document);
            } else {
              const notificationObject = {
                recipientId: auth?.user?.admin,
                senderId: auth?.user?._id,
                type: "Document Approval for Deletion",
                content: `${auth?.user?.username} seeking permission for deleting document: '${document?.fileName}'.\nThe document is in asset: '${document?.assetName}' `,
                senderName: auth?.user?.username,
                assetId: document?.asset,
                assetName: document?.assetName,
                documentName: document?.fileName,
                documentId: document?._id,
              };

              setNotificationContent(notificationObject);
              setNotificationReturnMessage("Sent for approval for deletion");
              handleOpenPermissionConfirmDialog();
            }
          }}
          disabled={
            documentToProcess?._id === document._id &&
            vectorstoreConversionInProgress
          }
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <DeleteOutlinedIcon />
          </ListItemIcon>
          Delete
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleOpenMetadataDialog(document);
          }}
        >
          <ListItemIcon
            style={{
              fontSize: "20px",
              color: "#3C4043",
            }}
          >
            <InfoOutlinedIcon />
          </ListItemIcon>
          About
        </MenuItem>
      </Menu>
    </div>
  );
};
