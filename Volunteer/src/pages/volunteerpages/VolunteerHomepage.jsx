import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/Card";
import { Package2, Users2, CheckCircle2, Clock, Calendar } from "lucide-react";
import SideBar from "./components/SideBar";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Switch } from "@mui/material";
import { useState } from "react";
import { useVolunteerStore } from "../../store/useVolunteerStore";
import { connectWebSocket, sendWebSocketMessage } from "../../socket";
import toast from "react-hot-toast";
import axios from "axios";

export default function VolunteerHomePage() {
  const { createEvent } = useVolunteerStore();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    date: "",
    time: "",
    eventImage: null,
  });

  useEffect(() => {
    connectWebSocket();
  }, []);

  // Open dialog
  const handleClickOpen = () => setOpen(true);
  // Close dialog
  const handleClose = () => setOpen(false);

  // Handle active switch change
  const handleActiveClick = () => {
    setActive(!active);
    const volunteerData = { type: "volunteer", message: "Volunteer status changed!", status: !active };
    sendWebSocketMessage(volunteerData);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    console.log("File selected:", e.target.files[0]);
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, eventImage: file }));
    console.log("File selected:", e.target.files[0]);
  };

  // Handle form submission

const handleSubmit = async (e) => {
  e.preventDefault();

  const eventData = {
    eventName: formData.eventName,
    location: formData.location,
    date: formData.date,
    time: formData.time,
    eventImage:null, // Store image name (JSON Server can't store files)
  };

  try {
    const response = await axios.post("http://localhost:5000/specialevents", eventData);
    
    if (response.status === 201) {
      toast.success("Event created successfully!");
    }
    
    setOpen(false);
  } catch (error) {
    console.log("Error creating event:", error);
  }
};


  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Active</span>
              <Switch
                checked={active}
                onChange={handleActiveClick}
                color="primary"
              />
            </div>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Calendar />}
              sx={{ backgroundColor: active ? '#3b82f6' : '#9ca3af' }}
              onClick={handleClickOpen}
              disabled={!active}
            >
              Special Event
            </Button>
          </div>
          
          {/* Dialog Box */}
          <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md" 
            fullWidth
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.5)' }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold">Create Special Event</span>
                </div>
              </DialogTitle>
              <DialogContent sx={{ padding: '28px' }}>
                <div className="grid gap-6">
                  {/* Event Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Event Name</label>
                    <input
                      name="eventName"
                      type="text"
                      value={formData.eventName}
                      onChange={handleChange}
                      required
                      className="input input-bordered w-full rounded-lg px-4 py-2"
                      placeholder="Enter event name"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="input input-bordered w-full rounded-lg px-4 py-2"
                      placeholder="Enter event location"
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="input input-bordered w-full rounded-lg px-4 py-2"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <input
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="input input-bordered w-full rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>

                  {/* Event Image */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Event Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        name="eventImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="event-image"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="event-image" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Package2 className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                          <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </DialogContent>

              {/* Dialog Actions */}
              <DialogActions sx={{ padding: '20px', borderTop: '1px solid rgba(224, 224, 224, 0.5)' }}>
                <Button 
                  onClick={handleClose}
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  type="submit"
                  sx={{ backgroundColor: '#3b82f6' }}
                >
                  Create Event
                </Button>
              </DialogActions>
            </form>
          </Dialog>        </div>        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid gap-6 grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Orders</CardTitle>
                  <Package2 className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-500">+2 from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-500">Team Members</CardTitle>
                  <Users2 className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-gray-500">Active volunteers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-500">Completed Today</CardTitle>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-gray-500">+8 from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-500">Average Time</CardTitle>
                  <Clock className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32m</div>
                  <p className="text-xs text-gray-500">Per delivery</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest food delivery requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Package2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Restaurant #{i + 1}</div>
                        <div className="text-sm text-gray-500">2 km away • 15 mins</div>
                      </div>
                      <div className="text-sm font-medium text-blue-600">In Progress</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-96">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Special community events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Food Drive", date: "Tomorrow, 10 AM", type: "Community" },
                    { title: "Volunteer Meet", date: "Friday, 2 PM", type: "Team" },
                    { title: "Charity Dinner", date: "Next Week", type: "Fundraiser" }
                  ].map((event, i) => (
                    <div key={i} className="p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.date}</div>
                          <div className="text-xs text-blue-600 mt-1">{event.type}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}