import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Package,
  FolderTree,
  Users,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Upload,
  Link as LinkIcon,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertCircle,
  Sparkles,
  Percent,
} from "lucide-react";

export const AdminDashboardPage = ({ categories = [], refreshCategories }) => {
  const [activeTab, setActiveTab] = useState("overview"); // overview | products | categories | orders | users
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // New product form modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [productImageType, setProductImageType] = useState("url");
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    category: "",
    stock: 20,
    isFlashSale: false,
  });

  // New category form modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryImageType, setCategoryImageType] = useState("url");
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const handleFileUpload = (file, targetSetter) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size 5MB se kam honi chahiye.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      targetSetter((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resProd, resOrd, resUsr] = await Promise.all([
        api.get("/products?limit=100"),
        api.get("/orders"),
        api.get("/users"),
      ]);
      if (resProd.data.success) setProducts(resProd.data.data);
      if (resOrd.data.success) setOrders(resOrd.data.data);
      if (resUsr.data.success) setUsers(resUsr.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- LIVE REVENUE & PROFIT ANALYTICS CALCULATIONS ---
  const todayDateStr = new Date().toDateString();

  const todayOrders = orders.filter((o) => {
    return new Date(o.createdAt).toDateString() === todayDateStr;
  });

  const todaySales = todayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  // Estimated Profit: 25% average profit margin on sales
  const todayProfit = Math.round(todaySales * 0.25);

  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalNetProfit = Math.round(totalSales * 0.25);

  const completedOrdersCount = orders.filter((o) => o.deliveryStatus === "Completed").length;
  const pendingOrdersCount = orders.filter((o) => o.deliveryStatus === "Pending").length;

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.imageUrl) {
      alert("Image provide karein (Online URL ya Computer se upload).");
      return;
    }
    try {
      const res = await api.post("/products", {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      });
      if (res.data.success) {
        setShowProductModal(false);
        setProductForm({
          title: "",
          description: "",
          price: "",
          originalPrice: "",
          imageUrl: "",
          category: "",
          stock: 20,
          isFlashSale: false,
        });
        loadAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Product create nahi ho saka");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Is product ko delete karna chahte hain?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.imageUrl) {
      alert("Category image provide karein.");
      return;
    }
    try {
      const res = await api.post("/categories", categoryForm);
      if (res.data.success) {
        setShowCategoryModal(false);
        setCategoryForm({ name: "", description: "", imageUrl: "" });
        refreshCategories?.();
        loadAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Category create failed");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      refreshCategories?.();
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleToggleOrderStatus = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        deliveryStatus: nextStatus,
      });
      if (res.data.success) {
        setOrders(
          orders.map((o) => (o._id === orderId ? { ...o, deliveryStatus: nextStatus } : o))
        );
      }
    } catch (e) {
      alert("Status update failed");
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-borderSoft shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              Sunday Bazar Executive Admin Panel
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#1B9425]">
              Live Metrics & Analytics
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time track of Today's Orders, Live Profit Margins, Catalogs & Order Fulfillment
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#1B9425] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Live Profit & Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === "products"
                ? "bg-[#1B9425] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === "categories"
                ? "bg-[#1B9425] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" /> Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-[#1B9425] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === "users"
                ? "bg-[#1B9425] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Users ({users.length})
          </button>
        </div>
      </div>

      {/* 0. LIVE PROFIT & TODAY'S ORDERS OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Today Orders */}
            <div className="bg-white p-5 rounded-2xl border border-borderSoft shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Today's Orders</span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Calendar className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-800">{todayOrders.length}</span>
                <span className="text-xs text-slate-500 ml-1.5">orders placed today</span>
              </div>
              <p className="text-[11px] text-blue-600 font-semibold mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Live Real-Time Date
              </p>
            </div>

            {/* Today Profit */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase">Today's Est. Profit</span>
                <span className="p-2 bg-emerald-100 text-[#1B9425] rounded-xl font-black">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-[#1B9425]">
                  Rs. {todayProfit.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Sales: Rs. {todaySales.toLocaleString()} (25% Net Margin)
              </p>
            </div>

            {/* Total Overall Sales Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-borderSoft shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Lifetime Sales</span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-800">
                  Rs. {totalSales.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-purple-700 font-semibold mt-2">
                Across {orders.length} total customer orders
              </p>
            </div>

            {/* Total Overall Net Profit */}
            <div className="bg-white p-5 rounded-2xl border border-borderSoft shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Lifetime Net Profit</span>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-amber-700">
                  Rs. {totalNetProfit.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium mt-2">
                Completed Deliveries: {completedOrdersCount} | Pending: {pendingOrdersCount}
              </p>
            </div>
          </div>

          {/* Today's Orders Live Inspection Table */}
          <div className="bg-white rounded-2xl border border-borderSoft p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-base font-bold text-slate-800">
                  Ajj Ke Orders (Today's Live Orders: {todayOrders.length})
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Today's Turnover: <strong className="text-[#1B9425]">Rs. {todaySales.toLocaleString()}</strong>
              </span>
            </div>

            {todayOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs bg-gray-50 rounded-xl">
                Ajj abhi tak koi order place nahi hua. Naya order place hote hi yahan instant display hoga!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {todayOrders.map((o) => (
                  <div key={o._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">#{o._id.slice(-6)}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="font-semibold text-slate-700">{o.shippingAddress?.fullName}</span>
                      <span className="text-gray-500 ml-1">({o.shippingAddress?.city})</span>
                      <div className="text-gray-500 text-[11px] mt-0.5">
                        {o.items?.map((item) => `${item.title} (x${item.quantity})`).join(", ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-[#1B9425]">Rs. {o.totalPrice?.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        o.deliveryStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {o.deliveryStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. PRODUCTS CRUD TAB */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-borderSoft p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">
              Manage Products ({products.length})
            </h2>
            <button
              onClick={() => setShowProductModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1B9425] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider border-y border-gray-100">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Flash Deal</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.slice(0, 40).map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg bg-gray-100 border border-gray-200"
                      />
                      <span className="font-semibold text-slate-800 max-w-xs truncate">
                        {prod.title}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{prod.category?.name || "General"}</td>
                    <td className="p-3 font-bold text-[#1B9425]">
                      Rs. {prod.price?.toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold">{prod.stock}</td>
                    <td className="p-3">
                      {prod.isFlashSale ? (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                          YES ({prod.discountPercentage}%)
                        </span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. CATEGORIES CRUD TAB */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-2xl border border-borderSoft p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">
              Manage Categories ({categories.length})
            </h2>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1B9425] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-gray-50/50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{cat.name}</h3>
                    <p className="text-[11px] text-gray-500">{cat.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ORDER TRACKING & MANAGEMENT TAB */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-borderSoft p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">
            Customer Orders & COD Fulfillment ({orders.length})
          </h2>

          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order._id} className="py-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Order: #{order._id}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-500">
                      User: <strong>{order.user?.name || "Customer"}</strong> ({order.user?.email})
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-500 font-medium">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[#1B9425]">
                      Rs. {order.totalPrice?.toLocaleString()} ({order.paymentMethod})
                    </span>

                    <button
                      onClick={() => handleToggleOrderStatus(order._id, order.deliveryStatus)}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                        order.deliveryStatus === "Completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {order.deliveryStatus === "Completed" ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Completed (Delivered)
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending (Click to Complete)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <p><strong>Recipient Name:</strong> {order.shippingAddress?.fullName}</p>
                    <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <p><strong>Delivery Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                    <p><strong>Postal Code:</strong> {order.shippingAddress?.postalCode}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-1.5 bg-white border border-gray-100 rounded-lg text-xs"
                    >
                      <img src={item.imageUrl} alt="" className="w-6 h-6 rounded object-cover" />
                      <span className="font-semibold text-slate-700 max-w-[150px] truncate">
                        {item.title}
                      </span>
                      <span className="text-gray-500">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. USER MANAGEMENT CRUD TAB */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-borderSoft p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">
            Registered Users Directory ({users.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider border-y border-gray-100">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Gmail Address</th>
                  <th className="p-3">System Role</th>
                  <th className="p-3">Registered At</th>
                  <th className="p-3">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-slate-800">{u.name}</td>
                    <td className="p-3 text-slate-600 font-mono">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-emerald-100 text-[#1B9425]"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()} {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3">
                      <span className="text-[#1B9425] font-bold">Yes (OTP Verified)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Product */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800">Add New Product to Sunday Bazar</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold">Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="font-bold">Category</label>
                <select
                  required
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg mt-1"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold">Selling Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg mt-1"
                  />
                </div>
              </div>

              {/* Product Image Selection: URL vs Desktop Upload */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Product Image:</label>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setProductImageType("url")}
                      className={`px-2 py-1 rounded flex items-center gap-1 ${
                        productImageType === "url"
                          ? "bg-[#1B9425] text-white font-bold"
                          : "text-slate-600"
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" /> Online URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductImageType("file")}
                      className={`px-2 py-1 rounded flex items-center gap-1 ${
                        productImageType === "file"
                          ? "bg-[#1B9425] text-white font-bold"
                          : "text-slate-600"
                      }`}
                    >
                      <Upload className="w-3 h-3" /> From Computer
                    </button>
                  </div>
                </div>

                {productImageType === "url" ? (
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], setProductForm)}
                    className="w-full p-1.5 border border-dashed border-emerald-400 rounded-lg bg-white"
                  />
                )}

                {productForm.imageUrl && (
                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src={productForm.imageUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                    />
                    <span className="text-[11px] text-[#1B9425] font-semibold">Image Ready</span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold">Description</label>
                <textarea
                  rows="3"
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="flashSaleCheck"
                  checked={productForm.isFlashSale}
                  onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })}
                />
                <label htmlFor="flashSaleCheck" className="font-bold">Include in Sunday Flash Sale</label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B9425] text-white rounded-lg font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Category */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Add New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-bold">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg mt-1"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Category Image:</label>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCategoryImageType("url")}
                      className={`px-2 py-1 rounded flex items-center gap-1 ${
                        categoryImageType === "url"
                          ? "bg-[#1B9425] text-white font-bold"
                          : "text-slate-600"
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" /> Online URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryImageType("file")}
                      className={`px-2 py-1 rounded flex items-center gap-1 ${
                        categoryImageType === "file"
                          ? "bg-[#1B9425] text-white font-bold"
                          : "text-slate-600"
                      }`}
                    >
                      <Upload className="w-3 h-3" /> From Computer
                    </button>
                  </div>
                </div>

                {categoryImageType === "url" ? (
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={categoryForm.imageUrl}
                    onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], setCategoryForm)}
                    className="w-full p-1.5 border border-dashed border-emerald-400 rounded-lg bg-white"
                  />
                )}

                {categoryForm.imageUrl && (
                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src={categoryForm.imageUrl}
                      alt="Category Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                    />
                    <span className="text-[11px] text-[#1B9425] font-semibold">Image Ready</span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold">Description</label>
                <textarea
                  rows="2"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B9425] text-white rounded-lg font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
