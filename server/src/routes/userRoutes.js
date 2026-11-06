import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../controllers/userController.js";
import { protect, restrictToAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, restrictToAdmin);

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById);
router.route("/:id/role").put(updateUserRole);

export default router;
