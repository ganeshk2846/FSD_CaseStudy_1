import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // ✅ Forgot password fields
    resetOtp: { type: String, select: false },
    resetOtpExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);