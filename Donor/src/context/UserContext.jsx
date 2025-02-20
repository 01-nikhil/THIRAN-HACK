// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

//   useEffect(() => {
//     if (token) {
//       axios.get("http://localhost:5000/donor/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setUser(res.data))
//       .catch(() => {
//         setUser(null);
//         setToken("");
//         localStorage.removeItem("token");
//       });
//     }
//   }, [token]);

//   return (
//     <UserContext.Provider value={{ user, setUser, token, setToken }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
