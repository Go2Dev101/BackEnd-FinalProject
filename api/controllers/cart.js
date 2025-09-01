import { Cart } from "../../models/Cart.js";

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

    if (items.length > 0) {
      cart.items = items;
    }

    await cart.save();
    res
      .status(200)
      .json({ error: false, cart, message: "Cart updated successfully!" });
  } catch (err) {
    next(err);
  }
};
