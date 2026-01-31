import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../services/api";
import "./Signup.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

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

      await api.post("/api/auth/signup", form);

      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const googleSignup = async (credentialResponse) => {
    try {
      const res = await api.post("/api/auth/google", {
        id_token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);

      alert("Google signup successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(
        "Google signup failed: " +
          (err.response?.data?.message || "Please try again.")
      );
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Create Account </h2>
        <p className="subtitle">Join us and get started</p>

        <div className="input-group">
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button className="signup-btn" onClick={register}>
          Create Account
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-btn">
          <GoogleLogin
            onSuccess={googleSignup}
            onError={() => alert("Google signup failed")}
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <p className="login-text">
          Already have an account?
          <span onClick={() => navigate("/login")}>
            {" "}Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
