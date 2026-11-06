import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";
import { Order } from "./models/Order.js";

dotenv.config();

const categoriesData = [
  {
    name: "Electronics & Gadgets",
    slug: "electronics-gadgets",
    description: "Smartphones, Audio gear, Smartwatches, and Laptops with Sunday Bazar warranty.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Fashion & Apparel",
    slug: "fashion-apparel",
    description: "Traditional Kurta Shalwar, Western Casuals, Shoes, and Accessories.",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Home & Kitchen Bazar",
    slug: "home-kitchen-bazar",
    description: "Cookware, organizers, decorative lighting, and home essentials.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Skincare, perfumes, hair care, and grooming essentials.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Sports & Outdoor",
    slug: "sports-outdoor",
    description: "Cricket bats, gym gear, sportswear, and fitness trackers.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Groceries & Daily Essentials",
    slug: "groceries-daily-essentials",
    description: "Tea, spices, rice, snacks, and household cleaning supplies.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
  },
];

const generate100Products = (categories) => {
  const products = [];

  const catalogTemplates = [
    // Category 0: Electronics
    {
      catIndex: 0,
      templates: [
        { title: "Wireless Noise-Canceling Bluetooth Headphones Pro", price: 5499, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
        { title: "Ultra HD 4K Action Camera 60fps with Waterproof Case", price: 11999, img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60" },
        { title: "Smart Fitness Tracker Band with Heart Rate & SpO2", price: 3499, img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60" },
        { title: "Mechanical RGB Gaming Keyboard (Blue Switches)", price: 4299, img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60" },
        { title: "Ergonomic Optical Gaming Mouse with 7200 DPI", price: 1899, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60" },
        { title: "True Wireless Stereo Earbuds with Deep Bass & ENC", price: 2899, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60" },
        { title: "20000mAh Fast Charging Power Bank with Dual USB-C", price: 3999, img: "https://images.unsplash.com/photo-1609592807664-839556858e8e?w=500&auto=format&fit=crop&q=60" },
        { title: "Portable 360 Surround Sound Bluetooth Speaker (IPX7)", price: 4699, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60" },
        { title: "Full HD 1080p Streaming Webcam with Dual Mic", price: 3199, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60" },
        { title: "Fast Wireless Qi Charging Stand 15W for iPhone & Android", price: 2199, img: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&auto=format&fit=crop&q=60" },
      ]
    },
    // Category 1: Fashion
    {
      catIndex: 1,
      templates: [
        { title: "Premium Men's Cotton Kurta Shalwar Suit (Charcoal)", price: 3999, img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=60" },
        { title: "Women's Embroidered Lawn 3-Piece Stitched Suit", price: 4899, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60" },
        { title: "Genuine Leather Bi-fold Minimalist RFID Wallet", price: 1499, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60" },
        { title: "Breathable Lightweight Mesh Running Sneakers", price: 3299, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60" },
        { title: "Classic Stainless Steel Quartz Chronograph Watch", price: 5899, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=60" },
        { title: "UV400 Polarized Aviator Sunglasses with Metal Frame", price: 1299, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60" },
        { title: "Vintage Washed Denim Jacket for Unisex Styling", price: 3799, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60" },
        { title: "Casual Slim-Fit Chino Trousers (Khaki & Navy)", price: 2199, img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format&fit=crop&q=60" },
        { title: "Waterproof Travel Duffle Bag with Shoe Compartment", price: 2999, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60" },
      ]
    },
    // Category 2: Home & Kitchen
    {
      catIndex: 2,
      templates: [
        { title: "Non-Stick Granite Die-Cast Cookware Set (5 Pcs)", price: 8499, img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=60" },
        { title: "Stainless Steel Electric Rapid Boil Kettle 1.8L", price: 2499, img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&auto=format&fit=crop&q=60" },
        { title: "Multi-Functional 500W Food Processor & Blender", price: 6799, img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=60" },
        { title: "Aroma Essential Oil Diffuser with 7 LED Mood Lights", price: 1999, img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60" },
        { title: "Ergonomic Memory Foam Orthopedic Bed Pillow", price: 1899, img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=60" },
        { title: "Manual Espresso & Coffee Bean Grinder Stainless Steel", price: 2699, img: "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&auto=format&fit=crop&q=60" },
      ]
    },
    // Category 3: Beauty & Care
    {
      catIndex: 3,
      templates: [
        { title: "Pure Organic Vitamin C & Hyaluronic Acid Glow Serum 30ml", price: 1699, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60" },
        { title: "Natural Aloe Vera & Tea Tree Foaming Face Wash", price: 899, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60" },
        { title: "Professional Hair Dryer with Ionic Conditioning 2200W", price: 3499, img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=60" },
        { title: "Artisan Oud Wood & Amber Luxury Eau De Parfum 100ml", price: 4299, img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60" },
        { title: "Rechargeable Cordless Beard Trimmer & Hair Clipper", price: 2399, img: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60" },
      ]
    },
    // Category 4: Sports & Fitness
    {
      catIndex: 4,
      templates: [
        { title: "Tape Ball Tournament Cricket Bat Grade-A English Willow Wood", price: 2999, img: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=500&auto=format&fit=crop&q=60" },
        { title: "Non-Slip Eco-Friendly 6mm Dual Layer Yoga Mat", price: 1799, img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=60" },
        { title: "Adjustable Cast Iron Dumbbell Set (Pair 20KG)", price: 7999, img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=60" },
        { title: "Insulated Stainless Steel Gym Water Bottle 1000ml", price: 1299, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60" },
      ]
    },
    // Category 5: Groceries
    {
      catIndex: 5,
      templates: [
        { title: "Super Basmati Kernel Rice (Export Quality Aged 5KG)", price: 2150, img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60" },
        { title: "Premium Royal Black Tea Blend (Danedar 950g)", price: 1450, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60" },
        { title: "Pure Sidr Honey (Organic Beri Honey 500g Jar)", price: 1850, img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60" },
        { title: "Hand-Picked Roasted California Almonds 500g", price: 1650, img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=60" },
      ]
    }
  ];

  let idCounter = 1;

  // We loop to build 105 total products for complete realistic demo
  while (products.length < 105) {
    for (const group of catalogTemplates) {
      const categoryId = categories[group.catIndex]._id;
      for (const t of group.templates) {
        if (products.length >= 105) break;

        const isFlash = products.length % 3 === 0;
        const discount = isFlash ? Math.floor(Math.random() * 35) + 15 : 0;
        const finalPrice = isFlash ? Math.round(t.price * (1 - discount / 100)) : t.price;

        products.push({
          title: products.length < 34 ? t.title : `${t.title} [Edition ${Math.floor(idCounter / 30) + 1} - Model #${idCounter}]`,
          description: `Authentic Sunday Bazar item. 100% verified genuine quality with Cash on Delivery across Pakistan. Model ID SB-${1000 + idCounter}. Comes with easy 7-day returns policy.`,
          price: finalPrice,
          originalPrice: t.price + Math.round(t.price * 0.2),
          imageUrl: t.img,
          category: categoryId,
          stock: Math.floor(Math.random() * 85) + 15,
          rating: Number((4.1 + Math.random() * 0.8).toFixed(1)),
          reviewsCount: Math.floor(Math.random() * 220) + 12,
          isFlashSale: isFlash,
          discountPercentage: discount,
        });

        idCounter++;
      }
    }
  }

  return products;
};

export const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
    });
    console.log("Connected to MongoDB for Seeding...");

    // Clear old data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared existing collections.");

    // Create Admin and Customer Users
    const adminUser = await User.create({
      name: "Sunday Bazar Admin",
      email: "admin.sundaybazar@gmail.com",
      password: "adminPassword123!",
      role: "admin",
      isVerified: true,
    });

    const customerUser = await User.create({
      name: "Ahmed Khan",
      email: "ahmed.customer@gmail.com",
      password: "customerPass123!",
      role: "customer",
      isVerified: true,
    });

    console.log("Created Admin & Customer demo users.");

    // Create Categories
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`Inserted ${insertedCategories.length} Categories.`);

    // Generate and Insert 100+ Products
    const productsData = generate100Products(insertedCategories);
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`Inserted ${insertedProducts.length} Demo Products into MongoDB Atlas!`);

    // Create a demo Order
    await Order.create({
      user: customerUser._id,
      items: [
        {
          product: insertedProducts[0]._id,
          title: insertedProducts[0].title,
          imageUrl: insertedProducts[0].imageUrl,
          price: insertedProducts[0].price,
          quantity: 2,
        },
        {
          product: insertedProducts[1]._id,
          title: insertedProducts[1].title,
          imageUrl: insertedProducts[1].imageUrl,
          price: insertedProducts[1].price,
          quantity: 1,
        },
      ],
      totalPrice: insertedProducts[0].price * 2 + insertedProducts[1].price,
      shippingAddress: {
        fullName: "Ahmed Khan",
        phone: "+92 300 1234567",
        address: "House 45, Street 12, F-8/2",
        city: "Islamabad",
        postalCode: "44000",
      },
      deliveryStatus: "Pending",
      paymentMethod: "Cash on Delivery (COD)",
      isPaid: false,
    });

    console.log("Created Demo Order for COD testing.");
    console.log("\n>>> SEEDING COMPLETED SUCCESSFULLY! <<<");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

if (process.argv[1].endsWith("seed.js")) {
  seedDatabase();
}
