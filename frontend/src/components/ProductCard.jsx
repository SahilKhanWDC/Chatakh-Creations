import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  // Handle image URL - Cloudinary URLs are full URLs, local URLs need API prefix
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL (starts with http), use it directly
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Otherwise prepend the API URL
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${apiUrl}${imagePath}`;
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? getImageUrl(product.images[0])
      : null;

  return (
    <div className="group bg-[#fff6e9] border border-[#f5d9aa] rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-[#00aeb2] transition-all duration-300 hover:scale-105 cursor-pointer w-full h-full flex flex-col">
      {/* IMAGE CONTAINER */}
      <div className="relative overflow-hidden bg-[#fbe7c6] aspect-square shrink-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => console.error("Image failed to load:", imageUrl)}
          />
        )}
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-[#3b2a2a] line-clamp-2 group-hover:text-[#00aeb2] transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#7a5e4f] mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center gap-2">
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#ec0080]">₹{product.price}</p>
          <div className="bg-[#00aeb2]/10 text-[#007d80] px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border border-[#00aeb2]/50">
            In Stock
          </div>
        </div>

        <button
          onClick={() => navigate(`/product/${product._id}`)}
          className="w-full bg-[#ec0080] text-[#fff6e9] font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-[#c7006b] transition-all duration-300 active:scale-95 shadow-md shadow-[#ec0080]/40 hover:shadow-lg text-sm sm:text-base"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
