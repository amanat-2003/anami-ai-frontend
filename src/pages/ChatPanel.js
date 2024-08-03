import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth.js";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socket.js";
import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import ChatBox from "../components/chatPanel/ChatBox.js";
import MyChats from "../components/chatPanel/MyChats.js";
import MediaList from "../components/chatPanel/MediaList.js";
import { useSocketService } from "../context/socketService.js";

import LeftSideDrawer from "../components/LeftSideDrawer.js";

const ChatPanel = () => {
  const [socket] = useSocket();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const chatContainerRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [chatLanguage, setChatLanguage] = useState("English");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isMainDrawerOpen, setIsMainDrawerOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState();
  const [conversationMessages, setConversationMessages] = useState([]);
  const [deletingMessageLoader, setDeletingMessageLoader] = useState(false);
  const [newConversationLoader, setNewConversationLoader] = useState(false);
  const [deletingConversationLoader, setDeletingConversationLoader] =
    useState(false);
  const [clearingConversationLoader, setClearingConversationLoader] =
    useState(false);
  const [newGroupConversationLoader, setNewGroupConversationLoader] =
    useState(false);
  const [loadingMoreMessageLoader, setLoadingMoreMessageLoader] =
    useState(false);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [previousScrollHeight, setPreviousScrollHeight] = useState();
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [activeComponent, setActiveComponent] = useState("MyChats");
  const [fetchedVideos, setFetchedVideos] = useState([]);
  const [fetchedImages, setFetchedImages] = useState([]);

  const [
    isLocalStorageUpdated,
    setLocalStorageUpdation,
    isConversationRemoved,
    setConversationRemoved,
  ] = useSocketService();

  const openComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleCloseMainDrawer = () => {
    setIsMainDrawerOpen(false);
  };

  let page = 2;

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
    } else if (auth.user) {
      localStorage.removeItem("selectedConversation");

      localStorage.removeItem("selectedConversationMessages");
      const storedConversations = localStorage.getItem("allConversations");
      if (storedConversations) {
        const sortedConversations = JSON.parse(storedConversations)?.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setConversations(sortedConversations);
      } else {
        fetchAllConversations();
      }

      const storedSelectedConversation = localStorage.getItem(
        "selectedConversation"
      );
      if (storedSelectedConversation) {
        const parsedConversations = JSON.parse(storedSelectedConversation);
        setSelectedConversation(parsedConversations);
      }

      const storedUsers = localStorage.getItem("allUsers");
      if (storedUsers) {
        const sortedUsers = JSON.parse(storedUsers)
          // ?.filter((user) => user._id !== auth?.user._id)
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user, index) => ({
            ...user,
            id: index + 1,
          }));
        setAllUsers(sortedUsers);
      } else {
        getAllUsers();
      }
      getAllMedia();
    }
    setLocalStorageUpdation(false);
    // eslint-disable-next-line
  }, [auth, isLocalStorageUpdated]);

  useEffect(() => {
    setPreviousScrollHeight(chatContainerRef?.current?.scrollHeight);
    //eslint-disable-next-line
  }, [conversationMessages]);

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0) {
      setLoadingMoreMessageLoader(true);
      page = page + 1;
      socket.emit("loadMoreMessages", {
        conversationId: selectedConversation._id,
        userId: auth?.user._id,
        page: page,
        limit: 20,
      });
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainerRef.current) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    // Clean up event listener when component unmounts
    return () => {
      chatContainer?.removeEventListener("scroll", handleScroll);
    };

    // eslint-disable-next-line
  }, [chatContainerRef.current]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    // eslint-disable-next-line
  }, [isNewMessage, deletingMessageLoader]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    const handleRecievedMessage = (message) => {
      if (message.conversationId === selectedConversation?._id) {
        const newConversationMessages = [...conversationMessages, message];
        localStorage.setItem(
          "selectedConversationMessages",
          JSON.stringify(newConversationMessages || {})
        );
        setConversationMessages(newConversationMessages);
        setIsNewMessage(false);
      }
    };

    const handleRecievedMultipleMedia = (fileReferences) => {
      if (fileReferences[0].conversationId === selectedConversation?._id) {
        const newConversationMessages = [
          ...conversationMessages,
          ...fileReferences,
        ];
        localStorage.setItem(
          "selectedConversationMessages",
          JSON.stringify(newConversationMessages || {})
        );
        setConversationMessages(newConversationMessages);
        setIsNewMessage(false);
      }
    };

    const handleRecievedMedia = (message) => {
      if (message.conversationId === selectedConversation?._id) {
        const newConversationMessages = [...conversationMessages, message];
        setConversationMessages(newConversationMessages);
        localStorage.setItem(
          "selectedConversationMessages",
          JSON.stringify(newConversationMessages || {})
        );
        setIsNewMessage(false);
      }
    };

    const handleNewConversationForSender = (newConversation) => {
      const storedConversations = localStorage.getItem("allConversations");
      if (storedConversations) {
        const sortedConversations = JSON.parse(storedConversations)
          .filter((conversation) => conversation._id !== newConversation._id)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        const updatedConversations = [newConversation, ...sortedConversations];

        setConversations(updatedConversations);
        localStorage.setItem(
          "allConversations",
          JSON.stringify(updatedConversations || {})
        );
      }
      // Update state with the sorted array
      setNewConversationLoader(false);
      setNewGroupConversationLoader(false);
      setSelectedConversation(newConversation);
      localStorage.setItem(
        "selectedConversation",
        JSON.stringify(newConversation || {})
      );
      setConversationMessages([]);
    };

    const handleNewGroupConversationForSender = (newConversation) => {
      const storedConversations = localStorage.getItem("allConversations");
      if (storedConversations) {
        const sortedConversations = JSON.parse(storedConversations)?.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        const updatedConversations = [newConversation, ...sortedConversations];

        setConversations(updatedConversations);
        localStorage.setItem(
          "allConversations",
          JSON.stringify(updatedConversations || {})
        );
      }
      setNewConversationLoader(false);
      setNewGroupConversationLoader(false);
      setSelectedConversation(newConversation);
      localStorage.setItem(
        "selectedConversation",
        JSON.stringify(newConversation || {})
      );
      setConversationMessages([]);
    };

    const handleDeleteConversation = (conversationId) => {
      const storedConversations = localStorage.getItem("allConversations");
      if (storedConversations) {
        const sortedConversations = JSON.parse(storedConversations)?.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        const updatedConversations = sortedConversations.filter(
          (conversation) => conversation._id !== conversationId
        );

        setConversations(updatedConversations);
        localStorage.setItem(
          "allConversations",
          JSON.stringify(updatedConversations || {})
        );
      }
      localStorage.removeItem("selectedConversation");
      localStorage.removeItem("selectedConversationMessages");

      setConversationMessages([]);
      setSelectedConversation();
      setDeletingConversationLoader(false);
      setClearingConversationLoader(false);
    };

    const handleClearConversation = (conversationId) => {
      setConversationMessages([]);
      setDeletingMessageLoader(false);
      setDeletingConversationLoader(false);
      setClearingConversationLoader(false);
      localStorage.removeItem("selectedConversationMessages");
    };

    const handleDeleteMessages = (messageIds) => {
      const nonDeletedConversationMessages = conversationMessages.filter(
        (message) => !messageIds.includes(message._id)
      );
      localStorage.setItem(
        "selectedConversationMessages",
        JSON.stringify(nonDeletedConversationMessages || {})
      );

      setConversationMessages(nonDeletedConversationMessages);
      setDeletingMessageLoader(false);

      setSelectedMessages([]);
    };

    const handleLoadMoreMessages = ({ messages, conversationId }) => {
      if (messages.length === 0) {
        setNoMoreMessages(true);
      } else {
        setLoadingMoreMessageLoader(false);
        setNoMoreMessages(false);
        if (chatContainerRef.current) {
          // Update the scrollTop to maintain the same scroll position before loading
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight - previousScrollHeight;
        }
        if (conversationId === selectedConversation._id) {
          const existingMessages = localStorage.getItem(
            "selectedConversationMessages"
          );
          const newConversationMessages = [
            ...messages,
            ...JSON.parse(existingMessages),
          ];
          localStorage.setItem(
            "selectedConversationMessages",
            JSON.stringify(newConversationMessages || {})
          );
          setConversationMessages(newConversationMessages);
        }
      }
    };

    socket.on("recievedMultipleMedia", handleRecievedMultipleMedia);
    socket.on("recievedMedia", handleRecievedMedia);
    socket.on("recievedMessage", handleRecievedMessage);
    socket.on("newConversationForSender", handleNewConversationForSender);
    socket.on(
      "newGroupConversationForSender",
      handleNewGroupConversationForSender
    );

    socket.on("deletedConversation", handleDeleteConversation);
    socket.on("clearedConversation", handleClearConversation);
    socket.on("deletedMessages", handleDeleteMessages);
    socket.on("moreMessagesLoaded", handleLoadMoreMessages);

    return () => {
      socket.removeAllListeners("recievedMedias");
      socket.removeAllListeners("recievedMultipleMedia");
      socket.removeAllListeners("recievedMessage");
      socket.removeAllListeners("newConversationForSender");
      socket.removeAllListeners("newGroupConversationForSender");
      socket.removeAllListeners("deletedConversation");
      socket.removeAllListeners("clearedConversation");
      socket.removeAllListeners("deletedMessages");
      socket.removeAllListeners("moreMessagesLoaded");
    };

    // eslint-disable-next-line
  }, [socket, conversationMessages]);

  useEffect(() => {
    setConversationMessages([]);
    setSelectedConversation();
    setConversationRemoved(false);
    //eslint-disable-next-line
  }, [isConversationRemoved]);

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

  //fetch all conversations
  const fetchAllConversations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/conversation/fetch-all-conversations?userId=${auth?.user._id}`
      );
      if (response.data.success) {
        const sortedConversations = response.data?.conversations?.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setConversations(sortedConversations);
        localStorage.setItem(
          "allConversations",
          JSON.stringify(sortedConversations || {})
        );
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

  // fecth single conversation
  const fetchSingleConversation = async (chat) => {
    try {
      setConversationMessages([]);
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/conversation/fetch-single-conversation?conversationId=${chat._id}&userId=${auth?.user._id}`
      );
      if (response.data.success) {
        setSelectedConversation(chat);
        localStorage.setItem(
          "selectedConversation",
          JSON.stringify(chat || {})
        );
        localStorage.setItem(
          "selectedConversationMessages",
          JSON.stringify(response.data.messages || {})
        );
        setConversationMessages(response.data.messages);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
        setPreviousScrollHeight(chatContainerRef.current.scrollHeight);
      }
    }
  };

  const handleSendMessage = async () => {
    try {
      const tempMessageObject = {
        senderName: auth?.user.username,
        content: userInput,
        createdAt: Date.now(),
      };
      setUserInput("");
      setIsNewMessage(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/conversation/new-message`,
        {
          conversationId: selectedConversation._id,
          senderId: auth.user._id,
          senderName: auth.user.username,
          userInput: tempMessageObject.content,
          senderProfilePic: auth?.user.profilePic,
        }
      );
      if (!response.data.success) {
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

  const handleClearConversation = async () => {
    try {
      setClearingConversationLoader(true);
      // socket.emit("clearConversation", {
      //   conversationId: selectedConversation._id,
      //   userId: auth?.user?._id,
      // });

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/conversation/clear-conversation`,
        {
          conversationId: selectedConversation._id,
          userId: auth?.user?._id,
        }
      );
      if (!response.data.success) {
        toast.error(response.data.message);
        setClearingConversationLoader(false);
      }
    } catch (error) {
      setClearingConversationLoader(false);
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

  const handleDeleteConversation = async () => {
    try {
      setDeletingConversationLoader(true);
      // socket.emit("deleteConversation", {
      //   conversationId: selectedConversation._id,
      //   userId: auth?.user._id,
      // });
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/conversation/delete-conversation`,
        {
          conversationId: selectedConversation._id,
          userId: auth?.user._id,
          username: auth?.user.username,
        }
      );
      if (!response.data.success) {
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
    } finally {
      setDeletingConversationLoader(false);
    }
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/user/all-users`,
        {
          params: { adminId: auth?.user?.admin },
        }
      );
      if (response.status === 200) {
        const sortedUsers = response.data?.users
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user, index) => ({
            id: index + 1,
            ...user,
          }));
        const filteredUsers = sortedUsers
          // ?.filter((user) => user._id !== auth?.user._id)
          .map((user, index) => ({
            id: index + 1,
            ...user,
          }));
        setAllUsers(filteredUsers);
        localStorage.setItem("allUsers", JSON.stringify(sortedUsers || {}));
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

  const getAllMedia = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/conversation/all-media`,
        {
          params: { userId: auth.user._id },
        }
      );
      if (response.data?.success) {
        const sortedVideos = response.data?.videos?.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        const sortedImages = response.data?.images?.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        setFetchedVideos(sortedVideos || {});
        setFetchedImages(sortedImages || {});
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

  const handleNewConversation = async (user) => {
    try {
      const existingConversation = conversations.find(
        (conversation) =>
          conversation.users.length === 2 &&
          conversation.users.some(
            (conversationUser) => conversationUser.username === user.username
          ) &&
          !conversation.isGroupChat
      );

      if (existingConversation) {
        fetchSingleConversation(existingConversation);
        return;
      } else {
        setNewConversationLoader(true);
        const response = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/conversation/new-conversation`,
          {
            senderId: auth?.user._id,
            recipient: user,
          }
        );
        if (!response.data.success) {
          setNewConversationLoader(false);
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      setNewConversationLoader(false);
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

  const handleDeleteMessage = async () => {
    try {
      setDeletingMessageLoader(true);

      socket.emit("deleteMessage", {
        conversationId: selectedConversation._id,
        messageIds: selectedMessages,
        userId: auth?.user._id,
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/conversation/delete-message`,
        {
          conversationId: selectedConversation._id,
          messageIds: selectedMessages,
          userId: auth?.user._id,
        }
      );
      if (!response.data.success) {
        setDeletingMessageLoader(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setDeletingMessageLoader(false);
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

  const leaveGroup = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/conversation/leave-group?userId=${auth?.user._id}&conversationId=${selectedConversation._id}`
      );
      if (!response.data.success) {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        toast.error(error.response.data.message);
        handleLogout();
      }
    }
  };

  const handleFileDownload = async (file) => {
    try {
      const blobUrl = file.filePath;
      // const blobUrl = URL.createObjectURL(new Blob([response.data]));

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.fileName;
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error downloading file:", error);
      toast.error("Something went wrong!");

      // Redirect to login page if session expired
      if (
        error.response &&
        error.response.data.message === "Session expired!\nPlease login again."
      ) {
        toast.error(error.response.data.message);
        handleLogout();
      }
    }
  };

  document.title = "ZippiAi - Chat";

  return (
    <>
      <Box
        style={{
          display: "flex",
          margin: "0",
        }}
      >
        <LeftSideDrawer
          pageKey={"Chat"}
          handleLogout={handleLogout}
          isMainDrawerOpen={isMainDrawerOpen}
          setIsMainDrawerOpen={setIsMainDrawerOpen}
          handleCloseMainDrawer={handleCloseMainDrawer}
        />
        <Box
          sx={{
            width: "100%",
            position: "relative",
          }}
        >
          {isMainDrawerOpen && (
            <Tooltip
              title="Close Navbar"
              aria-label="Close Navbar"
              placement="right"
              arrow
            >
              <IconButton
                onClick={handleCloseMainDrawer}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0px",
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
          <Grid container direction="row" margin="0" padding="0 0 0 15px">
            <Grid item xs={12} sm={12} md={12} lg={4} xl={3}>
              {activeComponent === "MyChats" && (
                <MyChats
                  allUsers={allUsers}
                  conversations={conversations}
                  setConversationMessages={setConversationMessages}
                  selectedConversation={selectedConversation}
                  setSelectedConversation={setSelectedConversation}
                  fetchSingleConversation={fetchSingleConversation}
                  setSelectedMessages={setSelectedMessages}
                  handleClearConversation={handleClearConversation}
                  handleNewConversation={handleNewConversation}
                  newConversationLoader={newConversationLoader}
                  setNewConversationLoader={setNewConversationLoader}
                  newGroupConversationLoader={newGroupConversationLoader}
                  setNewGroupConversationLoader={setNewConversationLoader}
                  setDeletingMessageLoader={setDeletingMessageLoader}
                  setClearingConversationLoader={setClearingConversationLoader}
                  setDeletingConversationLoader={setDeletingConversationLoader}
                  handleLogout={handleLogout}
                  setConversations={setConversations}
                  isNewMessage={isNewMessage}
                />
              )}
              {(activeComponent === "Videos" ||
                activeComponent === "Images") && (
                <MediaList
                  openComponent={openComponent}
                  videos={fetchedVideos}
                  images={fetchedImages}
                  user={auth?.user}
                  handleLogout={handleLogout}
                  selectedConversation={selectedConversation}
                  handleFileDownload={handleFileDownload}
                  activeComponent={activeComponent}
                  setIsNewMessage={setIsNewMessage}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={8} xl={9}>
              {isMainDrawerOpen && (
                <Tooltip
                  title="Close Navbar"
                  aria-label="Close Navbar"
                  placement="right"
                  arrow
                >
                  <IconButton
                    onClick={handleCloseMainDrawer}
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
              <ChatBox
                selectedConversation={selectedConversation}
                conversationMessages={conversationMessages}
                setUserInput={setUserInput}
                userInput={userInput}
                handleSendMessage={handleSendMessage}
                loading={loading}
                selectedMessages={selectedMessages}
                setSelectedMessages={setSelectedMessages}
                handleDeleteMessage={handleDeleteMessage}
                handleDeleteConversation={handleDeleteConversation}
                handleClearConversation={handleClearConversation}
                chatContainerRef={chatContainerRef}
                leaveGroup={leaveGroup}
                allUsers={allUsers}
                languages={languages}
                chatLanguage={chatLanguage}
                handleLanguageChange={handleLanguageChange}
                deletingMessageLoader={deletingMessageLoader}
                setDeletingMessageLoader={setDeletingMessageLoader}
                clearingConversationLoader={clearingConversationLoader}
                setClearingConversationLoader={setClearingConversationLoader}
                deletingConversationLoader={deletingConversationLoader}
                setDeletingConversationLoader={setDeletingConversationLoader}
                handleLogout={handleLogout}
                loadingMoreMessageLoader={loadingMoreMessageLoader}
                setLoadingMoreMessageLoader={setLoadingMoreMessageLoader}
                noMoreMessages={noMoreMessages}
                setActiveComponent={setActiveComponent}
                openComponent={openComponent}
                activeComponent={activeComponent}
                setIsNewMessage={setIsNewMessage}
                setSelectedConversation={setSelectedConversation}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ChatPanel;
