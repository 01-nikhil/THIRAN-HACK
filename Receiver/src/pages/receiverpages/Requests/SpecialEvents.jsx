import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Star, Info } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReceiverSidebar from "../../../components/ReceiverSidebar";

const SpecialEvents = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/specialevents");
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events");
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white text-gray-900 flex flex-col p-6 shadow-lg">
        <ReceiverSidebar />
      </aside>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 bg-gray-100 p-6 ml-64"
      >
        <div className="mb-8">
          <motion.h2
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-blue-700 text-center"
          >
            Special Events
          </motion.h2>
        </div>

        {/* Event List */}
        {events.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-700">No events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-900"><b>
                    {event.eventName || "Unnamed Event"}</b>
                  </h2>
                </div>
                <hr className="mb-3" />
                <div className="flex items-center text-black mb-2">
                  <MapPin className="w-5 h-5 text-blue-700 mr-2" />
                  {event.location || "Unknown Location"}
                </div>
                <div className="flex items-center text-black mb-2">
                  <Clock className="w-5 h-5 text-blue-700 mr-2" />
                  {event.time || "No Time"}
                </div>
                <div className="flex items-center text-black mb-3">
                  <Calendar className="w-5 h-5 text-blue-700 mr-2" />
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "No Date Available"}
                </div>
                <div className="flex items-center text-black">
                  <Info className="w-5 h-5 text-green-600 mr-2" />
                  <span>{event.description || "No additional details"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default SpecialEvents;
