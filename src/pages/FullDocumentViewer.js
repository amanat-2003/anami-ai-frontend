import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const FullDocumentViewer = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [file, setFile] = useState();
  const [doc, setDoc] = useState(null);

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
    }
    // eslint-disable-next-line
  }, [auth]);

  const getFile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/media/fetch-file/${fileId}`
      );

      if (response.status === 200) {
        setFile(response.data.file);
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
    }
  };

  useEffect(() => {
    getFile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!file || !auth.user) return;

    const url = file.filePath;
    const fileName = file.fileName;
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
      }).previewFile(
        {
          content: { location: { url } },
          metaData: { fileName },
        },
        previewConfig
      );
    };

    const renderOtherDocs = () => {
      setDoc(file);
    };

    checkS3ObjectExists(url).then((exists) => {
      if (exists) {
        if (fileType === "pdf") {
          renderPDF();
        } else {
          renderOtherDocs();
        }
      } else {
        toast.error("Document not found in the database.");
      }
    });
    document.title = file ? `${file.fileName}` : "Document";
    // eslint-disable-next-line
  }, [file]);

  return (
    <div
      style={{
        width: "100%",
        height: `calc(100vh - 4px)`,
        position: "relative",
      }}
    >
      {file && getFileType(file.fileName) === "pdf" && (
        <div
          id="adobe-dc-view"
          style={{
            width: "100%",
            height: "calc(100%)",
            zIndex: "1000",
          }}
        ></div>
      )}
      {doc && (
        <div
          id="doc-viewer"
          style={{ width: "100%", height: "calc(100%)", zIndex: "1500" }}
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

export default FullDocumentViewer;
