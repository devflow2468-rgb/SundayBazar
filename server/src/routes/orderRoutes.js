import express from "express";
import {
  createOrder,
  getMyOrders,
  cancelMyOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, restrictToAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createOrder).get(restrictToAdmin, getAllOrders);
router.route("/my-orders").get(getMyOrders);
router.route("/:id/cancel").put(cancelMyOrder);
router.route("/:id/status").put(restrictToAdmin, updateOrderStatus);

export default router;
