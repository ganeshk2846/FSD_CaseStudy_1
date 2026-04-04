import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

