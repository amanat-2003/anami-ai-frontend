import React, { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./auth";
import toast from "react-hot-toast";
import { useSocket } from "./socket";

const SocketServiceContext = createContext();

const SocketServiceProvider = ({ children }) => {
  const [socket] = useSocket();
  const [auth, setAuth] = useAuth();
  const [isLocalStorageUpdated, setLocalStorageUpdation] = useState(false);
  const [isConversationRemoved, setConversationRemoved] = useState(false);

  // const updateLocalStorageItemsForDepartment = async (updatedDepartment) => {
  //   const storageKeys = [
  //     "allNotes",
  //     "allAssets",
  //     "allImages",
  //     "allVideos",
  //     "allDocuments",
  //     "allUserDocuments",
  //   ];

  //   // Step 1: Update department name in stored items
  //   const updateDepartmentNameInItems = (items, updatedDepartment) => {
  //     return items.map((item) => {
  //       if (item.department === updatedDepartment._id) {
  //         item.departmentName = updatedDepartment.departmentName;
  //       }
  //       return item;
  //     });
  //   };

  //   // Step 2: Retrieve and update items from localStorage
  //   storageKeys.forEach((key) => {
  //     const storedItems = JSON.parse(localStorage.getItem(key));
  //     if (storedItems) {
  //       const updatedItems = updateDepartmentNameInItems(
  //         storedItems,
  //         updatedDepartment
  //       );
  //       localStorage.setItem(key, JSON.stringify(updatedItems));
  //     }
  //   });

  //   // Step 3: Update selectedAsset if exists
  //   const selectedAssetKey = "selectedAsset";
  //   const storedSelectedAsset = JSON.parse(
  //     localStorage.getItem(selectedAssetKey)
  //   );
  //   if (storedSelectedAsset) {
  //     if (storedSelectedAsset.department === updatedDepartment._id) {
  //       storedSelectedAsset.departmentName = updatedDepartment.departmentName;
  //       localStorage.setItem(
  //         selectedAssetKey,
  //         JSON.stringify(storedSelectedAsset)
  //       );
  //     }
  //   }
  // };

  // const updateLocalStorageItemsForAssets = async (updatedAsset) => {
  //   const storageKeys = [
  //     "allNotes",
  //     "allImages",
  //     "allVideos",
  //     "allDocuments",
  //     "allUserDocuments",
  //   ];

  //   // Step 1: Update department name in stored items
  //   const updateAssetNameInItems = (items, updatedAsset) => {
  //     return items.map((item) => {
  //       if (item.asset === updatedAsset._id) {
  //         item.assetName = updatedAsset.name;
  //       }
  //       return item;
  //     });
  //   };

  //   // Step 2: Retrieve and update items from localStorage
  //   storageKeys.forEach((key) => {
  //     const storedItems = JSON.parse(localStorage.getItem(key));
  //     if (storedItems) {
  //       const updatedItems = updateAssetNameInItems(storedItems, updatedAsset);
  //       localStorage.setItem(key, JSON.stringify(updatedItems));
  //     }
  //   });

  //   // Step 3: Update selectedAsset if exists
  //   const storedSelectedAsset = JSON.parse(
  //     localStorage.getItem("selectedAsset")
  //   );
  //   if (storedSelectedAsset) {
  //     if (storedSelectedAsset._id === updatedAsset._id) {
  //       storedSelectedAsset.name = updatedAsset.name;
  //       localStorage.setItem(
  //         "selectedAsset",
  //         JSON.stringify(storedSelectedAsset)
  //       );
  //     }
  //   }
  // };

  // Permission
  const handleUpdatePermission = (updatedPermissions) => {
    toast.success("Permissions updated");
    const newAuth = {
      ...auth,
      user: { ...auth.user, permissions: updatedPermissions },
      token: auth.token,
    };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  // Profile
  const handleUpdateProfile = (updatedInfo) => {
    const newAuth = {
      ...auth,
      user: {
        ...auth.user,
        username: updatedInfo.username,
        phone: updatedInfo.phone,
        profilePic: updatedInfo.profilePic,
      },
      token: auth.token, // Assuming token remains the same
    };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  // Conversation
  const handleNewConversationForReceiver = (newConversation) => {
    const storedConversations = localStorage.getItem("allConversations");
    if (storedConversations) {
      const sortedConversations = JSON.parse(storedConversations)
        .filter((conversation) => conversation._id !== newConversation._id)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      const updatedConversations = [newConversation, ...sortedConversations];
      // setConversations(updatedConversations);
      localStorage.setItem(
        "allConversations",
        JSON.stringify(updatedConversations)
      );
      setLocalStorageUpdation(true);
    }
  };

  const handleNewGroupConversationForReceiver = (newConversation) => {
    const storedConversations = localStorage.getItem("allConversations");
    if (storedConversations) {
      const sortedConversations = JSON.parse(storedConversations)?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      const updatedConversations = [newConversation, ...sortedConversations];
      // setConversations(updatedConversations);
      localStorage.setItem(
        "allConversations",
        JSON.stringify(updatedConversations)
      );
      setLocalStorageUpdation(true);
    }
  };

  const handleNewMessageInConversation = (conversation) => {
    const storedConversations = localStorage.getItem("allConversations");
    if (storedConversations) {
      const sortedConversations = JSON.parse(storedConversations)?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      const conversationIndex = sortedConversations.findIndex(
        (c) => c._id === conversation._id
      );
      if (conversationIndex !== -1) {
        const updatedConversationList = [...sortedConversations];
        updatedConversationList[conversationIndex] = conversation;
        localStorage.setItem(
          "allConversations",
          JSON.stringify(updatedConversationList)
        );
        // setConversations(updatedConversationList);
      } else {
        const updatedConversationList = [conversation, ...sortedConversations];
        localStorage.setItem(
          "allConversations",
          JSON.stringify(updatedConversationList)
        );
        // setConversations(updatedConversationList);
      }
      setLocalStorageUpdation(true);
    }
  };

  const handleUpdatedConversation = (updatedConversation) => {
    const storedConversations = localStorage.getItem("allConversations");
    if (storedConversations) {
      const parsedConversations = JSON.parse(storedConversations);

      const filteredConversations = parsedConversations.filter(
        (conversation) => conversation._id !== updatedConversation._id
      );
      const updatedConversationList = [
        ...filteredConversations,
        updatedConversation,
      ];
      const conversations = updatedConversationList?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      localStorage.setItem(
        "allConversations",
        JSON.stringify(conversations || {})
      );
      // setConversations(updatedConversationList);
    }
    const selectedConversation = localStorage.getItem("selectedConversation");
    if (
      selectedConversation !== null &&
      selectedConversation?._id === updatedConversation._id
    ) {
      // setSelectedConversation(updatedConversation);
      localStorage.setItem(
        "selectedConversation",
        JSON.stringify(updatedConversation || {})
      );
    }
    setLocalStorageUpdation(true);
  };

  const handleRemoveConversation = (conversationId) => {
    const storedConversations = localStorage.getItem("allConversations");
    const sortedConversations = JSON.parse(storedConversations)?.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const updatedConversations = sortedConversations.filter(
      (conversation) => conversation._id !== conversationId
    );

    localStorage.setItem(
      "allConversations",
      JSON.stringify(updatedConversations || {})
    );
    localStorage.removeItem("selectedConversation");
    localStorage.removeItem("selectedConversationMessages");
    // setConversationMessages([]);
    // setSelectedConversation();
    setLocalStorageUpdation(true);
    setConversationRemoved(true);
  };

  const handleProfileUpdationInConversation = (updatedInfo) => {
    const storedAllUsers = localStorage.getItem("allUsers");
    if (storedAllUsers) {
      const parsedAllUsers = JSON.parse(storedAllUsers);
      const allUsers = parsedAllUsers.map((user) => {
        if (user.email === updatedInfo.email) {
          return {
            ...user,
            profilePic: updatedInfo.profilePic,
          };
        }
        return user;
      });
      localStorage.setItem("allUsers", JSON.stringify(allUsers));
    }
    const storedConversations = localStorage.getItem("allConversations");
    const selectedConversation = localStorage.getItem("selectedConversation");
    const parsedSelectedConversation = JSON.parse(selectedConversation);
    if (storedConversations) {
      const parsedConversations = JSON.parse(storedConversations);
      const updatedConversations = parsedConversations.map((conversation) => {
        const updatedUsers = conversation.users.map((user) => {
          // Check if the user's email matches the updated email
          if (user.email === updatedInfo.email) {
            return {
              ...user,
              profilePic: updatedInfo.profilePic, // Update profile pic
            };
          }
          return user;
        });
        return {
          ...conversation,
          users: updatedUsers,
        };
      });
      localStorage.setItem(
        "allConversations",
        JSON.stringify(updatedConversations)
      );
      if (selectedConversation) {
        const updatedSelectedConversation = updatedConversations.find(
          (conversation) => parsedSelectedConversation?._id === conversation._id
        );
        if (updatedSelectedConversation) {
          localStorage.setItem(
            "selectedConversation",
            JSON.stringify(updatedSelectedConversation)
          );
        }
      }
    }
    setLocalStorageUpdation(true);
  };

  // Department
  const handleAddDepartment = async (department) => {
    const allDepartments = localStorage.getItem("allDepartments");
    if (allDepartments) {
      const parsedDepartments = JSON.parse(allDepartments);
      const filteredDepartments = parsedDepartments.filter(
        (d) => d._id !== department._id
      );
      const updatedDepartments = [department, ...filteredDepartments];
      const sortedDepartments = updatedDepartments.sort((a, b) =>
        a.departmentName.localeCompare(b.departmentName)
      );
      localStorage.setItem("allDepartments", JSON.stringify(sortedDepartments));
    }
    // setDepartments(sortedDepartments);
    const selectedAsset = localStorage.getItem("selectedAsset");
    if (selectedAsset) {
      const parsedSelectedAsset = JSON.parse(selectedAsset);
      parsedSelectedAsset.departmentName = department.departmentName;
      localStorage.setItem(
        "selectedAsset",
        JSON.stringify(parsedSelectedAsset)
      );
    }

    // await updateLocalStorageItemsForDepartment(department);
    // setLocalStorageUpdation(true);
  };

  const handleRemoveDepartment = (departmentId) => {
    const allDepartments = localStorage.getItem("allDepartments");
    if (allDepartments) {
      const parsedDepartments = JSON.parse(allDepartments);
      const sortedDepartments = parsedDepartments
        .filter((department) => department._id !== departmentId)
        .sort((a, b) => a.departmentName.localeCompare(b.departmentName));
      localStorage.setItem("allDepartments", JSON.stringify(sortedDepartments));
    }
    //removing the departments assets.
    const allAssets = localStorage.getItem("allAssets");
    if (allAssets) {
      const parsedAssets = JSON.parse(allAssets);
      const sortedAssets = parsedAssets
        .filter((a) => a.department !== departmentId)
        .sort((a, b) => a.departmentName.localeCompare(b.departmentName));
      localStorage.setItem("allAssets", JSON.stringify(sortedAssets));
    }
    setLocalStorageUpdation(true);
  };

  const handleNewDepartmentCreated = (newDepartment) => {
    const allDepartments = localStorage.getItem("allDepartments");
    if (allDepartments) {
      const parsedDepartments = JSON.parse(allDepartments);
      const departments = [newDepartment, ...parsedDepartments];
      const sortedDepartments = departments.sort((a, b) =>
        a.departmentName.localeCompare(b.departmentName)
      );
      localStorage.setItem("allDepartments", JSON.stringify(sortedDepartments));
    }
    setLocalStorageUpdation(true);
  };

  const handleAdminDeleteDepartment = (departmentId) => {
    const allDepartments = localStorage.getItem("allDepartments");
    if (allDepartments) {
      const parsedDepartments = JSON.parse(allDepartments);
      const sortedDepartments = parsedDepartments
        .filter((department) => department._id !== departmentId)
        .sort((a, b) => a.departmentName.localeCompare(b.departmentName));

      localStorage.setItem("allDepartments", JSON.stringify(sortedDepartments));
    }
    setLocalStorageUpdation(true);
  };

  // Asset
  const handleAssetAccess = (asset) => {
    const allAssets = localStorage.getItem("allAssets");
    if (allAssets) {
      const parsedAssets = JSON.parse(allAssets);
      const filteredAssets = parsedAssets.filter((a) => a._id !== asset._id);
      const assets = [asset, ...filteredAssets];
      const sortedAssets = assets.sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem("allAssets", JSON.stringify(sortedAssets));
    }
    setLocalStorageUpdation(true);
  };

  const handleAssetRevoked = (assetId) => {
    const allAssets = localStorage.getItem("allAssets");
    if (allAssets) {
      const parsedAssets = JSON.parse(allAssets);
      const sortedAssets = parsedAssets
        .filter((asset) => asset._id !== assetId)
        .sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem("allAssets", JSON.stringify(sortedAssets));
    }
    setLocalStorageUpdation(true);
  };

  const handleNewAssetCreated = (newAsset) => {
    const allAssets = localStorage.getItem("allAssets");
    if (allAssets) {
      const parsedAssets = JSON.parse(allAssets);
      const assets = [newAsset, ...parsedAssets];
      const sortedAssets = assets.sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem("allAssets", JSON.stringify(sortedAssets));
    }
    setLocalStorageUpdation(true);
  };

  const handleAssetUpdation = async (updatedAsset) => {
    const allAssets = localStorage.getItem("allAssets");
    if (allAssets) {
      const parsedAssets = JSON.parse(allAssets);
      const filteredDepartments = parsedAssets.filter(
        (d) => d._id !== updatedAsset._id
      );
      const updatedDepartments = [updatedAsset, ...filteredDepartments];
      const sortedDepartments = updatedDepartments.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      localStorage.setItem("allAssets", JSON.stringify(sortedDepartments));
    }
    // await updateLocalStorageItemsForAssets(updatedAsset);
    // setLocalStorageUpdation(true);
  };

  const handleUserDeleteAsset = (result) => {
    const allAssets = localStorage.getItem("allAssets");
    if (allAssets) {
      const parsedAssets = JSON.parse(allAssets);

      const modifiedAssetIndex = parsedAssets.findIndex(
        (asset) => asset._id === result.assetId
      );

      parsedAssets[modifiedAssetIndex].allowedUsers = parsedAssets[
        modifiedAssetIndex
      ].allowedUsers.filter((userId) => userId !== result.userId);

      const sortedAssets = parsedAssets.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      localStorage.setItem("allAssets", JSON.stringify(sortedAssets));
    }
    setLocalStorageUpdation(true);
  };

  const handleAdminDeleteAsset = (assetId) => {
    const allAssets = localStorage.getItem("allAssets");
    if (allAssets) {
      const parsedAssets = JSON.parse(allAssets);
      const sortedAssets = parsedAssets
        .filter((a) => a._id !== assetId)
        .sort((a, b) => a.name.localeCompare(b.name));

      localStorage.setItem("allAssets", JSON.stringify(sortedAssets));
    }
    setLocalStorageUpdation(true);
  };

  const handleAssetMaintainanceUpdate = (result) => {
    const allAssets = localStorage.getItem("allAssets");
    if (allAssets) {
      const parsedAssets = JSON.parse(allAssets);

      const modifiedAssetIndex = parsedAssets.findIndex(
        (asset) => asset._id === result.assetId
      );

      parsedAssets[modifiedAssetIndex].maintenanceJob =
        result.maintenanceRecord.maintenanceJob;
      parsedAssets[modifiedAssetIndex].maintenanceAlert =
        result.maintenanceRecord.maintenanceAlert;
      parsedAssets[modifiedAssetIndex].upcomingMaintenanceDate =
        result.maintenanceRecord.upcomingMaintenanceDate;
      parsedAssets[modifiedAssetIndex].maintenanceRecords.push(
        result.maintenanceRecord
      );

      const sortedAssets = parsedAssets.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      localStorage.setItem("allAssets", JSON.stringify(sortedAssets));
    }
    setLocalStorageUpdation(true);
  };

  useEffect(() => {
    // Permission socket
    socket?.on("permissionUpdated", handleUpdatePermission);

    // Profile socket
    socket?.on("profileUpdation", handleUpdateProfile);

    // Conversation sockets
    socket?.on("newConversationForReceiver", handleNewConversationForReceiver);
    socket?.on(
      "newGroupConversationForReceiver",
      handleNewGroupConversationForReceiver
    );
    socket?.on("newMessageInConversation", handleNewMessageInConversation);
    socket?.on("updatedConversation", handleUpdatedConversation);
    socket?.on("removeConversation", handleRemoveConversation);
    socket?.on(
      "profileUpdationInConversation",
      handleProfileUpdationInConversation
    );

    // Department sockets
    socket?.on("newDepartmentCreated", handleNewDepartmentCreated);
    socket?.on("adminDeleteDepartment", handleAdminDeleteDepartment);
    socket?.on("departmentAccessRevoked", handleRemoveDepartment);
    socket?.on("departmentAccessGranted", handleAddDepartment);
    socket?.on("departmentSharingNotification", () => {
      toast.success("Added to new department!");
    });
    socket?.on("departmentRemovalNotification", () => {
      toast.success("Department access revoked!");
    });

    // Asset sockets
    socket?.on("assetMaintainanceUpdate", handleAssetMaintainanceUpdate);
    socket?.on("adminDeleteAsset", handleAdminDeleteAsset);
    socket?.on("userDeleteAsset", handleUserDeleteAsset);
    socket?.on("assetGotUpdated", handleAssetUpdation);
    socket?.on("newAssetCreated", handleNewAssetCreated);
    socket?.on("assetAccessRevoked", handleAssetRevoked);
    socket?.on("assetAccessGranted", handleAssetAccess);
    socket?.on("assetSharingNotification", () => {
      toast.success("Asset shared with you!");
    });
    socket?.on("assetRemovalNotification", () => {
      toast.success("Asset access revoked!");
    });
    return () => {
      socket?.removeAllListeners("permissionUpdated");

      socket?.removeAllListeners("profileUpdation");

      socket?.removeAllListeners("removeConversation");
      socket?.removeAllListeners("updatedConversation");
      socket?.removeAllListeners("newMessageInConversation");
      socket?.removeAllListeners("newConversationForReceiver");
      socket?.removeAllListeners("newGroupConversationForReceiver");
      socket?.removeAllListeners("profileUpdationInConversation");

      socket?.removeAllListeners("newDepartmentCreated");
      socket?.removeAllListeners("adminDeleteDepartment");
      socket?.removeAllListeners("departmentAccessGranted");
      socket?.removeAllListeners("departmentAccessRevoked");
      socket?.removeAllListeners("departmentSharingNotification");
      socket?.removeAllListeners("departmentRemovalNotification");

      socket?.removeAllListeners("newAssetCreated");
      socket?.removeAllListeners("userDeleteAsset");
      socket?.removeAllListeners("assetGotUpdated");
      socket?.removeAllListeners("adminDeleteAsset");
      socket?.removeAllListeners("assetAccessGranted");
      socket?.removeAllListeners("assetAccessRevoked");
      socket?.removeAllListeners("assetMaintainanceUpdate");
      socket?.removeAllListeners("assetSharingNotification");
      socket?.removeAllListeners("assetRemovalNotification");
    };

    //eslint-disable-next-line
  }, [socket]);

  return (
    <SocketServiceContext.Provider
      value={[
        isLocalStorageUpdated,
        setLocalStorageUpdation,
        isConversationRemoved,
        setConversationRemoved,
      ]}
    >
      {children}
    </SocketServiceContext.Provider>
  );
};

const useSocketService = () => useContext(SocketServiceContext);

export { useSocketService, SocketServiceProvider };
