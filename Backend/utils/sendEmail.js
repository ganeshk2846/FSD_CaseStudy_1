import nodemailer from "nodemailer";

export const sendOtpEmail = async (toEmail, otp) => {
  // ✅ Create transporter here so env vars are already loaded
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Digi Mart" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Password Reset OTP",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 8px; color: #f5a623;">${otp}</h1>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};