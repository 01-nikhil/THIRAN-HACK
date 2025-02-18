import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SpecialEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/specialevents");
        console.log("Fetched events:", response.data); // Debugging line
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error fetching events");
      }
    };

    // Fetch initially
    fetchEvents();

    // Fetch every second (1000ms)
    const interval = setInterval(fetchEvents, 1000);

    // Cleanup function to stop interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-6">Special Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p className="text-center text-gray-500 col-span-3">No events available</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {event.eventName || "Unnamed Event"}
              </h3>
              <p className="text-xl font-bold text-gray-900 mb-2">
                {event.location || "Unknown Location"}
              </p>
              <p className="text-md text-gray-600 mb-4">
                {event.date || "No Date"} at {event.time || "No Time"}
              </p>
              <div className="text-sm text-gray-600 flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                {event.date ? new Date(event.date).toLocaleDateString() : "No Date Available"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SpecialEvents;
