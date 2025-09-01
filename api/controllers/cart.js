import { Cart } from "../../models/Cart.js";
import { Zone } from "../../models/Zone.js";
import { calculateCart } from "../../service/cart.js";

// Create a new cart
export const createCart = async (req, res, next) => {
  const userId = req.user.user._id;
  const { items = [] } = req.body;

  try {
    const existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      existingCart.items = items;
      const cart = await existingCart.save();
      return res
        .status(200)
        .json({ error: false, cart, message: "Cart updated successfully!" });
    }

    const cart = await Cart.create({ userId, items });
    res
      .status(201)
      .json({ error: false, cart, message: "Cart created successfully!" });
  } catch (err) {
    next(err);
  }
};

// Get cart
export const getCart = async (req, res, next) => {
  const userId = req.user.user._id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const error = new Error("Cart not found!");
      error.status = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ error: false, cart, message: "Cart retrieved successfully!" });
  } catch (err) {
    next(err);
  }
};

// Update cart
export const updateCart = async (req, res, next) => {
  const userId = req.user.user._id;
  const { items } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const error = new Error("Cart not found!");
      error.status = 404;
      return next(error);
    }

    cart.items = items || [];

    await cart.save();
    res
      .status(200)
      .json({ error: false, cart, message: "Cart updated successfully!" });
  } catch (err) {
    next(err);
  }
};

// Cart summary
export const cartSummary = async (req, res, next) => {
  const userId = req.user.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.menuId");
    if (!cart) {
      const error = new Error("Cart not found!");
      error.status = 404;
      return next(error);
    }

    const { shippingFee, ...summary } = calculateCart(cart);

    res.status(200).json({
      error: false,
      summary,
      message: "Cart summary retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Cart shipping fee
export const cartShippingFee = async (req, res, next) => {
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

    // Get shipping zone based on user's postal code
    const postalCode = cart.userId.address.postalCode;
    const zone = await Zone.findOne({ postalCodes: postalCode });
    if (!zone) {
      const error = new Error("Shipping zone not found!");
      error.status = 404;
      return next(error);
    }

    const { items, ...summary } = calculateCart(cart, zone.shippingFee);

    res.status(200).json({
      error: false,
      summary,
      message: "Cart shipping fee retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};
