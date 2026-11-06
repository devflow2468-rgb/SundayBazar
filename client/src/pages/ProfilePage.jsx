import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  User,
  Mail,
  Calendar,
  Shield,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Package,
} from "lucide-react";

export const ProfilePage = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        if (res.data.success) {
          setOrderCount(res.data.data.length);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrderStats();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-borderSoft p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#1B9425] font-extrabold text-3xl flex items-center justify-center border-4 border-emerald-50 shadow-inner">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-800">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-[#1B9425]">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> {user.email}
            </p>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate("/login");
            }}
            className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Account Info & Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Orders Card with Direct Link */}
        <Link
          to="/my-orders"
          className="bg-white p-5 rounded-2xl border border-borderSoft hover:border-[#1B9425] shadow-sm hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500">Total Orders</span>
            <div className="p-2 bg-emerald-50 text-[#1B9425] rounded-xl group-hover:bg-[#1B9425] group-hover:text-white transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">
            {loading ? "..." : orderCount}
          </div>
          <p className="text-[11px] text-[#1B9425] font-semibold mt-1 flex items-center gap-1">
            View & Manage Orders <ChevronRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Member Since Card */}
        <div className="bg-white p-5 rounded-2xl border border-borderSoft shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500">Member Since</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-800">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active Customer"}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Verified Sunday Bazar Member</p>
        </div>

        {/* Security & Verification */}
        <div className="bg-white p-5 rounded-2xl border border-borderSoft shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500">Security Status</span>
            <div className="p-2 bg-emerald-50 text-[#1B9425] rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-base font-bold text-[#1B9425]">
            100% Protected
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Single-Reg Gmail OTP Active</p>
        </div>
      </div>

      {/* Quick Navigation Action Tiles */}
      <div className="bg-white rounded-2xl border border-borderSoft p-4 shadow-sm divide-y divide-gray-100">
        <Link
          to="/my-orders"
          className="flex items-center justify-between p-3 hover:bg-emerald-50/60 rounded-xl transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-[#1B9425] rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">My Orders & Order History</p>
              <p className="text-xs text-gray-500">Track shipments, view recipient details & cancel pending orders</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        {user.role === "admin" && (
          <Link
            to="/admin"
            className="flex items-center justify-between p-3 hover:bg-emerald-50/60 rounded-xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Master Admin Control Panel</p>
                <p className="text-xs text-gray-500">Manage products, categories, registered users & dispatch orders</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        )}
      </div>
    </div>
  );
};
