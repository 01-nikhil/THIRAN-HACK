"use client"

import { useState } from "react"
import { Button } from "../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import { Badge } from "../components/badge"
import { CheckCircle2, MapPin, Clock} from "lucide-react"
import { Link } from "react-router-dom"

// Mock data
const orders = [
  {
    id: 1,
    pickup: "Joe's Restaurant",
    destination: "Hope Children's Home",
    status: "Pending",
    eta: "15 mins",
    distance: "2.5 km",
    items: "20 meals",
  },
  {
    id: 2,
    pickup: "Fresh Foods Market",
    destination: "Senior Care Center",
    status: "In Progress",
    eta: "10 mins",
    distance: "1.8 km",
    items: "15 food packages",
  },
  {
    id: 3,
    pickup: "Daily Bread Bakery",
    destination: "Community Center",
    status: "Delivered",
    eta: "Completed",
    distance: "3.2 km",
    items: "30 bread loaves",
  },
  {
    id: 4,
    pickup: "Daily Bread Bakery",
    destination: "Community Center",
    status: "Delivered",
    eta: "Completed",
    distance: "3.2 km",
    items: "30 bread loaves",
  },
]

export default function OrdersPage() {
  const [activeOrders, setActiveOrders] = useState(orders)

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleMarkComplete = (orderId) => {
    setActiveOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: "Delivered", eta: "Completed" } : order)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrders.map((order) => (
          <Card key={order.id} className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Order #{order.id}</CardTitle>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Pickup Location</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{order.pickup}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Destination</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>{order.destination}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">ETA</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>{order.eta}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Items</div>
                  <div>{order.items}</div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Link href={`/map?order=${order.id}`}>
                    <Button variant="outline">
                      View on Map
                      <MapPin className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  {order.status !== "Delivered" && (
                    <Button variant="default" className="bg-green-500 hover:bg-green-600" onClick={() => handleMarkComplete(order.id)}>
                      Mark Complete
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
