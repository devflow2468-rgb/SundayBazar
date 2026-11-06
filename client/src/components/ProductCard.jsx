import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-borderSoft overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
    >
      <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-[#1B9425] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            -{product.discountPercentage}% OFF
          </span>
        )}
        {product.stock <= 5 && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] text-emerald-700 font-medium uppercase tracking-wider mb-1 truncate">
            {product.category?.name || "Sunday Bazar"}
          </p>
          <Link
            to={`/products/${product._id}`}
            className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-[#1B9425] transition"
            title={product.title}
          >
            {product.title}
          </Link>

          <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-700">{product.rating || 4.5}</span>
            <span className="text-gray-400 text-[11px]">({product.reviewsCount || 24})</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#1B9425]">
                Rs. {product.price?.toLocaleString()}
              </span>
            </div>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through">
                Rs. {product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => addToCart(product, 1)}
            className="p-2 sm:px-3 sm:py-2 bg-emerald-50 hover:bg-[#1B9425] text-[#1B9425] hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-emerald-200"
            title="Instant Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
