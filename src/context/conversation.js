import React, { createContext, useState, useContext, useEffect } from "react";
import { useSocket } from "./socket";

const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [unreadConversationCount, setUnreadConversationCount] = useState(0);
  const [socket] = useSocket();

  const increaseUnreadConversationCount = () => {
    setUnreadConversationCount((prevCount) => prevCount + 1);
  };

  const decreaseUnreadConversationCount = (count) => {
    setUnreadConversationCount((prevCount) => prevCount - count);
  };

  const resetUnreadConversationCount = () => {
    setUnreadConversationCount(0);
  };

  useEffect(() => {
    socket?.on("increaseConversationCount", () => {
      if (!window.location.href.includes("/chat")) {
        increaseUnreadConversationCount();
      }
    });
    socket?.on("makeUnreadConversationCountZero", () => {
      resetUnreadConversationCount();
    });

    return () => {
      socket?.removeAllListeners("increaseConversationCount");
      socket?.removeAllListeners("makeUnreadConversationCountZero");
    };
  }, [socket]);

  return (
    <ConversationContext.Provider
      value={[
        unreadConversationCount,
        setUnreadConversationCount,
        increaseUnreadConversationCount,
        decreaseUnreadConversationCount,
        resetUnreadConversationCount,
      ]}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// export const useConversationContext = () => useContext(ConversationContext);
export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider"
    );
  }
  return context;
};
