import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./auth"; // Ensure this function is correctly exported

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;