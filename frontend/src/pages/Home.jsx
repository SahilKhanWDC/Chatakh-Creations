import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const VITE_API_URL = "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products?limit=4");
        setFeaturedProducts(Array.isArray(res.data) ? res.data.slice(0, 4) : []);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-slate-950 text-gray-100 w-full">
      {/* HERO WITH WALLPAPER */}
      <section className="min-h-[70vh] sm:min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white relative overflow-hidden" style={{
        backgroundImage: `url('https://images.pexels.com/photos/1460884/pexels-photo-1460884.jpeg?_gl=1*15x69sw*_ga*OTE2MjY3NjkwLjE3NjA2Mzk4NzM.*_ga_8JE65Q40S6*czE3NjcxMTI1MDIkbzEwJGcxJHQxNzY3MTEzNjQyJGo1OSRsMCRoMA..')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* OVERLAY BACKGROUND */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight tracking-tight">
            Elevate Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-white">
              Style Game
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6 sm:mb-10 text-gray-300 leading-relaxed tracking-wider">
            Premium fashion for men, women, couples & accessories
          </p>

          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-base sm:text-lg group"
          >
            Shop Now
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white">Featured Collection</h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto"></div>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12">
                {featuredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-blue-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="relative overflow-hidden bg-slate-700 aspect-square">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? `${VITE_API_URL}${product.images[0]}`
                            : "/placeholder.png"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    </div>

                    <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
                      <h3 className="font-bold text-base sm:text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center">
                        <div className="bg-blue-500/20 text-blue-400 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/50">
                          In Stock
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/collections"
                  className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-base sm:text-lg group"
                >
                  View All Products
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* COLLECTION CATEGORIES */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white">Shop by Category</h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 md:gap-8">
            <CategoryCard title="Men" category="men" delay="0" />
            <CategoryCard title="Women" category="women" delay="100" />
            <CategoryCard title="Couple" category="couple" delay="200" />
            <CategoryCard title="Accessories" category="accessory" delay="300" />
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            Follow Us on Instagram
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-10">
            Stay updated with our latest collections and exclusive deals
          </p>
          <a
            href="https://www.instagram.com/chatakh_?igsh=N29yem16Y2hteGRr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-base sm:text-lg group"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
            </svg>
            Follow @chatakh_
          </a>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white">Why Choose Us</h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <FeatureCard 
              title="Premium Quality" 
              text="Hand-picked fabrics with meticulous attention to detail" 
            />
            <FeatureCard 
              title="Fast Delivery" 
              text="Reliable delivery across India with real-time tracking" 
            />
            <FeatureCard 
              title="Secure Payments" 
              text="100% secure transactions with trusted payment gateways" 
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10">
            Transform Your Wardrobe Today
          </h2>

          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-base sm:text-lg group"
          >
            Start Shopping
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

const CategoryCard = ({ title, category, delay }) => (
  <Link
    to={`/collections?category=${category}`}
    className={`group bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-md hover:shadow-2xl hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:-translate-y-2`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200 tracking-wider">
      {title}
    </h3>
  </Link>
);

const FeatureCard = ({ title, text }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-md hover:shadow-xl hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{text}</p>
  </div>
);

export default Home;
