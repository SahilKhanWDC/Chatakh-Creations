import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const baseURL = import.meta.env.VITE_API_URL || window.location.origin;
const api = axios.create({
  baseURL,
});

// Add a request interceptor to include the Clerk token
export const setupAxiosInterceptors = (getToken) => {
  api.interceptors.request.use(async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error getting token:", err);
    }
    return config;
  });
};

export default api;
