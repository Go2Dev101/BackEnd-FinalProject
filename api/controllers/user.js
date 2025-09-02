import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../../models/User.js";

// Create user
export const createUser = async (req, res, next) => {
  const { fullName, lastName, email, password } = req.body;

  if (!fullName || !lastName || !email || !password) {
    const error = new Error("All fields are required!");
    error.status = 400;
    return next(error);
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("Email already in use!");
      error.status = 409;
      return next(error);
    }

    const user = await User.create({ fullName, lastName, email, password });

    res.status(201).json({
      error: false,
      user,
      message: "User created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Login user
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required!");
    error.status = 400;
    return next(error);
  }

  try {
    const user = await User.findOne({ email });

    // Check email user exists
    if (!user) {
      const error = new Error("Invalid email or password!");
      error.status = 401;
      return next(error);
    }

    // Check password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password!");
      error.status = 401;
      return next(error);
    }

    // Generate JWT (token)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in HTTP-only cookie
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      error: false,
      message: "Login successful!",
      user: {
        _id: user._id,
        fullName: user.fullName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Edit user
export const editUser = async (req, res, next) => {
  const { userId } = req.params;
  const { fullName, lastName, phone, address } = req.body;

  if (req.user.user._id !== userId) {
    const error = new Error("You can only edit your own profile!");
    error.status = 403;
    return next(error);
  }

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }

    if (fullName) user.fullName = fullName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.status(200).json({
      error: false,
      user,
      message: "User updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Get user profile
export const getUserProfile = async (req, res, next) => {
  const userId = req.user.user._id; // Logged-in user's MongoDB _id

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      error: false,
      user,
      message: "User profile retrieved successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Logout user
export const logoutUser = (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
}
