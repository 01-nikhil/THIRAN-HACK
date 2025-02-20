// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import VolunteerLogin from "./pages/volunteerpages/VolunteerLogin";
import VolunteerSignUp from "./pages/volunteerpages/VolunteerSignup";
import Sidebar from "./pages/volunteerpages/components/SideBar";
import MapPage from "./pages/volunteerpages/Map/mapPage";
import AddPeople from "./pages/volunteerpages/People/AddPeople";
import { OrdersPage } from "./pages/volunteerpages/Orders/Orders";
import VolunteerHomePage from "./pages/volunteerpages/VolunteerHomepage";

const App = () => {
    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4 ml-64">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/volunteers/login" element={<VolunteerLogin />} />
                        <Route path="/volunteers/signup" element={<VolunteerSignUp />} />

                        {/* Protected Routes */}
                        <Route path="/" element={<VolunteerHomePage/>} />
                        <Route path="/volunteers/orders" element={<OrdersPage />} />
                        <Route path="/volunteers/map" element={<MapPage />} />
                        <Route path="/volunteers/AddPeople" element={<AddPeople />} />

                        {/* Catch-all Route (must be last) */}
                        {/* <Route path="*" element={<VolunteerHomePage />} /> */}
                    </Routes>
                </div>
            </div>
            <Toaster />
        </>
    );
};

export default App;
