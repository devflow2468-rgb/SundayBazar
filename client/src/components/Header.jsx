import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Package,
  Home,
  Grid,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const Header = ({ categories = [] }) => {
  const { user, logoutUser } = useAuth();
  const { totalCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-borderSoft shadow-sm">
      {/* Top micro banner */}
      <div className="bg-[#1B9425] text-white text-xs py-1 px-4 text-center font-medium">
        ⚡ Sunday Bazar Mega Discounts! 100% Original Products with Cash on Delivery across Pakistan 🇵🇰
      </div>

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3 md:gap-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#1B9425] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              SB
            </div>
            <div>
              <span className="font-extrabold text-xl md:text-2xl tracking-tight text-[#1E293B]">
                Sunday<span className="text-[#1B9425]">Bazar</span>
              </span>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:block">
                Online Shopping Mall
              </p>
            </div>
          </Link>

          {/* Desktop Category Menu Button */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowCatDropdown(!showCatDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 transition"
            >
              <span>Categories</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showCatDropdown && (
              <div
                onMouseLeave={() => setShowCatDropdown(false)}
                className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
              >
                <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Browse Bazar
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${cat.slug}`}
                    onClick={() => setShowCatDropdown(false)}
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-[#1B9425] font-medium transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Search Bar (Desktop & Tablet) */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl relative"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search in Sunday Bazar (e.g. Headphones, Shoes, Kurta)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-emerald-500/40 focus:border-[#1B9425] focus:outline-none text-sm transition bg-white shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 bg-[#1B9425] hover:bg-emerald-600 text-white rounded-full transition shadow-sm"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop Right Controls (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-[#1B9425] transition flex items-center gap-1.5 font-medium text-sm"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#1B9425] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {totalCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            {/* User Account / Auth Controls */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#1B9425] px-2 py-1 rounded-lg transition"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1B9425] font-bold flex items-center justify-center border border-emerald-300">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 leading-tight">Welcome,</p>
                    <p className="text-sm font-semibold max-w-[100px] truncate">{user.name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div
                    onMouseLeave={() => setShowUserMenu(false)}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-sm"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-50 text-[#1B9425]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-[#1B9425]"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-emerald-50 hover:text-[#1B9425]"
                    >
                      <Package className="w-4 h-4" /> My Orders & Tracking
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#1B9425] font-semibold hover:bg-emerald-50"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logoutUser();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-[#1B9425] transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-[#1B9425] hover:bg-emerald-600 px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Quick Cart */}
          <div className="flex lg:hidden items-center">
            <Link to="/cart" className="relative p-2 text-slate-700">
              <ShoppingCart className="w-6 h-6" />
              {totalCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#1B9425] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop & Laptop Screen Main Navigation Bar (>= 1024px) */}
      <nav className="hidden lg:block bg-[#F8F9FA] border-t border-borderSoft/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-bold">
            <div className="flex items-center gap-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                    isActive
                      ? "bg-[#1B9425] text-white"
                      : "text-slate-700 hover:text-[#1B9425] hover:bg-white"
                  }`
                }
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                    isActive
                      ? "bg-[#1B9425] text-white"
                      : "text-slate-700 hover:text-[#1B9425] hover:bg-white"
                  }`
                }
              >
                <Grid className="w-3.5 h-3.5" />
                <span>All Products</span>
              </NavLink>

              <NavLink
                to="/flash-sale"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                    isActive
                      ? "bg-[#1B9425] text-white"
                      : "text-slate-700 hover:text-[#1B9425] hover:bg-white"
                  }`
                }
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Sunday Flash Deals</span>
              </NavLink>

              <NavLink
                to="/my-orders"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                    isActive
                      ? "bg-[#1B9425] text-white"
                      : "text-slate-700 hover:text-[#1B9425] hover:bg-white"
                  }`
                }
              >
                <Package className="w-3.5 h-3.5" />
                <span>Order Tracking</span>
              </NavLink>

              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                    isActive
                      ? "bg-[#1B9425] text-white"
                      : "text-slate-700 hover:text-[#1B9425] hover:bg-white"
                  }`
                }
              >
                <User className="w-3.5 h-3.5" />
                <span>My Account</span>
              </NavLink>

              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                      isActive
                        ? "bg-purple-700 text-white"
                        : "text-purple-700 hover:bg-purple-50"
                    }`
                  }
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </NavLink>
              )}
            </div>

            <div className="flex items-center gap-4 text-slate-500 font-semibold text-[11px]">
              <span className="flex items-center gap-1 text-[#1B9425]">
                ✓ Nationwide Cash on Delivery
              </span>
              <span>•</span>
              <span>7-Days Return Guarantee</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
