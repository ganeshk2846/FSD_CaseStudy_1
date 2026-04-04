import Product from "../db_models/Product.js";
import User from "../db_models/User.js";
import Order from "../db_models/Order.js";
// ─── DASHBOARD ───────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select("title stock thumbnail category")
      .limit(5);
    const recentProducts = await Product.find()
      .sort({ _id: -1 })
      .limit(5)
      .select("title price category stock thumbnail");
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    res.json({
      totalProducts,
      totalUsers,
      lowStockProducts,
      recentProducts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── PRODUCT MANAGEMENT ──────────────────────────────────────────
export const adminGetAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const adminAddProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock, thumbnail, images } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Title, price and category are required" });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      thumbnail,
      images: images || [],
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Add product error:", err.message); // ✅ log exact error
    res.status(500).json({ message: err.message });   // ✅ send to frontend
  }
};
export const adminUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── USER MANAGEMENT ─────────────────────────────────────────────
export const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const adminUpdateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent demoting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};