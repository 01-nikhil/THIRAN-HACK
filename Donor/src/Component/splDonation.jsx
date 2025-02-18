import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package2, Gift, Utensils, Settings as SettingsIcon, Home as HomeIcon, Building2, Users, Phone, Mail } from 'lucide-react';
import { FaBox, FaUserCircle } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';

const organizations = [
  {
    id: 1,
    name: "Happy Children's Home",
    peopleCount: 45,
    contact: "+91 9876543210",
    email: "happy@children.org",
  },
  {
    id: 2,
    name: "Elder Care Center",
    peopleCount: 80,
    contact: "+91 9876543211",
    email: "care@eldercare.org",
  },
  {
    id: 3,
    name: "Hope Foundation",
    peopleCount: 120,
    contact: "+91 9876543212",
    email: "info@hopefoundation.org",
  },
];

const Sidebar = ({ user }) => {
  return (
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
  );
};
const DonationDialog = ({ organization, onClose }) => {
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [mealType, setMealType] = useState('');

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Snacks' }
  ];

  const handleSubmit = () => {
    alert(`Donation scheduled for ${organization.name}
    Date: ${date}
    Meal Type: ${mealType}
    Reason: ${reason}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-lg w-96 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Schedule Donation</h2>
        <p className="mb-4 text-gray-700">Organization: {organization.name}</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Reason for Donation</label>
          <textarea
            className="w-full p-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason for donation..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Select Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Meal Type</label>
          <select
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="">Select meal type</option>
            {mealTypes.map((meal) => (
              <option key={meal.value} value={meal.value}>
                {meal.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Schedule
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export const SpecialDonations = () => {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const { user } = useContext(UserContext);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 p-8 ml-64">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 text-gray-900"
        >
          Special Donations
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {organizations.map((org) => (
            <motion.div
              key={org.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="text-blue-600" size={20} />
                    <h2 className="text-xl font-bold text-gray-900">{org.name}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} />
                    <p>People: {org.peopleCount}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <p>Contact: {org.contact}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <p>Email: {org.email}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedOrg(org)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Schedule Donation
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {selectedOrg && (
          <DonationDialog
            organization={selectedOrg}
            onClose={() => setSelectedOrg(null)}
          />
        )}
      </div>
    </div>
  );
};