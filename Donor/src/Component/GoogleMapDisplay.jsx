import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Google Maps container style
const mapContainerStyle = {
  width: "100%",
  height: "300px",
  marginBottom: "1rem",
};

const GoogleMapDisplay = ({ currentCoordinates }) => {
  const [center, setCenter] = useState({
    lat: 11.0168, // Default to Coimbatore
    lng: 76.9558,
  });

  useEffect(() => {
    if (currentCoordinates) {
      setCenter({
        lat: currentCoordinates.lat,
        lng: currentCoordinates.lng,
      });
    }
  }, [currentCoordinates]);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15} // Adjust the zoom level as needed
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapDisplay;
