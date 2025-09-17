import { User } from "../../models/User.js";
import { Zone } from "../../models/Zone.js";
import { calculateCart } from "../../service/cart.js";

// Get cart
export const getCart = async (req, res, next) => {
  const userId = req.user.user._id;

  try {
    const user = await User.findOne({ _id: userId }).populate(
      "cart.menuId",
      "title price imageUrl durationDays"
    );

    if (!user) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      error: false,
      cart: user.cart,
      message: "Cart retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Update cart
export const updateCart = async (req, res, next) => {
  const userId = req.user.user._id;
  const { items } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }

    const newitems = items.map((item) => ({
      menuId: item.menuId._id,
      quantity: item.quantity,
      deliveryDate: item.deliveryDate,
    }));
    user.cart = newitems || [];

    await user.save();
    res.status(200).json({
      error: false,
      cart: user.cart,
      message: "Cart updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Cart summary
export const cartSummary = async (req, res, next) => {
  const userId = req.user.user._id;

  try {
    const user = await User.findOne({ _id: userId }).populate(
      "cart.menuId",
      "title price imageUrl"
    );

    if (!user) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }

    const { shippingFee, ...summary } = calculateCart(user.cart);

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
    const user = await User.findOne({ _id: userId }).populate(
      "cart.menuId",
      "title price"
    );

    if (!user) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }

    // Get shipping zone based on user's postal code
    const postalCode = user.address.postalCode;
    const zone = await Zone.findOne({ postalCodes: postalCode });

    if (!zone) {
      const error = new Error("Shipping zone not found!");
      error.status = 404;
      return next(error);
    }

    const { items, ...summary } = calculateCart(user.cart, zone.shippingFee);

    res.status(200).json({
      error: false,
      summary,
      message: "Cart shipping fee retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};
