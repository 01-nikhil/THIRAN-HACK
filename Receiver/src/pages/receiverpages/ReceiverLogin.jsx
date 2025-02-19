import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../UserContext'; // Adjust the path as needed

function ReceiverLogin() {
  const navigate = useNavigate();
  const { setUserId } = useContext(UserContext); // Access setUserId from UserContext
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:5000/receivers'); // Fetch receiver data
      const receivers = response.data;
      const receiver = receivers.find(
        (r) => r.email === formData.email && r.password === formData.password
      );

      if (receiver) {
        // Set the logged-in user's ID in the context
        setUserId(receiver.id);

        // Show success message
        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to the dashboard
        setTimeout(() => {
          navigate('/receivers/dashboard');
        }, 1000);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(
        'Login failed: ' + (error.response?.data?.message || 'An error occurred')
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center flex justify-center items-center overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3")',
      }}
    >
      <ToastContainer />
      <button
        onClick={handleBack}
        className="absolute top-5 left-5 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
      >
        ← Back to Home
      </button>
      <div className="relative bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl max-w-lg w-full backdrop-blur-sm flex flex-col items-center animate-fadeIn">
        <h1 className="text-teal-600 text-4xl font-semibold mb-8 text-center">Receiver Login</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="relative mb-8 w-full">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative mb-8 w-full">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReceiverLogin;
