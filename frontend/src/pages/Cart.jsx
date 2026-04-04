import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const Cart = () => {
  const { cart, addToCart, removeFromCart, decreaseQty, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <img src="src/assets/emptycart.png" alt="Empty Cart" />
        <button className="add-more-btn" onClick={() => navigate("/")}>
          + Add More Items
        </button>
      </div>
    );
  }

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cart.map(item => (
        <div className="cart-item" key={item._id}>
          <img
            src={item.thumbnail}
            alt={item.title}
            onClick={() => navigate(`/product/${item._id}`)}
          />
          <div className="cart-info">
            <h3>{item.title}</h3>
            <p className="cart-price">₹{item.price}</p>
            <div className="qty-controls">
              <button onClick={() => decreaseQty(item._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => addToCart(item)}>+</button>
            </div>
          </div>
          <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
            Remove
          </button>
        </div>
      ))}

      <div className="add-more-container">
        <button className="add-more-btn" onClick={() => navigate("/")}>
          + Add More Items
        </button>
      </div>

      <div className="cart-summary">
        <h2>Total: ₹{totalAmount.toFixed(2)}</h2>

        {/* ✅ Navigate to checkout */}
        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>

        <button className="clear-cart" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
