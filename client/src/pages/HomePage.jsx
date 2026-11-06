import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HeroSlider } from "../components/HeroSlider";
import { FlashSaleSection } from "../components/FlashSaleSection";
import { ProductCard } from "../components/ProductCard";
import api from "../services/api";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

export const HomePage = ({ categories = [] }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/products?limit=30");
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Home products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* 4-5 Sliding Hero Promotional Banners */}
      <HeroSlider />

      {/* Trust Badges / Services row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-2">
        <div className="bg-white p-3.5 rounded-xl border border-borderSoft flex items-center gap-3 shadow-sm">
          <Truck className="w-6 h-6 text-[#1B9425] flex-shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">Nationwide COD</h4>
            <p className="text-[11px] text-gray-500">Pay cash upon delivery</p>
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-borderSoft flex items-center gap-3 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-[#1B9425] flex-shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">100% Genuine</h4>
            <p className="text-[11px] text-gray-500">Verified authentic items</p>
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-borderSoft flex items-center gap-3 shadow-sm">
          <RotateCcw className="w-6 h-6 text-[#1B9425] flex-shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">7 Days Return</h4>
            <p className="text-[11px] text-gray-500">Hassle-free guarantee</p>
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-borderSoft flex items-center gap-3 shadow-sm">
          <Headphones className="w-6 h-6 text-[#1B9425] flex-shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">24/7 Helpline</h4>
            <p className="text-[11px] text-gray-500">Fast customer support</p>
          </div>
        </div>
      </div>

      {/* Category Grid Section */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-borderSoft shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#1E293B]">
            Shop by Category
          </h2>
          <Link
            to="/categories"
            className="text-xs font-bold text-[#1B9425] hover:text-emerald-700 flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-2.5 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-emerald-500/20 group-hover:border-[#1B9425] transition-all">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#1B9425] line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Flash Sale Section with Countdown */}
      <FlashSaleSection products={products} />

      {/* All Bazar Products Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#1E293B]">
              Just For You
            </h2>
            <p className="text-xs text-gray-500">
              Hand-picked trending products for your daily shopping
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-[#1B9425] hover:underline flex items-center gap-1"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl h-64 animate-pulse border border-gray-200 p-4"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
