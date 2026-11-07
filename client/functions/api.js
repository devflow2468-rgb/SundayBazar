// Sunday Bazar Backend - Netlify Serverless Function
// High-performance Express API connected to MongoDB Atlas

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();

// =================== DATABASE ===================
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://devflow2468_db_user:BufB1IOylUAgtgDi@cluster0.eqr3i86.mongodb.net/sunday_bazar?retryWrites=true&w=majority";

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (isConnecting) {
    while (mongoose.connection.readyState !== 1) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return;
  }
  try {
    isConnecting = true;
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("[Sunday Bazar] MongoDB Atlas Connected!");
  } catch (err) {
    console.error("[Sunday Bazar] DB Error:", err.message);
    throw err;
  } finally {
    isConnecting = false;
  }
};

// =================== MODELS ===================

// User Model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only Gmail allowed"],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String, select: false },
    otpExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Category Model
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true },
    itemCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

// Product Model
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: {
      type: Number,
      default: function () {
        return Math.round(this.price * 1.25);
      },
    },
    imageUrl: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, min: 0, default: 10 },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 24 },
    isFlashSale: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Order Model
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery (COD)",
      enum: ["Cash on Delivery (COD)"],
    },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

// =================== UTILS ===================

const sendOTPEmail = async (email, otp) => {
  console.log(`[SUNDAY BAZAR] OTP for ${email}: >>> ${otp} <<<`);

  const user = process.env.EMAIL_USER || "devflow2468@gmail.com";
  const pass = process.env.EMAIL_PASS || "ovmukktxwflapybr";

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `Sunday Bazar <${user}>`,
      to: email,
      subject: `[Sunday Bazar] Your Account Verification OTP: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 25px; border-radius: 8px;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1B9425; margin-top: 0;">Sunday Bazar</h2>
            <p style="color: #1e293b; font-size: 16px;">Assalam-o-Alaikum,</p>
            <p style="color: #475569; font-size: 15px;">Aapka verification OTP ye hai:</p>
            <div style="background: #f1fbf3; border: 2px dashed #1B9425; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #1B9425; margin: 20px 0; border-radius: 6px;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 13px;">Ye OTP 10 minute tak valid hai.</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("[Nodemailer Error]:", err.message);
    return false;
  }
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const secret = process.env.JWT_SECRET || "sunday_bazar_super_secure_jwt_secret_key_2026_production";
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    secret,
    { expiresIn: "7d" }
  );

  res.status(statusCode).json({
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

const protect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Please log in to continue." });
  }

  try {
    const secret = process.env.JWT_SECRET || "sunday_bazar_super_secure_jwt_secret_key_2026_production";
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found." });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
  }
};

const restrictToAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
};

// =================== EXPRESS APP ===================
const app = express();

// Path normalizer: handles /.netlify/functions/api, /api, or direct routes seamlessly
app.use((req, res, next) => {
  if (req.url.startsWith("/.netlify/functions/api")) {
    req.url = req.url.replace("/.netlify/functions/api", "/api");
  } else if (!req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  next();
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS - Allow Netlify frontend
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DB before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed. Check MongoDB Atlas cluster connection.",
      error: err.message,
    });
  }
});

// =================== ROUTES ===================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    brand: "Sunday Bazar (High Performance MERN)",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// --- AUTH ROUTES ---
app.post("/api/auth/register/request-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password required." });
    }
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      return res.status(400).json({ success: false, message: "Only Gmail (@gmail.com) allowed." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase(), isVerified: true });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        isExisting: true,
        message: "Email already registered! Please log in directly.",
      });
    }

    // Remove any previous unverified attempt
    await User.deleteMany({ email: email.toLowerCase(), isVerified: false });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const tempUser = new User({
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
      message: `Verification OTP sent to ${tempUser.email}. Check your Gmail inbox.`,
      email: tempUser.email,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/auth/register/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required." });

    const user = await User.findOne({
      email: email.toLowerCase(),
      isVerified: false,
    }).select("+otpCode +otpExpires +password");

    if (!user) return res.status(400).json({ success: false, message: "No pending registration found. Please register again." });
    if (user.otpCode !== otp.trim()) return res.status(400).json({ success: false, message: "Invalid OTP code. Please check your Gmail." });
    if (new Date() > user.otpExpires) return res.status(400).json({ success: false, message: "OTP expired. Please register again." });

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    sendTokenResponse(user, 201, res, "Registration successful! Welcome to Sunday Bazar.");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Account not found. Please register first." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password." });

    sendTokenResponse(user, 200, res, `Khush-Amdeed, ${user.name}! Login successful.`);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/auth/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/auth/logout", protect, (req, res) => {
  res.json({ success: true, message: "Logged out successfully from Sunday Bazar." });
});

// --- CATEGORY ROUTES ---
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    return res.json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/categories", protect, restrictToAdmin, async (req, res) => {
  try {
    const { name, slug, description, imageUrl } = req.body;
    if (!name || !imageUrl) return res.status(400).json({ success: false, message: "Name and image required." });
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await Category.create({ name, slug: generatedSlug, description, imageUrl });
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/categories/:id", protect, restrictToAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    return res.json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/categories/:id", protect, restrictToAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    return res.json({ success: true, message: "Category deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// --- PRODUCT ROUTES ---
app.get("/api/products", async (req, res) => {
  try {
    const { search, category, flashSale, sort, page = 1, limit = 40 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category.toLowerCase() });
        if (cat) query.category = cat._id;
      }
    }

    if (flashSale === "true") query.isFlashSale = true;

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    return res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/products", protect, restrictToAdmin, async (req, res) => {
  try {
    const { title, description, price, originalPrice, imageUrl, category, stock, isFlashSale, discountPercentage } = req.body;
    if (!title || !description || !price || !imageUrl || !category) {
      return res.status(400).json({ success: false, message: "Title, description, price, category, and image URL are required." });
    }
    const product = await Product.create({
      title,
      description,
      price,
      originalPrice: originalPrice || Math.round(price * 1.25),
      imageUrl,
      category,
      stock: stock || 10,
      isFlashSale: !!isFlashSale,
      discountPercentage: discountPercentage || 0,
    });
    const populated = await Product.findById(product._id).populate("category", "name slug");
    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/products/:id", protect, restrictToAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/products/:id", protect, restrictToAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, message: "Product deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// --- ORDER ROUTES ---
app.post("/api/orders", protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: "Cart is empty." });
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: "Complete shipping address required." });
    }

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = await Product.findById(item.product);
      if (!prod) return res.status(404).json({ success: false, message: `Product not found: ${item.title}` });
      totalPrice += prod.price * item.quantity;
      validatedItems.push({
        product: prod._id,
        title: prod.title,
        imageUrl: prod.imageUrl,
        price: prod.price,
        quantity: item.quantity,
      });
      prod.stock = Math.max(0, prod.stock - item.quantity);
      await prod.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      totalPrice,
      shippingAddress,
      deliveryStatus: "Pending",
      paymentMethod: "Cash on Delivery (COD)",
      isPaid: false,
    });
    return res.status(201).json({ success: true, message: "Order placed successfully! Cash on Delivery.", data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/orders/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/orders/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    if (order.deliveryStatus !== "Pending") {
      return res.status(400).json({ success: false, message: `Cannot cancel. Order is '${order.deliveryStatus}'.` });
    }
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    order.deliveryStatus = "Cancelled";
    await order.save();
    return res.json({ success: true, message: "Order cancelled successfully.", data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/orders", protect, restrictToAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email createdAt").sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/orders/:id/status", protect, restrictToAdmin, async (req, res) => {
  try {
    const { deliveryStatus, isPaid } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (typeof isPaid === "boolean") order.isPaid = isPaid;
    if (deliveryStatus === "Completed") order.isPaid = true;
    await order.save();
    return res.json({ success: true, message: `Order status: ${order.deliveryStatus}`, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// --- USER ROUTES ---
app.get("/api/users", protect, restrictToAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/users/:id", protect, restrictToAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/users/:id/role", protect, restrictToAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["customer", "admin"].includes(role)) return res.status(400).json({ success: false, message: "Invalid role." });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Export as Netlify serverless handler
export const handler = serverless(app);
