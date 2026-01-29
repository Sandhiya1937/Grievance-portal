import { Navigate } from "react-router-dom";
import { decodeToken, isTokenExpired } from "../services/api";

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  
  console.log("ProtectedRoute - Checking access...");
  console.log("Token exists:", !!token);
  
  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if token is expired
  if (isTokenExpired()) {
    console.log("Token expired, clearing and redirecting");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    return <Navigate to="/login" replace />;
  }

  // Get user role
  const decoded = decodeToken(token);
  const userRole = decoded?.role || localStorage.getItem("userRole");
  
  console.log("User role:", userRole);
  console.log("Required role:", requiredRole);

  // If route requires specific role and user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    console.log(`Access denied. User role: ${userRole}, Required: ${requiredRole}`);
    
    // Redirect admin to admin dashboard, user to user dashboard
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("Access granted, rendering children");
  return children;
}

export default ProtectedRoute;