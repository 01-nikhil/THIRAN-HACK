import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReceiverSignup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    orphanageName: '',
    orphanageRegNumber: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    password: '',
    organizationAddress: '',
    city: '',
    pincode: '',
    numberOfOrphanages: '',
    agreement: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/receivers', formData);
      if (response.data) {
        navigate('/receivers/login');
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleBack = () => navigate('/receiver-login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://img.freepik.com/premium-vector/green-vector-pattern-with-lava-shapes_6869-866.jpg?semt=ais_hybrid')" }}>
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold text-green-600 mb-6">Receiver Registration</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold">Orphanage Name</label>
            <input type="text" name="orphanageName" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.orphanageName} onChange={handleChange} required />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold">Orphanage Registration Number (if applicable)</label>
            <input type="text" name="orphanageRegNumber" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.orphanageRegNumber} onChange={handleChange} />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold">Contact Person Name</label>
            <input type="text" name="contactPerson" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.contactPerson} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">Contact Number</label>
              <input type="tel" name="contactNumber" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.contactNumber} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Email Address</label>
              <input type="email" name="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Password</label>
            <input type="password" name="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.password} onChange={handleChange} required />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold">Organization Address</label>
            <textarea name="organizationAddress" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.organizationAddress} onChange={handleChange} required></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">City</label>
              <input type="text" name="city" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.city} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Pincode</label>
              <input type="text" name="pincode" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.pincode} onChange={handleChange} required />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold">Number of Orphanages</label>
            <input type="number" name="numberOfOrphanages" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.numberOfOrphanages} onChange={handleChange} required />
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" name="agreement" className="mr-2" checked={formData.agreement} onChange={handleChange} required />
            <span className="text-gray-700 text-sm">I agree to the terms and conditions</span>
          </div>
          
          <button type="submit" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg uppercase tracking-wide transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
            Register
          </button>
          
          <button type="button" onClick={handleBack} className="w-full py-2 bg-gray-600 text-white font-semibold rounded-lg uppercase tracking-wide transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReceiverSignup;