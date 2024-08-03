import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// const checkS3ObjectExists = async (url) => {
//   return fetch(url, { method: "GET" })
//     .then((response) => response.ok)
//     .catch((error) => {
//       console.error(error);
//       return false;
//     });
// };

// const getFileType = (fileName) => {
//   const lastDotIndex = fileName.lastIndexOf(".");
//   const extension = fileName.substring(lastDotIndex + 1).toLowerCase();
//   switch (extension) {
//     case "jpg":
//       return "jpg";
//     case "png":
//       return "png";
//     default:
//       return "image";
//   }
// };

const FullImageViewer = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [file, setFile] = useState();
  // const [image, setImage] = useState(null);

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

  const getImage = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/media/fetch-image/${fileId}`
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
    getImage();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!file || !auth.user) return;

    // const url = file.filePath;
    // const fileName = file.fileName;
    // const fileType = getFileType(fileName);

    // checkS3ObjectExists(url).then((exists) => {
    //   if (exists) {
    //     setImage(file);
    //   } else {
    //     toast.error("Image not found in the database.");
    //   }
    // });
    document.title = file ? `${file.fileName}` : "Image";
    // eslint-disable-next-line
  }, [file]);

  return (
    <div
      style={{
        width: "100%",
        height: `calc(100vh)`,
        position: "relative",
        // padding: "1px"
      }}
    >
      {file && (
        <div
          id="image-viewer"
          style={{
            width: "100%",
            height: "calc(100%)",
            zIndex: "1000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={file.filePath}
            alt={file.fileName}
            height={"100%"}
            style={{ borderInline: "1px solid black" }}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default FullImageViewer;
