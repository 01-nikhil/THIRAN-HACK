import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Heart, MapPin, Phone, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Badge } from "../components/badge";
import GoogleMapComponent from "../GoogleMapComponent";
import axios from "axios";
import { axiosInstance } from "../../../lib/axios";
import { useVolunteerStore } from "../../../store/useVolunteerStore";

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    phone: "+1 234-567-8900",
    area: "North District",
    status: "Active",
    deliveries: 156,
  },
  {
    id: 2,
    name: "Alice Smith",
    phone: "+1 234-567-8901",
    area: "South District",
    status: "On Break",
    deliveries: 142,
  },
  {
    id: 3,
    name: "Robert King",
    phone: "+1 234-567-8902",
    area: "East District",
    status: "Active",
    deliveries: 98,
  },
];

export function AddPeople() {
  const {addMember}=useVolunteerStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    locationDesc: "",
    location: { lat: null, lng: null },
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: { lat: latitude, lng: longitude }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormData({
        name: "",
        age: "",
        gender: "",
        locationDesc: "",
        location: { lat: null, lng: null },
      });
      await addMember(formData);
      console.log("Member added successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      age: "",
      gender: "",
      locationDesc: "",
      location: { lat: null, lng: null },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (location, address) => {
    console.log("Received in parent:", { location, address });
    setFormData((prev) => ({
      ...prev,
      locationDesc: address || "",
      location: { lat: location.lat, lng: location.lng },
    }));
  };
  

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Homeless Person
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="text-lg font-semibold">Homeless Person Details</span>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="grid gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label>Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Enter person's name"
              />
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label>Age</label>
                <input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Enter age"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Location Description */}
            <div className="flex flex-col gap-2">
              <label>Location Description</label>
              <textarea
                name="locationDesc"
                rows={2}
                value={formData.locationDesc}
                onChange={(e) => setFormData({ ...formData, locationDesc: e.target.value })}
                className="textarea textarea-bordered w-full"
                placeholder="E.g., Near Gandhi Park, Anna Salai"
              />
            </div>

            {/* Map */}
            <div className="flex flex-col gap-2">
              <label>Location on Map</label>
              <div className="h-[200px] border border-gray-300 rounded-lg">
                <GoogleMapComponent onLocationChange={handleLocationChange} />
              </div>
            </div>
          </div>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Submit Details
          </Button>
        </DialogActions>
      </form>
    </Dialog>

      {/* Display Team Members */}
      <div className="space-y-8 px-6 py-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Team Members
          </h1>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            onClick={handleClickOpen}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Member
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="shadow-lg hover:shadow-xl transition duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  {member.name}
                </CardTitle>
                <Badge
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    member.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {member.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Contact
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-gray-700 text-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                      {member.phone}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Assigned Area
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-gray-700 text-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      {member.area}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddPeople;