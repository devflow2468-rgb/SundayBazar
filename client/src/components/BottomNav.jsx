import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Grid, ShoppingBag, ShoppingCart, User, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const BottomNav = () => {
  const { user } = useAuth();
  const { totalCount } = useCart();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Categories", path: "/categories", icon: Grid },
    { name: "Sunday Deals", path: "/flash-sale", icon: ShoppingBag },
    { name: "Cart", path: "/cart", icon: ShoppingCart, badge: totalCount },
    {
      name: user ? (user.role === "admin" ? "Admin" : "Account") : "Login",
      path: user ? (user.role === "admin" ? "/admin" : "/account") : "/login",
      icon: user?.role === "admin" ? ShieldCheck : User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-borderSoft shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-lg md:max-w-2xl mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1 px-3 sm:px-4 rounded-xl transition-all ${
                isActive ? "text-[#1B9425] font-bold" : "text-slate-500 hover:text-slate-800"
              }`
            }
          >
            {({ isActive }) => {
              const Icon = item.icon;
              return (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -top-2 w-8 h-1 bg-[#1B9425] rounded-full"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}

                  <div className="relative">
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    </motion.div>

                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-[#1B9425] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] sm:text-xs mt-1 tracking-tight font-semibold">
                    {item.name}
                  </span>
                </>
              );
            }}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
