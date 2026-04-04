import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>

        <form onSubmit={handleRegister}>
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <button type="submit">Register</button>
        </form>

        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;
