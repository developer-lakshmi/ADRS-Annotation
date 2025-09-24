import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PrivateRoute from "../src/routes/PrivateRoute";
import AppDashboard from "./Pages/AppDashboard";
import AuthLayout from "./components/layout/AuthLayout";
import Navbar from "../src/components/layout/Navbar";
import PageNotFound from "./Pages/PageNotFound";
import AppLayout from "./components/layout/AppLayout";
import MainLayout from "./components/layout/MainLayout";
import UnauthorizedAccess from "./Pages/UnauthorizedAccess";
import { BaseSnackBar, BaseModal, BaseNotification } from "./components/ui/index";
import { AuthContext } from "./context/AuthProvider";
import { hideModal } from "./redux/slices/modal/modalSlice";
import StatusLayout from "./components/layout/StatusLayout";
import DynamicAppPage from "./components/DynamicAppPage";
import DocumentViewer from "../src/apps/app001/components/DocumentViewer/DocumentViewer";
import DocumentViewerLayout from "./components/layout/DocumentViewerLayout";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const [isScroll, setIsScroll] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const modal = useSelector((state) => state.modal);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => setIsScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <div className={`App ${isDarkMode ? "dark" : ""}`}>
        <Navbar isScroll={isScroll} />
        <BaseSnackBar />
        <BaseNotification />
        {modal.isVisible && (
          <BaseModal
            message={modal.message}
            onOk={() => dispatch(hideModal())}
            onCancel={() => dispatch(hideModal())}
          />
        )}
        <div className="flex mt-[56px] relative" style={{ height: "calc(100vh - 56px)" }}>
          <Routes>
            {isAuthenticated ? (
              <>
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <Navigate to="/Home" replace />
                    </MainLayout>
                  }
                />
                <Route
                  path="/Home"
                  element={
                    <MainLayout>
                      <AppDashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/unauthorized"
                  element={
                    <StatusLayout>
                      <UnauthorizedAccess />
                    </StatusLayout>
                  }
                />
                <Route
                  path="*"
                  element={
                    <StatusLayout>
                      <PageNotFound />
                    </StatusLayout>
                  }
                />
                <Route
                  path="/app/:id/view/:docId"
                  element={
                    <PrivateRoute allowedRoles={["user", "admin", "superadmin"]}>
                      <DocumentViewerLayout>
                        <DocumentViewer />
                      </DocumentViewerLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/app/:id/dashboard/project/:projectId/view/:docId"
                  element={
                    <PrivateRoute allowedRoles={["user", "admin", "superadmin"]}>
                      <DocumentViewerLayout>
                        <DocumentViewer />
                      </DocumentViewerLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/app/:id/*"
                  element={
                    <PrivateRoute allowedRoles={["user", "admin", "superadmin"]}>
                      <AppLayout>
                        <DynamicAppPage />
                      </AppLayout>
                    </PrivateRoute>
                  }
                />
              </>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                  <div className="bg-[#fff] dark:bg-darkTheme flex-1 px-4 md:px-8 lg:px-12 py-10">
                      <AuthLayout isScroll={isScroll} />
                    </div>
                  }
                />
                <Route
                  path="*"
                  element={
                    <MainLayout>
                      <Navigate to="/" replace />
                    </MainLayout>
                  }
                />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
