import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Package, Clock, CheckCircle2, XCircle, Ban } from "lucide-react";
import { Link } from "react-router-dom";

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Kya aap waqai is order ko Cancel karna chahte hain?")) {
      return;
    }

    setCancellingId(orderId);
    try {
      const res = await api.put(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, deliveryStatus: "Cancelled" } : o
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Order cancel nahi ho saka.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-5 rounded-2xl border border-borderSoft shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            My Orders
          </h1>
          <p className="text-xs text-gray-500">Track shipments, view ordered items & cancel pending orders</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-[#1B9425] rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold text-sm">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-borderSoft">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Abhi tak aapka koi order nahi hai!</p>
          <Link
            to="/"
            className="inline-block mt-4 px-5 py-2.5 bg-[#1B9425] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Start Shopping Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-borderSoft p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400">Order ID: </span>
                  <span className="font-mono font-bold text-slate-700">{order._id}</span>
                  <span className="text-gray-300 mx-2">•</span>
                  <span className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-semibold">{order.paymentMethod}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      order.deliveryStatus === "Completed"
                        ? "bg-green-100 text-green-700"
                        : order.deliveryStatus === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.deliveryStatus === "Completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : order.deliveryStatus === "Cancelled" ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {order.deliveryStatus}
                  </span>

                  {/* Cancel Button (Visible only if Pending) */}
                  {order.deliveryStatus === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="px-2.5 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1 transition"
                    >
                      <Ban className="w-3 h-3" />
                      {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-2">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-lg bg-gray-50 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#1B9425]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Shipping info */}
              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <div className="text-gray-500">
                  Deliver to: <strong className="text-slate-700">{order.shippingAddress?.fullName}</strong>, {order.shippingAddress?.address}, {order.shippingAddress?.city} ({order.shippingAddress?.postalCode})
                </div>
                <div className="font-extrabold text-sm sm:text-base text-slate-800">
                  Total Paid on Delivery:{" "}
                  <span className="text-[#1B9425]">
                    Rs. {order.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
