import axios from "axios";

// Use environment variable if available, otherwise use the deployed URL
const API = process.env.REACT_APP_API_URL || "https://grievance-portal-9amn.onrender.com/api";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API,
  timeout: 10000, // 10 seconds timeout
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
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error Details:", {
      status: error.response?.status,
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      }
    });
    
    // Handle network errors (backend not reachable)
    if (!error.response) {
      console.error("Network error - Backend might be down or unreachable");
      alert("Cannot connect to server. Please check your internet connection or try again later.");
      
      // Don't clear storage for network errors - user might come back online
      return Promise.reject(error);
    }
    
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
      alert("You don't have permission to access this resource.");
    }
    
    // Handle other common errors
    if (error.response?.status === 404) {
      console.log("API endpoint not found:", error.config?.url);
    }
    
    if (error.response?.status === 500) {
      console.log("Server error occurred");
      alert("Server error. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

// Helper function for regular axios calls (without interceptor)
export const api = axios.create({
  baseURL: API,
  timeout: 10000,
});

// Helper to decode JWT token
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
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
  return decoded?.role || localStorage.getItem("userRole");
};

// Helper to check if token is expired
export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return decoded.exp * 1000 < Date.now();
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  return !isTokenExpired();
};

// Helper to get user data from token
export const getUserData = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return {
    id: decoded?.id,
    role: decoded?.role,
    exp: decoded?.exp,
    iat: decoded?.iat
  };
};

// Helper to log out user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userData");
  window.location.href = "/login";
};