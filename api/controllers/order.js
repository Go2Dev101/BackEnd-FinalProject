import { Cart } from "../../models/Cart.js";
import { Order } from "../../models/Order.js";
import { Zone } from "../../models/Zone.js";
import { calculateCart } from "../../service/cart.js";

// Create a new order
export const createOrder = async (req, res, next) => {
  const userId = req.user.user._id;

  try {
    const cart = await Cart.findOne({ userId })
      .populate("userId")
      .populate("items.menuId");

    if (!cart) {
      const error = new Error("Cart not found!");
      error.status = 404;
      return next(error);
    }
    const postalCode = cart.userId.address.postalCode;
    const zone = await Zone.findOne({ postalCodes: postalCode });
    if (!zone) {
      const error = new Error("Shipping zone not found!");
      error.status = 404;
      return next(error);
    }
    const summary = calculateCart(cart, zone.shippingFee);

    const order = await Order.create({
      userId: summary.userId,
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
      .populate("userId","fristName")
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
      .select("-items.menuId");

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
      },
      message: "Order retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};
