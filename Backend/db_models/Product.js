import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  thumbnail: String,
  images: [String],
  brand: String,
  rating: { type: Number, default: 0 },
  discountPercentage: { type: Number, default: 0 },
  availabilityStatus: { type: String, default: "In Stock" },
  sku: String,
  weight: Number,
  warrantyInformation: String,
  shippingInformation: String,
  returnPolicy: String,
  minimumOrderQuantity: { type: Number, default: 1 },
  tags: [String],
});

export default mongoose.model("Products", productSchema);