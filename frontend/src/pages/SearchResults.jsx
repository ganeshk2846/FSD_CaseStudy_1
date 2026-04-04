import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const query = searchParams.get("query");
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    setLoading(true);
    setError("");

    API.get(`/products/search?query=${encodeURIComponent(query)}`, {
      signal: controller.signal
    })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        if (err.name === "CanceledError") return;
        setError(err.response?.data?.message || "Search failed");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();

  }, [query]);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Searching...</h2>;
  }

  return (
    <div className="search-results-container">
      <h1>Search Results for "{query}"</h1>

      {error && <p className="error-message">{error}</p>}

      {products.length === 0 && !error ? (
        <p className="no-results">No products found. Try a different search.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
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

export default SearchResults;