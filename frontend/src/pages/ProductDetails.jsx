import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { cart, addToCart, decreaseQty } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <h2 className="loading">Loading product...</h2>;

  // Combine thumbnail + images, remove duplicates
  const allImages = [
    product.thumbnail,
    ...(product.images || [])
  ].filter((img, i, arr) => img && arr.indexOf(img) === i);

  const cartItem = cart.find(item => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const discountPct = product.discountPercentage || 10;
  const originalPrice = Math.ceil(product.price / (1 - discountPct / 100));
  const savings = originalPrice - Math.ceil(product.price);

  return (
    <div className="pd-container">

      {/* LEFT — Images */}
      <div className="pd-left">

        {/* Main Image */}
        <div className="pd-main-img-wrap">
          <img
            src={allImages[selectedImg]}
            alt={product.title}
            className="pd-main-img"
            key={selectedImg}
          />
        </div>

        {/* Thumbnail Strip */}
        {allImages.length > 1 && (
          <div className="pd-thumbnails">
            {allImages.map((img, i) => (
              <div
                key={i}
                className={`pd-thumb ${i === selectedImg ? "active" : ""}`}
                onClick={() => setSelectedImg(i)}
              >
                <img src={img} alt={`view ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — Info */}
      <div className="pd-right">

        {/* Category & Brand */}
        <div className="pd-meta">
          <span className="pd-category">{product.category}</span>
          {product.brand && <span className="pd-brand">{product.brand}</span>}
        </div>

        <h1 className="pd-title">{product.title}</h1>

        {/* Rating */}
        {product.rating && (
          <div className="pd-rating">
            <span className="pd-stars">⭐ {product.rating}</span>
            <span className="pd-rating-label">/ 5</span>
          </div>
        )}

        {/* Price */}
        <div className="pd-price-block">
          <span className="pd-price">₹{Math.ceil(product.price)}</span>
          <span className="pd-original">₹{originalPrice}</span>
          <span className="pd-discount">{discountPct}% OFF</span>
        </div>

        <p className="pd-savings">You save ₹{savings}</p>

        {/* Availability */}
        <p className={`pd-availability ${product.stock === 0 ? "out" : "in"}`}>
          {product.stock === 0 ? "Out of Stock" : `✓ In Stock (${product.stock} left)`}
        </p>

        {/* Description */}
        <p className="pd-description">{product.description}</p>

        {/* Extra Details */}
        <div className="pd-details">
          {product.weight     && <div className="pd-detail-row"><span>Weight</span><span>{product.weight}g</span></div>}
          {product.sku        && <div className="pd-detail-row"><span>SKU</span><span>{product.sku}</span></div>}
          {product.warrantyInformation  && <div className="pd-detail-row"><span>Warranty</span><span>{product.warrantyInformation}</span></div>}
          {product.shippingInformation  && <div className="pd-detail-row"><span>Shipping</span><span>{product.shippingInformation}</span></div>}
          {product.returnPolicy         && <div className="pd-detail-row"><span>Returns</span><span>{product.returnPolicy}</span></div>}
          {product.minimumOrderQuantity && <div className="pd-detail-row"><span>Min. Order</span><span>{product.minimumOrderQuantity}</span></div>}
        </div>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="pd-tags">
            {product.tags.map((tag, i) => (
              <span key={i} className="pd-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Add to Cart */}
        <div className="pd-cart-section">
          {quantity === 0 ? (
            <button className="pd-add-btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          ) : (
            <div className="pd-qty-controls">
              <button className="pd-qty-btn" onClick={() => decreaseQty(product._id)}>−</button>
              <span className="pd-qty-num">{quantity}</span>
              <button className="pd-qty-btn" onClick={() => addToCart(product)}>+</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
