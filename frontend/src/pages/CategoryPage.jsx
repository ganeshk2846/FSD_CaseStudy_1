import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { fetchDummyCategoryProducts } from "../services/dummyProducts";
import "../styles/SearchResults.css";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchDummyCategoryProducts(category)
      .then((items) => setProducts(items))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="search-results-container">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>

      {products.length === 0 ? (
        <p className="no-results">No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {totalItems > 0 && (
        <button className="goto-cart-btn" onClick={() => navigate("/cart")}>
          🛒 Go to Cart ({totalItems})
        </button>
      )}
    </div>
  );
};

export default CategoryPage;