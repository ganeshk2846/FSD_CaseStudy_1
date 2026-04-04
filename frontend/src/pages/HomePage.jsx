import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CategoryStrip from "../components/CategoryStrip";
import "../styles/HomePage.css";


const HomePage = () => {
  const { products, loading } = useProducts();
  const { totalItems } = useCart();
  const navigate = useNavigate();


  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading products...</h2>;
  }


  return (
    <div className="home-container">
       <CategoryStrip />
      { /*<h1>Digi Mart</h1>  */ }

      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {totalItems > 0 && (
        <button
          className="goto-cart-btn"
          onClick={() => navigate("/cart")}
        >
          🛒 Go to Cart ({totalItems})
        </button>
      )}
    </div>
  );
};

export default HomePage;
