import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import api from "./services/api";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export function AppContent() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (e) {
      console.error("Categories fetch failed:", e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      {/* Desktop/Tablet Responsive Header */}
      <Header categories={categories} />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24 lg:pb-12">
        <Routes>
          <Route path="/" element={<HomePage categories={categories} />} />
          <Route path="/products" element={<ProductsPage categories={categories} />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route
            path="/flash-sale"
            element={<ProductsPage categories={categories} />}
          />
          <Route
            path="/categories"
            element={<ProductsPage categories={categories} />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Customer Dedicated Account Page */}
          <Route
            path="/account"
            element={
              <CustomerRoute>
                <ProfilePage />
              </CustomerRoute>
            }
          />

          {/* Customer Orders & Tracking Page */}
          <Route
            path="/my-orders"
            element={
              <CustomerRoute>
                <MyOrdersPage />
              </CustomerRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage
                  categories={categories}
                  refreshCategories={fetchCategories}
                />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Sticky Animated Bottom Navigation Bar (< 1024px) */}
      <BottomNav />

      {/* Desktop Footer */}
      <footer className="hidden lg:block bg-white border-t border-borderSoft py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-800">
              Sunday<span className="text-[#1B9425]">Bazar</span>
            </span>
            <span>— Pakistan's Premier Daraz-Inspired Online Bazar</span>
          </div>
          <div className="flex items-center gap-6 text-slate-600 font-medium">
            <span>Cash on Delivery (COD)</span>
            <span>100% Genuine Items</span>
            <span>MERN Stack Production Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
