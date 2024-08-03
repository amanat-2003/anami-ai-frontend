import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.js";

import {
  Box,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const GroupInfoDialog = (props) => {
  const {
    allUsers,
    leaveGroup,
    handleLogout,
    isDialogOpen,
    handleDialogClose,
    selectedConversation,
    handleClearConversation,
    handleDeleteConversation,
  } = props;

  const [auth] = useAuth();
  const [groupName, setGroupName] = useState("");
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    setGroupName(selectedConversation.groupName);
    setGroupList(
      allUsers.filter((user) =>
        selectedConversation?.userIds?.includes(user._id)
      )
    );
    // eslint-disable-next-line
  }, [selectedConversation]);

  function areListsEqual(list1, list2) {
    // If lengths are different, lists are not equal
    if (list1.length !== list2.length) {
      return false;
    }

    // Sort both lists before comparing to ensure order doesn't affect the comparison
    const sortedList1 = list1.sort();
    const sortedList2 = list2.sort();

    // Compare each element in both lists
    for (let i = 0; i < sortedList1.length; i++) {
      if (sortedList1[i] !== sortedList2[i]) {
        return false;
      }
    }

    // If no differences found, lists are equal
    return true;
  }

  const handlUpdateGroup = async () => {
    try {
      if (
        selectedConversation.groupName !== groupName ||
        !areListsEqual(groupList, selectedConversation?.users)
      ) {
        await axios.post(
          `${process.env.REACT_APP_API}/api/v1/conversation/update-conversation`,
          {
            userId: auth?.user._id,
            groupList: groupList,
            groupName: groupName,
            groupId: selectedConversation?._id,
          }
        );
      } else {
        toast.error("No change Found");
        return;
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

  const handleOptionSelect = (options) => {
    const fixedOption = allUsers.find(
      (user) => user.email === auth?.user?.email
    );
    const filteredOptions = options?.filter(
      (user) => user.email !== auth?.user?.email
    );
    const selectedOptions = [fixedOption, ...filteredOptions];

    setGroupList(selectedOptions);
  };

  return (
    <>
      <Dialog
        onClose={() => {
          handleDialogClose();
          setGroupList(selectedConversation?.users);
          setGroupName(selectedConversation.groupName);
        }}
        open={isDialogOpen}
      >
        <DialogTitle>{selectedConversation.groupName}</DialogTitle>

        <DialogContent style={{ display: "flex", flexDirection: "column" }}>
          {auth.user?._id === selectedConversation.groupAdmin && (
            <TextField
              label="Group Name"
              value={groupName}
              variant="outlined"
              onChange={(e) => setGroupName(e.target.value)}
              sx={{ marginTop: "10px" }}
            />
          )}
          <Box
            sx={{
              marginTop: "10px",
              width: "400px",
              display: "flex",
              gap: "5px",
              flexDirection: "column",
            }}
          >
            <Autocomplete
              multiple
              options={allUsers}
              disableCloseOnSelect
              disabled={auth.user._id !== selectedConversation.groupAdmin}
              getOptionLabel={(option) => option?.username}
              onChange={(event, value) => handleOptionSelect(value)}
              value={groupList}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    disabled={option?._id === auth?.user._id}
                  />
                  {option?.username}
                </li>
              )}
              style={{
                marginTop: "20px",
              }}
              renderInput={(params) => (
                <TextField {...params} label="Group Members" />
              )}
            />
            <div style={{ margin: "15px 5px 0 0 ", padding: "5px" }}>
              Created At:{" "}
              {new Date(selectedConversation?.createdAt).toLocaleDateString(
                "en-US",
                {
                  hour12: false,
                }
              )}
            </div>
          </Box>
        </DialogContent>

        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          {auth.user?._id !== selectedConversation.groupAdmin ? (
            <Button
              onClick={() => {
                handleDialogClose();
                leaveGroup();
              }}
            >
              Leave Group
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  handleClearConversation();
                  handleDialogClose();
                }}
              >
                Clear chat
              </Button>
              {selectedConversation?.userIds?.length === 1 ? (
                <Button
                  onClick={() => {
                    handleDialogClose();
                    handleDeleteConversation();
                  }}
                >
                  Delete Group
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleDialogClose();
                    leaveGroup();
                  }}
                >
                  Leave Group
                </Button>
              )}

              <Button
                onClick={() => {
                  handlUpdateGroup();
                  handleDialogClose();
                }}
              >
                Update group{" "}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupInfoDialog;
