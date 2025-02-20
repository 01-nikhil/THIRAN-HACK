import { useSearchParams } from "react-router-dom";
import { Card } from "../components/Card";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import axios from 'axios';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 11.0168,
  lng: 76.9558
};

const activeIcon = {
  url: "/gps.png",
  scaledSize: {
    width: 48,
    height: 52
  }
};

const inactiveIcon = {
  url: "/placeholder.png",
  scaledSize: {
    width: 48,
    height: 52
  }
};

const libraries = ["places"];

export default function MapPage() {
  const [homelessPeople, setHomelessPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchHomelessPeople = async () => {
      try {
        const response = await axios.get('http://localhost:5000/addpeople');
        const peopleWithCoordinates = response.data.map(person => ({
          ...person,
          latitude: person.location.lat,
          longitude: person.location.lng
        }));
        setHomelessPeople(peopleWithCoordinates || []);
      } catch (error) {
        console.error('Error fetching homeless people:', error);
        setHomelessPeople([]);
      }
    };

    fetchHomelessPeople();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Coimbatore Homeless People Map</h1>

      <Card className="p-0 overflow-hidden">
        <div className="h-[600px]">
          <LoadScript 
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={14}
            >
              {homelessPeople?.map((person) => (
                <Marker
                  key={person?.id || `homeless-${person?.latitude}-${person?.longitude}`}
                  position={{ 
                    lat: person?.latitude || defaultCenter.lat, 
                    lng: person?.longitude || defaultCenter.lng 
                  }}
                  title={`${person?.name || 'Unknown'}: ${person?.locationDesc || 'No details'}`}
                  icon={person?.status === 'active' ? activeIcon : inactiveIcon}
                  onClick={() => setSelectedPerson(person)}
                />
              ))}
              {selectedPerson && (
                <InfoWindow
                  position={{
                    lat: selectedPerson.latitude || defaultCenter.lat,
                    lng: selectedPerson.longitude || defaultCenter.lng
                  }}
                  onCloseClick={() => setSelectedPerson(null)}
                >
                  <div>
                    <h3 className="font-bold text-lg mb-2">{selectedPerson.name || 'Unknown'}</h3>
                    <div className="space-y-1">
                      <p><span className="font-semibold">Age:</span> {selectedPerson.age || 'Not specified'}</p>
                      <p><span className="font-semibold">Gender:</span> {selectedPerson.gender || 'Not specified'}</p>
                      <p><span className="font-semibold">Location:</span> {selectedPerson.locationDesc || 'Not specified'}</p>
                      <p><span className="font-semibold">Food Delivered:</span> {selectedPerson.foodDelivered ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </Card>
    </div>
  );
}