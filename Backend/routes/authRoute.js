import express from "express";
import {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,       
  updateProfile,    
  changePassword,   
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// Protected — profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
