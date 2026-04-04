import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { loadCartForUser } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      const newUserId = data.user._id;


      // ✅ Save auth info
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", newUserId);
      // ✅ Load correct cart for this user into React state immediately
      loadCartForUser(newUserId);

      navigate(data.user.role === "admin" ? "/admin" : "/", {
        replace: true,
      });

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
        <p>
          <a href="/forgot-password">Forgot Password?</a>  {/* ✅ add this */}
        </p>
      </div>
    </div>
  );
};

export default Login;
