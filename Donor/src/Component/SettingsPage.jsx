import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package2, Home as HomeIcon, Settings as SettingsIcon, Gift, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { FaBox,FaUserCircle } from "react-icons/fa";
import { UserContext } from "./useContext";

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
const SettingsPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "");
  const [contact, setContact] = useState(user?.contact || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.individualAddress || user?.orgResAddress || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/donor/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = await response.json();
        setName(userData.name);
        setContact(userData.contact);
        setEmail(userData.email);
        setAddress(userData.donorType === "Individual" ? userData.individualAddress : userData.orgResAddress);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/donor/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          contact,
          address,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          name,
          contact,
          address,
        }));
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch("http://localhost:5000/donor/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          currentPassword: password, 
          newPassword: newPassword 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password changed successfully!");
        setPassword("");
        setNewPassword("");
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change failed:", error);
      alert("Failed to change password. Please try again.");
    }
  };
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/donor/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8 bg-gray-50 ml-64"
      >
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Contact</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2 border bg-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500"
              />
            </div>
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleUpdateProfile}
  disabled={loading}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  {loading ? "Updating..." : "Update Profile"}
</motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500"
              />
            </div>
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleChangePassword}
  disabled={loading}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  {loading ? "Changing Password..." : "Change Password"}
</motion.button>
          </div>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout} 
          className="bg-red-600 text-white px-4 py-2 rounded mt-6 hover:bg-red-700"
        >
          Logout
        </motion.button>

        {message && (
          <div className="mt-4 p-3 rounded bg-blue-100 text-blue-700">
            {message}
          </div>
        )}
      </motion.div>
    </div>
  );
};
export default SettingsPage;