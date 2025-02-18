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

const redPinIcon = {
  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
};

const libraries = ["places"];

export default function MapPage() {
  const [homelessPeople, setHomelessPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchHomelessPeople = async () => {
      try {
        const response = await axios.get('http://localhost:5000/addpeople');
        setHomelessPeople(response.data || []);
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
                    lat: parseFloat(person?.latitude) || defaultCenter.lat, 
                    lng: parseFloat(person?.longitude) || defaultCenter.lng 
                  }}
                  title={`${person?.name || 'Unknown'}: ${person?.details || 'No details'}`}
                  icon={redPinIcon}
                  onClick={() => setSelectedPerson(person)}
                />
              ))}
              {selectedPerson && (
                <InfoWindow
                  position={{
                    lat: parseFloat(selectedPerson.latitude) || defaultCenter.lat,
                    lng: parseFloat(selectedPerson.longitude) || defaultCenter.lng
                  }}
                  onCloseClick={() => setSelectedPerson(null)}
                >
                  <div>
                    <h3 className="font-bold text-lg mb-2">{selectedPerson.name || 'Unknown'}</h3>
                    <div className="space-y-1">
                      <p><span className="font-semibold">Age:</span> {selectedPerson.age || 'Not specified'}</p>
                      <p><span className="font-semibold">Gender:</span> {selectedPerson.gender || 'Not specified'}</p>
                      <p><span className="font-semibold">Location:</span> {selectedPerson.location || 'Not specified'}</p>
                      <p><span className="font-semibold">Details:</span> {selectedPerson.details || 'No details'}</p>
                      <p><span className="font-semibold">Health Status:</span> {selectedPerson.healthStatus || 'Not specified'}</p>
                      <p><span className="font-semibold">Contact:</span> {selectedPerson.contact || 'Not specified'}</p>
                      <p><span className="font-semibold">Last Updated:</span> {selectedPerson.lastUpdated || 'Not specified'}</p>
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