export const getSender = (loggedUser, users) => {
  return users[0]?.email === loggedUser?.email
    ? users[1]?.username
    : users[0]?.username;
};
export const getSenderProfilePic = (loggedUser, users) => {
  return users[0]?.email === loggedUser?.email
    ? users[1]?.profilePic || ""
    : users[0]?.profilePic || "";
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]?.email === loggedUser?.email ? users[1] : users[0];
};
