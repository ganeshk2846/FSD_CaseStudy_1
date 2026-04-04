import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/admin/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card blue">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-label">Total Products</p>
            <h2 className="stat-value">{stats.totalProducts}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <span className="stat-icon">👥</span>
          <div>
            <p className="stat-label">Total Users</p>
            <h2 className="stat-value">{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="stat-card red">
          <span className="stat-icon">⚠️</span>
          <div>
            <p className="stat-label">Low Stock Items</p>
            <h2 className="stat-value">{stats.lowStockProducts.length}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Low Stock Alert */}
        <div className="dash-card">
          <h3>⚠️ Low Stock Alert</h3>
          {stats.lowStockProducts.length === 0 ? (
            <p className="empty-msg">All products are well stocked</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell">
                        <img src={p.thumbnail} alt={p.title} />
                        <span>{p.title}</span>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <span className={`stock-badge ${p.stock === 0 ? "out" : "low"}`}>
                        {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Products */}
        <div className="dash-card">
          <h3>🆕 Recent Products</h3>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProducts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="product-cell">
                      <img src={p.thumbnail} alt={p.title} />
                      <span>{p.title}</span>
                    </div>
                  </td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="view-all-btn" onClick={() => navigate("/admin/products")}>
            View All Products →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
