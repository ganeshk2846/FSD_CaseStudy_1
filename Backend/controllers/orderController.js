import Order from "../db_models/Order.js";
import Product from "../db_models/Product.js";

// ─── Place Order ────────────────────────────────────────────────
export const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Calculate total from DB prices (don't trust client prices)
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for: ${product.title}` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        quantity: item.quantity,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Place order error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── Get My Orders ────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Order By ID ─────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow owner or admin
    if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Cancel Order ────────────────────────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── ADMIN: Get All Orders ───────────────────────────────────────
export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── ADMIN: Update Order Status ──────────────────────────────────
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
