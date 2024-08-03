import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth.js";
import { useSocket } from "../context/socket.js";
import "split-pane-react/esm/themes/default.css";
import SplitPane, { Pane } from "split-pane-react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  styled,
  Button,
  Dialog,
  Tooltip,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ShortTextRoundedIcon from "@mui/icons-material/ShortTextRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
// import { useSocketService } from "../context/socketService.js";

import Asset from "../components/chatPage/centerPane/Asset.js";
import Notes from "../components/chatPage/centerPane/notes/Notes.js";
import CustomNotesList from "../components/customEditor/CustomNotesList.js";
import ChatSideDrawer from "../components/chatPage/leftPane/ChatSideDrawer.js";
import Documents from "../components/chatPage/centerPane/documents/Documents.js";
import AddNoteForm from "../components/chatPage/centerPane/notes/AddNoteForm.js";
import ImageViewer from "../components/chatPage/centerPane/images/ImageViewer.js";
import VideoViewer from "../components/chatPage/centerPane/videos/VideoViewer.js";
import MainChatSection from "../components/chatPage/centerPane/MainChatSection.js";
import UpdateAssetForm from "../components/chatPage/centerPane/UpdateAssetForm.js";
import DocUploader from "../components/chatPage/centerPane/documents/DocUploader.js";
import ImageUploader from "../components/chatPage/centerPane/images/ImageUploader.js";
import VideoUploader from "../components/chatPage/centerPane/videos/VideoUploader.js";
import DocDisplaySection from "../components/chatPage/rightPane/DocDisplaySection.js";
import UpdateNoteForm from "../components/chatPage/centerPane/notes/UpdateNoteForm.js";
import MaintenanceRecords from "../components/chatPage/centerPane/MaintenanceRecords.js";
import MachineDetailDrawer from "../components/chatPage/rightPane/MachineDetailDrawer.js";
import AddMaintenanceRecordForm from "../components/chatPage/rightPane/AddMaintenanceRecordForm.js";

const drawerWidth = 200;

const Main = styled("main", {
  shouldForwardProp: (prop) =>
    prop !== "isOpenLeftDrawer" && prop !== "isOpenRightDrawer",
})(({ theme, isOpenLeftDrawer, isOpenRightDrawer }) => ({
  flexGrow: 1,
  // padding: "20px",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingInline: "2px",
  backgroundColor: "#fff",

  ...(isOpenLeftDrawer && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
    paddingLeft: "0px",
  }),
  ...(isOpenRightDrawer && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    paddingRight: "0px",
    marginRight: `${drawerWidth}px`,
  }),
}));

const ChatPage = () => {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const [auth, setAuth] = useAuth();
  const [selectedAsset, setSelectedAsset] = useState();
  const [assets, setAssets] = useState([]);
  const [createdNote, setCreatedNote] = useState();
  const [selectedNote, setSelectedNote] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [documentToDisplay, setDocumentToDisplay] = useState();
  const [, setSelectedDocument] = useState();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const imageFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [chats, setChats] = useState([]);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [documentToProcess, setDocumentToProcess] = useState(null);
  const [noteToProcess, setNoteToProcess] = useState(null);
  // const [videoToProcess, setVideoToProcess] = useState(null);
  const [openUploadDocumentForm, setOpenUploadDocumentForm] = useState(false);
  const [openUploadImageForm, setOpenUploadImageForm] = useState(false);
  const [openUploadVideoForm, setOpenUploadVideoForm] = useState(false);
  const [isViewDetailsPopupOpen, setIsViewDetailsPopupOpen] = useState(false);
  const [openUpdateAssetForm, setOpenUpdateAssetForm] = useState(false);
  const [openAddAssetMaintenanceForm, setOpenAddAssetMaintenanceForm] =
    useState(false);
  const [isDocumentDeleteDialogOpen, setIsDocumentDeleteDialogOpen] =
    useState(false);
  const [isNoteDeleteDialogOpen, setIsNoteDeleteDialogOpen] = useState(false);
  const [isChatDeleteDialogOpen, setIsChatDeleteDialogOpen] = useState(false);
  const [isMultipleChatDeleteDialogOpen, setIsMultipleChatDeleteDialogOpen] =
    useState(false);
  const [isImageDeleteDialogOpen, setIsImageDeleteDialogOpen] = useState(false);
  const [isVideoDeleteDialogOpen, setIsVideoDeleteDialogOpen] = useState(false);
  const [isDocDisplayOpen, setIsDocDisplayOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLanguage, setChatLanguage] = useState("English");
  const [pageNumber, setPageNumber] = useState(1);
  const [responseGenerating, setResponseGenerating] = useState(false);
  const chatContainerRef = useRef(null);
  const [vectorstoreConversionInProgress, setVectorstoreConversionInProgress] =
    useState(false);
  const [socket] = useSocket();
  const [activeComponent, setActiveComponent] = useState("MainChatSection");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isAssetDeleteDialogOpen, setIsAssetDeleteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [sizes, setSizes] = useState([
    isDocDisplayOpen ? "50%" : "100%",
    isDocDisplayOpen ? "50%" : 0,
  ]);
  const [isOpenLeftDrawer, setOpenLeftDrawer] = useState(true);
  const [isOpenRightDrawer, setOpenRightDrawer] = useState(true);
  // const [isLocalStorageUpdated, setLocalStorageUpdation] = useSocketService();

  const [deleteDocumentLoader, setDeleteDocumentLoader] = useState(false);
  const [deleteNoteLoader, setDeleteNoteLoader] = useState(false);
  const [deleteImageLoader, setDeleteImageLoader] = useState(false);
  const [deleteVideoLoader, setDeleteVideoLoader] = useState(false);

  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedExistingImages, setSelectedExistingImages] = useState([]);
  const [selectedExistingVideos, setSelectedExistingVideos] = useState([]);
  const [isNoteCloseConfirmDialogOpen, setNoteCloseConfirmDialogOpen] =
    useState(false);
  const [hasDialogShown, setHasDialogShown] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [isPermissionConfirmDialogOpen, setPermissionConfirmDialogOpen] =
    useState(false);
  const [notificationContent, setNotificationContent] = useState({});
  const [notificationReturnMessage, setNotificationReturnMessage] =
    useState("");

  const handleOpenPermissionConfirmDialog = () => {
    setPermissionConfirmDialogOpen(true);
  };

  const handleClosePermissionConfirmDialog = () => {
    setPermissionConfirmDialogOpen(false);
    setNotificationContent({});
  };

  const handleOpenNoteCloseConfirmDialog = () => {
    setNoteCloseConfirmDialogOpen(true);
    setHasDialogShown(true);
  };

  const handleCloseNoteCloseConfirmDialog = () => {
    setNoteCloseConfirmDialogOpen(false);
    setHasDialogShown(false);
  };

  // Function to handle the reloading action based on user's choice in the dialog

  const handleOpenLeftDrawer = () => {
    setOpenLeftDrawer(true);
    // setOpenRightDrawer(false);
  };

  const handleCloseLeftDrawer = () => {
    setOpenLeftDrawer(false);
  };

  const handleOpenRightDrawer = () => {
    setOpenRightDrawer(true);
    // setOpenLeftDrawer(false);
  };

  const handleCloseRightDrawer = () => {
    setOpenRightDrawer(false);
  };

  useEffect(() => {
    setSizes([isDocDisplayOpen ? "50%" : "100%", isDocDisplayOpen ? "50%" : 0]);
    if (isDocDisplayOpen) {
      handleCloseRightDrawer();
    }
  }, [isDocDisplayOpen]);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
  };

  useEffect(() => {
    fetchAsset(assetId);
    // eslint-disable-next-line
  }, [assets]);

  // Fetch single department
  const fetchDepartment = async (departmentId) => {
    try {
      const department = departments.find(
        (department) => department._id === departmentId
      );
      setSelectedDepartment(department);
      // localStorage.setItem("selectedDepartment", JSON.stringify(department));
    } catch (error) {
      console.error(error);
    }
  };

  // Get selected Asset
  const fetchAsset = async (assetId) => {
    try {
      const asset = assets.find((asset) => asset._id === assetId);
      setSelectedAsset(asset);
      localStorage.setItem("asset", JSON.stringify(asset));
    } catch (error) {
      console.error(error);
    }
  };

  // // Fetch single document
  // const fetchDocument = async (documentId) => {
  //   try {
  //     const document = documents.find(
  //       (document) => document._id === documentId
  //     );
  //     setDocumentToDisplay(document);
  //     // localStorage.setItem("documentToDisplay", JSON.stringify(document));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // // Fetch single note
  // const fetchNote = async (noteId) => {
  //   try {
  //     const note = notes.find((note) => note._id === noteId);
  //     setDocumentToDisplay(note);
  //     // localStorage.setItem("noteDocument", JSON.stringify(note));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // Open selected chat
  const fetchChat = async (chat) => {
    try {
      openComponent("MainChatSection");
      setSelectedChat(chat);
      // localStorage.setItem("selectedChat", JSON.stringify(chat));
      setChatMessages(chat.messages);
      // localStorage.setItem("chatMessages", JSON.stringify(chat.messages));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (auth.user === null && auth.token === "") {
      navigate("/login");
      localStorage.clear();
      toast.success("Logout successful");
    } else if (auth.user) {
      // const storedAssets = localStorage.getItem("allAssets");
      // if (storedAssets) {
      //   setAssets(JSON.parse(storedAssets));
      // } else {
      // }
      getAllAssets();

      // const storedChats = localStorage.getItem("allChats");
      // if (storedChats) {
      //   setChats(JSON.parse(storedChats));
      // } else {
      // }
      getAllChats(assetId);

      // const storedDocuments = localStorage.getItem("allDocuments");
      // if (storedDocuments) {
      //   setDocuments(JSON.parse(storedDocuments));
      // } else {
      // }
      getAllDocuments(assetId);

      // const storedNotes = localStorage.getItem("allNotes");
      // if (storedNotes) {
      //   setNotes(JSON.parse(storedNotes));
      // } else {
      // }
      getAllNotes(assetId);

      // const storedImages = localStorage.getItem("allImages");
      // if (storedImages) {
      //   setImages(JSON.parse(storedImages));
      // } else {
      // }
      getAllImages(assetId);

      // const storedVideos = localStorage.getItem("allVideos");
      // if (storedVideos) {
      //   setVideos(JSON.parse(storedVideos));
      // } else {
      // }
      getAllVideos(assetId);

      // const storedDepartments = localStorage.getItem("allDepartments");
      // if (storedDepartments) {
      //   setDepartments(JSON.parse(storedDepartments));
      // } else {
      // }
      getAllDepartments();

      // const storedMessages = localStorage.getItem("chatMessages");
      // if (storedMessages) {
      //   setChatMessages(JSON.parse(storedMessages));
      // }
    }
    // setLocalStorageUpdation(false);
    // eslint-disable-next-line
  }, [auth]);

  const openComponent = (componentName) => {
    if (
      (activeComponent === "AddNote" || activeComponent === "UpdateNote") &&
      componentName === "Notes"
    ) {
      setActiveComponent(componentName);
    } else if (
      (activeComponent === "AddNote" || activeComponent === "UpdateNote") &&
      componentName !== "AddNote" &&
      componentName !== "UpdateNote" &&
      componentName !== "Notes"
    ) {
      if (hasDialogShown) {
        setActiveComponent(componentName);
      } else {
        handleOpenNoteCloseConfirmDialog();
      }
    } else {
      setActiveComponent(componentName);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Get all assets
  const getAllAssets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/asset/all-assets`,
        {
          params: { userId: auth?.user?._id },
        }
      );
      if (response.status === 200) {
        const sortedAssets = response.data?.assets?.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setAssets(sortedAssets);
        // localStorage.setItem("allAssets", JSON.stringify(sortedAssets || {}));
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

  // Get all departments
  const getAllDepartments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/department/all-departments`,
        {
          params: { userId: auth?.user?._id },
        }
      );
      if (response.data?.success) {
        const sortedDepartments = response.data?.departments?.sort((a, b) =>
          a.departmentName.localeCompare(b.departmentName)
        );
        setDepartments(sortedDepartments || {});
        // localStorage.setItem(
        //   "allDepartments",
        //   JSON.stringify(sortedDepartments || {})
        // );
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

  // Get all Documents
  const getAllDocuments = async (assetId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/document/all-documents`,
        {
          params: { assetId: assetId, userId: auth.user._id },
        }
      );
      if (response.data?.success) {
        const sortedDocuments = response.data?.documents?.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        setDocuments(sortedDocuments || {});
        // localStorage.setItem(
        //   "allDocuments",
        //   JSON.stringify(sortedDocuments || {})
        // );
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

  // Get all Chats
  const getAllChats = async (assetId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/chat/all-chats`,
        {
          params: { assetId: assetId, userId: auth.user._id },
        }
      );

      if (response.status === 200) {
        const sortedChats = response.data.chats;
        setChats(sortedChats);
        // localStorage.setItem("allChats", JSON.stringify(sortedChats));
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

  // Get all Notes
  const getAllNotes = async (assetId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/note/all-notes`,
        {
          params: { assetId: assetId, userId: auth.user._id },
        }
      );
      if (response.data?.success) {
        const sortedNotes = response.data?.notes?.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        setNotes(sortedNotes || {});
        // localStorage.setItem("allNotes", JSON.stringify(sortedNotes || {}));
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

  // Get all Images
  const getAllImages = async (assetId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/media/all-images`,
        {
          params: { assetId: assetId, userId: auth.user._id },
        }
      );
      if (response.data?.success) {
        const sortedImages = response.data?.images?.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        setImages(sortedImages || {});
        // localStorage.setItem("allImages", JSON.stringify(sortedImages || {}));
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

  // Get all Videos
  const getAllVideos = async (assetId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/media/all-videos`,
        {
          params: { assetId: assetId, userId: auth.user._id },
        }
      );
      if (response.data?.success) {
        const sortedVideos = response.data?.videos?.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        setVideos(sortedVideos || {});
        // localStorage.setItem("allVideos", JSON.stringify(sortedVideos || {}));
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

  // Delete Asset
  const handleDeleteAsset = async (id) => {
    try {
      toast.promise(
        axios.delete(
          `${process.env.REACT_APP_API}/api/v1/asset/delete-asset?assetId=${id}&userId=${auth?.user?._id}`
        ),
        {
          loading: "Deleting Asset... Please Wait!",
          success: (response) => {
            if (response.status === 200) {
              const updatedAssets = assets.filter((asset) => asset._id !== id);
              setAssets(updatedAssets);
              setSelectedAsset("");
              localStorage.setItem("asset", "");
              // localStorage.setItem("allAssets", JSON.stringify(updatedAssets));
              if (selectedAsset._id === id) {
                localStorage.removeItem("selectedAsset");
              }
              auth?.user.role === 0
                ? navigate(`/user/assets`)
                : navigate(`/admin/assets`);
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
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

  // Delete Document
  const handleDeleteDocument = async (document) => {
    try {
      toast.promise(
        axios.delete(
          `${process.env.REACT_APP_API}/api/v1/document/delete-document/${document._id}`
        ),
        {
          loading: "Deleting document...",
          success: (response) => {
            if (response.status === 200) {
              const updatedDocuments = documents.filter(
                (doc) => doc._id !== document._id
              );
              setDocuments(updatedDocuments);
              // localStorage.setItem(
              //   "allDocuments",
              //   JSON.stringify(updatedDocuments)
              // );
              setDocumentToDisplay("");
              setSelectedDocument("");
              setDocumentToDelete("");
              openComponent("Documents");
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            setDocumentToDisplay("");
            setSelectedDocument("");
            setDocumentToDelete("");
            openComponent("Documents");
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

  const handleDeleteMultipleDocuments = async () => {
    if (
      auth?.user?.permissions.includes("Delete Document") ||
      auth?.user?.permissions.includes("All")
    ) {
      try {
        setDeleteDocumentLoader(true);
        for (const document of selectedDocuments) {
          const response = await axios.delete(
            `${process.env.REACT_APP_API}/api/v1/document/delete-document/${document._id}`
          );
          if (response.status === 200) {
            setDocuments((prevSelectedDocuments) =>
              prevSelectedDocuments.filter((doc) => doc._id !== document._id)
            );

            setSelectedDocuments((prevSelectedDocuments) =>
              prevSelectedDocuments.filter((doc) => doc._id !== document._id)
            );
            setDocumentToDisplay("");
            setSelectedDocument("");
            setDocumentToDelete("");
          } else {
            console.error("Unexpected success response:", response);
          }
        }
      } catch (error) {
        setDocumentToDisplay("");
        setSelectedDocument("");
        setDocumentToDelete("");
        openComponent("Documents");
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
      } finally {
        // localStorage.setItem("allDocuments", JSON.stringify(documents));
        setDeleteDocumentLoader(false);
        setSelectedDocuments([]);
      }
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
  };

  // Delete Chat
  const handleDeleteChat = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/chat/delete-chat/${id}`
      );
      if (response.status === 200) {
        const updatedChats = chats.filter((chat) => chat._id !== id);
        setChats(updatedChats);
        // localStorage.setItem("allChats", JSON.stringify(updatedChats));
        if (id === selectedChat?._id) {
          setSelectedChat("");
          setChatMessages("");
          localStorage.removeItem("selectedChat");
          localStorage.removeItem("chatMessages");
        }
        toast.success(response.data.message);
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
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
    setChatToDelete("");
  };

  // Delete multiple Chat
  const handleDeleteMultipleChat = async (id) => {
    try {
      for (const chat of selectedChats) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/api/v1/chat/delete-chat/${chat._id}`
        );
        if (response.status === 200) {
          setChats((prevSelectedChats) =>
            prevSelectedChats.filter((c) => c._id !== chat._id)
          );
          setSelectedChats((prevSelectedChats) =>
            prevSelectedChats.filter((c) => c._id !== chat._id)
          );
          if (chat._id === selectedChat?._id) {
            setSelectedChat("");
            setChatMessages("");
            localStorage.removeItem("selectedChat");
            localStorage.removeItem("chatMessages");
          }
          // toast.success(response.data.message);
        } else {
          console.error("Unexpected success response:", response);
          toast.error("Unexpected error");
        }
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
    } finally {
      setSelectedChats([]);
    }
    setChatToDelete("");
  };

  // Delete Note
  const handleDeleteNote = async (noteDocument) => {
    try {
      toast.promise(
        axios.delete(
          `${process.env.REACT_APP_API}/api/v1/note/delete-note/${noteDocument._id}`
        ),
        {
          loading: "Deleting note...",
          success: (response) => {
            if (response.status === 200) {
              const updatedNotes = notes.filter(
                (note) => note._id !== noteDocument._id
              );
              setNotes(updatedNotes);
              // localStorage.setItem("allNotes", JSON.stringify(updatedNotes));
              setSelectedNote("");
              setCreatedNote("");
              setDocumentToDisplay("");
              setNoteToDelete("");
              setSelectedImages([]);
              setSelectedVideos([]);
              openComponent("Notes");
              handleCloseNoteCloseConfirmDialog();
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            openComponent("Notes");
            setSelectedNote("");
            setCreatedNote("");
            setDocumentToDisplay("");
            setNoteToDelete("");
            setSelectedImages([]);
            setSelectedVideos([]);
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

  const handleDeleteMultipleNotes = async () => {
    try {
      setDeleteNoteLoader(true);
      setIsDocDisplayOpen(false);
      for (const note of selectedNotes) {
        if (
          auth?.user?.permissions.includes("All") ||
          auth?.user?.permissions.includes("Delete Note") ||
          note.isApprovedForDeletion
        ) {
          const response = await axios.delete(
            `${process.env.REACT_APP_API}/api/v1/note/delete-note/${note._id}`
          );

          if (response.status === 200) {
            setNotes((prevSelectedNotes) =>
              prevSelectedNotes.filter((n) => n._id !== note._id)
            );

            setSelectedNotes((prevSelectedNotes) =>
              prevSelectedNotes.filter((n) => n._id !== note._id)
            );

            setSelectedNote("");
            setCreatedNote("");
            setDocumentToDisplay("");
            setNoteToDelete("");
            setSelectedImages([]);
            setSelectedVideos([]);
            // openComponent("Notes");
          } else {
            console.error("Unexpected success response:", response);
          }
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
      }
    } catch (error) {
      openComponent("Notes");
      setSelectedNote("");
      setCreatedNote("");
      setDocumentToDisplay("");
      setNoteToDelete("");
      setSelectedImages([]);
      setSelectedVideos([]);
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
    } finally {
      // localStorage.setItem("allNotes", JSON.stringify(notes));
      setDeleteNoteLoader(false);
      setSelectedNotes([]);
    }
  };

  // Process document
  const handleProcessDocument = async (document) => {
    try {
      if (
        auth?.user?.permissions.includes("Processing") ||
        auth?.user?.permissions.includes("All") ||
        document?.isApprovedForProcess
      ) {
        setDocumentToProcess(document);
        setVectorstoreConversionInProgress(true);
        toast.promise(
          axios.post(
            `${process.env.REACT_APP_API}/api/v1/document/process-document`,
            {
              userId: auth.user._id,
              assetId: selectedAsset._id,
              documentId: document._id,
            }
          ),
          {
            loading: "Processing... Please Wait!",
            success: (response) => {
              if (response.status === 200) {
                const updatedDocument = response.data.document;
                const updatedDocuments = documents.map((document) => {
                  if (document._id === updatedDocument._id) {
                    return updatedDocument;
                  }
                  return document;
                });

                setDocuments(updatedDocuments);
                // localStorage.setItem(
                //   "allDocuments",
                //   JSON.stringify(updatedDocuments || {})
                // );

                setVectorstoreConversionInProgress(false);
                setDocumentToProcess("");
                return response.data.message;
              } else {
                console.error("Unexpected success response:", response);
                return "Unexpected error";
              }
            },
            error: (error) => {
              setVectorstoreConversionInProgress(false);
              setDocumentToProcess("");
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
      } else {
        const notificationObject = {
          recipientId: auth?.user?.admin,
          senderId: auth?.user?._id,
          type: "Document Approval for Processing",
          content: `${auth?.user?.username} seeking permission to process document: '${document?.fileName}'.\nThe document is in asset: '${document?.assetName}' `,
          senderName: auth?.user?.username,
          assetId: document?.asset,
          assetName: document?.assetName,
          documentName: document?.fileName,
          documentId: document._id,
        };

        setNotificationContent(notificationObject);
        setNotificationReturnMessage("Sent for approval for processing");
        handleOpenPermissionConfirmDialog();
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

  // Process note
  const handleProcessNote = async (noteDocument) => {
    try {
      if (
        auth?.user?.permissions.includes("Processing") ||
        auth?.user?.permissions.includes("All") ||
        noteDocument?.isApprovedForProcess
      ) {
        setVectorstoreConversionInProgress(true);
        setNoteToProcess(noteDocument);
        toast.promise(
          axios.post(`${process.env.REACT_APP_API}/api/v1/note/process-note`, {
            userId: auth.user._id,
            assetId: selectedAsset._id,
            noteId: noteDocument._id,
          }),
          {
            loading: "Processing... Please Wait!",
            success: (response) => {
              if (response.status === 200) {
                const updatedNote = response.data.note;
                const updatedNotes = notes.map((note) => {
                  if (note._id === updatedNote._id) {
                    return updatedNote;
                  }
                  return note;
                });

                setNotes(updatedNotes);
                // localStorage.setItem(
                //   "allNotes",
                //   JSON.stringify(updatedNotes || {})
                // );

                setVectorstoreConversionInProgress(false);
                setNoteToProcess("");
                return response.data.message;
              } else {
                console.error("Unexpected success response:", response);
                return "Unexpected error";
              }
            },
            error: (error) => {
              setVectorstoreConversionInProgress(false);
              setNoteToProcess("");
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
      } else {
        const notificationObject = {
          recipientId: auth?.user?.admin,
          senderId: auth?.user?._id,
          type: "Note Approval for Processing",
          content: `${auth?.user?.username} seeking permission to process note: '${noteDocument?.fileName}'.
          The note is in Asset: '${noteDocument?.assetName}'`,
          senderName: auth?.user?.username,
          assetId: noteDocument?.asset,
          assetName: noteDocument?.assetName,
          noteName: noteDocument?.fileName,
          noteId: noteDocument?._id,
        };

        setNotificationContent(notificationObject);
        setNotificationReturnMessage("Sent for approval for processing");
        handleOpenPermissionConfirmDialog();
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

  // New Chat
  const handleNewChat = () => {
    setSelectedChat("");
    setChatMessages("");
    localStorage.removeItem("selectedChat");
    localStorage.removeItem("chatMessages");
    openComponent("MainChatSection");
  };

  // Update Chat
  const handleUpdateChat = async (chatId, chatName) => {
    try {
      if (!chatName.trim()) {
        toast.error("Chatname is required");
        return;
      }
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/chat/rename`,
        {
          chatId: chatId,
          chatName: chatName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const renamedChat = response.data.chat;
        const updatedChats = chats.map((chat) => {
          if (chat._id === chatId) {
            return renamedChat;
          }
          return chat;
        });

        // Sort chats based on updatedAt
        updatedChats.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        setChats(updatedChats);

        // Update localStorage
        // localStorage.setItem("allChats", JSON.stringify(updatedChats));

        toast.success(response.data.message);
      } else {
        console.error("Unexpected success response:", response);
        toast.error("Unexpected error");
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
    socket?.on("chatSaved", (newChat) => {
      // const storedChats = localStorage.getItem("allChats");
      // if (storedChats) {
      //   const chats = JSON.parse(storedChats);
      //   const updatedChats = [...chats, newChat];
      // updatedChats.sort(
      //   (a, b) =>
      //     new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      // );
      //   // Update localStorage
      //   localStorage.setItem("allChats", JSON.stringify(updatedChats));
      // }
      setChats((prevChats) =>
        [newChat, ...prevChats].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      );
      setSelectedChat(newChat);
      setChatMessages(newChat.messages);
    });

    socket?.on("chatUpdated", (updatedChat) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === updatedChat._id) {
            return updatedChat;
          }
          return chat;
        });
        return updatedChats.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      setSelectedChat(updatedChat);
      setChatMessages(updatedChat.messages);
    });

    return () => {
      socket?.removeAllListeners("chatSaved");
      socket?.removeAllListeners("chatUpdated");
    };
    //eslint-disable-next-line
  }, [socket]);

  const ref = useRef("");
  // Chat
  const handleSendMessage = async () => {
    if (userInput.trim() !== "") {
      const userMessage = {
        text: userInput,
        isUser: true,
        source: null,
      };

      const updatedMessages = [...chatMessages, userMessage];
      setChatMessages(updatedMessages);
      setUserInput("");

      try {
        //await startStream();
        setResponseGenerating(true);
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/v1/chat/response`,
          {
            headers: {
              Authorization: auth.token,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(
              {
                userId: auth.user._id,
                assetId: selectedAsset._id,
                chatLanguage: chatLanguage,
                chatMessages: updatedMessages,
              },
              null,
              1
            ),
          }
        );
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let documents = "";
        let documentjson;
        let substr = "";
        let overlap = "";
        const AIReply = {
          text: "",
          isUser: false,
          source: [],
        };
        setChatMessages((prev) => {
          return [...prev, AIReply];
        });
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            const temp_data_holder = {
              isUser: false,
              text: "",
              source: {},
            };
            temp_data_holder.text = ref.current;
            temp_data_holder.source = documentjson;
            const updatedMessagesWithAI = [
              ...updatedMessages,
              temp_data_holder,
            ];
            // Autosave the user message and aireply
            if (selectedChat) {
              socket.emit("chatMessage", {
                userId: auth?.user._id,
                chatId: selectedChat._id,
                messagePair: [userMessage, temp_data_holder],
              });
            }

            // Autosave new chat
            if (!selectedChat) {
              socket.emit("newChat", {
                userId: auth?.user._id,
                adminId: auth?.user.admin,
                assetId: selectedAsset._id,
                departmentId: selectedAsset.department,
                message: updatedMessagesWithAI,
                chatName: userMessage.text.substring(0, 30),
              });
            }
            ref.current = "";
            break;
          } else {
            substr += decoder.decode(value);
            if (documents.length === 0) {
              const index = substr.indexOf("{");
              const index_2 = substr.lastIndexOf("}");
              for (let x = index; x <= index_2; x++) {
                documents += substr[x];
              }
              overlap = substr.indexOf("octet-stream");
              overlap += 12;
              if (overlap <= substr.length - 1) {
                let dummy_str = "";
                for (let y = overlap; y <= substr.length - 1; y++) {
                  if (
                    substr[y] == null ||
                    substr[y] === "\n" ||
                    substr[y] === "\r"
                  ) {
                    continue;
                  }
                  dummy_str += substr[y];
                }
                ref.current += dummy_str;
                setChatMessages((prev) => {
                  const updatedMessages = [...prev];
                  if (updatedMessages.length > 0) {
                    // Make a shallow copy of the last message and update its text
                    const lastMessage = {
                      ...updatedMessages[updatedMessages.length - 1],
                    };
                    lastMessage.text = ref.current;
                    updatedMessages[updatedMessages.length - 1] = lastMessage;
                  }
                  return updatedMessages;
                });
              }

              if (typeof documents === "string" && documents.trim() !== "") {
                try {
                  documentjson = JSON.parse(documents);
                  substr = "";
                } catch (error) {
                  console.error(`Error parsing JSON: ${error}`);
                  documentjson = [];
                }
              } else {
                console.error("Invalid documents variable");
                documentjson = [];
              }
            } else {
              ref.current += decoder.decode(value, { stream: true });
              setChatMessages((prev) => {
                const updatedMessages = [...prev];
                if (updatedMessages.length > 0) {
                  // Make a shallow copy of the last message and update its text
                  const lastMessage = {
                    ...updatedMessages[updatedMessages.length - 1],
                  };
                  lastMessage.text = ref.current;
                  updatedMessages[updatedMessages.length - 1] = lastMessage;
                }
                return updatedMessages;
              });
            }
          }
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
          if (
            error.response.data.message ===
            "Session expired!\nPlease login again."
          ) {
            handleLogout();
          }
        } else if (error.request) {
          toast.error("Network error. Please try again later.");
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
        console.error(error);
      } finally {
        setResponseGenerating(false);
      }
    }
  };

  const handleLanguageChange = (e) => {
    setChatLanguage(e.target.value);
  };

  const languages = [
    { code: "nl-NL", name: "Dutch" },
    // { code: "en-CA", name: "English (Canada)" },
    // { code: "en-IN", name: "English (India)" },
    // { code: "en-GB", name: "English (UK)" },
    { code: "en-US", name: "English" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "hi-IN", name: "Hindi" },
    { code: "it-IT", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh-CN", name: "Mandarin Chinese" },
    { code: "ru", name: "Russian" },
    { code: "es-ES", name: "Spanish (Spain)" },
    { code: "sv-SE", name: "Swedish" },
    // { code: "el-GR", name: "Greek" },
    // { code: "id", name: "Indonesian" },
    // { code: "la", name: "Latin" },
    // { code: "pt-PT", name: "Portuguese" },
    // { code: "tr", name: "Turkish" },
    // { code: "vi-VN", name: "Vietnamese" },
  ];

  // Download Document/Note pdf
  const handleDocFileDownload = async (pdfDocument) => {
    try {
      // Create a Blob URL for the downloaded file
      const blobUrl = pdfDocument.filePath;

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${pdfDocument.fileName}.pdf`;
      a.style.display = "none";

      // Append the <a> element to the document body and trigger the click event
      document.body.appendChild(a);
      a.click();

      // Remove the <a> element and revoke the Blob URL to free up memory
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
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

  // Download Image
  const handleImageFileDownload = async (image) => {
    try {
      // Create a Blob URL for the downloaded image
      const blobUrl = image.filePath;

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = image.fileName;
      a.style.display = "none";

      // Append the <a> element to the document body and trigger the click event
      document.body.appendChild(a);
      a.click();

      // Remove the <a> element and revoke the Blob URL to free up memory
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
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

  // Download Video
  const handleVideoFileDownload = async (video) => {
    try {
      // Create a Blob URL for the downloaded video
      const blobUrl = video.filePath;

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = video.fileName;
      a.style.display = "none";

      // Append the <a> element to the document body and trigger the click event
      document.body.appendChild(a);
      a.click();

      // Remove the <a> element and revoke the Blob URL to free up memory
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
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

  // Create Note
  const handleCreateNote = async () => {
    setSelectedImages([]);
    setSelectedVideos([]);
    try {
      if (
        auth?.user?.permissions.includes("Create Note") ||
        auth?.user?.permissions.includes("All")
      ) {
        const noteData = new FormData();
        noteData.append("userId", auth.user._id);
        noteData.append("assetId", selectedAsset._id);

        toast.promise(
          axios.post(
            `${process.env.REACT_APP_API}/api/v1/note/create-note`,
            noteData
          ),
          {
            loading: "Initialising new note... Please Wait!",
            success: (response) => {
              if (response.status === 201) {
                const newNote = response.data.note;
                const updatedNotes = [...notes, newNote].sort((a, b) =>
                  a.fileName.localeCompare(b.fileName)
                ); // Append the new note and re-sort the array

                setNotes(updatedNotes);
                // localStorage.setItem(
                //   "allNotes",
                //   JSON.stringify(updatedNotes || {})
                // );

                setCreatedNote(newNote);
                openComponent("AddNote");
                return response.data.message;
              } else {
                console.error("Unexpected success response:", response);
                return "Unexpected error";
              }
            },
            error: (error) => {
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
      } else {
        const notificationObject = {
          recipientId: auth?.user?.admin,
          senderId: auth?.user?._id,
          type: "Note Creation Permission",
          content: `${auth?.user?.username} asked for permission to create new note`,
          senderName: auth?.user?.username,
        };

        setNotificationContent(notificationObject);
        setNotificationReturnMessage(
          "Admin notified to update required permission"
        );
        handleOpenPermissionConfirmDialog();
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

  const handleGenerateNote = async (modifiedText) => {
    setSelectedImages([]);
    setSelectedVideos([]);
    try {
      if (
        auth?.user?.permissions.includes("Create Note") ||
        auth?.user?.permissions.includes("All")
      ) {
        const noteData = new FormData();
        noteData.append("userId", auth.user._id);
        noteData.append("assetId", selectedAsset._id);

        toast.promise(
          axios.post(
            `${process.env.REACT_APP_API}/api/v1/note/create-note`,
            noteData
          ),
          {
            loading: "Generating note... Please Wait!",
            success: (response) => {
              if (response.status === 201) {
                const newNote = response.data.note;
                const updatedNotes = [...notes, newNote].sort((a, b) =>
                  a.fileName.localeCompare(b.fileName)
                ); // Append the new note and re-sort the array

                setNotes(updatedNotes);
                // localStorage.setItem(
                //   "allNotes",
                //   JSON.stringify(updatedNotes || {})
                // );

                setCreatedNote(newNote);
                openComponent("AddNote");
                setNoteText(modifiedText);
                return response.data.message;
              } else {
                console.error("Unexpected success response:", response);
                return "Unexpected error";
              }
            },
            error: (error) => {
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
      } else {
        const notificationObject = {
          recipientId: auth?.user?.admin,
          senderId: auth?.user?._id,
          type: "Note Creation Permission",
          content: `${auth?.user?.username} asked for permission to generate new note`,
          senderName: auth?.user?.username,
        };

        setNotificationContent(notificationObject);
        setNotificationReturnMessage(
          "Admin notified to update required permission"
        );
        handleOpenPermissionConfirmDialog();
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

  const handleOpenUploadDocumentForm = () => {
    if (
      auth?.user?.permissions.includes("Add Document") ||
      auth?.user?.permissions.includes("All")
    ) {
      setOpenUploadDocumentForm(true);
    } else {
      const notificationObject = {
        recipientId: auth?.user?.admin,
        senderId: auth?.user?._id,
        type: "Document Upload Permission",
        content: `${auth?.user?.username} seeking permission for uploading new documents in asset: '${selectedAsset.name}'`,
        senderName: auth?.user?.username,
      };

      setNotificationContent(notificationObject);
      setNotificationReturnMessage(
        "Admin notified to update required permission"
      );
      handleOpenPermissionConfirmDialog();
    }
  };

  const handleOpenUploadImageForm = () => {
    if (
      auth?.user?.permissions.includes("Add Image") ||
      auth?.user?.permissions.includes("All")
    ) {
      setOpenUploadImageForm(true);
    } else {
      const notificationObject = {
        recipientId: auth?.user?.admin,
        senderId: auth?.user?._id,
        type: "Image Upload Permission",
        content: `${auth?.user?.username} seeking permission for uploading new Image in asset: '${selectedAsset.name}'`,
        senderName: auth?.user?.username,
      };

      setNotificationContent(notificationObject);
      setNotificationReturnMessage(
        "Admin notified to update required permission"
      );
      handleOpenPermissionConfirmDialog();
    }
  };

  const handleOpenUploadVideoForm = () => {
    if (
      auth?.user?.permissions.includes("Add Video") ||
      auth?.user?.permissions.includes("All")
    ) {
      setOpenUploadVideoForm(true);
    } else {
      const notificationObject = {
        recipientId: auth?.user?.admin,
        senderId: auth?.user?._id,
        type: "Image Upload Permission",
        content: `${auth?.user?.username} seeking permission for uploading new Video in asset: '${selectedAsset.name}'`,
        senderName: auth?.user?.username,
      };

      setNotificationContent(notificationObject);
      setNotificationReturnMessage(
        "Admin notified to update required permission"
      );
      handleOpenPermissionConfirmDialog();
    }
  };

  const handleCloseDocumentUploadForm = () => {
    setOpenUploadDocumentForm(false);
  };
  const handleCloseImageUploadForm = () => {
    setOpenUploadImageForm(false);
  };
  const handleCloseVideoUploadForm = () => {
    setOpenUploadVideoForm(false);
  };

  const handleShowDocument = (document) => {
    setDocumentToDisplay(document);
    setIsDocDisplayOpen(true);
  };

  const handleOpenImageInNewTab = (image) => {
    if (auth?.user?.role === 0) {
      window.open(`/user/view-image/${image._id}`, "_blank");
    } else if (auth?.user?.role === 1) {
      window.open(`/admin/view-image/${image._id}`, "_blank");
    } else {
      toast.error("Access Denied");
    }
  };

  const handleOpenVideoInNewTab = (video) => {
    if (auth?.user?.role === 0) {
      window.open(`/user/view-video/${video._id}`, "_blank");
    } else if (auth?.user?.role === 1) {
      window.open(`/admin/view-video/${video._id}`, "_blank");
    } else {
      toast.error("Access Denied");
    }
  };

  const handleOpenDocumentDeleteDialog = (document) => {
    setDocumentToDelete(document);
    setIsDocumentDeleteDialogOpen(true);
  };

  const handleOpenNoteDeleteDialog = (note) => {
    setNoteToDelete(note);
    setIsNoteDeleteDialogOpen(true);
  };

  const handleOpenChatDeleteDialog = (chat) => {
    setChatToDelete(chat);
    setIsChatDeleteDialogOpen(true);
  };
  const handleOpenMultipleChatDeleteDialog = () => {
    setIsMultipleChatDeleteDialogOpen(true);
  };

  const handleOpenImageDeleteDialog = (image) => {
    setImageToDelete(image);
    setIsImageDeleteDialogOpen(true);
  };
  const handleOpenVideoDeleteDialog = (video) => {
    setVideoToDelete(video);
    setIsVideoDeleteDialogOpen(true);
  };

  const handleCloseDocumentDeleteDialog = () => {
    setIsDocumentDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleCloseNoteDeleteDialog = () => {
    setIsNoteDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleCloseChatDeleteDialog = () => {
    setIsChatDeleteDialogOpen(false);
    setChatToDelete(null);
  };
  const handleCloseMultipleChatDeleteDialog = () => {
    setIsMultipleChatDeleteDialogOpen(false);
  };
  const handleCloseImageDeleteDialog = () => {
    setIsImageDeleteDialogOpen(false);
    setImageToDelete(null);
  };
  const handleCloseVideoDeleteDialog = () => {
    setIsVideoDeleteDialogOpen(false);
    setVideoToDelete(null);
  };

  const handleDeleteImage = async (id) => {
    try {
      if (
        auth?.user?.permissions.includes("Delete Image") ||
        auth?.user?.permissions.includes("All")
      ) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/api/v1/media/delete-image/${id}`
        );
        if (response.status === 200) {
          const updatedImages = images.filter((image) => image._id !== id);
          setImages(updatedImages);
          // localStorage.setItem("allImages", JSON.stringify(updatedImages));
          toast.success(response.data.message);
        } else {
          console.error("Unexpected success response:", response);
          toast.error("Unexpected error");
        }
      } else {
        toast.error("Unauthorized to delete image");
      }
      setImageToDelete("");
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

  const handleDeleteMultipleImages = async () => {
    if (
      auth?.user?.permissions.includes("Delete Image") ||
      auth?.user?.permissions.includes("All")
    ) {
      try {
        setDeleteImageLoader(true);
        for (const image of selectedExistingImages) {
          const response = await axios.delete(
            `${process.env.REACT_APP_API}/api/v1/media/delete-image/${image._id}`
          );
          if (response.status === 200) {
            setImages((prevSelectedImages) =>
              prevSelectedImages.filter((img) => img._id !== image._id)
            );
            setSelectedExistingImages((prevSelectedImages) =>
              prevSelectedImages.filter((img) => img._id !== image._id)
            );
            // const updatedImages = images.filter((img) => img._id !== image._id);
            // localStorage.setItem("allImages", JSON.stringify(updatedImages));
            toast.success(response.data.message);
          } else {
            console.error("Unexpected success response:", response);
            toast.error("Unexpected error");
          }
        }
        setImageToDelete("");
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
      } finally {
        setDeleteImageLoader(false);
        setSelectedExistingImages([]);
      }
    } else {
      toast.error("Unauthorized to delete image");
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      if (
        auth?.user?.permissions.includes("Delete Video") ||
        auth?.user?.permissions.includes("All")
      ) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/api/v1/media/delete-video/${id}`
        );
        if (response.status === 200) {
          const updatedVideos = videos.filter((video) => video._id !== id);
          setVideos(updatedVideos);
          // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));
          toast.success(response.data.message);
        } else {
          console.error("Unexpected success response:", response);
          toast.error("Unexpected error");
        }
      } else {
        toast.error("Unauthorized to delete video");
      }
      setVideoToDelete("");
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

  const handleDeleteMultipleVideos = async () => {
    if (
      auth?.user?.permissions.includes("Delete Video") ||
      auth?.user?.permissions.includes("All")
    ) {
      try {
        setDeleteVideoLoader(true);
        for (const video of selectedExistingVideos) {
          const response = await axios.delete(
            `${process.env.REACT_APP_API}/api/v1/media/delete-video/${video._id}`
          );
          if (response.status === 200) {
            setVideos((prevSelectedVideos) =>
              prevSelectedVideos.filter((vid) => vid._id !== video._id)
            );
            setSelectedExistingVideos((prevSelectedVidoes) =>
              prevSelectedVidoes.filter((vid) => vid._id !== video._id)
            );
            // const updatedVideos = videos.filter((vid) => vid._id !== video._id);
            // localStorage.setItem("allVideos", JSON.stringify(updatedVideos));
            toast.success(response.data.message);
          } else {
            console.error("Unexpected success response:", response);
            toast.error("Unexpected error");
          }
        }
        setVideoToDelete("");
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
      } finally {
        setDeleteVideoLoader(false);
        setSelectedExistingVideos([]);
      }
    } else {
      toast.error("Unauthorized to delete video");
    }
  };

  const handleOpenUpdateAssetForm = (asset) => {
    setSelectedAsset(asset);
    localStorage.setItem("asset", JSON.stringify(asset));
    fetchDepartment(asset.department);
    setOpenUpdateAssetForm(true);
  };

  const handleCloseUpdateAssetForm = () => {
    setSelectedDepartment("");
    setOpenUpdateAssetForm(false);
  };

  const handleOpenAddAssetMaintenanceForm = (asset) => {
    setSelectedAsset(asset);
    localStorage.setItem("asset", JSON.stringify(asset));
    setOpenAddAssetMaintenanceForm(true);
  };

  const handleCloseAddAssetMaintenanceForm = () => {
    setOpenAddAssetMaintenanceForm(false);
  };

  const handleOpenAssetDeleteDialog = (asset) => {
    setSelectedAsset(asset);
    localStorage.setItem("asset", JSON.stringify(asset));
    setIsAssetDeleteDialogOpen(true);
  };

  const handleCloseAssetDeleteDialog = () => {
    setIsAssetDeleteDialogOpen(false);
  };

  const handleDepartmentChange = async (event) => {
    const selectedDepartmentId = event.target.value;
    const selected = departments.find(
      (department) => department._id === selectedDepartmentId
    );
    setSelectedDepartment(selected || {});
  };

  const handleSendNotification = () => {
    toast.promise(
      axios.post(
        `${process.env.REACT_APP_API}/api/v1/notification/new-notification`,
        notificationContent
      ),
      {
        success: (response) => {
          setNotificationContent({});
          setNotificationReturnMessage("");
          handleClosePermissionConfirmDialog();
          return notificationReturnMessage;
        },
        error: (error) => {
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
  };

  document.title = `Chat - ${selectedAsset?.name}`;

  return (
    <>
      <Box
        style={{
          backgroundColor: "#FFF",
          display: "flex",
          height: "100vh",
          width: "100vw",
        }}
      >
        {/* Request Access Dialog */}
        <Dialog
          open={isPermissionConfirmDialogOpen}
          onClose={handleClosePermissionConfirmDialog}
        >
          <DialogContent>
            <DialogContentText>
              You are not authorized to perform the action. Do you want to ask
              permission from the admin.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePermissionConfirmDialog} color="error">
              Cancel
            </Button>
            <Button onClick={handleSendNotification} color="primary" autoFocus>
              Request Access
            </Button>
          </DialogActions>
        </Dialog>

        {/* Upload document form */}
        {openUploadDocumentForm && (
          <DocUploader
            user={auth.user}
            asset={selectedAsset}
            documents={documents}
            setDocuments={setDocuments}
            handleLogout={handleLogout}
            onClose={handleCloseDocumentUploadForm}
            openUploadDocumentForm={openUploadDocumentForm}
          />
        )}
        {/* Upload image form */}
        {openUploadImageForm && (
          <ImageUploader
            user={auth.user}
            images={images}
            setImages={setImages}
            asset={selectedAsset}
            handleLogout={handleLogout}
            selectedImages={selectedImages}
            onClose={handleCloseImageUploadForm}
            setSelectedImages={setSelectedImages}
            imageFileInputRef={imageFileInputRef}
            openUploadImageForm={openUploadImageForm}
          />
        )}
        {/* Upload video form */}
        {openUploadVideoForm && (
          <VideoUploader
            user={auth.user}
            videos={videos}
            setVideos={setVideos}
            asset={selectedAsset}
            handleLogout={handleLogout}
            selectedVideos={selectedVideos}
            onClose={handleCloseVideoUploadForm}
            setSelectedVideos={setSelectedVideos}
            videoFileInputRef={videoFileInputRef}
            openUploadVideoForm={openUploadVideoForm}
          />
        )}

        {/* View more Asset details */}
        <Asset
          auth={auth}
          asset={selectedAsset}
          handleLogout={handleLogout}
          isOpen={isViewDetailsPopupOpen}
          onClose={() => setIsViewDetailsPopupOpen(false)}
          handleOpenUpdateAssetForm={handleOpenUpdateAssetForm}
        />

        {/* Delete Asset prompt */}
        <Dialog
          open={isAssetDeleteDialogOpen}
          onClose={handleCloseAssetDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Asset"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete asset ${
                selectedAsset ? selectedAsset.name : ""
              } and all of its associated documents, notes and chats?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAssetDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteAsset(selectedAsset._id);
                handleCloseAssetDeleteDialog();
              }}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Document prompt */}
        <Dialog
          open={isDocumentDeleteDialogOpen}
          onClose={handleCloseDocumentDeleteDialog}
          aria-label="document-delete-dialog"
        >
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete ${documentToDelete?.fileName}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDocumentDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCloseDocumentDeleteDialog();
                handleDeleteDocument(documentToDelete);
              }}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Note prompt */}
        {noteToDelete && (
          <Dialog
            open={isNoteDeleteDialogOpen}
            onClose={handleCloseNoteDeleteDialog}
            aria-label="note-delete-dialog"
          >
            <DialogContent>
              <DialogContentText>
                {`Are you sure you want to delete ${noteToDelete?.fileName}?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseNoteDeleteDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsNoteDeleteDialogOpen(false);
                  handleDeleteNote(noteToDelete);
                }}
                color="error"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Delete Chat prompt */}
        <Dialog
          open={isChatDeleteDialogOpen}
          onClose={handleCloseChatDeleteDialog}
          aria-label="chat-delete-dialog"
        >
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete ${chatToDelete?.chatName}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChatDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteChat(chatToDelete._id);
                handleCloseChatDeleteDialog();
              }}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Multiple Delete Chat prompt */}
        <Dialog
          open={isMultipleChatDeleteDialogOpen}
          onClose={handleCloseMultipleChatDeleteDialog}
          aria-label="chat-delete-dialog"
        >
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete selected chats?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseMultipleChatDeleteDialog}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteMultipleChat();
                handleCloseMultipleChatDeleteDialog();
              }}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Image prompt */}
        <Dialog
          open={isImageDeleteDialogOpen}
          onClose={handleCloseImageDeleteDialog}
          aria-label="image-delete-dialog"
        >
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete ${imageToDelete?.fileName}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImageDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteImage(imageToDelete._id);
                handleCloseImageDeleteDialog();
              }}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Video prompt */}
        <Dialog
          open={isVideoDeleteDialogOpen}
          onClose={handleCloseVideoDeleteDialog}
          aria-label="video-delete-dialog"
        >
          <DialogContent>
            <DialogContentText>
              {`Are you sure you want to delete ${videoToDelete?.fileName}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseVideoDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteVideo(videoToDelete._id);
                handleCloseVideoDeleteDialog();
              }}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {openUpdateAssetForm && (
          <UpdateAssetForm
            assets={assets}
            setAssets={setAssets}
            asset={selectedAsset}
            departments={departments}
            handleLogout={handleLogout}
            setSelectedAsset={setSelectedAsset}
            onClose={handleCloseUpdateAssetForm}
            selectedDepartment={selectedDepartment}
            openUpdateAssetForm={openUpdateAssetForm}
            setSelectedDepartment={setSelectedDepartment}
            handleDepartmentChange={handleDepartmentChange}
          />
        )}
        {openAddAssetMaintenanceForm && (
          <AddMaintenanceRecordForm
            assets={assets}
            setAssets={setAssets}
            asset={selectedAsset}
            handleLogout={handleLogout}
            setSelectedAsset={setSelectedAsset}
            onClose={handleCloseAddAssetMaintenanceForm}
            openAddAssetMaintenanceForm={openAddAssetMaintenanceForm}
            activeComponent={activeComponent}
          />
        )}

        {/* Chat Side drawer */}
        <Tooltip
          title="Recent Chats"
          aria-label="Recent Chats"
          placement="right"
          arrow
        >
          <IconButton
            // color="primary"
            aria-label="add"
            size="small"
            sx={{
              position: "absolute",
              top: "5px",
              left: "5px",
              color: "#000",
              // background: "#0f8fa9",
              fontSize: "45px",
              zIndex: "99",
              ...(isOpenLeftDrawer && { display: "none" }),
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenLeftDrawer();
            }}
          >
            <ShortTextRoundedIcon style={{ fontSize: "30px" }} />
          </IconButton>
        </Tooltip>

        {/* M2achine Details drawer */}
        <Tooltip
          title="Machine Details"
          aria-label="Machine Details"
          placement="left"
          arrow
        >
          <IconButton
            aria-label="add"
            size="small"
            sx={{
              position: "absolute",
              top: "5px",
              right: "5px",
              color: "#000",
              background: isDocDisplayOpen ? "#7771" : "",
              fontSize: "45px",
              zIndex: "99",
              ...(isOpenRightDrawer && { display: "none" }),
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenRightDrawer();
            }}
          >
            <KeyboardArrowLeftRoundedIcon style={{ fontSize: "30px" }} />
          </IconButton>
        </Tooltip>

        <Main
          isOpenLeftDrawer={isOpenLeftDrawer}
          isOpenRightDrawer={isOpenRightDrawer}
        >
          <SplitPane
            split="vertical"
            sizes={sizes}
            onChange={setSizes}
            performanceMode={true}
          >
            {/* Main Area */}
            <Pane
              minSize={isDocDisplayOpen ? "30%" : "100%"}
              maxSize={isDocDisplayOpen ? "60%" : "100%"}
            >
              {isOpenLeftDrawer && (
                <Tooltip
                  title="Close Recent chats"
                  aria-label="Close Recent chats"
                  placement="right"
                  arrow
                >
                  <IconButton
                    onClick={handleCloseLeftDrawer}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "0",
                      borderRadius: "0px",
                      padding: "10px 0px",
                      background: "transparent",
                      zIndex: "99",
                    }}
                    sx={{
                      "&:hover": {
                        color: "#000",
                      },
                    }}
                  >
                    <ChevronLeftIcon style={{ fontSize: "25px" }} />
                  </IconButton>
                </Tooltip>
              )}

              <ChatSideDrawer
                chats={chats}
                fetchChat={fetchChat}
                drawerWidth={drawerWidth}
                selectedChat={selectedChat}
                openComponent={openComponent}
                selectedAsset={selectedAsset}
                handleNewChat={handleNewChat}
                activeComponent={activeComponent}
                handleUpdateChat={handleUpdateChat}
                isOpenLeftDrawer={isOpenLeftDrawer}
                handleCloseLeftDrawer={handleCloseLeftDrawer}
                handleOpenChatDeleteDialog={handleOpenChatDeleteDialog}
                hasDialogShown={hasDialogShown}
                handleOpenNoteCloseConfirmDialog={
                  handleOpenNoteCloseConfirmDialog
                }
                selectedChats={selectedChats}
                setSelectedChats={setSelectedChats}
                handleOpenMultipleChatDeleteDialog={
                  handleOpenMultipleChatDeleteDialog
                }
              />

              {(activeComponent === "MainChatSection" || null) && (
                <MainChatSection
                  user={auth.user}
                  isDocDisplayOpen={isDocDisplayOpen}
                  handleShowDocument={handleShowDocument}
                  setIsDocDisplayOpen={setIsDocDisplayOpen}
                  selectedNote={selectedNote}
                  languages={languages}
                  chatLanguage={chatLanguage}
                  handleLanguageChange={handleLanguageChange}
                  chatMessages={chatMessages}
                  chatContainerRef={chatContainerRef}
                  userInput={userInput}
                  selectedChat={selectedChat}
                  setPageNumber={setPageNumber}
                  setUserInput={setUserInput}
                  handleSendMessage={handleSendMessage}
                  responseGenerating={responseGenerating}
                />
              )}
              {activeComponent === "Documents" && (
                <Documents
                  auth={auth}
                  documents={documents}
                  handleLogout={handleLogout}
                  openComponent={openComponent}
                  handleOpenUploadDocumentForm={handleOpenUploadDocumentForm}
                  handleOpenDocumentDeleteDialog={
                    handleOpenDocumentDeleteDialog
                  }
                  handleProcessDocument={handleProcessDocument}
                  handleDocFileDownload={handleDocFileDownload}
                  documentToProcess={documentToProcess}
                  vectorstoreConversionInProgress={
                    vectorstoreConversionInProgress
                  }
                  handleShowDocument={handleShowDocument}
                  deleteDocumentLoader={deleteDocumentLoader}
                  selectedDocuments={selectedDocuments}
                  setSelectedDocuments={setSelectedDocuments}
                  handleDeleteMultipleDocuments={handleDeleteMultipleDocuments}
                  setIsDocDisplayOpen={setIsDocDisplayOpen}
                  setSelectedDocument={setSelectedDocument}
                />
              )}
              {activeComponent === "Notes" && (
                <Notes
                  auth={auth}
                  notes={notes}
                  handleLogout={handleLogout}
                  openComponent={openComponent}
                  setSelectedNote={setSelectedNote}
                  handleCreateNote={handleCreateNote}
                  handleOpenNoteDeleteDialog={handleOpenNoteDeleteDialog}
                  handleProcessNote={handleProcessNote}
                  handleDocFileDownload={handleDocFileDownload}
                  noteToProcess={noteToProcess}
                  vectorstoreConversionInProgress={
                    vectorstoreConversionInProgress
                  }
                  handleShowDocument={handleShowDocument}
                  selectedNotes={selectedNotes}
                  setSelectedNotes={setSelectedNotes}
                  deleteNoteLoader={deleteNoteLoader}
                  handleDeleteMultipleNotes={handleDeleteMultipleNotes}
                  isNoteCloseConfirmDialogOpen={isNoteCloseConfirmDialogOpen}
                  handleCloseNoteCloseConfirmDialog={
                    handleCloseNoteCloseConfirmDialog
                  }
                  setIsDocDisplayOpen={setIsDocDisplayOpen}
                />
              )}

              {/* Add  notes */}
              {activeComponent === "AddNote" && (
                <AddNoteForm
                  auth={auth}
                  notes={notes}
                  setNotes={setNotes}
                  images={images}
                  setImages={setImages}
                  videos={videos}
                  setVideos={setVideos}
                  handleDeleteNote={handleDeleteNote}
                  user={auth.user}
                  asset={selectedAsset}
                  languages={languages}
                  chatLanguage={chatLanguage}
                  noteText={noteText}
                  setNoteText={setNoteText}
                  createdNote={createdNote}
                  setCreatedNote={setCreatedNote}
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  imageFileInputRef={imageFileInputRef}
                  selectedVideos={selectedVideos}
                  setSelectedVideos={setSelectedVideos}
                  videoFileInputRef={videoFileInputRef}
                  handleLogout={handleLogout}
                  openComponent={openComponent}
                  handleGenerateNote={handleGenerateNote}
                  handleVideoFileDownload={handleVideoFileDownload}
                  handleImageFileDownload={handleImageFileDownload}
                  isNoteCloseConfirmDialogOpen={isNoteCloseConfirmDialogOpen}
                  handleCloseNoteCloseConfirmDialog={
                    handleCloseNoteCloseConfirmDialog
                  }
                  handleOpenNoteCloseConfirmDialog={
                    handleOpenNoteCloseConfirmDialog
                  }
                  activeComponent={activeComponent}
                />
              )}

              {/* Update Note */}
              {activeComponent === "UpdateNote" && (
                <UpdateNoteForm
                  auth={auth}
                  notes={notes}
                  setNotes={setNotes}
                  images={images}
                  setImages={setImages}
                  videos={videos}
                  setVideos={setVideos}
                  user={auth.user}
                  asset={selectedAsset}
                  note={selectedNote}
                  setSelectedNote={setSelectedNote}
                  languages={languages}
                  chatLanguage={chatLanguage}
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  imageFileInputRef={imageFileInputRef}
                  selectedVideos={selectedVideos}
                  setSelectedVideos={setSelectedVideos}
                  videoFileInputRef={videoFileInputRef}
                  handleLogout={handleLogout}
                  openComponent={openComponent}
                  handleGenerateNote={handleGenerateNote}
                  handleVideoFileDownload={handleVideoFileDownload}
                  handleImageFileDownload={handleImageFileDownload}
                  handleDeleteNote={handleDeleteNote}
                  handleOpenNoteCloseConfirmDialog={
                    handleOpenNoteCloseConfirmDialog
                  }
                  handleCloseNoteCloseConfirmDialog={
                    handleCloseNoteCloseConfirmDialog
                  }
                  isNoteCloseConfirmDialogOpen={isNoteCloseConfirmDialogOpen}
                  activeComponent={activeComponent}
                />
              )}

              {/* View Media */}
              {activeComponent === "Images" && (
                <ImageViewer
                  user={auth.user}
                  images={images}
                  openComponent={openComponent}
                  handleOpenImageInNewTab={handleOpenImageInNewTab}
                  handleImageFileDownload={handleImageFileDownload}
                  handleOpenUploadImageForm={handleOpenUploadImageForm}
                  handleOpenImageDeleteDialog={handleOpenImageDeleteDialog}
                  selectedExistingImages={selectedExistingImages}
                  setSelectedExistingImages={setSelectedExistingImages}
                  deleteImageLoader={deleteImageLoader}
                  handleDeleteMultipleImages={handleDeleteMultipleImages}
                />
              )}
              {activeComponent === "Videos" && (
                <VideoViewer
                  user={auth.user}
                  videos={videos}
                  setVideos={setVideos}
                  handleLogout={handleLogout}
                  openComponent={openComponent}
                  handleGenerateNote={handleGenerateNote}
                  handleOpenVideoInNewTab={handleOpenVideoInNewTab}
                  handleVideoFileDownload={handleVideoFileDownload}
                  handleOpenUploadVideoForm={handleOpenUploadVideoForm}
                  handleOpenVideoDeleteDialog={handleOpenVideoDeleteDialog}
                  selectedExistingVideos={selectedExistingVideos}
                  setSelectedExistingVideos={setSelectedExistingVideos}
                  deleteVideoLoader={deleteVideoLoader}
                  handleDeleteMultipleVideos={handleDeleteMultipleVideos}
                />
              )}
              {activeComponent === "MaintenanceRecords" && (
                <MaintenanceRecords
                  auth={auth}
                  asset={selectedAsset}
                  openComponent={openComponent}
                />
              )}

              {/* Note-v2 */}
              {activeComponent === "CustomNotes" && (
                <CustomNotesList openComponent={openComponent} />
              )}
              {isOpenRightDrawer && (
                <Tooltip
                  title="Close machine details"
                  aria-label="Close machine details"
                  placement="left"
                  arrow
                >
                  <IconButton
                    onClick={handleCloseRightDrawer}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: `0px`,
                      borderRadius: "0px",
                      padding: "10px 0px",
                      background: "transparent",
                      zIndex: "99",
                    }}
                    sx={{
                      "&:hover": {
                        color: "#000",
                      },
                    }}
                  >
                    <ChevronRightRoundedIcon style={{ fontSize: "25px" }} />
                  </IconButton>
                </Tooltip>
              )}
              <MachineDetailDrawer
                auth={auth}
                asset={selectedAsset}
                drawerWidth={drawerWidth}
                handleLogout={handleLogout}
                openComponent={openComponent}
                isOpenRightDrawer={isOpenRightDrawer}
                handleCloseRightDrawer={handleCloseRightDrawer}
                setIsViewDetailsPopupOpen={setIsViewDetailsPopupOpen}
                handleOpenAssetDeleteDialog={handleOpenAssetDeleteDialog}
                handleOpenAddAssetMaintenanceForm={
                  handleOpenAddAssetMaintenanceForm
                }
                activeComponent={activeComponent}
              />
            </Pane>
            <Pane
              minSize={isDocDisplayOpen ? "50%" : 0}
              maxSize={isDocDisplayOpen ? "70%" : "0%"}
            >
              {/* Doc Display */}
              {isDocDisplayOpen && (
                <DocDisplaySection
                  user={auth.user}
                  pageNumber={pageNumber}
                  documentToDisplay={documentToDisplay}
                  setIsDocDisplayOpen={setIsDocDisplayOpen}
                />
              )}
            </Pane>
          </SplitPane>
        </Main>
      </Box>
    </>
  );
};

export default ChatPage;
