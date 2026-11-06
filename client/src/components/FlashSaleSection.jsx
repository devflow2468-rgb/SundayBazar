import React, { useState, useEffect } from "react";
import { Zap, ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "./ProductCard";

export const FlashSaleSection = ({ products = [] }) => {
  // Countdown Timer Simulation (e.g., Sunday Deal ends in 8 hours)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashItems = products.filter((p) => p.isFlashSale).slice(0, 6);

  if (flashItems.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 border border-borderSoft shadow-sm mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-[#1B9425] rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 fill-[#1B9425]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1E293B]">
                Sunday Flash Sale
              </h2>
              <span className="text-[11px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full uppercase">
                Live
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Limited time offers with verified genuine discounts
            </p>
          </div>
        </div>

        {/* Countdown Timer Tiles */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden md:inline">
            Ending In:
          </span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-black">
            <span className="bg-[#1B9425] text-white px-2.5 py-1 rounded-md shadow-sm">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="font-bold text-slate-400">:</span>
            <span className="bg-[#1B9425] text-white px-2.5 py-1 rounded-md shadow-sm">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="font-bold text-slate-400">:</span>
            <span className="bg-[#1B9425] text-white px-2.5 py-1 rounded-md shadow-sm">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>

          <Link
            to="/flash-sale"
            className="ml-3 text-xs font-bold text-[#1B9425] hover:text-emerald-700 flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Responsive Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {flashItems.map((prod) => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>
    </section>
  );
};
