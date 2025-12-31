import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: {
    type: String,
    enum: ["men", "women", "couple", "accessory"]
  },
  subcategory: String,
  sizes: [String],
  images: [String],
  stock: Number
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
