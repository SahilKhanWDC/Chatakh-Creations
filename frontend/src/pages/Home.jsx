import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

// Helper to get correct image URL - Cloudinary URLs are full URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiUrl}${imagePath}`;
};

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products?limit=4");
        setFeaturedProducts(
          Array.isArray(res.data) ? res.data.slice(0, 4) : [],
        );
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-[#fffaf6] text-gray-900 w-full">
      {/* HERO WITH WALLPAPER */}
      <section
        className="min-h-[70vh] sm:min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white relative overflow-hidden"
        style={{
          backgroundImage: "url(/IMG_8301.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* OVERLAY BACKGROUND */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[Montserrat] font-bold mb-4 sm:mb-6 leading-tight tracking-normal ">
            BORN TO STAND OUT
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-6 sm:mb-10 text-gray-300 leading-relaxed tracking-wider"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Handcrafted Fashion for those who choose bold over basic, Statement
            over silence.
          </p>

          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-[#ec0080] text-white font-bold rounded-full hover:bg-[#00aeb2] hover:text-[#fff6e9] transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-base sm:text-lg group"
          >
            Shop Now
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-[#fff6e9] border-t border-[#fce4f3]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-xs text-pink-500 font-semibold tracking-[0.2em] uppercase mb-2">
              New Arrivals
            </p>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ">
              Featured Collection
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#ec0080] mx-auto"></div>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-[#ec0080]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12">
                {featuredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-[#f9b8df] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="relative overflow-hidden bg-slate-700 aspect-square">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? getImageUrl(product.images[0])
                            : "/placeholder.png"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    </div>

                    <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-[#ec0080] transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center">
                        <div className="bg-[#fce4f3] text-[#ec0080] px-2 sm:px-3 py-1 rounded-full text-xs font-medium border border-[#f9b8df]">
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
                  className="inline-flex items-center justify-center px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-[#ec0080] text-[#fff6e9] hover:text-[#fff6e9] font-semibold rounded-full hover:bg-[#00aeb2] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-base sm:text-lg group tracking-wide"
                >
                  The Threads of Aura
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* COLLECTION CATEGORIES */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-[#f5ede1]">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-[#ec0080] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Browse
            </p>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Shop by Category
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#ec0080] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 md:gap-8">
            <CategoryCard title="Men" category="men" delay="0" />
            <CategoryCard title="Women" category="women" delay="100" />
            <CategoryCard title="Couple" category="couple" delay="200" />
            <CategoryCard
              title="Accessories"
              category="accessory"
              delay="300"
            />
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION */}
      {/* <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-[#f737a0] border-t border-[#fce4f3]">
        <div className="max-w-4xl mx-auto text-center w-full">
          <p className="text-[#fff6e9] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Connect With Us</p>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6 text-[#fff6e9]">
            Follow Us on Instagram
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#fff6e9] mb-6 sm:mb-10">
            Stay updated with our latest collections and exclusive deals
          </p>
          <a
            href="https://www.instagram.com/chatakh_?igsh=N29yem16Y2hteGRr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-[#fff6e9] text-pink-500 font-semibold rounded-full hover:bg-[#00aeb2] hover:text-[#ffffff] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-base sm:text-lg group"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
            </svg>
            Follow @chatakh_
          </a>
        </div>
      </section> */}
      {/* INSTAGRAM SECTION */}
      <section className="relative overflow-hidden min-h-[400px] flex items-center py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 border-t border-[#fce4f3]">
      
      <div className="absolute inset-0 z-0 flex w-max animate-marquee">
        {/* First Image Set - Fixed with 25vw for desktop scaling */}
        <div className="flex w-max">
          <img src="/img4.jpeg" alt="Insta 1" className="h-full w-[100px] md:w-[25vw] shrink-0 object-cover" />
          <img src="/img3.jpeg" alt="Insta 2" className="h-full w-[100px] md:w-[25vw] shrink-0 object-cover" />
          <img src="/img2.jpeg" alt="Insta 3" className="h-full w-[100px] md:w-[25vw] shrink-0 object-cover" />
          <img src="/img1.jpeg" alt="Insta 4" className="h-full w-[100px] md:w-[25vw] shrink-0 object-cover" />
        </div>
        
        {/* Duplicated Image Set */}
        <div className="flex w-max">
          <img src="/img4.jpeg" alt="Insta 1" className="h-full w-[100px] md:w-[25vw] shrink-0 object-cover" />
          <img src="/img3.jpeg" alt="Insta 2" className="h-full w-[100px] md:w-[25vw] shrink-0 object-cover" />
          <img src="/img2.jpeg" alt="Insta 3" className="h-full w-[100px] md:w-[25vw] shrink-0 object-cover" />
          <img src="/img1.jpeg" alt="Insta 4" className="h-full w-[100px] md:w-[25vw] shrink-0 object-cover" />
        </div>
      </div>

      <div className="absolute inset-0 z-0 bg-gray-950/30"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        <p className="text-[#fff6e9] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          Connect With Us
        </p>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6 text-[#fff6e9]">
          Follow Us on Instagram
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#fff6e9] mb-6 sm:mb-10">
          Stay updated with our latest collections and exclusive deals
        </p>
        <a
          href="https://www.instagram.com/chatakh_?igsh=N29yem16Y2hteGRr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-[#fff6e9] text-pink-500 font-semibold rounded-full hover:bg-[#00aeb2] hover:text-[#ffffff] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-base sm:text-lg group"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
          </svg>
          Follow @chatakh_
        </a>
      </div>
    </section>

      {/* WHY US */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-[#fef9ec]">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-[#ec0080] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Our Promise
            </p>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Why Choose Us
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#ec0080] mx-auto"></div>
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
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-3 sm:px-4 md:px-6 bg-[#f5ede1]">
        <div className="max-w-4xl mx-auto text-center w-full">
          <p className="text-[#ec0080] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Limited Time
          </p>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 ">
            Transform Your Wardrobe Today
          </h2>

          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-[#ec0080] text-[#fff6e9] font-bold rounded-full hover:bg-[#00aeb2] hover:text-[#fff6e9] transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-base sm:text-lg group"
          >
            Start Shopping
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
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
    className={`group bg-[#00aeb2] border border-[#fce4f3] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-[#ec0080] hover:bg-[#fdf0f8] transition-all duration-300 hover:-translate-y-1`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#fff6e9] group-hover:text-[#ec0080] transition-colors duration-200 tracking-wide">
      {title}
    </h3>
    <span className="mt-3 w-8 h-0.5 bg-[#ec0080] opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
  </Link>
);

const FeatureCard = ({ title, text }) => (
  <div className="bg-[#f5ede1] border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-md hover:border-[#00aeb2] transition-all duration-300 hover:-translate-y-1">
    <div className="w-10 h-10 rounded-full bg-[#fef9ec] border border-[#00aeb2] flex items-center justify-center mb-4">
      <span className="w-3 h-3 rounded-full bg-[#00aeb2]"></span>
    </div>
    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
      {title}
    </h3>
    <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{text}</p>
  </div>
);

export default Home;
