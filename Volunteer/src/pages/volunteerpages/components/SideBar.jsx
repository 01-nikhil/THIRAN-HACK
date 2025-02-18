import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChartBar, FaBox, FaMapMarkerAlt, FaUsers, FaBars, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: <FaChartBar /> },
    { name: "Orders", href: "/volunteers/orders", icon: <FaBox /> },
    { name: "Map View", href: "/volunteers/map", icon: <FaMapMarkerAlt /> },
    { name: "People", href: "/volunteers/AddPeople", icon: <FaUsers /> },
  ];

  const handleLogout = async () => {
    try {
      // Add your logout logic here
      console.log("Logging out...");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  
   return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          className="p-2 rounded-md bg-gray-200 shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex h-full w-64 flex-col bg-white shadow-lg">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <FaBox className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-lg">Oru Soru</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <span className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info and Logout */}
          <div className="border-t p-4 mt-auto space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                JD
              </div>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-gray-500">Volunteer</div>
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-102 active:scale-98"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}