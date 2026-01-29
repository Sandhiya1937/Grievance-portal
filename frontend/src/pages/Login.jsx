import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      if (!form.email || !form.password) {
        alert("Please fill in all fields");
        return;
      }

      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      alert("Login successful!");
      
      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/dashboard"); // Or "/admin/dashboard" if you have separate route
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        id_token: credentialResponse.credential
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      alert("Google login successful!");
      
      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed: " + (err.response?.data?.message || "Please try again."));
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={login}>Login</button>

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <p>Or continue with</p>
        <GoogleLogin 
          onSuccess={googleLogin} 
          onError={() => {
            console.log("Google Login Failed");
            alert("Google login failed. Please try again.");
          }}
          theme="filled_blue"
          size="large"
          width="100%"
        />
      </div>

      <p 
        onClick={() => navigate("/signup")} 
        style={{ 
          cursor: "pointer", 
          textAlign: "center", 
          color: "#007bff",
          marginTop: "20px"
        }}
      >
        New user? Signup
      </p>
    </div>
  );
}

export default Login;