import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBox, FaUserCircle, FaUtensils, FaUsers, FaMapMarkerAlt, FaClock, FaPhone, FaHandHoldingHeart } from "react-icons/fa";
import { Package2,  Settings as SettingsIcon, Home as HomeIcon, Gift, Utensils } from "lucide-react";
import { UserContext } from "../context/UserContext";

const Sidebar = ({ user }) => {
  return (
    <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed left-0 top-0 h-screen w-64 bg-white text-gray-900 flex flex-col p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2"><FaBox className="h-6 w-6 text-blue-600" /><b>Oru Soru</b></h2>
        <hr className="mb-4" />
        <nav className="flex flex-col gap-4 flex-grow">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <HomeIcon size={18} /> Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/view-donations" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <Package2 size={18} /> Donations
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/special-donations" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <Gift size={18} /> Spl Donations
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/fillThePlate" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <Utensils size={18} /> Fill The Plate
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/settings" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <SettingsIcon size={18} /> Settings
            </Link>
          </motion.div>
        </nav>
        <Link to="/settings" className="mt-auto pt-4 border-t flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg">
          <FaUserCircle className="text-blue-600" size={18} />
          <p className="text-sm text-gray-600">{user?.name || "User"}</p>
        </Link>
      </motion.aside>
  );
};

const foodRequests = [
  {
    id: 1,
    name: "Community Kitchen",
    peopleWaiting: 50,
    location: { lat: 40.7128, long: -74.006 },
    postedAt: "2 hours ago",
    contact: "+91 9876543210",
  },
  {
    id: 2,
    name: "Shelter Home",
    peopleWaiting: 30,
    location: { lat: 34.0522, long: -118.2437 },
    postedAt: "5 hours ago",
    contact: "+91 9876543211",
  },
  {
    id: 3,
    name: "Elderly Assistance Center",
    peopleWaiting: 25,
    location: { lat: 51.5074, long: -0.1278 },
    postedAt: "1 hour ago",
    contact: "+91 9876543212",
  },
];

export const FillThePlate = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-grow p-8 bg-gray-50 ml-64">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-900 mb-6"
        >
          Fill The Plate
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodRequests.map((request) => (
              <motion.div
                key={request.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUtensils className="text-blue-600 text-xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 ml-3">{request.name}</h2>
                  </div>
                  <div className="text-gray-600 space-y-2">
                    <div className="flex items-center">
                      <FaUsers className="mr-2" />
                      <p>People Waiting: {request.peopleWaiting}</p>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <p>Location: {request.location.lat}, {request.location.long}</p>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      <p>Posted: {request.postedAt}</p>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      <p>Contact: {request.contact}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                  >
                    <FaHandHoldingHeart className="mr-2" />
                    Donate
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>      </main>
    </div>
  );
};