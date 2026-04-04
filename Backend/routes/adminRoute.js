import express from "express";
import {
  getDashboardStats,
  adminGetAllProducts,
  adminAddProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetAllUsers,
  adminUpdateUserRole,
  adminDeleteUser,
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes are protected
router.use(protect, authorizeRoles("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Product management
router.get("/products", adminGetAllProducts);
router.post("/products", adminAddProduct);
router.put("/products/:id", adminUpdateProduct);
router.delete("/products/:id", adminDeleteProduct);

// User management
router.get("/users", adminGetAllUsers);
router.put("/users/:id/role", adminUpdateUserRole);
router.delete("/users/:id", adminDeleteUser);

export default router;
