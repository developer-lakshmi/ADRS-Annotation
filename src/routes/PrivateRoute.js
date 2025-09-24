import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  const currentTime = new Date().getTime();

  // Redirect to login if not authenticated or token is expired
  if (!currentUser || (tokenExpiry && Number(tokenExpiry) <= currentTime)) {
    return <Navigate to="/" replace />;
  }

  // Check if the user's role is allowed
  const userRole = currentUser.role?.toLowerCase();
  const allowed = allowedRoles.map((role) => role.toLowerCase());

  if (!allowed.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
