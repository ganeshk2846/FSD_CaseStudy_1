import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false, // keep false since JWT is in localStorage
  headers: {
    "Content-Type": "application/json"
  }
});

/* ==============================
   REQUEST INTERCEPTOR
   Attach JWT token
================================ */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==============================
   RESPONSE INTERCEPTOR
   Handle token expiry / auth errors
================================ */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Server unreachable
    if (!error.response) {
      alert("Server is not reachable. Please try again later.");
      return Promise.reject(error);
    }

    // Unauthorized / Token expired
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Avoid infinite redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
