import "./App.css";

import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

import Test from "./components/Test.js";
import LoaderSkeleton from "./pages/LoaderSkeleton.js";
import FullImageViewer from "./pages/FullImageViewer.js";
import FullVideoViewer from "./pages/FullVideoViewer.js";

const Login = lazy(() => import("./pages/Login.js"));
const HelpPage = lazy(() => import("./pages/HelpPage.js"));
const HomePage = lazy(() => import("./pages/HomePage.js"));
const Register = lazy(() => import("./pages/Register.js"));
const ChatPage = lazy(() => import("./pages/ChatPage.js"));
const ChatPanel = lazy(() => import("./pages/ChatPanel.js"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.js"));
const PageNotFound = lazy(() => import("./pages/PageNotFound.js"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage.js"));
const PasswordReset = lazy(() => import("./pages/PasswordReset.js"));
const FullDocumentViewer = lazy(() => import("./pages/FullDocumentViewer.js"));
const DepartmentsPage = lazy(() => import("./pages/DepartmentsPage.js"));
const DocumentsPage = lazy(() => import("./pages/admin/DocumentsPage.js"));
const ResetCredentials = lazy(() => import("./pages/ResetCredentials.js"));
const UserVerification = lazy(() => import("./pages/UserVerification.js"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute.js"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.js"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage.js"));
const PrivateRoute = lazy(() => import("./components/routes/PrivateRoute.js"));
const CustomNoteCreate = lazy(() =>
  import("./components/customEditor/CustomNotes.js")
);
const CustomNoteUpdate = lazy(() =>
  import("./components/customEditor/CustomNoteUpdate.js")
);

function App() {
  return (
    <>
      <Toaster />
      <Suspense fallback={<LoaderSkeleton />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/verification-status/:userId"
            element={<UserVerification />}
          />
          <Route
            path="/reset-password/:userId"
            element={<ResetCredentials />}
          />
          <Route path="/test" element={<Test />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/reset-password-mail" element={<PasswordReset />} />

          <Route path="/user" element={<PrivateRoute />}>
            <Route path="/user" element={<DepartmentsPage />} />
            <Route path="/user/assets" element={<HomePage />} />
            <Route path="/user/chats" element={<ChatPanel />} />
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/chat/:assetId" element={<ChatPage />} />
            <Route path="/user/departments" element={<DepartmentsPage />} />
            <Route
              path="/user/view-file/:fileId"
              element={<FullDocumentViewer />}
            />
            <Route
              path="/user/view-image/:fileId"
              element={<FullImageViewer />}
            />
            <Route
              path="/user/view-video/:fileId"
              element={<FullVideoViewer />}
            />
            <Route path="/user/notifications" element={<NotificationsPage />} />
            <Route
              path="/user/custom/notes/create"
              element={<CustomNoteCreate />}
            />
            <Route
              path="/user/custom/notes/update/:noteId"
              element={<CustomNoteUpdate />}
            />
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/departments" element={<DepartmentsPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/chats" element={<ChatPanel />} />
            <Route path="/admin/chat/:assetId" element={<ChatPage />} />
            <Route path="/admin/assets" element={<HomePage />} />
            <Route path="/admin/documents" element={<DocumentsPage />} />
            <Route
              path="/admin/view-file/:fileId"
              element={<FullDocumentViewer />}
            />
            <Route
              path="/admin/view-image/:fileId"
              element={<FullImageViewer />}
            />
            <Route
              path="/admin/view-video/:fileId"
              element={<FullVideoViewer />}
            />
            <Route
              path="/admin/notifications"
              element={<NotificationsPage />}
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
