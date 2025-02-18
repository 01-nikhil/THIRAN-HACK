
import React from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import {Home} from "./Component/Home";
import SettingsPage from "./Component/SettingsPage";
import DonorLogin from "./Component/DonateLogin";
import DonorRegistration from "./Component/DonorRegistration";
import ProtectedRoute from "./ProtectedRoute"; // Correct import for default export
import { SpecialDonations } from "./Component/splDonation";
import { FillThePlate } from "./Component/fillThePlate";
import TestLoginPage from "./Component/testLogin";
import DonationForm, { ViewDonations } from "./Component/ViewDonations";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/registration" element={<DonorRegistration/>} />
          <Route path="/login" element={<DonorLogin />} />
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/special-donations" element={<SpecialDonations/>} />
            <Route path="fillThePlate" element={<FillThePlate/>} />
            {/* <Route path="/donate" element={<DonationForm /> } /> */}
            <Route path="/view-donations" element={<ViewDonations />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/test" element={<TestLoginPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
