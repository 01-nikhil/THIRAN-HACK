"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function Map({ deliveries, center = [51.505, -0.09], zoom = 13 }) {
  const mapRef = useRef(null)
  const routesRef = useRef([])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Initialize map
    mapRef.current = L.map("map").setView(center, zoom)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current)

    // Add markers and routes for each delivery
    deliveries.forEach((delivery) => {
      // Pickup marker
      L.marker([delivery.pickup.lat, delivery.pickup.lng])
        .bindPopup(`Pickup: ${delivery.pickup.name}`)
        .addTo(mapRef.current)

      // Destination marker
      L.marker([delivery.destination.lat, delivery.destination.lng])
        .bindPopup(`Destination: ${delivery.destination.name}`)
        .addTo(mapRef.current)

      // Draw route
      const route = L.polyline(
        [
          [delivery.pickup.lat, delivery.pickup.lng],
          [delivery.destination.lat, delivery.destination.lng],
        ],
        {
          color: delivery.status === "In Progress" ? "#2563eb" : "#9ca3af",
          weight: 3,
          opacity: 0.8,
          dashArray: delivery.status === "Pending" ? "5, 10" : undefined,
        },
      ).addTo(mapRef.current)

      routesRef.current.push(route)
    })

    return () => {
      mapRef.current?.remove()
      routesRef.current = []
    }
  }, [center, zoom, deliveries])

  return <div id="map" className="h-full w-full" />
}

