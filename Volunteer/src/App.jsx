import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import VolunteerLogin from "./pages/volunteerpages/VolunteerLogin";
import VolunteerSignUp from "./pages/volunteerpages/VolunteerSignup";
import VolunteerHomepage from "./pages/volunteerpages/VolunteerHomepage";
import Sidebar from "./pages/volunteerpages/components/SideBar";
import Orders from "./pages/volunteerpages/Orders/orders";
import MapPage from "./pages/volunteerpages/Map/mapPage";
import AddPeople from "./pages/volunteerpages/People/AddPeople";
import VolunteerLayout from "./pages/volunteerpages/components/VolunteerLayout"; 

const App = () => {
  return (
    <>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<VolunteerLogin />} />
        <Route path="/volunteers/signup" element={<VolunteerSignUp />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/*"
          element={
            <VolunteerLayout>
              <Routes>
                <Route path="/" element={<VolunteerHomepage />} />
                <Route path="/volunteers/AddPeople" element={<AddPeople />} />
                <Route path="/volunteers/Orders" element={<Orders />} />
                <Route path="/volunteers/map" element={<MapPage />} />
                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </VolunteerLayout>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;