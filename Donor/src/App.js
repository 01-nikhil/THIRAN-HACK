import React from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
import {Home} from "./Component/Home";
import SettingsPage from "./Component/SettingsPage";
import DonorLogin from "./Component/DonateLogin";
import DonorRegistration from "./Component/DonorRegistration";
import ProtectedRoute from "./ProtectedRoute"; // Correct import for default export
import { SpecialDonations } from "./Component/splDonation";
import { FillThePlate } from "./Component/fillThePlate";
import TestLoginPage from "./Component/testLogin";
import DonationForm, { ViewDonations } from "./Component/ViewDonations";
import ChatWidget from "./Component/chatbot";
import { UserProvider } from "./Component/useContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ChatWidget/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<DonorRegistration />} />
          <Route path="/login" element={<DonorLogin />} />
          <Route path="/special-donations" element={<SpecialDonations />} />
          <Route path="/fillThePlate" element={<FillThePlate />} />
          <Route path="/view-donations" element={<ViewDonations />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/test" element={<TestLoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;