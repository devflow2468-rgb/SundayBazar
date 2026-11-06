import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { sendOTPEmail } from "../utils/mailer.js";

// Helper to sign JWT & attach to HTTP-only cookie
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
};

// 1. Initiate Registration & Send OTP
export const requestRegisterOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide your Name, Gmail, and Password.",
      });
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      return res.status(400).json({
        success: false,
        message: "Only Gmail accounts (@gmail.com) are allowed for Sunday Bazar registration.",
      });
    }

    // SINGLE-REGISTRATION RULE: Enforced strictly in MongoDB
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        isExisting: true,
        message: "Yeh email pehle se registered hai! Kindly seedha Login karein (Email already exists. Please log in directly).",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save temporary or unverified user (or replace previous unverified attempt)
    let tempUser = await User.findOne({ email: email.toLowerCase() }).select("+otpCode +otpExpires");
    
    // We create an unverified entry with encrypted password
    tempUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      isVerified: false,
      otpCode: otp,
      otpExpires,
    });

    await tempUser.save();
    await sendOTPEmail(tempUser.email, otp);

    return res.status(200).json({
      success: true,
      message: `Verification OTP sent to ${tempUser.email}. Please verify to complete registration.`,
      email: tempUser.email,
    });
  } catch (error) {
    console.error("Register OTP error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while requesting OTP.",
    });
  }
};

// 2. Verify OTP & Finalize Registration
export const verifyOTPAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter your Gmail and the 6-digit OTP.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      isVerified: false,
    }).select("+otpCode +otpExpires +password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found for this email, or already verified. Please login.",
      });
    }

    if (user.otpCode !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Ghalat OTP Code hai (Invalid OTP). Please check your email or console.",
      });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP ki muddat khatam ho chuki hai (OTP has expired). Please register again.",
      });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    sendTokenResponse(user, 201, res, "Registration mubarak! Sunday Bazar account kamyabi se ban gaya.");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both Gmail address and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Yeh account mojood nahi hai. Pehle register karein (User not found).",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Ghalat password enter kiya hai (Invalid credentials).",
      });
    }

    sendTokenResponse(user, 200, res, `Khush-Amdeed, ${user.name}! Login successful.`);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Get Current Profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Logout
export const logout = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully from Sunday Bazar.",
  });
};
