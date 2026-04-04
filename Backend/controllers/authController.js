import User from "../db_models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Step 1 — Send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with that email" });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.resetOtp = otp;
    user.resetOtpExpiry = expiry;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password error:",err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Step 2 — Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email }).select("+resetOtp +resetOtpExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Step 3 — Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password +resetOtp +resetOtpExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" }); 
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET PROFILE ─────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── UPDATE PROFILE (name) ───────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true }
    );

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── CHANGE PASSWORD ─────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};