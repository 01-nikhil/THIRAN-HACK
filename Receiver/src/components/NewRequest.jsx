import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, ClipboardList } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewRequest = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userLocation = localStorage.getItem('location');
    const receiverId = localStorage.getItem('receiverId');

    if (!userName || !userLocation || !receiverId) {
      toast.error('Please login first');
      navigate('/receivers/login');
      return;
    }
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/requests');
      const receiverResponse = await axios.get('http://localhost:5000/receivers');
      const receiver = receiverResponse.data.find(r => r.id === localStorage.getItem('receiverId'));
      
      const requestsWithDetails = response.data.map(request => ({
        ...request,
        orphanageName: receiver.orphanageName,
        organizationAddress: receiver.organizationAddress,
        city: receiver.city,
        pincode: receiver.pincode,
        contactPerson: receiver.contactPerson,
        contactNumber: receiver.contactNumber
      }));
      
      setRequests(requestsWithDetails || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Error fetching requests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const receiverResponse = await axios.get('http://localhost:5000/receivers');
      const receiver = receiverResponse.data.find(r => r.id === localStorage.getItem('receiverId'));
      
      const newRequest = {
        id: Math.random().toString(36).substr(2, 4),
        quantity: parseInt(quantity),
        orphanageName: receiver.orphanageName,
        organizationAddress: receiver.organizationAddress,
        city: receiver.city,
        pincode: receiver.pincode,
        contactPerson: receiver.contactPerson,
        contactNumber: receiver.contactNumber,
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        donor: null,
        status: 'pending',
        createdAt: new Date()
      };

      await axios.post('http://localhost:5000/requests', newRequest, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setRequests(prev => [...prev, newRequest]);
      setQuantity('');
      setIsDialogOpen(false);
      toast.success('Request created successfully');
    } catch (error) {
      console.error('Error saving request:', error);
      toast.error('Error creating request');
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="max-w-2xl mx-auto mb-8">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Food Request
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (Servings)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${request.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
              <div className="flex items-center">
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mr-2">OTP: {request.otp}</span>
                <p className="text-sm text-gray-500 font-mono">#{request.id}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">{request.orphanageName}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-4">{request.quantity} Servings</p>
            
            <div className="text-sm text-gray-600 flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              {new Date(request.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewRequest;
