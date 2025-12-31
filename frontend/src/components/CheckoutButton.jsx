import api from "../api/axios";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "@clerk/clerk-react";

const CheckoutButton = () => {
  const { getToken } = useAuth();
  const { cart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const [address, setAddress] = useState({
  fullName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
});



  const payNow = async () => {
    try {
      // Validate address
      if (!address.fullName || !address.address || !address.city || !address.state || !address.pincode || !address.phone) {
        alert("Please fill all address fields");
        return;
      }

      const token = await getToken();

      const { data } = await api.post(
        "/api/payment/create",
        { amount: total },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data.id) {
        alert("Invalid Razorpay order ID");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        name: "Shikhar Clothing",

        method: {
          upi: true,
          card: true,
          netbanking: false,
          wallet: false,
        },

        handler: async (response) => {
          try {
            const verify = await api.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart,
                totalAmount: total,
                shippingAddress : address,
                paymentMethod: response.method || "Unknown"
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verify.data.success) {
              alert("Order placed successfully");
              clearCart();
            } else {
              alert("Verification failed: " + (verify.data.message || "Unknown error"));
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Verification error: " + (err.response?.data?.message || err.message));
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment init failed");
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
      <button 
        onClick={payNow}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-400/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        Pay ₹{total}
      </button>
    </div>
  );
};

export default CheckoutButton;
