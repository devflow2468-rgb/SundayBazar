import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "Karachi",
    postalCode: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login?redirect=cart");
      return;
    }

    if (!address.fullName || !address.phone || !address.address || !address.postalCode) {
      setErrorMsg("Please fill in complete delivery address and postal code.");
      return;
    }

    setPlacingOrder(true);
    setErrorMsg("");

    try {
      const itemsPayload = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const res = await api.post("/orders", {
        items: itemsPayload,
        shippingAddress: address,
      });

      if (res.data.success) {
        clearCart();
        setOrderSuccess(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-2xl border border-emerald-200 shadow-md text-center">
        <div className="w-16 h-16 bg-emerald-100 text-[#1B9425] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Mubarak! Order Placed</h2>
        <p className="text-sm text-gray-600 mt-2">
          Aapka order kamyabi se record ho gaya hai with <strong>Cash on Delivery (COD)</strong>.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 my-6 text-left text-xs text-slate-700 space-y-1.5 border border-gray-100">
          <p><strong>Order ID:</strong> {orderSuccess._id}</p>
          <p><strong>Recipient:</strong> {orderSuccess.shippingAddress?.fullName} ({orderSuccess.shippingAddress?.phone})</p>
          <p><strong>Shipping Address:</strong> {orderSuccess.shippingAddress?.address}, {orderSuccess.shippingAddress?.city} ({orderSuccess.shippingAddress?.postalCode})</p>
          <p><strong>Total Amount to Pay:</strong> <span className="text-[#1B9425] font-bold">Rs. {orderSuccess.totalPrice?.toLocaleString()}</span></p>
          <p><strong>Payment Status:</strong> {orderSuccess.paymentMethod} (Unpaid until arrival)</p>
        </div>
        <div className="flex justify-center gap-4">
          <Link
            to="/my-orders"
            className="px-5 py-2.5 bg-[#1B9425] hover:bg-emerald-600 text-white rounded-xl font-bold text-xs"
          >
            Track My Orders
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-bold text-xs"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-2xl border border-borderSoft text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          🛒
        </div>
        <h2 className="text-lg font-bold text-slate-800">Aapki Cart Khali Hai (Cart is Empty)</h2>
        <p className="text-xs text-gray-500 mt-1">Explore Sunday Bazar deals and add products to your cart!</p>
        <Link
          to="/"
          className="inline-block mt-5 px-6 py-2.5 bg-[#1B9425] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
        Shopping Cart ({cartItems.length} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-xl border border-borderSoft flex items-center gap-4 shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg bg-gray-50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item._id}`}
                  className="text-sm font-bold text-slate-800 hover:text-[#1B9425] line-clamp-1"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-[#1B9425] font-extrabold mt-1">
                  Rs. {item.price?.toLocaleString()}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="px-2.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-slate-700"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="px-2.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-sm font-black text-slate-800">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & COD Checkout Form */}
        <div className="bg-white p-5 rounded-2xl border border-borderSoft shadow-sm h-fit space-y-5">
          <h2 className="text-base font-extrabold text-slate-800 pb-2 border-b border-gray-100">
            Order Summary & COD
          </h2>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">Rs. {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span className="text-[#1B9425] font-bold">FREE (Sunday Bazar Special)</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold">Cash on Delivery (COD)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-extrabold text-slate-900">
              <span>Grand Total:</span>
              <span className="text-[#1B9425]">Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200">
              {errorMsg}
            </p>
          )}

          {/* Shipping Form */}
          <form onSubmit={handleCheckout} className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase text-gray-500">Shipping Details:</h3>

            <div>
              <label className="text-[11px] font-bold text-slate-600">Full Name</label>
              <input
                type="text"
                required
                placeholder="Receiver's name"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:border-[#1B9425] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600">Mobile Phone</label>
              <input
                type="tel"
                required
                placeholder="e.g. 03001234567"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:border-[#1B9425] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600">Street Address & House #</label>
              <textarea
                rows="2"
                required
                placeholder="Complete street address"
                value={address.address}
                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:border-[#1B9425] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600">City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lahore / Karachi"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:border-[#1B9425] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600">Postal Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 75500"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:border-[#1B9425] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full mt-3 bg-[#1B9425] hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {placingOrder ? "Placing Order..." : "Confirm Cash on Delivery Order"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {!user && (
            <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded text-center">
              * Note: You will be prompted to login/register before finalizing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
