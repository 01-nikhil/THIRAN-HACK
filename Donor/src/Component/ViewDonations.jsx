import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { BiSolidBowlRice } from "react-icons/bi";
// import { Edit } from "@mui/icons-material";
import {FaBox, FaUserCircle} from "react-icons/fa";
import { UserContext } from '../context/UserContext';
import { Package2, Settings as SettingsIcon, Gift, Utensils, Home as HomeIcon, } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Chip, 
  Grid} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { AccessTime, LocationOn, Map } from '@mui/icons-material';

export const ViewDonations = () => {
  const { token, user } = useContext(UserContext);
  const [donations, setDonations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    foodName: '',
    availableQty: '',
    preparedTime: '',
    address: '',
    currentLocation: { lat: '', long: '' }
  });
  const [editDonation, setEditDonation] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleUpdateDonation = async () => {
    try {
      await axios.put(`http://localhost:5000/donation/update/${editDonation._id}`, editDonation, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditDonation(null);
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  };
  
useEffect(() => {
  if (window.google && newDonation.currentLocation.lat && newDonation.currentLocation.long) {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: {
        lat: parseFloat(newDonation.currentLocation.lat),
        lng: parseFloat(newDonation.currentLocation.long),
      },
      zoom: 15,
    });

    new window.google.maps.Marker({
      position: {
        lat: parseFloat(newDonation.currentLocation.lat),
        lng: parseFloat(newDonation.currentLocation.long),
      },
      map,
    });
  }
}, [newDonation.currentLocation]);
  const handleDeleteDonation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/donation/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditDonation(null);
      fetchDonations();
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
  };
  
  const openEditDialog = (donation) => {
    setEditDonation(donation);
    setEditDialogOpen(true);
  };
  
  const fetchDonations = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/donations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/donations', newDonation, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsDialogOpen(false);
      fetchDonations();
      setNewDonation({
        foodName: '',
        availableQty: '',
        preparedTime: '',
        address: '',
        currentLocation: { lat: '', long: '' }
      });
    } catch (error) {
      console.error('Error creating donation:', error);
    }
  };
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            
            if (response.data.results.length > 0) {
              const address = response.data.results[0].formatted_address;
  
              setNewDonation((prev) => ({
                ...prev,
                address,
                currentLocation: { lat: latitude, long: longitude },
              }));
            } else {
              alert("Could not fetch address. Try again.");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not fetch your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed left-0 top-0 h-screen w-64 bg-white text-gray-900 flex flex-col p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2"><FaBox className="h-6 w-6 text-blue-600" /><b>Oru Soru</b></h2>
        <hr className="mb-4" />
        <nav className="flex flex-col gap-4 flex-grow">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <HomeIcon size={18} /> Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/view-donations" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <Package2 size={18} /> Donations
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/special-donations" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <Gift size={18} /> Spl Donations
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/fillThePlate" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <Utensils size={18} /> Fill The Plate
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/settings" className="flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg text-gray-900 font-medium">
              <SettingsIcon size={18} /> Settings
            </Link>
          </motion.div>
        </nav>
        <Link to="/settings" className="mt-auto pt-4 border-t flex items-center gap-2 hover:bg-gray-100 p-3 rounded-lg">
          <FaUserCircle className="text-blue-600" size={18} />
          <p className="text-sm text-gray-600">{user?.name || "User"}</p>
        </Link>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-gray-50 ml-64">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Donation
          </motion.button>
        </motion.div>

        {/* Donations Grid */}
        <Grid container spacing={3}>
          {donations.map((donation) => (
            <Grid item xs={12} md={6} lg={4} key={donation._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card elevation={3}>
                  <CardHeader
                    avatar={<BiSolidBowlRice size={24} className="h-6 w-6 text-blue-600"/>}
                    title={<Typography variant="h5"><b>Food #{donation._id?.slice(-4) || 'N/A'}</b></Typography>}
                    action={
                      <div className="flex items-center gap-2">
                        <Chip
                          label={donation.status}
                          color={
                            donation.status === 'Pending' ? 'warning' :
                            donation.status === 'Approved' ? 'info' : 'success'
                          }
                          size="small"
                        />
                        {donation.status === 'Pending' && (
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(donation)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                      </div>
                    }
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography color="textSecondary" variant="subtitle2">Food Name</Typography>
                        <Typography variant="body1">{donation.foodName}</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography color="textSecondary" variant="subtitle2">Quantity</Typography>
                        <Typography variant="body1">{donation.availableQty} meals</Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography color="textSecondary" variant="subtitle2">Prepared Time</Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime fontSize="small" />
                          {donation.preparedTime}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography color="textSecondary" variant="subtitle2">Location</Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn fontSize="small" color="primary" />
                          {donation.address}
                        </Typography>
                      </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                          <Button 
                            variant="outlined" 
                            startIcon={<Map />}
                            onClick={() => {


                              const lat = donation.currentLocation.lat
                              const lng = donation.currentLocation.long
                              const dialogContent = `
                                <iframe
                                  width="100%"
                                  height="400"
                                  frameborder="0"
                                  style="border:0"


                                  src="https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed"
                                  allowfullscreen
                                ></iframe>
                              `
                              const mapWindow = window.open('', 'Map View', 'width=600,height=450')
                              mapWindow.document.write(dialogContent)
                            }}
                          >
                            View on Map
                          </Button>

                        </Grid>                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Edit Donation Dialog */}
        {editDonation && (
          <Dialog open={!!editDonation} onClose={() => setEditDonation(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Donation</DialogTitle>
            <DialogContent>
              <form className="space-y-4 mt-4">
                <TextField
                  fullWidth
                  label="Food Name"
                  value={editDonation.foodName}
                  onChange={(e) => setEditDonation({...editDonation, foodName: e.target.value})}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity (meals)"
                  value={editDonation.availableQty}
                  onChange={(e) => setEditDonation({...editDonation, availableQty: e.target.value})}
                />
                <TextField
                  fullWidth
                  type="time"
                  label="Prepared Time"
                  value={editDonation.preparedTime}
                  onChange={(e) => setEditDonation({...editDonation, preparedTime: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="Address"
                  value={editDonation.address}
                  onChange={(e) => setEditDonation({...editDonation, address: e.target.value})}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDeleteDonation(editDonation._id)} color="error">
                Delete Donation
              </Button>
              <Button onClick={() => setEditDonation(null)}>Cancel</Button>
              <Button onClick={handleUpdateDonation} variant="contained">Save Changes</Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Donation Dialog */}
        {isDialogOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-xl w-full max-w-2xl my-4"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-h-[80vh] overflow-y-auto">
        <div>
          <label className="block text-gray-700 mb-2">Food Name</label>
          <input
            type="text"
            value={newDonation.foodName}
            onChange={(e) =>
              setNewDonation({ ...newDonation, foodName: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Quantity (meals)</label>
          <input
            type="number"
            value={newDonation.availableQty}
            onChange={(e) =>
              setNewDonation({ ...newDonation, availableQty: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Prepared Time</label>
          <input
            type="time"
            value={newDonation.preparedTime}
            onChange={(e) =>
              setNewDonation({ ...newDonation, preparedTime: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={newDonation.address}
            onChange={(e) =>
              setNewDonation({ ...newDonation, address: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Latitude</label>
            <input
              type="number"
              value={newDonation.currentLocation.lat}
              onChange={(e) =>
                setNewDonation({
                  ...newDonation,
                  currentLocation: { ...newDonation.currentLocation, lat: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Longitude</label>
            <input
              type="number"
              value={newDonation.currentLocation.long}
              onChange={(e) =>
                setNewDonation({
                  ...newDonation,
                  currentLocation: { ...newDonation.currentLocation, long: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="col-span-2 flex justify-center mt-2">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Get Current Location
            </button>
          </div>
        </div>
        <div className="col-span-2">
          <div id="map" className="w-full h-48 rounded border"></div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={() => setIsDialogOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </motion.div>
  </div>
)}      </main>
    </div>
  );
};