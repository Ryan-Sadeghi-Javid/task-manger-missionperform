// frontend/lib/api.ts

// Import Axios for making HTTP requests
import axios from "axios";

// Define the base URL for your backend API
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create a configured Axios instance with base settings
const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json", // Set default content type
  },
});

// Interceptor to automatically attach JWT token to every request (if available)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error) // Pass through any request errors
);

// Export a custom API utility with shorthand methods
export const api = {
  // Make a GET request to a given URL
  get: (url: string) => instance.get(url),

  // Make a POST request with data to a given URL
  post: (url: string, data: any) => instance.post(url, data),

  // Make a PUT request with data to update a resource
  put: (url: string, data: any) => instance.put(url, data),

  // Make a DELETE request to remove a resource
  delete: (url: string) => instance.delete(url),

  // Optional helper to manually set or remove the token
  setToken: (token: string | null) => {
    if (token) {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common.Authorization;
    }
  },
};