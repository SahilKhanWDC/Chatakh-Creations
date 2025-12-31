import { useEffect, useState } from "react";
import api from "../api/axios";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

const VITE_API_URL = "http://localhost:5000";

const AdminDashboard = () => {
  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const [images, setImages] = useState([]);
  // const token = await getToken();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
  });

  // Define subcategories for each category
  const subcategoryMap = {
    men: [
      { value: "shirts", label: "Shirts" },
      { value: "pants", label: "Pants" },
      { value: "tshirts", label: "T-Shirts" },
      { value: "shorts", label: "Shorts" },
    ],
    women: [
      { value: "tops", label: "Tops" },
      { value: "dresses", label: "Dresses" },
      { value: "skirts", label: "Skirts" },
      { value: "leggings", label: "Leggings" },
    ],
    couple: [
      { value: "matching-sets", label: "Matching Sets" },
      { value: "couple-tees", label: "Couple T-Shirts" },
      { value: "couple-outfits", label: "Couple Outfits" },
    ],
    accessory: [
      { value: "hats", label: "Hats" },
      { value: "bags", label: "Bags" },
      { value: "jewelry", label: "Jewelry" },
      { value: "scarves", label: "Scarves" },
    ],
  };

  const fetchAdminData = async () => {
    try {
      const token = await getToken();

      const [productsRes, ordersRes] = await Promise.all([
        api.get("/api/products"),
        api.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("ADMIN FETCH ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (user?.publicMetadata?.role !== "admin") return;

    fetchAdminData();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <p>Loading...</p>;

  if (!isSignedIn) return <h2>Please login</h2>;

  if (user.publicMetadata?.role !== "admin") {
    return <h2>Access denied</h2>;
  }

  /* ---------------- IMAGE UPLOAD ---------------- */
  const uploadImages = async (files) => {
    try {
      if (images.length + files.length > 8) {
        alert(`Maximum 8 images allowed. You have ${images.length} images already.`);
        return;
      }

      const token = await getToken();

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const res = await api.post("/api/products/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setImages([...images, ...res.data.imageUrls]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Image upload failed";
      console.error("UPLOAD ERROR:", errorMsg);
      alert(errorMsg);
    }
  };

  /* ---------------- CREATE PRODUCT ---------------- */
  const submit = async () => {
    if (!form.name || !form.description || !form.price || !form.stock) {
      alert("All fields are required");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {
      const token = await getToken();

      const { data } = await api.post(
        "/api/products",
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          sizes: ["S", "M", "L", "XL"],
          images: images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAdminData();
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        subcategory: "",
      });
      setImages([]);
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err.response?.data || err.message);
      alert("Product creation failed");
    }
  };

  /* ---------------- EDIT PRODUCT ---------------- */
  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      subcategory: p.subcategory || "",
    });
    setImages(p.images || []);
  };

  const update = async () => {
    if (images.length === 0) {
      alert("Please ensure at least one image is present");
      return;
    }

    const token = await getToken();

    await api.put(
      `/api/products/${editing}`,
      {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: images,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      subcategory: "",
    });
    setImages([]);
    await fetchAdminData();
  };

  /* ---------------- DELETE PRODUCT ---------------- */
  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    const token = await getToken();

    await api.delete(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchAdminData();
  };

  /* ---------------- UPDATE ORDER STATUS ---------------- */
  const updateStatus = async (orderId, status) => {
    const token = await getToken();

    await api.put(
      `/api/orders/${orderId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await fetchAdminData();
  };

  /* ---------------- APPROVE RETURN ---------------- */
  const approveReturn = async (orderId) => {
    const token = await getToken();

    try {
      await api.put(
        `/api/orders/${orderId}/approve-return`,
        { refundStatus: "Processed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Return request approved successfully");
      await fetchAdminData();
    } catch (err) {
      alert("Error approving return: " + (err.response?.data?.message || err.message));
    }
  };

  /* ---------------- REJECT RETURN ---------------- */
  const rejectReturn = async (orderId) => {
    const token = await getToken();

    try {
      await api.put(
        `/api/orders/${orderId}/reject-return`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Return request rejected successfully");
      await fetchAdminData();
    } catch (err) {
      alert("Error rejecting return: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage products and orders</p>
        </div>

        {/* ADD PRODUCT */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Add New Product</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
              placeholder="Stock Quantity"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
            >
              <option value="">Select Category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="couple">Couple</option>
              <option value="accessory">Accessory</option>
            </select>
            {form.category && (
              <select
                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              >
                <option value="">Select Sub-Category</option>
                {subcategoryMap[form.category]?.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <textarea
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 w-full mb-6 text-slate-900 font-medium"
            placeholder="Product Description"
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">Product Images (Max 8)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-slate-900 file:to-slate-800 file:text-white file:font-semibold file:cursor-pointer hover:file:from-slate-800 hover:file:to-slate-700 transition-all duration-300"
              onChange={(e) => uploadImages(Array.from(e.target.files || []))}
            />
            <p className="text-xs text-gray-500 mt-2">You can upload up to {8 - images.length} more image(s)</p>
            
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-900 mb-3">Uploaded Images ({images.length})</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-full aspect-square rounded-xl overflow-hidden shadow-md">
                        <img 
                          src={img.startsWith('http') ? img : `${VITE_API_URL}${img}`}
                          alt={`Preview ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-bold"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-500 text-center mt-1">Image {idx + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={submit}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-400/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            ✨ Add Product
          </button>
        </section>

        {/* EDIT PRODUCT */}
        {editing && (
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-blue-400">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Edit Product</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <input
                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
                placeholder="Stock Quantity"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
              <select
                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
              >
                <option value="">Select Category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="couple">Couple</option>
                <option value="accessory">Accessory</option>
              </select>
              {form.category && (
                <select
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 text-slate-900 font-medium"
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                >
                  <option value="">Select Sub-Category</option>
                  {subcategoryMap[form.category]?.map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <textarea
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900 transition-colors duration-300 w-full mb-6 text-slate-900 font-medium"
              placeholder="Product Description"
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Product Images (Max 8)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-slate-900 file:to-slate-800 file:text-white file:font-semibold file:cursor-pointer hover:file:from-slate-800 hover:file:to-slate-700 transition-all duration-300"
                onChange={(e) => uploadImages(Array.from(e.target.files || []))}
              />
              <p className="text-xs text-gray-500 mt-2">You can upload up to {8 - images.length} more image(s)</p>
              
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900 mb-3">Product Images ({images.length})</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="w-full aspect-square rounded-xl overflow-hidden shadow-md">
                          <img 
                            src={img.startsWith('http') ? img : `${VITE_API_URL}${img}`}
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-bold"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-1">Image {idx + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={update}
                className="flex-1 md:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-green-400/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                ✅ Save Changes
              </button>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", description: "", price: "", stock: "", category: "" });
                  setImages([]);
                }}
                className="flex-1 md:flex-none bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                ❌ Cancel
              </button>
            </div>
          </section>
        )}

        {/* PRODUCTS */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Products ({products.length})</h3>

          <div className="space-y-4">
            {products.length > 0 ? (
              products.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 rounded-2xl p-5 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 w-full md:flex-1">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 flex-none">
                      <img
                        src={
                          p.images && p.images.length > 0
                            ? `${VITE_API_URL}${p.images[0]}`
                            : "/placeholder.png"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-lg">{p.name}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{p.description}</p>
                      <p className="text-lg font-bold text-blue-400 mt-1">₹{p.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => startEdit(p)}
                      className="flex-1 md:flex-none px-6 py-2 border-2 border-blue-400 text-blue-400 rounded-xl font-semibold hover:bg-blue-400/20 transition-all duration-300"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => remove(p._id)}
                      className="flex-1 md:flex-none px-6 py-2 border-2 border-red-400 text-red-400 rounded-xl font-semibold hover:bg-red-400/20 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products yet</p>
              </div>
            )}
          </div>
        </section>

        {/* ORDERS */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Orders ({orders.length})</h3>

          <div className="space-y-6">
            {orders.length > 0 ? (
              orders.map((o) => (
                <div 
                  key={o._id} 
                  className={`rounded-2xl p-6 transition-all duration-300 ${
                    o.orderStatus === "Cancelled" 
                      ? "bg-red-50 border-2 border-red-300" 
                      : "bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <p className="font-bold text-slate-900 text-lg">Order #{o._id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">User: <span className="font-medium">{o.userId}</span></p>
                      <p className="text-sm text-gray-600 mt-1">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {o.returnRequest && o.returnRequest.status !== "None" && (
                        <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                          o.returnRequest.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : o.returnRequest.status === "Approved"
                            ? "bg-blue-200 text-blue-800"
                            : o.returnRequest.status === "Rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}>
                          🔄 Return: {o.returnRequest.status}
                        </span>
                      )}
                      <div className="w-full md:w-auto">
                        {o.orderStatus === "Cancelled" ? (
                          <span className="inline-block bg-red-200 text-red-800 px-6 py-2 rounded-full font-semibold">
                            ❌ CANCELLED
                          </span>
                        ) : (
                          <select
                          className="w-full md:w-auto border-2 border-gray-300 rounded-xl px-4 py-2 font-semibold text-slate-900 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                            value={o.orderStatus}
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">✅ Delivered</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-slate-900 mb-3">Items:</p>
                    <ul className="space-y-2">
                      {o.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex justify-between">
                          <span>{item.name} (Size: {item.size})</span>
                          <span className="font-semibold">₹{item.price} × {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* RETURN REQUEST DETAILS */}
                  {o.returnRequest && o.returnRequest.status !== "None" && (
                    <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-bold text-purple-900 mb-2">📋 Return Request Details</p>
                          <p className="text-sm text-gray-700"><span className="font-semibold">Reason:</span> {o.returnRequest.reason}</p>
                          <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Description:</span> {o.returnRequest.description}</p>
                          <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Refund Amount:</span> ₹{o.returnRequest.refundAmount}</p>
                          {o.returnRequest.requestedAt && (
                            <p className="text-sm text-gray-600 mt-1">Requested on: {new Date(o.returnRequest.requestedAt).toLocaleDateString('en-IN')}</p>
                          )}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          o.returnRequest.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : o.returnRequest.status === "Approved"
                            ? "bg-blue-200 text-blue-800"
                            : o.returnRequest.status === "Rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}>
                          {o.returnRequest.status}
                        </span>
                      </div>

                      {/* RETURN ACTION BUTTONS */}
                      {o.returnRequest.status === "Requested" && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => approveReturn(o._id)}
                            className="flex-1 px-4 py-2 bg-green-500/20 text-green-700 font-semibold rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/50"
                          >
                            ✅ Approve Return
                          </button>
                          <button
                            onClick={() => rejectReturn(o._id)}
                            className="flex-1 px-4 py-2 bg-red-500/20 text-red-700 font-semibold rounded-lg hover:bg-red-500/30 transition-all duration-300 border border-red-500/50"
                          >
                            ❌ Reject Return
                          </button>
                        </div>
                      )}

                      {o.returnRequest.refundStatus && (
                        <p className="text-sm text-gray-700 mt-3">
                          <span className="font-semibold">Refund Status:</span> <span className={`font-semibold ${
                            o.returnRequest.refundStatus === "Processed" ? "text-green-600" : "text-yellow-600"
                          }`}>{o.returnRequest.refundStatus}</span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-600">Payment Status</p>
                      <p className="font-bold text-blue-400">{o.paymentStatus || 'Paid'}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-600">Shipping</p>
                      <p className="font-semibold text-slate-900">₹40</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 col-span-2 md:col-span-1">
                      <p className="text-xs text-gray-600">Total</p>
                      <p className="font-bold text-2xl text-slate-900">₹{o.totalAmount}</p>
                    </div>
                  </div>

                  {/* PAYMENT INFORMATION */}
                  {o.paymentInfo && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mt-4">
                      <p className="text-sm font-bold text-blue-900 mb-3">💳 Payment Information</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Order ID</p>
                          <p className="font-mono text-sm font-semibold text-slate-900 break-all">{o.paymentInfo.razorpay_order_id || "N/A"}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Payment ID</p>
                          <p className="font-mono text-sm font-semibold text-slate-900 break-all">{o.paymentInfo.razorpay_payment_id || "N/A"}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Payment Method</p>
                          <p className="font-semibold text-slate-900">{o.paymentInfo.paymentMethod || "Unknown"}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Amount Paid</p>
                          <p className="font-bold text-green-600">₹{o.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {o.orderStatus === "Cancelled" && (
                    <p className="mt-4 text-sm text-red-600 font-semibold">⚠️ This order was cancelled by the user</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No orders yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
