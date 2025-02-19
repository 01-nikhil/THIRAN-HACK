import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowLeft, FiUserPlus } from 'react-icons/fi';
import axios from 'axios';
import toast from "react-hot-toast"
import { UserContext } from './UserContext';

function VolunteerLogin() {
  const {setUser,setVolunteerId}=useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/volunteers');
            const volunteers = response.data;

            const volunteer = volunteers.find(v =>
                v.email === formData.email && v.password === formData.password
            );

            if (volunteer) {
                const { id, fullName, location: { latitude, longitude, address }, email, contactNumber, city } = volunteer;
                toast.success('Login successful!');

                // Store volunteer data in localStorage for Sidebar
                localStorage.setItem('volunteerData', JSON.stringify({
                    id,
                    fullName,
                    location: {
                        latitude,
                        longitude,
                        address
                    },
                    email,
                    contactNumber,
                    city
                }));

                // Store volunteerId in localStorage
                localStorage.setItem('volunteerId', id);
                console.log(id);

                // Store id and user in context
                setVolunteerId(id);
                setUser({
                    id,
                    fullName,
                    location: {
                        latitude,
                        longitude,
                        address
                    },
                    email,
                    contactNumber,
                    city
                });

                navigate('/', {
                    state: {
                        id,
                    }
                });
            } else {
                toast.error('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred during login. Please try again.');
        }
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 w-full h-16 bg-gray-900"
            />

            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute left-0 h-full w-1/3"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)',
                    filter: 'grayscale(20%)'
                }}
            />

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 px-4 py-2 bg-white text-gray-800 font-medium rounded-lg shadow hover:shadow-md transition-all duration-300 z-10 flex items-center gap-2"
            >
                <FiArrowLeft className="w-4 h-4" /> Back
            </motion.button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white p-10 rounded-lg shadow-xl w-[400px] ml-auto mr-20"
            >
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-3xl font-semibold mb-8 text-center text-gray-800 font-['Inter']"
                >
                    Welcome Back
                </motion.h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="w-full px-11 py-3 border border-gray-200 rounded-lg text-base focus:border-gray-600 focus:ring-1 focus:ring-gray-300 transition-all duration-200 font-['Inter'] bg-gray-50"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full px-11 py-3 border border-gray-200 rounded-lg text-base focus:border-gray-600 focus:ring-1 focus:ring-gray-300 transition-all duration-200 font-['Inter'] bg-gray-50"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg text-base tracking-wide hover:bg-gray-800 transition-all duration-200 font-['Inter']"
                    >
                        Sign In
                    </motion.button>
                </form>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-center space-y-3"
                >
                    <a href="#" className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200">
                        Forgot Password?
                    </a>
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-gray-500">New volunteer?</span>
                        <a href="/volunteers/signup" className="text-gray-800 hover:text-gray-600 font-medium transition-colors duration-200 flex items-center gap-1">
                            Join us <FiUserPlus className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-t from-gray-100 to-transparent rounded-full filter blur-3xl opacity-30" />
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-b from-gray-100 to-transparent rounded-full filter blur-2xl opacity-20" />
        </div>
    );
}

export default VolunteerLogin;