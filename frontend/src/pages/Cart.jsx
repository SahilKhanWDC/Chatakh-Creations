import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import CheckoutButton from "../components/CheckoutButton";

const VITE_API_URL = "http://localhost:5000";

const Cart = () => {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-slate-950">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3 text-white">Your cart is empty</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Discover our amazing collection and add items to your cart
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-400/50 hover:shadow-xl"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-400">You have {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex gap-6 shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-300 group"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden rounded-xl bg-slate-700 w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? `${VITE_API_URL}${item.images[0]}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-400 mb-3">
                      {item.size && (
                        <span className="bg-slate-700 px-3 py-1 rounded-lg font-medium border border-slate-600">
                          Size: {item.size}
                        </span>
                      )}
                      <span className="bg-slate-700 px-3 py-1 rounded-lg font-medium border border-slate-600">
                        Qty: {item.qty || 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-blue-400">₹{item.price * (item.qty || 1)}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm border border-red-500/50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-blue-400 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-xl md:text-2xl font-bold text-white mb-6">
                <span>Total</span>
                <span className="text-blue-400">₹{total}</span>
              </div>

              <CheckoutButton />

              <Link
                to="/collections"
                className="block text-center mt-4 text-blue-400 font-semibold hover:text-blue-300 transition-colors py-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
