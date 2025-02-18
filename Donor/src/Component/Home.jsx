import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

import {FaBox, FaUserCircle} from "react-icons/fa";
import { Package2, Users2, CheckCircle2, Clock, Home as HomeIcon, Settings as SettingsIcon, Gift, Utensils } from "lucide-react";
import { Card, CardContent } from "@mui/material";

export const Home = () => {
  const location = useLocation();
  const [donations, setDonations] = useState([]);
  const [donationGoal, setDonationGoal] = useState(1000);
  const [donated, setDonated] = useState(0);
  const [totalDonors, setTotalDonors] = useState(0);
  const [recentDonations, setRecentDonations] = useState([]);
  const [donorDetails, setDonorDetails] = useState({
    name: localStorage.getItem('userName') || location.state?.name,
    donorType: location.state?.donorType || "",
    individualAddress: location.state?.individualAddress || ""
  });
  const [achievements, setAchievements] = useState({
    totalRestaurants: 0,
    totalMealsServed: 0,
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/donations");
        setDonations(response.data);
        const total = response.data.reduce((acc, donation) => acc + parseInt(donation.availableQty), 0);
        setDonated(total);
        setRecentDonations(response.data.slice(-5));
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    const fetchTotalDonors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/donors");
        setTotalDonors(response.data.length);
      } catch (error) {
        console.error("Error fetching total donors:", error);
      }
    };
    
    const fetchAchievements = async () => {
      try {
        const donorsRes = await axios.get("http://localhost:5000/donors");
        const donationsRes = await axios.get("http://localhost:5000/donations");
        const restaurants = donorsRes.data.filter(d => d.donorType === "Restaurant").length;
        const totalMeals = donationsRes.data.reduce((acc, d) => acc + parseInt(d.availableQty), 0);
        setAchievements({
          totalRestaurants: restaurants,
          totalMealsServed: totalMeals
        });
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchDonations();
    fetchTotalDonors();
    fetchAchievements();
  }, []);

  const progress = (donated / donationGoal) * 100;

  return (
    <div className="flex min-h-screen ">
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
        <Link to="/settings" className="mt-auto pt-4 border-t flex flex-col gap-1 hover:bg-gray-100 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-blue-600" size={18} />
            <p className="text-sm text-gray-900 font-medium">Welcome, {donorDetails.name}</p>
          </div>
          <p className="text-xs text-gray-500 ml-6">{donorDetails.donorType}</p>
        </Link>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-gray-50 ml-64">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-900 mb-6"
        >
          Dashboard
        </motion.h1>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: "Total Donations", value: donated, subtitle: "meals donated", icon: <Package2 className="w-5 h-5 text-blue-600" /> },
            { title: "Goal Progress", value: `${progress.toFixed(1)}%`, subtitle: "towards your goal", icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
            { title: "Total Donors", value: totalDonors, subtitle: "registered donors", icon: <Users2 className="w-5 h-5 text-green-600" /> },
            { title: "Donation Count", value: donations.length, subtitle: "times donated", icon: <Clock className="w-5 h-5 text-blue-600" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-row items-center justify-between pb-3">
                    <div className="text-base font-medium text-gray-500">{stat.title}</div>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>
                  {stat.title === "Goal Progress" && (
                    <motion.div 
                      className="w-full bg-gray-200 rounded-full h-2.5 mt-3"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <motion.div
                        className="bg-blue-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      ></motion.div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Donations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="mb-8">
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Recent Donations</h3>
              <p className="text-sm text-gray-500 mb-4">Latest donation activities</p>
              <div className="space-y-4">
                {recentDonations.map((donation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Package2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{donation.availableQty} meals</div>
                      <div className="text-sm text-gray-500">{donation.preparedTime}</div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                    >
                      Active
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Our Impact</h3>
              <p className="text-sm text-gray-500 mb-4">Overall achievements</p>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: totalDonors, label: "Total Donors" },
                  { value: achievements.totalRestaurants, label: "Restaurants" },
                  { value: achievements.totalMealsServed, label: "Meals Served" }
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl font-bold text-gray-900">{achievement.value}</div>
                    <div className="text-sm text-gray-500">{achievement.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};