import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/OrderSuccess.css";

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="os-loading">Loading...</div>;
  if (!order) return <div className="os-loading">Order not found</div>;

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="os-container">
      {/* Success Banner */}
      <div className="os-banner">
        <div className="os-checkmark">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p>Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong></p>
      </div>

      {/* Status Tracker */}
      <div className="os-card">
        <h2>Order Status</h2>
        <div className="status-tracker">
          {statusSteps.map((step, i) => (
            <div key={step} className={`status-step ${i <= currentStep ? "done" : ""} ${i === currentStep ? "active" : ""}`}>
              <div className="step-dot">{i < currentStep ? "✓" : i + 1}</div>
              <p className="step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</p>
              {i < statusSteps.length - 1 && (
                <div className={`step-line ${i < currentStep ? "done" : ""}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="os-grid">
        {/* Order Items */}
        <div className="os-card">
          <h2>Items Ordered</h2>
          {order.items.map((item, i) => (
            <div className="os-item" key={i}>
              <img src={item.thumbnail} alt={item.title} />
              <div className="os-item-info">
                <p className="os-item-title">{item.title}</p>
                <p className="os-item-qty">Qty: {item.quantity}</p>
              </div>
              <p className="os-item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="os-total">
            <span>Total Paid</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="os-card">
          <h2>Delivery Address</h2>
          <div className="os-address">
            <p className="addr-name">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.addressLine}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p>Pincode: {order.shippingAddress.pincode}</p>
          </div>

          <div className="os-payment-info">
            <p>Payment: <strong>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</strong></p>
            <p>Status: <span className={`pay-status ${order.paymentStatus}`}>{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>

      <div className="os-actions">
        <button className="os-btn-orders" onClick={() => navigate("/my-orders")}>
          View All Orders
        </button>
        <button className="os-btn-home" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
