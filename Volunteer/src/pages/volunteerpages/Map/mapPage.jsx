import { useSearchParams } from "react-router-dom";
import { Card } from "../components/Card";
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

// Mock data for deliveries with Coimbatore coordinates and route details
const deliveries = [
  {
    id: 1,
    pickup: { lat: 11.0168, lng: 76.9558, name: "Annapoorna Restaurant" },
    destination: { lat: 11.0266, lng: 76.9832, name: "RS Puram Shelter" },
    status: "In Progress",
    routeColor: "#FF4444",
    waypoints: [
      { lat: 11.0200, lng: 76.9650 },
      { lat: 11.0230, lng: 76.9750 }
    ]
  },
  {
    id: 2,
    pickup: { lat: 11.0317, lng: 76.9558, name: "Hotel Sree Annapoorna" },
    destination: { lat: 11.0121, lng: 76.9675, name: "Gandhipuram Care Center" },
    status: "Pending",
    routeColor: "#4CAF50",
    waypoints: [
      { lat: 11.0250, lng: 76.9600 },
      { lat: 11.0180, lng: 76.9630 }
    ]
  },
  {
    id: 3,
    pickup: { lat: 11.0225, lng: 76.9991, name: "Kovai Kitchen" },
    destination: { lat: 11.0137, lng: 76.9635, name: "Town Hall Shelter" },
    status: "Pending",
    routeColor: "#2196F3",
    waypoints: [
      { lat: 11.0200, lng: 76.9800 },
      { lat: 11.0160, lng: 76.9700 }
    ]
  },
  {
    id: 4,
    pickup: { lat: 11.0379, lng: 76.9730, name: "Food Express" },
    destination: { lat: 11.0309, lng: 76.9849, name: "Race Course Shelter" },
    status: "In Progress",
    routeColor: "#9C27B0",
    waypoints: [
      { lat: 11.0350, lng: 76.9780 },
      { lat: 11.0320, lng: 76.9820 }
    ]
  }
];

// Homeless people locations with detailed information
const homelessLocations = [
  { 
    lat: 11.0234, 
    lng: 76.9654, 
    name: "Homeless Spot 1",
    details: "3 people, needs blankets and food",
    icon: "🔴"
  },
  { 
    lat: 11.0156, 
    lng: 76.9789, 
    name: "Homeless Spot 2",
    details: "Family of 4, needs medical attention",
    icon: "🔴"
  },
  { 
    lat: 11.0298, 
    lng: 76.9693, 
    name: "Homeless Spot 3",
    details: "2 elderly people, needs warm clothes",
    icon: "🔴"
  },
  { 
    lat: 11.0187, 
    lng: 76.9912, 
    name: "Homeless Spot 4",
    details: "5 people including children",
    icon: "🔴"
  },
  { 
    lat: 11.0345, 
    lng: 76.9588, 
    name: "Homeless Spot 5",
    details: "Single person, needs food support",
    icon: "🔴"
  },
  { 
    lat: 11.0278, 
    lng: 76.9723, 
    name: "Homeless Spot 6",
    details: "Group of 3, needs shelter",
    icon: "🔴"
  },
  { 
    lat: 11.0198, 
    lng: 76.9845, 
    name: "Homeless Spot 7",
    details: "4 people, needs basic supplies",
    icon: "🔴"
  }
];

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 11.0168,
  lng: 76.9558
};

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");

  const activeDelivery = orderId ? deliveries.find((d) => d.id === Number(orderId)) : null;
  const center = activeDelivery 
    ? { lat: activeDelivery.pickup.lat, lng: activeDelivery.pickup.lng }
    : defaultCenter;
  const displayDeliveries = activeDelivery ? [activeDelivery] : deliveries;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Coimbatore Delivery Map</h1>

      <Card className="p-0 overflow-hidden">
        <div className="h-[600px]">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
            >
              {displayDeliveries.map((delivery) => (
                <>
                  <Marker
                    key={`pickup-${delivery.id}`}
                    position={{ lat: delivery.pickup.lat, lng: delivery.pickup.lng }}
                    title={delivery.pickup.name}
                  />
                  <Marker
                    key={`destination-${delivery.id}`}
                    position={{ lat: delivery.destination.lat, lng: delivery.destination.lng }}
                    title={delivery.destination.name}
                  />
                  <Polyline
                    path={[
                      { lat: delivery.pickup.lat, lng: delivery.pickup.lng },
                      ...delivery.waypoints,
                      { lat: delivery.destination.lat, lng: delivery.destination.lng }
                    ]}
                    options={{
                      strokeColor: delivery.routeColor,
                      strokeWeight: 4,
                      strokeOpacity: 0.8,
                      geodesic: true
                    }}
                  />
                </>
              ))}
              {homelessLocations.map((location, index) => (
                <Marker
                  key={`homeless-${index}`}
                  position={{ lat: location.lat, lng: location.lng }}
                  title={`${location.name}: ${location.details}`}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </Card>
    </div>
  );
}