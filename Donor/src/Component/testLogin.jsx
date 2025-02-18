import React, { useState } from "react";
import { motion } from "framer-motion";
import bt from "./bt.png";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const TestLoginPage = () => {
  const [role, setRole] = useState(0);

  const roleDetails = [
    { name: "Donor", apiEndpoint: "/api/donor/login", registerLink: "/donor/register", icon: <RestaurantIcon /> },
    { name: "Volunteer", apiEndpoint: "/api/volunteer/login", registerLink: "/volunteer/register", icon: <VolunteerActivismIcon /> },
    { name: "HelpGetter", apiEndpoint: "/api/helpgetter/login", registerLink: "/helpgetter/register", icon: <FavoriteIcon /> },
  ];

  const handleChange = (event, newValue) => {
    setRole(newValue);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { apiEndpoint } = roleDetails[role];
    console.log(`Submitting login request to: ${apiEndpoint}`);
  };

  return (
    <div className="h-screen grid grid-cols-5 bg-gradient-to-r from-blue-100 via-teal-200 to-cyan-300">
      {/* Left section with the image and quote */}
      <div className="col-span-2 relative h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute z-10 w-full text-center top-[20%] px-6"
        >
          <h1 className="text-4xl font-bold text-white drop-shadow-2xl tracking-wide leading-relaxed">
            "Everyone has a role to play in creating a better world."
          </h1>
        </motion.div>
        <img
          src={bt}
          alt="Left decorative"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>      {/* Right section with the login form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="col-span-3 flex items-center justify-end h-screen"
      >
        <Card className="shadow-2xl rounded-3xl backdrop-blur-sm bg-white/90 w-4/5 h-screen">
          <CardContent className="p-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center"
            >
              {roleDetails[role].icon}
            </motion.div>
            <Typography
              variant="h4"
              component="h1"
              className="text-center font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
              gutterBottom
            >
              Welcome Back
            </Typography>
            <Typography
              variant="subtitle1"
              className="text-center text-teal-600 mb-8"
            >
              Making a difference, one meal at a time
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
              <Tabs
                value={role}
                onChange={handleChange}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  '& .MuiTab-root': {
                    color: '#0d9488',
                    fontWeight: 'bold',
                    '&.Mui-selected': {
                      color: '#1d4ed8',
                    },
                  },
                }}
              >
                {roleDetails.map((role, index) => (
                  <Tab key={index} icon={role.icon} label={role.name} />
                ))}
              </Tabs>
            </Box>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Box component="form" noValidate autoComplete="off" className="space-y-5" onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#0d9488',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1d4ed8',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#0d9488',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1d4ed8',
                      },
                    },
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                  >
                    Login as {roleDetails[role].name}
                  </Button>
                </motion.div>
              </Box>
            </motion.div>

            <Typography
              variant="body2"
              className="text-center text-gray-600 mt-6"
            >
              Don't have an account?{" "}
              <a
                href={roleDetails[role].registerLink}
                className="text-teal-600 hover:text-blue-600 font-semibold transition-colors"
              >
                Sign up here
              </a>
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </div>  );
};

export default TestLoginPage;