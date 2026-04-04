import { useCategories } from "../context/CategoryContext";
import { useNavigate } from "react-router-dom";
import "../styles/CategoryStrip.css";

// emoji map for common categories
const categoryEmojis = {
  beauty: "💄",
  fragrances: "🌸",
  furniture: "🛋️",
  groceries: "🛒",
  "home-decoration": "🏠",
  "kitchen-accessories": "🍳",
  laptops: "💻",
  "mens-shirts": "👔",
  "mens-shoes": "👟",
  "mens-watches": "⌚",
  "mobile-accessories": "📱",
  motorcycles: "🏍️",
  "skin-care": "✨",
  smartphones: "📱",
  "sports-accessories": "⚽",
  sunglasses: "🕶️",
  tablets: "📲",
  tops: "👕",
  vehicle: "🚗",
  "womens-bags": "👜",
  "womens-dresses": "👗",
  "womens-jewellery": "💍",
  "womens-shoes": "👠",
  "womens-watches": "⌚",
};

const CategoryStrip = () => {
  const { categories, loading } = useCategories();
  const navigate = useNavigate();

  if (loading || categories.length === 0) return null;

  return (
    <div className="category-strip-wrapper">
      <div className="category-strip">
        {categories.map((cat) => (
          <div
            key={cat}
            className="category-chip"
            onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
          >
            <span className="cat-emoji">{categoryEmojis[cat.toLowerCase()] || "🏷️"}</span>
            <span className="cat-label">
              {cat.replace(/-/g, " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryStrip;