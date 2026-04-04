import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Checkout.css";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCOD = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/orders", {
        items: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress: address,
        paymentMethod: "cod",
      });
      clearCart();
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load payment gateway. Check your internet.");
        setLoading(false);
        return;
      }

      const { data } = await API.post("/payment/create-order", {
        items: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress: address,
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Digi Mart",
        description: `Order #${data.orderId}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: localStorage.getItem("userEmail") || "",
        },
        theme: { color: "#FFD814" },

        handler: async (response) => {
          try {
            await API.post("/payment/verify", {
              orderId: data.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/order-success/${data.orderId}`);
          } catch {
            alert("Payment verification failed. Contact support.");
          }
        },

        modal: {
          ondismiss: async () => {
            await API.post("/payment/failed", { orderId: data.orderId });
            setLoading(false);
            alert("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async (response) => {
        await API.post("/payment/failed", { orderId: data.orderId });
        setLoading(false);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
      setLoading(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty");
    paymentMethod === "cod" ? await handleCOD() : await handleOnlinePayment();
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        {/* LEFT */}
        <div className="checkout-left">
          <div className="checkout-card">
            <h2>Shipping Address</h2>
            <form onSubmit={handlePlaceOrder} className="address-form">

              <div className="form-row-two">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="fullName" placeholder="Enter full name"
                    value={address.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input name="phone" placeholder="10-digit phone"
                    value={address.phone} onChange={handleChange} required maxLength={10} />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input name="addressLine" placeholder="House no, Street, Area"
                  value={address.addressLine} onChange={handleChange} required />
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>City *</label>
                  <input name="city" placeholder="City"
                    value={address.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input name="state" placeholder="State"
                    value={address.state} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input name="pincode" placeholder="6-digit pincode"
                  value={address.pincode} onChange={handleChange} required maxLength={6} />
              </div>

              {/* Payment Method */}
              <div className="payment-section">
                <h2>Payment Method</h2>
                <div className="payment-options">

                  <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                    <input type="radio" name="payment" value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")} />
                    <span className="payment-icon">💵</span>
                    <div>
                      <p className="payment-label">Cash on Delivery</p>
                      <p className="payment-desc">Pay when your order arrives</p>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === "online" ? "selected" : ""}`}>
                    <input type="radio" name="payment" value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")} />
                    <span className="payment-icon">💳</span>
                    <div>
                      <p className="payment-label">Pay Online</p>
                      <p className="payment-desc">UPI · Cards · Net Banking via Razorpay</p>
                    </div>
                  </label>

                </div>
              </div>

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading
                  ? "Processing..."
                  : paymentMethod === "online"
                  ? `💳 Pay ₹${totalAmount.toFixed(2)} Online`
                  : `Place Order • ₹${totalAmount.toFixed(2)}`}
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <div className="checkout-card">
            <h2>Order Summary ({cart.length} items)</h2>
            <div className="order-items">
              {cart.map((item) => (
                <div className="order-item" key={item._id}>
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="order-item-info">
                    <p className="order-item-title">{item.title}</p>
                    <p className="order-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Test card info */}
            {paymentMethod === "online" && (
              <div className="test-info">
                <p>🧪 <strong>Test Mode Credentials</strong></p>
                <p>Card: 4111 1111 1111 1111</p>
                <p>Expiry: Any future date</p>
                <p>CVV: Any 3 digits · OTP: 1234</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
