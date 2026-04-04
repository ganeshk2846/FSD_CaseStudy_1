import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty } = useCart();

  // Find quantity of this product already in cart
  const cartItem = cart.find((item) => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Only show thumbnail (no auto scroll images)
  const image = product.thumbnail || product.images?.[0];

  // Discount calculation
  const discountPct =
    product.discountPercentage || Math.floor(Math.random() * 20 + 10);
  const originalPrice = Math.ceil(product.price / (1 - discountPct / 100));
  const savings = originalPrice - Math.ceil(product.price);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    decreaseQty(product._id);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image Section */}
      <div className="pc-img-wrapper">
        <img src={image} alt={product.title} className="pc-img" />

        {/* ADD / QTY */}
        <div
          className="pc-cart-btn-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          {quantity === 0 ? (
            <button className="pc-add-btn" onClick={handleAdd}>
              ADD
            </button>
          ) : (
            <div className="pc-qty-controls">
              <button className="pc-qty-btn" onClick={handleDecrease}>
                −
              </button>
              <span className="pc-qty-num">{quantity}</span>
              <button className="pc-qty-btn" onClick={handleAdd}>
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="pc-info">
        <div className="pc-price-row">
          <span className="pc-price">₹{Math.ceil(product.price)}</span>
          <span className="pc-original">₹{originalPrice}</span>
        </div>

        <p className="pc-savings">₹{savings} OFF</p>

        <p className="pc-title">{product.title}</p>

        {product.rating && (
          <div className="pc-rating">
            <span className="pc-star">⭐</span>
            <span>{product.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;