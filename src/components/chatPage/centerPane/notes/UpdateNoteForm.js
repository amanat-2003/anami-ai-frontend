import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";
import Draggable from "react-draggable";
import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Paper,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";

import NoteEditor from "./NoteEditor.js";
import NoteHeader from "./NoteHeader.js";
import NoteMediaList from "./NoteMediaList.js";
import NoteVideoUploader from "./NoteVideoUploader.js";
import NoteImageUploader from "./NoteImageUploader.js";
import CloseNoteConfirmDialog from "./CloseNoteConfirmDialog.js";

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

const UpdateNoteForm = (props) => {
  const {
    note,
    user,
    asset,
    notes,
    setNotes,
    images,
    setImages,
    videos,
    setVideos,
    languages,
    handleLogout,
    chatLanguage,
    openComponent,
    selectedImages,
    selectedVideos,
    setSelectedNote,
    setSelectedImages,
    setSelectedVideos,
    imageFileInputRef,
    videoFileInputRef,
    handleGenerateNote,
    handleImageFileDownload,
    handleVideoFileDownload,
    isNoteCloseConfirmDialogOpen,
    handleOpenNoteCloseConfirmDialog,
    handleCloseNoteCloseConfirmDialog,
    handleDeleteNote,
  } = props;

  const {
    transcript: transcriptUpdateNote,
    resetTranscript: resetTranscriptUpdateNote,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const [isSpeakingUpdateNoteSection, setIsSpeakingUpdateNoteSection] =
    useState(false);
  const [noteLanguage, setNoteLanguage] = useState(chatLanguage);
  const [fileName, setFileName] = useState(note.fileName);
  const [previousTranscript, setPreviousTranscript] = useState("");
  const [addedImages, setAddedImages] = useState([]);
  const [addedVideos, setAddedVideos] = useState([]);
  const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [transcribedVideos, setTranscribedVideos] = useState([]);
  const [transcribedVideoTitle, setTranscribedVideoTitle] = useState("");
  const [oldContent] = useState(note.content);
  const [isTranscribeButtonDisabled, setIsTranscribeButtonDisabled] =
    useState(false);
  const [videoInProgress, setVideoInProgress] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [savedSelection, setSavedSelection] = useState(null);
  const [isModifyNoteDialogOpen, setIsModifyNoteDialogOpen] = useState(false);
  const quillRef = useRef(null);
  const [isImageMediaListOpen, setIsImageMediaListOpen] = useState(false);
  const [isVideoMediaListOpen, setIsVideoMediaListOpen] = useState(false);
  const [isVideoAddingDialogOpen, setOpenVideoAddingDialog] = useState(false);
  const [isImageAddingDialogOpen, setOpenImageAddingDialog] = useState(false);
  // Sort the selected images by name
  const sortedImages = selectedImages
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  // Sort the selected videos by name
  const sortedVideos = selectedVideos
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const insertTranscriptIntoQuill = () => {
    if (quillRef.current) {
      const cursorPosition = quillRef.current?.getSelection()?.index || 0;
      const newTranscript = transcriptUpdateNote.substring(
        previousTranscript.length
      );
      quillRef.current.insertText(cursorPosition, newTranscript);
      setPreviousTranscript(transcriptUpdateNote);
    }
  };

  useEffect(() => {
    resetTranscriptUpdateNote();
    handleTurnMicOff();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (transcriptUpdateNote.trim() !== "" && isSpeakingUpdateNoteSection) {
      insertTranscriptIntoQuill();
    }
    // eslint-disable-next-line
  }, [transcriptUpdateNote, isSpeakingUpdateNoteSection]);

  const startListening = async () => {
    resetTranscriptUpdateNote();
    const speechLanguage = languages.find(
      (language) => language.name === noteLanguage
    );
    await SpeechRecognition.startListening({
      continuous: true,
      language: speechLanguage.code,
    });
  };

  const stopListening = async () => {
    await SpeechRecognition.stopListening();
    resetTranscriptUpdateNote();
  };

  // Turn Mic On
  const handleTurnMicOn = async () => {
    resetTranscriptUpdateNote();
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser support unavailable for speech to text!");
    }
    if (!isMicrophoneAvailable) {
      toast.error("Mic unavailable!");
    }
    setIsSpeakingUpdateNoteSection(true);
    await startListening();
  };

  // Turn Mic Off
  const handleTurnMicOff = async () => {
    if (transcriptUpdateNote.trim() !== "" && isSpeakingUpdateNoteSection) {
      insertTranscriptIntoQuill();
    }
    setIsSpeakingUpdateNoteSection(false);
    await stopListening();
    resetTranscriptUpdateNote();
    setPreviousTranscript("");
  };

  const handleLanguageChange = (e) => {
    setNoteLanguage(e.target.value);
  };

  const resetFormFields = () => {
    setFileName("");
    setSelectedImages([]);
    setSelectedVideos([]);
  };

  const ImageHandler = {
    insertToEditor(url, quill, name) {
      const range = quill?.getSelection()?.index || quill?.getLength();
      // const imageLinkEmbed = `<br><a href="${url}" target="_blank">${name}</a><br>`;
      // quill.clipboard.dangerouslyPasteHTML(range, imageLinkEmbed);
      const imageEmbed = `<br><img src="${url}" alt="${name}"/><br>`;
      quill.clipboard.dangerouslyPasteHTML(range, imageEmbed);
    },
  };

  const VideoHandler = {
    insertVideoToEditor(url, quill, name) {
      const range = quill?.getSelection()?.index || quill?.getLength();
      const videoLinkEmbed = `<br><a href="${url}" target="_blank">${name}</a><br>`;
      quill.clipboard.dangerouslyPasteHTML(range, videoLinkEmbed);
    },
  };

  const handleAddExistingImage = ({ imagefileName, imagefilePath }) => {
    ImageHandler.insertToEditor(imagefilePath, quillRef.current, imagefileName);
  };

  const handleAddExistingVideo = ({ videofileName, videofilePath }) => {
    VideoHandler.insertVideoToEditor(
      videofilePath,
      quillRef.current,
      videofileName
    );
  };
  // Update Note
  const handleUpdateNote = async () => {
    try {
      if (!fileName.trim()) {
        toast.error("Please provide a name!");
        return;
      }
      const noteData = new FormData();
      noteData.append("userId", user._id);
      noteData.append("assetId", asset._id);
      noteData.append("fileName", fileName.trim());
      addedImages.forEach((imageFile) => {
        noteData.append("images", imageFile);
      });
      addedVideos.forEach((videoFile) => {
        noteData.append("videos", videoFile);
      });
      noteData.append("content", quillRef.current.root.innerHTML);

      toast.promise(
        axios.put(
          `${process.env.REACT_APP_API}/api/v1/note/update-note/${note._id}`,
          noteData
        ),
        {
          loading: "Updating Note... Please Wait!",
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

              setSelectedNote("");
              resetFormFields();
              openComponent("Notes");
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            setSelectedNote("");
            resetFormFields();
            openComponent("Notes");
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
      handleTurnMicOff();
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

  // Save Draft
  const handleSaveDraft = async () => {
    try {
      if (!fileName.trim()) {
        toast.error("Please provide a name!");
        return;
      }
      const noteData = new FormData();
      noteData.append("userId", user._id);
      noteData.append("assetId", asset._id);
      noteData.append("fileName", fileName.trim());
      addedImages.forEach((imageFile) => {
        noteData.append("images", imageFile);
      });
      addedVideos.forEach((videoFile) => {
        noteData.append("videos", videoFile);
      });
      noteData.append("content", quillRef.current.root.innerHTML);

      toast.promise(
        axios.put(
          `${process.env.REACT_APP_API}/api/v1/note/save-note-as-draft/${note._id}`,
          noteData
        ),
        {
          loading: "Saving Draft... Please Wait!",
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

              setSelectedNote("");
              resetFormFields();
              openComponent("Notes");
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            setSelectedNote("");
            resetFormFields();
            openComponent("Notes");
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
      handleTurnMicOff();
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

  // Function to handle the browser back event
  const handleBrowserBack = () => {
    if (quillRef.current.root.innerHTML !== oldContent) {
      const userDecision = window.confirm("Do you want to save changes?");
      if (fileName.trim()) {
        if (userDecision) {
          handleUpdateNote(note._id);
        } else {
          openComponent("Notes");
        }
      } else {
        if (userDecision) {
          toast.error("Please provide a name");
          return;
        } else {
          openComponent("Notes");
        }
      }
    } else {
      if (fileName === note.fileName) {
        openComponent("Notes");
      } else if (fileName.trim()) {
        const userDecision = window.confirm("Do you want to save changes?");
        if (userDecision) {
          handleUpdateNote(note._id);
        } else {
          openComponent("Notes");
        }
      } else {
        openComponent("Notes");
      }
    }
    handleTurnMicOff();
    resetFormFields();
  };

  window.onpopstate = () => {
    handleBrowserBack();
  };

  // Handle beforeunload event
  window.onbeforeunload = (event) => {
    if (quillRef.current.root.innerHTML !== oldContent) {
      const message = "You have unsaved changes. Do you really want to leave?";
      event.returnValue = message;
      return message;
    }
  };

  const handleInsertImage = (image) => {
    try {
      const imageData = new FormData();
      imageData.append("userId", user._id);
      imageData.append("assetId", asset._id);
      imageData.append("image", image);

      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/add-image-in-note/${note._id}`,
          imageData
        ),
        {
          loading: "Adding Image...\nPlease Wait!",
          success: (response) => {
            if (response.status === 201) {
              const newImage = response.data.image;
              const imageUrl = response.data.filePath;

              const updatedImages = [...images, newImage].sort((a, b) =>
                a.fileName.localeCompare(b.fileName)
              ); // Append the new image and re-sort the array

              setImages(updatedImages);
              // localStorage.setItem(
              //   "allImages",
              //   JSON.stringify(updatedImages || {})
              // );
              ImageHandler.insertToEditor(
                imageUrl,
                quillRef.current,
                image.name
              );
              if (
                !addedImages.some(
                  (addedImage) => addedImage.name === image.name
                )
              ) {
                setAddedImages((prevFiles) => [...prevFiles, image]);
              }
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

  const handleInsertVideo = (video) => {
    try {
      const transcription = transcribedVideos.find(
        (item) => item.videoName === video.name
      );

      const videoData = new FormData();
      videoData.append("userId", user._id);
      videoData.append("assetId", asset._id);
      videoData.append(
        "transcription",
        transcription ? transcription.response : ""
      );
      videoData.append("video", video);

      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/add-video-in-note/${note._id}`,
          videoData
        ),
        {
          loading: "Adding Video...\nPlease Wait!",
          success: (response) => {
            if (response.status === 201) {
              const newVideo = response.data.video;
              const videoUrl = response.data.filePath;

              const updatedVideos = [...videos, newVideo].sort((a, b) =>
                a.fileName.localeCompare(b.fileName)
              ); // Append the new video and re-sort the array

              setVideos(updatedVideos);
              // localStorage.setItem(
              //   "allVideos",
              //   JSON.stringify(updatedVideos || {})
              // );

              VideoHandler.insertVideoToEditor(
                videoUrl,
                quillRef.current,
                video.name
              );
              if (
                !addedVideos.some(
                  (addedVideo) => addedVideo.name === video.name
                )
              ) {
                setAddedVideos((prevFiles) => [...prevFiles, video]);
              }
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

  // Handle Images
  const handleImageChange = (event) => {
    handleCloseImageAddDialog();
    const files = event.target.files;
    const selectedFileNames = selectedImages.map((file) => file.name);

    // Filter out duplicate files by comparing file names
    const uniqueFiles = Array.from(files).filter((file) => {
      return !selectedFileNames.includes(file.name);
    });

    // Check if the total number of selected files does not exceed 10
    if (selectedImages.length + uniqueFiles.length > 10) {
      toast.error("You can only upload a maximum of 10 images at a time.");
      return;
    }

    // Check each file's type and size before adding it to the selectedImages
    const allowedFiles = [];
    const rejectedFiles = [];

    for (const file of uniqueFiles) {
      // Check if the file is a png or jpeg image
      if (file.type === "image/png" || file.type === "image/jpeg") {
        // Check if the file size is within the limit
        if (file.size <= 20 * 1024 * 1024) {
          allowedFiles.push(file);
        } else {
          rejectedFiles.push(file);
        }
      } else {
        rejectedFiles.push(file);
      }
    }

    setSelectedImages((prevFiles) => [...prevFiles, ...allowedFiles]);

    if (rejectedFiles.length > 0) {
      toast.error(
        `The following files are not PNG or JPEG images or exceed the 20MB limit:\n\n${rejectedFiles
          .map((file) => file.name)
          .join("\n")}`
      );
    }
  };

  const handleRemoveImage = (fileToRemove) => {
    const updateSelectedFiles = selectedImages.filter(
      (file) => file !== fileToRemove
    );
    setSelectedImages(updateSelectedFiles);
    const updateAddedFiles = addedImages.filter(
      (file) => file !== fileToRemove
    );
    setAddedImages(updateAddedFiles);
    // Clear the file input value to allow re-selection of the removed file
    imageFileInputRef.current.value = "";
  };

  // const getTotalImagesSize = () => {
  //   return selectedImages.reduce((totalSize, file) => totalSize + file.size, 0);
  // };

  // Handle Videos
  const handleVideoChange = (event) => {
    handleCloseVideoAddDialog();
    const files = event.target.files;
    const selectedFileNames = selectedVideos.map((file) => file.name);

    // Filter out duplicate files by comparing file names
    const uniqueFiles = Array.from(files).filter((file) => {
      return !selectedFileNames.includes(file.name);
    });

    // Check if the total number of selected files does not exceed 5
    if (selectedVideos.length + uniqueFiles.length > 5) {
      toast.error("You can only upload a maximum of 5 videos at a time.");
      return;
    }

    // Check each file's type and size before adding it to the selectedImages
    const allowedFiles = [];
    const rejectedFiles = [];

    for (const file of uniqueFiles) {
      // Check if the file is a mp4
      if (file.type === "video/mp4") {
        // Check if the file size is within the limit
        if (file.size <= 100 * 1024 * 1024) {
          allowedFiles.push(file);
        } else {
          rejectedFiles.push(file);
        }
      } else {
        rejectedFiles.push(file);
      }
    }

    setSelectedVideos((prevFiles) => [...prevFiles, ...allowedFiles]);

    if (rejectedFiles.length > 0) {
      toast.error(
        `The following files are not MP4 videos or exceed the 100MB limit:\n\n${rejectedFiles
          .map((file) => file.name)
          .join("\n")}`
      );
    }
  };

  const handleRemoveVideo = (fileToRemove) => {
    const updateSelectedFiles = selectedVideos.filter(
      (file) => file !== fileToRemove
    );
    setSelectedVideos(updateSelectedFiles);
    const updateAddedFiles = addedVideos.filter(
      (file) => file !== fileToRemove
    );
    setAddedVideos(updateAddedFiles);
    // Clear the file input value to allow re-selection of the removed file
    videoFileInputRef.current.value = "";
  };

  // const getTotalVideosSize = () => {
  //   return selectedVideos.reduce((totalSize, file) => totalSize + file.size, 0);
  // };

  // Handle Transcription
  const handleTranscriptVideo = async (video) => {
    try {
      setVideoInProgress(video);
      setIsTranscribeButtonDisabled(true);
      const transcriptData = new FormData();
      transcriptData.append("userId", user._id);
      transcriptData.append("assetId", asset._id);
      transcriptData.append("noteId", note._id);
      transcriptData.append("video", video);

      toast.promise(
        axios.post(
          `${process.env.REACT_APP_API}/api/v1/media/transcribe-video-in-note`,
          transcriptData
        ),
        {
          loading: `Transcribing ${video.name}`,
          success: (response) => {
            if (response.status === 201) {
              const updatedTranscribedVideos = [
                ...transcribedVideos,
                {
                  videoName: video.name,
                  response: response.data.transcription,
                },
              ];
              setTranscribedVideos(updatedTranscribedVideos);
              setIsTranscribeButtonDisabled(false);
              setVideoInProgress("");
              return response.data.message;
            } else {
              console.error("Unexpected success response:", response);
              return "Unexpected error";
            }
          },
          error: (error) => {
            setIsTranscribeButtonDisabled(false);
            setVideoInProgress("");
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

  const handleShowTranscript = (video) => {
    const foundTranscription = transcribedVideos.find(
      (item) => item.videoName === video.name
    );

    if (foundTranscription) {
      setTranscribedText(foundTranscription.response);
      setTranscribedVideoTitle(video.name);
      setTranscriptDialogOpen(true);
    } else {
      toast.error("Transcription not found for this video!");
    }
  };

  const handleCopyTranscript = async (transcribedText) => {
    try {
      await navigator.clipboard.writeText(transcribedText);
      toast.success("Text copied");
    } catch (error) {
      toast.error("Unable to copy");
    }
  };

  const handleCloseTranscriptDialog = () => {
    setTranscriptDialogOpen(false);
  };

  const handleOpenVideoAddDialog = () => {
    setOpenVideoAddingDialog(true);
  };
  const handleCloseVideoAddDialog = () => {
    setOpenVideoAddingDialog(false);
  };
  const handleOpenImageAddDialog = () => {
    setOpenImageAddingDialog(true);
  };
  const handleCloseImageAddDialog = () => {
    setOpenImageAddingDialog(false);
  };

  const handleOpenImageMediaList = () => {
    setIsImageMediaListOpen(true);
    setIsVideoMediaListOpen(false);
  };
  const handleOpenVideoMediaList = () => {
    setIsVideoMediaListOpen(true);
    setIsImageMediaListOpen(false);
  };

  const handleCloseMediaList = () => {
    setIsVideoMediaListOpen(false);
    setIsImageMediaListOpen(false);
  };

  return (
    <>
      {isNoteCloseConfirmDialogOpen && (
        <CloseNoteConfirmDialog
          isNoteCloseConfirmDialogOpen={isNoteCloseConfirmDialogOpen}
          handleCloseNoteCloseConfirmDialog={handleCloseNoteCloseConfirmDialog}
          handleSaveDraft={handleSaveDraft}
          handleDeleteNote={handleDeleteNote}
          createdNote={note}
          isUpdatingNote={true}
          openComponent={openComponent}
        />
      )}

      <Dialog
        open={transcriptDialogOpen}
        onClose={handleCloseTranscriptDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog"
        TransitionProps={{
          timeout: {
            enter: 500,
            exit: 200,
          },
        }}
      >
        <DialogTitle
          style={{ textAlign: "center", cursor: "move" }}
          className="draggable-dialog"
        >
          {transcribedVideoTitle}
        </DialogTitle>
        <DialogContent>
          <Typography>{transcribedText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCopyTranscript(transcribedText);
              handleCloseTranscriptDialog();
            }}
            color="primary"
          >
            Copy
          </Button>
          <Button onClick={handleCloseTranscriptDialog} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {isImageAddingDialogOpen && (
        <NoteImageUploader
          open={isImageAddingDialogOpen}
          onClose={handleCloseImageAddDialog}
          handleOpenImageMediaList={handleOpenImageMediaList}
          handleImageChange={handleImageChange}
          imageFileInputRef={imageFileInputRef}
        />
      )}

      {isVideoAddingDialogOpen && (
        <NoteVideoUploader
          open={isVideoAddingDialogOpen}
          onClose={handleCloseVideoAddDialog}
          handleOpenVideoMediaList={handleOpenVideoMediaList}
          handleVideoChange={handleVideoChange}
          videoFileInputRef={videoFileInputRef}
        />
      )}

      <Box
        style={{
          padding: "25px 50px 10px",
          height: "100vh",
        }}
      >
        <Grid container direction="row" margin="0" height={"100%"}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={isImageMediaListOpen || isVideoMediaListOpen ? 8 : 12}
            xl={isImageMediaListOpen || isVideoMediaListOpen ? 9 : 12}
            sx={{
              paddingRight: "10px",
              paddingLeft: "20px",
              height: `calc(100% - 20px)`,
            }}
          >
            <NoteHeader
              quillRef={quillRef}
              fileName={fileName}
              setFileName={setFileName}
              languages={languages}
              noteLanguage={noteLanguage}
              handleLanguageChange={handleLanguageChange}
              handleTurnMicOn={handleTurnMicOn}
              handleTurnMicOff={handleTurnMicOff}
              handleBrowserBack={handleBrowserBack}
              isTranscribeButtonDisabled={isTranscribeButtonDisabled}
              isSpeakingNoteSection={isSpeakingUpdateNoteSection}
              handleSaveNote={handleUpdateNote}
              handleSaveDraft={handleSaveDraft}
              sortedImages={sortedImages}
              imageFileInputRef={imageFileInputRef}
              handleInsertImage={handleInsertImage}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
              sortedVideos={sortedVideos}
              videoFileInputRef={videoFileInputRef}
              handleInsertVideo={handleInsertVideo}
              handleVideoChange={handleVideoChange}
              handleRemoveVideo={handleRemoveVideo}
              videoInProgress={videoInProgress}
              transcribedVideos={transcribedVideos}
              handleShowTranscript={handleShowTranscript}
              handleTranscriptVideo={handleTranscriptVideo}
              setSelectedText={setSelectedText}
              setSavedSelection={setSavedSelection}
              setIsModifyNoteDialogOpen={setIsModifyNoteDialogOpen}
              handleOpenImageAddDialog={handleOpenImageAddDialog}
              handleOpenVideoAddDialog={handleOpenVideoAddDialog}
              handleOpenNoteCloseConfirmDialog={
                handleOpenNoteCloseConfirmDialog
              }
              handleCloseNoteCloseConfirmDialog={
                handleCloseNoteCloseConfirmDialog
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: `calc(100% - 80px)`,
                overflow: "auto",
              }}
            >
              <NoteEditor
                user={user}
                note={note}
                quillRef={quillRef}
                noteContent={oldContent}
                handleLogout={handleLogout}
                selectedText={selectedText}
                savedSelection={savedSelection}
                setSelectedText={setSelectedText}
                setSavedSelection={setSavedSelection}
                handleGenerateNote={handleGenerateNote}
                isModifyNoteDialogOpen={isModifyNoteDialogOpen}
                setIsModifyNoteDialogOpen={setIsModifyNoteDialogOpen}
              />
            </div>
          </Grid>

          {(isImageMediaListOpen || isVideoMediaListOpen) && (
            <Grid item xs={12} sm={12} md={12} lg={4} xl={3}>
              <NoteMediaList
                user={user}
                images={images}
                videos={videos}
                handleLogout={handleLogout}
                handleCloseMediaList={handleCloseMediaList}
                isImageMediaListOpen={isImageMediaListOpen}
                handleAddExistingImage={handleAddExistingImage}
                handleAddExistingVideo={handleAddExistingVideo}
                handleImageFileDownload={handleImageFileDownload}
                handleVideoFileDownload={handleVideoFileDownload}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default UpdateNoteForm;
