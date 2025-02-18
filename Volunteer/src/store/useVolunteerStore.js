import { create } from "zustand";
import { persist } from "zustand/middleware";  // Import persist middleware
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useVolunteerStore = create(
  persist(
    (set, get) => ({
      volunteer: null,
      isRegistering: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineVolunteers: [],
      events: [],
      members:[],
      socket: null,

      login: async (data) => {
        set({ isLoggingIn: true });
    
        try {
            const res = await axiosInstance.post("/volunteers/login", data);
            console.log("Response Data:", res.data);
    
            if (res.data && res.data._id) {
                set({ volunteer: res.data });
                if (res.status === 200) {
                    toast.success("Logged in successfully");
                }
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    signup: async (data) => {
      set({ isRegistering: true });
  
      try {
          const formData = new FormData();
  
          // Append regular fields
          formData.append("email", data.email);
          formData.append("fullName", data.fullName);
          formData.append("password", data.password);
          formData.append("volunteerType", data.volunteerType);
          formData.append("organizationName", data.organizationName || "");
          formData.append("contactPerson", data.contactPerson || "");
          formData.append("dob", data.dob || "");
          formData.append("gender", data.gender || "");
          formData.append("contactNumber", data.contactNumber);
          formData.append("aadhaarNumber", data.aadhaarNumber || "");
          formData.append("city", data.city);
          formData.append("agreement", data.agreement);
  
          // Append location as JSON
          formData.append("location", JSON.stringify(data.location));
  
          // Convert base64 Aadhaar file to Blob and append
          if (data.aadhaarFile) {
              const blob = await fetch(data.aadhaarFile).then((res) => res.blob());
              formData.append("aadhaarFile", blob, "aadhaar.jpg");
          }
  
          const res = await axiosInstance.post("/volunteers/signUp", formData, {
              headers: { "Content-Type": "multipart/form-data" },
          });
  
          console.log("Signup Response:", res.data);
  
          if (res.data && res.data._id) {
              set({ volunteer: res.data });
              if (res.status === 201) {
                  toast.success("Signed up successfully", { duration: 2000 });
                  window.location.href = "/";
              }
          } else {
              throw new Error("Invalid response format");
          }
      } catch (error) {
          console.error("Signup error:", error);
          toast.error(error.response?.data?.message || "Signup failed", { duration: 2000 });
      } finally {
          set({ isRegistering: false });
      }
  },          createEvent: async (eventData) => {
        try {
          console.log("Event data:", eventData);
          const res = await axiosInstance.post("/events/create", eventData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      
          set((state) => ({ events: [...state.events, res.data.newEvent] }));
          toast.success("Event created successfully!");
        } catch (error) {
          console.error("Error creating event:", error);
          toast.error(error.response?.data?.message || "Event creation failed");
        }
      },
      
      fetchEvents: async () => {
        try {
          const res = await axiosInstance.get("/events/all");
          set({ events: res.data });
        } catch (error) {
          console.log("Error fetching events:", error);
        }
      },

      addMember: async (memberData) => {
        try {
          const res = await axiosInstance.post("/volunteers/addMember", memberData);
          console.log("Member added successfully:", res.data);
          toast.success("Member added successfully!");
          set((state) => ({
            members: [...state.members, res.data]
          }));
        } catch (error) {
          console.error("Error adding member:", error);
          toast.error(error.response?.data?.message || "Member addition failed");
        }
      },

      logout: async () => {
        try {
            console.log("Logging out...");
            const res = await axiosInstance.post("/volunteers/logout");
    
            if (res.status === 200) {
                toast.success("Logged out successfully");
                set({ volunteer: null });
            }
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },
    }
  ),
    {
      name: "volunteer-storage",
      getStorage: () => localStorage,
    }
  )
);
