import React, { useState, useEffect, useContext } from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReceiverSidebar from './ReceiverSidebar';
import { UserContext } from '../UserContext';

const PreRequest = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [preRequests, setPreRequests] = useState([]);
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      toast.error('Please login first');
      navigate('/receivers/login');
      return;
    }
    fetchPreRequests();
  }, [userId, navigate]);

  const fetchPreRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/prerequests?userId=${userId}`);
      setPreRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching pre-requests:', error);
      toast.error('Error fetching pre-requests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPreRequest = {
        id: Math.random().toString(36).substr(2, 4),
        quantity: parseInt(quantity),
        date,
        time,
        userId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await axios.post('http://localhost:5000/prerequests', newPreRequest, {
        headers: { 'Content-Type': 'application/json' },
      });

      setPreRequests((prev) => [...prev, newPreRequest]);
      setQuantity('');
      setDate('');
      setTime('');
      setIsDialogOpen(false);
      toast.success('Pre-request created successfully');
    } catch (error) {
      console.error('Error creating pre-request:', error);
      toast.error('Error creating pre-request');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-none">
        <ReceiverSidebar />
      </div>
      <div className="flex-1 overflow-auto p-6 ">
        <ToastContainer />
        <div className="max-w-2xl mx-auto mb-8">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Pre-Request
          </button>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Create New Pre-Request</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (Servings)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    Create Pre-Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preRequests.map((preRequest) => (
            <div
              key={preRequest.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    preRequest.status === 'pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {preRequest.status.charAt(0).toUpperCase() + preRequest.status.slice(1)}
                </span>
                <p className="text-sm text-gray-500 font-mono">#{preRequest.id}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{preRequest.quantity} Servings</p>
              <div className="text-sm text-gray-600 flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                {new Date(preRequest.date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                {preRequest.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreRequest;
