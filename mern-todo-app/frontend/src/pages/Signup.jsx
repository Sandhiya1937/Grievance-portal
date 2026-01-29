import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../services/api";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const register = async () => {
    try {
      if (!form.name || !form.email || !form.password) {
        alert("Please fill in all fields");
        return;
      }

      if (form.password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }

      const res = await api.post("/auth/signup", form);
      alert(`Registered successfully as ${res.data.role || "user"}! Please login.`);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const googleSignup = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        id_token: credentialResponse.credential
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      alert("Google signup successful!");
      
      if (res.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      alert("Google signup failed: " + (err.response?.data?.message || "Please try again."));
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <input
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password (min. 6 characters)"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={register}>Signup</button>

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <p>Or sign up with</p>
        <GoogleLogin 
          onSuccess={googleSignup} 
          onError={() => {
            console.log("Google Signup Failed");
            alert("Google signup failed. Please try again.");
          }}
          text="signup_with"
          theme="filled_blue"
          size="large"
          width="100%"
        />
      </div>

      <p 
        onClick={() => navigate("/login")} 
        style={{ 
          cursor: "pointer", 
          textAlign: "center", 
          color: "#007bff",
          marginTop: "20px"
        }}
      >
        Already have an account? Login
      </p>
    </div>
  );
}

export default Signup;