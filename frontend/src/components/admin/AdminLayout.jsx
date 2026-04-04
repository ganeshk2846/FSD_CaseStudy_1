import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../utils/logout";
import { useCart } from "../../context/CartContext";
import "../../styles/admin/AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { loadCartForUser } = useCart();

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: "📊", end: true },
    { to: "/admin/products", label: "Products", icon: "📦" },
    { to: "/admin/orders", label: "Orders", icon: "📋" },   // ✅ added
    { to: "/admin/users", label: "Users", icon: "👥" },
  ];

  const currentLabel = navItems.find(n =>
    n.end
      ? window.location.pathname === n.to
      : window.location.pathname.startsWith(n.to)
  )?.label || "Admin Panel";

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-d">D</span>
          <span className="logo-text">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-user-btn"
            onClick={() => navigate("/")}
          >
            🏠 Go to Store
          </button>
          <button
            className="sidebar-logout-btn"
            onClick={() => logout(navigate, loadCartForUser)}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">{currentLabel}</h1>  {/* ✅ fixed */}
          <div className="admin-user-info">
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;