import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../db_models/Order.js";
import Product from "../db_models/Product.js";

// ✅ Helper — creates instance fresh each time (env vars are loaded by then)
const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Create Razorpay Order ────────────────────────────────────────
export const createRazorpayOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

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
    }

    const razorpay = getRazorpay(); // ✅ created here, after dotenv is loaded

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: "online",
      paymentStatus: "pending",
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create Razorpay order error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── Verify Payment ───────────────────────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.status = "confirmed";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.json({ message: "Payment verified", order });
  } catch (err) {
    console.error("Verify payment error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── Payment Failed ───────────────────────────────────────────────
export const paymentFailed = async (req, res) => {
  try {
    const { orderId } = req.body;
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
      status: "cancelled",
    });
    res.json({ message: "Order marked as failed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};