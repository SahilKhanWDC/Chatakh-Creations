import { useEffect, useState } from "react";
import api from "../api/axios";
import { useUser, useAuth } from "@clerk/clerk-react";

const MyOrders = () => {
  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [returnForm, setReturnForm] = useState({ reason: "", description: "" });

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      
      const res = await api.get("/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = await getToken();
      
      const res = await api.put(
        `/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order cancelled successfully");
      fetchOrders(); // Refresh the list
    } catch (err) {
      alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReturnClick = (orderId) => {
    setSelectedOrderId(orderId);
    setReturnForm({ reason: "", description: "" });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async () => {
    if (!returnForm.reason || !returnForm.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = await getToken();
      
      await api.put(
        `/api/orders/${selectedOrderId}/return-request`,
        {
          reason: returnForm.reason,
          description: returnForm.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Return request submitted successfully");
      setShowReturnModal(false);
      fetchOrders(); // Refresh the list
    } catch (err) {
      alert("Failed to submit return request: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const initialFetch = async () => {
      await fetchOrders();
      setLoading(false);
    };

    initialFetch();
  }, [isSignedIn, user, getToken]);

  if (!isLoaded || loading) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (!isSignedIn) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Please login to view your orders</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 md:p-12 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-3">No orders yet</h2>
            <p className="text-gray-400">Start shopping and your orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300 ${
                  order.orderStatus === "Cancelled"
                    ? "bg-red-900/20 border-2 border-red-500/50"
                    : "bg-slate-800 border border-slate-700 hover:border-blue-400"
                }`}
              >
                {/* ORDER HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-700">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-lg font-bold text-white break-all">{order._id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        order.orderStatus === "Cancelled"
                          ? "bg-red-500/30 text-red-300 border border-red-500/50"
                          : order.orderStatus === "Delivered"
                          ? "bg-green-500/30 text-green-300 border border-green-500/50"
                          : order.orderStatus === "Shipped"
                          ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                          : "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* RETURN STATUS */}
                {order.returnRequest && order.returnRequest.status !== "None" && (
                  <div className="mb-6 p-4 rounded-lg bg-purple-900/30 border border-purple-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-purple-300">Return Request</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.returnRequest.status === "Completed"
                          ? "bg-green-500/30 text-green-300 border border-green-500/50"
                          : order.returnRequest.status === "Approved"
                          ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                          : order.returnRequest.status === "Rejected"
                          ? "bg-red-500/30 text-red-300 border border-red-500/50"
                          : "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                      }`}>
                        {order.returnRequest.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">Reason: {order.returnRequest.reason}</p>
                    <p className="text-sm text-gray-400">Refund Amount: ₹{order.returnRequest.refundAmount}</p>
                    {order.returnRequest.refundStatus && (
                      <p className="text-sm text-gray-400 mt-2">Refund Status: <span className={`font-semibold ${
                        order.returnRequest.refundStatus === "Processed" ? "text-green-400" : "text-yellow-400"
                      }`}>{order.returnRequest.refundStatus}</span></p>
                    )}
                  </div>
                )}

                {/* ORDER ITEMS */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-400 mb-4">Items</p>
                  <div className="space-y-3">
                    {order.items &&
                      order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg border border-slate-700">
                          <div>
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-sm text-gray-400">
                              Size: {item.size} | Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-blue-400">₹{item.price}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* ORDER DETAILS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-700">
                  <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-700">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                    <p className="font-semibold text-white text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-700">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Items</p>
                    <p className="font-semibold text-white text-sm mt-1">{order.items?.length || 0}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-700">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Payment</p>
                    <p className={`font-semibold text-sm mt-1 ${
                      order.paymentStatus === "Paid" ? "text-blue-400" : "text-yellow-400"
                    }`}>
                      {order.paymentStatus}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-700">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
                    <p className="font-bold text-blue-400 text-lg mt-1">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col md:flex-row gap-3">
                  {order.orderStatus === "Placed" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="flex-1 md:flex-none px-6 py-3 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-all duration-300 shadow-md hover:shadow-lg border border-red-500/50"
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {order.orderStatus === "Delivered" && (!order.returnRequest || order.returnRequest.status === "None") && (
                    <button
                      onClick={() => handleReturnClick(order._id)}
                      className="flex-1 md:flex-none px-6 py-3 bg-purple-500/20 text-purple-400 font-bold rounded-lg hover:bg-purple-500/30 transition-all duration-300 shadow-md hover:shadow-lg border border-purple-500/50"
                    >
                      Request Return
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RETURN REQUEST MODAL */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Request Return</h2>
            
            <div className="space-y-4 mb-6">
              {/* REASON SELECT */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Return Reason *</label>
                <select
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all"
                >
                  <option value="">Select a reason</option>
                  <option value="Defective Product">Defective Product</option>
                  <option value="Wrong Item Received">Wrong Item Received</option>
                  <option value="Not as Described">Not as Described</option>
                  <option value="Size/Fit Issue">Size/Fit Issue</option>
                  <option value="Changed Mind">Changed Mind</option>
                  <option value="Quality Issue">Quality Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* DESCRIPTION TEXTAREA */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Detailed Description *</label>
                <textarea
                  value={returnForm.description}
                  onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })}
                  placeholder="Please provide detailed information about why you want to return this order..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all resize-none h-32"
                />
              </div>

              {/* INFO */}
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  <span className="font-bold">Note:</span> Once you submit the return request, our team will review it. You'll receive a response within 2-3 business days.
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 px-4 py-3 bg-slate-700 text-gray-300 font-bold rounded-lg hover:bg-slate-600 transition-all duration-300 border border-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
