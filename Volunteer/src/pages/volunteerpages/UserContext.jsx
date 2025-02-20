import { createContext, useState, useEffect } from "react";

// Create UserContext
export const UserContext = createContext();

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [volunteerId, setVolunteerId] = useState(localStorage.getItem("volunteerId") || null);

  useEffect(() => {
    const storedVolunteerId = localStorage.getItem("volunteerId");
    if (storedVolunteerId) {
      setVolunteerId(storedVolunteerId);
      console.log("Volunteer ID from localStorage:", storedVolunteerId);

      // Also load and set user data from localStorage if available
      const storedUserData = localStorage.getItem("volunteerData");
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
      }
    } else {
      console.log("No Volunteer ID found in localStorage");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, volunteerId, setVolunteerId }}>
      {children}
    </UserContext.Provider>
  );
};