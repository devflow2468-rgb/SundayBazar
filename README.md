# Sunday Bazar - High-Performance MERN Stack E-Commerce Platform

A production-ready Daraz-inspired E-Commerce Web Application built with the complete MERN stack, featuring **Adaptive Responsive Navigation**, **Framer Motion Animations**, **Strict Single-Registration via Gmail OTP**, **MongoDB Atlas Connection Pooling**, and **Full CRUD Matrix for Products, Categories, Orders, and Users**.

---

## 🎨 Theme & Color Palette
- **Primary Brand Accent:** Vibrant Green (`#1B9425`) — Daraz orange theme ko replace karke fresh organic bazar theme di gayi hai.
- **Background & Surfaces:** Clean White (`#FFFFFF`) / Light Gray Surface (`#F8F9FA`).
- **Text & Borders:** Dark Slate (`#1E293B`) / Soft Border Gray (`#E2E8F0`).

---

## 📱 Adaptive Responsive Navigation Architecture
1. **Desktop & Laptop Screens (>= 1024px):**
   - Full top header with brand logo, dynamic search bar, category dropdown menu, real-time cart badge counter, and authenticated user dropdown.
2. **Tablet & Mobile Screens (< 1024px):**
   - Header collapses cleanly into a mobile-ergonomic view.
   - **Sticky Animated Bottom Navigation Bar** (`fixed bottom-0 left-0 right-0 lg:hidden`) powered by Framer Motion spring physics with active pill layout indicator.

---

## 🛡️ Cyber Security & Database (MongoDB Atlas)
- **Mongoose Connection Pooling:** `maxPoolSize: 20` for high-concurrency requests.
- **Password Security:** Salt rounds 12 with `bcryptjs`.
- **JWT Authentication:** Stored in secure HTTP-only cookies and local session headers.
- **NoSQL Injection & XSS Defense:** `express-mongo-sanitize` middleware.
- **Brute-Force Rate Limiting:** `express-rate-limit` on all registration and login routes.
- **Single-Registration Enforcer:** MongoDB checks email uniqueness before issuing OTP.

---

## 🚀 How to Run the Application

### 1. Configure MongoDB Atlas (.env)
File: `server/.env`
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas URI (Apna cluster URI yahan dalein):
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sunday_bazar?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=sunday_bazar_super_secure_jwt_secret_key_2026_production
JWT_EXPIRES_IN=7d

# Nodemailer Gmail Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Sunday Bazar <no-reply@sundaybazar.pk>
```
*(Note: Agar Gmail credentials nahi dalein ge toh OTP automatically **Backend Terminal Console** me print ho jaye ga testing ke liye!)*

### 2. Populate 100+ Products Demo Seeder
Server directory me ja kar run karein:
```bash
cd "server"
npm run seed
```

### 3. Run Backend Server
```bash
cd "server"
npm run dev
# Server running on http://localhost:5000
```

### 4. Run Frontend Client
Naye terminal me:
```bash
cd "client"
npm run dev
# Frontend running on http://localhost:5173
```

---

## 🔑 Default Seeded Demo Accounts
- **Admin Account:**
  - Email: `admin.sundaybazar@gmail.com`
  - Password: `adminPassword123!`
  - Access: Full Admin Dashboard (`/admin`), Product/Category CRUD, Order Status Toggle, User tracking.
- **Customer Account:**
  - Email: `ahmed.customer@gmail.com`
  - Password: `customerPass123!`
  - Access: Browsing, Instant Add-to-Cart, COD Checkout, My Orders (`/my-orders`).
