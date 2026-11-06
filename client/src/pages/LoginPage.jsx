import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        loginUser(res.data.user, res.data.token);
        navigate(redirect === "cart" ? "/cart" : "/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-6 sm:p-8 rounded-2xl border border-borderSoft shadow-sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#1B9425] text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-2 shadow-md">
          SB
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800">Khush-Amdeed</h1>
        <p className="text-xs text-gray-500 mt-1">Log in to your Sunday Bazar account</p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Gmail Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:border-[#1B9425] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:border-[#1B9425] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#1B9425] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? "Verifying Credentials..." : "Log In to Sunday Bazar"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500">
        Account nahi hai?{" "}
        <Link to="/register" className="text-[#1B9425] font-bold hover:underline">
          Naya Account Banayein (Sign Up with OTP)
        </Link>
      </div>
    </div>
  );
};
