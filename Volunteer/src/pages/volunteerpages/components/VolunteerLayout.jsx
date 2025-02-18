import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";

const VolunteerLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 ml-64">{children}</div>
    </div>
  );
};

export default VolunteerLayout;