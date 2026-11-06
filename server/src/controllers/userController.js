import { User } from "../models/User.js";

// @desc Admin: View all registered users
// @route GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Get user profile details
// @route GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Toggle user role (customer <-> admin)
// @route PUT /api/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["customer", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be 'customer' or 'admin'" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    return res.status(200).json({ success: true, message: "User role updated successfully", data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
