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

    res.status(201).json({
      error: false,
      order: { summary, status: "pending" },
      message: "Order created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Get all orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      error: false,
      orders,
      message: "All Orders retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};
