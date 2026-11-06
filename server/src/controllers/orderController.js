import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

// @desc Customer: Place new order (COD)
// @route POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Aapki cart khali hai (Cart is empty)." });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: "Mukammal address aur postal code provide karein (Shipping details required).",
      });
    }

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = await Product.findById(item.product);
      if (!prod) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.title}` });
      }

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

    return res.status(201).json({
      success: true,
      message: "Order kamyabi se place ho gaya! (Order placed with Cash on Delivery).",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Customer: Get my orders
// @route GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Customer: Cancel my order (only if Pending)
// @route PUT /api/orders/:id/cancel
export const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order nahi mila." });
    }

    if (order.deliveryStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Aap yeh order cancel nahi kar sakte kyunki yeh '${order.deliveryStatus}' hai.`,
      });
    }

    // Restore stock back to products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.deliveryStatus = "Cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order kamyabi se Cancel ho gaya hai.",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: View all orders
// @route GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email createdAt")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update delivery status (Pending <-> Completed <-> Cancelled)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus, isPaid } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (typeof isPaid === "boolean") order.isPaid = isPaid;

    if (deliveryStatus === "Completed") {
      order.isPaid = true;
    }

    await order.save();
    return res.status(200).json({
      success: true,
      message: `Order status updated to '${order.deliveryStatus}'`,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
