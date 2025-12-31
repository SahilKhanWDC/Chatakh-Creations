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
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link 
          to="/" 
          className="font-black text-2xl md:text-3xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent hover:from-slate-800 hover:to-slate-600 transition-all duration-300"
        >
          Chatakh Creations
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 items-center">
          <Link 
            to="/collections" 
            className="text-gray-700 font-medium hover:text-slate-900 transition-colors duration-200 relative group"
          >
            Collections
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/cart" 
            className="text-gray-700 font-medium hover:text-slate-900 transition-colors duration-200 relative group"
          >
            Cart
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <SignedIn>
            <Link 
              to="/my-orders" 
              className="text-gray-700 font-medium hover:text-slate-900 transition-colors duration-200 relative group"
            >
              Orders
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user?.publicMetadata?.role === "admin" && (
              <Link 
                to="/admin" 
                className="text-amber-600 font-semibold hover:text-amber-700 transition-colors duration-200 px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100"
              >
                Admin Panel
              </Link>
            )}

            <div className="ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <Link 
              to="/login" 
              className="text-gray-700 font-medium hover:text-slate-900 transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Sign Up
            </Link>
          </SignedOut>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link 
              to="/collections" 
              className="text-gray-700 font-medium hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link 
              to="/cart" 
              className="text-gray-700 font-medium hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart
            </Link>
            <SignedIn>
              <Link 
                to="/my-orders" 
                className="text-gray-700 font-medium hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-white transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
              </Link>
              {user?.publicMetadata?.role === "admin" && (
                <Link 
                  to="/admin" 
                  className="text-amber-600 font-semibold py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </SignedIn>
            <SignedOut>
              <Link 
                to="/login" 
                className="text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-white transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-white font-medium py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors duration-200"
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
