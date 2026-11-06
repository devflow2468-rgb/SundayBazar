import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";

// @desc Get all products with search, filter, pagination
// @route GET /api/products
export const getProducts = async (req, res) => {
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
      // Find category by slug or id
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category.toLowerCase() });
        if (cat) query.category = cat._id;
      }
    }

    if (flashSale === "true") {
      query.isFlashSale = true;
    }

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

    return res.status(200).json({
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
};

// @desc Get single product
// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Create product
// @route POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      imageUrl,
      category,
      stock,
      isFlashSale,
      discountPercentage,
    } = req.body;

    if (!title || !description || !price || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, category, and image URL are required.",
      });
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
    return res.status(201).json({ success: true, message: "Product added successfully!", data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update product
// @route PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, message: "Product updated successfully!", data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete product
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
