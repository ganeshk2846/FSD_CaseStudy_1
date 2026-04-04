import '../styles/Navbar.css';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logout } from "../utils/logout";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { totalItems, loadCartForUser } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get first letter of user name or email for avatar
  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const avatarLetter = (userName || userEmail || "U").charAt(0).toUpperCase();

  const showBackBtn =
    location.pathname.includes("/product/") ||
    location.pathname.includes("/search") ||
    location.pathname.includes("/cart") ||
    location.pathname.includes("/category/") ||
    location.pathname.includes("/checkout") ||
    location.pathname.includes("/order") ||
    location.pathname.includes("/profile") ||
    location.pathname.includes("/my-orders") ;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  if (!token) return null;

  return (
    <nav className="navbar">
      {showBackBtn && (
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          title="Go Back"
        >
          ⟨
        </button>
      )}

      <Link to="/" className="logo">Digi Mart</Link>

      <SearchBar />

      <div className="nav-actions">
        {/* Cart */}
        <Link to="/cart" className="cart-link">
          🛒 Cart
          {totalItems > 0 && (
            <span className="cart-count">{totalItems}</span>
          )}
        </Link>

        
        {/* Profile Avatar + Dropdown */}
        <div className="profile-wrapper" ref={dropdownRef}>
          <button
            className="profile-avatar"
            onClick={() => setDropdownOpen((prev) => !prev)}
            title="Profile"
          >
            {avatarLetter}
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              {/* User Info */}
              <div className="dropdown-user-info">
                <div className="dropdown-avatar">{avatarLetter}</div>
                <div>
                  {userName && <p className="dropdown-name">{userName}</p>}
                  {userEmail && <p className="dropdown-email">{userEmail}</p>}
                </div>
              </div>

              <div className="dropdown-divider" />

              <Link to="/profile" className="dropdown-item">
                👤 My Profile
              </Link>
              <Link to="/my-orders" className="dropdown-item">
                📦 My Orders
              </Link>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item dropdown-logout"
                onClick={() => logout(navigate, loadCartForUser)}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
