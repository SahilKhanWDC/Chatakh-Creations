import { Link } from "react-router-dom";
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link 
          to="/" 
          className="hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
        >
          <img 
            src="/logo.png" 
            alt="Chatakh Creations" 
            className="h-16 sm:h-20 md:h-24 w-auto -my-2 sm:-my-3 md:-my-4"
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center">
          <Link 
            to="/collections" 
            className="text-gray-700 font-medium hover:text-slate-900 transition-colors duration-200 relative group text-sm lg:text-base"
          >
            Collections
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/cart" 
            className="text-gray-700 font-medium hover:text-slate-900 transition-colors duration-200 relative group text-sm lg:text-base"
          >
            Cart
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <SignedIn>
            <Link 
              to="/my-orders" 
              className="text-gray-700 font-medium hover:text-slate-900 transition-colors duration-200 relative group text-sm lg:text-base"
            >
              Orders
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user?.publicMetadata?.role === "admin" && (
              <Link 
                to="/admin" 
                className="text-amber-600 font-semibold hover:text-amber-700 transition-colors duration-200 px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-sm lg:text-base"
              >
                Admin Panel
              </Link>
            )}

            <div className="ml-2 flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <Link 
              to="/login" 
              className="text-gray-700 font-medium hover:text-slate-900 transition-colors duration-200 text-sm lg:text-base"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base"
            >
              Sign Up
            </Link>
          </SignedOut>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-3">
          <SignedIn>
            <div className="scale-75 origin-right">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:scale-95"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            <Link 
              to="/collections" 
              className="text-gray-700 font-medium hover:text-slate-900 py-3 px-3 rounded-lg hover:bg-white transition-colors duration-200 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link 
              to="/cart" 
              className="text-gray-700 font-medium hover:text-slate-900 py-3 px-3 rounded-lg hover:bg-white transition-colors duration-200 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart
            </Link>
            <SignedIn>
              <Link 
                to="/my-orders" 
                className="text-gray-700 font-medium hover:text-slate-900 py-3 px-3 rounded-lg hover:bg-white transition-colors duration-200 text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
              </Link>
              {user?.publicMetadata?.role === "admin" && (
                <Link 
                  to="/admin" 
                  className="text-amber-600 font-semibold py-3 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors duration-200 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </SignedIn>
            <SignedOut>
              <Link 
                to="/login" 
                className="text-gray-700 font-medium py-3 px-3 rounded-lg hover:bg-white transition-colors duration-200 text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-white font-medium py-3 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors duration-200 text-base text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
