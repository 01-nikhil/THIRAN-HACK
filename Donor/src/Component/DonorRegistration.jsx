import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import GoogleMapDisplay from "./GoogleMapDisplay";
import { useNavigate } from 'react-router-dom';
const GoogleGetCurrentLocation = ({ setCoordinates }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 });

  const mapStyles = {
    height: "300px",
    width: "100%",
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter({ lat, lng });
          setCoordinates({ lat, lng });
          alert(`Latitude: ${lat}, Longitude: ${lng}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="my-4">
      <button
        type="button"
        onClick={getCurrentLocation}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Get Current Location
      </button>
      <LoadScript googleMapsApiKey="AIzaSyCyZYuKJc4YREy3ppZxlnODX_HL7sJlAbk"> 
        <GoogleMap
          mapContainerStyle={mapStyles}
          center={mapCenter}
          zoom={15}
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};



const DonorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    donorType: "",
    name: "",
    contact: "",
    email: "",
    password: "",
    aadharNumber: "",
    organizationName: "",
    restaurantName: "",
    fssaiNumber: "",
    individualAddress: "",
    orgResAddress: "",
    city: "",
    pincode: "",
    location: "",
    lat: "",
    lng: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCoordinatesUpdate = (coordinates) => {
    setFormData((prevData) => ({
      ...prevData,
      lat: coordinates.lat,
      lng: coordinates.lng,
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      // Ensure donationAmount is correctly parsed as a number if needed
      const donationData = {
        ...formData,
        donationAmount: parseFloat(formData.donationAmount), // Parse to number if it's a number field
        id: Math.random().toString(36).substr(2, 4), // Generate a unique ID
      };

      const response = await axios.post('http://localhost:5000/donors', donationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        // Assuming 201 Created status means success
        navigate('/login'); // Redirect to donor login after successful registration
      } else {
        console.error('Registration failed:', response.status, response.data);
        // Handle registration failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle network errors or other exceptions
    }
  };

  const handleBack = () => navigate('/login');
  
  return (
    <div className="bg-[#fdfdfd] min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Donor Registration
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Donor Type */}
          <div className="mb-4">
            <label className="block text-blue-700 font-medium mb-2">Donor Type</label>
            <select
              name="donorType"
              value={formData.donorType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Donor Type</option>
              <option value="Individual">Individual</option>
              <option value="Organization">Organization</option>
              <option value="Restaurant">Restaurant</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="mb-4 flex items-center gap-2">
            <FaUser className="text-blue-700" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <FaPhone className="text-blue-700" />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <FaEnvelope className="text-blue-700" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Conditional Fields */}
          {formData.donorType === "Individual" && (
            <>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="text"
                  name="individualAddress"
                  placeholder="Individual Address"
                  value={formData.individualAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="aadharNumber"
                  placeholder="Aadhar Number"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </>
          )}

          {formData.donorType === "Organization" && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="organizationName"
                  placeholder="Organization Name"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="orgResAddress"
                  placeholder="Organization Address"
                  value={formData.orgResAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </>
          )}

          {formData.donorType === "Restaurant" && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="restaurantName"
                  placeholder="Restaurant Name"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="fssaiNumber"
                  placeholder="FSSAI Number"
                  value={formData.fssaiNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </>
          )}

          {/* Common Location Fields */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Coordinates */}
          <GoogleGetCurrentLocation setCoordinates={handleCoordinatesUpdate} />
          <GoogleMapDisplay currentCoordinates={{ lat: formData.lat, lng: formData.lng }} />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="lat"
              placeholder="Latitude"
              value={formData.lat}
              readOnly
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="lng"
              placeholder="Longitude"
              value={formData.lng}
              readOnly
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 mt-4 rounded-lg hover:bg-blue-800 w-full"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
export default DonorRegistration;
