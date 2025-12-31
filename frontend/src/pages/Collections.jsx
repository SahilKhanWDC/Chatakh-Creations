import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Collections = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(categoryParam || "all");
  const [subcategory, setSubcategory] = useState("all");
  const [loading, setLoading] = useState(false);

  // Define subcategories for each category
  const subcategoryMap = {
    men: [
      { value: "all", label: "All Men's" },
      { value: "shirts", label: "Shirts" },
      { value: "pants", label: "Pants" },
      { value: "tshirts", label: "T-Shirts" },
      { value: "shorts", label: "Shorts" },
    ],
    women: [
      { value: "all", label: "All Women's" },
      { value: "tops", label: "Tops" },
      { value: "dresses", label: "Dresses" },
      { value: "skirts", label: "Skirts" },
      { value: "leggings", label: "Leggings" },
    ],
    couple: [
      { value: "all", label: "All Couple Wear" },
      { value: "matching-sets", label: "Matching Sets" },
      { value: "couple-tees", label: "Couple T-Shirts" },
      { value: "couple-outfits", label: "Couple Outfits" },
    ],
    accessory: [
      { value: "all", label: "All Accessories" },
      { value: "hats", label: "Hats" },
      { value: "bags", label: "Bags" },
      { value: "jewelry", label: "Jewelry" },
      { value: "scarves", label: "Scarves" },
    ],
  };

  useEffect(() => {
    if (categoryParam) {
      setFilter(categoryParam);
      setSubcategory("all");
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = "/api/products";
        
        if (filter !== "all") {
          url += `?category=${filter}`;
          if (subcategory !== "all") {
            url += `&subcategory=${subcategory}`;
          }
        } else if (subcategory !== "all") {
          url += `?subcategory=${subcategory}`;
        }

        const res = await api.get(url);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("COLLECTION FETCH ERROR:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, subcategory]);

  const categories = [
    { value: "all", label: "All" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "couple", label: "Couple" },
    { value: "accessory", label: "Accessories" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Collections</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover our curated collection of premium clothing for every style and occasion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* CATEGORY FILTER BUTTONS */}
        <div className="mb-8 flex gap-3 justify-center flex-wrap">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setFilter(c.value);
                setSubcategory("all");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                filter === c.value
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-400/50 scale-105"
                  : "bg-slate-800 text-gray-300 border border-slate-700 hover:border-blue-400 hover:shadow-md"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* SUBCATEGORY FILTER BUTTONS */}
        {filter !== "all" && subcategoryMap[filter] && (
          <div className="mb-12 flex gap-3 justify-center flex-wrap">
            {subcategoryMap[filter].map((sub) => (
              <button
                key={sub.value}
                onClick={() => setSubcategory(sub.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  subcategory === sub.value
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-400/50"
                    : "bg-slate-800 text-gray-400 border border-slate-700 hover:border-purple-400 hover:shadow-md"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-300 font-semibold">
              No products available in this category
            </p>
            <p className="text-gray-500 mt-2">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
