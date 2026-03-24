import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || window.location.origin;
const api = axios.create({
  baseURL,
  timeout: 10000,
});

export const setupAxiosInterceptors = (getToken) => {
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Failed to get token:", err);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized - clearing auth");
      }
      return Promise.reject(error);
    }
  );
};

export default api;
