import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // ✅ FIXED: Use BrowserRouter
import { Toaster } from 'react-hot-toast';
import './App.css';
// Receiver Pages
import ReceiverLogin from './pages/receiverpages/ReceiverLogin.jsx';
import ReceiverHomepage from './pages/receiverpages/ReceiverHomepage';
import RequestHistory from './pages/receiverpages/Requests/SpecialEvents.jsx';
import ReceiverSignup from './pages/receiverpages/ReceiverSignup.jsx';

// Sidebar
import ReceiverSidebar from './components/ReceiverSidebar.jsx';
import NewRequest from './components/NewRequest.jsx';  // ✅ FIXED: Ensure correct import (TSX to JSX)
import HelpSupport from './components/HelpSupport.jsx';
import PreRequest from './components/PreRequest.jsx';
import SpecialEvents from './pages/receiverpages/Requests/SpecialEvents.jsx';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>  {/* ✅ FIXED: Use BrowserRouter */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <ReceiverSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        {/* Main Content */}
        <div className="flex-1 p-6 bg-green-100">
          <Routes>
            <Route path="/" element={<ReceiverHomepage />} />
            <Route path="/receivers" element={<ReceiverHomepage />} />
            <Route path="/receivers/login" element={<ReceiverLogin />} />
            <Route path="/receivers/signup" element={<ReceiverSignup />} />
            <Route path="/receivers/new-request" element={<NewRequest />} />  
            <Route path="/receivers/special-event" element={<SpecialEvents />} />
            <Route path="/receivers/help" element={<HelpSupport />} />
            <Route path="/receivers/dashboard" element={<ReceiverHomepage />} />
            <Route path="/receivers/pre-request" element={<PreRequest />} />
          </Routes>

          <Toaster />
        </div>
      </div>
    </Router>
  );
};

export default App;
