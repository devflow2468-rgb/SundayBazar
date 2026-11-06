import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    title: "Sunday Mega Bachat Bazar",
    subtitle: "Upto 60% OFF on Top Tech, Household & Fashion Deals",
    bgGradient: "from-emerald-700 via-emerald-600 to-green-500",
    badge: "WEEKLY MEGA BAZAR",
    link: "/flash-sale",
    cta: "Shop Deals Now",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Fresh Arrival: Stitched Lawn & Kurtas",
    subtitle: "Premium Festive & Daily Wear with Cash on Delivery nationwide",
    bgGradient: "from-teal-800 via-teal-700 to-emerald-600",
    badge: "FASHION FIESTA",
    link: "/products?category=fashion-apparel",
    cta: "Explore Styles",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Modern Kitchen & Cookware Essentials",
    subtitle: "Upgrade your culinary space with granite non-stick sets",
    bgGradient: "from-slate-800 via-gray-800 to-emerald-800",
    badge: "SUNDAY HOME DEALS",
    link: "/products?category=home-kitchen-bazar",
    cta: "View Kitchenware",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Next-Gen Audio & Smart Electronics",
    subtitle: "Original brands, deep bass earbuds, fast power banks & watches",
    bgGradient: "from-emerald-900 via-green-800 to-teal-700",
    badge: "ELECTRONICS HUB",
    link: "/products?category=electronics-gadgets",
    cta: "Check Gadgets",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
  },
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg border border-borderSoft mb-8">
      <div className="relative h-[230px] sm:h-[320px] md:h-[380px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 bg-gradient-to-r ${banners[current].bgGradient} flex items-center justify-between p-6 sm:p-10 md:p-14 text-white`}
          >
            <div className="max-w-xl z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3">
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                {banners[current].badge}
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2 sm:mb-3">
                {banners[current].title}
              </h2>
              <p className="text-xs sm:text-base text-emerald-50 mb-5 max-w-md line-clamp-2">
                {banners[current].subtitle}
              </p>
              <Link
                to={banners[current].link}
                className="inline-flex items-center gap-2 bg-white text-[#1B9425] hover:bg-emerald-50 font-bold px-5 py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                {banners[current].cta}
              </Link>
            </div>

            <div className="hidden sm:block w-1/3 max-w-xs h-full relative z-10">
              <img
                src={banners[current].image}
                alt="Banner illustration"
                className="w-full h-full object-cover rounded-xl shadow-2xl opacity-90 border-2 border-white/20"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-slate-800 backdrop-blur-sm shadow-md transition"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-slate-800 backdrop-blur-sm shadow-md transition"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${
              current === idx ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
