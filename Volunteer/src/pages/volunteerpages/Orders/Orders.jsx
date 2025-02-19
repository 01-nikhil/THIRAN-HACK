const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import { useState, useEffect } from "react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/badge";
import { CheckCircle2, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "react-hot-toast";

export const OrdersPage = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_API_KEY,
        libraries: ["places"],
    });

    const [activeOrders, setActiveOrders] = useState([]);
    const [directions, setDirections] = useState(null);
    const [currentVolunteerId, setCurrentVolunteerId] = useState(null);

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
        let sortedDonations = [...donations].sort((a, b) => parseInt(b.availableQty) - parseInt(a.availableQty));
        let sortedRequests = [...requests].sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));

        const usedDonationIds = new Set();  // track donation ids

        for (let request of sortedRequests) {
            let remainingQuantity = parseInt(request.quantity);

            for (let i = 0; i < sortedDonations.length; i++) {
                const donation = sortedDonations[i];

                if (remainingQuantity <= 0) break; // Request fulfilled
                if (usedDonationIds.has(donation.id)) continue; //Skip used donation.

                let availableQty = parseInt(donation.availableQty);
                if (availableQty <= 0) continue; // Skip empty donation

                const targetVolunteerId = volunteers[i % volunteers.length]?.id;

                const allocatedQty = Math.min(availableQty, remainingQuantity);

                matches.push({
                    donationId: donation.id,
                    requestId: request.id,
                    quantity: allocatedQty,
                    foodName: donation.foodName,
                    pickup: donation.address,
                    destination: request.organizationAddress,
                    currentLocation: donation.currentLocation,
                    volunteerId: targetVolunteerId,
                });

                remainingQuantity -= allocatedQty;
                donation.availableQty = (availableQty - allocatedQty).toString();  //Important: update donation qty
                usedDonationIds.add(donation.id);

                if (remainingQuantity === 0) break; // Request fully fulfilled
            }
        }

        // Remaining donations for people in need
        sortedDonations.forEach((donation, index) => {
            if (!usedDonationIds.has(donation.id)) {
                let remainingQty = parseInt(donation.availableQty);
                if (remainingQty > 0) {
                    const targetVolunteerId = volunteers[index % volunteers.length]?.id;
                    matches.push({
                        donationId: donation.id,
                        requestId: 'homeless',
                        quantity: remainingQty,
                        foodName: donation.foodName,
                        pickup: donation.address,
                        destination: 'Local Homeless Shelter',
                        currentLocation: donation.currentLocation,
                        volunteerId: targetVolunteerId,
                    });
                    usedDonationIds.add(donation.id);
                }
            }
        });
        return matches.filter(match => match.volunteerId === currentVolunteerId);
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

                const volunteerId = localStorage.getItem('volunteerData') ? JSON.parse(localStorage.getItem('volunteerData')).id : null;
                setCurrentVolunteerId(volunteerId);

                if (!volunteerId) {
                    console.warn("No volunteer ID found.");
                    return;
                }

                let matchedOrders = matchOrdersWithQuantity(donations, requests, volunteers);
                matchedOrders = matchedOrders.filter(match => match.volunteerId === volunteerId);

                const orders = await Promise.all(
                    matchedOrders.map(async (match) => {
                        const pickupAddress = match.pickup;
                        const destinationAddress = match.destination;

                        let currentLocationAddress = "Unknown Location";
                        try {
                            if (match.currentLocation) {
                                currentLocationAddress = await getReverseGeocode(
                                    match.currentLocation.lat,
                                    match.currentLocation.long
                                );
                            }
                        } catch (error) {
                            console.error("Error getting current location:", error);
                        }

                        let pickupCoords = { lat: 0, lng: 0 };
                        let destinationCoords = { lat: 0, lng: 0 };

                        try {
                            pickupCoords = await getCoordinates(pickupAddress);
                            destinationCoords = await getCoordinates(destinationAddress);
                        } catch (error) {
                            console.error("Error getting coordinates:", error);
                            toast.error("Geocoding failed. Check API key and address format.");
                        }

                        return {
                            id: `${match.donationId}-${match.requestId}`,
                            pickup: pickupAddress,
                            destination: destinationAddress,
                            currentLocation: currentLocationAddress,
                            pickupCoords,
                            destinationCoords,
                            status: "Pending",
                            eta: "Calculating...",
                            distance: "Calculating...",
                            quantity: match.quantity,
                            requestId: match.requestId,
                            items: match.foodName,
                            volunteerId: match.volunteerId
                        };
                    })
                );

                setActiveOrders(orders);

                // Post orders only once when the component mounts
                if (orders.length > 0) {
                  await axios.post("http://localhost:5000/orders", orders);
                }

                if (orders.length > 0) calculateRoute(orders[0]);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to fetch orders. Check API and data.");
            }
        };

        fetchOrders();
    }, []); // Removed currentVolunteerId from dependency array

    const getCoordinates = async (address) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`,
                { timeout: 5000 }
            );
            if (response.data.results.length > 0) {
                return response.data.results[0].geometry.location;
            } else {
                console.warn("Geocoding failed for address:", address);
                return { lat: 0, lng: 0 };
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            toast.error("Geocoding failed. Check API key/address.");
            return { lat: 0, lng: 0 };
        }
    };

    const calculateRoute = (order) => {
        if (!order.pickupCoords || !order.destinationCoords) return;

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
                } else {
                    console.error("Directions request failed:", status);
                    toast.error("Directions calculation failed.");
                }
            }
        );
    };

    const handleAccept = async (orderId) => {
        try {
            const order = activeOrders.find(o => o.id === orderId);
            const [donationId, requestId] = order.id.split('-');

            await Promise.all([
                axios.patch(`http://localhost:5000/donations/${donationId}`, { availableQty: 0 }),
                axios.patch(`http://localhost:5000/requests/${requestId}`, { status: "Accepted" })
            ]);

            // Update the status of the accepted order in the local state
            setActiveOrders(prevOrders =>
                prevOrders.map(o =>
                    o.id === orderId ? { ...o, status: "Accepted" } : o
                )
            );
            toast.success("Order Accepted!");
        } catch (error) {
            console.error("Error accepting order:", error);
            toast.error("Failed to accept order.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Active Orders</h1>
            {activeOrders.length === 0 ? (
                <p>No active orders found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeOrders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader>
                                <CardTitle>{order.items} ({order.quantity} items)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    <MapPin className="inline-block h-4 w-4 mr-1" /> Pickup: {order.pickup}
                                </p>
                                <p className="text-sm">
                                    <MapPin className="inline-block h-4 w-4 mr-1" /> Destination: {order.destination}
                                </p>
                                <p className="text-sm">
                                    <MapPin className="inline-block h-4 w-4 mr-1" /> Current Location: {order.currentLocation}
                                </p>
                                <p className="text-sm">
                                    <Clock className="inline-block h-4 w-4 mr-1" /> ETA: {order.eta}
                                </p>
                                <p className="text-sm">
                                    <MapPin className="inline-block h-4 w-4 mr-1" /> Distance: {order.distance}
                                </p>
                                <Badge className="mt-2">{order.quantity} items</Badge>
                                <Badge className="ml-2 mt-2">{order.status}</Badge>

                                {isLoaded && order.pickupCoords && order.destinationCoords && (
                                    <div className="mt-4 h-40">
                                        <GoogleMap
                                            mapContainerStyle={{ width: '100%', height: '100%' }}
                                            center={order.pickupCoords}
                                            zoom={12}
                                        >
                                            <Marker position={order.pickupCoords} label="Pickup" />
                                            <Marker position={order.destinationCoords} label="Destination" />
                                            {directions && (
                                                <DirectionsRenderer
                                                    directions={directions}
                                                    options={{ suppressMarkers: true }}
                                                />
                                            )}
                                        </GoogleMap>
                                    </div>
                                )}

                                {order.status === "Pending" && (
                                    <Button
                                        className="mt-4"
                                        onClick={() => handleAccept(order.id)}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Accept Order
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
