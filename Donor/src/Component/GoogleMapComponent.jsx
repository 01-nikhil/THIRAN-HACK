// GoogleMapComponent.js
import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const GoogleMapComponent = ({ onLocationChange }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [geolocationError, setGeolocationError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLocation);
          setMarkerPosition(userLocation);
          try {
            const address = await fetchAddress(userLocation.lat, userLocation.lng);
            onLocationChange(userLocation, address);
            setGeolocationError(null);
          } catch (error) {
            console.error("Error fetching address:", error);
            setGeolocationError("Error fetching address");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setGeolocationError(
            "Could not fetch location. Please ensure location services are enabled and refresh the page."
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    } else {
      setGeolocationError("Geolocation is not supported by your browser.");
      alert("Geolocation is not supported by your browser.");
    }
  }, [onLocationChange]);

  const handleMapClick = async (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newLocation);
    setMapCenter(newLocation);
    try {
      const address = await fetchAddress(newLocation.lat, newLocation.lng);
      onLocationChange(newLocation, address);
      setGeolocationError(null);
    } catch (error) {
      console.error("Error fetching address:", error);
      setGeolocationError("Error fetching address");
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "Address not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

  return (
    <>
      {geolocationError && <p className="text-red-500 mt-2">Error: {geolocationError}</p>}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
        onClick={handleMapClick}
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </>
  );
};

export default GoogleMapComponent;