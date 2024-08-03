import React, { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useAuth } from "./auth";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [auth] = useAuth();

  useEffect(() => {
    if (auth?.user) {
      const newSocket = io(`${process.env.REACT_APP_SOCKET_API}`, {
        query: {
          userId: auth.user._id,
        },
      });
      setSocket(newSocket);

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line
  }, [auth?.user]);

  return (
    <SocketContext.Provider value={[socket, setSocket]}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);

export { useSocket, SocketProvider };
