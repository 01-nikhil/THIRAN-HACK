import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Heart, MapPin, Plus, Check, X } from "lucide-react";
import axios from "axios";
import GoogleMapComponent from "../GoogleMapComponent";

export function AddPeople() {
  const [open, setOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    locationDesc: "",
    location: { lat: null, lng: null },
    status: "Active",
    foodDelivered: false
  });

  useEffect(() => {
    fetchTeamMembers();
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
    }
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/addpeople');
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/addpeople', {
        ...formData,
        id: Date.now(),
        status: "Active",
        foodDelivered: false
      });
      setFormData({
        name: "",
        age: "",
        gender: "",
        locationDesc: "",
        location: { lat: null, lng: null },
        status: "Active",
        foodDelivered: false
      });
      fetchTeamMembers();
      setOpen(false);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      age: "",
      gender: "",
      locationDesc: "",
      location: { lat: null, lng: null },
      status: "Active",
      foodDelivered: false
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
    setFormData((prev) => ({
      ...prev,
      locationDesc: address || "",
      location: { lat: location.lat, lng: location.lng },
    }));
  };

  const toggleFoodDelivery = async (memberId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/addpeople/${memberId}`, {
        foodDelivered: !currentStatus
      });
      fetchTeamMembers();
    } catch (error) {
      console.error("Error updating food delivery status:", error);
    }
  };

  return (
    <div>
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
              <div className="flex flex-col gap-2">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter person's name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label>Age</label>
                  <input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Enter age"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label>Location Description</label>
                <textarea
                  name="locationDesc"
                  rows={2}
                  value={formData.locationDesc}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="E.g., Near Gandhi Park, Anna Salai"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Location on Map</label>
                <div className="h-[200px] border border-gray-300 rounded-lg">
                  <GoogleMapComponent onLocationChange={handleLocationChange} />
                </div>
              </div>
            </div>
          </DialogContent>

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

      <div className="space-y-8 px-6 py-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Homeless People List
          </h1>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            onClick={handleClickOpen}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Person
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {member.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Age:</span> {member.age}
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span> {member.gender}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      {member.locationDesc}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-4">
                    <button
                      onClick={() => toggleFoodDelivery(member.id, member.foodDelivered)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        member.foodDelivered
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member.foodDelivered ? (
                        <>
                          <Check className="h-4 w-4" />
                          Food Delivered
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Food Pending
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPeople;