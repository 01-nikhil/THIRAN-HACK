import React, { useState, useEffect, useContext } from 'react';
import { Package2, Users2, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import ReceiverSidebar from '../../components/ReceiverSidebar';
import { UserContext } from '../../UserContext';

const ReceiverHomepage = () => {
    const { userId } = useContext(UserContext);
    const navigate = useNavigate();

    const [receiverDetails, setReceiverDetails] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        totalRequests: 0,
        pendingRequests: 0,
        completedRequests: 0,
        peakRequestTime: '00:00 AM',
    });
    const [recentRequests, setRecentRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        if (!userId) {
            toast.error('Please login first');
            navigate('/receivers/login');
            return;
        }

        const fetchData = async () => {
            try {
                const receiverResponse = await axios.get(`http://localhost:5000/receivers/${userId}`);
                setReceiverDetails(receiverResponse.data);

                const requestsResponse = await axios.get('http://localhost:5000/requests');
                const allRequests = requestsResponse.data.filter(req => req.userId === userId);

                const totalRequests = allRequests.length;
                const pendingRequests = allRequests.filter(req => req.status === 'pending');
                const completedRequests = allRequests.filter(req => req.status === 'completed');

                setDashboardStats({
                    totalRequests,
                    pendingRequests: pendingRequests.length,
                    completedRequests: completedRequests.length,
                    peakRequestTime: calculatePeakTime(allRequests),
                });
                setRecentRequests(allRequests.slice(0, 5));
                setPendingRequests(pendingRequests);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
            }
        };

        fetchData();
    }, [userId, navigate]);

    const calculatePeakTime = (requests) => {
        if (requests.length === 0) return '00:00 AM';
        const times = requests.map(req => new Date(req.createdAt).getTime());
        const latestTime = Math.max(...times);
        const peakTime = new Date(latestTime);
        return peakTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex h-screen">
            <div className="w-64 flex-shrink-0">
                <ReceiverSidebar />
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50"
            >
                <ToastContainer />
                {receiverDetails ? (
                    <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Welcome, {receiverDetails.contactPerson}!
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Orphanage: {receiverDetails.orphanageName}
                        </p>
                    </motion.div>
                ) : (
                    <p className="text-center text-gray-500">Loading receiver details...</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Total Requests', value: dashboardStats.totalRequests, icon: Package2, color: 'bg-blue-500' },
                        { title: 'Pending Requests', value: dashboardStats.pendingRequests, icon: Clock, color: 'bg-yellow-500' },
                        { title: 'Completed Requests', value: dashboardStats.completedRequests, icon: CheckCircle2, color: 'bg-green-500' },
                        { title: 'Peak Request Time', value: dashboardStats.peakRequestTime, icon: Users2, color: 'bg-purple-500' }
                    ].map((card) => (
                        <motion.div key={card.title} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{card.title}</p>
                                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                                </div>
                                <div className={`${card.color} p-3 rounded-lg`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Requests</h2>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        {recentRequests.length > 0 ? (
                            <ul>
                                {recentRequests.map((req) => (
                                    <li key={req.id} className="mb-2">
                                        <p><strong>ID:</strong> {req.id}</p>
                                        <p><strong>Status:</strong> {req.status}</p>
                                        <p><strong>Created At:</strong> {new Date(req.createdAt).toLocaleString()}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No recent requests.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ReceiverHomepage;
