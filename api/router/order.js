import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatusById,
} from "../controllers/order.js";
import { authUser } from "../../middleware/authUser.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", authUser, createOrder);
router.get("/:orderId", authUser, getOrderById);
router.put("/:orderId", authUser, updateOrderStatusById);

export default router;
