import axios from "axios";

const API = "http://localhost:5000/api";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API,
});

// Add request interceptor to attach token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log("Token invalid/expired, redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
      
      // Only redirect if not already on login/signup page
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        window.location.href = "/login";
      }
    }
    
    if (error.response?.status === 403) {
      console.log("Access denied - insufficient permissions");
    }
    
    return Promise.reject(error);
  }
);

// Helper function for regular axios calls (without interceptor)
export const api = axios.create({
  baseURL: API,
});

// Helper to decode JWT token
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Helper to get user role
export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

// Helper to check if token is expired
export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return decoded.exp * 1000 < Date.now();
};