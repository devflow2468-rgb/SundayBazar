import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="h-96 flex items-center justify-center font-bold text-slate-500">Loading Sunday Bazar Product...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 font-bold text-red-500">Product not found!</div>;
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#1B9425]">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#1B9425]">Products</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-borderSoft shadow-sm p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between space-y-5">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-emerald-50 text-[#1B9425] mb-2">
              {product.category?.name || "Official Sunday Bazar"}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-bold text-slate-800 ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">{product.reviewsCount} Customer Ratings</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-[#1B9425] font-semibold">100% Genuine</span>
            </div>

            {/* Price Box */}
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1B9425]">
                Rs. {product.price?.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.originalPrice?.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1.5">Description:</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-slate-700"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-slate-700"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500">
                Stock: <strong className="text-slate-700">{product.stock} available</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAdd}
                className="flex-1 bg-[#1B9425] hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Shopping Cart</span>
              </motion.button>
            </div>

            {addedNotice && (
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B9425] bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Added to your cart successfully!
              </div>
            )}

            {/* Trust details */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1B9425]" /> Cash on Delivery (COD) Eligible
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1B9425]" /> Verified Sunday Bazar Quality
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#1B9425]" /> 7-Day Easy Return Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
