import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import HeightRoundedIcon from "@mui/icons-material/HeightRounded";

let docId;

const checkS3ObjectExists = async (url) => {
  return fetch(url, { method: "GET" })
    .then((response) => response.ok)
    .catch(() => false);
};

const getFileType = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  const extension = fileName.substring(lastDotIndex + 1).toLowerCase();
  switch (extension) {
    case "pdf":
      return "pdf";
    case "doc":
    case "docx":
      return "word";
    case "ppt":
    case "pptx":
      return "ppt";
    case "csv":
      return "csv";
    case "txt":
      return "text";
    default:
      return "pdf";
  }
};

const DocDisplaySection = ({
  user,
  pageNumber,
  documentToDisplay,
  setIsDocDisplayOpen,
}) => {
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    if (!documentToDisplay) return;

    docId = documentToDisplay._id;
    const url = documentToDisplay.filePath;
    const fileName = documentToDisplay.fileName;
    const fileType = getFileType(fileName);

    const renderPDF = () => {
      if (!window.AdobeDC) {
        console.error(
          "Adobe PDF Embed API not loaded. Check script in index.html"
        );
        return;
      }

      const previewConfig = {
        embedMode: "FULL_WINDOW",
        defaultViewMode: "FIT_WIDTH",
        showAnnotationTools: false,
        enableFormFilling: false,
        enableLinearization: true,
      };

      new window.AdobeDC.View({
        clientId: `${process.env.REACT_APP_ADOBE_PDF_EMBED_API_KEY}`,
        divId: "adobe-dc-view",
      })
        .previewFile(
          {
            content: { location: { url } },
            metaData: { fileName },
          },
          previewConfig
        )
        .then((adobeViewer) => {
          adobeViewer.getAPIs().then((apis) => {
            apis.gotoLocation(pageNumber).catch(console.error);
          });
        });
    };

    const renderOtherDocs = () => {
      setDoc(documentToDisplay);
    };

    checkS3ObjectExists(url).then((exists) => {
      if (exists) {
        if (fileType === "pdf") {
          renderPDF();
        } else {
          renderOtherDocs();
        }
      } else {
        setIsDocDisplayOpen(false);
        toast.error("Document not found in the database.");
      }
    });
  }, [documentToDisplay, pageNumber, setIsDocDisplayOpen]);

  const openInNewTab = () => {
    if (user?.role === 0) {
      window.open(`/user/view-file/${docId}`, "_blank");
    } else if (user?.role === 1) {
      window.open(`/admin/view-file/${docId}`, "_blank");
    } else {
      toast.error("Access Denied");
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "50px",
          backgroundColor: "#e7f5f6",
          padding: "5px 50px 5px 5px",
          position: "relative",
          borderLeft: "2px solid #0f8fa9",
        }}
      >
        <Tooltip title={"Resize"} arrow>
          <span>
            <IconButton
              style={{ background: "transparent", cursor: "auto" }}
              disabled={true}
            >
              <HeightRoundedIcon
                style={{
                  color: "#0f8fa9",
                  transform: "rotate(90deg)",
                  position: "relative",
                  zIndex: "1000",
                }}
              />
            </IconButton>
          </span>
        </Tooltip>
        <div>
          <Tooltip title={"Open in new tab"} arrow>
            <IconButton
              style={{ background: "transparent" }}
              onClick={openInNewTab}
            >
              <OpenInNewRoundedIcon style={{ color: "#0f8fa9" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={"Close"} arrow>
            <IconButton
              style={{ background: "transparent" }}
              onClick={() => setIsDocDisplayOpen(false)}
            >
              <CloseRoundedIcon style={{ color: "#0f8fa9" }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {documentToDisplay &&
        getFileType(documentToDisplay.fileName) === "pdf" && (
          <div
            id="adobe-dc-view"
            style={{
              width: "100%",
              height: "calc(100% - 50px)",
              zIndex: "1000",
            }}
          ></div>
        )}
      {doc && (
        <div
          id="doc-viewer"
          style={{ width: "100%", height: "calc(100% - 50px)", zIndex: "1500" }}
        >
          <>
            {["csv", "text"].includes(getFileType(doc.fileName)) && (
              <iframe
                width="100%"
                height="100%"
                title={doc.fileName}
                src={`https://docs.google.com/gview?url=${doc.filePath}&embedded=true`}
              />
            )}
            {["word", "ppt"].includes(getFileType(doc.fileName)) && (
              <iframe
                width="100%"
                height="100%"
                title={doc.fileName}
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${doc.filePath}`}
              />
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default DocDisplaySection;
