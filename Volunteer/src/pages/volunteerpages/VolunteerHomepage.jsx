import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/Card";
import { Package2, Users2, CheckCircle2, Clock, Calendar, UserCircle2, MapPin, Phone, Clock1 } from "lucide-react";
import SideBar from "./components/SideBar";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Switch } from "@mui/material";
import { connectWebSocket, sendWebSocketMessage } from "../../socket";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from "./UserContext";

const VolunteerHomepage = () => {
  const{volunteerId}=useContext(UserContext);
  console.log("Volunteer ID from context:", volunteerId);
  const location = useLocation();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [specialEvents, setSpecialEvents] = useState([]);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/volunteers");
        const volunteerData = response.data.find(v => v.id === volunteerId);
        setVolunteer(volunteerData);
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      }
    };
    fetchVolunteerData();
    fetchSpecialEvents(); // Call fetchSpecialEvents when component mounts
  }, [volunteerId]);

  const fetchSpecialEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/specialevents");
      setSpecialEvents(response.data);
      console.log("Special events fetched:", response.data); // Add logging to verify data
    } catch (error) {
      console.error("Error fetching special events:", error);
    }
  };

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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleActiveClick = () => {
    setActive(!active);
    const volunteerData = { type: "volunteer", message: "Volunteer status changed!", status: !active };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, eventImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      eventName: formData.eventName,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      eventImage: null,
    };

    try {
      const response = await axios.post("http://localhost:5000/specialevents", eventData);
      
      if (response.status === 201) {
        toast.success("Event created successfully!");
        fetchSpecialEvents();
      }
      
      setOpen(false);
    } catch (error) {
      console.log("Error creating event:", error);
    }
  };

  if (!volunteer) {
    return null;
  }

  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome, {volunteer.fullName}</p>
          </div>
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
          </Dialog>        
        </div>        
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid gap-4 grid-cols-4 mb-4">
              <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between p-2 space-y-0">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-xs font-medium text-gray-500">Volunteer ID</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-2 flex justify-center items-center">
                  <div className="text-xl font-bold">{volunteer.id}</div>
                </CardContent>
              </Card>

              <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between p-2 space-y-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-xs font-medium text-gray-500">Location</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-2 flex justify-center items-center">
                  <div className="text-xl font-bold">{volunteer.city}</div>
                </CardContent>
              </Card>

              <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between p-2 space-y-0">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-xs font-medium text-gray-500">Contact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-2 flex justify-center items-center">
                  <div className="text-xl font-bold">{volunteer.contactNumber}</div>
                </CardContent>
              </Card>

              <Card className="p-3">
                <CardHeader className="flex flex-row items-center justify-between p-2 space-y-0">
                  <div className="flex items-center gap-2">
                    <Clock1 className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-xs font-medium text-gray-500">Average Time</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-2 flex justify-center items-center">
                  <div className="text-xl font-bold">32m</div>
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
            <Card className="h-[527px] overflow-y-auto">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Special community events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specialEvents.map((event, i) => (
                    <div key={event.id} className="p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{event.eventName}</div>
                          <div className="text-sm text-gray-500">{event.date} at {event.time}</div>
                          <div className="text-xs text-blue-600 mt-1">{event.location}</div>
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
export default VolunteerHomepage;