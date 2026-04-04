import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/admin/AdminOrders.css";

const statusColors = {
  pending: "#f5a623",
  confirmed: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    API.get("/orders/admin/all")
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await API.put(`/orders/admin/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: data.order.status } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="admin-orders">
      {/* Filter Tabs */}
      <div className="ao-filters">
        {["all", ...statusOptions].map((f) => (
          <button
            key={f}
            className={`ao-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ao-filter-count">
              {f === "all" ? orders.length : orders.filter((o) => o.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-msg">No orders found</div>
      ) : (
        <div className="ao-list">
          {filtered.map((order) => (
            <div className="ao-card" key={order._id}>
              {/* Order Row */}
              <div className="ao-row" onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}>
                <div className="ao-col">
                  <p className="ao-id">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="ao-date">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                </div>

                <div className="ao-col">
                  <p className="ao-customer">{order.userId?.name || "User"}</p>
                  <p className="ao-email">{order.userId?.email}</p>
                </div>

                <div className="ao-col">
                  <p className="ao-items">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                  <p className="ao-amount">₹{order.totalAmount.toFixed(2)}</p>
                </div>

                <div className="ao-col">
                  <select
                    className="ao-status-select"
                    value={order.status}
                    style={{ borderColor: statusColors[order.status], color: statusColors[order.status] }}
                    onChange={(e) => { e.stopPropagation(); handleStatusChange(order._id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="ao-col">
                  <span className={`ao-pay ${order.paymentStatus}`}>{order.paymentStatus}</span>
                  <p className="ao-method">{order.paymentMethod === "cod" ? "💵 COD" : "💳 Online"}</p>
                </div>

                <button className="ao-expand-btn">
                  {expandedId === order._id ? "▲" : "▼"}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedId === order._id && (
                <div className="ao-details">
                  <div className="ao-details-grid">
                    {/* Items */}
                    <div>
                      <h4>Items</h4>
                      {order.items.map((item, i) => (
                        <div className="ao-detail-item" key={i}>
                          <img src={item.thumbnail} alt={item.title} />
                          <span>{item.title}</span>
                          <span>×{item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Address */}
                    <div>
                      <h4>Shipping Address</h4>
                      <div className="ao-address">
                        <p><strong>{order.shippingAddress.fullName}</strong></p>
                        <p>{order.shippingAddress.phone}</p>
                        <p>{order.shippingAddress.addressLine}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
