import { useNavigate } from "react-router-dom";

const VITE_API_URL = "http://localhost:5000";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const imageUrl =
    product.images && product.images.length > 0
      ? `${VITE_API_URL}${product.images[0]}`
      : null;

  return (
    <div className="group bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-blue-400 transition-all duration-300 hover:scale-105 cursor-pointer w-full h-full flex flex-col">
      {/* IMAGE CONTAINER */}
      <div className="relative overflow-hidden bg-slate-700 aspect-square flex-shrink-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center gap-2">
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">₹{product.price}</p>
          <div className="bg-blue-500/20 text-blue-400 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/50">
            In Stock
          </div>
        </div>

        <button
          onClick={() => navigate(`/product/${product._id}`)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 active:scale-95 shadow-md shadow-blue-400/50 hover:shadow-lg text-sm sm:text-base"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
