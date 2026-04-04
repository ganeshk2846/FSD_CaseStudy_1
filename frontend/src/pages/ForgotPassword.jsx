import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpassword
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1 — Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, otp, newPassword });
      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: step >= s ? "#f5a623" : "#ddd",
              color: step >= s ? "#fff" : "#999",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700
            }}>{s}</div>
          ))}
        </div>

        {/* STEP 1 — Email */}
        {step === 1 && (
          <>
            <h2>Forgot Password</h2>
            <p style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>
              Enter your email to receive an OTP
            </p>
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <>
            <h2>Enter OTP</h2>
            <p style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>
              OTP sent to <b>{email}</b>
            </p>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
            <p style={{ marginTop: 12, fontSize: 13 }}>
              Didn't receive?{" "}
              <span
                style={{ color: "#f5a623", cursor: "pointer" }}
                onClick={() => { setStep(1); setOtp(""); }}
              >
                Resend OTP
              </span>
            </p>
          </>
        )}

        {/* STEP 3 — New Password */}
        {step === 3 && (
          <>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <p style={{ marginTop: 16 }}>
          <a href="/login">← Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;