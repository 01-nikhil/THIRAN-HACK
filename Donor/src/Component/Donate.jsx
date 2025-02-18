import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { connectWebSocket, sendWebSocketMessage } from "../socket";

const DonationForm = () => {
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [preparedTime, setPreparedTime] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: "", long: "" });
  const [loading, setLoading] = useState(false);

  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    connectWebSocket();
  }, []);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        () => alert("Could not get location.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availableQuantity || !preparedTime || !address || !location.lat || !location.long) {
      alert("Please fill all fields and get your location.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/donation/create",
        {
          availableQty: availableQuantity,
          preparedTime,
          address,
          currentLocation: location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      sendWebSocketMessage({ type: "donation", message: "New donation received!" });
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Donation submission failed:", error);
      alert("Failed to submit donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <button onClick={() => navigate("/")} className="text-lg font-semibold hover:text-gray-200">
            Home
          </button>
          <h1 className="text-2xl font-extrabold">Donation Form</h1>
          <div></div>
        </div>
      </header>

      <div className="flex justify-center items-center px-4 py-12">
        <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl p-10">
          <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8">Donate Now</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">Available Quantity</label>
              <input
                type="number"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                className="mt-2 p-4 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">Prepared Time</label>
              <input
                type="time"
                value={preparedTime}
                onChange={(e) => setPreparedTime(e.target.value)}
                className="mt-2 p-4 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 p-4 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">Current Location</label>
              <button
                type="button"
                onClick={handleLocation}
                className="mt-2 p-4 w-full bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
              >
                Get Current Location
              </button>
              {location.lat && location.long && (
                <p className="mt-4 text-sm text-gray-500">
                  Latitude: {location.lat}, Longitude: {location.long}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white transition duration-300 ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Donation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;