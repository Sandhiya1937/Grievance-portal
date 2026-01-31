import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../services/api";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      if (!form.email || !form.password) {
        alert("Please fill in all fields");
        return;
      }

      const res = await api.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const res = await api.post("/api/auth/google", {
        id_token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);

      alert("Google login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(
        "Google login failed: " +
          (err.response?.data?.message || "Please try again.")
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back </h2>
        <p className="subtitle">Login to continue</p>

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
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button className="login-btn" onClick={login}>
          Login
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-btn">
          <GoogleLogin
            onSuccess={googleLogin}
            onError={() => alert("Google login failed")}
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <p className="signup-text">
          New User?
          <span onClick={() => navigate("/signup")}>
            {" "}Create an account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
