const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import { useState, useEffect, useContext } from "react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/badge";
import { CheckCircle2, MapPin, Clock, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "react-hot-toast";
import { UserContext } from "../UserContext";

export const OrdersPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: ["places"],
  });
  const {donorId, setDonorId} = useContext(UserContext);
  const { volunteerId, setVolunteerId } = useContext(UserContext);
  const [activeOrders, setActiveOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [directions, setDirections] = useState(null);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [homelessAllocation, setHomelessAllocation] = useState(null);

  const postToOrders = async (orderData) => {
    try {
      const response = await axios.post('http://localhost:5000/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error posting order:', error);
      throw error;
    }
  };

  const getReverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
    return "Unknown Location";
  };
  const matchOrdersWithQuantity = (donations, requests, volunteers) => {
    let matches = [];
    let donationsInOrder = [...donations].sort((a, b) => parseInt(b.availableQty) - parseInt(a.availableQty));
    let requestsInOrder = [...requests].sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
    const targetVolunteerId = volunteers.find(v => v.id === volunteerId)?.id;
  
    // Process each request
    for (let request of requestsInOrder) {
      let remainingQuantity = parseInt(request.quantity);
      let allocations = [];
      let currentDonationIndex = 0;
  
      while (remainingQuantity > 0 && currentDonationIndex < donationsInOrder.length) {
        const donation = donationsInOrder[currentDonationIndex];
        let availableQty = parseInt(donation.availableQty);
        
        if (availableQty <= 0) {
          currentDonationIndex++;
          continue;
        }
  
        // Calculate how much to allocate from this donation
        const allocatedQty = Math.min(availableQty, remainingQuantity);
        
        allocations.push({
          donationId: donation.id,
          requestId: request.id,
          quantity: allocatedQty,
          foodName: donation.foodName,
          pickup: donation.address,
          destination: request.organizationAddress,
          currentLocation: donation.currentLocation,
          volunteerId: targetVolunteerId,
          donorId: donation.donorId,
          type: 'organization',
          orphanageName: request.orphanageName,
        });
  
        // Update remaining quantities
        remainingQuantity -= allocatedQty;
        donation.availableQty = (availableQty - allocatedQty).toString();
        
        // If this donation is fully used, move to next donation
        if (parseInt(donation.availableQty) === 0) {
          currentDonationIndex++;
        }
      }
  
      matches.push(...allocations);
    }
  
  
    donationsInOrder.forEach(donation => {
        let remainingQty = parseInt(donation.availableQty);
        if (remainingQty > 0) {
            // Create a homeless allocation order
            const homelessRequestId = `homeless-${donation.id}`;
            matches.push({
                donationId: donation.id,
                requestId: homelessRequestId,
                quantity: remainingQty,
                foodName: donation.foodName,
                pickup: donation.address,
                destination: 'Local Community Center',
                currentLocation: donation.currentLocation,
                volunteerId: targetVolunteerId,
                donorId: donation.donorId,
                type: 'people-in-need',
                orphanageName: "Local Community Center",
            });
            donation.availableQty = '0';
        }
    });
  
    return matches;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [donationsRes, requestsRes, volunteersRes] = await Promise.all([
          axios.get("http://localhost:5000/donations"),
          axios.get("http://localhost:5000/requests"),
          axios.get("http://localhost:5000/volunteers")
        ]);

        const donations = donationsRes.data || [];
        const requests = requestsRes.data || [];
        const volunteers = volunteersRes.data || [];

        const volunteerData = localStorage.getItem('volunteerData') ? 
          JSON.parse(localStorage.getItem('volunteerData')).id : null;
        setVolunteerId(volunteerData);
        
        if (!volunteerId) {
          console.warn("No volunteer ID found.");
          return;
        }

        let matchedOrders = matchOrdersWithQuantity(donations, requests, volunteers);
       // Filter activeOrders based on the current volunteer ID
       const filteredOrders = matchedOrders.filter(match => match.volunteerId === volunteerId);

       // Set activeOrders to the filtered orders
       setActiveOrders(filteredOrders);
        if (filteredOrders.length > 0) {
          calculateRoute(filteredOrders[currentOrderIndex]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders. Check API and data.");
      }
    };

    fetchOrders();
  }, [volunteerId, currentOrderIndex]);

  const handleAccept = async (orderId) => {
    try {
      const order = activeOrders.find(o => o.id === orderId);
      const [donationId, requestId] = order.id.split('-');
  
      const orderData = {
        id: orderId,
        donationId,
        requestId, 
        volunteerId,
        status: "Accepted",
        pickup: order.pickup,
        destination: order.destination,
        quantity: order.quantity,
        items: order.items,
        eta: order.eta,
        distance: order.distance
      };
  
      await postToOrders(orderData);
  
      await Promise.all([
        axios.patch(`http://localhost:5000/donations/${donationId}`, { 
          availableQty: 0,
          status: "Accepted" 
        }),
          !requestId.startsWith('homeless-')&& axios.patch(`http://localhost:5000/requests/${requestId}`, { 
          status: "Accepted" 
        })
      ]);
  
      setActiveOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === orderId ? { ...o, status: "Accepted" } : o
        )
      );
      
      toast.success("Order Accepted!");
        setCurrentOrderIndex(0);
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Failed to accept order.");
    }
  };

  const handleDecline = async (orderId) => {
    try {
      setActiveOrders(prevOrders => {
        const newOrders = prevOrders.filter(o => o.id !== orderId);
        if (newOrders.length > 0) {
          calculateRoute(newOrders[0]);
        }
        return newOrders;
      });
      setCurrentOrderIndex(0);
      toast.success("Order declined. Showing next delivery.");
    } catch (error) {
      console.error("Error declining order:", error);
      toast.error("Failed to decline order.");
    }
  };

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`,
        { timeout: 5000 }
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].geometry.location;
      }
      return { lat: 0, lng: 0 };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return { lat: 0, lng: 0 };
    }
  };

  const calculateRoute = (order) => {
    if (!order?.pickupCoords || !order?.destinationCoords) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: order.pickupCoords,
        destination: order.destinationCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const route = result.routes[0].legs[0];
          setActiveOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.id === order.id
                ? { ...o, eta: route.duration.text, distance: route.distance.text }
                : o
            )
          );
        }
      }
    );
  };

    const currentOrder = activeOrders[currentOrderIndex];
    const homelessOrder = activeOrders.find(order => order.type === 'people-in-need');
    console.log("homelessOrder", homelessOrder);
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Active Orders</h1>

            {/* Homeless Delivery Card */}
            {homelessOrder && (
                <Card key={homelessOrder.id} className="mb-4">
                    <CardHeader>
                        <CardTitle>
                            Delivery to Local Community Center ({homelessOrder.quantity} items)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium mb-2">
                            Food Items: {homelessOrder.items}
                        </p>
                        <p className="text-sm mb-2">
                            <MapPin className="inline-block h-4 w-4 mr-1" />
                            Pickup Location: {homelessOrder.pickup}
                        </p>
                        <p className="text-sm mb-2">
                            <MapPin className="inline-block h-4 w-4 mr-1" />
                            Delivery Address: {homelessOrder.destination}
                        </p>
                        <p className="text-sm">
                            <Clock className="inline-block h-4 w-4 mr-1" />
                            Expected Delivery Time: {homelessOrder.eta}
                        </p>
                        <p className="text-sm">
                            <MapPin className="inline-block h-4 w-4 mr-1" />
                            Distance: {homelessOrder.distance}
                        </p>
                        <Badge className="mt-2 bg-yellow-300">{homelessOrder.status}</Badge>

                        {isLoaded && homelessOrder.pickupCoords && homelessOrder.destinationCoords && (
                            <div className="mt-4 h-40">
                                <GoogleMap
                                    mapContainerStyle={{width: '100%', height: '100%'}}
                                    center={homelessOrder.pickupCoords}
                                    zoom={12}
                                >
                                    <Marker
                                        position={homelessOrder.pickupCoords}
                                        label="Pickup"
                                        icon={{
                                            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                        }}
                                    />
                                    <Marker
                                        position={homelessOrder.destinationCoords}
                                        label="Delivery"
                                        icon={{
                                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                        }}
                                    />
                                    {directions && (
                                        <DirectionsRenderer
                                            directions={directions}
                                            options={{suppressMarkers: true}}
                                        />
                                    )}
                                </GoogleMap>
                            </div>
                        )}

                        {homelessOrder.status === "Pending" && (
                            <div className="flex gap-2 mt-4">
                                <Button
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 color-white"
                                    onClick={() => handleAccept(homelessOrder.id)}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4"/> Accept
                                </Button>
                                <Button
                                    className="flex-1 bg-red-400 hover:bg-red-600 color-white"
                                    onClick={() => handleDecline(homelessOrder.id)}
                                >
                                    <XCircle className="mr-2 h-4 w-4"/> Decline
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Organization Delivery Card */}
            {activeOrders.length === 0 ? (
                <p>No active orders found.</p>
            ) : currentOrder && currentOrder.type !== 'people-in-need' ? (
                <Card key={currentOrder?.id}>
                    <CardHeader>
                        <CardTitle>
                            {currentOrder?.orphanageName} ({currentOrder?.quantity} items)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium mb-2">
                            Food Items: {currentOrder?.items}
                        </p>

                        <p className="text-sm mb-2">
                            <MapPin className="inline-block h-4 w-4 mr-1"/>
                            Pickup Location: {currentOrder?.pickup}
                        </p>

                        <p className="text-sm mb-2">
                            <MapPin className="inline-block h-4 w-4 mr-1"/>
                            Delivery Address: {currentOrder?.destination}
                        </p>

                        <p className="text-sm">
                            <Clock className="inline-block h-4 w-4 mr-1"/>
                            Expected Delivery Time: {currentOrder?.eta}
                        </p>

                        <p className="text-sm">
                            <MapPin className="inline-block h-4 w-4 mr-1"/>
                            Distance: {currentOrder?.distance}
                        </p>

                        <Badge className="mt-2 bg-yellow-300">{currentOrder?.status}</Badge>

                        {isLoaded && currentOrder?.pickupCoords && currentOrder?.destinationCoords && (
                            <div className="mt-4 h-40">
                                <GoogleMap
                                    mapContainerStyle={{width: '100%', height: '100%'}}
                                    center={currentOrder?.pickupCoords}
                                    zoom={12}
                                >
                                    <Marker
                                        position={currentOrder?.pickupCoords}
                                        label="Pickup"
                                        icon={{
                                            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                        }}
                                    />
                                    <Marker
                                        position={currentOrder?.destinationCoords}
                                        label="Delivery"
                                        icon={{
                                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                        }}
                                    />
                                    {directions && (
                                        <DirectionsRenderer
                                            directions={directions}
                                            options={{suppressMarkers: true}}
                                        />
                                    )}
                                </GoogleMap>
                            </div>
                        )}

                        {currentOrder?.status === "Pending" && (
                            <div className="flex gap-2 mt-4">
                                <Button
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 color-white"
                                    onClick={() => handleAccept(currentOrder?.id)}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4"/> Accept
                                </Button>
                                <Button
                                    className="flex-1 bg-red-400 hover:bg-red-600 color-white"
                                    onClick={() => handleDecline(currentOrder?.id)}
                                >
                                    <XCircle className="mr-2 h-4 w-4"/> Decline
                                </Button>
                            </div>
                        )}
                    </CardContent>

                </Card>
            ) : (
                <p>No active orders found.</p>
            )}
        </div>
    );
};

export default OrdersPage;
