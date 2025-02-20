import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from "./useContext";


function DonorLogin() {
  const { setUser, setDonorId } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.get("http://localhost:5000/donors");
  
      if (!response || !response.data) {
        throw new Error("No donors data found.");
      }
  
      const donors = response.data;
      const donor = donors.find(d => d.email === formData.email && d.password === formData.password);
  
      if (donor) {
        // Store donor ID in localStorage
        localStorage.setItem("userName", donor.name);
        localStorage.setItem("location", donor.city);
        localStorage.setItem("donorId", donor.id.toString());
  
        // Update context values
        setUser(donor);
        setDonorId(donor.id);
        console.log(donor.id) // Ensure donor.id is correctly set
  
        console.log("Donor ID set in context:", donor.id); // Debugging
  
        toast.success("Login successful!", { position: "top-right", autoClose: 3000 });
  
        setTimeout(() => {
          navigate("/", {
            state: {
              name: donor.name,
              donorType: donor.donorType,
              individualAddress: donor.individualAddress,
            },
          });
        }, 1000);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed: " + (error.response?.data?.message || error.message || "An error occurred"));
    }
  };
  
  
  return (
    <div className="w-full h-screen bg-cover bg-center flex justify-center items-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
        <h1 className="text-blue-600 text-4xl mb-8 font-semibold">Donor Login</h1>
        
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="mb-4 p-3 border border-gray-300 rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4 p-3 border border-gray-300 rounded-lg"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-gray-400 text-white py-3 rounded-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600 text-sm">
          <button className="text-blue-600 font-semibold hover:underline">Forgot Password?</button> |  
          <a href="/registration" className="text-blue-600 font-semibold hover:underline ml-2">Register Now</a>
        </div>
      </div>
    </div>
  );
}
export default DonorLogin;