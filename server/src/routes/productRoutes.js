import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, restrictToAdmin } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, restrictToAdmin, createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, restrictToAdmin, updateProduct)
  .delete(protect, restrictToAdmin, deleteProduct);

export default router;
