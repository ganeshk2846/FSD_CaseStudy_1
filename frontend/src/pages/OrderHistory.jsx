import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/OrderHistory.css";

const statusColors = {
  pending: "#f5a623",
  confirmed: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <div className="oh-loading">Loading orders...</div>;

  return (
    <div className="oh-container">
      <h1 className="oh-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="oh-empty">
          <p>📦 No orders yet</p>
          <button onClick={() => navigate("/")}>Start Shopping</button>
        </div>
      ) : (
        <div className="oh-list">
          {orders.map((order) => (
            <div className="oh-card" key={order._id}>
              {/* Order Header */}
              <div className="oh-header">
                <div>
                  <p className="oh-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="oh-date">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
                <div className="oh-header-right">
                  <span
                    className="oh-status"
                    style={{ background: `${statusColors[order.status]}20`, color: statusColors[order.status] }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="oh-total">₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="oh-items">
                {order.items.map((item, i) => (
                  <div className="oh-item" key={i}>
                    <img src={item.thumbnail} alt={item.title} />
                    <div className="oh-item-info">
                      <p className="oh-item-title">{item.title}</p>
                      <p className="oh-item-meta">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="oh-item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="oh-footer">
                <div className="oh-address-mini">
                  📍 {order.shippingAddress.city}, {order.shippingAddress.state}
                  &nbsp;•&nbsp;
                  {order.paymentMethod === "cod" ? "💵 COD" : "💳 Online"}
                </div>
                <div className="oh-actions">
                  <button
                    className="oh-btn-detail"
                    onClick={() => navigate(`/order-success/${order._id}`)}
                  >
                    View Details
                  </button>
                  {["pending", "confirmed"].includes(order.status) && (
                    <button
                      className="oh-btn-cancel"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
