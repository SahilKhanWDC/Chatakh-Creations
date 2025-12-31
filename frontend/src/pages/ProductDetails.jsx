import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const VITE_API_URL = "http://localhost:5000";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    api.get(`/api/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, size, qty: quantity });
    setAdded(true);
    setTimeout(() => navigate("/cart"), 1000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* BREADCRUMB */}
        <div className="mb-8 flex items-center gap-2 text-gray-400">
          <button onClick={() => navigate(-1)} className="hover:text-blue-400 transition-colors font-semibold">
            ← Back
          </button>
          <span>/</span>
          <span className="text-blue-400 font-semibold capitalize">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-slate-900 rounded-2xl p-6 md:p-10 shadow-lg">
          {/* IMAGE GALLERY */}
          <div className="flex flex-col gap-4">
            {/* MAIN IMAGE WITH SLIDERS */}
            <div className="relative w-full aspect-square flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl">
              <img
                src={
                  product.images && product.images.length > 0
                    ? `${VITE_API_URL}${product.images[selectedImageIndex]}`
                    : "/placeholder.png"
                }
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
              
              {/* LEFT SLIDER BUTTON */}
              {product.images && product.images.length > 1 && (
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* RIGHT SLIDER BUTTON */}
              {product.images && product.images.length > 1 && (
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* IMAGE COUNTER */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* THUMBNAIL GALLERY */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-3 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-blue-400 shadow-lg shadow-blue-400/50"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={`${VITE_API_URL}${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                {product.name}
              </h1>

              {/* PRICE */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-2">Price</p>
                <p className="text-5xl font-bold text-blue-400">₹{product.price}</p>
              </div>

              {/* SIZE SELECT */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white mb-3">Select Size</label>
                <div className="flex gap-3 flex-wrap">
                  {["S", "M", "L", "XL", "XXL"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-12 h-12 rounded-lg font-bold transition-all duration-300 ${size === s
                        ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-400/50 scale-110"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600 border-2 border-slate-600 hover:border-blue-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all duration-300 border-2 border-slate-600 hover:border-blue-400"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-12 text-center text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all duration-300 border-2 border-slate-600 hover:border-blue-400"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 ${
                added
                  ? "bg-blue-500 text-white"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-400/50"
              }`}
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* DESCRIPTION SECTION AT BOTTOM */}
        <div className="mt-8 bg-slate-900 rounded-2xl p-6 md:p-10 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Product Description</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
