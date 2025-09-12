import { User } from "../../models/User.js";
import { Order } from "../../models/Order.js";
import { Zone } from "../../models/Zone.js";
import { calculateCart } from "../../service/cart.js";

// Create a new order
export const createOrder = async (req, res, next) => {
  const userId = req.user.user._id;

  try {
    const user = await User.findOne({ _id: userId }).populate(
      "cart.items.menuId"
    );

    if (!user) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }

    // Check cart is empty
    if (user.cart.items?.length < 1) {
      const error = new Error("Your cart is empty.");
      error.status = 400;
      return next(error);
    }

    const postalCode = user.address.postalCode;
    const zone = await Zone.findOne({ postalCodes: postalCode });
    if (!zone) {
      const error = new Error("Shipping zone not found!");
      error.status = 404;
      return next(error);
    }
    const summary = calculateCart(user.cart.items, zone.shippingFee);

    const order = await Order.create({
      userId: user._id,
      items: summary.items,
      totalAmount: summary.totalAmount,
      shippingFee: summary.shippingFee,
      grandTotal: summary.grandTotal,
      status: "pending",
    });

    res.status(201).json({
      error: false,
      order,
      message: "Order created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Get all orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName")
      .select("-items.menuId -__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      error: false,
      orders,
      message: "All Orders retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Get order by id
export const getOrderById = async (req, res, next) => {
  const userId = req.user.user._id;
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, userId })
      .populate("userId")
      .populate("items.menuId", "imageUrl -_id")

    if (!order) {
      const error = new Error("Order not found!");
      error.status = 404;
      return next(error);
    }
    res.status(200).json({
      error: false,
      order: {
        _id: order._id,
        email: order.userId.email,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingFee: order.shippingFee,
        grandTotal: order.grandTotal,
        createdAt: order.createdAt,
      },
      message: "Order retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Update order status by id
export const updateOrderStatusById = async (req, res, next) => {
  const userId = req.user.user._id;
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId, userId }).select(
      "-userId -items.menuId"
    );

    if (!order) {
      const error = new Error("Order not found!");
      error.status = 404;
      return next(error);
    }

    if (status !== undefined) order.status = status;

    await order.save();
    res.status(200).json({
      error: false,
      order,
      message: "Order updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};
