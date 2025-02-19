import { createContext, useState, useEffect } from "react";

// Create UserContext
export const UserContext = createContext();

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [donorId, setDonorId] = useState(localStorage.getItem("donorId") || null);

  useEffect(() => {
    const storedDonorId = localStorage.getItem("donorId");
    if (storedDonorId) {
      setDonorId(storedDonorId);
    //   console.log("Donor ID from localStorage:", storedDonorId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, donorId, setDonorId }}>
      {children}
    </UserContext.Provider>
  );
};
