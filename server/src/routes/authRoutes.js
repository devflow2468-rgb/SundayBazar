import express from "express";
import rateLimit from "express-rate-limit";
import {
  requestRegisterOTP,
  verifyOTPAndRegister,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Strict Rate Limiting on Authentication endpoints for brute-force defense
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, // 20 requests per 15 mins per IP
  message: {
    success: false,
    message: "Bohat ziyada koshishein hui hain. Baraye meherbani 15 minute baad dobara koshish karein (Too many requests, try again later).",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register/request-otp", authLimiter, requestRegisterOTP);
router.post("/register/verify-otp", authLimiter, verifyOTPAndRegister);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
