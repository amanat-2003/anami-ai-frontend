import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { SocketProvider } from "./context/socket";
import { NotificationProvider } from "./context/notification";
import { ConversationProvider } from "./context/conversation";
import { SocketServiceProvider } from "./context/socketService";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <SocketProvider>
      <NotificationProvider>
        <ConversationProvider>
          <BrowserRouter>
            <React.StrictMode>
              <SocketServiceProvider>
                <App />
              </SocketServiceProvider>
            </React.StrictMode>
          </BrowserRouter>
        </ConversationProvider>
      </NotificationProvider>
    </SocketProvider>
  </AuthProvider>
);
