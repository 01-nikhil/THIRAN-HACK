import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, CheckCircle, Calendar } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const ReceiverHomepage = () => {
    const navigate = useNavigate();
    const loc = useLocation();
    const [dashboardStats, setDashboardStats] = useState({
        totalRequests: 0,
        pendingRequests: 0,
        completedRequests: 0,
        peakRequestTime: '00:00 AM'
    });
    const [recentRequests, setRecentRequests] = useState([]);

    useEffect(() => {
        const userName = localStorage.getItem('userName');
        const userLocation = localStorage.getItem('location');
        const receiverId = localStorage.getItem('receiverId');

        if (!userName || !userLocation || !receiverId) {
            toast.error('Please login first');
            navigate('/receivers/login');
            return; // Important: Exit the useEffect if not logged in
        }

        // Fetch dashboard data
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/requests');
                const allRequests = response.data;

                // Filter requests for the logged-in orphanage
                const orphanageName = localStorage.getItem('userName');
                const receiverRequests = allRequests.filter(req => req.orphanageName === orphanageName);

                // Sort requests by date for recent activity
                const sortedRequests = [...receiverRequests].sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setRecentRequests(sortedRequests.slice(0, 5));

                // Calculate statistics
                const totalRequests = receiverRequests.length;
                const pendingRequests = receiverRequests.filter(req => req.status === 'pending').length;
                const completedRequests = receiverRequests.filter(req => req.status === 'completed').length;
                const peakRequestTime = calculatePeakTime(receiverRequests);

                setDashboardStats({
                    totalRequests,
                    pendingRequests,
                    completedRequests,
                    peakRequestTime
                });


            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to load dashboard data');
            }
        };

        fetchDashboardData();
    }, [navigate]);  // Include navigate in the dependency array

    const calculatePeakTime = (requests) => {
        if (requests.length === 0) return '00:00 AM';

        // Extract times and convert them to Date objects
        const times = requests.map(req => new Date(req.createdAt).getTime());

        // Find the latest time (maximum timestamp)
        const latestTime = Math.max(...times);

        // Convert the latest time back to a Date object
        const peakTime = new Date(latestTime);

        // Format the time to 12-hour format
        return peakTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const cards = [
        {
            title: 'Total Requests',
            value: dashboardStats.totalRequests,
            icon: TrendingUp,
            color: 'bg-blue-500',
        },
        {
            title: 'Pending Requests',
            value: dashboardStats.pendingRequests,
            icon: Clock,
            color: 'bg-yellow-500',
        },
        {
            title: 'Completed Requests',
            value: dashboardStats.completedRequests,
            icon: CheckCircle,
            color: 'bg-green-500',
        },
        {
            title: 'Peak Request Time',
            value: dashboardStats.peakRequestTime,
            icon: Users,
            color: 'bg-purple-500',
        },
    ];

    return (
        <div className="p-6 space-y-6 flex-1">
            <ToastContainer />
            <div className="mb-8 text-center animate-fade-in">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
                    Welcome, {loc.state?.name || localStorage.getItem('userName')}!
                </h1>
                <p className="text-gray-600 mt-2">Location: {loc.state?.location || localStorage.getItem('location')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{card.title}</p>
                                <p className="text-2xl font-bold mt-1">{card.value}</p>
                            </div>
                            <div className={`${card.color} p-3 rounded-lg`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentRequests.map((request, i) => (
                            <div key={i} className="p-4 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">New Request Created</div>
                                        <div className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</div>
                                        <div className="text-xs text-blue-600 mt-1">Request - {request.quantity} Servings</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Recent Analytics</h3>
                    <div className="space-y-4">
                        {recentRequests.map((request, i) => (
                            <div key={i} className="p-4 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Pending Request</div>
                                        <div className="text-sm text-gray-500">OTP: {request.otp}</div>
                                        <div className="text-xs text-blue-600 mt-1">Status: {request.status}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ReceiverHomepage;