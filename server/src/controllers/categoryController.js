import { Category } from "../models/Category.js";

// @desc Get all categories
// @route GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single category
// @route GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Create category
// @route POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, imageUrl } = req.body;
    if (!name || !imageUrl) {
      return res.status(400).json({ success: false, message: "Name and image are required" });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await Category.create({
      name,
      slug: generatedSlug,
      description,
      imageUrl,
    });

    return res.status(201).json({ success: true, message: "Category created successfully", data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update category
// @route PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    return res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete category
// @route DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
