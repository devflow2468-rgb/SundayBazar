import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Mail, User, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Info Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Step 1: Request OTP with Single-Registration Enforcer
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");

    if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
      setError("Sunday Bazar registration strictly requires a Gmail address (@gmail.com).");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register/request-otp", formData);
      if (res.data.success) {
        setInfoMsg(res.data.message);
        setStep(2); // Advance to OTP verification
      }
    } catch (err) {
      if (err.response?.data?.isExisting) {
        setError(
          "Single-Registration Rule: Yeh email pehle se registered hai! Seedha login karein."
        );
      } else {
        setError(err.response?.data?.message || "OTP request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register/verify-otp", {
        email: formData.email,
        otp,
      });

      if (res.data.success) {
        loginUser(res.data.user, res.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or Expired OTP.");
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
        <h1 className="text-2xl font-extrabold text-slate-800">
          {step === 1 ? "Create Account" : "Verify Gmail OTP"}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {step === 1
            ? "Sunday Bazar single-registration with Gmail OTP verification"
            : `Enter 6-digit OTP code sent to ${formData.email}`}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {infoMsg && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 text-[#1B9425] rounded-xl text-xs font-semibold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{infoMsg}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOTP} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ahmed Khan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:border-[#1B9425] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Gmail Address (@gmail.com)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:border-[#1B9425] focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              * Must be a valid Gmail account. Single-registration rule applies.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password (Min 6 chars)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:border-[#1B9425] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1B9425] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Checking Database & Generating OTP..." : "Send Verification OTP"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
            <span className="text-xs text-gray-500">Target Gmail:</span>
            <p className="text-sm font-bold text-slate-800">{formData.email}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
              6-Digit OTP Code
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-[0.5em] font-mono text-lg font-bold pl-8 pr-3 py-3 border-2 border-emerald-400/60 rounded-xl focus:border-[#1B9425] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-1">
              (For dev/local test: check backend terminal console if mail server not set)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1B9425] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Complete Registration"}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-xs text-slate-500 hover:text-slate-800 py-1"
          >
            ← Change Gmail or Info
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        Pehle se account bana hua hai?{" "}
        <Link to="/login" className="text-[#1B9425] font-bold hover:underline">
          Seedha Login Karein
        </Link>
      </div>
    </div>
  );
};
