import api from "../api/axios";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "@clerk/clerk-react";

const CheckoutButton = () => {
  const { getToken } = useAuth();
  const { cart, clearCart } = useCart();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const shippingCost = cart.reduce(
    (sum, item) => sum + (item.shippingCharge || 0),
    0
  );
  const total = subtotal + shippingCost;
const [address, setAddress] = useState({
  fullName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
});
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);


  const payNow = async () => {
    try {
      setError(null);
      // Validate address
      if (!address.fullName || !address.address || !address.city || !address.state || !address.pincode || !address.phone) {
        setError("Please fill all address fields");
        return;
      }

      setIsLoading(true);
      console.log("💳 Initiating payment for amount:", total);

      // Use interceptor - no need to pass token manually
      const { data } = await api.post("/api/payment/create", { amount: total });

      console.log("📦 Razorpay order created:", data);

      if (!data.id) {
        setError("Invalid Razorpay order ID - " + (data.message || "Unknown error"));
        console.error("Invalid order response:", data);
        setIsLoading(false);
        return;
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        setError("Razorpay not loaded. Please refresh the page.");
        console.error("Razorpay SDK not found");
        setIsLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        name: "Shikhar Clothing",
        description: `Payment for ${cart.length} item(s)`,

        method: {
          upi: true,
          card: true,
          netbanking: false,
          wallet: false,
        },

        handler: async (response) => {
          try {
            console.log("✅ Payment successful, verifying...", response);

            const verify = await api.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart,
              subtotal: subtotal,
              shippingCost: shippingCost,
              totalAmount: total,
              shippingAddress: address,
              paymentMethod: response.method || "Unknown"
            });

            console.log("✅ Verification response:", verify.data);

            if (verify.data.success) {
              clearCart();
              window.location.href = "/my-orders"; // Better UX redirect
            } else {
              setError("Verification failed: " + (verify.data.message || "Unknown error"));
              setIsLoading(false);
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            setError("Verification error: " + (err.response?.data?.message || err.message));
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment wizard closed by user");
            setIsLoading(false);
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone
        }
      };

      console.log("🎯 Opening Razorpay with options:", options);
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
          console.error("❌ Payment failed:", response.error.description);
          setError("Payment failed: " + response.error.description);
          setIsLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("❌ Payment initialization error:", err);
      setError("Payment initialization failed: " + (err.response?.data?.message || err.message));
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  return (
    <div className="w-full">
      <div className="bg-gray-50 rounded-2xl p-6 space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Delivery Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={address.fullName}
            onChange={handleAddressChange}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address.address}
            onChange={handleAddressChange}
            className="col-span-1 md:col-span-2 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleAddressChange}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleAddressChange}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900"
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleAddressChange}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={address.phone}
            onChange={handleAddressChange}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900"
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4 border border-red-200 text-sm">
          {error}
        </div>
      )}

      <button 
        onClick={payNow}
        disabled={isLoading}
        className={`w-full ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-400/50 hover:shadow-xl transition-all duration-300 transform ${isLoading ? '' : 'hover:scale-105'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ₹${total}`
        )}
      </button>
    </div>
  );
};

export default CheckoutButton;
