import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Services
import { decodeToken, isTokenExpired } from "./services/api";

// Your Google Client ID
const GOOGLE_CLIENT_ID = "811021052445-ar85h02iu5mqtejkehbm9kabbt9os0u9.apps.googleusercontent.com";

// Custom hook to get user role
const useAuth = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No token found");
        setUserRole(null);
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired()) {
        console.log("Token expired, clearing storage");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userData");
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const decoded = decodeToken(token);
        const role = decoded?.role || "user";
        
        console.log("Decoded token role:", role);
        localStorage.setItem("userRole", role);
        setUserRole(role);
      } catch (error) {
        console.error("Error parsing token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userData");
        setUserRole(null);
      }
      
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "userRole") {
        checkAuth();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { userRole, loading };
};

function AppContent() {
  const { userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px" 
      }}>
        Loading application...
      </div>
    );
  }

  console.log("Current path:", location.pathname);
  console.log("User role:", userRole);

  return (
    <Routes>
      {/* Redirect root "/" based on authentication */}
      <Route 
        path="/" 
        element={
          userRole ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } 
      />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected dashboard route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {userRole === "admin" ? <AdminDashboard /> : <UserDashboard />}
          </ProtectedRoute>
        }
      />

      {/* Separate admin route (optional) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;