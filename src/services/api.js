import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to normalize error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract standard error message from backend if available
    const backendMessage = error.response?.data?.message;
    const customError = new Error(backendMessage || error.message || "An unexpected error occurred.");
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    customError.isConflict = error.response?.status === 409;
    return Promise.reject(customError);
  }
);

export default api;

