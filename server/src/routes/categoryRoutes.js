import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, restrictToAdmin } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getCategories).post(protect, restrictToAdmin, createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, restrictToAdmin, updateCategory)
  .delete(protect, restrictToAdmin, deleteCategory);

export default router;
