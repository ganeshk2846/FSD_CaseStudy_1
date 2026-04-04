import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  adminGetAllOrders,
  adminUpdateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

// Admin routes
router.get("/admin/all", protect, authorizeRoles("admin"), adminGetAllOrders);
router.put("/admin/:id/status", protect, authorizeRoles("admin"), adminUpdateOrderStatus);

export default router;
