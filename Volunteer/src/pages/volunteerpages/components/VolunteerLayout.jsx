import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useVolunteerStore } from "../../../store/useVolunteerStore";
import Sidebar from "./SideBar";

const VolunteerLayout = ({ children }) => {
  const { volunteer } = useVolunteerStore();
  const location = useLocation();

  // Redirect if not logged in
  if (!volunteer && location.pathname !== "/login" && location.pathname !== "/volunteers/signup") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      {volunteer && <Sidebar />}
      <div className={`flex-1 p-4 ${volunteer ? "ml-64" : ""}`}>{children}</div>
    </div>
  );
};

export default VolunteerLayout;
