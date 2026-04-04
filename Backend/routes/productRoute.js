import express from "express";
import {
  getAllProducts,
  getProductById,
  searchProducts,
  getCategories,           // ← new
  getProductsByCategory    // ← new
} from "../controllers/productController.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/categories", getCategories);           // ← new  GET /products/categories
router.get("/category/:category", getProductsByCategory); // ← new  GET /products/category/electronics
router.get("/:id", getProductById);
router.get("/", getAllProducts);

export default router;